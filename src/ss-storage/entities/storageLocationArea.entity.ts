import { OrderItem } from "../../ss-order/entities/orderItem.entity";
import { Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, Column, ManyToOne, JoinColumn, OneToOne } from "typeorm";
import { StorageLocation } from "./storageLocation.entity";

@Entity({ name: 'storageLocationAreas' })
export class StorageLocationArea {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ nullable: false })
    storageLocationId: number

    @ManyToOne(
        () => StorageLocation,
        (storageLocation) => storageLocation.storageLocationAreas,
        {
            onDelete: 'CASCADE'
        }
    )
    @JoinColumn({ name: 'storageLocationId' })
    storageLocation: StorageLocation

    @Column({ nullable: true })
    orderItemId?: number

    @OneToOne(() => OrderItem, (orderItem) => orderItem.storageLocationArea, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'orderItemId' })
    orderItem: OrderItem

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}