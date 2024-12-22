import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { SwiperImage } from './SwiperImage';

@Entity()
export class Swiper {
    @PrimaryGeneratedColumn('uuid')
    uid!: string;

    @Column({ unique: true })
    name!: string;

    @Column({ type: 'text' })
    description!: string;

    @OneToMany(() => SwiperImage, image => image.linkedTo, { cascade: true })
    images!: SwiperImage[];
}