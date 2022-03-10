const embed = require('./embed.js');
const send = require('./send.js');

exports.respond = async function (interaction) {
	await send.deferReply(interaction);

	const guild = interaction.member.guild;
	const category = guild.channels.cache.find(
		channel => channel.name === '📝 Project Review'
	);
	const channels = category.children;

	const deleteChannel = channels.find(
		channel => channel.name === interaction.customId
	);
	if (!deleteChannel) {
		await send.followUp(
			interaction,
			send.msgs['DeteleAgain'],
			interaction.customId
		);
		return;
	}
	await deleteChannel.delete();
	await send.followUp(
		interaction,
		send.msgs['Deleted'],
		interaction.customId
	);
};
