import { MigrationInterface, QueryRunner } from "typeorm";

export class StorageTableCreated1689547751590 implements MigrationInterface {
    name = 'StorageTableCreated1689547751590'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "ssorderItems" ("id" SERIAL NOT NULL, "orderId" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_a28d4476dd51c823b05cf716ea8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "storageLocationAreas" ("id" SERIAL NOT NULL, "storageLocationId" integer NOT NULL, "orderItemId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "REL_97b5efc60b876a660a0be3ebfd" UNIQUE ("orderItemId"), CONSTRAINT "PK_5f38baa7e59e4dea528dce511a1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."storageLocations_storagelocationtype_enum" AS ENUM('WINE_CELLAR', 'SHOE_LOCKER')`);
        await queryRunner.query(`CREATE TABLE "storageLocations" ("id" SERIAL NOT NULL, "locationName" character varying NOT NULL, "storageLocationType" "public"."storageLocations_storagelocationtype_enum" NOT NULL, "storageId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_cb9e7cc4479819d8afee89af515" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "storages" ("id" SERIAL NOT NULL, "storageName" character varying NOT NULL, "address" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_2f2d2fae6dc214f7f3ec52189ce" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "ssorders" ("orderNumber" character varying NOT NULL, "vendorId" character varying NOT NULL, "storageId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_a14050aa7c684c6ea0e7f31c7ac" PRIMARY KEY ("orderNumber"))`);
        await queryRunner.query(`CREATE INDEX "IDX_12e6a9ceaae47e32249ceff81f" ON "ssorders" ("vendorId") `);
        await queryRunner.query(`CREATE INDEX "IDX_4819d702c5a6d01910ea08c398" ON "ssorders" ("storageId") `);
        await queryRunner.query(`ALTER TABLE "ssorderItems" ADD CONSTRAINT "FK_f97bad72081fa4becdd8a2b02b2" FOREIGN KEY ("orderId") REFERENCES "ssorders"("orderNumber") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "storageLocationAreas" ADD CONSTRAINT "FK_e830d5ad43351073edafc97647d" FOREIGN KEY ("storageLocationId") REFERENCES "storageLocations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "storageLocationAreas" ADD CONSTRAINT "FK_97b5efc60b876a660a0be3ebfdf" FOREIGN KEY ("orderItemId") REFERENCES "ssorderItems"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ssorders" ADD CONSTRAINT "FK_4819d702c5a6d01910ea08c398b" FOREIGN KEY ("storageId") REFERENCES "storages"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ssorders" DROP CONSTRAINT "FK_4819d702c5a6d01910ea08c398b"`);
        await queryRunner.query(`ALTER TABLE "storageLocationAreas" DROP CONSTRAINT "FK_97b5efc60b876a660a0be3ebfdf"`);
        await queryRunner.query(`ALTER TABLE "storageLocationAreas" DROP CONSTRAINT "FK_e830d5ad43351073edafc97647d"`);
        await queryRunner.query(`ALTER TABLE "ssorderItems" DROP CONSTRAINT "FK_f97bad72081fa4becdd8a2b02b2"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4819d702c5a6d01910ea08c398"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_12e6a9ceaae47e32249ceff81f"`);
        await queryRunner.query(`DROP TABLE "ssorders"`);
        await queryRunner.query(`DROP TABLE "storages"`);
        await queryRunner.query(`DROP TABLE "storageLocations"`);
        await queryRunner.query(`DROP TYPE "public"."storageLocations_storagelocationtype_enum"`);
        await queryRunner.query(`DROP TABLE "storageLocationAreas"`);
        await queryRunner.query(`DROP TABLE "ssorderItems"`);
    }

}
