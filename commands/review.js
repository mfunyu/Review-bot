const vals = require("../choices.js");
const send = require('../send.js');

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
				choices: vals.hours,
			},
			{
				name: 'min',
				description: 'review starting time m',
				type: 'INTEGER',
				required: true,
				choices: vals.mins,
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
			const guild = interaction.member.guild;
			const channelName = createChannelName(interaction);

			if (channelExist(guild, channelName)) {
				await send.reply(interaction, send.msgs["Duplicate"], channelName);
				return;
			}

			const category = guild.channels.cache.find((channel) => channel.name === '📝 Project Review');
			await category.createChannel(channelName, { type: 'GUILD_VOICE' });
			await send.reply(interaction, send.msgs["Created"], channelName);
		}
	}
}

function channelExist(guild, channelName) {
	const channel = guild.channels.cache.find((channel) => channel.name === channelName);
	if (channel)
		return true;
	return false;
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
	const user = interaction.options.getUser('reviewer');

	const userName = getDisplayName(interaction, user);
	const time = getTime(interaction);

	const channelName = projectName + '/' + userName + '/' + time;

	return channelName;
}

function getTime(interaction) {
	const hour = interaction.options.getInteger('hour');
	let min = interaction.options.getInteger('min');

	if (min == 0)
		min = '0' + min;

	return hour + ':' + min + '~';
}