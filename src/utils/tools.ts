export function isValidColor(color: string) {
    if(!color.startsWith('#') || !(color.split('#').length === 2) || color.length !== 7) return false;
    const codeHexa = color.split('#')[1];
    const codeDeci = parseInt(codeHexa, 16);
    return codeDeci >= 0 && codeDeci <= 16777215;
}

export const convertNumberToHexaColor = (number: number) => {
    return '#' + number.toString(16);
};

export const isValidCustomEmoji = (emoji: string) => {
    const customEmojiPattern = /<a?:(\w+):(\d{18})>/;
    return customEmojiPattern.test(emoji);
};

export const isValidUnicodeEmoji = (emoji: string) => {
    const unicodeEmojiPattern = /^([\u2700-\u27bf\u2300-\u23ff\u2b50\u2934\u20e3\u20f0\u200d\u2600-\u26ff\u26f0-\u27ff\u2740-\u274f\u2b06\u2194\ufe0f\u02b0]|[\u1f000-\u1f6ff]|[\u1f700-\u1f77f])$/;
    return unicodeEmojiPattern.test(emoji);
};

export const isValidEmoji = (emoji: string) => {
    return (isValidCustomEmoji(emoji) || isValidUnicodeEmoji(emoji));
}