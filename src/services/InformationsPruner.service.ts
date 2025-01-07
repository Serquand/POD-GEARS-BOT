import { Client } from "discord.js";
import { AppDataSource } from "../database";
import { EmbedInChannel } from "../entities/EmbedInChannel";
import { fetchMessage } from "../utils/discord";
import { SelectMenuInChannel } from "../entities/SelectMenuInChannel";

export default class InformationsPruner {
    private client: Client
    constructor(client: Client) {
        this.client = client;
    }

    async removeEmbedSent(embedSentUid: string) {
        console.log(`Removing embed ${embedSentUid} from sent embeds`);
        await AppDataSource
            .getRepository(EmbedInChannel)
            .delete(embedSentUid);
    }

    async removeSelectMenuInChannel(selectMenuSentUid: string) {
        console.log(`Removing select menu ${selectMenuSentUid} from sent select menus`);
        await AppDataSource
            .getRepository(SelectMenuInChannel)
            .delete(selectMenuSentUid);
    }

    async clearEmbedSentInformations() {
        const allEmbedSend = await AppDataSource.getRepository(EmbedInChannel).find();
        allEmbedSend.map(async (embedSend) => {
            const messageToUpdate = await fetchMessage(this.client, embedSend.channelId, embedSend.messageId);
            if (!messageToUpdate) this.removeEmbedSent(embedSend.uid);
        });
    }

    async clearSelectMenuSentInChannel() {
        const allSelectMenuSent = await AppDataSource.getRepository(SelectMenuInChannel).find();
        allSelectMenuSent.map(async (selectMenuSent) => {
            const messageToUpdate = await fetchMessage(this.client, selectMenuSent.channelId, selectMenuSent.messageId);
            if (!messageToUpdate) this.removeSelectMenuInChannel(selectMenuSent.uid);
        });
    }

    async clearAll() {
        await this.clearEmbedSentInformations();
        await this.clearSelectMenuSentInChannel();
    }
}