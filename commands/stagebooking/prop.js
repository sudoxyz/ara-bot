const WeebCommand = require('@base/WeebCommand.js');
const defaultError = require('@utils/defaultError');
const {
  MessageActionRow,
  MessageSelectMenu,
  MessageButton,
} = require('discord.js');
const { ARA } = require('@utils/ara.js');
const getChannelFromMention = require('@utils/getChannel.js');

module.exports = class prop extends WeebCommand {
  constructor(client) {
    super(client, {
      name: 'prop',
      description: `Used to create a debate proposition`,
      usage: `${client.config.prefix}propS`,
      aliases: ['debateme', 'proposition'],
      permLevel: 'Vegan',
    });
  }

  async run(message, args) {
    try {
      const messagesToDelete = [];
      const debateTypes = [
        {
          label: 'Serious',
          description: 'This position is one you genuinely hold.',
          extra: `All arguments used in a serious debate should be good-faith, and represent positions held by the debator.`,
          value: 'Serious',
          extraInformationPrompt:
            'Type out your debate proposition as concisely as possible.',
        },
        {
          label: 'Mock',
          description: 'This position is one you do not genuinely hold.',
          extra: `Arguments used in a mock debate do not need to represent positions held by the debator.`,
          value: 'Mock',
          extraInformationPrompt:
            'Type out your debate proposition as concisely as possible.',
        },
        {
          label: 'Cancel',
          description: 'End the process',
          extra: 'Cancels the debate proposition creation process.',
          value: 'cancel',
        },
      ];
      const row = new MessageActionRow().addComponents(
        new MessageSelectMenu()
          .setCustomId(`${message.author.id}-prop`)
          .setPlaceholder('Nothing selected')
          .addOptions(debateTypes),
      );
      const msg = await message.reply({
        embeds: [
          {
            author: {
              name: message.guild.name,
              iconURL: this.client.user.displayAvatarURL(),
            },
            color: 'RANDOM',
            description:
              ':seedling: Please select the type of debate below.',
            thumbnail: { url: message.guild.iconURL() },
            title: ':pushpin: Debate Proposition Creation',
          },
        ],
        components: [row],
      });

      const collector = await msg.createMessageComponentCollector({
        filter: (interaction) =>
          interaction.customId === `${message.author.id}-prop`,
        idle: 900_000,
      });

      collector.on('collect', async (selectorMenuInteraction) => {
        const debateType = selectorMenuInteraction.values[0];
        if (debateType === 'cancel') {
          collector.stop('cancelled');
          return;
        }
        if (selectorMenuInteraction.member.id === message.author.id) {
            const channel = getChannelFromMention(message, ARA.text.vegan.debatePropositions);
            await selectorMenuInteraction.deferUpdate()
            .then(() =>
                selectorMenuInteraction.editReply({
                    embeds: [
                    {
                        author: {
                        name: message.guild.name,
                        iconURL: this.client.user.displayAvatarURL(),
                        },
                        color: 'RANDOM',
                        description:
                        debateType === 'Serious'
                            ? `You have selected **Serious**`
                            : 'You have selected **Mock**',
                        footer: {
                        text:
                            'Please enter your debate proposition in plain text below (without the command or command prefix).',
                        },
                        thumbnail: { url: message.guild.iconURL() },
                        title: 'Debate Proposition Creation',
                    },
                    ],
                    components: [],
                }),
                )
            message
                .reply(
                debateTypes.find((option) => option.value === debateType)
                    .extraInformationPrompt ??
                    `Type out your debate proposition as concisely as possible.`,
                { fetchReply: true },
                )
                .then((awaitingMessage) =>
                Promise.all([
                    selectorMenuInteraction.channel.awaitMessages({
                    filter: (caughtMessage) =>
                        caughtMessage.author.id === message.author.id,
                    max: 1,
                    time: 600_000,
                    }),
                    awaitingMessage,
                ]),
                )
                .then(([collectedResponse, awaitingMessage]) =>
                Promise.all([
                    message
                    .reply({
                        components: [
                        new MessageActionRow().addComponents(
                            new MessageButton()
                            .setCustomId('yes')
                            .setStyle('SUCCESS')
                            .setLabel('✓'),
                            new MessageButton()
                            .setCustomId('no')
                            .setStyle('DANGER')
                            .setLabel('X'),
                        ),
                        ],
                        content: 'Would you like to make this Debate Proposition?',
                        embeds: [
                        {
                            author: {
                            name: message.author.tag,
                            url: message.url,
                            iconURL: message.author.displayAvatarURL(),
                            },
                            color: 'RANDOM',
                            title: `[${debateType}] ${collectedResponse?.first()?.content?.substring(0, 500)}`,
                        },
                        ],
                    })
                    .then((approvalMessage) =>
                        approvalMessage.awaitMessageComponent({
                        filter: (interaction) =>
                            interaction.member.id === message.member.id,
                        }),
                    )
                    .then((approvalInteraction) =>
                        Promise.resolve(
                        approvalInteraction.customId === 'yes'
                            ? approvalInteraction.message.delete().then(() =>
                                channel
                                .send({
                                    embeds: [
                                    {
                                        author: {
                                        name: message.author.tag,
                                        url: message.url,
                                        iconURL: message.author.displayAvatarURL(),
                                        },
                                        color: 'RANDOM',
                                        title: `[${debateType}] ${collectedResponse?.first()?.content?.substring(0, 500)}`,
                                    },
                                    ],
                                })
                                .then((mirroredMessage) => {
                                    mirroredMessage.react(mirroredMessage.guild.emojis.cache.get("788130338756100168"));
                                    mirroredMessage.react('🇦');
                                    mirroredMessage.react('🅱️');
                                }),
                            )
                            .then(() => message.reply(`Your proposition has been created. Please check the ${channel} channel! You've been awarded 10 ARA!`))
                            .then(() => this.client.dbusers.addBalance(message.author.id, 10,))
                            : Promise.all([
                                approvalInteraction.message.delete(),
                                this.client.dbusers.removeApplication(
                                message.member.id,
                                debateType,
                                ),
                            ])
                            .then(() => message.reply(`Your proposition has been cancelled.`)),
                        ).then(() => approvalInteraction),
                    ),
                    collectedResponse?.first()?.delete(),
                    awaitingMessage.delete(),
                ]).then(([approvalInteraction]) => approvalInteraction),
                )
                .then((approvalInteraction) =>
                selectorMenuInteraction.editReply({
                    embeds: [
                    {
                        author: {
                        name: message.guild.name,
                        iconURL: this.client.user.displayAvatarURL(),
                        },
                        color: 'RANDOM',
                        description:
                        approvalInteraction.customId === 'yes'
                            ? `Debate Proposition Created!`
                            : 'Debate Proposition Creation cancelled!',
                        footer: {
                        text:
                            approvalInteraction.customId === 'yes'
                            ? 'Thank you for creating your debate proposition.'
                            : 'Thank you!',
                        },
                        thumbnail: { url: message.guild.iconURL() },
                        title: 'Debate Proposition Creation',
                    },
                    ],
                    components: [],
                }),
                )
                .then(() => message.react('✅'))
                .catch((err) => defaultError(err, message, this.client));
        }
      });

      collector.on('end', async () => {
        await Promise.all(
          messagesToDelete
            .map((rawDeletableMessage) => rawDeletableMessage.delete())
            .concat([msg.delete()]),
        );
      });
    } catch (error) {
      defaultError(error, message, this.client);
    }
  }
};
