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
			const project = interaction.options.getString('project_name');
			const hour = interaction.options.getInteger('hour');
			const min = interaction.options.getInteger('min');
			const user = interaction.options.getUser('reviewer');
			const guild = interaction.member.guild;

			if (user) {
				let member = guild.members.resolve(user.id);
				uname = member ? member.displayName : null;
			} else {
				uname = interaction.member.displayName;
			}

			channel_name = project + '/' + uname + '/' + hour + ':' + min + '~';
			const category = guild.channels.cache.find((channel) => channel.name === '📝 Project Review');
			await guild.channels.create(channel_name, { type: 'GUILD_VOICE', parent: category })
			await interaction.reply({ content: channel_name + ' を作成しました', ephemeral: true });
		}
	}
}