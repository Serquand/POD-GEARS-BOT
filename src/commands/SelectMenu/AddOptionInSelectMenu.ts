import { Client, CommandInteraction, AutocompleteInteraction } from "discord.js";
import SelectMenuService from "../../services/SelectMenu.service";
import { sendErrorInteractionResponse, sendHiddenInteractionResponse } from "../../utils/discord";
import EmbedService from "../../services/Embed.service";
import { isGoodEmoji } from "../../utils/tools";

export default {
    name: 'add_option_select_menu',
    description: 'Ajoute une option à un Select Menu',
    group: 'Select Menu',
    options: [
        {
            name: 'select_menu_name',
            type: "STRING",
            required: true,
            description: "Le nom du Select Menu à modifier",
            autocomplete: true,
        },
        {
            name: 'option_label',
            type: "STRING",
            required: true,
            description: "Le titre de l'option"
        },
        {
            name: 'embed_name',
            type: "STRING",
            required: true,
            description: "Le nom de l'Embed à envoyer quand l'option sera sélectionné",
            autocomplete: true,
        },
        {
            name: "option_description",
            type: "STRING",
            required: false,
            description: "La description de l'option"
        },
        {
            name: 'option_emoji',
            type: "STRING",
            required: false,
            description: "L'emoji de l'option à envoyer"
        }
    ],
    runSlash: async (client: Client, interaction: CommandInteraction) => {
        const optionLabel = interaction.options.getString('option_label', true);
        const optionEmoji = interaction.options.getString('option_emoji', false);
        const optionDescription = interaction.options.getString('option_description', false);
        const selectMenuName = interaction.options.getString('select_menu_name', true);
        const embedName = interaction.options.getString('embed_name', true);

        const selectMenu = await SelectMenuService.getSelectMenuByName(selectMenuName);
        if(!selectMenu) return sendHiddenInteractionResponse(interaction, "Le Select Menu n'existe pas !");

        // Check if the embed exists
        const embed = await EmbedService.getEmbedByName(embedName);
        if(!embed) return sendHiddenInteractionResponse(interaction, "Aucun Embed n'a été trouvé avec ce nom !");

        if(selectMenu.options.find(options => options.label === optionLabel)) {
            return sendHiddenInteractionResponse(interaction, "Une option avec ce label existe déjà dans ce Select Menu !");
        }

        if(selectMenu.options.length === 25) {
            return sendHiddenInteractionResponse(interaction, "Vous avez atteint le nombre maximum d'options pour ce Select Menu !");
        }

        if(optionLabel.length > 25) {
            return sendHiddenInteractionResponse(interaction, "Le label est trop long. Longueur maximale : 25 caracteres");
        }

        if(optionDescription && optionDescription.length > 50) {
            return sendHiddenInteractionResponse(interaction, "La description est trop longue. Longueur maximale : 50 caracteres");
        }

        if(optionEmoji && !(await isGoodEmoji(interaction.channel, optionEmoji))) {
            return sendHiddenInteractionResponse(interaction, "L'emoji n'est pas valide !");
        }

        const newSelectMenuOption = {
            label: optionLabel,
            linkedTo: selectMenu,
            needToSend: embed,
            description: optionDescription ?? undefined,
            emoji: optionEmoji ?? undefined
        }

        try {
            await SelectMenuService.addSelectMenuOptions(newSelectMenuOption);
            await SelectMenuService.synchronizeAllSelectMenu(client, selectMenu.uid);

            return sendHiddenInteractionResponse(interaction, "L'option a bien été ajouté");
        } catch (error) {
            console.error(error);
            return sendErrorInteractionResponse(interaction);
        }
    },
    autocomplete: (interaction: AutocompleteInteraction) => {
        if(interaction.options.getFocused(true).name === 'select_menu_name') {
            return SelectMenuService.autocompleteWithSelectMenuName(interaction);
        } else {
            return EmbedService.autocompleteWithEmbedName(interaction);
        }
    }
}