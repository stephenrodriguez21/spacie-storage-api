import { Entity, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, Column, Index, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'ssorderSequences' })
export class OrderSequence {
    @PrimaryGeneratedColumn('increment')
    id: number;
    
    @Column({ nullable: false })
    orderPrefix: string;

    @Column({ nullable: false, default: 1 })
    currentSquence: string;

    @Column()
    @Index()
    vendorId: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}