import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PenaltyController } from './penalty.controller';
import { PenaltyService } from './penalty.service';
import { Penalty } from './penalty.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Penalty]), // import TypeOrmModule for Penalty
  ],
  controllers: [PenaltyController], // PenaltyController instead of TeamController
  providers: [PenaltyService], // PenaltyService instead of TeamService
})
export class PenaltyModule {}
