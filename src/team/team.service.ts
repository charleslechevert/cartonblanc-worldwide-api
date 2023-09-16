// team/team.service.ts

import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from './team.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Tokens, JwtPayload, SignupResponse } from 'src/types';
import { AuthDto } from 'src/dto';
import { Storage } from '@google-cloud/storage';
import { CustomFile } from 'src/types/google-upload.type';
import * as nodemailer from 'nodemailer';
import * as speakeasy from 'speakeasy';
import { randomBytes } from 'crypto';
import { sendEmail } from 'src/utils/email/sendEmail';

const storage = new Storage({
  projectId: ' modified-glyph-397210',
  keyFilename: './src/assets/cgp.json',
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
      where: [{ email_team: dto.email }, { email_admin: dto.email }],
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

  // async refreshTokens(teamId: number, rt: string) {
  //   const team = await this.teamRepository.findOne({ where: { id: teamId } });

  //   if (!team) throw new ForbiddenException('Acces Denied');

  //   const rtMatches = bcrypt.compare(rt, team.refresh_token);

  //   if (!rtMatches) throw new ForbiddenException('Acces Denied');

  //   const decoded = this.jwtService.decode(rt);
  //   console.log(decoded)
  //   const isAdmin = decoded.isAdmin;

  //   const tokens = await this.getTokens(team.id);
  //   await this.updateRtHash(team.id, tokens.refresh_token);
  //   return tokens;
  // }

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

  // async uploadFileToGCP(file: CustomFile, team_id: number): Promise<string> {
  //   const filename = `logo-team-${team_id}`;
  //   const fileUpload = bucket.file(filename);

  //   const stream = fileUpload.createWriteStream({
  //     metadata: {
  //       contentType: file.mimetype,
  //     },
  //   });

  //   stream.on('error', (err) => {
  //     file.cloudStorageError = err;
  //     throw new Error(err.message);
  //   });

  //   stream.on('finish', () => {
  //     file.cloudStorageObject = filename;
  //     fileUpload.makePublic().then(() => {
  //       file.cloudStoragePublicUrl = this.getPublicUrl(filename);
  //     });
  //   });

  //   stream.end(file.buffer);
  //   return this.getPublicUrl(filename);
  // }

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

  requestPasswordReset = async (email: string) => {
    console.log(email);
    const team = await this.teamRepository.findOne({
      where: [{ email_team: email }, { email_admin: email }],
    });

    console.log(team);

    if (!team) throw new Error('Team does not exist');

    const resetToken = randomBytes(32).toString('hex');
    const hash = await bcrypt.hash(resetToken, 12);
    team.reset_password_token = hash;
    const currentDate = new Date();
    currentDate.setMinutes(currentDate.getMinutes() + 15);
    team.reset_password_token_date = currentDate;

    await this.teamRepository.save(team);

    const link = `http;//localhost:3001/passwordReset?token=${resetToken}&id=${team.id}`;

    sendEmail(
      team.email_team,
      'Demande de réinitialisation du mot de passe',
      { name: team.full_name, link: link },
      '../template/requestResetPassword.handlebars',
    );
    return link;
  };

  async resetPassword(userId: number, token: string, password: string) {
    const team = await this.teamRepository.findOne({
      where: { id: userId },
    });

    if (!team) {
      throw new Error('User not found');
    }

    const currentDate = new Date();

    // Check if the token has expired
    if (
      !team.reset_admin_password_token_date ||
      currentDate > team.reset_admin_password_token_date
    ) {
      throw new Error('Invalid or expired password reset token');
    }

    const isValid = await bcrypt.compare(
      token,
      team.reset_admin_password_token,
    );

    if (!isValid) {
      throw new Error('Invalid or expired password reset token');
    }

    const hash = await bcrypt.hash(password, 12);
    team.password = hash;
    team.reset_password_token = null;
    team.reset_admin_password_token_date = null; // clear the expiration date
    await this.teamRepository.save(team);
  }
}
