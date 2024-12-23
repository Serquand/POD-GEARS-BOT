import { Client, CommandInteraction } from "discord.js";
import SelectMenuService from "../../services/SelectMenu.service";
import { sendErrorInteractionResponse, sendHiddenInteractionResponse } from "../../utils/discord";

export default {
    name: 'send_select_menu',
    description: "Envoie un Select Menu dans le channel souhaité",
    group: 'Select Menu',
    options: [
        {
            name: 'select_menu_name',
            type: 'STRING',
            required: true,
            description: "Le nom du Select Menu à envoyer",
            autocomplete: true,
        },
        {
            name: "channel",
            type: "CHANNEL",
            required: true,
            description: "Le nom du Channel où envoyer le Select Menu"
        }
    ],
    runSlash: async (client: Client, interaction: CommandInteraction) => {
        const selectMenuName = interaction.options.getString('select_menu_name', true);
        const channel = interaction.options.getChannel('channel', true);

        // Check if the selectMenuName exists
        const selectMenu = await SelectMenuService.getSelectMenuByName(selectMenuName);
        if(!selectMenu) {
            return sendHiddenInteractionResponse(interaction, "Le Select Menu que vous voulez envoyer n'existe pas !");
        }

        if(selectMenu.options.length === 0) {
            return sendHiddenInteractionResponse(interaction, "Le Select Menu que vous voulez envoyer n'a pas de champ et ne peut donc pas être envoyé !");
        }

        if(!('send' in channel)) {
            return sendHiddenInteractionResponse(interaction, "Vous ne pouvez pas envoyer de message dans ce channel !");
        }

        try {
            await SelectMenuService.sendASelectMenu(selectMenu, channel);
            return sendHiddenInteractionResponse(interaction, "Le Select Menu a bien été envoyé !");
        } catch (error) {
            console.error(error);
            return sendErrorInteractionResponse(interaction);
        }
    },
    autocomplete: SelectMenuService.autocompleteWithSelectMenuName
}