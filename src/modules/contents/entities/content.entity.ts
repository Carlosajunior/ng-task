import {
  Entity,
  Column,
  Index,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from '@/common/entities';
import { User } from '@/modules/users/entities/user.entity';
import { Rating } from '@/modules/ratings/entities/rating.entity';
import { ContentCategory } from '../enums/content-category.enum';

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

  @Column({ type: 'uuid' })
  createdBy: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'created_by' })
  creator: User;

  @OneToMany(() => Rating, (rating) => rating.content)
  ratings: Rating[];

  @Column({ type: 'boolean', default: true })
  status: boolean;
}
