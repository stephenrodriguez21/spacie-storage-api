import { MigrationInterface, QueryRunner } from "typeorm";

export class OrderItemquantity1694275193285 implements MigrationInterface {
    name = 'OrderItemquantity1694275193285'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ssorderItems" ADD "quantity" integer NOT NULL DEFAULT '1'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ssorderItems" DROP COLUMN "quantity"`);
    }

}
