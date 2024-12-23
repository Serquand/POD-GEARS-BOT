import { AutocompleteInteraction, Client, CommandInteraction } from "discord.js";
import SelectMenuService from "../../services/SelectMenu.service";
import { sendErrorInteractionResponse, sendHiddenInteractionResponse } from "../../utils/discord";

export default {
    name: 'remove_option_select_menu',
    description: "Supprime une option d'un Select Menu",
    group: "Select Menu",
    options: [
        {
            name: 'select_menu_name',
            type: "STRING",
            required: true,
            autocomplete: true,
            description: "Le nom du Select Menu à modifier"
        },
        {
            name: "option_label",
            type: "STRING",
            required: true,
            description: "Le label de l'option à supprimer",
            autocomplete: true,
        }
    ],
    runSlash: async (client: Client, interaction: CommandInteraction) => {
        const optionLabel = interaction.options.getString('option_label', true);
        const selectMenuName = interaction.options.getString('select_menu_name', true);
        const selectMenu = await SelectMenuService.getSelectMenuByName(selectMenuName);

        if(!selectMenu) {
            return sendHiddenInteractionResponse(interaction, "Aucun Select Menu n'a été trouvé avec ce nom !");
        }

        if(!selectMenu.options.find(option => option.label === optionLabel)) {
            return sendHiddenInteractionResponse(interaction, "Aucun label n'a été trouvé avec ce nom !");
        }

        try {
            await SelectMenuService.removeOptionFromSelectMenu(selectMenu, optionLabel);

            // TODO: SYNCHRONIZE ALL SELECT MENU

            return sendHiddenInteractionResponse(interaction, "L'option a bien été supprimé !");
        } catch(e) {
            console.error(e);
            return sendErrorInteractionResponse(interaction);
        }
    },
    /**
     *
     * @param {AutocompleteInteraction} interaction
     */
    autocomplete: (interaction: AutocompleteInteraction) => {
        if(interaction.options.getFocused(true).name === 'select_menu_name') {
            return SelectMenuService.autocompleteWithSelectMenuName(interaction);
        } else {
            return SelectMenuService.autocompleteWithOptionName(interaction);
        }
    }
}