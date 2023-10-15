import { Code } from "../../../lib/codes/entities/code.entity";
import { EntityHelper } from "../../../utils/entity-helper";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, DeleteDateColumn, UpdateDateColumn, OneToMany } from "typeorm";

@Entity()
export class Box extends EntityHelper {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    maxWeight: number;

    @Column()
    cost: number;

    @Column()
    length: number;

    @Column()
    width: number;

    @Column()
    height: number;

    @OneToMany(() => Code, code => code.box)
    codes: Code[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}