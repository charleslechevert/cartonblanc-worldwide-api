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

  // findAllPenaltiesByTeam(teamId: number): Promise<Penalty[]> {
  //   return this.penaltiesRepository.find({ where: { team: { id: teamId } } });
  // }

  findAllPenaltiesByTeam(req: Request, teamId: number): Promise<Penalty[]> {
    if (req.headers['x-demo-data']) {
      // Fetch and return demo data
      return this.penaltiesRepository.find({
        where: { team: { id: 12071998 } },
      });
    } else {
      // Fetch and return actual data for the given teamId
      return this.penaltiesRepository.find({ where: { team: { id: teamId } } });
    }
  }

  findPenaltyById(id: number): Promise<Penalty[]> {
    return this.penaltiesRepository.find({ where: { id } });
  }
}
