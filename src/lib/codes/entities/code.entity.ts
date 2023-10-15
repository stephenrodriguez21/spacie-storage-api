import { Box } from "../../../lib/packages/entities/box.entity";
import { Order } from "../../../lib/packages/entities/order.entity";
var randomstring = require("randomstring");
import { BeforeInsert, Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Code {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: true })
    orderId!: number;

    @ManyToOne(() => Order, { eager: true })
    @JoinColumn({ name: 'orderId' })
    order: Order;

    @Column({ nullable: false })
    boxId: number;

    @ManyToOne(() => Box)
    @JoinColumn({ name: 'boxId' })
    box: Box;

    @Column({ nullable: true, unique: true })
    hash: string;

    @Column({ nullable: true })
    receivedAt: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;

    @Column({ type: 'boolean', default: false })
    isTagged: boolean

    @BeforeInsert()
    beforeInsertAction(): void {
        this.hash = randomstring.generate(6)?.toUpperCase()
    }
}