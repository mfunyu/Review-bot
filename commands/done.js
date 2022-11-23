const embed = require('../embed.js');
const send = require('../send.js');

module.exports = {
	data: {
		name: 'done',
		description: 'レビューチャンネルを削除する',
		options: [
			{
				name: 'choose',
				description: 'チャンネルを選択して削除する',
				type: 'SUB_COMMAND',
			},
			{
				name: 'all',
				description: '自分のチャンネルを全て削除する',
				type: 'SUB_COMMAND',
			},
			{
				name: 'current',
				description: '現在入室中のチャンネルを削除する',
				type: 'SUB_COMMAND',
			},
		],
	},
	async execute(interaction, Discord) {
		if (interaction.commandName == 'done') {
			const guild = interaction.member.guild;

			const selection = interaction.options.getSubcommand();
			const category = guild.channels.cache.find(
				channel => channel.name === process.env.VOICE_CATEGORY
			);
			const channels = category.children;
			const deleteChannels = [];

			let ret;
			switch (selection) {
				case 'all':
					ret = await doneAll(interaction, channels, deleteChannels);
					if (ret == -1) {
						return;
					}
					break;
				case 'current':
					ret = await doneCurrent(
						interaction,
						category,
						deleteChannels
					);
					if (ret == -1) {
						return;
					}
					break;
				case 'choose':
					doneChoose(Discord, interaction, channels);
					return;
			}
			await send.deferReply(interaction);

			const channelNames = formatChannelNames(deleteChannels);
			await deleteSelectedChannels(deleteChannels);
			await send.followUp(
				interaction,
				send.msgs['Deleted'],
				channelNames
			);
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
	if (!vc_lists.length) {
		await send.reply(interaction, send.msgs['NotFound'], userName);
		return;
	}
	vc_lists.sort(channelNameCompareFunc);
	const row = createButtonRow(Discord, vc_lists);
	await send.reply(interaction, send.msgs['Choose'], vc_lists, row);
	return;
}

function channelNameCompareFunc(name1, name2) {
	if (!name1.endsWith('~') || !name2.endsWith('~')) {
		return name2.at(-1).charCodeAt(0) - name1.at(-1).charCodeAt(0);
	}
	const time1 = name1.slice(name1.lastIndexOf('/') + 1, -1).replace(':', '');
	const time2 = name2.slice(name2.lastIndexOf('/') + 1, -1).replace(':', '');
	return parseInt(time1, 10) - parseInt(time2, 10);
}

function createButtonRow(Discord, vc_lists) {
	const VC_LIMIT = 15;
	const MAX_ROW_MEMBERS = 5;
	const row = [];

	let row_index = -1;
	let index = 0;
	vc_lists.forEach(channel_name => {
		if (index >= VC_LIMIT) {
			return;
		}
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

async function doneCurrent(interaction, category, deleteChannels) {
	const ch = getConnectingVoiceChannel(interaction);
	if (!ch) {
		await send.reply(interaction, send.msgs['NotInVC']);
		return -1;
	}
	if (ch.parentId != category.id) {
		await send.reply(interaction, send.msgs['NotInCategory']);
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
	if (!channel_id) {
		return;
	}
	return interaction.member.guild.channels.cache.find(
		channel => channel.id === channel_id
	);
}

async function deleteSelectedChannels(deleteChannels) {
	for (channel of deleteChannels) {
		await channel.delete();
	}
}
