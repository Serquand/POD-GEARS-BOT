import { Client, CommandInteraction } from "discord.js";
import SwiperService from "../../services/Swiper.service";
import { sendHiddenInteractionResponse } from "../../utils/discord";

export default {
    name: 'show_swiper_list_image',
    description: "Affiche la liste des images pour un swiper",
    group: 'Swiper',
    options: [
        {
            name: 'swiper_name',
            type: "STRING",
            description: "Le nom du swiper à afficher",
            required: true,
            autocomplete: true
        },
    ],
    runSlash: async(client: Client, interaction: CommandInteraction) => {
        const swiperName = interaction.options.getString('swiper_name', true);
        const swiper = await SwiperService.getSwiperByName(swiperName);
        if(!swiper) {
            return sendHiddenInteractionResponse(interaction, "Aucun swiper avec ce nom n'a été trouvé")
        }

        const content = "### Voici la liste des images rattachés à ce swiper :\n" +
            swiper.images
            .map(image => '- ' + image.name)
            .join('\n');

        return interaction.reply({ content, ephemeral: true });
    },
    autocomplete: SwiperService.autocompleteSwipername
}