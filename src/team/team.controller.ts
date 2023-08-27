// team/team.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  BadRequestException,
  Req,
  Res,
  HttpCode,
  HttpStatus,
  UseGuards,
  Param,
} from '@nestjs/common';
import { TeamService } from './team.service';
import { Team } from './team.entity'; // path may vary
import * as bcrypt from 'bcrypt';
import { userInfo } from 'os';
import { Response, Request } from 'express';
import { UnauthorizedException } from '@nestjs/common';
import { Tokens } from 'src/types';
import { AuthDto } from '../dto';
import { Http2ServerRequest } from 'http2';

import { AuthGuard } from '@nestjs/passport';
import { AtGuard, RtGuard } from 'src/guards';
import { GetCurrentUser } from 'src/decorators/get-current-user.decorator';
import { GetCurrentUserId } from 'src/decorators/get-current-user-id.decorator';
import { Public } from 'src/decorators/public.decorator';

@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Public()
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  signup(@Body() teamData: Partial<Team>): Promise<Tokens> {
    return this.teamService.signup(teamData);
  }

  @Public()
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  signinLocal(@Body() dto: AuthDto): Promise<Tokens> {
    return this.teamService.signin(dto);
  }

  //@UseGuards(AuthGuard('jwt'))
  @Get('logout/:team_id')
  @HttpCode(HttpStatus.OK)
  logout(@Param('team_id') team_id: number) {
    return this.teamService.logout(team_id);
  }

  // @Public()
  // @UseGuards(RtGuard)
  // @Post('refresh')
  // @HttpCode(HttpStatus.OK)
  // refreshTokens(
  //   @GetCurrentUserId() teamId: number,
  //   @GetCurrentUser('refreshToken') refreshToken: string,
  // ): Promise<Tokens> {
  //   return this.teamService.refreshTokens(teamId, refreshToken);
  // }

  @Get('/:team_id')
  async getPlayers(@Param('team_id') team_id: number) {
    console.log(team_id);
    const players = await this.teamService.findTeam(team_id);
    return players;
  }
}
