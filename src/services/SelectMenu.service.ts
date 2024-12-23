import { AutocompleteInteraction, Client, MessageActionRow, MessageSelectMenu, TextBasedChannel } from "discord.js";
import { AppDataSource } from "../database";
import { SelectMenu } from "../entities/SelectMenu";
import { deleteMessage } from "../utils/discord";
import { sendAutocomplete } from "../utils/autocomplete";
import { SelectMenuOption } from "../entities/SelectMenuOptions";
import { SelectMenuInChannel } from "../entities/SelectMenuInChannel";
import { v4 } from "uuid";

export default class SelectMenuService {
    uid: string | null;
    name: string | null;
    selectMenu!: SelectMenu | null;

    constructor(uid: string | null, name: string | null) {
        this.uid = uid;
        this.name = name;
    }

    async fetchSelectMenu(): Promise<void> {
        if (this.uid || this.name) {
            const whereClause: Partial<SelectMenu> = {};

            if (this.uid) whereClause.uid = this.uid;
            if (this.name) whereClause.name = this.name;

            this.selectMenu = await AppDataSource
                .getRepository(SelectMenu)
                .findOne({ where: whereClause });
        }
    }

    static async saveSelectMenuInChannel(infoToSave: Partial<SelectMenuInChannel>) {
        return await AppDataSource
            .getRepository(SelectMenuInChannel)
            .save(infoToSave);
    }

    static generateSelectMenu(selectMenu: SelectMenu, uid: string) {
        const optionsToSend = selectMenu.options.map((option) => ({
            label: option.label,
            value: option.needToSend.name,
            description: option.description,
            emoji: option.emoji,
        }));

        return new MessageSelectMenu()
            .setOptions(...optionsToSend)
            .setCustomId(uid)
            .setPlaceholder(selectMenu.placeholder)
    }

    static async sendASelectMenu(selectMenu: SelectMenu, channel: TextBasedChannel) {
        const uid = v4();
        const component = new MessageActionRow().addComponents(SelectMenuService.generateSelectMenu(selectMenu, uid));
        const message = await channel.send({ components: [component] });
        await SelectMenuService.saveSelectMenuInChannel({ channelId: channel.id, linkedTo: selectMenu, messageId: message.id, uid })
    }

    static async removeOptionFromSelectMenu(selectMenu: SelectMenu, label: string) {
        return await AppDataSource
            .getRepository(SelectMenuOption)
            .delete({ linkedTo: selectMenu, label })
    }

    static async getListSelectMenu() {
        return await AppDataSource.getRepository(SelectMenu).find();
    }

    static async updateSelectMenu(selectMenuId: string, newSelectMenu: Partial<SelectMenu>) {
        return await AppDataSource
            .getRepository(SelectMenu)
            .update(selectMenuId, newSelectMenu)
    }

    static async getSelectMenuByName(selectMenuName: string) {
        return await AppDataSource
            .getRepository(SelectMenu)
            .findOne({ where: { name: selectMenuName }, relations: ["options", "inChannels"] });
    }

    static async addSelectMenuOptions(selectMenuOption: Omit<SelectMenuOption, "uid">) {
        return await AppDataSource
            .getRepository(SelectMenuOption)
            .save(selectMenuOption);
    }

    static async createSelectMenu(selectMenuToCreate: Partial<SelectMenu>) {
        return await AppDataSource
            .getRepository(SelectMenu)
            .save(selectMenuToCreate)
    }

    static async deleteAllSentSelectMenu(client: Client, selectMenu: SelectMenu) {
        selectMenu.inChannels.forEach((selectMenuSent) => {
            deleteMessage(client, selectMenuSent.channelId, selectMenuSent.messageId)
        });
    }

    static async autocompleteWithOptionName(interaction: AutocompleteInteraction) {
        const selectMenuName = interaction.options.getString('select_menu_name', true);
        const selectMenu = await SelectMenuService.getSelectMenuByName(selectMenuName);
        if (!selectMenu) return interaction.respond([]);
        return sendAutocomplete(interaction, selectMenu.options.map(option => option.label));
    }

    static async autocompleteWithSelectMenuName(interaction: AutocompleteInteraction) {
        const selectMenuList = await SelectMenuService.getListSelectMenu();
        return sendAutocomplete(interaction, selectMenuList.map(selectMenuL => selectMenuL.name));
    }

    static async deleteSelectMenuByUid(uid: string) {
        return await AppDataSource
            .getRepository(SelectMenu)
            .delete(uid);
    }
}