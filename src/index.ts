import "reflect-metadata";
import * as dotenv from "dotenv";
dotenv.config();

import { initializeDatabase } from "./database";
import { Client, Collection } from "discord.js";
import { commandHandler, eventHandler } from "./utils/handlers";

async function main() {
    const client = new Client({ intents: 3276799 });
    // @ts-ignore
    client.commands = new Collection();
    client.login(process.env.BOT_TOKEN);

    await Promise.all([ eventHandler(client), commandHandler(client) ]);

    await initializeDatabase();
}

main();
