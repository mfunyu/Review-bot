const db = require('./db.js');
const api = require('./api.js');
const { Client } = require('pg');
const schedule = require('node-schedule');

async function storeDataFromAPI(client, token, fetchFrom) {
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
			db.execInsert(data, client).catch(err => {
				client.end();
				throw new Error(`Postgresql Error: ${err.message}`);
			});
		} catch (err) {
			console.error(err.message);
			break;
		}
	}
	console.log(`Log: DB setup done`);
}

async function initDB(client, token) {
	return client
		.connect()
		.then(() => console.log('Postgresql connected'))
		.then(() => db.createTables(client))
		.then(() => db.getDateToFetch(client))
		.then(result => {
			let fetchFrom = new Date('2020-06-22T02:00:00.000Z');
			if (result.rows.length) {
				fetchFrom = result.rows[0].begin_at;
			}
			console.log(`Fetch from ${fetchFrom.toISOString()}`);
			return fetchFrom;
		})
		.then(fetchFrom => storeDataFromAPI(client, token, fetchFrom))
		.catch(err => {
			console.error(`Postgresql Error: ${err.message}`);
			client.end();
		});
}

exports.manage = async function () {
	const client = new Client();

	const token = await api
		.getAccessToken()
		.then(json => {
			if (json.error) {
				throw new Error(`${json.error}: ${json.error_description}`);
			}
			return json.access_token;
		})
		.catch(err => {
			console.error(`Fetch Error: ${err.message}`);
			process.exit(1);
		});

	await initDB(client, token);

	// schedule.scheduleJob(prosess.env.INTERVAL, function () {
	// 	fetch(api.getAccessTokenRequest())
	// 		.then(response => response.json())
	// 		.then(getReviewHistory())
	// 		.then(query => pgClient.query(query))
	// 		.catch(error => console.log(error));
	// });
};
