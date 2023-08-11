import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Penalty } from './penalty.entity';

@Injectable()
export class PenaltyService {
  constructor(
    @InjectRepository(Penalty)
    private penaltiesRepository: Repository<Penalty>,
  ) {}

  findAllPenaltiesByTeam(teamId: number): Promise<Penalty[]> {
    return this.penaltiesRepository.find({ where: { team: { id: teamId } } });
  }

  findPenaltyById(id: number): Promise<Penalty[]> {
    return this.penaltiesRepository.find({ where: { id } });
  }
}
