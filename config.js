var { IDs } = require('@utils/ids.js');

const config = {
  prefix: "?",
  //"token": "Depricated",
  head_coder: ["134002739255574536"],
  coder: ["270009473198850050", "447577925135630346", "134002739255574536"],
  artist: ["238752819090292737", "248848847554478082"],
  bug_tester: ["238752819090292737", "248848847554478082", "270009473198850050", "615731606677880842"],
  cversion: ["0.3.4"],
  BuildName: "Wyra",
  debug: true,
  daily: {
    xp: 25,
    currency: 10
  },
  levelUp: {
    xp: {
      lower: 25,
      upper: 75,
    },
    disabledChannels: [798065855379800064, 775919978855399464],
    disabledCategories: [721865432612470824, 760599474497781762]
  },
  permLevels: [
    // This is the bottom level, never runs
    {
      level: 0,
      name: "Disabled",
      // Don't bother checking, just return false which will disable all calls of command.
      check: () => false,
    },
    // This is the lowest resolving permission level, this is for non-roled users.
    {
      level: 1,
      name: "User",
      // Don't bother checking, just return true which allows them to execute any command their
      // level allows them to.
      check: () => true
    },
    {
      level: 2,
      // This is the name of the role.
      name: "VerAsVeg",
      // The following lines check the guild the message came from for the roles.
      // Then it checks if the member that authored the message has the role.
      // If they do return true, which will allow them to execute the command in question.
      // If they don't then return false, which will prevent them from executing the command.
      check: (message) => {
        try {
          if (message.member.roles.cache.has(IDs.role.verifyAsVegan)) return true;
        } catch (e) {
          return false;
        }
      }
    },
    {
      level: 3,
      // This is the name of the role.
      name: "Trusted",
      // The following lines check the guild the message came from for the roles.
      // Then it checks if the member that authored the message has the role.
      // If they do return true, which will allow them to execute the command in question.
      // If they don't then return false, which will prevent them from executing the command.
      check: (message) => {
        try {
          if (message.member.roles.cache.has(IDs.role.trusted)) return true;
        } catch (e) {
          return false;
        }
      }
    },
    {
      level: 4,
      // This is the name of the role.
      name: "Vegan",
      // The following lines check the guild the message came from for the roles.
      // Then it checks if the member that authored the message has the role.
      // If they do return true, which will allow them to execute the command in question.
      // If they don't then return false, which will prevent them from executing the command.
      check: (message) => {
        try {
          if (message.member.roles.cache.has(IDs.role.vegan)) return true;
        } catch (e) {
          return false;
        }
      }
    },
    {
      level: 5,
      // This is the name of the role.
      name: "Stats Team",
      // The following lines check the guild the message came from for the roles.
      // Then it checks if the member that authored the message has the role.
      // If they do return true, which will allow them to execute the command in question.
      // If they don't then return false, which will prevent them from executing the command.
      check: (message) => {
        try {
          if (message.member.roles.cache.has(IDs.role.statsTeam)) return true;
        } catch (e) {
          return false;
        }
      }
    },
    {
      level: 6,
      // This is the name of the role.
      name: "Outreach Leader",
      // The following lines check the guild the message came from for the roles.
      // Then it checks if the member that authored the message has the role.
      // If they do return true, which will allow them to execute the command in question.
      // If they don't then return false, which will prevent them from executing the command.
      check: (message) => {
        try {
          if (message.member.roles.cache.has(IDs.role.outreachLeader)) return true;
        } catch (e) {
          return false;
        }
      }
    },
    {
      level: 7,
      // This is the name of the role.
      name: "Stage Host",
      // The following lines check the guild the message came from for the roles.
      // Then it checks if the member that authored the message has the role.
      // If they do return true, which will allow them to execute the command in question.
      // If they don't then return false, which will prevent them from executing the command.
      check: (message) => {
        try {
          if (message.member.roles.cache.has(IDs.role.debater)) return true;
        } catch (e) {
          return false;
        }
      }
    },
    {
      level: 8,
      // This is the name of the role.
      name: "Veg Support",
      // The following lines check the guild the message came from for the roles.
      // Then it checks if the member that authored the message has the role.
      // If they do return true, which will allow them to execute the command in question.
      // If they don't then return false, which will prevent them from executing the command.
      check: (message) => {
        try {
          if (message.member.roles.cache.has(IDs.role.vegSupport)) return true;
        } catch (e) {
          return false;
        }
      }
    },
    {
      level: 9,
      // This is the name of the role.
      name: "Void Access",
      // The following lines check the guild the message came from for the roles.
      // Then it checks if the member that authored the message has the role.
      // If they do return true, which will allow them to execute the command in question.
      // If they don't then return false, which will prevent them from executing the command.
      check: (message) => {
        try {
          if (message.member.roles.cache.has(IDs.role.voidaccess)) return true;
        } catch (e) {
          return false;
        }
      }
    },
    {
      level: 10,
      // This is the name of the role.
      name: "Verifier",
      // The following lines check the guild the message came from for the roles.
      // Then it checks if the member that authored the message has the role.
      // If they do return true, which will allow them to execute the command in question.
      // If they don't then return false, which will prevent them from executing the command.
      check: (message) => {
        try {
          if (message.member.roles.cache.has(IDs.role.verifier)) return true;
        } catch (e) {
          return false;
        }
      }
    },
    {
      level: 12,
      // This is the name of the role.
      name: "Mod",
      // The following lines check the guild the message came from for the roles.
      // Then it checks if the member that authored the message has the role.
      // If they do return true, which will allow them to execute the command in question.
      // If they don't then return false, which will prevent them from executing the command.
      check: (message) => {
        try {
          if (message.member.roles.cache.has(IDs.role.minimod) || message.member.roles.cache.has('982074555596152904')) return true;
        } catch (e) {
          return false;
        }
      }
    },
    {
      level: 13,
      // This is the name of the role.
      name: "Veg Coordinator",
      // The following lines check the guild the message came from for the roles.
      // Then it checks if the member that authored the message has the role.
      // If they do return true, which will allow them to execute the command in question.
      // If they don't then return false, which will prevent them from executing the command.
      check: (message) => {
        try {
          if (message.member.roles.cache.has(IDs.role.vegCoordinator)) return true;
        } catch (e) {
          return false;
        }
      }
    },
    {
      level: 14,
      // This is the name of the role.
      name: "Community Mod",
      // The following lines check the guild the message came from for the roles.
      // Then it checks if the member that authored the message has the role.
      // If they do return true, which will allow them to execute the command in question.
      // If they don't then return false, which will prevent them from executing the command.
      check: (message) => {
        try {
          if (message.member.roles.cache.has(IDs.role.communityMod)) return true;
        } catch (e) {
          return false;
        }
      }
    },
    // This is your permission level, the staff levels should always be above the rest of the roles.
    {
      level: 15,
      // This is the name of the role.
      name: "Staff",
      // The following lines check the guild the message came from for the roles.
      // Then it checks if the member that authored the message has the role.
      // If they do return true, which will allow them to execute the command in question.
      // If they don't then return false, which will prevent them from executing the command.
      check: (message) => {
        try {
          if (message.member.roles.cache.has(IDs.role.moderator)) return true;
        } catch (e) {
          return false;
        }
      }
    },
    // Bot Support is a special inbetween level that has the equivalent of server owner access
    // to any server they joins, in order to help troubleshoot the bot on behalf of owners.
    {
      level: 16,
      name: "Bot Support",
      // The check is by reading if an ID is part of this array. Yes, this means you need to
      // change this and reboot the bot to add a support user. Make it better yourself!
      check: (message) => config.bug_tester.includes(message.author.id.toString())
    },

    // Bot Admin has some limited access like rebooting the bot or reloading commands.
    {
      level: 17,
      name: "Bot Admin",
      check: (message) => config.coder.includes(message.author.id.toString())
    },

    // This is the bot owner, this should be the highest permission level available.
    // The reason this should be the highest level is because of dangerous commands such as eval
    // or exec (if the owner has that).
    {
      level: 18,
      name: "Bot Owner",
      // Another simple check, compares the message author id to the one stored in the config file.
      check: (message) => config.head_coder.includes(message.author.id.toString())
    }
  ]
};

module.exports = config;
