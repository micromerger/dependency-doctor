const meow = require('meow');
const meowHelp = require('cli-meow-help');

const flags = {
	init: {
		type: `boolean`,
		default: false,
		alias: `n`,
		desc: `Create Config File`
	},
	start: {
		type: `boolean`,
		default: false,
		alias: `s`,
		desc: `Start Sending Notification`
	},
	recursive: {
		type: `boolean`,
		default: false,
		alias: `r`,
		desc: `Start as Cron Job`
	},
	local: {
		type: `boolean`,
		default: true,
		alias: `l`,
		desc: `Save a local copy of report`
	},
	clear: {
		type: `boolean`,
		default: false,
		alias: `c`,
		desc: `Clear the console`
	},
	noClear: {
		type: `boolean`,
		default: false,
		desc: `Don't clear the console`
	},
	debug: {
		type: `boolean`,
		default: false,
		alias: `d`,
		desc: `Print debug info`
	},
	version: {
		type: `boolean`,
		alias: `v`,
		desc: `Print CLI version`
	}
};

const commands = {
	help: { desc: `Print help info` }
};

const helpText = meowHelp({
	name: `check-dep`,
	flags,
	commands
});

const options = {
	inferType: true,
	description: false,
	hardRejection: false,
	flags
};

module.exports = meow(helpText, options);
