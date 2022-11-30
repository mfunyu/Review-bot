const embed = require('./embed.js');

function wrapCodeBlock(string) {
	if (string.startsWith('\n')) return `\n\`${string.substring(1)}\``;
	return `\`${string}\``;
}

var Type = {
	info: 0,
	warning: 1,
	error: 2,
	help: 3,
};

exports.msgs = {
	Duplicate: { type: Type.warning, emoji: ':warning:', title: 'Duplicate' },
	NotFound: { type: Type.warning, emoji: ':warning:', title: 'Not Found' },
	NotInVC: { type: Type.warning, emoji: ':mute:', title: 'Not In VC' },
	NotInCategory: { type: Type.warning, emoji: ':mute:', title: 'Not In VC' },
	DeteleAgain: { type: Type.warning, emoji: ':warning:', title: 'Not Found' },
	Invalid: { type: Type.error, emoji: ':x:', title: 'Invalid Input' },
	Created: { type: Type.info, emoji: ':loud_sound:', title: 'Created' },
	Choose: { type: Type.info, emoji: ':notepad_spiral:', title: 'Choose' },
	Deleted: { type: Type.info, emoji: ':wastebasket:', title: 'Deteled' },
	Notify: { type: Type.info, emoji: ':mega:', title: 'Notification' },
	Help: { type: Type.help, emoji: ':mega:', title: 'Help' },
	History: { type: Type.help, emoji: ':clock2:', title: 'Review History' },
};

function createChooseMessageContent(vc_lists) {
	const dict = [
		'zero',
		'one',
		'two',
		'three',
		'four',
		'five',
		'six',
		'seven',
		'eight',
		'nine',
		'regional_indicator_a',
		'regional_indicator_b',
		'regional_indicator_c',
		'regional_indicator_d',
		'regional_indicator_e',
		'regional_indicator_f',
	];
	const VC_LIMIT = 15;

	let msg = '';
	let index = 0;

	vc_lists.forEach(({ name }) => {
		if (index % 5 == 0) {
			msg += '\n';
		}
		index++;
		if (index > VC_LIMIT) {
			return;
		}
		msg += `:${dict[index]}:  ${wrapCodeBlock(name)}\n`;
	});

	if (index > VC_LIMIT) {
		const rest_channels = index - VC_LIMIT;
		msg += `その他、計${wrapCodeBlock(rest_channels.toString())}\
		チャンネルが存在しています\n`;
	}
	return msg;
}

function set_msg_content(msg, params) {
	if (msg == exports.msgs['Duplicate']) {
		return `レビューチャンネル ${wrapCodeBlock(
			params
		)} はすでに存在しています`;
	} else if (msg == exports.msgs['NotFound']) {
		return `${wrapCodeBlock(params)}\
		を含むボイスチャンネルが見つかりません`;
	} else if (msg == exports.msgs['NotInVC']) {
		return '入室中のボイスチャンネルがありません';
	} else if (msg == exports.msgs['NotInCategory']) {
		return '入室中のボイスチャンネルがレビューチャンネルではありません';
	} else if (msg == exports.msgs['Created']) {
		return `レビューチャンネル ${wrapCodeBlock(params)} を作成しました`;
	} else if (msg == exports.msgs['Choose']) {
		return `以下のチャンネルが見つかりました。\n削除したいチャンネルの番号を選択してください\n\
		${createChooseMessageContent(params)}`;
	} else if (msg == exports.msgs['Deleted']) {
		return `レビューチャンネル ${wrapCodeBlock(params)} を削除しました`;
	} else if (msg == exports.msgs['DeteleAgain']) {
		return `レビューチャンネル ${wrapCodeBlock(params)} \
		はすでに削除されています`;
	} else if (msg == exports.msgs['Invalid']) {
		return `少なくとも以下のフィールドの入力が不正です\n\
		${wrapCodeBlock(params)}`;
	} else if (msg == exports.msgs['Notify']) {
		return `${wrapCodeBlock(params)}から、\
		こちらのチャンネルでレビューが予定されています`;
	}
}

function set_embed(msg, params) {
	const msg_title = `${msg.emoji}  ${msg.title}`;

	if (msg.type == Type.warning) {
		return embed.warning(msg_title, set_msg_content(msg, params));
	} else if (msg.type == Type.info) {
		return embed.info(msg_title, set_msg_content(msg, params));
	} else if (msg.type == Type.error) {
		return embed.error(msg_title, set_msg_content(msg, params));
	} else if (msg.type == Type.help) {
		return embed.help(msg_title, params);
	}
}

exports.reply = async function (interaction, msg, params, row) {
	content = set_embed(msg, params);
	const ephemeral = interaction.channel.name != process.env.REVIEW_CHANNEL;

	if (row) {
		await interaction.reply({
			embeds: [content],
			ephemeral,
			components: row,
		});
	} else {
		await interaction.reply({
			embeds: [content],
			ephemeral,
		});
	}
};

exports.followUp = async function (interaction, msg, params) {
	content = set_embed(msg, wrapCodeBlock(params));
	const ephemeral = interaction.channel.name != process.env.REVIEW_CHANNEL;

	await interaction.followUp({ embeds: [content], ephemeral });
};

exports.deferReply = async function (interaction) {
	const ephemeral = interaction.channel.name != process.env.REVIEW_CHANNEL;
	await interaction.deferReply({ ephemeral });
};

exports.send = function (channel, msg, user, param) {
	content = set_embed(msg, param);

	channel.send({ content: `${user.toString()} さん`, embeds: [content] });
};
