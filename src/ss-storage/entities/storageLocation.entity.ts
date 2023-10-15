import { Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, Column, ManyToOne, OneToMany, OneToOne, JoinColumn } from "typeorm";
import { StorageLocationType } from "../constants";
import { Storage } from "./storage.entity";
import { StorageLocationArea } from "./storageLocationArea.entity";

@Entity({ name: 'storageLocations' })
export class StorageLocation {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    locationName: string;

    @Column({
        type: 'simple-enum',
        enum: StorageLocationType,
        nullable: false
    })
    storageLocationType: StorageLocationType

    @Column({ nullable: false })
    storageId: number

    // @OneToOne(() => Storage, (storage) => storage.storageLocations, { onDelete: 'SET NULL' })
    // @JoinColumn({ name: 'storageId' })
    // storage: Storage

    @ManyToOne(
        () => Storage,
        (Storage) => Storage.storageLocations,
        {
            onDelete: 'CASCADE'
        }
    )
    storage: Storage

    @OneToMany(() => StorageLocationArea, storageLocationArea => storageLocationArea.storageLocationId)
    storageLocationAreas: StorageLocationArea[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}