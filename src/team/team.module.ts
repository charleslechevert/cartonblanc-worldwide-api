import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamController } from './team.controller';
import { TeamService } from './team.service';
import { Team } from './team.entity';
import { AtStategy, RtStrategy } from './strategies';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Team]), JwtModule.register({})], // import TypeOrmModule for Team
  controllers: [TeamController],
  providers: [TeamService, AtStategy, RtStrategy], // provide TeamService
})
export class TeamModule {}
