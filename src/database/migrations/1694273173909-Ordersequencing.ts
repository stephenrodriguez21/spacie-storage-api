import { MigrationInterface, QueryRunner } from "typeorm";

export class Ordersequencing1694273173909 implements MigrationInterface {
    name = 'Ordersequencing1694273173909'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "ssorderSequences" ("id" SERIAL NOT NULL, "orderPrefix" character varying NOT NULL, "currentSquence" character varying NOT NULL DEFAULT '1', "vendorId" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_2abdd56d3c797be03ae4be44c12" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_b560aa0139684dcdadbb6be42d" ON "ssorderSequences" ("vendorId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_b560aa0139684dcdadbb6be42d"`);
        await queryRunner.query(`DROP TABLE "ssorderSequences"`);
    }

}
