import { Client, CommandInteraction } from "discord.js";
import SelectMenuService from "../../services/SelectMenu.service";
import { sendHiddenInteractionResponse } from "../../utils/discord";

export default {
    name: "list_options_for_select_menu",
    group: "Select Menu",
    description: "Liste les options assignées à un Select Menu",
    options: [
        {
            name: 'select_menu_name',
            type: "STRING",
            required: true,
            description: "Le nom du Select Menu à modifier",
            autocomplete: true,
        }
    ],
    runSlash: async (client: Client, interaction: CommandInteraction) => {
        const selectMenuName = interaction.options.getString('select_menu_name', true);
        const selectMenu = await SelectMenuService.getSelectMenuByName(selectMenuName);

        if(!selectMenu) return sendHiddenInteractionResponse(interaction, "Aucun Select Menu n'a été trouvé pour ce nom !");

        let content = 'Voici la liste des options : \n';
        selectMenu.options.forEach(option => {
            content += `- L'option **${option.label}**, ${option.description ? 'avec la description suivante : _*' + option.description + '*_': 'sans description'} envoie l'Embed : "${option.needToSend.name}".\n`;
        });

        return sendHiddenInteractionResponse(interaction, content);
    },
    autocomplete: SelectMenuService.autocompleteWithSelectMenuName
}