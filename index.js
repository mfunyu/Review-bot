const fs = require('fs');
const { Client, Intents } = require('discord.js');
const Discord = require('discord.js');
const dotenv = require('dotenv');
const onclick = require('./onclick.js');
const data = require('./data.js');
const { Client: PGClient } = require('pg');

dotenv.config();

const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES],
});

const pgClient = new PGClient();
data.manage(pgClient);

const commands = {};
const commandFiles = fs
	.readdirSync('./commands')
	.filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands[command.data.name] = command;
}

client.once('ready', async () => {
	const data = [];
	for (const commandName in commands) {
		data.push(commands[commandName].data);
	}
	await client.application.commands.set(data, process.env.SERVER_ID);
});

client.on('interactionCreate', async interaction => {
	if (interaction.isButton()) {
		onclick.respond(interaction);
		return;
	}
	if (!interaction.isCommand()) {
		return;
	}
	const command = commands[interaction.commandName];
	try {
		await command.execute(interaction, Discord, pgClient);
	} catch (error) {
		console.error(error);
		await interaction.reply({
			content: 'There was an error while executing this command!',
			ephemeral: true,
		});
	}
});

client.login(process.env.DISCORD_TOKEN);

process.on('unhandledRejection', (reason, promise) => {
	console.log(reason, promise);
});
