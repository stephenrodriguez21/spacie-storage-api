import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IsExist } from '../../utils/validators/is-exists.validator';
import { IsNotExist } from '../../utils/validators/is-not-exists.validator';
import { Address } from '../address/entities/address.entity';
import { Code } from '../codes/entities/code.entity';
import { Box } from './entities/box.entity';
import { Package } from './entities/package.entity';
import { PackagesController } from './packages.controller';
import { PackagesService } from './services/packages.service';
import { ScanController } from './scan.controller';
import { ScanService } from './services/scan.service';
import { Customer } from './entities/customer.entity';
import { Order } from './entities/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Package, Code, Box, Address, Customer, Order]), HttpModule,],
  controllers: [PackagesController, ScanController],
  providers: [IsExist, IsNotExist, PackagesService, ScanService],
  exports: [PackagesService, ScanService],
})
export class PackagesModule { }