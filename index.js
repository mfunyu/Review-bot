const fs = require('fs');
const { Client, GatewayIntentBits } = require('discord.js');
const dotenv = require('dotenv');
const onclick = require('./src/onclick.js');
const data = require('./src/data.js');
const send = require('./src/send.js');
const { Client: PGClient } = require('pg');

dotenv.config();

const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
});

const pgClient = new PGClient();
data.manage(pgClient).catch(err => {
	console.error(`Error Fetch: ${err.message}`);
	send.dm_admin(client, err, send.msgs['DM']);
});

const commands = {};
const commandFiles = fs
	.readdirSync('./src/commands')
	.filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./src/commands/${file}`);
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
		await command.execute(interaction, pgClient);
	} catch (error) {
		console.error(`Error Command Excution: ${error}`);
		if (error.message == 'Client was closed and is not queryable') {
			await send.reply(interaction, send.msgs['Error']);
		} else {
			await interaction.reply({
				content: 'There was an error while executing this command!',
				ephemeral: true,
			});
		}
	}
});

client.login(process.env.DISCORD_TOKEN);

process.on('unhandledRejection', (reason, promise) => {
	console.error('Error UnhandledRejection:', reason, promise);
});
