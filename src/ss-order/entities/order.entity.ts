import { Storage } from "../../ss-storage/entities/storage.entity";
import { Entity, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, PrimaryColumn, Column, Index, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { OrderItem } from "./orderItem.entity";
import { OrderItemActivityLog } from "./orderItemActivityLog.entity";

@Entity({ name: 'ssorders' })
@Index(['orderNumber'], { unique: true })
export class Order {
    @PrimaryColumn()
    orderNumber: string;

    @Column()
    customerName: string;

    @Column()
    pickUpLocation: string;

    @Column()
    phoneNumber: string;

    @Column({ nullable: false})
    totalCost: number;

    @Column()
    @Index()
    vendorId: string;

    @Column({
        nullable: false
    })
    @Index()
    storageId: number

    @ManyToOne(
        () => Storage,
        (storage) => storage.Orders,
        {
            onDelete: 'CASCADE'
        }
    )
    @JoinColumn({ name: 'storageId' })
    storage: Storage

    @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
    orderItem: OrderItem[]

    @OneToMany(() => OrderItemActivityLog, (orderItemActivityLog) => orderItemActivityLog.order, { cascade: true })
    orderActivityLog: OrderItemActivityLog

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}