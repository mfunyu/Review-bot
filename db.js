exports.formQuery = function (data) {
	let query =
		'INSERT INTO reviews (corrector, corrected, project, begin_at) VALUES ';

	const len = data.length;
	data.forEach((e, i) => {
		query += `('${e.corrector}', '${e.correcteds}', '${e.project}', '${e.time}')`;
		if (i != len - 1) query += ', ';
	});

	return query;
};
