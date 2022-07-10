
module.exports = function getRoleFromMention(message, mention) {
  if(!mention) return;
  console.log("looking for mentions in: " +mention);
	if (mention.startsWith('<@') && mention.endsWith('>')) {
		mention = mention.slice(2, -1);
  }
	if (mention.startsWith('&')) {
		mention = mention.slice(1);
	}
	return message.guild.roles.cache.get(mention);
};