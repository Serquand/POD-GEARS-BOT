import { Client, CommandInteraction } from "discord.js";
import { sendErrorInteractionResponse, sendHiddenInteractionResponse } from "../../utils/discord";
import SwiperService from "../../services/Swiper.service";

export default {
    name: 'create_swiper',
    description: "Create a new swiper",
    group: 'Swiper',
    options: [
        {
            name: 'name',
            type: 'STRING',
            required: true,
            description: "Le nom du swiper",
        },
        {
            name: 'description',
            type: 'STRING',
            required: true,
            description: "La description du swiper",
        }
    ],
    runSlash: async (client: Client, interaction: CommandInteraction) => {
        const name = interaction.options.getString('name', true);
        const description = interaction.options.getString('description', true);

        if(name.length > 250) return sendHiddenInteractionResponse(interaction, "Le nom du swiper est trop long. Longueur maximale : 250 caractères.");
        if(await SwiperService.getSwiperByName(name)) return sendHiddenInteractionResponse(interaction, "Un swiper avec ce nom existe déjà !");

        if(name.trim() === 'Aucun') return sendHiddenInteractionResponse(interaction, "Vous ne pouvez pas appeler le Swiper de cette manière");

        try {
            await SwiperService.createSwiper(name, description);
            return sendHiddenInteractionResponse(interaction, "Le Swiper a bien été créé !");
        } catch (error) {
            console.error(error);
            return sendErrorInteractionResponse(interaction);
        }
    }
}