// team/team.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  BadRequestException,
  Req,
  Res,
  Put,
  Delete,
  Param,
} from '@nestjs/common';
import { RegisterService } from './register.service';
import { Register } from './register.entity';
import * as bcrypt from 'bcrypt';
import { userInfo } from 'os';
import { Response, Request } from 'express';
import { UnauthorizedException } from '@nestjs/common';
import { Public } from 'src/decorators/public.decorator';
import { CreateRegisterDto, UpdateRegisterDto } from 'src/dto';

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

  @Post('/:team_id')
  async insertRegister(@Body() createRegisterDto: any) {
    console.log(createRegisterDto);
    return this.registerService.insertRegister(createRegisterDto);
  }

  @Put('/:teamId')
  async updateRegister(
    @Param('teamId') teamId: number,
    @Body() updateRegisterDto: UpdateRegisterDto,
  ): Promise<Register> {
    console.log('controller hit??');
    console.log(updateRegisterDto);
    return await this.registerService.updateRegister(updateRegisterDto);
  }

  @Delete('/:register_id/team/:team_id')
  async deletePlayer(
    @Param('team_id') team_id: number,
    @Param('register_id') register_id: number,
  ): Promise<void> {
    return await this.registerService.deleteRegister(register_id);
  }
}
