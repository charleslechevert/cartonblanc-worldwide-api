// team/team.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  BadRequestException,
  Req,
  Res,
  Param,
  UseGuards,
} from '@nestjs/common';
import { PlayerService } from './player.service';
import { Player } from './player.entity';
import * as bcrypt from 'bcrypt';
import { userInfo } from 'os';
import { Response, Request } from 'express';
import { UnauthorizedException } from '@nestjs/common';
import { TeamGuard } from 'src/guards';
import { Public } from 'src/decorators';

@Controller('player')
export class PlayerController {
  constructor(
    private readonly playerService: PlayerService, // here
  ) {}

  //@UseGuards(TeamGuard)
  @Public()
  @Get('/:team_id')
  async getPlayers(@Param('team_id') team_id: number) {
    const players = await this.playerService.findAllPlayersByTeam(team_id);
    return players;
  }
}
