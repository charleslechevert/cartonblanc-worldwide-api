import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayerController } from './player.controller';
import { PlayerService } from './player.service';
import { Player } from './player.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Player]), // import TypeOrmModule for Player
    JwtModule.register({
      secret: 'secret', // you can use the same secret key
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [PlayerController], // PlayerController instead of TeamController
  providers: [PlayerService], // PlayerService instead of TeamService
})
export class PlayerModule {}
