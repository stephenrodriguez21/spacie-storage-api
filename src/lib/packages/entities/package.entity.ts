import { User } from "../../../users/entities/user.entity";
import { EntityHelper } from "../../../utils/entity-helper";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Package extends EntityHelper {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    phone: string;

    @Column()
    weight: number;

    @Column()
    size: string;

    @ManyToOne(() => User, (user) => user.packages, { nullable: false})
    user: User

    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  
    @DeleteDateColumn()
    deletedAt: Date;
}