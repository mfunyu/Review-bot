const CLIENT_UID =
	'78df0ef4ae4b22b23a7bece8d1e519c31654300c6b15fde80468c19562f3ce88';
const CLIENT_SECRET =
	'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';

async function getAccessTokenHeader() {
	const request = new Request('https://api.intra.42.fr/oauth/token', {
		method: 'POST',
		body: `grant_type=client_credentials&client_id=${CLIENT_UID}&client_secret=${CLIENT_SECRET}`,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
	});
	const res = await fetch(request)
		.then(response => response.json())
		.catch();
	const headers = {
		Authorization: `Bearer ${res.access_token}`,
	};
	return headers;
}

async function getReviewHistories(idx) {
	const headers = await getAccessTokenHeader();
	const options = `?filter[campus_id]=26&sort=-begin_at&page[size]=100&page[number]=${idx}`;

	return await fetch('https://api.intra.42.fr/v2/scale_teams' + options, {
		headers,
	})
		.then(response => response.json())
		.catch();
}

function parse(data) {
	const histories = [];
	data.forEach(e => {
		let correcteds = [];
		e.correcteds.forEach(c => {
			correcteds.push(c.login);
		});
		let project = e.team.project_gitlab_path;
		project = project.slice(project.lastIndexOf('/') + 1);
		histories.push({
			time: e.begin_at,
			project,
			corrector: e.corrector.login,
			correcteds,
		});
	});
	return histories;
}

function sleep(ms) {
	return new Promise(resolve => {
		setTimeout(resolve, ms);
	});
}

async function run() {
	const alldata = [];
	let idx = 1;
	while (true) {
		const data = await getReviewHistories(idx);
		const parsedData = parse(data);
		alldata.concat(parsedData);
		console.log(parsedData);
		if (parsedData.length != 100) {
			break;
		}
		idx = idx + 1;
		await sleep(1000);
	}
}

run();
