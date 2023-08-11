import { IsNumber, IsString } from 'class-validator';

export class CreatePenaltyDto {
  @IsNumber()
  team_id: number;

  @IsString()
  name: string;

  @IsNumber()
  amount: number;
}
