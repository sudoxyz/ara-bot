const cron = require('node-cron');
var { IDs } = require('@utils/ids.js');

module.exports = (client) => {
//,  , 
  const clearRestricted = async () => {
    let listOfChannels = [IDs.chat.void1,IDs.chat.void2,IDs.chat.humanrights, IDs.chat.humanrights2];
    try {
      for(let channelId of listOfChannels){
        let channel = client.guilds.cache.get(IDs.guild.mainServer).channels.cache.find(channel => channel.id === channelId);
        if(listOfChannels.includes(channel.id)){
          console.log(`Trying to clear ${channelId}`);
          let messageCount;
          let lastMessageId;
          let messages = await channel.messages.fetch({limit: 100});
          messageCount = messages.size;
          for(let msg of messages){
            let message = msg[1];
            let time;
            let diff = Math.abs(Date.now() - message.createdTimestamp);
            time = Math.floor(diff/(60 * 60 * 1000));
            if(time > 24){
              console.log(`${message.content} is older than 24 hours`);
              lastMessageId = message.id;
              break;
            }
          }
          if(!lastMessageId){
            lastMessageId = messages.last().id;
          }
          while(messageCount > 0){
            await bulkDeleteBefore(channel, lastMessageId).catch(console.error);
            await channel.messages.fetch({limit: 100, before: lastMessageId}).then(async messages=>{
              messageCount = messages.size;
            });
          }
          try {
            await channel.messages.fetch(lastMessageId).then(message => message.delete()).catch(console.error);
          } catch (error) {
            console.log(error);
          }
        }
      }
      } catch (error) {
        console.error;
      }
    };
  cron.schedule('*/6 * * * *', clearRestricted);
  clearRestricted();
  async function bulkDeleteBefore(channel, id) {
    await channel.messages.fetch({limit: 100, before: id}).then(async messages => {
      await channel.bulkDelete(messages).catch(console.error);
    });
  }
};

