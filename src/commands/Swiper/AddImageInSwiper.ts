import { Client, CommandInteraction } from "discord.js";
import SwiperService from "../../services/Swiper.service";
import { sendErrorInteractionResponse, sendHiddenInteractionResponse } from "../../utils/discord";

export default {
    name: 'add_images_in_swipper',
    description: 'Ajoute une image au swiper',
    group: 'Swiper',
    options: [
        {
            name: 'swiper_name',
            type: 'STRING',
            required: true,
            description: 'Le nom du swiper à modifier',
            autocomplete: true,
        },
        {
            name: 'image_name',
            type: 'STRING',
            required: true,
            description: 'Le nom de l\'image à ajouter',
        },
        {
            name: 'image_url',
            type: 'STRING',
            required: true,
            description: 'L\'url de l\'image à ajouter',
        }
    ],
    runSlash: async (client: Client, interaction: CommandInteraction) => {
        const swiperName = interaction.options.getString('swiper_name', true);
        const imageName = interaction.options.getString('image_name', true);
        const imageUrl = interaction.options.getString('image_url', true);

        // Check if the swiper really exists
        const swiper = await SwiperService.getSwiperByName(swiperName);
        if(!swiper) {
            return sendHiddenInteractionResponse(interaction, "Le swiper que vous voulez modifier n'existe pas !")
        }

        if (imageName.length > 250) {
            return sendHiddenInteractionResponse(interaction, "Le nom de l'image est trop longue. Longueur maximale autorisé : 250 caractères");
        }

        // Check if the image exists in the swiper
        if(await SwiperService.getImageInSwiper(swiper, imageName)) {
            return sendHiddenInteractionResponse(interaction, "Une image avec le même nom existe déjà dans le swiper !");
        }

        try {
            await SwiperService.addImageInSwiper(swiper, imageName, imageUrl);
            return sendHiddenInteractionResponse(interaction, "L'image a bien été ajouté !");
        } catch (err) {
            console.error(err);
            return sendErrorInteractionResponse(interaction);
        }
    },
    autocomplete: SwiperService.autocompleteSwipername
}