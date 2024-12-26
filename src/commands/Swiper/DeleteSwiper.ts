import { Client, CommandInteraction } from "discord.js";
import { sendErrorInteractionResponse, sendHiddenInteractionResponse } from "../../utils/discord";
import SwiperService from "../../services/Swiper.service";
import EmbedService from "../../services/Embed.service";

export default {
    name: "delete_swiper",
    description: "Supprime un swiper",
    group: 'Swiper',
    options: [
        {
            name: 'swiper_name',
            required: true,
            description: "Nom du swiper à supprimer",
            type: "STRING",
            autocomplete: true,
        }
    ],
    runSlash: async (client: Client, interaction: CommandInteraction) => {
        const swiperName = interaction.options.getString('swiper_name', true);
        const swiper = await SwiperService.getSwiperByName(swiperName);

        if(!swiper) {
            return sendHiddenInteractionResponse(interaction, "Le swiper n'existe pas !");
        }

        try {
            const allEmbeds = await EmbedService.getAllEmbedWhereSwiperIs(swiper);
            await SwiperService.deleteSwiper(swiperName);
            await Promise.all(allEmbeds.map(embed => EmbedService.updateAll(client, embed.uid)));
            return sendHiddenInteractionResponse(interaction, "Le swiper a bien été supprimé !");
        } catch (e) {
            console.error(e);
            return sendErrorInteractionResponse(interaction);
        }
    },
    autocomplete: SwiperService.autocompleteSwipername
}