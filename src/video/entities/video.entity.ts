import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  //   OneToOne,
  //   OneToMany,
} from 'typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
// import { CommentEntity } from 'src/comment/entities/comment.entity';

export enum VideoType {
  PAID = 'PAID',
  FREE = 'FREE',
}

@Entity('video')
export class VideoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  price: number;

  @Column({ type: 'varchar', array: true })
  videoUrl: string[];

  @Column({ default: VideoType.FREE })
  isVideoType: VideoType;

  //   @OneToMany(() => CommentEntity, (comment) => comment)
  //   comments: CommentEntity[];

  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({ name: 'createdBy', referencedColumnName: 'id' })
  createdBy: number;

  //   @OneToOne(() => UserEntity, (user) => user.id)
  //   @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  //   user: UserEntity;

  @Column({ default: () => 'CURRENT_TIMESTAMP', nullable: true })
  createdAt: Date;

  @Column({
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true,
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
  // @Column({ type: 'jsonb', nullable: true })
  // reports: any;
}
