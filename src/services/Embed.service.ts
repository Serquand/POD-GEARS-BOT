import { FindManyOptions } from "typeorm";
import { AppDataSource } from "../database";
import { Embed } from "../entities/Embed";
import { AutocompleteInteraction, Client, ColorResolvable, MessageComponentInteraction, MessageEmbed, TextBasedChannel } from "discord.js";
import { sendAutocomplete } from "../utils/autocomplete";
import { EmbedInChannel } from "../entities/EmbedInChannel";
import { Swiper } from "../entities/Swiper";
import { deleteMessage, fetchMessage } from "../utils/discord";

export default class EmbedService {
    static async createEmbed(embedTitle: string, embedName: string) {
        return await AppDataSource
            .getRepository(Embed)
            .save({ title: embedTitle, name: embedName, });
    }

    static async deleteSentEmbed (client: Client, embed: Embed) {
        await Promise.all(embed.sentInChannels.map(async (inChannel) => await deleteMessage(client, inChannel.channelId, inChannel.messageId)))
    }

    static async getEmbedByName(embedName: string): Promise<null | Embed> {
        return await AppDataSource
            .getRepository(Embed)
            .findOne({
                where: { name: embedName },
                relations: ["swiper", "swiper.images", "fields", "sentInChannels"]
            })
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

    static async storeEmbedInChannelRecord(informationsToStore: Omit<EmbedInChannel, "uid">) {
        return await AppDataSource.getRepository(EmbedInChannel).save(informationsToStore);
    }

    static async sendEmbedInChannel(embed: Embed, channel: TextBasedChannel, type: 'AUTO' | 'BUTTON' = 'AUTO') {
        const embedToSend = EmbedService.generateEmbed(embed);
        const message = await channel.send({ embeds: embedToSend ? [embedToSend] : undefined });
        this.storeEmbedInChannelRecord({ channelId: channel.id, linkedTo: embed, messageId: message.id, swiperType: type });
        // this.addEmbedSent(channel.id, message.id, type);
    }

    static async getEmbedByUid(uid: string) {
        return await AppDataSource
            .getRepository(Embed)
            .findOne({
                where: { uid },
                relations: ["swiper", "swiper.images", "fields", "sentInChannels"]
            });
    }

    static isEmptyEmbed(embed: Embed): boolean {
        return (embed.fields && embed.fields.length === 0 && !embed.description && !embed.title && !embed.imageUrl && !embed.swiper);
    }

    static async updateAll(client: Client, embedUid: string) {
        const embed = await EmbedService.getEmbedByUid(embedUid);
        if(!embed) return;

        const embedToSend = EmbedService.generateEmbed(embed);
        if(!embedToSend) return;

        embed.sentInChannels.map(async (inChannel) => {
            const message = await fetchMessage(client, inChannel.channelId, inChannel.messageId);
            if(!message) return;

            try { await message.edit({ embeds: [embedToSend] }); }
            catch { return null; }
        })
    }

    static async getAllEmbedWhereSwiperIs(swiper: Swiper) {
        return await AppDataSource
            .getRepository(Embed)
            .find({ where: { swiper } });
    }

    static generateEmbed(embed: Embed): MessageEmbed | undefined {
        if (EmbedService.isEmptyEmbed(embed)) return undefined;

        const author = {
            iconURL: embed.authorIconUrl,
            url: embed.authorUrl,
            name: embed.authorName
        }

        const generatedEmbed = new MessageEmbed().setTitle(embed.title ? embed.title : '');
        if (embed.fields && embed.fields.length) generatedEmbed.setFields(...embed.fields);
        if (author && author.name) generatedEmbed.setAuthor(author);
        if (embed.color) generatedEmbed.setColor(embed.color as ColorResolvable);
        if (embed.description) generatedEmbed.setDescription(embed.description);
        if (embed.thumbnailUrl) generatedEmbed.setThumbnail(embed.thumbnailUrl);
        if (embed.swiper) generatedEmbed.setImage(embed.swiper.images[0].url);
        else if (embed.imageUrl) generatedEmbed.setImage(embed.imageUrl);
        else if (embed.footerTitle) generatedEmbed.setFooter({ text: embed.footerTitle, iconURL: embed.footerIconUrl });
        generatedEmbed.setURL(embed.embedUrl);

        return generatedEmbed;
    }

    static async autocompleteWithEmbedName(interaction: AutocompleteInteraction) {
        const embedList = await EmbedService.getEmbedList()
        return sendAutocomplete(interaction, embedList.map(embed => embed.name));
    }

    static async updateSwiperDisplayedImage(interaction: MessageComponentInteraction) {
        const uid = interaction.customId.split('+')[0];
        const action = interaction.customId.split('+')[1];
        const embed = await EmbedService.getEmbedByUid(uid);

        if (!embed || !embed.swiper) return;
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