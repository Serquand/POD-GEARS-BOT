import { ButtonInteraction, ColorResolvable, Message, MessageActionRow, MessageButton, MessageEmbed, Modal, ModalSubmitInteraction, TextInputComponent } from 'discord.js';
import EmbedService from './Embed.service';
import { sendErrorInteractionResponse, sendHiddenInteractionResponse } from '../utils/discord';
import { convertNumberToHexaColor, isValidColor } from '../utils/tools';
import SwiperService from './Swiper.service';
import { Embed } from '../entities/Embed';
import { EmbedField } from '../entities/EmbedField';
import { AppDataSource } from '../database';

export default class UpdateEmbedService {
    static possibleAction = ['thumbnail', 'author', 'title', 'color', 'description', 'add-field', 'remove-field', 'footer', 'image', 'swiper', 'url', 'save'];

    static generateButtonForEmbedModification(customId: string) {
        const updateThumbnailButton = new MessageButton().setCustomId('embed+' + customId + '+thumbnail').setLabel('Modifier le thumbnail').setStyle('PRIMARY');
        const updateAuthorButton = new MessageButton().setCustomId('embed+' + customId + '+author').setLabel('Modifier l\'auteur').setStyle('PRIMARY');
        const updateTitleButton = new MessageButton().setCustomId('embed+' + customId + '+title').setLabel('Modifier le titre').setStyle('PRIMARY');
        const updateColorButton = new MessageButton().setCustomId('embed+' + customId + '+color').setLabel('Modifier la couleur').setStyle('PRIMARY');
        const updateDescriptionButton = new MessageButton().setCustomId('embed+' + customId + '+description').setLabel('Modifier la description').setStyle('PRIMARY');
        const addFieldButton = new MessageButton().setCustomId('embed+' + customId + '+add-field').setLabel('Ajouter un champ').setStyle('PRIMARY');
        const removeFieldButton = new MessageButton().setCustomId('embed+' + customId + '+remove-field').setLabel('Supprimer un champ').setStyle('PRIMARY');
        const updateFooterButton = new MessageButton().setCustomId('embed+' + customId + '+footer').setLabel('Modifier le footer').setStyle('PRIMARY');
        const updateImageButton = new MessageButton().setCustomId('embed+' + customId + '+image').setLabel('Modifier l\'image').setStyle('PRIMARY');
        const updateSwiperButton = new MessageButton().setCustomId('embed+' + customId + '+swiper').setLabel('Modifier le swiper').setStyle('PRIMARY');
        const updateUrlButton = new MessageButton().setCustomId('embed+' + customId + '+url').setLabel('Modifier l\'URL').setStyle('PRIMARY');
        const saveButton = new MessageButton().setCustomId('embed+' + customId + '+save').setLabel('Sauvegarder').setStyle('PRIMARY');

        const firstLine = new MessageActionRow().addComponents(updateThumbnailButton, updateAuthorButton, updateTitleButton, updateColorButton, updateDescriptionButton);
        const secondLine = new MessageActionRow().addComponents(addFieldButton, removeFieldButton, updateFooterButton, updateImageButton, updateSwiperButton);
        const thirdLine = new MessageActionRow().addComponents(updateUrlButton, saveButton);

        return [firstLine, secondLine, thirdLine];
    }

