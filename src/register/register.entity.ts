import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Player } from 'src/player/player.entity';
import { Penalty } from 'src/penalty/penalty.entity';

@Entity('register')
export class Register {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'float' })
  remaining_amount_to_pay: number;

  @Column({ type: 'text', nullable: true }) // Assuming descr is nullable as per your SQL
  descr: string;

  @ManyToOne(() => Player, { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' })
  @JoinColumn({ name: 'player_id' }) // This is the column name in the database
  player: Player; // This is the property you will use in your code

  @ManyToOne(() => Penalty, { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' })
  @JoinColumn({ name: 'penalty_id' }) // This is the column name in the database
  penalty: Penalty; // This is the property you will use in your code
}
