import { AutocompleteInteraction } from "discord.js";
import { AppDataSource } from "../database";
import { Swiper } from "../entities/Swiper";
import { sendAutocomplete } from "../utils/autocomplete";
import { SwiperImage } from "../entities/SwiperImage";

export default class SwiperService {
    static async getSwiperByName(name: string) {
        return await AppDataSource
            .getRepository(Swiper)
            .findOne({
                where: { name },
                relations: ["images"]
            });
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

    static async getImageInSwiper(swiper: Swiper, imageName: string) {
        return await AppDataSource
            .getRepository(SwiperImage)
            .findOne({ where: { linkedTo: swiper, name: imageName } })
    }

    static async addImageInSwiper(swiper: Swiper, imageName: string, imageUrl: string) {
        return await AppDataSource
            .getRepository(SwiperImage)
            .save({ linkedTo: swiper, name: imageName, url: imageUrl });
    }

    static async autocompleteWithSwiperImageName(interaction: AutocompleteInteraction) {
        const swiperName = interaction.options.getString('swiper_name', true);
        const swiper = await SwiperService.getSwiperByName(swiperName);
        if (!swiper) return null;
        return sendAutocomplete(interaction, swiper.images.map(image => image.name));
    }

    static async deleteImageFromSwiper(swiper: Swiper, imageName: string) {
        return await AppDataSource
            .getRepository(SwiperImage)
            .delete({ name: imageName, linkedTo: swiper })
    }
}