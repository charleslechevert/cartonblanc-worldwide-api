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
import { JwtService } from '@nestjs/jwt';
import { Response, Request } from 'express';
import { UnauthorizedException } from '@nestjs/common';

@Controller('player')
export class PlayerController {
  constructor(
    private readonly playerService: PlayerService, // here
    private jwtService: JwtService,
  ) {}

  @Get()
  async getPlayers(@Req() request: Request) {
    let team_id: number;

    // Check if there's a JWT token
    const token = request.cookies['jwt'];
    console.log(token);
    if (token) {
      try {
        // If token exists, verify it and extract the team_id
        const data = await this.jwtService.verifyAsync(token);
        console.log(data);
        team_id = data['id'];
      } catch (error) {
        throw new UnauthorizedException();
      }
    } else {
      // If no token, use a default team_id
      team_id = 120798; // Replace with your default team_id
    }

    // Get the players for the given team_id
    const players = await this.playerService.findAllPlayersByTeam(team_id); // and here

    return players;
  }
}
