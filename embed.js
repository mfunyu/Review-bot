exports.warning = function (type, message) {
	const embed = {
		title: type,
		description: message,
		color: 0xfdc23d,
	}
	return embed;
}

exports.info = function (type, message) {
	const embed = {
		title: type,
		description: message,
		color: 0x4548ef,
	}
	return embed;
}