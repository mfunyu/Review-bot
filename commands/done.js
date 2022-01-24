module.exports = {
	data: {
		name: 'done',
		description: 'delete review voice channel',
		options: [
			{
				name: 'all',
				description: 'delete all voice channels with your name',
				type: 'BOOLEAN',
				required: false,
				default: false,
			},
			{
				name: 'current',
				description: 'delete the vocie channel you are joining currently',
				type: 'BOOLEAN',
				required: false,
				default: false,
			},
		]
	},
	async execute(interaction) {
		if (interaction.commandName == 'done') {
			const guild = interaction.member.guild;

			const userName = interaction.member.displayName;

			const all = interaction.options.getBoolean('all');
			const current = interaction.options.getBoolean('current');
			const category = guild.channels.cache.find((channel) => channel.name === '📝 Project Review');

			const channels = category.children;
			const deleteChannels = []

			if (all) {
				channels.forEach(currentChannel => {
					if (currentChannel.name.includes('/' + userName + '/')) {
						deleteChannels.push(currentChannel);
					}
				});
			}

			let channelNames;

			console.log(deleteChannels);
			for (channel of deleteChannels) {
				channelNames += channel.name + '\n';
				await channel.delete();
			}
			await interaction.reply({ content: channelNames + 'を削除しました', ephemeral: true });
		}
	}
}