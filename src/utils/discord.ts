export const sendHiddenInteractionResponse = (interaction: any, content: string) => {
    return interaction.reply({ content, ephemeral: true });
}

export const sendErrorInteractionResponse = (interaction: any) => {
    return sendHiddenInteractionResponse(interaction, "Something bad happened !");
}