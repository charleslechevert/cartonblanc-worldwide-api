import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PenaltyController } from './penalty.controller';
import { PenaltyService } from './penalty.service';
import { Penalty } from './penalty.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Penalty]), // import TypeOrmModule for Penalty
    JwtModule.register({
      secret: 'secret', // you can use the same secret key
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [PenaltyController], // PenaltyController instead of TeamController
  providers: [PenaltyService], // PenaltyService instead of TeamService
})
export class PenaltyModule {}
