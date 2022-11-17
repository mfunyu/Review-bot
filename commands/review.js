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
			const { time, err } = getTime(interaction);
			const channelName = createChannelName(
				interaction,
				reviewer,
				time,
				err
			);

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
			channel = await category.createChannel(channelName, {
				type: 'GUILD_VOICE',
			});
			if (!err) {
				setTimeout(() => {
					callUser(channel, reviewer, time);
				}, calcDeley(time));
			}
			await send.reply(interaction, send.msgs['Created'], channelName);
		}
	},
};

function calcDeley(time) {
	const timeElapsed = Date.now();
	const event = new Date(timeElapsed);
	event.setMinutes(time.slice(-2));
	return event.valueOf() - Date.now();
}

function callUser(channel, reviewer, time) {
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

function createChannelName(interaction, reviewer, time, err) {
	const projectName = interaction.options.getString('project');
	if (!err) time = time + '~';
	const channelName = projectName + '/' + reviewer.displayName + '/' + time;

	return channelName;
}

function getTime(interaction) {
	const time = interaction.options.getInteger('time');
	if (time >= 2600 || time < 0) {
		return { time, err: true };
	}
	const hour = Math.floor(time / 100);
	let min = time % 100;

	if (min >= 60) {
		return { time, err: true };
	}
	if (min < 10) {
		min = '0' + min;
	}
	return { time: hour + ':' + min, err: false };
}
