exports.getAccessToken = function () {
	const body =
		'grant_type=client_credentials' +
		'&' +
		`client_id=${process.env.CLIENT_UID}` +
		'&' +
		`client_secret=${process.env.CLIENT_SECRET}`;
	const request = new Request('https://api.intra.42.fr/oauth/token', {
		method: 'POST',
		body,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
	});

	return fetch(request).then(response => response.json());
};

exports.getRawData = function (token, idx) {
	const headers = {
		Authorization: `Bearer ${token}`,
	};
	const campus_id = 26;
	const page_size = 100;
	const options =
		'?' +
		`filter[campus_id]=${campus_id}` +
		'&' +
		`filter[cursus_id]=${process.env.CURSUS_ID}` +
		'&' +
		'sort=-begin_at' +
		'&' +
		`page[size]=${page_size}` +
		'&' +
		`page[number]=${idx}`;

	const request = new Request(
		'https://api.intra.42.fr/v2/scale_teams' + options,
		{ headers }
	);

	return fetch(request).then(response => response.json());
};

exports.parseData = function (rawdata) {
	const histories = [];
	rawdata.forEach(e => {
		let project = e.team.project_gitlab_path;
		project = project.slice(project.lastIndexOf('/') + 1);

		histories.push({
			time: e.begin_at,
			project,
			corrector: e.corrector.login,
			corrected: e.corrected,
		});
	});
	return histories;
};
