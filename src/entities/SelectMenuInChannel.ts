import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { SelectMenu } from "./SelectMenu";

@Entity()
export class SelectMenuInChannel {
    @PrimaryGeneratedColumn('uuid')
    uid!: string;

    @ManyToOne(() => SelectMenu, { onDelete: 'CASCADE' })
    linkedTo!: SelectMenu;

    @Column({ length: 25 })
    channelId!: string;

    @Column({ length: 25, unique: true })
    messageId!: string;
}