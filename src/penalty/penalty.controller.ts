// team/team.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  BadRequestException,
  Put,
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
import { CreatePenaltyDto, UpdatePenaltyDto } from 'src/dto';

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

  @Post('/:team_id')
  async insertPenalty(@Body() createPenaltyDto: CreatePenaltyDto) {
    console.log('penalty', createPenaltyDto);
    return this.penaltyService.insertPenalty(createPenaltyDto);
  }

  @Put('/:teamId')
  async updatePenalty(
    @Param('teamId') teamId: number,
    @Body() updatePenaltyDto: UpdatePenaltyDto,
  ): Promise<Penalty> {
    console.log(updatePenaltyDto);
    return await this.penaltyService.updatePenalty(updatePenaltyDto);
  }

  @Delete('/:penalty_id/team/:team_id')
  async deletePenalty(
    @Param('team_id') team_id: number,
    @Param('penalty_id') penalty_id: number,
  ): Promise<void> {
    return await this.penaltyService.deletePenalty(penalty_id);
  }
}
