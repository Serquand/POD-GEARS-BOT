import { Client, CommandInteraction } from "discord.js";
import SelectMenuService from "../../services/SelectMenu.service";
import { sendErrorInteractionResponse, sendHiddenInteractionResponse } from "../../utils/discord";

export default {
    name: 'create_select_menu',
    description: 'Crée un Select Menu',
    group: 'Select Menu',
    options: [
        {
            name: 'select_menu_name',
            type: 'STRING',
            required: true,
            description: "Le nom du menu à créer"
        },
        {
            name: 'select_menu_description',
            type: 'STRING',
            required: true,
            description: "La description nom du menu à créer"
        },
        {
            name: 'select_menu_title',
            type: 'STRING',
            required: true,
            description: "Le nom du menu à créer"
        }
    ],
    runSlash: async (client: Client, interaction: CommandInteraction) => {
        const selectMenuName = interaction.options.getString('select_menu_name', true);
        const selectMenuDescription = interaction.options.getString('select_menu_description', true);
        const selectMenuTitle = interaction.options.getString('select_menu_title', true);

        // Check length of selectMenuName
        if(selectMenuName.length > 250) {
            return sendHiddenInteractionResponse(interaction, "Le nom est trop long. Limite : 250 caractères.");
        }

        // Check if selectMenuName is already selected
        if (await SelectMenuService.getSelectMenuByName(selectMenuName)) {
            return sendHiddenInteractionResponse(interaction, "Ce nom est déjà pris.");
        }

        // Check if the description is too long
        if (selectMenuDescription.length > 4_000) {
            return sendHiddenInteractionResponse(interaction, "La description est trop longue. Limite : 4 000 caractères.");
        }

        if(selectMenuTitle.length > 50) {
            return sendHiddenInteractionResponse(interaction, "Le titre est trop long. Limite : 50 caractères.");
        }

        try {
            await SelectMenuService.createSelectMenu({ description: selectMenuDescription, name: selectMenuName, placeholder: selectMenuTitle });
            return sendHiddenInteractionResponse(interaction, "Le Select Menu a bien été créé");
        } catch (error) {
            console.error(error);
            return sendErrorInteractionResponse(interaction);
        }
    }
}