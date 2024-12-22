import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Embed } from "./Embed";

@Entity()
export class EmbedField {
    @PrimaryGeneratedColumn('uuid')
    uid!: string;

    @Column({ type: 'text' })
    name!: string;

    @Column({ type: 'text' })
    value!: string;

    @Column()
    inline!: boolean;

    @ManyToOne(() => Embed, { onDelete: 'CASCADE' })
    linkedTo!: Embed;
}