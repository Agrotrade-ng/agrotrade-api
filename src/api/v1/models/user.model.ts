import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 30 })
    firstname: string;

    @Column({ type: 'varchar', length: 30 })
    lastname: string;

    @Column({ type: 'varchar', length: 200, unique: true })
    email: string;

    @Column({ type: 'varchar', length: 255 })
    password: string;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;
}
