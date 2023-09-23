import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from './player.entity';
import { CreatePlayerDto, UpdatePlayerDto } from 'src/dto/player.dto';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { Register } from 'src/register/register.entity';

@Injectable()
export class PlayerService {
  constructor(
    @InjectRepository(Player)
    private playersRepository: Repository<Player>,
    @InjectRepository(Register)
    private registerRepository: Repository<Register>,
  ) {}

  findAllPlayersByTeam(teamId: number): Promise<Player[]> {
    return this.playersRepository.find({ where: { team: { id: teamId } } });
  }

  async insertPlayer(createPlayerDto: CreatePlayerDto): Promise<Player> {
    // Check if a player with the same name already exists
    const existingPlayer = await this.playersRepository.findOne({
      where: { name: createPlayerDto.name },
    });

    if (existingPlayer) {
      // Handle duplicate. For this example, we'll throw an exception.
      throw new ConflictException('A player with this name already exists.');
    }

    const newPlayer = this.playersRepository.create({
      name: createPlayerDto.name,
      team: { id: createPlayerDto.team_id }, // This sets up a reference to the Team by its ID.
    });

    return await this.playersRepository.save(newPlayer);
  }

  async deletePlayer(playerId: number): Promise<void> {
    const relatedRegisters = await this.registerRepository.count({
      where: { player: { id: playerId } },
    });

    if (relatedRegisters > 0) {
      throw new ConflictException(
        'Cannot delete player because there are related registers.',
      );
    }

    const result = await this.playersRepository.delete(playerId);
    if (result.affected === 0) {
      throw new NotFoundException(`Player with ID ${playerId} not found`);
    }
  }

  async updatePlayer(updatePlayerDto: UpdatePlayerDto): Promise<Player> {
    // First, retrieve the existing player using the provided ID.
    const existingPlayer = await this.playersRepository.findOne({
      where: {
        id: updatePlayerDto.id,
      },
    });

    // If the player doesn't exist, throw an error or handle accordingly.
    if (!existingPlayer) {
      throw new NotFoundException(
        `Player with ID ${updatePlayerDto.id} not found.`,
      );
    }

    // Update the player's name, if provided.
    if (updatePlayerDto.name) {
      existingPlayer.name = updatePlayerDto.name;
    }

    // Save the changes back to the database.
    return await this.playersRepository.save(existingPlayer);
  }
}
