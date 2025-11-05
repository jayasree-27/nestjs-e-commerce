import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';

@Entity('products')
export class Product{
    @PrimaryGeneratedColumn()
    id:number;

    @Column({
        type:'varchar',
        length:255,
        nullable:false
    })
    name:string;

    @Column({
        type:'text',
        nullable:true
    })
    description:string;

    @Column({
        type:'integer',
        nullable:false
    })
    price:number;

    @Column({
        type:'integer',
        default:0
    })
    stock_quantity:number;

    @CreateDateColumn()
    created_at:Date;

    @UpdateDateColumn()
    updated_at:Date;
    
}