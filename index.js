const { Client, Intents } = require('discord.js');
const dotenv = require('dotenv');

dotenv.config();

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once("ready", async () => {
	const data = [{
		name: "ping",
		description: "Replies with Pong!",
	},
	{
		name: "poooooong",
		description: "Replies with Ping!",
	}];
	await client.application.commands.set(data, process.env.SERVER_ID);
	console.log("Ready!");
});

// reply
client.on("interactionCreate", async (interaction) => {
	if (!interaction.isCommand()) {
		return;
	}
	if (interaction.commandName === 'ping') {
		await interaction.reply('Pong！');
	}
});

// ephemeral response
client.on("interactionCreate", async (interaction) => {
	if (!interaction.isCommand()) {
		return;
	}
	if (interaction.commandName === 'poooooong') {
		await interaction.reply({ content: 'Ping!', ephemeral: true });
	}
});


client.login(process.env.DISCORD_TOKEN);
