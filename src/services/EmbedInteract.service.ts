import { ButtonInteraction } from "discord.js";
import { Embed } from "../entities/Embed";
import EmbedService from "./Embed.service";
import SelectMenuInteractionHandler from "./SelectMenuInteractionHandler.service";

export default class EmbedInteractionHandler {
    interaction: ButtonInteraction
    interactionCustomId: string;
    action: string;
    embedId: string;
    currentImageIndex: number;
    embed!: Embed;
    futureIndex!: number;

    constructor (interaction: ButtonInteraction) {
        this.interaction = interaction;
        this.interactionCustomId = interaction.customId;
        const splittedInteractionCustomId = this.interactionCustomId.split("+");
        this.action = splittedInteractionCustomId[1];

        const [embedId, currentImageIndex] = splittedInteractionCustomId[0].split(".");
        this.currentImageIndex = parseInt(currentImageIndex);
        this.embedId = embedId;
    }

    async updateEmbedSent() {
        const embedToSend = EmbedService.generateEmbed(this.embed);
        if(!embedToSend) throw new Error();

        this.findNextIndex();
        const nextImageUrl = this.findNextImageUrl();
        embedToSend.setImage(nextImageUrl);

        const buttonsToSwitch = SelectMenuInteractionHandler.generateButtonToSwitchSwiperImage(this.embedId, this.futureIndex);
        const components = this.embed.swiper ? [buttonsToSwitch] : undefined;

        this.interaction.update({ embeds: [embedToSend], content: undefined, components });
    }

    async fetchEmbed() {
        const fetchedEmbed = await EmbedService.getEmbedByUid(this.embedId);
        if(!fetchedEmbed) {
            throw new Error("Embed not found");
        }
        this.embed = fetchedEmbed;
    }

    findNextIndex() {
        const currentIndex: number = this.currentImageIndex;
        const swiperLength = this.embed.swiper!.images.length;

        if(currentIndex === undefined || Number.isNaN(currentIndex)) {
            this.futureIndex = 0;
        } else {
            this.futureIndex = this.action === "previous" ?
                (currentIndex - 1 + swiperLength) % swiperLength :
                (currentIndex + 1) % swiperLength;
        }
    }

    findNextImageUrl() {
        return this.embed.swiper!.images[this.futureIndex].url;
    }
}