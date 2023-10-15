import { MigrationInterface, QueryRunner } from "typeorm";

export class updateOrdersTable1693650944166 implements MigrationInterface {
    name = 'updateOrdersTable1693650944166'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ssorderItems" ADD "boxId" integer NOT NULL DEFAULT 1`);
        await queryRunner.query(`ALTER TABLE "ssorderItems" ADD "cost" integer NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "ssorders" ADD "customerName" character varying NOT NULL DEFAULT 'ANC'`);
        await queryRunner.query(`ALTER TABLE "ssorders" ADD "pickUpLocation" character varying NOT NULL DEFAULT 'loc'`);
        await queryRunner.query(`ALTER TABLE "ssorders" ADD "phoneNumber" character varying NOT NULL DEFAULT 123`);
        await queryRunner.query(`ALTER TABLE "ssorders" ADD "totalCost" integer NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ssorders" DROP COLUMN "totalCost"`);
        await queryRunner.query(`ALTER TABLE "ssorders" DROP COLUMN "phoneNumber"`);
        await queryRunner.query(`ALTER TABLE "ssorders" DROP COLUMN "pickUpLocation"`);
        await queryRunner.query(`ALTER TABLE "ssorders" DROP COLUMN "customerName"`);
        await queryRunner.query(`ALTER TABLE "ssorderItems" DROP COLUMN "cost"`);
        await queryRunner.query(`ALTER TABLE "ssorderItems" DROP COLUMN "boxId"`);
    }

}
