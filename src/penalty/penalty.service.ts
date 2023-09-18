import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Penalty } from './penalty.entity';
import { CreatePenaltyDto, UpdatePenaltyDto } from 'src/dto';
import { ConflictException } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';

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

  async insertPenalty(createPenaltyDto: CreatePenaltyDto): Promise<Penalty> {
    // Check if a player with the same name already exists
    const existingPenalty = await this.penaltiesRepository.findOne({
      where: {
        name: createPenaltyDto.name,
      },
    });

    if (existingPenalty) {
      // Handle duplicate. For this example, we'll throw an exception.
      throw new ConflictException('A player with this name already exists.');
    }

    console.log('passied ?');

    const newPenalty = this.penaltiesRepository.create({
      name: createPenaltyDto.name,
      price: createPenaltyDto.price,
      team: { id: createPenaltyDto.team_id }, // This sets up a reference to the Team by its ID.
    });

    return await this.penaltiesRepository.save(newPenalty);
  }

  async updatePenalty(updatePenaltyDto: UpdatePenaltyDto): Promise<Penalty> {
    // First, retrieve the existing player using the provided ID.
    const existingPenalty = await this.penaltiesRepository.findOne({
      where: {
        id: updatePenaltyDto.id,
      },
    });

    console.log(existingPenalty);

    // If the player doesn't exist, throw an error or handle accordingly.
    if (!existingPenalty) {
      throw new NotFoundException(
        `Penalty with ID ${updatePenaltyDto.id} not found.`,
      );
    }

    // Update the player's name, if provided.
    if (updatePenaltyDto.name) {
      existingPenalty.name = updatePenaltyDto.name;
      existingPenalty.price = updatePenaltyDto.price;
    }

    // Save the changes back to the database.
    return await this.penaltiesRepository.save(existingPenalty);
  }

  async deletePenalty(penaltyId: number): Promise<void> {
    const result = await this.penaltiesRepository.delete(penaltyId);
    if (result.affected === 0) {
      throw new NotFoundException(`Penalty with ID ${penaltyId} not found`);
    }
  }
}
