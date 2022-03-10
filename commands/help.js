const send = require('../send.js');

module.exports = {
	data: {
		name: 'help',
		description: "show help for Review-bot's commands",
	},
	async execute(interaction) {
		if (interaction.commandName == 'help') {
			await send.reply(interaction, send.msgs['Help']);
		}
	},
};
