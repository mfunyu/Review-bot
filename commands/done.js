const embed = require('../embed.js');
const send = require('../send.js');

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
					{ name: 'choose', value: 'choose' },
					{ name: 'all', value: 'all' },
					{ name: 'current', value: 'current' },
				],
			},
		],
	},
	async execute(interaction, Discord) {
		if (interaction.commandName == 'done') {
			const guild = interaction.member.guild;

			const selection = interaction.options.getString('selection');
			const category = guild.channels.cache.find(
				channel => channel.name === '📝 Project Review'
			);

			const channels = category.children;
			const deleteChannels = [];

			let ret;
			switch (selection) {
				case 'all':
					ret = await doneAll(interaction, channels, deleteChannels);
					if (ret == -1) return;
					break;
				case 'current':
					ret = await doneCurrent(interaction, deleteChannels);
					if (ret == -1) return;
					break;
				case 'choose':
					doneChoose(Discord, interaction, channels);
					return;
			}

			const channelNames = formatChannelNames(deleteChannels);
			deleteSelectedChannels(deleteChannels);
			await send.reply(interaction, send.msgs['Deleted'], channelNames);
		}
	},
};

async function doneChoose(Discord, interaction, channels) {
	const userName = interaction.member.displayName;
	let vc_lists = [];

	channels.forEach(currentChannel => {
		if (currentChannel.name.includes('/' + userName + '/')) {
			vc_lists.push(currentChannel.name);
		}
	});
	if (!vc_lists) {
		await send.reply(interaction, send.msgs['NotFound'], userName);
		return;
	}
	const msg_content = createMessageContent(vc_lists);
	const row = createButtonRow(Discord, vc_lists);
	await send.reply(interaction, send.msgs['Choose'], msg_content, row);
	return;
}

function createButtonRow(Discord, vc_lists) {
	const VC_LIMIT = 15;
	const MAX_ROW_MEMBERS = 5;
	const row = [];

	let row_index = -1;
	let index = 0;
	vc_lists.forEach(channel_name => {
		if (index >= VC_LIMIT) return;
		if (index % MAX_ROW_MEMBERS == 0) {
			row.push(new Discord.MessageActionRow());
			row_index++;
		}
		row[row_index].addComponents(
			new Discord.MessageButton()
				.setCustomId(channel_name)
				.setLabel((index + 1).toString(16).toUpperCase())
				.setStyle('PRIMARY')
		);
		index++;
	});
	return row;
}

function createMessageContent(vc_lists) {
	const dict = [
		'zero',
		'one',
		'two',
		'three',
		'four',
		'five',
		'six',
		'seven',
		'eight',
		'nine',
		'regional_indicator_a',
		'regional_indicator_b',
		'regional_indicator_c',
		'regional_indicator_d',
		'regional_indicator_e',
		'regional_indicator_f',
	];
	const VC_LIMIT = 15;

	let msg = '';
	let index = 0;

	vc_lists.forEach(channel_name => {
		if (index % 5 == 0) msg += '\n';
		index++;
		if (index > VC_LIMIT) return;
		msg += `:${dict[index]}:  \`${channel_name}\`\n`;
	});

	if (index > VC_LIMIT) {
		const rest_channels = index - VC_LIMIT;
		msg += `その他、計\`${rest_channels.toString()}\`チャンネルが存在しています\n`;
	}
	return msg;
}

async function doneCurrent(interaction, deleteChannels) {
	const ch = getConnectingVoiceChannel(interaction);
	if (!ch) {
		await send.reply(interaction, send.msgs['NotInVC']);
		return -1;
	}
	deleteChannels.push(ch);
	return 0;
}

async function doneAll(interaction, channels, deleteChannels) {
	const userName = interaction.member.displayName;
	let found = false;

	channels.forEach(currentChannel => {
		if (currentChannel.name.includes('/' + userName + '/')) {
			deleteChannels.push(currentChannel);
			found = true;
		}
	});
	if (!found) {
		await send.reply(interaction, send.msgs['NotFound'], userName);
		return -1;
	}
	return 0;
}

function formatChannelNames(deleteChannels) {
	if (deleteChannels.length == 1) {
		return deleteChannels[0].name;
	}

	let channelNames = '\n';
	deleteChannels.forEach(currentChannel => {
		channelNames += `${currentChannel.name}\n`;
	});
	return channelNames;
}

function getConnectingVoiceChannel(interaction) {
	const channel_id = interaction.member.voice.channelId;
	if (!channel_id) return;
	return interaction.member.guild.channels.cache.find(
		channel => channel.id === channel_id
	);
}

async function deleteSelectedChannels(deleteChannels) {
	for (channel of deleteChannels) await channel.delete();
}
