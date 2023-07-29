// team/team.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  BadRequestException,
  Req,
  Res,
} from '@nestjs/common';
import { TeamService } from './team.service';
import { Team } from './team.entity'; // path may vary
import * as bcrypt from 'bcrypt';
import { userInfo } from 'os';
import { JwtService } from '@nestjs/jwt';
import { Response, Request } from 'express';
import { UnauthorizedException } from '@nestjs/common';

@Controller('team')
export class TeamController {
  constructor(
    private readonly teamService: TeamService,
    private jwtService: JwtService,
  ) {}

  @Get()
  findAll(): Promise<Team[]> {
    return this.teamService.findAll();
  }

  @Post('register')
  register(@Body() teamData: Partial<Team>): Promise<Team> {
    return this.teamService.createTeam(teamData);
  }

  @Post('login')
  async login(
    @Body('full_name') full_name: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const team = await this.teamService.findOne(full_name);
    if (!team) {
      throw new BadRequestException('Invalid credentials');
    }
    const isMatch = await bcrypt.compare(password, team.password);
    if (!isMatch) {
      throw new BadRequestException('Invalid credentials');
    }

    const jwt = await this.jwtService.signAsync({ id: team.id });

    response.cookie('jwt', jwt, { httpOnly: true });

    return team;
    // You should return something here, like a JWT or user information
  }

  @Get('user')
  async user(@Req() request: Request) {
    console.log('yoooo');
    try {
      const cookie = request.cookies['jwt'];

      const data = await this.jwtService.verifyAsync(cookie);

      console.log(data);

      if (!data) {
        throw new UnauthorizedException();
      }

      const team = await this.teamService.findOneById(data['id']);

      console.log(team);

      const { password, admin_password, ...result } = team;

      return result;
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
