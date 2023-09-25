import { IsNotEmpty, IsString, IsBoolean } from 'class-validator';

export class AuthDto {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class RequestNewPwdDto {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsBoolean()
  admin: boolean;
}

export class ResetPasswordDto {
  @IsNotEmpty()
  @IsString()
  team_id: number;

  @IsNotEmpty()
  @IsString()
  token: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsBoolean()
  admin: boolean;
}
