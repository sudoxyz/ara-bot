const WeebCommand = require('@base/WeebCommand.js');
const defaultError = require('@utils/defaultError');
const { MessageActionRow, MessageSelectMenu } = require('discord.js');

module.exports = class unapply extends WeebCommand {
  constructor(client) {
    super(client, {
      name: 'unapply',
      description: `Used to unapply for a position`,
      usage: `${client.config.prefix}unapply rolename`,
      aliases: ['ua'],
      permLevel: 'Vegan',
    });
  }

  async run(message) {
    try {
      const messagesToDelete = [];
      const val = [
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

      const row = new MessageActionRow().addComponents(
        new MessageSelectMenu()
          .setCustomId('select')
          .setPlaceholder('Nothing selected')
          .addOptions(val),
      );
      const msg = await message.reply({
        content: 'Unapply here',
        components: [row],
      });
      const collector = await msg.createMessageComponentCollector({
        time: 30000,
      });

      collector.on('collect', async (i) => {
        if (i.user.id !== message.member.id) {
          return;
        }
        const roleName = i.values[0];
        if (roleName === 'cancel') {
          collector.stop('cancelled');
          return;
        }
        const unappliedAlready = await this.client.dbusers.removeApplication(
          message.member.id,
          roleName,
        );
        console.log(unappliedAlready);
        if (unappliedAlready) {
          if (messagesToDelete.length < 1) {
            const receivedMessage = await message.channel.send(
              "You didn't apply or were already unapplied for this role",
            );
            messagesToDelete.push(receivedMessage);
          }
          await i.update({
            content: `Unapply for a different role?`,
            components: [row],
          });
        } else {
          const mirrorMsg = `\`${message.member.user.username}\`:\`${message.member.id}\` unapplied for the role ${roleName}`;
          const channel = message.guild.channels.cache.find(
            (applyChannel) => applyChannel.name === roleName,
          );
          channel
            .send(mirrorMsg)
            .then((sentMessage) => {
              sentMessage.react('👍');
              sentMessage.react('👎');
            })
            .catch(console.error);
          message.react('✅');
          await i.update({
            content: `You unapplied for ${roleName}. Unapply for a different role?`,
            components: [row],
          });
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
