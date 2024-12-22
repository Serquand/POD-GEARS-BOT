import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Swiper } from "./Swiper";
import { EmbedField } from "./EmbedField";
import { EmbedInChannel } from "./EmbedInChannel";

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
    swiper!: Swiper;

    @OneToMany(() => EmbedField, (field) => field.linkedTo, { cascade: true })
    fields!: EmbedField[];

    @Column({ type: 'text', nullable: true })
    thumbnailUrl!: string;

    @Column({ nullable: true })
    footerTitle!: string;

    @Column({ type: 'text', nullable: true })
    footerIconUrl!: string;

    @Column({ type: 'text', nullable: true })
    embedUrl!: string;

    @OneToMany(() => EmbedInChannel, (channel) => channel.linkedTo, { cascade: true })
    sentInChannels!: EmbedInChannel[];
}
