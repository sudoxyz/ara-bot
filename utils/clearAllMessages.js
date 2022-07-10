module.exports.clearAllMessages = async (channel) => {
  try{
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
  } catch (error) {
    console.error;
  }
};