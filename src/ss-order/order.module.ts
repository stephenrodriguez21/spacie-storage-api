import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { DbTransactionFactory } from '../database/factories/transaction.factory';
import { StorageLocationArea } from '../ss-storage/entities/storageLocationArea.entity';
import { TransactionContext } from '../database/factories/transaction.context';
import { Box } from '../lib/packages/entities/box.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Order, StorageLocationArea, Box]), HttpModule,],
    controllers: [OrderController],
    providers: [OrderService, DbTransactionFactory, TransactionContext],
    exports: [OrderService],
})
export class SSOrderModule { }