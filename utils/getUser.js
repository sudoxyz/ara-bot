
module.exports = function getUserFromMention(message, mention) {
  if(!mention) return;
  console.log("looking for mentions in: " +mention);
	if (mention.startsWith('<@') && mention.endsWith('>')) {
		mention = mention.slice(2, -1);
  }
	if (mention.startsWith('!')) {
		mention = mention.slice(1);
	}
	let user = message.guild.members.cache.get(mention);
  if(user){
    return  user;
  }else {
    return undefined;
  }
};