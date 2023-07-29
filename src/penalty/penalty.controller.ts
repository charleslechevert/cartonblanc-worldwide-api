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
import { PenaltyService } from './penalty.service';
import { Penalty } from './penalty.entity';
import * as bcrypt from 'bcrypt';
import { userInfo } from 'os';
import { JwtService } from '@nestjs/jwt';
import { Response, Request } from 'express';
import { UnauthorizedException } from '@nestjs/common';

@Controller('penalty')
export class PenaltyController {
  constructor(
    private readonly penaltyService: PenaltyService, // here
    private jwtService: JwtService,
  ) {}

  @Get()
  async getPenalties(@Req() request: Request) {
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
        console.log(team_id);
      } catch (error) {
        console.log('check');
        throw new UnauthorizedException();
      }
    } else {
      // If no token, use a default team_id
      team_id = 12071998; // Replace with your default team_id
    }

    // Get the penalties for the given team_id
    const penalties = await this.penaltyService.findAllPenaltiesByTeam(team_id); // and here

    return penalties;
  }
}
