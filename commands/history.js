const embed = require('../embed.js');
const send = require('../send.js');

module.exports = {
	data: {
		name: 'history',
		description: 'レビューの履歴を表示する',
		options: [
			{
				name: 'user',
				description: 'ユーザー名',
				type: 'USER',
				required: true,
			},
		],
	},
	async execute(interaction, Discord, pgClient) {
		if (interaction.commandName == 'history') {
			const user = interaction.options.getUser('user');
			const guild = interaction.member.guild;
			const displayName = guild.members.resolve(user.id).displayName;

			const data = await pgClient.query(
				`SELECT project, to_char(begin_at, 'YYYY/MM/DD HH24:MI') as begin_at from reviews where corrector = $1::text or corrected = $1::text `,
				[displayName]
			);
			let value = '';
			data.rows.forEach(e => {
				value += `・ ${e.begin_at} - ${e.project}\n`;
			});
			const field = [
				{
					name: user.username,
					value,
				},
			];
			await send.reply(interaction, send.msgs['History'], field);
		}
	},
};
