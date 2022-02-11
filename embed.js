exports.warning = function (message) {
	const embed = {
		title: ":warning: Not Found",
		description: message,
		color: 0xfdc23d,
	}
	return embed;
}

exports.info = function (message) {
	const embed = {
		title: ":notepad_spiral: Choose",
		description: message,
		color: 0x4548ef,
	}
	return embed;
}