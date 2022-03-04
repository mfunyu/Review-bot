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

			const userName = interaction.member.displayName;

			const selection = interaction.options.getString('selection');
			const category = guild.channels.cache.find(
				channel => channel.name === '📝 Project Review'
			);

			const channels = category.children;
			const deleteChannels = [];

			switch (selection) {
				case 'all':
					if (deleteAll(interaction, channels, deleteChannels) == -1)
						return;
					break;
				case 'current':
					if (deleteCurrent(interaction, deleteChannels) == -1)
						return;
					break;
				case 'choose':
					deleteChoose();
			}

			const channelNames = formatChannelNames(deleteChannels);
			deleteSelectedChannels(deleteChannels);
			await send.reply(interaction, send.msgs['Deleted'], channelNames);
		}
	},
};

async function deleteChoose(interaction, deleteChannels) {
	var dict = ['zero', 'one', 'two', 'three', 'four'];
	let msg_lists = '';
	let index = 0;
	const row = new Discord.MessageActionRow();
	channels.forEach(currentChannel => {
		if (currentChannel.name.includes('/' + userName + '/')) {
			msg_lists += `\n:${dict[index]}:  \`${currentChannel.name}\``;
			row.addComponents(
				new Discord.MessageButton()
					.setCustomId(currentChannel.name)
					.setLabel(index.toString())
					.setStyle('PRIMARY')
			);
			index++;
		}
	});
	if (!msg_lists) {
		await send.reply(interaction, send.msgs['NotFound'], userName);
		return;
	}
	msg_lists += '\n';
	await send.reply(interaction, send.msgs['Choose'], msg_lists, row);
	return;
}

async function deleteCurrent(interaction, deleteChannels) {
	const ch = getConnectingVoiceChannel(interaction);
	if (!ch) {
		await send.reply(interaction, send.msgs['NotInVC']);
		return -1;
	}
	deleteChannels.push(ch);
	return 0;
}

async function deleteAll(interaction, channels, deleteChannels) {
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
