// team/team.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from './team.entity';
import * as bcrypt from 'bcrypt';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team)
    private teamRepository: Repository<Team>,
  ) {}

  findAll(): Promise<Team[]> {
    return this.teamRepository.find();
  }

  async createTeam(data: Partial<Team>): Promise<Team> {
    const salt = await bcrypt.genSalt();
    data.password = await bcrypt.hash(data.password, salt);
    data.admin_password = await bcrypt.hash(data.admin_password, salt);

    const team = this.teamRepository.create(data);
    return this.teamRepository.save(team);
  }

  async findOne(full_name: any): Promise<Team> {
    return this.teamRepository.findOne({ where: { full_name: full_name } });
  }

  async findOneById(id: number): Promise<Team> {
    return this.teamRepository.findOne({ where: { id: id } });
  }
}
