var winston = require('winston');
const moment = require('moment');

const tsFormat = () => moment().format('YYYY-MM-DD hh:mm:ss').trim();

winston.remove(winston.transports.Console);     // remove the default options
winston.add(
	new winston.transports.Console({
  		format: winston.format.simple(),
  		level: 'info'
	})
);
// add more Winston options if desired

winston.add(
	new winston.transports.File({
		filename: 'full.log',
		options: { flags: 'w' },
		level: 'debug',
		// format: tsFormat,
    	format:	winston.format.json(),
		// format: winston.format.printf(info => `${new Date().toISOString()} ${info.message}`),
	})
);

winston.add(
	new winston.transports.File({
		filename: 'error.log',
		level: 'error',
    	format: winston.format.simple()
	})
);