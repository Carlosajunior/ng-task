import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableForeignKey,
} from 'typeorm';

export class CreateRatingsTable1731744100000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'ratings',
        columns: [
          {
            name: 'user_id',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'content_id',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'rating',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'comment',
            type: 'text',
            isNullable: true,
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
      'ratings',
      new TableIndex({
        name: 'IDX_RATINGS_USER_ID',
        columnNames: ['user_id'],
      }),
    );

    await queryRunner.createIndex(
      'ratings',
      new TableIndex({
        name: 'IDX_RATINGS_CONTENT_ID',
        columnNames: ['content_id'],
      }),
    );

    await queryRunner.createIndex(
      'ratings',
      new TableIndex({
        name: 'IDX_RATINGS_USER_CONTENT',
        columnNames: ['user_id', 'content_id'],
        isUnique: true,
      }),
    );

    await queryRunner.createForeignKey(
      'ratings',
      new TableForeignKey({
        name: 'FK_RATINGS_USER',
        columnNames: ['user_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'ratings',
      new TableForeignKey({
        name: 'FK_RATINGS_CONTENT',
        columnNames: ['content_id'],
        referencedTableName: 'contents',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );

    await queryRunner.query(
      `ALTER TABLE ratings ADD CONSTRAINT CHK_RATING_RANGE CHECK (rating >= 1 AND rating <= 5)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE ratings DROP CONSTRAINT CHK_RATING_RANGE`,
    );
    await queryRunner.dropForeignKey('ratings', 'FK_RATINGS_CONTENT');
    await queryRunner.dropForeignKey('ratings', 'FK_RATINGS_USER');
    await queryRunner.dropIndex('ratings', 'IDX_RATINGS_USER_CONTENT');
    await queryRunner.dropIndex('ratings', 'IDX_RATINGS_CONTENT_ID');
    await queryRunner.dropIndex('ratings', 'IDX_RATINGS_USER_ID');
    await queryRunner.dropTable('ratings');
  }
}
