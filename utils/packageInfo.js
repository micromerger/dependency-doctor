const axios = require('axios');
const { compareVersion } = require('./compareVersion');

let REG_LINK = 'http://registry.npmjs.com/';

exports.getPackageInfo = async dependencies => {
	let packageInfo = [];
	for (let [key, value] of Object.entries(dependencies)) {
		// we have a scoped respository
		let packageName = key;
		key = key.replaceAll('@', '%40');
		key = key.replaceAll('/', '%2F');
		value = value.replace('^', '');
		value = value.replace('~', '');
		let link = REG_LINK + key;
		let res = await axios.get(link);
		packageInfo.push({
			name: packageName,
			latestVersion: res.data['dist-tags']?.latest,
			deprecated: res.data.versions[value]?.deprecated ? true : false,
			updateStatus: compareVersion(res.data['dist-tags']?.latest, value),
			version: value
		});
	}
	return packageInfo;
};
