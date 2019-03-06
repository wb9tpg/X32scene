"use strict";
var fs = require('fs');
var printer = require('./X32PDF');
var readline = require('readline');
var winston = require('winston');
var logger = require('./logger');
// var dd = require('./docDef');


var DocDef = require('./docDef');
var styles = {
	title: {
		fontSize: 18,
		bold: true,
		margin: [0, 300, 0, 10],
		alignment: 'center'
		},		
		subtitle: {
		fontSize: 18,
		bold: true,
		margin: [0, 10, 0, 0],
		alignment: 'center'
	},		
	header: {
		fontSize: 18,
		bold: true,
		margin: [0, 0, 0, 10]
	},
	subheader: {
		fontSize: 16,
		bold: true,
		margin: [0, 10, 0, 5]
	},
	tableExample: {
		margin: [0, 5, 0, 5]
	},
	sectionHeader: {
		bold: true,
		fontSize: 18,
		color: 'black',
		margin: [0, 15, 0, 5],
		alignment: 'center'
	},
	tableHeader: {
		bold: true,
		fontSize: 12,
		color: 'black',
		alignment: 'center'
	},
	rowHeader: {
		bold: true,
		fontSize: 10,
		color: 'black'
	},
	tableCell: {
		bold: false,
		fontSize: 10,
		color: 'black',
		alignment: 'center'
	},
	sym: { fontName: 'symbol'},
	tableSpan: {
		bold: false,
		fontSize: 10,
		color: 'black',
		alignment: 'center'
	}
}
var defaultStyle = {
	font: 'Helvetica'
}

const dd = new DocDef(styles,defaultStyle);


var X32 = require('./X32class');
const x32 = new X32();

winston.info('Starting to Parse Scene file');

var rd = readline.createInterface({
	input: fs.createReadStream('JC V6 PostFader.scn'),
	output: function() {},
	console: false
});

// All lines process begin output
rd.on('close', function() {
	winston.info('Scene File Parsing Complete');
	winston.info('Formatting Scene Document');
	dd.buildSceneDocument(x32);
	var prettyJSON = JSON.stringify(x32, (k, v) => v === undefined ? null : v, 4);
 	winston.debug(prettyJSON);
	printer.outputPDF(dd.getDD(), 'output.pdf');
	winston.info("Scene Document Complete");
});

rd.on('line', function(line) {
	// console.log(line);
	x32.parseLine(line);
});	

