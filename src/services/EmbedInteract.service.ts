import { ButtonInteraction } from "discord.js";
import { Embed } from "../entities/Embed";
import EmbedService from "./Embed.service";

export default class EmbedInteractionHandler {
    interaction: ButtonInteraction
    interactionCustomId: string;
    action: string;
    embedId: string;
    embed!: Embed;

    constructor (interaction: ButtonInteraction) {
        this.interaction = interaction;
        this.interactionCustomId = interaction.customId;
        const [embedId, action] = this.interactionCustomId.split("+");
        this.action = action;
        this.embedId = embedId;
    }

    async updateEmbedSent() {
        const embedToSend = EmbedService.generateEmbed(this.embed);
        if(!embedToSend) throw new Error();

        const nextImageUrl = this.findNextImageUrl();
        embedToSend.setImage(nextImageUrl);

        this.interaction.update({ embeds: [embedToSend], content: undefined });
    }

    async fetchEmbed() {
        const fetchEmbed = await EmbedService.getEmbedByUid(this.embedId);
        if(!fetchEmbed) throw new Error("Embed not found");
        this.embed = fetchEmbed;
    }

    findNextImageUrl() {
        let futureIndex: number;
        const currentImageUrl = this.interaction.message.embeds[0].image?.url;
        const currentIndex: number = this.embed.swiper!.images.findIndex(image => image.url === currentImageUrl);
        const swiperLength = this.embed.swiper!.images.length;
        if(this.action === "previous") {
            const previousIndex = currentIndex - 1;
            if(previousIndex < 0) futureIndex = swiperLength - 1;
            else futureIndex = previousIndex;
        } else {
            futureIndex = (currentIndex + 1) % swiperLength;
        }

        return this.embed.swiper!.images[futureIndex].url;
    }
}