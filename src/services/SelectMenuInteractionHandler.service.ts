import { MessageActionRow, MessageButton, SelectMenuInteraction } from "discord.js";
import { SelectMenuInChannel } from "../entities/SelectMenuInChannel";
import EmbedService from "./Embed.service";
import { sendErrorInteractionResponse, sendHiddenInteractionResponse } from "../utils/discord";

export default class SelectMenuInteractionHandler {
    uid: string;
    selectMenuInChannel?: SelectMenuInChannel | null;

    constructor(uid: string) {
        this.uid = uid;
    }

    static generateButtonToSwitchSwiperImage(customId: string): MessageActionRow {
        const nextButton = new MessageButton()
            .setCustomId(`${customId}+next`)
            .setEmoji("⏭️")
            .setLabel("Next Image")
            .setStyle("PRIMARY");

        const previousButton = new MessageButton()
            .setCustomId(`${customId}+previous`)
            .setEmoji("⏮️")
            .setLabel("Previous Image")
            .setStyle("PRIMARY");

        return new MessageActionRow().addComponents(previousButton, nextButton);
    }

    static async respondToInteraction(interaction: SelectMenuInteraction): Promise<void> {
        try {
            const embedName = interaction.values[0];
            const embed = await EmbedService.getEmbedByName(embedName);

            if (!embed) {
                return sendHiddenInteractionResponse(interaction, "Embed not found!");
            }

            const embedToSend = EmbedService.generateEmbed(embed);
            if (!embedToSend) {
                return sendHiddenInteractionResponse(interaction, "Failed to generate embed!");
            }

            return await interaction.reply({
                embeds: [embedToSend],
                ephemeral: true,
                components: embed.swiper ? [SelectMenuInteractionHandler.generateButtonToSwitchSwiperImage(embed.uid)] : undefined,
            });
        } catch (error) {
            console.error("Error handling interaction:", error);
            await sendErrorInteractionResponse(interaction);
        }
    }
}
