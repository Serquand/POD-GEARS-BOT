import { Client, CommandInteraction } from "discord.js";
import { sendErrorInteractionResponse, sendHiddenInteractionResponse } from "../../utils/discord";
import SelectMenuService from "../../services/SelectMenu.service";

export default {
    name: 'delete_select_menu',
    group: "Select Menu",
    description: "Supprime un Select Menu et tous ses enfants envoyés",
    options: [
        {
            name: 'select_menu_name',
            type: "STRING",
            autocomplete: true,
            description: "Le nom du Select Menu à supprimer",
            required: true,
        }
    ],
    runSlash: async (client: Client, interaction: CommandInteraction) => {
        const selectMenuName = interaction.options.getString('select_menu_name', true)
        const selectMenu = await SelectMenuService.getSelectMenuByName(selectMenuName);

        if(!selectMenu) return sendHiddenInteractionResponse(interaction, "Le Select Menu que vous voulez supprimer n'existe pas !");

        try {
            await SelectMenuService.deleteAllSentSelectMenu(client, selectMenu);
            await SelectMenuService.deleteSelectMenuByUid(selectMenu.uid);
            return sendHiddenInteractionResponse(interaction, "Le Select Menu a bien été supprimé");
        } catch (err) {
            console.error(err);
            return sendErrorInteractionResponse(interaction);
        }
    },
    autocomplete: SelectMenuService.autocompleteWithSelectMenuName
}