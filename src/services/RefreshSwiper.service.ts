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

    async clearEmbedSentInformations(client: Client) {
        const allEmbedSend = await AppDataSource.getRepository(EmbedInChannel).find();
        allEmbedSend.map(async (embedSend) => {
            const messageToUpdate = await fetchMessage(client, embedSend.channelId, embedSend.messageId);
            if(!messageToUpdate) this.removeEmbedSent(embedSend.uid);
        });
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

    async removeEmbedSent(embedSentUid: string) {
        console.log(`Removing embed ${embedSentUid} from sent embeds`);
        await AppDataSource
            .getRepository(EmbedInChannel)
            .delete(embedSentUid);
    }

    async refreshAllSwiper(client: Client) {
        console.log("Beginning of refreshment cycle : ", new Date());

        try {
            const allEmbedSend = await AppDataSource
                .getRepository(EmbedInChannel)
                .find({ relations: ["linkedTo", "linkedTo.swiper", "linkedTo.swiper.images", "linkedTo.fields"] });

            allEmbedSend.map(async (embedSend) => {
                const embed = embedSend.linkedTo;
                if (!embed.swiper) return;

                const newEmbedToSend = EmbedService.generateEmbed(embed);
                if (!newEmbedToSend || !newEmbedToSend.image) return;

                const messageToUpdate = await fetchMessage(client, embedSend.channelId, embedSend.messageId);
                if (!messageToUpdate) {
                    console.log(`Message not found for embed ${embedSend.uid} in channel ${embedSend.channelId}`);
                    await this.removeEmbedSent(embedSend.uid);
                    return;
                };

                this.addSentEmbed(embedSend.uid);

                const currentEmbedImage = messageToUpdate.embeds[0]?.image?.url;
                if (!currentEmbedImage) return;
                const nextImageUrl = this.findNextImageUrl(embedSend.uid, embed.swiper);
                if (!nextImageUrl) return;

                newEmbedToSend.setImage(nextImageUrl);
                await messageToUpdate.edit({ embeds: [newEmbedToSend] });
            });
        } catch (error) {
            console.error("Error during refreshAllSwiper:", error);
        }
    }
}