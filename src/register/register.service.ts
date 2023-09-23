import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Register } from './register.entity';
import { CreateRegisterDto, UpdateRegisterDto } from 'src/dto';
import { NotFoundException } from '@nestjs/common';

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
      .innerJoinAndSelect('register.penalty', 'penalty') // Add this line
      .where('player.team.id = :teamId', { teamId })
      .orderBy('register.date', 'DESC')
      .getMany();
  }

  async insertRegister(
    createRegisterDto: CreateRegisterDto,
  ): Promise<Register> {
    // Check if a player with the same name already exists
    // const existingPenalty = await this.registersRepository.findOne({
    //   where: {
    //     name: createPenaltyDto.name,
    //   },
    // });

    // if (existingPenalty) {
    //   // Handle duplicate. For this example, we'll throw an exception.
    //   throw new ConflictException('A player with this name already exists.');
    // }

    const newRegister = this.registersRepository.create({
      player: { id: createRegisterDto.player_id },
      penalty: { id: createRegisterDto.penalty_id },
      descr: createRegisterDto.descr,
      remaining_amount_to_pay: createRegisterDto.remaining_amount_to_pay,
      date: createRegisterDto.date,
    });

    return await this.registersRepository.save(newRegister);
  }

  async deleteRegister(registerId: number): Promise<void> {
    const result = await this.registersRepository.delete(registerId);
    if (result.affected === 0) {
      throw new NotFoundException(`Player with ID ${registerId} not found`);
    }
  }

  async updateRegister(
    updateRegisterDto: UpdateRegisterDto,
  ): Promise<Register> {
    // First, retrieve the existing player using the provided ID.
    const existingRegister = await this.registersRepository.findOne({
      where: {
        id: updateRegisterDto.id,
      },
      relations: ['player', 'penalty'],
    });

    // If the player doesn't exist, throw an error or handle accordingly.
    if (!existingRegister) {
      throw new NotFoundException(
        `Player with ID ${updateRegisterDto.id} not found.`,
      );
    }

    console.log(existingRegister);

    // Update the player's name, if provided.
    if (updateRegisterDto.penalty_id) {
      existingRegister.penalty.id = updateRegisterDto.penalty_id;
      existingRegister.player.id = updateRegisterDto.player_id;
      existingRegister.descr = updateRegisterDto.descr;
      existingRegister.remaining_amount_to_pay =
        updateRegisterDto.remaining_amount_to_pay;
    }

    // Save the changes back to the database.
    return await this.registersRepository.save(existingRegister);
  }
}
