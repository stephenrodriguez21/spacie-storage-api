import { Address } from "../../../lib/address/entities/address.entity";
import { EntityHelper } from "../../../utils/entity-helper";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, DeleteDateColumn, UpdateDateColumn, OneToMany } from "typeorm";

@Entity()
export class Customer extends EntityHelper {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    phone: string;

    @OneToMany(() => Address, address => address.customer, { eager: true })
    addresses: Address[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}