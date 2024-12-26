import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Embed } from "./Embed";

@Entity()
export class EmbedInChannel {
    @PrimaryGeneratedColumn('uuid')
    uid!: string;

    @Column({ length: 25 })
    channelId!: string;

    @Column({ length: 25, unique: true })
    messageId!: string;

    @ManyToOne(() => Embed, (embed) => embed.sentInChannels, { onDelete: 'CASCADE' })
    linkedTo!: Embed;

    @Column({ type: 'enum', enum: ['AUTO', 'BUTTON'], nullable: true })
    swiperType?: 'AUTO' | 'BUTTON';
}