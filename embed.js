exports.notfound = function (message) {
	const embed = {
		title: ":warning: Not Found",
		description: message,
		color: 0xfdc23d,
	}
	return embed;
}

exports.warning = function (type, message) {
	const embed = {
		title: ":warning: " + type,
		description: message,
		color: 0xfdc23d,
	}
	return embed;
}

exports.info = function (type, message) {
	const embed = {
		title: ":notepad_spiral: " + type,
		description: message,
		color: 0x4548ef,
	}
	return embed;
}