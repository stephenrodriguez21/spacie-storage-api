import { MigrationInterface, QueryRunner } from "typeorm";

export class OrderItemUniqueKey1689549667120 implements MigrationInterface {
    name = 'OrderItemUniqueKey1689549667120'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ssorderItems" ADD "storageLocationId" integer`);
        await queryRunner.query(`ALTER TABLE "ssorderItems" ADD "storageLocationAreaId" integer`);
        await queryRunner.query(`CREATE INDEX "IDX_3c263a0cb0f4eced5baf1e9788" ON "ssorderItems" ("storageLocationId") `);
        await queryRunner.query(`CREATE INDEX "IDX_5a9fc1e5ca1fe8298033e67b20" ON "ssorderItems" ("storageLocationAreaId") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_7983811c0e2a39849da767a887" ON "ssorderItems" ("storageLocationId", "storageLocationAreaId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_7983811c0e2a39849da767a887"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5a9fc1e5ca1fe8298033e67b20"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3c263a0cb0f4eced5baf1e9788"`);
        await queryRunner.query(`ALTER TABLE "ssorderItems" DROP COLUMN "storageLocationAreaId"`);
        await queryRunner.query(`ALTER TABLE "ssorderItems" DROP COLUMN "storageLocationId"`);
    }

}
