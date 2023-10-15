import { MigrationInterface, QueryRunner } from "typeorm";

export class OrderItemActivityLogs1689554065541 implements MigrationInterface {
    name = 'OrderItemActivityLogs1689554065541'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "ssorderItemActivityLogs" ("id" SERIAL NOT NULL, "orderId" character varying NOT NULL, "orderItemId" integer NOT NULL, "descriptionEn" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_cd7e5ba6841cf6b828fa3c5fdc1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_4bf746da55533b79b988b2019d" ON "ssorderItemActivityLogs" ("orderId") `);
        await queryRunner.query(`CREATE INDEX "IDX_d2d935f8d5c607bc22788d89fa" ON "ssorderItemActivityLogs" ("orderItemId") `);
        await queryRunner.query(`ALTER TABLE "ssorderItems" ADD "hash" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ssorderItems" ADD CONSTRAINT "UQ_85be824b01baf65319a7c73b6de" UNIQUE ("hash")`);
        await queryRunner.query(`ALTER TABLE "ssorderItemActivityLogs" ADD CONSTRAINT "FK_4bf746da55533b79b988b2019d2" FOREIGN KEY ("orderId") REFERENCES "ssorders"("orderNumber") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ssorderItemActivityLogs" ADD CONSTRAINT "FK_d2d935f8d5c607bc22788d89fa3" FOREIGN KEY ("orderItemId") REFERENCES "ssorderItems"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ssorderItemActivityLogs" DROP CONSTRAINT "FK_d2d935f8d5c607bc22788d89fa3"`);
        await queryRunner.query(`ALTER TABLE "ssorderItemActivityLogs" DROP CONSTRAINT "FK_4bf746da55533b79b988b2019d2"`);
        await queryRunner.query(`ALTER TABLE "ssorderItems" DROP CONSTRAINT "UQ_85be824b01baf65319a7c73b6de"`);
        await queryRunner.query(`ALTER TABLE "ssorderItems" DROP COLUMN "hash"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d2d935f8d5c607bc22788d89fa"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4bf746da55533b79b988b2019d"`);
        await queryRunner.query(`DROP TABLE "ssorderItemActivityLogs"`);
    }

}
