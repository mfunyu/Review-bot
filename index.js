const fs = require('fs');
const { Client, Intents } = require('discord.js');
const Discord = require('discord.js');
const dotenv = require('dotenv');
const onclick = require('./onclick.js');
const db = require('./db.js');
const api = require('./api.js');
const { Client: PGClient } = require('pg');
const schedule = require('node-schedule');

dotenv.config();

const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES],
});

const pgClient = new PGClient();
let fetchFrom = new Date('2020-06-22T02:00:00.000Z');
pgClient
	.connect()
	.then(() => console.log('Postgresql connected'))
	.then(() => db.createTables(pgClient))
	.then(() => db.getDateToFetch(pgClient))
	.then(result => {
		if (result.rows.length) {
			fetchFrom = result.rows[0].begin_at;
		}
		console.log(`Fetch from ${fetchFrom.toISOString()}`);
	})
	.then(() => api.getAccessToken())
	.then(res => storeDataFromAPI(res.access_token))
	.catch(err => {
		console.error(`Postgresql Error: ${err.message}`);
		pgClient.end();
	});

async function storeDataFromAPI(token) {
	let length = 100;
	let i = 0;
	while (length == 100) {
		try {
			const data = await api
				.getRawData(token, fetchFrom, ++i)
				.then(rawdata => {
					if (rawdata.error) {
						throw new Error(`${rawdata.error}: ${rawdata.message}`);
					}
					return api.parseData(rawdata);
				});
			length = data.length;
			db.execInsert(data, pgClient).catch(err => {
				pgClient.end();
				throw new Error(`Postgresql Error: ${err.message}`);
			});
		} catch (err) {
			console.error(err.message);
			break;
		}
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
