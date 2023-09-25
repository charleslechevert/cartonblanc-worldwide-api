import { Entity, Column, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { IsEmail, IsHexColor } from 'class-validator';

@Entity('team')
export class Team {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  full_name: string;

  @Column()
  short_name: string;

  @Column()
  password: string;

  @Column()
  admin_password: string;

  @Column()
  year: number;

  @Column({ nullable: true })
  objective: string;

  @Column({ nullable: true })
  sentence: string;

  @IsEmail()
  @Column({ unique: true })
  email_team: string;

  @IsHexColor()
  @Column()
  color1: string;

  @IsHexColor()
  @Column()
  color2: string;

  @Column({ nullable: true })
  logo: string;

  @Column({ nullable: true })
  lydia_url: string;

  @Column({ nullable: true })
  refresh_token: string;

  @Column({ nullable: true })
  reset_password_token: string;

  @Column({ nullable: true })
  reset_password_token_date: Date;

  @Column({ nullable: true })
  reset_admin_password_token: string;

  @Column({ nullable: true })
  reset_admin_password_token_date: Date;
}
