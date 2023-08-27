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
} from '@nestjs/common';
import { RegisterService } from './register.service';
import { Register } from './register.entity';
import * as bcrypt from 'bcrypt';
import { userInfo } from 'os';
import { Response, Request } from 'express';
import { UnauthorizedException } from '@nestjs/common';
import { Public } from 'src/decorators/public.decorator';

@Controller('register')
export class RegisterController {
  constructor(
    private readonly registerService: RegisterService, // here
  ) {}

  @Get('/:team_id')
  async getRegisters(@Param('team_id') team_id: number) {
    // Get the registers for the given team_ids
    const registers = await this.registerService.findAllRegistersByTeam(
      team_id,
    );

    return registers;
  }

  @Public()
  @Get('demo')
  async getRegistersDemo() {
    // Get the registers for the given team_id
    const registers = await this.registerService.findAllRegistersByTeam(
      12071998,
    ); // and here

    return registers;
  }
}
