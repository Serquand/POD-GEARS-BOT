import { AutocompleteInteraction, Client, CommandInteraction } from "discord.js";
import EmbedService from "../../services/Embed.service";
import { sendErrorInteractionResponse, sendHiddenInteractionResponse } from "../../utils/discord";
import { sendAutocomplete } from "../../utils/autocomplete";

const command = {
    name: "delete_embed",
    description: "Supprime un Embed",
    group: "Embed",
    options: [
        {
            name: 'embed_name',
            type: "STRING",
            required: true,
            description: "Le nom de l'Embed à supprimer",
            autocomplete: true,
        }
    ],
    runSlash: async (client: Client, interaction: CommandInteraction) => {
        const embedName = interaction.options.getString('embed_name', true);
        const embed = await EmbedService.getEmbedByName(embedName);
        if(!embed) {
            return sendHiddenInteractionResponse(interaction, "L'Embed à supprimer n'existe pas !");
        }

        try {
            await EmbedService.deleteEmbedByName(embedName);
            return sendHiddenInteractionResponse(interaction, "L'Embed a bien été supprimé !")
        } catch(err) {
            console.error(err);
            return sendErrorInteractionResponse(interaction);
        }
    },
    autocomplete: async (interaction: AutocompleteInteraction) => {
        const embedListName = await EmbedService.getEmbedList()
        sendAutocomplete(interaction, embedListName.map(el => el.name));
    }
}

export default command;