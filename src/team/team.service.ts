// team/team.service.ts

import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from './team.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Tokens, JwtPayload } from 'src/types';
import { AuthDto } from 'src/dto';
import { Storage } from '@google-cloud/storage';
import { CustomFile } from 'src/types/google-upload.type';

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

  async signup(data: Partial<Team>): Promise<Tokens> {
    data.password = await this.hashData(data.password);
    data.admin_password = await this.hashData(data.admin_password);

    const newTeam = await this.teamRepository.create(data);
    await this.teamRepository.save(newTeam);

    const tokens = await this.getTokens(newTeam.id, true);
    await this.updateRtHash(newTeam.id, tokens.refresh_token);
    return tokens;
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

  async findTeam(teamId: number): Promise<Team> {
    return this.teamRepository.findOne({ where: { id: teamId } });
  }

  async uploadFileToGCP(file: CustomFile, teamId: string): Promise<string> {
    const filename = `${teamId}-${Date.now()}-${file.originalname}`;
    const fileUpload = bucket.file(filename);

    const stream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    stream.on('error', (err) => {
      file.cloudStorageError = err;
      throw new Error(err.message);
    });

    stream.on('finish', () => {
      file.cloudStorageObject = filename;
      fileUpload.makePublic().then(() => {
        file.cloudStoragePublicUrl = this.getPublicUrl(filename);
      });
    });

    stream.end(file.buffer);
    return this.getPublicUrl(filename);
  }

  getPublicUrl(filename: string): string {
    return `https://storage.googleapis.com/${bucket.name}/${filename}`;
  }
}
