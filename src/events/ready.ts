import { Client } from "discord.js";
import discordConfig from "../config/discord.config";

export default {
    name: "ready",
    once: true,
    async execute (client: Client) {
        const allGuilds = discordConfig.guilds;
        for(const guildId of allGuilds) {
            const guild = client.guilds.cache.get(guildId);
            if(!guild) continue;
            // @ts-ignore
            guild.commands.set(client.commands.map((cmd) => cmd));
        }

        console.log("Bot launched !");
    }
}