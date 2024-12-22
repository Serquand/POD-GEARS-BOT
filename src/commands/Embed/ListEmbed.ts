import { Client, CommandInteraction } from "discord.js";
import EmbedService from "../../services/Embed.service";
import { sendHiddenInteractionResponse } from "../../utils/discord";

export default {
    name: 'list_embed',
    description: 'Liste les Embeds',
    group: "Embed",
    runSlash: async (client: Client, interaction: CommandInteraction) => {
        const allEmbeds = await EmbedService.getEmbedList();
        const content = '### Voici la liste des Embeds :\n' + allEmbeds.map(embed => '- ' + embed.name).join('\n');

        return sendHiddenInteractionResponse(interaction, content);
    }
}