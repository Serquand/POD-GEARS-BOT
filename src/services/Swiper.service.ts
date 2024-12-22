import { AutocompleteInteraction } from "discord.js";
import { AppDataSource } from "../database";
import { Swiper } from "../entities/Swiper";
import { sendAutocomplete } from "../utils/autocomplete";

export default class SwiperService {
    static async getSwiperByName(name: string) {
        return await AppDataSource
            .getRepository(Swiper)
            .findOne({ where: { name } });
    }

    static async createSwiper(name: string, description: string) {
        return await AppDataSource
            .getRepository(Swiper)
            .save({ description, name });
    }

    static async getAllSwiper() {
        return await AppDataSource
            .getRepository(Swiper)
            .find();
    }

    static async autocompleteSwipername(interaction: AutocompleteInteraction) {
        const swiperList = await SwiperService.getAllSwiper()
        return sendAutocomplete(interaction, swiperList.map(swiper => swiper.name));
    }

    static async deleteSwiper(swiperName: string) {
        return await AppDataSource
            .getRepository(Swiper)
            .delete({ name: swiperName })
    }
}