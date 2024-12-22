import { Client, CommandInteraction } from "discord.js";
import { sendErrorInteractionResponse, sendHiddenInteractionResponse } from "../../utils/discord";
import SwiperService from "../../services/Swiper.service";

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

        if(!await SwiperService.getSwiperByName(swiperName)) {
            return sendHiddenInteractionResponse(interaction, "Le swiper n'existe pas !");
        }

        try {
            await SwiperService.deleteSwiper(swiperName)
            return sendHiddenInteractionResponse(interaction, "Le swiper a bien été supprimé !");
        } catch (e) {
            console.error(e);
            return sendErrorInteractionResponse(interaction);
        }
    },
    autocomplete: SwiperService.autocompleteSwipername
}