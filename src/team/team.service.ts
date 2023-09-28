// team/team.service.ts

import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from './team.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Tokens, JwtPayload, SignupResponse } from 'src/types';
import { AuthDto, UpdateTeamDto } from 'src/dto';
import { Storage } from '@google-cloud/storage';
import { CustomFile } from 'src/types/google-upload.type';
import * as nodemailer from 'nodemailer';
import * as speakeasy from 'speakeasy';
import { randomBytes } from 'crypto';
import { sendEmail } from 'src/utils/email/sendEmail';
import { ResetPasswordDto } from 'src/dto';
import { NotFoundException } from '@nestjs/common';
import { ConflictException } from '@nestjs/common';

const storage = new Storage({
  projectId: ' modified-glyph-397210',
  keyFilename: './src/cgp.json',
});
const bucket = storage.bucket('cbww');

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team)
    private teamRepository: Repository<Team>,
    private jwtService: JwtService,
  ) {}

  hashData(data: string) {
    return bcrypt.hash(data, 10);
  }

  async getTokens(teamId: number, isAdmin: boolean): Promise<Tokens> {
    const jwtPayload: JwtPayload = {
      sub: teamId,
      isAdmin: isAdmin,
    };

    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: 'at-secret',
        expiresIn: '1d',
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: 'rt-secret',
        expiresIn: '7d',
      }),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
      isAdmin: isAdmin,
    };
  }

  async verifyPassword(
    inputPassword: string,
    regularPassword: string,
    adminPassword: string,
  ): Promise<boolean> {
    const matchesRegular = await bcrypt.compare(inputPassword, regularPassword);
    const matchesAdmin = await bcrypt.compare(inputPassword, adminPassword);

    if (!matchesRegular && !matchesAdmin) {
      throw new ForbiddenException('Access Denied!');
    }

    return matchesAdmin; // Returns true if it's an admin password, false otherwise
  }

  async updateRtHash(teamId: number, rt: string) {
    const hash = await this.hashData(rt);
    await this.teamRepository.update(teamId, { refresh_token: hash });
  }

  async signup(data: Partial<Team>): Promise<SignupResponse> {
    // Check if email_team already exists in either email_team or email_admin columns
    const existingTeamEmail = await this.teamRepository.findOne({
      where: [{ email_team: data.email_team }],
    });
    if (existingTeamEmail) {
      throw new ConflictException("L'email de l'équipe existe déjà");
    }

    // Check if email_admin already exists in either email_team or email_admin columns

    data.password = await this.hashData(data.password);
    data.admin_password = await this.hashData(data.admin_password);

    const newTeam = await this.teamRepository.create(data);
    await this.teamRepository.save(newTeam);

    const tokens = await this.getTokens(newTeam.id, true);
    await this.updateRtHash(newTeam.id, tokens.refresh_token);
    return { ...tokens, team_id: newTeam.id };
  }

  async updateLogo(team_id: number, logoUrl: string): Promise<void> {
    await this.teamRepository.update(team_id, { logo: logoUrl });
  }

  async signin(dto: AuthDto): Promise<Tokens> {
    // Fetch the team with the given email or email_admin
    const team = await this.teamRepository.findOne({
      where: [{ email_team: dto.email }],
    });

    if (!team) throw new ForbiddenException('Access Denied!');

    const isAdmin = await this.verifyPassword(
      dto.password,
      team.password,
      team.admin_password,
    );

    const tokens = await this.getTokens(team.id, isAdmin);
    await this.updateRtHash(team.id, tokens.refresh_token);
    return tokens;
  }

  async logout(teamId: number) {
    await this.teamRepository.update(teamId, { refresh_token: null });
  }

  async getSignedUrlForTeamLogo(logoUrl: string): Promise<string> {
    const parts = logoUrl.split('/');
    const filename = parts[parts.length - 1];

    const fileReference = bucket.file(filename);

    const options = {
      version: 'v4' as const,
      action: 'read' as const,
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    };

    try {
      const signedUrls = await fileReference.getSignedUrl(options);
      return signedUrls[0];
    } catch (error) {
      throw new Error(`Failed to get signed URL. ${error.message}`);
    }
  }

  async findTeam(teamId: number): Promise<Team> {
    const team = await this.teamRepository.findOne({ where: { id: teamId } });

    if (team && team.logo && team.logo.startsWith('https://storage.')) {
      // Extract the file name from the URL
      const file = team.logo.split('/').pop();
      // Convert it to a signed URL
      team.logo = await this.getSignedUrlForTeamLogo(file);
    }

    return team;
  }

  async uploadFileToGCP(file: CustomFile, team_id: number): Promise<string> {
    const filename = `logo-team-${team_id}`;
    const fileUpload = bucket.file(filename);

    const streamFinished = new Promise<void>((resolve, reject) => {
      const stream = fileUpload.createWriteStream({
        metadata: {
          contentType: file.mimetype,
        },
      });

      stream.on('error', (err) => {
        reject(err);
      });

      stream.on('finish', () => {
        resolve();
      });

      stream.end(file.buffer);
    });

    await streamFinished;
    return this.getPublicUrl(filename);
  }

  getPublicUrl(filename: string): string {
    return `https://storage.googleapis.com/${bucket.name}/${filename}`;
  }

  generateOtp(secreteKey: string) {
    return speakeasy.totp({
      secret: secreteKey,
      step: 600,
      digits: 4,
      encoding: 'base32',
    });
  }

  verifyOtp(secret: string, otp: string) {
    return speakeasy.totp.verify({
      secret,
      token: otp,
      step: 600,
      digits: 4,
      encoding: 'base32',
    });
  }

  requestPasswordReset = async (email: string, admin: boolean) => {
    const team = await this.teamRepository.findOne({
      where: [{ email_team: email }],
    });

    if (!team) throw new Error('Team does not exist');

    const resetToken = randomBytes(32).toString('hex');
    const hash = await bcrypt.hash(resetToken, 12);

    const currentDate = new Date();
    currentDate.setMinutes(currentDate.getMinutes() + 15);

    // Modify token and token date based on the 'admin' parameter
    if (admin) {
      team.reset_admin_password_token = hash;
      team.reset_admin_password_token_date = currentDate;
    } else {
      team.reset_password_token = hash;
      team.reset_password_token_date = currentDate;
    }

    await this.teamRepository.save(team);

    // Append 'admin' parameter to the link
    const link = `${process.env.FRONTEND_URL}/passwordReset?token=${resetToken}&id=${team.id}&admin=${admin}`;

    sendEmail(
      team.email_team,
      'Demande de réinitialisation du mot de passe',
      { name: team.full_name, link: link },
      '../template/requestResetPassword.handlebars',
    );
    return link;
  };

  async resetPassword(dto: ResetPasswordDto) {
    const { team_id, token, password, admin } = dto;

    const team = await this.teamRepository.findOne({
      where: { id: team_id },
    });

    if (!team) {
      throw new Error('User not found');
    }

    const currentDate = new Date();

    if (admin) {
      // For admin password reset
      const isValidAdminToken = await bcrypt.compare(
        token,
        team.reset_admin_password_token,
      );

      if (
        isValidAdminToken &&
        currentDate <= team.reset_admin_password_token_date
      ) {
        // Check if new admin password is the same as the team's current password
        const isSameAsCurrentPassword = await bcrypt.compare(
          password,
          team.password,
        );
        if (isSameAsCurrentPassword) {
          throw new Error(
            "New admin password cannot be the same as the team's current password",
          );
        }

        const hash = await bcrypt.hash(password, 12);
        team.admin_password = hash; // Reset the admin password
        team.reset_admin_password_token = null; // Clear the reset token for admin
        team.reset_admin_password_token_date = null; // Clear the expiration date for admin
      } else {
        throw new Error('Invalid or expired admin password reset token');
      }
    } else {
      // For user password reset
      const isValidUserToken = await bcrypt.compare(
        token,
        team.reset_password_token,
      );

      if (isValidUserToken && currentDate <= team.reset_password_token_date) {
        // Check if new user password is the same as the team's admin password
        const isSameAsAdminPassword = await bcrypt.compare(
          password,
          team.admin_password,
        );
        if (isSameAsAdminPassword) {
          throw new Error(
            "New password cannot be the same as the team's admin password",
          );
        }

        const hash = await bcrypt.hash(password, 12);
        team.password = hash; // Reset the user password
        team.reset_password_token = null; // Clear the reset token for user
        team.reset_password_token_date = null; // Clear the expiration date for user
      } else {
        throw new Error('Invalid or expired user password reset token');
      }
    }

    await this.teamRepository.save(team);
  }

  async updateTeam(updateTeamInfoDto: UpdateTeamDto): Promise<Team> {
    // First, retrieve the existing team using the provided ID.
    const existingTeam = await this.teamRepository.findOne({
      where: { id: updateTeamInfoDto.id },
    });

    // If the team doesn't exist, throw an error.
    if (!existingTeam) {
      throw new NotFoundException(
        `Team with ID ${updateTeamInfoDto.id} not found.`,
      );
    }

    // Update the team details based on the DTO
    if (updateTeamInfoDto.objective !== undefined) {
      existingTeam.objective = updateTeamInfoDto.objective;
    }

    if (updateTeamInfoDto.sentence !== undefined) {
      existingTeam.sentence = updateTeamInfoDto.sentence;
    }

    if (updateTeamInfoDto.lydia_url !== undefined) {
      existingTeam.lydia_url = updateTeamInfoDto.lydia_url;
    }

    if (updateTeamInfoDto.full_name !== undefined) {
      existingTeam.full_name = updateTeamInfoDto.full_name;
    }

    if (updateTeamInfoDto.short_name !== undefined) {
      existingTeam.short_name = updateTeamInfoDto.short_name;
    }

    if (updateTeamInfoDto.color1 !== undefined) {
      existingTeam.color1 = updateTeamInfoDto.color1;
    }

    if (updateTeamInfoDto.color2 !== undefined) {
      existingTeam.color2 = updateTeamInfoDto.color2;
    }

    // Save the updated team
    const updatedTeam = await this.teamRepository.save(existingTeam);

    // Check if the team logo is stored in GCS and convert it to a signed URL if necessary
    if (updatedTeam.logo && updatedTeam.logo.startsWith('https://storage.')) {
      // Extract the file name from the URL
      const file = updatedTeam.logo.split('/').pop();
      // Convert it to a signed URL
      updatedTeam.logo = await this.getSignedUrlForTeamLogo(file);
    }

    // Return the updated team with the signed logo URL (if applicable)
    return updatedTeam;
  }
}
