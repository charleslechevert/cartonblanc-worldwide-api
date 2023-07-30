import { Entity, Column, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { IsEmail, IsHexColor } from 'class-validator';

@Entity('team')
export class Team {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
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
  @Column()
  email_team: string;

  @IsEmail()
  @Column()
  email_admin: string;

  @IsHexColor()
  @Column()
  color1: string;

  @IsHexColor()
  @Column()
  color2: string;

  @Column({ nullable: true })
  refresh_token: string;
}
