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
				required: false,
			},
		],
	},
	async execute(interaction, Discord, pgClient) {
		if (interaction.commandName == 'history') {
			const guild = interaction.member.guild;
			const user = interaction.options.getUser('user');
			const authorName = interaction.member.displayName;

			let data;
			let targetName;
			if (user) {
				const userName = guild.members.resolve(user.id).displayName;
				targetName = userName;
				data = await getRelatedDataFromDB(
					pgClient,
					authorName,
					userName
				);
			} else {
				targetName = authorName;
				data = await getDataFromDB(pgClient, authorName);
			}
			console.dir(data.rows, { maxArrayLength: null });

			const { reviewer, reviewee } = createFieldValues(data, authorName);
			const field = [
				{
					name: `user: ${targetName}`,
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

function getDataFromDB(pgClient, displayName) {
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

function getRelatedDataFromDB(pgClient, authorName, userName) {
	const limit = 20;
	const query =
		`SELECT project, r.id, corrector, array_agg(corrected) as correcteds, to_char(begin_at, 'YYYY/MM/DD HH24:MI') as begin_at` +
		' FROM reviews r' +
		' RIGHT JOIN correcteds on r.id = review_id' +
		' WHERE (corrector = $1::text and corrected = $2::text) or (corrector = $2::text and corrected = $1::text)' +
		' GROUP BY r.id' +
		' ORDER BY begin_at DESC' +
		` LIMIT ${limit}`;

	return pgClient.query(query, [authorName, userName]);
}
