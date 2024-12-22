export function isValidColor(color: string) {
    if(!color.startsWith('#') || !(color.split('#').length === 2) || color.length !== 7) return false;
    const codeHexa = color.split('#')[1];
    const codeDeci = parseInt(codeHexa, 16);
    return codeDeci >= 0 && codeDeci <= 16777215;
}

export const convertNumberToHexaColor = (number: number) => {
    return '#' + number.toString(16);
};