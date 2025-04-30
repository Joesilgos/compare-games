import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Game {
  @PrimaryColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column('simple-array', { nullable: true })
  platforms: string[];

  @Column({ nullable: true })
  releaseDate: string;

  @Column('float', { nullable: true })
  rating: number;

  @Column({ nullable: true })
  coverImage: string;

  @Column('jsonb', { nullable: true })
  howLongToBeatData: any;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
