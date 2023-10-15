import { Entity, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, Column, Index, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order.entity";
import { OrderItem } from "./orderItem.entity";

@Entity({ name: 'ssorderItemActivityLogs' })
export class OrderItemActivityLog {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({
        nullable: false
    })
    @Index()
    orderId: string

    @ManyToOne(() => Order, (order) => order.orderActivityLog, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'orderId' })
    order: Order

    @Column({
        nullable: false
    })
    @Index()
    orderItemId: number

    @ManyToOne(() => OrderItem, (order) => order.orderItemActivityLogs, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'orderItemId' })
    orderItem: OrderItem

    //-------------------------TRIAL------------------
    @Column({ nullable: false })
    descriptionEn: string

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}