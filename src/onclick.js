const embed = require('./embed.js');
const send = require('./send.js');

exports.respond = async function (interaction) {
	await send.deferReply(interaction);

	const guild = interaction.member.guild;
	const category = guild.channels.cache.find(
		channel => channel.name === process.env.VOICE_CATEGORY
	);
	const channels = category.children;

	const indexOfSep = interaction.customId.indexOf('-');
	const deleteChId = interaction.customId.slice(0, indexOfSep);
	const deleteChName = interaction.customId.slice(indexOfSep + 1);
	const deleteChannel = channels.find(channel => channel.id === deleteChId);
	if (!deleteChannel) {
		await send.followUp(
			interaction,
			send.msgs['DeteleAgain'],
			deleteChName
		);
		return;
	}
	const deletedCh = await deleteChannel.delete();
	await send.followUp(interaction, send.msgs['Deleted'], deletedCh.name);
};
