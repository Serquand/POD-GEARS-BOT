import { Client, CommandInteraction } from "discord.js";
import EmbedService from "../../services/Embed.service";
import { sendErrorInteractionResponse, sendHiddenInteractionResponse } from "../../utils/discord";

export default {
    name: "send_embed",
    description: "Envoie un Embed dans un channel",
    group: "Embed",
    options: [
        {
            name: 'embed_name',
            required: true,
            type: "STRING",
            description: "Le nom de l'Embed à envoyer",
            autocomplete: true
        },
        {
            name: 'channel',
            required: true,
            type: "CHANNEL",
            description: "Le channel où envoyer l'Embed"
        },
    ],
    runSlash: async (client: Client, interaction: CommandInteraction) => {
        const embedName = interaction.options.getString('embed_name', true);
        const channel = interaction.options.getChannel('channel', true);

        const embed = await EmbedService.getEmbedByName(embedName);

        if(!embed) {
            return sendHiddenInteractionResponse(interaction, "L'Embed que vous voulez envoyer n'a pas été trouvé !");
        } else if(!('send' in channel)) {
            return interaction.reply({ content: "Le channel d'envoi n'est pas valide !", ephemeral: true });
        }

        try {
            await EmbedService.sendEmbedInChannel(embed, channel);
            return sendHiddenInteractionResponse(interaction, "L'Embed a bien été envoyé !");
        } catch (err) {
            console.error(err);
            return sendErrorInteractionResponse(interaction);
        }
    },
    autocomplete: EmbedService.autocompleteWithEmbedName
}