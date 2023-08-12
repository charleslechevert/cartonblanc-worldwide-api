import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlayerController } from './player/player.controller';
import { TeamModule } from './team/team.module';
import { PlayerModule } from './player/player.module';
import { PenaltyModule } from './penalty/penalty.module';
import { Team } from './team/team.entity';
import { Player } from './player/player.entity';
import { Penalty } from './penalty/penalty.entity';
import { RegisterService } from './register/register.service';
import { RegisterController } from './register/register.controller';
import { RegisterModule } from './register/register.module';
import { Register } from './register/register.entity';
import { APP_GUARD } from '@nestjs/core';
import { AtGuard } from './guards';

import {
  Module,
  MiddlewareConsumer,
  RequestMethod,
  NestModule,
} from '@nestjs/common';
import { DemoDataMiddleware } from './middlewares/demo-data';

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
    TeamModule,
    PlayerModule,
    PenaltyModule,
    RegisterModule,
  ],
  controllers: [AppController, RegisterController],
  providers: [
    AppService,
    RegisterService,
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
  ],
})
export class AppModule {}
