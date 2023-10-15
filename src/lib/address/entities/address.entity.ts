import { Customer } from "../../../lib/packages/entities/customer.entity";
import { EntityHelper } from "../../../utils/entity-helper";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, DeleteDateColumn, UpdateDateColumn, JoinColumn, ManyToOne } from "typeorm";

@Entity()
export class Address extends EntityHelper {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    phone: string;

    @Column()
    address: string;

    @Column()
    latitude: string;

    @Column()
    longitude: string;

    @Column()
    district: string;

    @Column()
    province: string;

    @Column()
    zipCode: number;

    @Column()
    customerId: number;

    @ManyToOne(() => Customer)
    @JoinColumn({ name: 'customerId' })
    customer: Customer;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}