import { StorageLocationArea } from "../../ss-storage/entities/storageLocationArea.entity";
import { Entity, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, PrimaryColumn, Column, Index, ManyToOne, JoinColumn, PrimaryGeneratedColumn, OneToOne, OneToMany, BeforeInsert } from "typeorm";
import { Order } from "./order.entity";
import { OrderItemActivityLog } from "./orderItemActivityLog.entity";
const randomstring = require("randomstring");

@Entity({ name: 'ssorderItems' })
@Index(['storageLocationId', 'storageLocationAreaId'], { unique: true })
export class OrderItem {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({
        nullable: false
    })
    orderId: string

    @ManyToOne(() => Order, (order) => order.orderItem, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'orderId' })
    order: Order

    @OneToMany(() => OrderItemActivityLog, (orderItemActivityLog) => orderItemActivityLog.orderItem, { cascade: true })
    orderItemActivityLogs: OrderItemActivityLog[]

    //-------------------------TRIAL------------------
    @OneToOne(() => StorageLocationArea, (storageLocationArea) => storageLocationArea.orderItem,
        { cascade: true })
    storageLocationArea: StorageLocationArea

    @Column({ nullable: true })
    @Index()
    storageLocationId?: number

    @Column({ nullable: true })
    @Index()
    storageLocationAreaId?: number

    @Column({ nullable: true, unique: true })
    hash: string;

    @Column({ nullable: false})
    boxId?: number

    @Column({ nullable: false})
    cost: number

    @Column({ nullable: false, default: 1})
    quantity: number

    @Column()
    description?: string

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;

    @BeforeInsert()
    beforeInsertAction(): void {
        this.hash = randomstring.generate(6)?.toUpperCase()
    }
}