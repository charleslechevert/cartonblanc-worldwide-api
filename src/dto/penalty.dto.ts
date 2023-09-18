import { IsNumber, IsString } from 'class-validator';

export class CreatePenaltyDto {
  @IsNumber()
  team_id: number;

  @IsString()
  name: string;

  @IsNumber()
  price: number;
}

export class UpdatePenaltyDto {
  readonly name: string;
  readonly price: number;
  readonly id: number;
}
