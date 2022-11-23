exports.createTables = function (client) {
	const promise1 = client.query(
		'CREATE TABLE IF NOT EXISTS reviews ( \
			id INTEGER PRIMARY KEY, \
			corrector VARCHAR ( 25 ) NOT NULL, \
			project VARCHAR ( 50 ) NOT NULL, \
			begin_at TIMESTAMP WITH TIME ZONE NOT NULL \
			)'
	);

	const promise2 = client.query(
		'CREATE TABLE IF NOT EXISTS correcteds ( \
			id VARCHAR ( 25 ) PRIMARY KEY, \
			review_id INTEGER REFERENCES reviews (id) NOT NULL, \
			corrected VARCHAR ( 25 ) NOT NULL \
			)'
	);

	return Promise.all([promise1, promise2]);
};

exports.getDateToFetch = function (client) {
	let query = 'SELECT begin_at FROM reviews ORDER BY begin_at DESC LIMIT 1';
	return client.query(query);
};

exports.execInsert = function (data, client) {
	let query =
		'INSERT INTO reviews (id, corrector, project, begin_at) VALUES ';

	data.forEach(e => {
		query += `('${e.id}', '${e.corrector}', '${e.project}', '${e.time}'), `;
	});
	query = query.slice(0, -2) + ' ON CONFLICT DO NOTHING';

	let query2 = 'INSERT INTO correcteds (id, review_id, corrected) VALUES ';

	data.forEach(e => {
		e.correcteds.forEach(corrected => {
			query2 += `('${e.id}-${corrected.id}', '${e.id}', '${corrected.login}'), `;
		});
	});
	query2 = query2.slice(0, -2) + ' ON CONFLICT DO NOTHING';

	return Promise.all([client.query(query), client.query(query2)]);
};
