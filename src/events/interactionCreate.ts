import { Client, Interaction } from "discord.js";
import { sendErrorInteractionResponse } from "../utils/discord";
import UpdateEmbedService from "../services/UpdateEmbed.service";
import SelectMenuInteractionHandler from "../services/SelectMenuInteractionHandler.service";
import EmbedInteractionHandler from "../services/EmbedInteract.service";

export default {
    name: "interactionCreate",
    once: false,
    async execute(client: Client, interaction: Interaction) {
        if (interaction.isCommand()) {
            // @ts-ignore
            const cmd = client.commands.get(interaction.commandName);
            if (!cmd) {
                return interaction.reply({
                    content: "Cette commande n'existe pas",
                    ephemeral: true,
                });
            }
            cmd.runSlash(client, interaction);
        } else if (interaction.isAutocomplete()) {
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
        } else if (interaction.type === 'MESSAGE_COMPONENT') {
            if (interaction.isSelectMenu()) {
                return SelectMenuInteractionHandler.respondToInteraction(interaction);
            } else if (interaction.isButton()) {
                if (interaction.customId.startsWith('embed')) {
                    return UpdateEmbedService.handleClickOnUpdateEmbedButton(interaction);
                } else {
                    const embedInteractionHandler = new EmbedInteractionHandler(interaction);
                    try {
                        await embedInteractionHandler.fetchEmbed();
                        embedInteractionHandler.updateEmbedSent();
                    } catch {
                        return sendErrorInteractionResponse(interaction);
                    }
                }
            }
        }
        else if (interaction.isModalSubmit()) {
            return UpdateEmbedService.handleModalSubmission(interaction);
        }
    }
}