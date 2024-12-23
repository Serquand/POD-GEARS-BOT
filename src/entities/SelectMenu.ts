import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { SelectMenuOption } from "./SelectMenuOptions";
import { SelectMenuInChannel } from "./SelectMenuInChannel";

@Entity()
export class SelectMenu {
    @PrimaryGeneratedColumn('uuid')
    uid!: string;

    @Column({ unique: true })
    name!: string;

    @Column()
    description!: string;

    @Column({ length: 50 })
    placeholder!: string;

    @OneToMany(() => SelectMenuOption, (option) => option.linkedTo, { cascade: true })
    options!: SelectMenuOption[];

    @OneToMany(() => SelectMenuInChannel, (inChannel) => inChannel.linkedTo, { cascade: true })
    inChannels!: SelectMenuInChannel[];
}
