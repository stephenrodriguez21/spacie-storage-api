import { MigrationInterface, QueryRunner } from "typeorm";

export class Orderwithuniqueconstaint1694264363656 implements MigrationInterface {
    name = 'Orderwithuniqueconstaint1694264363656'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ssorderItems" ALTER COLUMN "description" DROP DEFAULT`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_a14050aa7c684c6ea0e7f31c7a" ON "ssorders" ("orderNumber") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_a14050aa7c684c6ea0e7f31c7a"`);
        await queryRunner.query(`ALTER TABLE "ssorderItems" ALTER COLUMN "description" SET DEFAULT 'ddd'`);
    }

}
