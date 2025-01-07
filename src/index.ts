import "reflect-metadata";
import * as dotenv from "dotenv";
dotenv.config();

import { initializeDatabase } from "./database";
import { Client, Collection } from "discord.js";
import { commandHandler, eventHandler } from "./utils/handlers";
import RefreshSwiper from "./services/RefreshSwiper.service";
import cron from "node-cron";
import InformationsPruner from "./services/InformationsPruner.service";

const CRON_REFRESH_SWIPER = "*/10 * * * * *";
const CRON_PRUNE_INFORMATIONS = "*/10 * * * *";
let isDatabaseSetup = false;

async function main() {
    const client = new Client({ intents: 3276799 });
    // @ts-ignore
    client.commands = new Collection();
    client.login(process.env.BOT_TOKEN);

    const refreshSwiper = new RefreshSwiper(client);
    const informationsPruner = new InformationsPruner(client);

    await Promise.all([ eventHandler(client), commandHandler(client) ]);

    cron.schedule(CRON_REFRESH_SWIPER, async () => {
        isDatabaseSetup && refreshSwiper.refreshAllSwiper();
    });

    cron.schedule(CRON_PRUNE_INFORMATIONS, async () => {
        isDatabaseSetup && informationsPruner.clearAll();
    });

    setInterval(async () => {
        await initializeDatabase();
        isDatabaseSetup = true;
    }, 3000);
}

main();