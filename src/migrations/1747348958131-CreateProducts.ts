import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProducts1747348958131 implements MigrationInterface {
  name = 'CreateProducts1747348958131';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "products" (
                "id" SERIAL PRIMARY KEY,
                "externalId" INTEGER NOT NULL,
                "title" VARCHAR NOT NULL,
                "description" TEXT NOT NULL,
                "price" DECIMAL(10,2) NOT NULL,
                "discountPercentage" DECIMAL(5,2) NOT NULL,
                "rating" DECIMAL(3,2) NOT NULL,
                "stock" INTEGER NOT NULL,
                "brand" VARCHAR NOT NULL,
                "category" VARCHAR NOT NULL,
                "thumbnail" VARCHAR NOT NULL,
                "images" TEXT[] NOT NULL
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "products"`);
  }
}
