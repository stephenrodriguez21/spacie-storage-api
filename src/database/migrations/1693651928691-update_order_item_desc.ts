import { MigrationInterface, QueryRunner } from "typeorm";

export class updateOrderItemDesc1693651928691 implements MigrationInterface {
    name = 'updateOrderItemDesc1693651928691'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ssorderItems" ADD "description" character varying NOT NULL DEFAULT 'ddd'`);
        await queryRunner.query(`ALTER TABLE "ssorderItems" ALTER COLUMN "boxId" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "ssorderItems" ALTER COLUMN "cost" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "ssorders" ALTER COLUMN "customerName" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "ssorders" ALTER COLUMN "pickUpLocation" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "ssorders" ALTER COLUMN "phoneNumber" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "ssorders" ALTER COLUMN "totalCost" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ssorders" ALTER COLUMN "totalCost" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "ssorders" ALTER COLUMN "phoneNumber" SET DEFAULT '123'`);
        await queryRunner.query(`ALTER TABLE "ssorders" ALTER COLUMN "pickUpLocation" SET DEFAULT 'loc'`);
        await queryRunner.query(`ALTER TABLE "ssorders" ALTER COLUMN "customerName" SET DEFAULT 'ANC'`);
        await queryRunner.query(`ALTER TABLE "ssorderItems" ALTER COLUMN "cost" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "ssorderItems" ALTER COLUMN "boxId" SET DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "ssorderItems" DROP COLUMN "description"`);
    }

}
