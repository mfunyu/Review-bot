const send = require('../send.js');

module.exports = {
	data: {
		name: 'help',
		description: 'Review-botのヘルプを表示する',
	},
	async execute(interaction) {
		if (interaction.commandName == 'help') {
			const field = [
				{
					name: ':loud_sound:レビューチャンネルを作成する',
					value:
						' `/review`\n\
						`[project]`- レビューするプロジェクトの名前を入力する\n\
						`[time]`- レビューの開始時間（hhmm）を入力する\n\
						`[reviewer] (optional)` - レビュワーに自分以外のユーザーを選択する\n\n\
						',
				},
				{
					name: ':wastebasket: レビューチャンネルを削除する',
					value:
						'`/done`\n\
						[`choose`] \n\
						 - 自分のレビューボイスチャンネルの一覧を表示する\n\
						 - 選択したレビューボイスチャンネルを削除する\n\
						[`all`]\n\
						 - 自分の全てのレビューボイスチャンネルを削除する\n\
						[`current`]\n\
						 - 現在入室中のレビューボイスチャンネルを削除する\n\
						',
				},
				{
					name: '使い方を表示する',
					value: '`/help`',
				},
			];
			await send.reply(interaction, send.msgs['Help'], field);
		}
	},
};
