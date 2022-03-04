const embed = require('./embed.js');

function wrapCodeBlock(string) {
	if (string.startsWith('\n')) return `\n\`${string.substring(1)}\``;
	return `\`${string}\``;
}

var Type = {
	info: 0,
	warning: 1,
};

exports.msgs = {
	Duplicate: { type: Type.warning, emoji: ':warning:', title: 'Duplicate' },
	NotFound: { type: Type.warning, emoji: ':warning:', title: 'Not Found' },
	NotInVC: { type: Type.warning, emoji: ':mute:', title: 'Not In VC' },
	DeteleAgain: { type: Type.warning, emoji: ':warning:', title: 'Not Found' },
	Created: { type: Type.info, emoji: ':loud_sound:', title: 'Created' },
	Choose: { type: Type.info, emoji: ':notepad_spiral:', title: 'Choose' },
	Deleted: { type: Type.info, emoji: ':wastebasket:', title: 'Deteled' },
};

function set_msg_content(msg, params) {
	if (msg == exports.msgs['Duplicate'])
		return `レビューチャンネル ${wrapCodeBlock(
			params
		)} はすでに存在しています`;
	if (msg == exports.msgs['NotFound'])
		return `${wrapCodeBlock(
			params
		)} を含むボイスチャンネルが見つかりません`;
	if (msg == exports.msgs['NotInVC'])
		return '入室中のボイスチャンネルがありません';
	if (msg == exports.msgs['Created'])
		return `レビューチャンネル ${wrapCodeBlock(params)} を作成しました`;
	if (msg == exports.msgs['Choose'])
		return `以下のチャンネルが見つかりました。\n削除したいチャンネルの番号を選択してください\n${params}`;
	if (msg == exports.msgs['Deleted'])
		return `レビューチャンネル ${wrapCodeBlock(params)} を削除しました`;
	if (msg == exports.msgs['DeteleAgain'])
		return `レビューチャンネル ${wrapCodeBlock(
			params
		)} はすでに削除されています`;
}

exports.reply = async function (interaction, msg, params, row) {
	const msg_title = `${msg.emoji}  ${msg.title}`;
	const msg_content = set_msg_content(msg, params);

	let content;
	if (msg.type == Type.warning)
		content = embed.warning(msg_title, msg_content);
	else if (msg.type == Type.info)
		content = embed.info(msg_title, msg_content);

	if (row)
		await interaction.reply({
			embeds: [content],
			ephemeral: true,
			components: [row],
		});
	else
		await interaction.reply({
			embeds: [content],
			ephemeral: true,
		});
};

exports.followUp = async function (interaction, msg, params) {
	const msg_title = `${msg.emoji}  ${msg.title}`;
	const msg_content = set_msg_content(msg, wrapCodeBlock(params));

	let content;
	if (msg.type == Type.warning)
		content = embed.warning(msg_title, msg_content);
	else if (msg.type == Type.info)
		content = embed.info(msg_title, msg_content);

	await interaction.followUp({ embeds: [content], ephemeral: true });
};

exports.deferReply = async function (interaction) {
	await interaction.deferReply({ ephemeral: true });
};
