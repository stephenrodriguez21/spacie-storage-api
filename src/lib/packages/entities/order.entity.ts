import { Address } from "../../../lib/address/entities/address.entity";
import { Code } from "../../../lib/codes/entities/code.entity";
import { EntityHelper } from "../../../utils/entity-helper";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, DeleteDateColumn, UpdateDateColumn, OneToMany, JoinColumn, ManyToOne } from "typeorm";
import { Customer } from "./customer.entity";

@Entity()
export class Order extends EntityHelper {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(() => Code, code => code.order)
    codes: Code[];

    @Column({ nullable: true })
    customerId!: number;

    @ManyToOne(() => Customer, { eager: true })
    @JoinColumn({ name: 'customerId' })
    customer: Customer;

    @Column()
    addressId!: number;

    @ManyToOne(() => Address, { eager: true })
    @JoinColumn({ name: 'addressId' })
    address: Address;

    @Column()
    orderStatus: string;

    @Column({ default: 1 })
    boxCount: number;

    @Column()
    storageDuration: number;

    @Column({ nullable: true })
    dueDate!: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}