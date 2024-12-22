import { Client, CommandInteraction } from "discord.js";
import { sendErrorInteractionResponse, sendHiddenInteractionResponse } from "../../utils/discord";
import EmbedService from "../../services/Embed.service";

const command = {
    name: 'create_embed',
    description: "Créer un nouvel Embed",
    group: "Embed",
    options: [
        {
            name: "name",
            type: "STRING",
            required: true,
            description: "Le nom de l'Embed à créer"
        },
        {
            name: "embed_title",
            type: "STRING",
            required: true,
            description: "Le titre de l'Embed à créer"
        },
    ],
    runSlash: async (client: Client, interaction: CommandInteraction) => {
        const embedName = interaction.options.getString('name', true);
        const embedTitle = interaction.options.getString('embed_title', true);

        if(embedTitle.length > 250) {
            return sendHiddenInteractionResponse(interaction, "Le titre de l'Embed ne peut pas dépasser les 250 caractères !");
        }

        if(embedName.length > 250) {
            return sendHiddenInteractionResponse(interaction, "Le nom de l'Embed ne peut pas dépasser les 250 caractères !");
        }

        if (await EmbedService.getEmbedByName(embedName)) {
            return sendHiddenInteractionResponse(interaction, "Un Embed avec ce nom existe déjà !");
        }

        try {
            await EmbedService.createEmbed(embedTitle, embedName);
            return sendHiddenInteractionResponse(interaction, "L'Embed a bien été créé !");
        } catch (e) {
            return sendErrorInteractionResponse(interaction);
        };
    },
}

export default command;