import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Swiper } from './Swiper';

@Entity()
export class SwiperImage {
    @PrimaryGeneratedColumn('uuid')
    uid!: string;

    @Column({ type: 'text' })
    url!: string;

    @Column()
    name!: string;

    @ManyToOne(() => Swiper, { nullable: false })
    linkedTo!: Swiper;
}