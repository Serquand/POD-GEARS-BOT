import { Channel, MessageActionRow, MessageSelectMenu, TextBasedChannel } from "discord.js";

export function isValidColor(color: string) {
    if (!color.startsWith('#') || !(color.split('#').length === 2) || color.length !== 7) return false;
    const codeHexa = color.split('#')[1];
    const codeDeci = parseInt(codeHexa, 16);
    return codeDeci >= 0 && codeDeci <= 16777215;
}

export const convertNumberToHexaColor = (number: number) => {
    return '#' + number.toString(16);
};

export async function isGoodEmoji(channel: TextBasedChannel | null, emoji: any): Promise<boolean> {
    try {
        const component = new MessageActionRow()
            .addComponents(new MessageSelectMenu()
                .setOptions({ label: 'Test', value: 'Test', emoji })
                .setCustomId('customId')
                .setPlaceholder('Test')
            )

        // @ts-ignore
        const message = await channel.send({ components: [component] });
        await message.delete();
        return true;
    } catch {
        return false;
    }
}
