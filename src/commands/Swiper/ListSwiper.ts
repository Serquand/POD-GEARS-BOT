import { Client, CommandInteraction } from "discord.js";
import { Swiper } from "../../entities/Swiper";
import SwiperService from "../../services/Swiper.service";

export default {
    name: 'list_swiper',
    description: "Liste les swipers",
    group: 'Swiper',
    runSlash: async (client: Client, interaction: CommandInteraction) => {
        const allSwipers = await SwiperService.getAllSwiper();
        const content = '### Liste des swipers :\n' + allSwipers
            .map((swiper: Swiper) => `- **${swiper.name}** => ${swiper.description}`)
            .join('\n');

        return interaction.reply({ content, ephemeral: true });
    },
}