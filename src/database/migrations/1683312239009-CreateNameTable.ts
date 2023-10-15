import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateNameTable1683312239009 implements MigrationInterface {
    name = 'CreateNameTable1683312239009'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "file" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "path" character varying NOT NULL, CONSTRAINT "PK_36b46d232307066b3a2c9ea3a1d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "role" ("id" integer NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "status" ("id" integer NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_e12743a7086ec826733f54e1d95" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "package" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "phone" character varying NOT NULL, "weight" integer NOT NULL, "size" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "userId" integer NOT NULL, CONSTRAINT "PK_308364c66df656295bc4ec467c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying, "password" character varying, "provider" character varying NOT NULL DEFAULT 'email', "socialId" character varying, "firstName" character varying, "lastName" character varying, "hash" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "photoId" uuid, "roleId" integer, "statusId" integer, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_9bd2fe7a8e694dedc4ec2f666f" ON "user" ("socialId") `);
        await queryRunner.query(`CREATE INDEX "IDX_58e4dbff0e1a32a9bdc861bb29" ON "user" ("firstName") `);
        await queryRunner.query(`CREATE INDEX "IDX_f0e1b4ecdca13b177e2e3a0613" ON "user" ("lastName") `);
        await queryRunner.query(`CREATE INDEX "IDX_e282acb94d2e3aec10f480e4f6" ON "user" ("hash") `);
        await queryRunner.query(`CREATE TABLE "customer" ("id" SERIAL NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "phone" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_a7a13f4cacb744524e44dfdad32" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "address" ("id" SERIAL NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "phone" character varying NOT NULL, "address" character varying NOT NULL, "latitude" character varying NOT NULL, "longitude" character varying NOT NULL, "district" character varying NOT NULL, "province" character varying NOT NULL, "zipCode" integer NOT NULL, "customerId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_d92de1f82754668b5f5f5dd4fd5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "forgot" ("id" SERIAL NOT NULL, "hash" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "userId" integer, CONSTRAINT "PK_087959f5bb89da4ce3d763eab75" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_df507d27b0fb20cd5f7bef9b9a" ON "forgot" ("hash") `);
        await queryRunner.query(`CREATE TABLE "order" ("id" SERIAL NOT NULL, "customerId" integer, "addressId" integer NOT NULL, "orderStatus" character varying NOT NULL, "boxCount" integer NOT NULL DEFAULT '1', "storageDuration" integer NOT NULL, "dueDate" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "code" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "orderId" integer, "boxId" integer NOT NULL, "hash" character varying, "receivedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "isTagged" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_f25478086237225ecb85cac61f3" UNIQUE ("hash"), CONSTRAINT "PK_367e70f79a9106b8e802e1a9825" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "box" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "maxWeight" integer NOT NULL, "cost" integer NOT NULL, "length" integer NOT NULL, "width" integer NOT NULL, "height" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_1a95bae3d12a9f21be6502e8a8b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "package" ADD CONSTRAINT "FK_6dc356455ff7dc7ac56ec2058bc" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_75e2be4ce11d447ef43be0e374f" FOREIGN KEY ("photoId") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_c28e52f758e7bbc53828db92194" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_dc18daa696860586ba4667a9d31" FOREIGN KEY ("statusId") REFERENCES "status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "address" ADD CONSTRAINT "FK_dc34d382b493ade1f70e834c4d3" FOREIGN KEY ("customerId") REFERENCES "customer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "forgot" ADD CONSTRAINT "FK_31f3c80de0525250f31e23a9b83" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_124456e637cca7a415897dce659" FOREIGN KEY ("customerId") REFERENCES "customer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_73f9a47e41912876446d047d015" FOREIGN KEY ("addressId") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "code" ADD CONSTRAINT "FK_f9c54049761ffd0f6e059c9cea6" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "code" ADD CONSTRAINT "FK_0e77328c46c7f51ee56d208fe31" FOREIGN KEY ("boxId") REFERENCES "box"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "code" DROP CONSTRAINT "FK_0e77328c46c7f51ee56d208fe31"`);
        await queryRunner.query(`ALTER TABLE "code" DROP CONSTRAINT "FK_f9c54049761ffd0f6e059c9cea6"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_73f9a47e41912876446d047d015"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_124456e637cca7a415897dce659"`);
        await queryRunner.query(`ALTER TABLE "forgot" DROP CONSTRAINT "FK_31f3c80de0525250f31e23a9b83"`);
        await queryRunner.query(`ALTER TABLE "address" DROP CONSTRAINT "FK_dc34d382b493ade1f70e834c4d3"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_dc18daa696860586ba4667a9d31"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_c28e52f758e7bbc53828db92194"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_75e2be4ce11d447ef43be0e374f"`);
        await queryRunner.query(`ALTER TABLE "package" DROP CONSTRAINT "FK_6dc356455ff7dc7ac56ec2058bc"`);
        await queryRunner.query(`DROP TABLE "box"`);
        await queryRunner.query(`DROP TABLE "code"`);
        await queryRunner.query(`DROP TABLE "order"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_df507d27b0fb20cd5f7bef9b9a"`);
        await queryRunner.query(`DROP TABLE "forgot"`);
        await queryRunner.query(`DROP TABLE "address"`);
        await queryRunner.query(`DROP TABLE "customer"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e282acb94d2e3aec10f480e4f6"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f0e1b4ecdca13b177e2e3a0613"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_58e4dbff0e1a32a9bdc861bb29"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9bd2fe7a8e694dedc4ec2f666f"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "package"`);
        await queryRunner.query(`DROP TABLE "status"`);
        await queryRunner.query(`DROP TABLE "role"`);
        await queryRunner.query(`DROP TABLE "file"`);
    }

}
