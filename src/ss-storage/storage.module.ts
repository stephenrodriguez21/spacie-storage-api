import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Box } from '../lib/packages/entities/box.entity';
import { Storage } from './entities/storage.entity';
import { StorageLocation } from './entities/storageLocation.entity';
import { StorageLocationArea } from './entities/storageLocationArea.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Storage, StorageLocation, StorageLocationArea, Box]), HttpModule,],
    controllers: [],
    providers: [],
    exports: [],
})
export class StorageModule { }