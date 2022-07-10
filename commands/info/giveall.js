const WeebCommand = require("@base/WeebCommand.js");
var { IDs } = require('@utils/ids.js');
const defaultError = require('@utils/defaultError');
const wait = require('util').promisify(setTimeout);

module.exports = class giveall extends WeebCommand {
  constructor(client) {
    super(client, {
      name: "giveall",
      description: `Counts vegans or non-vegans\n
                         Available for everyone`,
      usage: `${client.config.prefix}giveall`,
      aliases: [],
      permLevel: 'Staff'
    });
  } async run(message) {
    try {
      let members = await message.guild.members.fetch();
      console.log("fetched members");
      members.forEach(async m => {
        if(m.roles.cache.size === 1){
          m.roles.add(IDs.role.nonvegan);
          m.roles.add("802002379993907270");
          m.roles.add("863953517601751101");
          console.log("added non-vegan to user");
          wait(5000);
        }
      });
    } catch (error) {
      defaultError(error, message, this.client);
    }
  }
};