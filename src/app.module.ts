import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlayerController } from './player/player.controller';
import { TeamModule } from './team/team.module';
import { PlayerModule } from './player/player.module';
import { PenaltyModule } from './penalty/penalty.module';
import { Team } from './team/team.entity';
import { JwtModule } from '@nestjs/jwt';
import { Player } from './player/player.entity';
import { Penalty } from './penalty/penalty.entity';
import { RegisterService } from './register/register.service';
import { RegisterController } from './register/register.controller';
import { RegisterModule } from './register/register.module';
import { Register } from './register/register.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres', // specify your db type
      host: 'localhost', // your db host
      port: 5432, // your db port
      username: 'cbww', // your db username
      password: 'cbww', // your db password
      database: 'cbww', // your db name
      entities: [Team, Player, Penalty, Register],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Team, Player, Penalty, Register]),
    JwtModule.register({
      secret: 'secret',
      signOptions: { expiresIn: '1d' },
    }),
    TeamModule,
    PlayerModule,
    PenaltyModule,
    RegisterModule,
  ],
  controllers: [AppController, RegisterController],
  providers: [AppService, RegisterService],
})
export class AppModule {}
