import { UserEntity } from 'src/users/entities/user.entity';
import { VideoEntity } from 'src/video/entities/video.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('comment')
export class CommentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  comment: string;

  @Column({ type: 'varchar' })
  commented_on: number;

  @Column({ type: 'varchar' })
  commented_by: number;

  @ManyToOne(() => VideoEntity, (video) => video.id)
  @JoinColumn({ name: 'video_id', referencedColumnName: 'id' })
  video_id: VideoEntity;

  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user_id: UserEntity;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
