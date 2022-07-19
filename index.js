#!/usr/bin/env node

/**
 * check-dep
 * to find all the depricated dependencies and send an email based on that.
 *
 * @author Naveed Abdullah <https://github.com/naveedmm>
 */
var cron = require('node-cron');
const fs = require('fs');
const alert = require('cli-alerts');

const { sendMail } = require('./utils/sendEmail');
const initialize = require('./utils/init');
const cli = require('./utils/cli');
const log = require('./utils/log');
const template = require('./utils/configTemplate');
const chalk = require('chalk');
const { getPackageInfo } = require('./utils/packageInfo');
const { generateHTML } = require('./utils/generateHTML');
const input = cli.input;
const flags = cli.flags;
const { clear, debug, init, start, recursive, local } = flags;

(async () => {
	initialize({ clear });
	input.includes(`help`) && cli.showHelp(0);
	debug && log(flags);
	//creating a template file to
	if (init) {
		let json = JSON.stringify(template);
		fs.writeFile('doctor.config.json', json, 'utf8', err => {
			if (err)
				return alert({
					msg: 'Unable to create doctor.config.json file in current directory',
					type: 'error'
				});
			else
				return alert({
					msg: 'A doctor.config.json.json file is created in current directory. Fill the data in config to perfrom action',
					type: 'success',
					name: `DONE`
				});
		});
	}
	if (start) {
		try {
			// --------- all the alerts for the user to see
			recursive &&
				alert({
					msg: 'You chose recursive run. To run as one time job, use --recursive=false flag',
					type: 'info'
				});
			!recursive &&
				alert({
					msg: 'You chose on time run. To run as recurrsive cron job, use --recursive flag',
					type: 'info'
				});
			local &&
				alert({
					msg: 'You chose to save a local copy of report. For Email service, use --local=false flag',
					type: 'info'
				});
			!local &&
				alert({
					msg: 'You chose to send report by email. To receive report locally, use --local flag',
					type: 'info'
				});

			// ---------- all the error handling

			if (!fs.existsSync('doctor.config.json')) {
				return alert({
					msg: "Config File doesn't exist. Use init command to create config file",
					type: 'error'
				});
			}

			let rawdata = fs.readFileSync('doctor.config.json');

			let config = JSON.parse(rawdata);

			if (!config) {
				return alert({
					msg: 'doctor.config.json File is empty. Fill the data in config to perfrom action',
					type: 'error'
				});
			}
			if (
				!config.paths ||
				!Array.isArray(config.paths) ||
				config.paths.length === 0
			) {
				return alert({
					msg: 'Need an ARRAY of absolute paths to package.json files',
					type: 'error'
				});
			}
			if (!cron.validate(config.cron)) {
				return alert({
					msg: 'Invalid cron expression',
					type: 'error'
				});
			}
			for (let i = 0; i < config.paths.length; i++) {
				if (!fs.existsSync(config.paths[i])) {
					return alert({
						msg: `File "${config.paths[i]}" doesn't exist`,
						type: 'error'
					});
				}
			}

			// informing user about the configurations

			alert({
				msg: 'provided config: ',
				type: 'info'
			});
			console.log(config);

			for (let i = 0; i < config.paths.length; i++) {
				const { dependencies, name } = require(config.paths[0]);
				if (!dependencies) {
					return alert({
						msg: 'Unable to read package.json file',
						type: 'error'
					});
				}
				if (recursive) {
					cron.schedule(config.cron, async () => {
						let packageInfo = await getPackageInfo(dependencies);
						let content = {
							text: JSON.stringify(packageInfo),
							subject: `${name.toUpperCase()}  Package Report`
						};
						if (local) {
							alert({
								msg: `${name.toUpperCase()} Package Report`,
								type: 'success'
							});
							console.table(packageInfo);
							fs.writeFile(
								'dependency_report.html',
								generateHTML(packageInfo),
								'utf8',
								err => {
									if (err)
										return alert({
											msg: 'Unable to create report file in current directory',
											type: 'error'
										});
									else
										return alert({
											msg: 'A dependency_report.html file is created in current directory. Fill the data in config to perfrom action',
											type: 'success',
											name: `DONE`
										});
								}
							);
						} else {
							sendMail({ config, content, packages: packageInfo })
								.then(result => {
									console.log(result);
								})
								.catch(err => {
									console.log(err);
								});
						}
					});
				} else {
					let packageInfo = await getPackageInfo(dependencies);
					let content = {
						text: JSON.stringify(packageInfo),
						subject: `${name.toUpperCase()}  Package Report`
					};
					if (local) {
						console.table(packageInfo);
						fs.writeFile(
							'dependency_report.html',
							generateHTML(packageInfo, name),
							'utf8',
							err => {
								if (err)
									return alert({
										msg: 'Unable to create report file in current directory',
										type: 'error'
									});
								else
									return alert({
										msg: 'A dependency_report.html file is created in current directory. Fill the data in config to perfrom action',
										type: 'success',
										name: `DONE`
									});
							}
						);
					} else {
						sendMail({ config, content, packages: packageInfo })
							.then(result => {
								console.log(result);
							})
							.catch(err => {
								console.log(err);
							});
					}
				}
			}
		} catch (err) {
			console.log(err);
			// alert({ type: 'error', msg: err });
		}
	} else {
		cli.showHelp(0);
	}
})();
