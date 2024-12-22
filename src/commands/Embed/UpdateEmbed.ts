import { Client, CommandInteraction } from "discord.js";
import EmbedService from "../../services/Embed.service";
import { sendHiddenInteractionResponse } from "../../utils/discord";
import UpdateEmbedService from "../../services/UpdateEmbed.service";

export default {
    name: 'update_embed',
    group: 'Embed',
    description: "Modifie un Embed",
    options: [
        {
            name: 'embed_name',
            type: "STRING",
            required: true,
            autocomplete: true,
            description: "Le nom de l'Embed à envoyer"
        }
    ],
    runSlash: async (client: Client, interaction: CommandInteraction) => {
        const embedName = interaction.options.getString('embed_name', true);
        const embed = await EmbedService.getEmbedByName(embedName);
        if(!embed) return sendHiddenInteractionResponse(interaction, "L'Embed que vous voulez modifier n'a pas été trouvé !");

        const embedToSend = EmbedService.generateEmbed(embed);
        return interaction.reply({
            content: `Modification de l'Embed ${embed.name}\nSwiper associé à l'Embed : ${embed.swiper?.name ?? 'Aucun'}`,
            components: UpdateEmbedService.generateButtonForEmbedModification(embed.uid),
            embeds: embedToSend ? [embedToSend] : undefined
        });
    },
    autocomplete: EmbedService.autocompleteWithEmbedName
}