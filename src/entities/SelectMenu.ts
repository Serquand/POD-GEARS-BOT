import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
}