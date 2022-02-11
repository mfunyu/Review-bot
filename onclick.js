exports.respond = async function (interaction) {
	await interaction.deferReply({
		ephemeral: true
	});
	const guild = interaction.member.guild;
	const category = guild.channels.cache.find((channel) => channel.name === '📝 Project Review');
	const channels = category.children;

	const deleteChannel = channels.find((channel) => channel.name === interaction.customId);
	if (!deleteChannel) {
		await interaction.followUp({ content: interaction.customId + 'はすでに削除されています', ephemeral: true });
		return;
	}

	await deleteChannel.delete();
	await interaction.followUp({ content: interaction.customId + 'を削除しました', ephemeral: true });
}
