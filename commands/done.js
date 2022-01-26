module.exports = {
	data: {
		name: 'done',
		description: 'delete review voice channel',
		options: [
			{
				name: 'selection',
				description: 'delete all voice channels with your name',
				type: 'STRING',
				required: true,
				default: 'one',
				choices: [
					{ name: 'one', value: 'one', },
					{ name: 'all', value: 'all', },
					{ name: 'current', value: 'current', },
				],
			},
		]
	},
	async execute(interaction) {
		if (interaction.commandName == 'done') {
			const guild = interaction.member.guild;

			const userName = interaction.member.displayName;

			const selection = interaction.options.getString('selection');
			const category = guild.channels.cache.find((channel) => channel.name === '📝 Project Review');

			const channels = category.children;
			const deleteChannels = []

			if (selection == 'all') {
				channels.forEach(currentChannel => {
					if (currentChannel.name.includes('/' + userName + '/')) {
						deleteChannels.push(currentChannel);
					}
				});
			}
			if (selection == 'current') {
				const ch = getConnectingVoiceChannel(interaction);
				if (!ch) {
					await interaction.reply({ content: '入室中のボイスチャンネルがありません', ephemeral: true });
					return;
				}
				deleteChannels.push(ch);
			}

			let channelNames;
			deleteChannels.forEach(currentChannel => {
				channelNames += currentChannel.name + '\n';
			});
			deleteSelectedChannels(deleteChannels);

			await interaction.reply({ content: channelNames + 'を削除しました', ephemeral: true });
		}
	}
}

function getConnectingVoiceChannel(interaction) {
	const channel_id = interaction.member.voice.channelId;
	if (!channel_id)
		return;
	return interaction.member.guild.channels.cache.find((channel) => channel.id === channel_id);
}

async function deleteSelectedChannels(deleteChannels) {
	for (channel of deleteChannels)
		await channel.delete();
}