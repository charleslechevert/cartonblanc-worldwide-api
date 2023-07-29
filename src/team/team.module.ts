import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamController } from './team.controller';
import { TeamService } from './team.service';
import { Team } from './team.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Team]),
    JwtModule.register({
      secret: 'secret',
      signOptions: { expiresIn: '1d' },
    }),
  ], // import TypeOrmModule for Team
  controllers: [TeamController],
  providers: [TeamService], // provide TeamService
})
export class TeamModule {}
