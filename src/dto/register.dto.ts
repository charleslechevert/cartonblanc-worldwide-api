import { IsNumber, IsString, IsDate } from 'class-validator';

export class CreateRegisterDto {
  @IsNumber()
  player_id: number;

  @IsNumber()
  penalty_id: number;

  @IsString()
  descr: string;

  @IsNumber()
  remaining_amount_to_pay: number;

  @IsDate()
  date: Date;
}

export class UpdateRegisterDto {
  readonly id: number;

  @IsNumber()
  player_id?: number;

  @IsNumber()
  penalty_id?: number;

  @IsString()
  descr?: string;

  @IsNumber()
  remaining_amount_to_pay?: number;
}
