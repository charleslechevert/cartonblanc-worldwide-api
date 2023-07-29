import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';

import { Team } from 'src/team/team.entity';

@Entity('player')
@Unique(['name', 'team']) // Add this line to make the combination of name and team unique
export class Player {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name: string;

  @ManyToOne(() => Team, { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' }) // You can add the onUpdate and onDelete options here
  @JoinColumn({ name: 'team_id' }) // This is the column name in the database.
  team: Team; // This is the property you will use in your code.
}
