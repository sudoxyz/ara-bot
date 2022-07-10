const WeebCommand = require("@base/WeebCommand.js");
const defaultError = require('@utils/defaultError');
var { IDs } = require('@utils/ids.js');

module.exports = class restricted extends WeebCommand {
  constructor(client) {
    super(client, {
      name: "restricted",
      description: `Clears the entire restricted channel\n
                    Available to Mods and Verifiers only `,
      usage: `${client.config.prefix}restricted`,
      aliases: [],
      permLevel: "Moderator"
    });
  } async run(message) {
    try {
      let channel = message.channel;
      let minutes;
      await channel.messages.fetch({limit: 2}).then(async messages =>{
        let lastMessage = messages.last();
        var diff = Math.abs(new Date().getTime() - lastMessage.createdTimestamp);
        minutes = Math.floor((diff/1000)/60);
      });
      if(minutes >= "5"){
        let listOfChannels = [IDs.chat.void1, IDs.chat.void2, IDs.chat.humanrights, IDs.chat.humanrights2];
        if(listOfChannels.includes(channel.id)){
          let messageCount; 
  
          await channel.messages.fetch({limit: 100}).then(async messages=>{
            messageCount = messages.size;
          });
          while(messageCount > 0){
            await channel.messages.fetch({limit: 100}).then(async messages => {
              if(messages.size > 0){
                console.log("deleting " + messages.size + " messages");
                await channel.bulkDelete(messages).catch(console.error);
              }
            });
            await channel.messages.fetch({limit: 100}).then(async messages=>{
              messageCount = messages.size;
            });
          }
          channel.send(`***If you're here, you messed up***`);
        }
      } else {
        try {
          await message.channel.messages.fetch(message.id)
            .then(message => message.delete()).catch(console.error); //it fetched the message - good
        } catch (error) {
          console.log(error);
          //the message no longer exists and will be ignored
        }
      }

    } catch (error) {
      defaultError(error, message, this.client);
    }
  }
};