import { Client, CommandInteraction, AutocompleteInteraction } from "discord.js";
import SwiperService from "../../services/Swiper.service";
import { sendHiddenInteractionResponse } from "../../utils/discord";

export default {
    name: 'show_swiper_image',
    description: "Affiche une image d'un swiper",
    group: 'Swiper',
    options: [
        {
            name: 'swiper_name',
            type: 'STRING',
            required: true,
            description: "Le nom du swiper à afficher",
            autocomplete: true,
        },
        {
            name: 'image_name',
            type: 'STRING',
            required: true,
            description: "Le nom de l'image à afficher",
            autocomplete: true,
        },
    ],
    runSlash: async (client: Client, interaction: CommandInteraction) => {
        const swiperName = interaction.options.getString('swiper_name', true);
        const imageName = interaction.options.getString('image_name', true);

        const swiper = await SwiperService.getSwiperByName(swiperName);
        if(!swiper) return sendHiddenInteractionResponse(interaction, "Le swiper que vous avez demandé n'existe pas !");

        const swiperImage = swiper.images.find(image => image.name === imageName);
        if(!swiperImage) return sendHiddenInteractionResponse(interaction, "L'image que vous avez demandé n'existe pas !");

        return sendHiddenInteractionResponse(interaction, "Voici l'image que vous avez demandé :\n" + swiperImage.url);
    },
    autocomplete: (interaction: AutocompleteInteraction) => {
        if(interaction.options.getFocused(true).name === 'swiper_name') {
            return SwiperService.autocompleteSwipername(interaction);
        } else {
            return SwiperService.autocompleteWithSwiperImageName(interaction);
        }
    }
}