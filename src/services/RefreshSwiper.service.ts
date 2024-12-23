import { Client } from "discord.js";
import { AppDataSource } from "../database";
import { EmbedInChannel } from "../entities/EmbedInChannel";
import { Swiper } from "../entities/Swiper";
import { fetchMessage } from "../utils/discord";
import EmbedService from "./Embed.service";

const SWIPER_COOLDOWN = 5_000;

export default class RefreshSwiper {
    client: Client;
    constructor(client: Client) {
        this.client = client;
        setInterval(() => this.refreshAllSwiper(), SWIPER_COOLDOWN);
    }

    findNextImageUrl (currentImageUrl: string, swiper: Swiper) {
        const currentIndex: number = swiper.images.findIndex(image => image.url === currentImageUrl);
        const swiperLength = swiper.images.length;
        const nextIndex = (currentIndex + 1) % swiperLength;
        return swiper.images[nextIndex].url;
    }

    async refreshAllSwiper() {
        const allEmbedSend = await AppDataSource
            .getRepository(EmbedInChannel)
            .find({ relations: ["linkedTo", "linkedTo.swiper", "linkedTo.swiper.images", "linkedTo.fields"] });

        allEmbedSend.map(async (embedSend) => {
            const embed = embedSend.linkedTo;
            if(!embed.swiper) return;

            const newEmbedToSend = EmbedService.generateEmbed(embed);
            if(!newEmbedToSend || !newEmbedToSend.image) return;

            const messageToUpdate = await fetchMessage(this.client, embedSend.channelId, embedSend.messageId);
            if(!messageToUpdate) return;

            const nextImageUrl = this.findNextImageUrl(messageToUpdate.embeds[0].image!.url, embed.swiper);
            newEmbedToSend.setImage(nextImageUrl);

            await messageToUpdate.edit({ embeds: [newEmbedToSend] });
        });
    }
}