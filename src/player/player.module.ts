import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayerController } from './player.controller';
import { PlayerService } from './player.service';
import { Player } from './player.entity';
import { TeamGuard } from 'src/guards';

@Module({
  imports: [
    TypeOrmModule.forFeature([Player]), // import TypeOrmModule for Player
  ],
  controllers: [PlayerController], // PlayerController instead of TeamController
  providers: [PlayerService, TeamGuard], // PlayerService instead of TeamService
})
export class PlayerModule {}
