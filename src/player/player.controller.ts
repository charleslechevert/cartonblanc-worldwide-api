// team/team.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  BadRequestException,
  Req,
  Res,
  Param,
  Put,
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
import { CreatePlayerDto, UpdatePlayerDto } from 'src/dto/player.dto';

@Controller('player')
export class PlayerController {
  constructor(
    private readonly playerService: PlayerService, // here
  ) {}

  //@UseGuards(TeamGuard)
  @Get('/:team_id')
  async getPlayers(@Param('team_id') team_id: number) {
    const players = await this.playerService.findAllPlayersByTeam(team_id);
    return players;
  }

  @Post('/:team_id')
  async insertPlayer(@Body() createPlayerDto: CreatePlayerDto) {
    return this.playerService.insertPlayer(createPlayerDto);
  }

  @Delete('/:player_id/team/:team_id')
  async deletePlayer(
    @Param('team_id') team_id: number,
    @Param('player_id') player_id: number,
  ): Promise<void> {
    return await this.playerService.deletePlayer(player_id);
  }

  @Put('/:teamId')
  async updatePlayer(
    @Param('teamId') teamId: number,
    @Body() updatePlayerDto: UpdatePlayerDto,
  ): Promise<Player> {
    console.log(updatePlayerDto);
    return await this.playerService.updatePlayer(updatePlayerDto);
  }
}
