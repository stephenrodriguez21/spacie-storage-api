import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IsExist } from '../../utils/validators/is-exists.validator';
import { IsNotExist } from '../../utils/validators/is-not-exists.validator';
import { AddressController } from './address.controller';
import { AddressService } from './address.service';
import { Address } from './entities/address.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Address]), HttpModule,],
  controllers: [AddressController],
  providers: [IsExist, IsNotExist, AddressService],
  exports: [AddressService],
})
export class AddressModule { }