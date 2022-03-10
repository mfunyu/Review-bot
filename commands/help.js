const send = require('../send.js');

module.exports = {
	data: {
		name: 'help',
		description: "show help for Review-bot's commands",
	},
	async execute(interaction) {
		if (interaction.commandName == 'help') {
			const field = [
				{
					name: ':loud_sound:レビューチャンネルを作成する',
					value:
						' `/review`\n\
						`[project_name]`- レビューするプロジェクトの名前を入力する\n\
						`[hour]`- レビューの開始時間（時）を選択する\n\
						`[min]`- レビューの開始時間（分）を選択する\n\
						`[reviewer] (optional)` - レビュワーに自分以外のユーザーを選択する\n\n\
						',
				},
				{
					name: ':wastebasket: レビューチャンネルを削除する',
					value:
						'`/done`\n\
						[`choose`] \n\
						 - 自分がレビュワーの*ボイスチャンネルの一覧* を表示します\n\
						 - 選択したボイスチャンネル を削除します\n\
						[`all`]\n\
						 - 自分がレビュワーの*全てのボイスチャンネル* を削除します\n\
						[`current`]\n\
						 - *現在入室中のボイスチャンネル* を削除します \n\
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
