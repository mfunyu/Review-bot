exports.warning = function (type, message) {
	const embed = {
		title: type,
		description: message,
		color: 0xfdc23d,
	};
	return embed;
};

exports.info = function (type, message) {
	const embed = {
		title: type,
		color: 0x4548ef,
	};
	return embed;
};

exports.error = function (type, message) {
	const embed = {
		title: type,
		description: message,
		color: 0xd8544f,
	};
	return embed;
};

exports.help = function (type, field) {
	const embed = {
		title: type,
		color: 0x4548ef,
		fields: field,
	};
	return embed;
};
