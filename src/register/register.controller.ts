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
import { JwtService } from '@nestjs/jwt';
import { Response, Request } from 'express';
import { UnauthorizedException } from '@nestjs/common';

@Controller('register')
export class RegisterController {
  constructor(
    private readonly registerService: RegisterService, // here
    private jwtService: JwtService,
  ) {}

  @Get()
  async getRegisters(@Req() request: Request) {
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

    // Get the registers for the given team_id
    const registers = await this.registerService.findAllRegistersByTeam(
      team_id,
    ); // and here

    return registers;
  }
}
