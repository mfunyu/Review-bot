const fs = require('fs');
const { Client, Intents } = require('discord.js');
const Discord = require('discord.js');
const dotenv = require('dotenv');
const onclick = require('./onclick.js');
const db = require('./db.js');
const { Client: PGClient } = require('pg');
const schedule = require('node-schedule');

dotenv.config();

const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES],
});

const pgClient = new PGClient();

pgClient.connect();

pgClient.query(
	'CREATE TABLE IF NOT EXISTS reviews ( \
		id UUID PRIMARY KEY DEFAULT gen_random_uuid(), \
		corrector VARCHAR ( 25 ) NOT NULL, \
		corrected VARCHAR ( 25 ) NOT NULL, \
		project VARCHAR ( 25 ) NOT NULL, \
		begin_at TIMESTAMP NOT NULL \
		)'
);

async function run() {
	try {
		const res = await api.getAccessToken();
		await api.getAllData(res.access_token);

		let i = 1;
		while (True) {
			const rawdata = await getRawData(token, i);
			const data = parseData(rawdata);
			if (rawdata.length != page_size) {
				break;
			}
			const query = db.formQuery(data);
			pgClient.query(query);
			i++;
		}
	} catch {
		failureCallback(error);
	}
}

// schedule.scheduleJob(prosess.env.INTERVAL, function () {
// 	fetch(api.getAccessTokenRequest())
// 		.then(response => response.json())
// 		.then(getReviewHistory())
// 		.then(query => pgClient.query(query))
// 		.catch(error => console.log(error));
// });

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
