module.exports = {
	data: {
		name: 'review',
		description: 'create review voice channel',
		options: [
			{
				type: 'STRING',
				name: 'project_name',
				description: 'name of the reviewing project',
				required: true,
				choices: [
					{
						name: 'libft',
						value: 'libft',
					},
					{
						name: 'minishell',
						value: 'minishell',
					}
				],
			},
			{
				name: 'hour',
				description: 'review starting time h',
				type: 'INTEGER',
				required: true,
			},
			{
				name: 'min',
				description: 'review starting time m',
				type: 'INTEGER',
				required: true,
			},
			{
				name: 'reviewer',
				description: 'creating voice channel for somebody else',
				type: 'USER',
				required: false,
			}
		]
	},
	async execute(interaction) {
		if (interaction.commandName == 'review') {
			const channelName = createChannelName(interaction);

			const guild = interaction.member.guild;
			const category = guild.channels.cache.find((channel) => channel.name === '📝 Project Review');
			await guild.channels.create(channelName, { type: 'GUILD_VOICE', parent: category })
			await interaction.reply({ content: channelName + ' を作成しました', ephemeral: true });
		}
	}
}

function getDisplayName(interaction, user) {
	let displayName;
	if (user) {
		const guild = interaction.member.guild;
		const member = guild.members.resolve(user.id);
		displayName = member ? member.displayName : null;
	} else {
		displayName = interaction.member.displayName;
	}
	return displayName;
}

function createChannelName(interaction) {
	const projectName = interaction.options.getString('project_name');
	const hour = interaction.options.getInteger('hour');
	const min = interaction.options.getInteger('min');
	const user = interaction.options.getUser('reviewer');

	userName = getDisplayName(interaction, user);
	channelName = projectName + '/' + userName + '/' + hour + ':' + min + '~';

	return channelName;
}