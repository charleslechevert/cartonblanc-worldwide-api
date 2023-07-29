import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from './player.entity';

@Injectable()
export class PlayerService {
  constructor(
    @InjectRepository(Player)
    private playersRepository: Repository<Player>,
  ) {}

  findAllPlayersByTeam(teamId: number): Promise<Player[]> {
    return this.playersRepository.find({ where: { team: { id: teamId } } });
  }
}
