import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('blockedUsers')
export class BlockedUserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  blocked_user: number;

  @Column({ type: 'varchar' })
  blocked_by: number;
}
