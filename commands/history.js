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

			const data = await getDateFromDB(pgClient, displayName);
			console.dir(data.rows, { maxArrayLength: null });

			const { reviewer, reviewee } = createFieldValues(data, displayName);
			const field = [
				{
					name: user.username,
					value: `\`${data.rows.length}\`件のレビューを表示しています`,
				},
				{
					name: '__reviewer__',
					value: reviewer,
				},
				{
					name: '__reviewee__',
					value: reviewee,
				},
			];
			await send.reply(interaction, send.msgs['History'], field);
		}
	},
};

function createFieldValues(data, displayName) {
	let reviewer = '';
	let reviewee = '';
	data.rows.forEach(e => {
		if (displayName == e.corrector) {
			reviewer +=
				`${e.begin_at}` +
				` - \`${e.correcteds}\`` +
				`｜*${e.project}*` +
				'\n';
		} else {
			reviewee +=
				`*${e.begin_at}*` +
				` - \`${e.corrector}\`` +
				`｜*${e.project}*` +
				'\n';
		}
	});
	if (!reviewer) {
		reviewer = 'レビュー履歴はまだありません';
	}
	if (!reviewee) {
		reviewee = 'レビュー履歴はまだありません';
	}
	return { reviewer, reviewee };
}

function getDateFromDB(pgClient, displayName) {
	const limit = 20;
	const query =
		`SELECT project, r.id, corrector, array_agg(corrected) as correcteds, to_char(begin_at, 'YYYY/MM/DD HH24:MI') as begin_at` +
		' FROM reviews r' +
		' RIGHT JOIN correcteds on r.id = review_id' +
		' WHERE corrector = $1::text or corrected = $1::text' +
		' GROUP BY r.id' +
		' ORDER BY begin_at DESC' +
		` LIMIT ${limit}`;

	return pgClient.query(query, [displayName]);
}
