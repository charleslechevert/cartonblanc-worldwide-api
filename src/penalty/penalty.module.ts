import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PenaltyController } from './penalty.controller';
import { PenaltyService } from './penalty.service';
import { Penalty } from './penalty.entity';
import { TeamGuard } from 'src/guards';

@Module({
  imports: [
    TypeOrmModule.forFeature([Penalty]), // import TypeOrmModule for Penalty
  ],
  controllers: [PenaltyController], // PenaltyController instead of TeamController
  providers: [PenaltyService, TeamGuard], // PenaltyService instead of TeamService
})
export class PenaltyModule {}
