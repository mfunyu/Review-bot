const send = require('../send.js');

module.exports = {
	data: {
		name: 'help',
		description: 'Review-botの使い方を表示する',
	},
	async execute(interaction) {
		if (interaction.commandName == 'help') {
			const field = [
				{
					name: ':loud_sound: **/review**',
					value: '> レビューチャンネルを作成する',
				},
				{
					name: '`[project]`',
					value: 'レビューするプロジェクトの名前',
					inline: true,
				},
				{
					name: '`[time]`',
					value: 'レビューの開始時刻を入力 `(hhmm)`\n\
					例) `12:15~` → `1215`\n',
					inline: true,
				},
				{
					name: '`[reviewer]` (optional)',
					value: 'レビュワーに自分以外のユーザーを選択',
					inline: true,
				},
				{
					name: ':wastebasket: **/done** ',
					value: '> レビューチャンネルを削除する',
				},
				{
					name: '`/done choose`',
					value: '自分のチャンネルの一覧から選択削除できる\n',
					inline: true,
				},
				{
					name: '`/done all`',
					value: '自分のチャンネルを全て一括削除する\n',
					inline: true,
				},
				{
					name: '`/done current`',
					value: '現在入室中のチャンネルを削除する\n',
					inline: true,
				},
				{
					name: '️:clock2: **/history**',
					value: '> レビュー履歴を表示する',
				},
				{
					name: '引数なし',
					value: '自分の直近のレビュー履歴を表示する',
					inline: true,
				},
				{
					name: '`[user]` (optional)',
					value: '指定のユーザーとのレビュー履歴を表示する',
					inline: true,
				},
				{
					name: '️:mega: **/help**',
					value: '> Review-botの使い方を表示する',
				},
			];
			await send.reply(interaction, send.msgs['Help'], field);
		}
	},
};
