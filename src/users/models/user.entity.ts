import { UpdateDateColumn,Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type:'varchar',
        length:255,
        nullable:false,
        unique:true
    })
    email: string;

    @Column({
        type:'varchar',
        length:255,
        nullable:false
    })
    password: string;

    @Column({
        type:'varchar',
        length:255
    })
    first_name: string;

    @Column({
        type:'varchar',
        length:255,
    })
    last_name: string;

    @Column({
        type:'enum',
        enum:UserRole,
        default:UserRole.USER
    })
    role: UserRole;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
    
}
