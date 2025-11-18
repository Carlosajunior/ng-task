import { Entity, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@/common/entities';
import { User } from '@/modules/users/entities/user.entity';

export enum ContentCategory {
  GAME = 'game',
  VIDEO = 'video',
  ARTWORK = 'artwork',
  MUSIC = 'music',
}

@Entity('contents')
@Index(['title'])
@Index(['category'])
@Index(['createdBy'])
export class Content extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: ContentCategory,
  })
  category: ContentCategory;

  @Column({ type: 'varchar', length: 500, nullable: true })
  thumbnailUrl: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  contentUrl: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  author: string;

  @Column({ type: 'int', default: 0 })
  ratingCount: number;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0.0 })
  averageRating: number;

  @Column({ type: 'uuid' })
  createdBy: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'created_by' })
  creator: User;

  @Column({ type: 'boolean', default: true })
  status: boolean;
}
