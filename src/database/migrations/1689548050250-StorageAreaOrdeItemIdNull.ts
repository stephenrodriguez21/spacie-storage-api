import { MigrationInterface, QueryRunner } from "typeorm";

export class StorageAreaOrdeItemIdNull1689548050250 implements MigrationInterface {
    name = 'StorageAreaOrdeItemIdNull1689548050250'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "storageLocationAreas" DROP CONSTRAINT "FK_97b5efc60b876a660a0be3ebfdf"`);
        await queryRunner.query(`ALTER TABLE "storageLocationAreas" ALTER COLUMN "orderItemId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "storageLocationAreas" ADD CONSTRAINT "FK_97b5efc60b876a660a0be3ebfdf" FOREIGN KEY ("orderItemId") REFERENCES "ssorderItems"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "storageLocationAreas" DROP CONSTRAINT "FK_97b5efc60b876a660a0be3ebfdf"`);
        await queryRunner.query(`ALTER TABLE "storageLocationAreas" ALTER COLUMN "orderItemId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "storageLocationAreas" ADD CONSTRAINT "FK_97b5efc60b876a660a0be3ebfdf" FOREIGN KEY ("orderItemId") REFERENCES "ssorderItems"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
