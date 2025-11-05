import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('user_products')
export class UserProduct {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'integer',
    })
    user_id: number;

    @Column({
        type: 'integer',
    })
    product_id: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}