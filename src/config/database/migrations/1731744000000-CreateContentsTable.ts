import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableForeignKey,
} from 'typeorm';
import { ContentCategory } from '@/modules/contents/entities/content.entity';

export class CreateContentsTable1731744000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'contents',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'title',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'category',
            type: 'enum',
            enum: Object.values(ContentCategory),
            isNullable: false,
          },
          {
            name: 'thumbnail_url',
            type: 'varchar',
            length: '500',
            isNullable: true,
          },
          {
            name: 'content_url',
            type: 'varchar',
            length: '500',
            isNullable: true,
          },
          {
            name: 'author',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'created_by',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'status',
            type: 'boolean',
            default: true,
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'contents',
      new TableIndex({
        name: 'IDX_CONTENTS_TITLE',
        columnNames: ['title'],
      }),
    );

    await queryRunner.createIndex(
      'contents',
      new TableIndex({
        name: 'IDX_CONTENTS_CATEGORY',
        columnNames: ['category'],
      }),
    );

    await queryRunner.createIndex(
      'contents',
      new TableIndex({
        name: 'IDX_CONTENTS_CREATED_BY',
        columnNames: ['created_by'],
      }),
    );

    await queryRunner.createForeignKey(
      'contents',
      new TableForeignKey({
        name: 'FK_CONTENTS_CREATED_BY',
        columnNames: ['created_by'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('contents', 'FK_CONTENTS_CREATED_BY');
    await queryRunner.dropIndex('contents', 'IDX_CONTENTS_CREATED_BY');
    await queryRunner.dropIndex('contents', 'IDX_CONTENTS_CATEGORY');
    await queryRunner.dropIndex('contents', 'IDX_CONTENTS_TITLE');
    await queryRunner.dropTable('contents');
  }
}
