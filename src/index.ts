import "reflect-metadata";
import * as dotenv from "dotenv";
dotenv.config();

import { initializeDatabase } from "./database";
import { Client, Collection } from "discord.js";
import { commandHandler, eventHandler } from "./utils/handlers";
import RefreshSwiper from "./services/RefreshSwiper.service";
import cron from "node-cron";

const CRON_INTERVAL = "* * * * *";
let isDatabaseSetup = false;

const refreshSwiper = new RefreshSwiper();

async function main() {
    const client = new Client({ intents: 3276799 });
    // @ts-ignore
    client.commands = new Collection();
    client.login(process.env.BOT_TOKEN);

    await Promise.all([ eventHandler(client), commandHandler(client) ]);

    cron.schedule(CRON_INTERVAL, async () => {
        isDatabaseSetup && refreshSwiper.refreshAllSwiper(client);
    });

    setInterval(async () => {
        await initializeDatabase();
        isDatabaseSetup = true;
    }, 3000);

}

main();