import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Swiper {
    @PrimaryGeneratedColumn('uuid')
    uid!: string;

    @Column({ unique: true })
    name!: string;

    @Column({ type: 'text' })
    description!: string;
}