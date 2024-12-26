import "reflect-metadata";
import * as dotenv from "dotenv";
dotenv.config();

import { initializeDatabase } from "./database";
import { Client, Collection } from "discord.js";
import { commandHandler, eventHandler } from "./utils/handlers";
import RefreshSwiper from "./services/RefreshSwiper.service";

async function main() {
    const client = new Client({ intents: 3276799 });
    // @ts-ignore
    client.commands = new Collection();
    client.login(process.env.BOT_TOKEN);

    await Promise.all([ eventHandler(client), commandHandler(client) ]);

    await initializeDatabase();

    new RefreshSwiper(client);
}

main();

// delete_swiper => Update Embed / Synchronize Embed sent
// add_option_select_menu => Update SM / Synchronize SM
// delete_select_menu => Delete Sent SM
// remove_option_select_menu => Update SM / Synchronize SM
// update_select_menu => Update SM / Synchronize SM
// delete_embed => Delete sent Embed / Update SM / Synchronize SM
// update_embed => Update Embed / Synchronize Embed sent