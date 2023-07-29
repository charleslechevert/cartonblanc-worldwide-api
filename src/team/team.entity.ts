import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column()
  email_team: string;

  @Column()
  color1: string;

  @Column()
  color2: string;
}
