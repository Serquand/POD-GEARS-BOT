import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { SelectMenu } from "./SelectMenu";
import { Embed } from "./Embed";

@Entity()
export class SelectMenuOption {
    @PrimaryGeneratedColumn('uuid')
    uid!: string;

    @ManyToOne(() => SelectMenu, { onDelete: 'CASCADE' })
    linkedTo!: SelectMenu;

    @ManyToOne(() => Embed, { onDelete: 'CASCADE' })
    needToSend!: Embed;

    @Column({ length: 25 })
    label!: string;

    @Column({ length: 50, nullable: true })
    description?: string;

    @Column({ nullable: true })
    emoji?: string;
}
