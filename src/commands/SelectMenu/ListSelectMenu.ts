import { Client, CommandInteraction } from "discord.js";
import SelectMenuService from "../../services/SelectMenu.service";
import { sendHiddenInteractionResponse } from "../../utils/discord";

export default {
    name: 'list_select_menu',
    group: 'Select Menu',
    description: "Liste tous les Select Menus",
    runSlash: async (client: Client, interaction: CommandInteraction) => {
        const allSelectMenus = await SelectMenuService.getListSelectMenu()
        const content = '**Voici la liste des Select Menus :** \n' + allSelectMenus.map((sm) => '- ' + sm.name).join('\n');

        return sendHiddenInteractionResponse(interaction, content);
    }
}