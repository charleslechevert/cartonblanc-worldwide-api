import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Register } from './register.entity';

@Injectable()
export class RegisterService {
  constructor(
    @InjectRepository(Register)
    private registersRepository: Repository<Register>,
  ) {}

  async findAllRegistersByTeam(teamId: number): Promise<Register[]> {
    return this.registersRepository
      .createQueryBuilder('register')
      .innerJoinAndSelect('register.player', 'player')
      .where('player.team.id = :teamId', { teamId })
      .getMany();
  }
}
