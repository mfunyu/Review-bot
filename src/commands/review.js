const { ApplicationCommandOptionType, ChannelType } = require('discord.js');
const send = require('../send.js');

module.exports = {
	data: {
		name: 'review',
		description: 'レビューチャンネルを作成する',
		options: [
			{
				name: 'project',
				description: 'レビューするプロジェクト名',
				type: ApplicationCommandOptionType.String,
				required: true,
			},
			{
				name: 'time',
				description: 'レビュー開始時間（hhmm）',
				type: ApplicationCommandOptionType.Integer,
				required: true,
			},
			{
				name: 'reviewer',
				description: 'レビュワーを指定する',
				type: ApplicationCommandOptionType.User,
				required: false,
			},
		],
	},
	async execute(interaction) {
		if (interaction.commandName == 'review') {
			const guild = interaction.member.guild;
			const reviewer = getReviewer(interaction);
			if (reviewer.user.bot) {
				await send.reply(
					interaction,
					send.msgs['Invalid'],
					`reviewer: ${reviewer.user.username}`
				);
				return;
			}
			const { time, invalid } = getTime(interaction);
			if (invalid) {
				await send.reply(
					interaction,
					send.msgs['Invalid'],
					`time: ${time}`
				);
				return;
			}
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
			const categoryChannelChildManager = category.children;
			const channel = await categoryChannelChildManager.create({
				name: channelName,
				type: ChannelType.GuildVoice,
			});
			setTimeout(() => {
				notifyUser(guild, channel, reviewer, time);
			}, calcDeley(time));
			await send.reply(interaction, send.msgs['Created'], channelName);
		}
	},
};

function calcDeley(time) {
	const timeElapsed = Date.now();
	const event = new Date(timeElapsed);
	event.setHours(time.slice(0, -3), time.slice(-2), 0, 0);
	delay = event.valueOf() - Date.now();
	if (delay < 0) {
		event.setDate(event.getDate() + 1);
		delay = event.valueOf() - Date.now();
	}
	return delay;
}

function notifyUser(guild, channel, reviewer, time) {
	if (!guild.channels.cache.get(channel.id)) return;
	if (reviewer.voice.channel && reviewer.voice.channel.name == channel.name)
		return;
	send.send(channel, send.msgs['Notify'], reviewer, time);
}

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

function createChannelName(interaction, reviewer, time, invalid) {
	const projectName = interaction.options.getString('project');
	if (!invalid) time = time + '~';
	const channelName = projectName + '/' + reviewer.displayName + '/' + time;

	return channelName;
}

function getTime(interaction) {
	const time = interaction.options.getInteger('time');
	if (time >= 2600 || time < 0) {
		return { time, invalid: true };
	}
	const hour = Math.floor(time / 100);
	let min = time % 100;

	if (min >= 60) {
		return { time, invalid: true };
	}
	if (min < 10) {
		min = '0' + min;
	}
	return { time: hour + ':' + min, invalid: false };
}
