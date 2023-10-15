import { Injectable } from '@nestjs/common';
import { Exception } from 'handlebars';
import { DataSource, EntityManager } from 'typeorm';

// export const transactionContext = async (
//     serviceMethod: (transactionManager: EntityManager) => any,
// ) => {
//     const connection = getConnection();
//     const queryRunner = connection.createQueryRunner();
//     await queryRunner.connect();
//     await queryRunner.startTransaction();
//     try {
//         const data = await serviceMethod(queryRunner.manager);
//         await queryRunner.commitTransaction();
//         await queryRunner.release();
//         return data;
//     } catch (error) {
//         await queryRunner.rollbackTransaction();
//         await queryRunner.release();
//         throw new Exception(error.message, error.httpCode ?? null);
//     }
// };

@Injectable()
export class TransactionContext {
    /**
     *
     */
    constructor(private readonly dataSource: DataSource) {
    }

    async run(serviceMethod: (transactionManager: EntityManager) => any,) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const data = await serviceMethod(queryRunner.manager);
            await queryRunner.commitTransaction();
            await queryRunner.release();
            return data;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            await queryRunner.release();
            throw new Exception(error.message, error.httpCode ?? null);
        }
    }

}