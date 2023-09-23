import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PenaltyController } from './penalty.controller';
import { PenaltyService } from './penalty.service';
import { Penalty } from './penalty.entity';
import { TeamGuard } from 'src/guards';
import { Register } from 'src/register/register.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Penalty, Register]), // import TypeOrmModule for Penalty
  ],
  controllers: [PenaltyController], // PenaltyController instead of TeamController
  providers: [PenaltyService, TeamGuard], // PenaltyService instead of TeamService
})
export class PenaltyModule {}
