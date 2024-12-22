import { Client, Interaction } from "discord.js";
import { sendErrorInteractionResponse } from "../utils/discord";

export default {
    name: "interactionCreate",
    once: false,
    async execute(client: Client, interaction: Interaction) {
        if(interaction.isCommand()) {
            // @ts-ignore
            const cmd = client.commands.get(interaction.commandName);
            if(!cmd) {
                return interaction.reply({
                    content: "Cette commande n'existe pas",
                    ephemeral: true,
                });
            }
            cmd.runSlash(client, interaction);
        } else if(interaction.isAutocomplete()) {
            // @ts-ignore
            const command = client.commands.get(interaction.commandName);
            try {
                if (!command) {
                    throw new Error(`No command matching ${interaction.commandName} was found.`);
                }
                await command.autocomplete(interaction);
            } catch (error) {
                console.error(error);
            }
        }
        // else if (interaction.isModalSubmit()) {
        //     return getEmbedUpdaterManager().handleModalSubmission(interaction);
        // } else if(interaction.type === 'MESSAGE_COMPONENT') {
        //     if(interaction.isSelectMenu()) {
        //         const selectMenu = getSelectMenuInChannelByCustomId(interaction.customId);
        //         if (selectMenu === undefined) return sendErrorInteractionResponse(interaction);
        //         return selectMenu.respondToInteraction(interaction, client);
        //     } else if (interaction.isButton()) {
        //         if(interaction.customId.startsWith('embed')) {
        //             return getEmbedUpdaterManager().handleInteraction(interaction);
        //         } else {
        //             const interactionManager = getEmbedInteractManager();
        //             if (!interactionManager || Object.values(interactionManager.allInteractions).length === 0) {
        //                 return sendErrorInteractionResponse(interaction);
        //             } else {
        //                 return interactionManager.handleInteraction(interaction);
        //             }
        //         }
        //     }
        // }
    }
}