// team/team.service.ts

import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from './team.entity';
import * as bcrypt from 'bcrypt';
import { BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Tokens, JwtPayload } from 'src/types';
import { AuthDto } from 'src/dto';

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

  async getTokens(teamId: number): Promise<Tokens> {
    const jwtPayload: JwtPayload = {
      sub: teamId,
    };

    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: 'at-secret',
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: 'rt-secret',
        expiresIn: '7d',
      }),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
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

    const tokens = await this.getTokens(newTeam.id);
    await this.updateRtHash(newTeam.id, tokens.refresh_token);
    return tokens;
  }

  async signin(dto: AuthDto): Promise<Tokens> {
    const team = await this.teamRepository.findOne({
      where: { full_name: dto.full_name },
    });

    if (!team) throw new ForbiddenException('acces denied');

    const passwordMatches = await bcrypt.compare(dto.password, team.password);
    if (!passwordMatches) throw new ForbiddenException('Access Denied!');

    const tokens = await this.getTokens(team.id);
    await this.updateRtHash(team.id, tokens.refresh_token);
    return tokens;
  }

  async logout(teamId: number) {
    await this.teamRepository.update(teamId, { refresh_token: null });
  }

  async refreshTokens(teamId: number, rt: string) {
    const team = await this.teamRepository.findOne({ where: { id: teamId } });

    if (!team) throw new ForbiddenException('Acces Denied');

    const rtMatches = bcrypt.compare(rt, team.refresh_token);

    if (!rtMatches) throw new ForbiddenException('Acces Denied');

    const tokens = await this.getTokens(team.id);
    await this.updateRtHash(team.id, tokens.refresh_token);
    return tokens;
  }
}
