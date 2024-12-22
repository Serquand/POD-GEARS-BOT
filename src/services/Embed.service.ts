import { FindManyOptions } from "typeorm";
import { AppDataSource } from "../database";
import { Embed } from "../entities/Embed";
import { MessageComponentInteraction } from "discord.js";

export default class EmbedService {
    static async createEmbed(embedTitle: string, embedName: string) {
        return await AppDataSource
            .getRepository(Embed)
            .save({ title: embedTitle, name: embedName, });
    }

    static async getEmbedByName(embedName: string): Promise<null | Embed> {
        return await AppDataSource
            .getRepository(Embed)
            .findOne({ where: { name: embedName } });
    }

    static async deleteEmbedByName(embedName: string) {
        return await AppDataSource
            .getRepository(Embed)
            .delete({ name: embedName });
    }

    static async getEmbedList(options: FindManyOptions<Embed> | undefined = undefined) {
        return await AppDataSource
            .getRepository(Embed)
            .find(options)
    }

    static async getEmbedByUid(uid: string) {
        return await AppDataSource
            .getRepository(Embed)
            .findOne({
                where: { uid },
                relations: ["swiperUid"]
            })
    }

    static async updateDisplayedImage(interaction: MessageComponentInteraction) {
        const uid = interaction.customId.split('+')[0];
        const action = interaction.customId.split('+')[1];
        const embed = await EmbedService.getEmbedByUid(uid);

        if (!embed || !embed.swiperUid) return;
        // embed.swiper.swiperImages.length === 0
        // const length = embed.swiper.swiperImages.length;
        // const newImageIndex = action === 'next' ? getNextIndex(info.imageIndex, length) : getPreviousIndex(info.imageIndex, length);
        // this.allInteractions[uid].imageIndex = newImageIndex;

        // const embedToSend = embed.generateEmbed();
        // const newImageUrl = embed.swiper.swiperImages[newImageIndex].imageUrl;
        // embedToSend.setImage(newImageUrl);

        // info.interaction.editReply({
        //     embeds: [embedToSend],
        //     ephemeral: true,
        //     components: [generateButtonToSwitchSwiperImage(uid)]
        // });
    }
}