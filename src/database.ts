import { DataSource } from "typeorm";
import { SwiperImage } from "./entities/SwiperImage";
import { SelectMenu } from "./entities/SelectMenu";
import { SelectMenuInChannel } from "./entities/SelectMenuInChannel";
import { SelectMenuOption } from "./entities/SelectMenuOptions";
import { Embed } from "./entities/Embed";
import { Swiper } from "./entities/Swiper";
import { EmbedInChannel } from "./entities/EmbedInChannel";
import { EmbedField } from "./entities/EmbedField";

export const AppDataSource = new DataSource({
    type: process.env.DB_DIALECT as "mysql" | "postgres",
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    entities: [
        SelectMenu,
        SelectMenuInChannel,
        Swiper,
        SwiperImage,
        Embed,
        EmbedInChannel,
        EmbedField,
        SelectMenuOption
    ],
});

export const initializeDatabase = async () => {
    if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
        console.log("Database connected!");
    }
}