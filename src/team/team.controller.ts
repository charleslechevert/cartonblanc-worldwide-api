// team/team.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  BadRequestException,
  Req,
  Res,
  HttpCode,
  HttpStatus,
  UseGuards,
  Param,
} from '@nestjs/common';
import { TeamService } from './team.service';
import { Team } from './team.entity'; // path may vary
import * as bcrypt from 'bcrypt';
import { userInfo } from 'os';
import { Response, Request } from 'express';
import { UnauthorizedException } from '@nestjs/common';
import { Tokens } from 'src/types';
import { AuthDto, RequestNewPwdDto } from '../dto';
import { Http2ServerRequest } from 'http2';

import { AuthGuard } from '@nestjs/passport';
import { AtGuard, RtGuard } from 'src/guards';
import { GetCurrentUser } from 'src/decorators/get-current-user.decorator';
import { GetCurrentUserId } from 'src/decorators/get-current-user-id.decorator';
import { Public } from 'src/decorators/public.decorator';

import { UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CustomFile } from 'src/types/google-upload.type';

@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  // @Public()
  // @Post('signup')
  // @HttpCode(HttpStatus.CREATED)
  // signup(@Body() teamData: Partial<Team>): Promise<Tokens> {
  //  return this.teamService.signup(teamData);
  // }

  // @Public()
  // @Post('signup')
  // @UseInterceptors(FileInterceptor('logo'))
  // @HttpCode(HttpStatus.CREATED)
  // async signup(
  //   @UploadedFile() logo: CustomFile,
  //   @Body() teamData: Partial<Team>,
  // ): Promise<Tokens> {
  //   // Store the logo using your upload service
  //   const logoUrl = await this.teamService.uploadFileToGCP(
  //     logo,
  //     teamData.full_name,
  //   );

  //   // Add the logo URL to the team data (or handle as you see fit)
  //   teamData.logo = logoUrl;

  //   return this.teamService.signup(teamData);
  // }

  @Public()
  @Post('signup')
  @UseInterceptors(FileInterceptor('logo'))
  @HttpCode(HttpStatus.CREATED)
  async signup(
    @UploadedFile() logo: CustomFile,
    @Body() teamData: Partial<Team>,
  ): Promise<Tokens> {
    // Destructure the logo property from teamData so it doesn't get passed to the signup
    const { logo: _, ...dataWithoutLogo } = teamData;

    // First, insert the data without the logo and retrieve the team_id.
    const { team_id, ...newTeamData } = await this.teamService.signup(
      dataWithoutLogo,
    );

    if (logo) {
      // Then, store the logo using your upload service
      const logoUrl = await this.teamService.uploadFileToGCP(logo, team_id);

      // Update the team's record with the logo URL
      await this.teamService.updateLogo(team_id, logoUrl);

      console.log(newTeamData);
    }

    return newTeamData;
  }

  @Public()
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  signinLocal(@Body() dto: AuthDto): Promise<Tokens> {
    return this.teamService.signin(dto);
  }

  //@UseGuards(AuthGuard('jwt'))
  @Get('logout/:team_id')
  @HttpCode(HttpStatus.OK)
  logout(@Param('team_id') team_id: number) {
    return this.teamService.logout(team_id);
  }

  // @Public()
  // @UseGuards(RtGuard)
  // @Post('refresh')
  // @HttpCode(HttpStatus.OK)
  // refreshTokens(
  //   @GetCurrentUserId() teamId: number,
  //   @GetCurrentUser('refreshToken') refreshToken: string,
  // ): Promise<Tokens> {
  //   return this.teamService.refreshTokens(teamId, refreshToken);
  // }

  @Get('/:team_id')
  async getPlayers(@Param('team_id') team_id: number) {
    console.log(team_id);
    const players = await this.teamService.findTeam(team_id);
    return players;
  }

  @Public()
  @Post('/reset-password-request')
  async resetPasswordRequestController(@Body() dto: RequestNewPwdDto) {
    await this.teamService.requestPasswordReset(dto.email);
  }

  @Public()
  @Post('/reset-password')
  async resetPasswordController(@Body() user_id, token, password) {
    await this.teamService.resetPassword(user_id, token, password);
  }
}
