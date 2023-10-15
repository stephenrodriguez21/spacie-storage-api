import { Order } from "../../ss-order/entities/order.entity";
import { Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, Column, OneToMany } from "typeorm";
import { StorageLocation } from "./storageLocation.entity";

@Entity({ name: 'storages' })
export class Storage {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    storageName: string;

    @Column()
    address: string;

    @OneToMany(() => StorageLocation, storageLocation => storageLocation.storageId, { cascade: true })
    storageLocations: StorageLocation[];

    @OneToMany(() => Order, order => order.storage, { cascade: true })
    Orders: Order[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}