import { Client, CommandInteraction } from "discord.js";
import SelectMenuService from "../../services/SelectMenu.service";
import { sendErrorInteractionResponse, sendHiddenInteractionResponse } from "../../utils/discord";

export default {
    name: 'update_select_menu',
    description: "Modifie un Select Menu",
    group: "Select Menu",
    options: [
        {
            name: 'select_menu_name',
            type: "STRING",
            required: true,
            description: "Le nom du Select Menu à modifier",
            autocomplete: true,
        },
        {
            name: 'select_menu_description',
            type: "STRING",
            required: false,
            description: "La description du Select Menu à modifier",
        },
        {
            name: 'select_menu_placeholder',
            type: "STRING",
            required: false,
            description: "Le placeholder du Select Menu à modifier",
        },
    ],
    runSlash: async (client: Client, interaction: CommandInteraction) => {
        const selectMenuName = interaction.options.getString('select_menu_name', true);
        const selectMenuDescription = interaction.options.getString('select_menu_description', true);
        const selectMenuPlaceholder = interaction.options.getString('select_menu_placeholder', true);

        const selectMenu = await SelectMenuService.getSelectMenuByName(selectMenuName);
        if(!selectMenu) return sendHiddenInteractionResponse(interaction, "Le Select Menu que vous essayer de supprimer n'existe pas !");

        if(!selectMenuDescription && !selectMenuPlaceholder)
                return sendHiddenInteractionResponse(interaction, "Vous devez modifier soit le placeholder, soit la description, soit les deux !");

        const newValue = {
            description: selectMenuDescription ?? selectMenu.description,
            placeholder: selectMenuPlaceholder ?? selectMenu.placeholder,
        };

        try {
            await SelectMenuService.updateSelectMenu(selectMenu.uid, newValue);
            await SelectMenuService.synchronizeAllSelectMenu(client, selectMenu.uid);

            return sendHiddenInteractionResponse(interaction, "Vous avez bien modifié le SelectMenu !");
        } catch (e) {
            console.error(e);
            return sendErrorInteractionResponse(interaction);
        }
    },
    autocomplete: SelectMenuService.autocompleteWithSelectMenuName
}