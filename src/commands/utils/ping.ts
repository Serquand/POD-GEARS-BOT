import { Client, CommandInteraction } from "discord.js";

const command = {
    name: 'ping',
    description: "Reply with pong !",
    group: "Utils",
    runSlash: (client: Client, interaction: CommandInteraction) => {
        return interaction.reply("Pong !");
    }
}

export default command;