import { MigrationInterface, QueryRunner } from "typeorm";

export class OrderItemActivityL1689554295510 implements MigrationInterface {
    name = 'OrderItemActivityL1689554295510'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ssorderItems" ALTER COLUMN "hash" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ssorderItems" ALTER COLUMN "hash" SET NOT NULL`);
    }

}
