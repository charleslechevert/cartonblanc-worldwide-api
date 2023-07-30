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
import { PlayerService } from './player.service';
import { Player } from './player.entity';
import * as bcrypt from 'bcrypt';
import { userInfo } from 'os';
import { Response, Request } from 'express';
import { UnauthorizedException } from '@nestjs/common';

@Controller('player')
export class PlayerController {
  constructor(
    private readonly playerService: PlayerService, // here
  ) {}

  @Get()
  async getPlayers(@Req() request: Request) {
    let team_id: number;

    // Get the players for the given team_id
    const players = await this.playerService.findAllPlayersByTeam(team_id); // and here

    return players;
  }
}
