import { IsOptional, IsNumber, IsString } from 'class-validator';

export class UpdateTeamDto {
  @IsNumber()
  id: number;

  @IsOptional()
  @IsString()
  objective?: string;

  @IsOptional()
  @IsString()
  sentence?: string;

  @IsOptional()
  @IsString()
  lydia_url?: string;

  @IsOptional()
  @IsString()
  full_name?: string;

  @IsOptional()
  @IsString()
  short_name?: string;

  @IsOptional()
  @IsString()
  color1?: string;

  @IsOptional()
  @IsString()
  color2?: string;

  @IsOptional()
  @IsString()
  logo?: string;
}
