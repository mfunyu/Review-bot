const send = require('../send.js');

module.exports = {
	data: {
		name: 'review',
		description: 'レビューチャンネルを作成する',
		options: [
			{
				name: 'project',
				description: 'レビューするプロジェクト名',
				type: 'STRING',
				required: true,
			},
			{
				name: 'time',
				description: 'レビュー開始時間（hhmm）',
				type: 'INTEGER',
				required: true,
			},
			{
				name: 'reviewer',
				description: 'レビュワーを指定する',
				type: 'USER',
				required: false,
			},
		],
	},
	async execute(interaction) {
		if (interaction.commandName == 'review') {
			const guild = interaction.member.guild;
			const reviewer = getReviewer(interaction);
			const time = getTime(interaction);
			const channelName = createChannelName(interaction, reviewer, time);

			if (channelExist(guild, channelName)) {
				await send.reply(
					interaction,
					send.msgs['Duplicate'],
					channelName
				);
				return;
			}

			const category = guild.channels.cache.find(
				channel => channel.name === process.env.VOICE_CATEGORY
			);
			await category.createChannel(channelName, { type: 'GUILD_VOICE' });
			await send.reply(interaction, send.msgs['Created'], channelName);
		}
	},
};

function channelExist(guild, channelName) {
	const channel = guild.channels.cache.find(
		channel => channel.name === channelName
	);
	if (channel) {
		return true;
	}
	return false;
}

function getReviewer(interaction) {
	const user = interaction.options.getUser('reviewer');

	if (user) {
		const guild = interaction.member.guild;
		return guild.members.resolve(user.id);
	}
	return interaction.member;
}

function createChannelName(interaction, reviewer, time) {
	const projectName = interaction.options.getString('project');
	const channelName =
		projectName + '/' + reviewer.displayName + '/' + time + '~';

	return channelName;
}

function getTime(interaction) {
	const time = interaction.options.getInteger('time');
	if (time >= 2600 || time < 0) {
		return time;
	}
	const hour = Math.floor(time / 100);
	let min = time % 100;

	if (min >= 60) {
		return time;
	}
	if (min < 10) {
		min = '0' + min;
	}
	return hour + ':' + min;
}
