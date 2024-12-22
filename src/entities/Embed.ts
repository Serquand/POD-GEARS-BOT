import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Swiper } from "./Swiper";

@Entity()
export class Embed {
    @PrimaryGeneratedColumn('uuid')
    uid!: string;

    @Column({ unique: true })
    name!: string;

    @Column({ nullable: true })
    title!: string;

    @Column({ nullable: true })
    authorName!: string;

    @Column({ type: 'text', nullable: true })
    authorIconUrl!: string;

    @Column({ type: 'text', nullable: true })
    authorUrl!: string;

    @Column({ length: 7, nullable: true })
    color!: string;

    @Column({ type: 'text', nullable: true })
    description!: string;

    @Column({ type: 'text', nullable: true })
    imageUrl!: string;

    @ManyToOne(() => Swiper, { nullable: true, onDelete: 'SET NULL' })
    swiperUid!: Swiper;

    @Column({ type: 'text', nullable: true })
    thumbnailUrl!: string;

    @Column({ nullable: true })
    footerTitle!: string;

    @Column({ type: 'text', nullable: true })
    footerIconUrl!: string;

    @Column({ type: 'text', nullable: true })
    embedUrl!: string;
}
