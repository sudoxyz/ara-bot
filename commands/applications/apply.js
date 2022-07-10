const WeebCommand = require('@base/WeebCommand.js');
const defaultError = require('@utils/defaultError');
const {
  MessageActionRow,
  MessageSelectMenu,
  MessageButton,
} = require('discord.js');
const { IDs } = require('@utils/ids.js');

module.exports = class apply extends WeebCommand {
  constructor(client) {
    super(client, {
      name: 'apply',
      description: `Used to apply for a position\n
             To get an explanation of a role: Usage ${client.config.prefix}apply help <role>`,
      usage: `${client.config.prefix}apply [channelId/#channel]`,
      aliases: [],
      permLevel: 'Vegan',
    });
  }

  async run(message, args) {
    return message.reply(message.content.includes('mod') ? 'The application system is being rewritten!\n For now, you can apply at this link for Mod:\n\n https://forms.gle/Yb61AiD5SZkirnZA8' :
      'The application system is being rewritten!\n For now, reach out to the appropriate coordinator in <#919484410825424916> or by DM.\n\n For Mod, you can apply at this link:\n https://forms.gle/Yb61AiD5SZkirnZA8',
    );
    /*try {
      const messagesToDelete = [];
      const roleOptions = [
        {
          label: 'Table Top Gamer',
          description: 'People who are interested in DnD and other TTG events.',
          extra: `This role is for people who are interested in DnD and other TTG events, which will be hosted on ARA.`,
          value: 'ttg',
          extraInformationPrompt:
            '***Please Copy The Following And Answer In Your Next Message:***\nRoll20 tag name:\nWhat games have you played?\nWhat Race/Class/Background are you looking to play in DnD?\nWrite a one-sentence backstory:\nHow Well do you play with others?\nWhat is your reason for adventuring?',
        },
        {
          label: 'Verifier',
          description: 'Verify people who join the server',
          extra: `This role gives you access to the verification area within the server. With this access you will be tasked with asking a series of questions to new joiners to the server who claim to be vegan.`,
          value: 'verifier',
        },
        {
          label: 'Veg Support',
          description: 'Support new vegans and non-vegans',
          extra: `This role gives you access to the help me go vegan section of the server. You will be involved in giving advice and help to users with the veg curious role.`,
          value: 'veg-support',
        },
        {
          label: 'Outreach Leader',
          description: 'Lead discord outreach',
          extra: `This role gives you the ability to run outreach groups during scheduled or unscheduled outreach.`,
          value: 'outreachleader',
        },
        {
          label: 'Developer',
          description: 'Help program ARABot (TypeScript)',
          extra:
            'This role gives you access to the developer section of the server, and gives you the ability to contribute to the development of ARABot. We are looking for TypeScript developers to help us.',
          value: 'dev',
        },
        {
          label: 'Game Night Host',
          description: 'Host a game night',
          extra:
            'This role involves setting up game nights. Ideas like .io game nights, tournaments, VRChat, or whatever you might imagine apply',
          value: 'Game Night Host',
        },
        {
          label: 'Vegan Debate Host',
          description: 'Help setup Vegan vs Vegan debates',
          extra:
            'This role will require you to help us set up Vegan-vs-Vegan debates and manage the debate propositions channel. You may be required to moderate the debates as well.',
          value: 'Vegan Debate Host',
        },
        {
          label: 'Mock Debate Workshopper',
          description: 'Host mock debate sessions',
          extra:
            'This role involves setting up mock debates. You will help us find people who can role play as carnists, or do so yourself. You may be required to help explain how to respond to the mock arguments.',
          value: 'Mock Debate Workshopper',
        },
        {
          label: 'Video Editor',
          description: 'Help with the ARA Youtube channel',
          extra:
            'This role will be for people capable of doing video editing for ARA’s YouTube channel.',
          value: 'Video Editor',
        },
        {
          label: 'Digital Art/Graphic Design',
          description: 'Help with ARA graphics',
          extra:
            'This role is for people capable of illustrating media content for ARA’s social media accounts and various projects.',
          value: 'Digital Art/Graphic Design',
        },
        {
          label: 'Writer/Proofreader',
          description: 'Help draft ARA content',
          extra:
            'Help ARA draft announcements and captions for our social media posts. ',
          value: 'Writer/Proofreader',
        },
        {
          label: 'Archiver',
          description: 'Record ARA Events',
          extra:
            'This role is for people who are capable of recording several VCs, Events, and Stages here on ARA.',
          value: 'Archiver',
        },
        {
          label: 'Media Team',
          description: 'Help with ARA media initiatives',
          extra: `This role marks that you are part of the ara media team involved in creating art/other works for the ara team to use.`,
          value: 'mediateam',
        },
        {
          label: 'Restricted User Access',
          description: 'Deal with restricted users (18+)',
          extra: `This role gives you access to the restricted human rights section which is where we send users who demonstrate a lack of care about human rights issues such as the rights of LGBTQIA+ people and or racism, sexism or any of the other forms of discrimination we condemn.`,
          value: 'restrictaccess',
        },
        {
          label: 'B12',
          description: 'Handle cases related to non-vegan users',
          extra: `This role is a minimod role giving you the ability to moderate the non-vegan section. This involves restricting non-vegans and ensuring that the non-vegan section is productive.`,
          value: 'b12',
        },
        {
          label: 'Stage Host',
          description: 'Host stages',
          extra: `This role gives you access to start and partake in stages as a host. In order to get this role someone from the mod team will have to view you complete a mock discussion/debate. Please try to take part in server workshops and be active in vcs to give you the best chance of getting this role.`,
          value: 'stagehost',
        },
        {
          label: 'VR Chat Host',
          description: 'Host VRChat Community Nights and Outreach',
          extra:
            'This role signifies that you will lead community building or outreach in VR Chat',
          value: 'VR Chat Host',
        },
        {
          label: 'Other',
          description: 'Write out an application yourself',
          extra: 'Send us your own idea for a role in ARA.',
          value: 'Other Role',
          extraInformationPrompt:
            'Because you selected Other, please explain your proposal and why you would be a good fit for it briefly in one message.',
        },
        {
          label: 'Cancel',
          description: 'End the application process',
          extra: 'Cancels the application process.',
          value: 'cancel',
        },
      ];
      if (args[0] === 'help') {
        message.reply(
          args[1]
            ? roleOptions.find(
                (role) => role.label.toLowerCase() === args[1].toLowerCase(),
              )?.extra ?? `No role called ${args[1]} found`
            : `To get further details on an application:\n\`\`\`${
                this.client.config.prefix
              }apply help <role>\`\`\`\nFor example: \`${
                this.client.config.prefix
              }apply help ${roleOptions.at(0).label}\``,
        );
        return;
      }
      const row = new MessageActionRow().addComponents(
        new MessageSelectMenu()
          .setCustomId(`${message.author.id}-role-select`)
          .setPlaceholder('Nothing selected')
          .addOptions(roleOptions),
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
              'Please select one of the available tasks below to begin an application.',
            footer: {
              text: 'Thank you for taking an interest in helping out at ARA!',
            },
            thumbnail: { url: message.guild.iconURL() },
            title: 'Apply To Help Out At Animal Rights Advocates',
          },
        ],
        components: [row],
      });

      const collector = await msg.createMessageComponentCollector({
        filter: (interaction) =>
          interaction.customId === `${message.author.id}-role-select`,
        idle: 900_000,
      });

      collector.on('collect', async (selectorMenuInteraction) => {
        const roleName = selectorMenuInteraction.values[0];
        if (roleName === 'cancel') {
          collector.stop('cancelled');
          return;
        }
        const appliedAlready = await this.client.dbusers.setApplication(
          message.member.id,
          roleName,
        );
        if (appliedAlready) {
          if (messagesToDelete.length < 1) {
            messagesToDelete.push(
              await message.channel.send(
                `No need to resubmit your application for ${roleName}! We have received it and we'll be sure to reach out with further steps when/if you are considered for this role. Thank you for your interest.`,
              ),
            );
          }
          await selectorMenuInteraction.update({
            content: `Apply for a different role?`,
            components: [row],
          });
        } else {
          const channel =
            message.guild.channels.cache.find(
              (guildChannel) =>
                guildChannel.name === roleName &&
                guildChannel.parentId === IDs.chat.occupationCategory,
            ) ??
            message.guild.channels.cache.find(
              (guildChannel) => guildChannel.name === 'other',
            );
          await selectorMenuInteraction.deferUpdate();
          message
            .reply(
              roleOptions.find((option) => option.value === roleName)
                .extraInformationPrompt ??
                `Would you like to add any extra information to your application for ${
                  roleOptions.find((option) => option.value === roleName).label
                }? (optional)\n\nPlease write one message adding any extra details you think might be helpful for the staff. Only the first 500 characters will be sent. This application will timeout after 10 minutes, and no extra information will be sent. If you'd like to send nothing simply write a short blurb stating so, although this will impact the likelihood of being selected.`,
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
                    content: 'Would You Like To Send This Application?',
                    embeds: [
                      {
                        author: {
                          name: message.author.tag,
                          url: message.url,
                          iconURL: message.author.displayAvatarURL(),
                        },
                        color: 'RANDOM',
                        fields: [
                          {
                            name: 'Server Name',
                            value: `${message.member.displayName}`,
                            inline: true,
                          },
                          {
                            name: 'Member ID',
                            value: `${message.member.id}`,
                            inline: true,
                          },
                          {
                            name: 'Join Date',
                            value: `<t:${Math.floor(
                              message.member.joinedAt.getTime() / 1000,
                            )}>`,
                            inline: true,
                          },
                          {
                            name: 'Roles',
                            value: `${[
                              ...message.member.roles.cache
                                .filter((role) => role.id !== message.guild.id)
                                .values(),
                            ].toLocaleString()}`,
                            inline: true,
                          },
                          {
                            name: 'Extra Information',
                            value: `${
                              collectedResponse
                                ?.first()
                                ?.content?.substring(0, 500) ??
                              'No information provided.'
                            }`,
                          },
                        ],
                        title: `Application For ${roleName}`,
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
                                      iconURL:
                                        message.author.displayAvatarURL(),
                                    },
                                    color: 'RANDOM',
                                    fields: [
                                      {
                                        name: 'Server Name',
                                        value: `${message.member.displayName}`,
                                        inline: true,
                                      },
                                      {
                                        name: 'Member ID',
                                        value: `${message.member.id}`,
                                        inline: true,
                                      },
                                      {
                                        name: 'Join Date',
                                        value: `<t:${Math.floor(
                                          message.member.joinedAt.getTime() /
                                            1000,
                                        )}>`,
                                        inline: true,
                                      },
                                      {
                                        name: 'Roles',
                                        value: `${[
                                          ...message.member.roles.cache
                                            .filter(
                                              (role) =>
                                                role.id !== message.guild.id,
                                            )
                                            .values(),
                                        ].toLocaleString()}`,
                                        inline: true,
                                      },
                                      {
                                        name: 'Extra Information',
                                        value: `${
                                          collectedResponse
                                            ?.first()
                                            ?.content?.substring(0, 500) ??
                                          'No information provided.'
                                        }`,
                                      },
                                    ],
                                    title: `Application For ${roleName}`,
                                  },
                                ],
                              })
                              .then((mirroredMessage) => {
                                mirroredMessage.react('👍');
                                mirroredMessage.react('👎');
                              }),
                          )
                        : Promise.all([
                            approvalInteraction.message.delete(),
                            this.client.dbusers.removeApplication(
                              message.member.id,
                              roleName,
                            ),
                          ]),
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
                        ? `You've successfully applied for ${roleName}\n\nIf you'd like to apply for another role, please select one of the available tasks below to begin an application.`
                        : 'Please select one of the available tasks below to begin an application.',
                    footer: {
                      text:
                        approvalInteraction.customId === 'yes'
                          ? 'Thank you for completing your application!'
                          : 'Your application has been removed.',
                    },
                    thumbnail: { url: message.guild.iconURL() },
                    title: 'Apply To Help Out At Animal Rights Advocates',
                  },
                ],
                components: [row],
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
    }*/
  }
};
