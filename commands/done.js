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
					{ name: 'all', value: 'all' },
					{ name: 'current', value: 'current' },
					{ name: 'choose', value: 'choose' },
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
				(channel) => channel.name === '📝 Project Review',
			);

			const channels = category.children;
			const deleteChannels = [];
			let ch;

			switch (selection) {
				case 'all':
					let found = false;
					channels.forEach((currentChannel) => {
						if (
							currentChannel.name.includes('/' + userName + '/')
						) {
							deleteChannels.push(currentChannel);
							found = true;
						}
					});
					if (!found) {
						await send.reply(
							interaction,
							send.msgs['NotFound'],
							userName
						);
						return;
					}
					break;
				case 'current':
					ch = getConnectingVoiceChannel(interaction);
					if (!ch) {
						await send.reply(interaction, send.msgs['NotInVC']);
						return;
					}
					deleteChannels.push(ch);
					break;
				case 'choose':
					var dict = ['zero', 'one', 'two', 'three', 'four'];
					let msg_lists = '';
					let index = 0;
					const row = new Discord.MessageActionRow();
					channels.forEach((currentChannel) => {
						if (
							currentChannel.name.includes('/' + userName + '/')
						) {
							msg_lists +=
								':' +
								dict[index] +
								':   ' +
								currentChannel.name +
								'\n';
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
						await send.reply(
							interaction,
							send.msgs['NotFound'],
							userName
						);
						return;
					}
					await send.reply(
						interaction,
						send.msgs['Choose'],
						msg_lists,
						row
					);

					return;
			}

			let channelNames = '';
			// deleteChannels.shift();
			deleteChannels.forEach((currentChannel) => {
				channelNames += currentChannel.name + '\n';
			});
			deleteSelectedChannels(deleteChannels);

			await interaction.reply({
				embeds: [
					embed.info('Deleted', channelNames + 'を削除しました'),
				],
				ephemeral: true,
			});
		}
	},
};

function getConnectingVoiceChannel(interaction) {
	const channel_id = interaction.member.voice.channelId;
	if (!channel_id) return;
	return interaction.member.guild.channels.cache.find(
		(channel) => channel.id === channel_id,
	);
}

async function deleteSelectedChannels(deleteChannels) {
	for (channel of deleteChannels) await channel.delete();
}