    static getTextInputForActionUpdateModal(action: string, customId: string) {
        if (action === 'thumbnail') {
            const thumbnailInput = new TextInputComponent()
                .setCustomId(customId + '-thumbnail')
                .setLabel('Thumbnail')
                .setRequired(false)
                .setStyle('SHORT')

            // @ts-ignore
            return [new MessageActionRow().addComponents(thumbnailInput)];
        } else if (action === 'author') {
            const authorNameInput = new TextInputComponent()
                .setCustomId(customId + '-authorName')
                .setLabel('Nom de l\'auteur')
                .setRequired(false)
                .setStyle('SHORT')

            const authorIconUrlInput = new TextInputComponent()
                .setCustomId(customId + '-authorIconUrl')
                .setLabel('URL de l\'icone')
                .setRequired(false)
                .setStyle('SHORT')

            const authorUrlInput = new TextInputComponent()
                .setCustomId(customId + '-authorUrl')
                .setLabel('URL de l\'auteur')
                .setRequired(false)
                .setStyle('SHORT')

            return [ // @ts-ignore
                new MessageActionRow().addComponents(authorNameInput), // @ts-ignore
                new MessageActionRow().addComponents(authorIconUrlInput), // @ts-ignore
                new MessageActionRow().addComponents(authorUrlInput),
            ];
        } else if (action === 'title') {
            const titleInput = new TextInputComponent()
                .setCustomId(customId + '-title')
                .setLabel('Titre')
                .setRequired(false)
                .setStyle('SHORT')

            // @ts-ignore
            return [new MessageActionRow().addComponents(titleInput)];
        } else if (action === 'color') {
            const titleInput = new TextInputComponent()
                .setCustomId(customId + '-color')
                .setLabel('Couleur')
                .setRequired(false)
                .setStyle('SHORT')

            // @ts-ignore
            return [new MessageActionRow().addComponents(titleInput)];
        } else if (action === 'description') {
            const titleInput = new TextInputComponent()
                .setCustomId(customId + '-description')
                .setLabel('Description')
                .setRequired(false)
                .setStyle('PARAGRAPH')

            // @ts-ignore
            return [new MessageActionRow().addComponents(titleInput)];
        } else if (action === 'add-field') {
            const nameInput = new TextInputComponent()
                .setCustomId(customId + '-name-field-input')
                .setLabel('Nom du champ')
                .setRequired(false)
                .setStyle('SHORT')

            const valueInput = new TextInputComponent()
                .setCustomId(customId + '-value-field-input')
                .setLabel('Valeur du champ')
                .setRequired(false)
                .setStyle('PARAGRAPH')

            const inline = new TextInputComponent()
                .setCustomId(customId + '-inline-field-input')
                .setLabel('Champ inline ? Réponse : Oui/Non')
                .setRequired(false)
                .setStyle('SHORT')

            return [ // @ts-ignore
                new MessageActionRow().addComponents(nameInput), // @ts-ignore
                new MessageActionRow().addComponents(valueInput), // @ts-ignore
                new MessageActionRow().addComponents(inline)
            ];
        } else if (action === 'remove-field') {
            const titleInput = new TextInputComponent()
                .setCustomId(customId + '-remove-field-name')
                .setLabel('Champ à supprimer')
                .setRequired(false)
                .setStyle('SHORT')

            // @ts-ignore
            return [new MessageActionRow().addComponents(titleInput)];
        } else if (action === 'footer') {
            const textInput = new TextInputComponent()
                .setCustomId(customId + '-footer-text')
                .setLabel('Texte du champ')
                .setRequired(false)
                .setStyle('SHORT')

            const iconUrlInput = new TextInputComponent()
                .setCustomId(customId + '-footer-icon-url')
                .setLabel("URL de l'icône")
                .setRequired(false)
                .setStyle('SHORT')

            return [ // @ts-ignore
                new MessageActionRow().addComponents(textInput), // @ts-ignore
                new MessageActionRow().addComponents(iconUrlInput),
            ];
        } else if (action === 'image') {
            const titleInput = new TextInputComponent()
                .setCustomId(customId + '-image')
                .setLabel('Nouvelle image')
                .setRequired(false)
                .setStyle('SHORT')

            // @ts-ignore
            return [new MessageActionRow().addComponents(titleInput)];
        } else if (action === 'swiper') {
            const titleInput = new TextInputComponent()
                .setCustomId(customId + '-swiper-name')
                .setLabel('Nouveau swiper')
                .setRequired(false)
                .setStyle('SHORT')

            // @ts-ignore
            return [new MessageActionRow().addComponents(titleInput)];
        } else if (action === 'url') {
            const titleInput = new TextInputComponent()
                .setCustomId(customId + '-url')
                .setLabel('URL de l\'Embed')
                .setRequired(false)
                .setStyle('SHORT')

            // @ts-ignore
            return [new MessageActionRow().addComponents(titleInput)];
        }
    }

    static async handleClickOnUpdateEmbedButton(interaction: ButtonInteraction) {
        const action = interaction.customId.split('+')[2];
        const embedUid = interaction.customId.split('+')[1];
        const embed = await EmbedService.getEmbedByUid(embedUid)

        if (!embed || !UpdateEmbedService.possibleAction.includes(action)) return sendErrorInteractionResponse(interaction);
        if (action === 'save') {
            return this.saveModal(interaction, embedUid, interaction.message.embeds[0] as MessageEmbed, interaction.message.content);
        }

        // Submit the modal
        const modal = new Modal()
            .setCustomId(embedUid + '+' + action)
            .setTitle('Modification de l\'Embed') // @ts-ignore
            .setComponents(...UpdateEmbedService.getTextInputForActionUpdateModal(action, embedUid))
        interaction.showModal(modal);
    }

