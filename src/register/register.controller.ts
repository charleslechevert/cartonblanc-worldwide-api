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
import { RegisterService } from './register.service';
import { Register } from './register.entity';
import * as bcrypt from 'bcrypt';
import { userInfo } from 'os';
import { Response, Request } from 'express';
import { UnauthorizedException } from '@nestjs/common';

@Controller('register')
export class RegisterController {
  constructor(
    private readonly registerService: RegisterService, // here
  ) {}

  @Get()
  async getRegisters(@Req() request: Request) {
    let team_id: number;

    // Get the registers for the given team_id
    const registers = await this.registerService.findAllRegistersByTeam(
      team_id,
    ); // and here

    return registers;
  }
}
