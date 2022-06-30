#!/usr/bin/env node

/**
 * check-dep
 * to find all the depricated dependencies and send an email based on that.
 *
 * @author Naveed Abdullah <https://github.com/naveedmm>
 */
const axios = require('axios');
var cron = require('node-cron');
const fs = require('fs');
const alert = require('cli-alerts');

const { compareVersion } = require('./utils/compareVersion');
const { sendMail } = require('./utils/sendEmail');
const initialize = require('./utils/init');
const cli = require('./utils/cli');
const log = require('./utils/log');
const template = require('./utils/configTemplate');
const { resolve } = require('path');
const { Console } = require('console');

let REG_LINK = 'http://registry.npmjs.com/';

const input = cli.input;
const flags = cli.flags;
const { clear, debug, init, start } = flags;

(async () => {
	initialize({ clear });
	input.includes(`help`) && cli.showHelp(0);
	debug && log(flags);

	//creating a template file to
	if (init) {
		let json = JSON.stringify(template);
		fs.writeFile('checkdep.json', json, 'utf8', err => {
			if (err)
				return alert({
					msg: 'Unable to create config file in current directory',
					type: 'error'
				});
			else
				return alert({
					msg: 'A checkdep.json file is created in current directory. Fill the data in config to perfrom action',
					type: 'success',
					name: `DONE`
				});
		});
	} else if (start) {
		if (!fs.existsSync('checkdep.json')) {
			return alert({
				msg: "Config File doesn't exist. Use init command to create config file",
				type: 'error'
			});
		}

		try {
			let rawdata = fs.readFileSync('checkdep.json');
			let config = JSON.parse(rawdata);
			console.log(config);
			if (!fs.existsSync(config.path)) {
				return alert({
					msg: 'Unable to find package.json file',
					type: 'error'
				});
			}
			const { dependencies, name } = require(config.path);
			if (!dependencies) {
				return alert({
					msg: 'Unable to read package.json file',
					type: 'error'
				});
			}
			cron.schedule(config.cron, async () => {
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
						deprecated: res.data.versions[value]?.deprecated
							? true
							: false,
						updateStatus: compareVersion(
							res.data['dist-tags']?.latest,
							value
						),
						version: value
					});
				}
				let content = {
					html: JSON.stringify(packageInfo),
					text: JSON.stringify(packageInfo),
					subject: `${name.toUpperCase()}  Package Report`
				};
				sendMail({ config, content, packages: packageInfo })
					.then(result => {
						console.log(result);
					})
					.catch(err => {
						console.log(err);
					});
			});
		} catch (err) {
			console.log(err);
			// alert({ type: 'error', msg: err });
		}
	} else {
		cli.showHelp(0);
	}
})();
