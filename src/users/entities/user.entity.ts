import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RoleEntity } from './role.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  fName: string;

  @Column({ type: 'varchar', length: 100 })
  lName: string;

  @Column({ type: 'varchar', unique: true, length: 100 })
  email: string;

  @Column({ type: 'varchar', length: 100 })
  password: string;

  @Column({
    type: 'varchar',
    default:
      'http://res.cloudinary.com/dy5jcur4p/image/upload/v1708241442/rbv7pgm8xvbq8myoajax.webp',
  })
  imageUrl: string;

  @ManyToOne(() => RoleEntity, (role) => role.id, { eager: true })
  @JoinColumn({ name: 'role', referencedColumnName: 'role' })
  role: RoleEntity;

  @Column({ type: 'varchar', nullable: true, array: true })
  blocked_users: number[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
