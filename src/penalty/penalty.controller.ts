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
import { Response, Request } from 'express';
import { UnauthorizedException } from '@nestjs/common';

@Controller('penalty')
export class PenaltyController {
  constructor(
    private readonly penaltyService: PenaltyService, // here
  ) {}

  @Get()
  async getPenalties(@Req() request: Request) {
    let team_id: number;
    const penalties = await this.penaltyService.findAllPenaltiesByTeam(team_id); // and here

    return penalties;
  }
}
