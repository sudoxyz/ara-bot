const WeebCommand = require('../../base/WeebCommand');
const defaultError = require('../../utils/defaultError');
const CommandError = require('../../utils/commandError');
const responsiveError = require('../../utils/responsiveError');
const { ARA } = require('../../utils/ara');

const permissibleCategories = [
  ARA.categories.modmail,
  ARA.categories.restricted,
]; // Categories of channels that can be added by Non-Organizers

module.exports = class access extends WeebCommand {
  constructor(client) {
    super(client, {
      name: 'access',
      description: `Grants access to a list of users and roles, to a list of channels. Any mentioned roles, and any mentioned users will have the effect applied to all mentioned channels.`,
      usage: `${client.config.prefix}<access/acc/perms/permissions> <add, read/view, remove/block, revert/reset> <@users and/or @roles> <modmail or restricted #channels>`,
      permLevel: 'Community Mod',
      aliases: ['acc', 'perms', 'permissions'],
    });
  }

  async run(message) {
    try {
      const action = message.content
        .toUpperCase()
        .match(/ADD|READ|VIEW|REMOVE|BLOCK|REVERT|RESET/g); // Match for all possible uses of action, which lets us detect redundant args to throw error
      const channels = message.member.roles.cache.has(
        ARA.roles.management.organizer,
      )
        ? message.mentions.channels
        : message.mentions.channels.filter((channel) =>
            permissibleCategories.some(
              (category) => channel.parentId === category,
            ),
          ); // Channels are filtered to only include channels that are restricted or modmail if you are not an organizer
      if (
        (message.mentions.members.size === 0 &&
          message.mentions.roles.size === 0) ||
        action === null ||
        action.length !== 1 ||
        channels.size === 0
      )
        throw this.incorrectUsage(); // If no mentions, or no command, then throw error about usage
      return this.handleAction(action, message, channels).then(() =>
        message.react('✅'),
      );
    } catch (error) {
      return error instanceof CommandError
        ? responsiveError(message, error)
        : defaultError(error, message, this.client);
    }
  }

  handleAction(action, message, channels) {
    switch (action.at(0)) {
      case 'ADD':
        return this.editAccess(
          message,
          channels,
          {
            VIEW_CHANNEL: true,
            SEND_MESSAGES: true,
            READ_MESSAGE_HISTORY: true,
          },
          'given full access',
        );
      case 'READ':
      case 'VIEW':
        return this.editAccess(
          message,
          channels,
          {
            VIEW_CHANNEL: true,
            SEND_MESSAGES: false,
            READ_MESSAGE_HISTORY: true,
          },
          'given read access',
        );
      case 'REMOVE':
      case 'BLOCK':
        return this.editAccess(
          message,
          channels,
          {
            VIEW_CHANNEL: false,
            SEND_MESSAGES: false,
            READ_MESSAGE_HISTORY: false,
          },
          'removed',
        );
      case 'REVERT':
      case 'RESET':
        return this.revertAccess(message, channels);
      default:
        throw this.incorrectUsage();
    }
  }

  editAccess(message, channels, state, method) {
    return Promise.all(
      channels.map((channel) =>
        message.mentions.members
          .concat(message.mentions.roles)
          .map((resolvable) =>
            channel.permissionOverwrites.edit(resolvable, state, {
              reason: `${
                resolvable?.user?.tag ?? resolvable.name
              } - was ${method} by ${message.author.tag}`,
            }),
          ),
      ),
    );
  }

  revertAccess(message, channels) {
    return Promise.all(
      channels.map((channel) =>
        message.mentions.members
          .concat(message.mentions.roles)
          .map((resolvable) =>
            channel.permissionOverwrites.delete(resolvable, {
              reason: `${
                resolvable?.user?.tag ?? resolvable.name
              } - had permissions reset by ${message.author.tag}`,
            }),
          ),
      ),
    );
  }

  incorrectUsage() {
    return new CommandError(`Usage: ${this.help.usage}`);
  }
};
