// @ts-nocheck

import { Client, CommandInteraction } from "discord.js";
import { sendErrorInteractionResponse } from "../../utils/discord";
import { loadFiles } from "../../utils/handlers";

export default {
    name: 'help',
    group: 'Utils',
    description: 'Show the list of commands and their description',
    async runSlash(client: Client, interaction: CommandInteraction) {
        // Déclaration de variables pour stocker les informations des commandes
        const cachedCommandInformations: Record<string, any> = {};
        const commandGrouped: Record<string, { name: string; id: string }[]> = {};

        if (!interaction.guild) {
            return sendErrorInteractionResponse(interaction);
        }

        try {
            // On récupère les commandes de l'API Discord
            const listCommands = interaction.guild.commands.cache;
            listCommands.forEach(command => cachedCommandInformations[command.name] = command.id);

            // Charger dynamiquement les fichiers de commandes
            const basisLocation = process.env.NODE_ENV === "prod" ? 'dist/' : 'src/'
            const commandFiles = await loadFiles(basisLocation + 'commands');
            for (const commandFile of commandFiles) {
                // Importer la commande depuis le fichier
                const command = (await import(commandFile)).default;
                if (command.isDisabled) continue; // Si la commande est désactivée, on la saute

                const group = command.group ?? 'Non rattaché à un groupe'; // Si aucun groupe n'est défini, "Non rattaché à un groupe"
                const commandId = cachedCommandInformations[command.name];

                const newCommandObject = { name: command.name, id: commandId };

                // Ajouter la commande au groupe approprié
                if (commandGrouped[group]) {
                    commandGrouped[group].push(newCommandObject);
                } else {
                    commandGrouped[group] = [newCommandObject];
                }
            }

            // Créer la chaîne de texte qui contient la liste des commandes
            let content = '## Voici la liste des commandes disponibles\n\n\n';
            for (const group in commandGrouped) {
                content += `### ${group}\n`;
                content += commandGrouped[group]
                    .map(cmd => `- </${cmd.name}:${cmd.id}>`)
                    .join('\n');
                content += '\n\n';
            }

            // Répondre à l'utilisateur avec la liste des commandes
            return interaction.reply({ content, ephemeral: true });

        } catch (exc) {
            // Log de l'erreur et réponse d'erreur
            console.error('Error while fetching commands:', exc);
            return interaction.reply({
                content: 'Une erreur est survenue lors de la récupération des commandes.',
                ephemeral: true
            });
        }
    }
};
