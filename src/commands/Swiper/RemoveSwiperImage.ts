import { AutocompleteInteraction, Client, CommandInteraction } from "discord.js";
import SwiperService from "../../services/Swiper.service";
import { sendErrorInteractionResponse, sendHiddenInteractionResponse } from "../../utils/discord";

export default {
    name: 'remove_image',
    description: 'Supprime une image d\'un swiper',
    group: 'Swiper',
    options: [
        {
            name: 'swiper_name',
            required: true,
            type: "STRING",
            description: 'Le nom du swiper à modifier',
            autocomplete: true,
        },
        {
            name: 'image_name',
            required: true,
            type: "STRING",
            description: "Le nom de l'image à supprimer",
            autocomplete: true
        },
    ],
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    runSlash: async (client: Client, interaction: CommandInteraction) => {
        const swiperName = interaction.options.getString('swiper_name', true);
        const imageName = interaction.options.getString('image_name', true);
        const swiper = await SwiperService.getSwiperByName(swiperName);

        if(!swiper) {
            return sendHiddenInteractionResponse(interaction, "Le swiper à modifier n'a pas été trouvé !");
        }

        if(!await SwiperService.getImageInSwiper(swiper, imageName)) {
            return sendHiddenInteractionResponse(interaction, "L'image a supprimé n'existe pas sur le swiper !");
        }

        if(swiper.images.length === 1) {
            return sendHiddenInteractionResponse(interaction, "L'image ne peut pas être supprimé car c'est la seule sur le swiper !");
        }

        try {
            await SwiperService.deleteImageFromSwiper(swiper, imageName);
            return sendHiddenInteractionResponse(interaction, 'Image removed successfully');
        } catch (error) {
            console.error(error);
            return sendErrorInteractionResponse(interaction);
        }
    },
    autocomplete: (interaction: AutocompleteInteraction) => {
        if(interaction.options.getFocused(true).name === 'swiper_name') {
            return SwiperService.autocompleteSwipername(interaction);
        } else {
            return SwiperService.autocompleteWithSwiperImageName(interaction);
        }
    }
}