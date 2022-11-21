exports.execInsert = function (data, client) {
	let query =
		'INSERT INTO reviews (id, corrector, project, begin_at) VALUES ';

	data.forEach(e => {
		query += `('${e.id}', '${e.corrector}', '${e.project}', '${e.time}'), `;
	});
	query = query.slice(0, -2);

	let query2 = 'INSERT INTO correcteds (id, review_id, corrected) VALUES ';

	data.forEach(e => {
		e.correcteds.forEach(corrected => {
			query2 += `('${e.id}-${corrected.id}', '${e.id}', '${corrected.login}'), `;
		});
	});
	query2 = query2.slice(0, -2);

	return Promise.all([client.query(query), client.query(query2)]).catch(
		error => {
			console.log(query, query2, error);
		}
	);
};
