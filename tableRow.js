"use strict"

class tableRow {

	constructor ( title = '', style ='rowHeader') {
		// the row is an array of objects - initialize it
		this._row = [];
		this.newColumn(title, style);
		return this;
		// this._row = [{text: title},'b','c','d','e','f','g','h','i']
	}

// {"text":"Configuration","style":"sectionHeader","colSpan":9,"border":[false,false,false,false]},{},{},{},{},{},{},{},{}

	newColumn( text, style='tableCell' ) {
		// add another column with a 'text' property
		this._row.push({text: text, style: style});
		return this;
	}


	getRow() {
		// PDFmake fails unless it's a new copy so we
		// change it to a string and back to a new object
		return JSON.parse(JSON.stringify(this._row));
	}

}

module.exports = tableRow;