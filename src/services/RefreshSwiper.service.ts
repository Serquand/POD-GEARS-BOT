import { Client } from "discord.js";
import { AppDataSource } from "../database";
import { EmbedInChannel } from "../entities/EmbedInChannel";
import { Swiper } from "../entities/Swiper";
import { fetchMessage } from "../utils/discord";
import EmbedService from "./Embed.service";

export default class RefreshSwiper {
    private indexOfSwiperSent: Record<string, number>;

    constructor() {
        this.indexOfSwiperSent = {};
    }

    findNextImageUrl(embedSentUid: string, swiper: Swiper) {
        const currentIndex = this.indexOfSwiperSent[embedSentUid] ?? -1;

        if (currentIndex === -1) return swiper.images[0]?.url;
        const nextIndex = (currentIndex + 1) % swiper.images.length;
        return swiper.images[nextIndex]?.url;
    }

    addSentEmbed(embedSentUid: string) {
        if(this.indexOfSwiperSent[embedSentUid]) return;
        else this.indexOfSwiperSent[embedSentUid] = 0;
    }

    async refreshAllSwiper(client: Client) {
        console.log("Beginning of refreshment cycle : ", new Date());

        try {
            const allEmbedSend = await AppDataSource
                .getRepository(EmbedInChannel)
                .find({ relations: ["linkedTo", "linkedTo.swiper", "linkedTo.swiper.images", "linkedTo.fields"] });
            console.log(allEmbedSend.length);

            for (const embedSend of allEmbedSend) {
                const embed = embedSend.linkedTo;
                if (!embed.swiper) continue;

                const newEmbedToSend = EmbedService.generateEmbed(embed);
                if (!newEmbedToSend || !newEmbedToSend.image) continue;

                const messageToUpdate = await fetchMessage(client, embedSend.channelId, embedSend.messageId);
                if (!messageToUpdate) continue;

                this.addSentEmbed(embedSend.uid);

                const currentEmbedImage = messageToUpdate.embeds[0]?.image?.url;
                if (!currentEmbedImage) continue;
                const nextImageUrl = this.findNextImageUrl(embedSend.uid, embed.swiper);
                if (!nextImageUrl) continue;

                newEmbedToSend.setImage(nextImageUrl);
                await messageToUpdate.edit({ embeds: [newEmbedToSend] });
            }
        } catch (error) {
            console.error("Error during refreshAllSwiper:", error);
        }
    }
}