    static async saveModal(interaction: ButtonInteraction, uid: string, messageEmbed: any, content: string) {
        const EmbedFieldRepository = AppDataSource.getRepository(EmbedField);
        const EmbedRepository = AppDataSource.getRepository(Embed);

        const embed = await EmbedService.getEmbedByUid(uid);
        if (!embed) return sendErrorInteractionResponse(interaction);
        const swiperName = content.split("\nSwiper associé à l'Embed : ")[1];
        const swiper = swiperName === 'Aucun' ? undefined : (await SwiperService.getSwiperByName(swiperName));
        if (swiperName !== 'Aucun' && !swiper) {
            return sendHiddenInteractionResponse(interaction, "Le Swiper n'a pas été trouvé !");
        }

        try {
            const newFields = messageEmbed.fields.map((field: EmbedField) => ({
                name: field.name,
                inline: field.inline,
                value: field.value,
                linkedTo: uid,
            }));

            const newModelEmbed = {
                title: messageEmbed.title ?? null,
                authorName: messageEmbed.author?.name ?? null,
                authorIconUrl: messageEmbed.author?.iconURL ?? null,
                authorUrl: messageEmbed.author?.url ?? null,
                color: messageEmbed.color ? convertNumberToHexaColor(messageEmbed.color) : undefined,
                description: messageEmbed.description ?? null,
                imageUrl: (!swiper && messageEmbed.image && messageEmbed.image.url) ? messageEmbed.image.url : null,
                swiper,
                thumbnailUrl: messageEmbed.thumbnail?.url ?? null,
                footerTitle: messageEmbed.footer?.text ?? null,
                footerIconUrl: messageEmbed.footer?.iconURL ?? null,
                embedUrl: messageEmbed.url ?? null,
            };

            if (EmbedService.isEmptyEmbed(newModelEmbed as Embed)) {
                return sendHiddenInteractionResponse(interaction, "L'Embed ne peut pas être vide !");
            }

            await EmbedFieldRepository.delete({ linkedTo: embed });
            await Promise.all([
                EmbedRepository.update({ uid }, newModelEmbed),
                EmbedFieldRepository.save(newFields),
                (interaction.message as Message).delete()
            ]);
            await EmbedService.updateAll(interaction.client, embed.uid);
            return sendHiddenInteractionResponse(interaction, "L'Embed a bien été modifié !");
        } catch (error) {
            console.error(error);
            return sendErrorInteractionResponse(interaction);
        }
    }

    static async handleModalSubmission(interaction: ModalSubmitInteraction) {
        if (!interaction.message) return;

        const embed = interaction.message.embeds[0] as MessageEmbed;
        const toUpdate = interaction.customId.split('+')[1];
        const uid = interaction.customId.split('+')[0];
        let content = interaction!.message!.content;

        if (!UpdateEmbedService.possibleAction.includes(toUpdate)) return sendErrorInteractionResponse(interaction);

        switch (toUpdate) {
            case 'thumbnail':
                embed.setThumbnail(interaction.fields.getTextInputValue(uid + '-thumbnail'))
                break;
            case 'author':
                const author = {
                    name: interaction.fields.getTextInputValue(uid + '-authorName'),
                    url: interaction.fields.getTextInputValue(uid + '-authorUrl'),
                    iconURL: interaction.fields.getTextInputValue(uid + '-authorIconUrl'),
                };
                embed.setAuthor(author);
                break;
            case 'title':
                embed.setTitle(interaction.fields.getTextInputValue(uid + '-title'));
                break;
            case 'color':
                const newColor = interaction.fields.getTextInputValue(uid + '-color');
                if (!isValidColor(newColor)) {
                    return sendHiddenInteractionResponse(interaction, "Vous devez envoyer le code hexadécimal de la couleur souhaitée !");
                }
                embed.setColor(newColor as ColorResolvable);
                break;
            case 'description':
                embed.setDescription(interaction.fields.getTextInputValue(uid + '-description'));
                break;
            case 'add-field':
                const newField = {
                    name: interaction.fields.getTextInputValue(uid + '-name-field-input'),
                    value: interaction.fields.getTextInputValue(uid + '-value-field-input'),
                    inline: interaction.fields.getTextInputValue(uid + '-inline-field-input').toLowerCase() === 'oui',
                };
                embed.addFields(newField);
                break;
            case 'remove-field':
                const fieldNameToDelete = interaction.fields.getTextInputValue(uid + '-remove-field-name');
                const listFields = embed.fields.filter(field => field.name !== fieldNameToDelete);
                embed.setFields(...listFields);
                break;
            case 'footer':
                const footer = {
                    text: interaction.fields.getTextInputValue(uid + '-footer-text'),
                    iconURL: interaction.fields.getTextInputValue(uid + '-footer-icon-url'),
                };
                embed.setFooter(footer);
                break;
            case 'url':
                embed.setURL(interaction.fields.getTextInputValue(uid + '-url'));
                break;
            case 'image':
                content = content.split("\nSwiper associé à l'Embed : ")[0] + "\nSwiper associé à l'Embed : Aucun";
                embed.setImage(interaction.fields.getTextInputValue(uid + '-image'));
                break;
            case 'swiper':
                const swiper = await SwiperService.getSwiperByName(interaction.fields.getTextInputValue(uid + '-swiper-name'));
                if (!swiper) return sendHiddenInteractionResponse(interaction, "Le nom du Swiper est invalide !");
                if (swiper.images.length === 0) return sendHiddenInteractionResponse(interaction, "Le Swiper ne contient pas d'image et ne peut donc pas être utilisé !");

                content = content.split("\nSwiper associé à l'Embed : ")[0] + "\nSwiper associé à l'Embed : " + swiper.name;
                embed.setImage(swiper.images[0].url);

                break;
        }

        try {
            await (interaction.message as Message).edit({
                content,
                embeds: [embed],
                components: UpdateEmbedService.generateButtonForEmbedModification(uid),
            });
        } catch (error) {
            return sendErrorInteractionResponse(interaction);
        }

        return interaction.deferUpdate();
    }
}