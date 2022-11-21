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

			const limit = 20;
			const query =
				`SELECT project, r.id, corrector, array_agg(corrected), to_char(begin_at, 'YYYY/MM/DD HH24:MI') as begin_at` +
				' FROM reviews r' +
				' RIGHT JOIN correcteds on r.id = review_id' +
				' WHERE corrector = $1::text or corrected = $1::text' +
				' GROUP BY r.id' +
				' ORDER BY begin_at DESC' +
				` LIMIT ${limit}`;

			const data = await pgClient.query(query, [displayName]);
			console.dir(data.rows, { maxArrayLength: null });

			let value = '';
			data.rows.forEach(e => {
				value += `・ ${e.begin_at} - ${e.project}\n`;
			});
			if (!value) {
				value = 'レビュー履歴はまだありません';
			}
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
