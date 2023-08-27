// team/team.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  BadRequestException,
  Req,
  Param,
  Delete,
  Res,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PenaltyService } from './penalty.service';
import { Penalty } from './penalty.entity';
import * as bcrypt from 'bcrypt';
import { userInfo } from 'os';
import { Response } from 'express';
import { UnauthorizedException } from '@nestjs/common';
import { GetCurrentUserId, Public } from 'src/decorators';
import { CreatePenaltyDto } from 'src/dto';

import { TeamGuard } from 'src/guards';

@Controller('penalty')
export class PenaltyController {
  constructor(
    private readonly penaltyService: PenaltyService, // here
  ) {}

  //@UseGuards(TeamGuard)
  //@Public()
  @Get('/:team_id')
  async getPenalties(@Req() req: Request, @Param('team_id') team_id: number) {
    const penalties = await this.penaltyService.findAllPenaltiesByTeam(
      req,
      team_id,
    );
    return penalties;
  }

  //@UseGuards(TeamGuard)
  @Post()
  async insertPenalty(
    @Body() createPenaltyDto: any,
    @GetCurrentUserId() team_id: number,
  ) {
    //const penalty = await this.penaltyService.createPenalty(createPenaltyDto);

    return [];
  }
}
