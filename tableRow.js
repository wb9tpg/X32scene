"use strict"

class tableRow {

	constructor ( title = '', style ='rowHeader', span=1) {
		// the row is an array of objects - initialize it
		this._row = [];
		this.newColumn(title, style, span);
		return this;
		// this._row = [{text: title},'b','c','d','e','f','g','h','i']
	}

// {"text":"Configuration","style":"sectionHeader","colSpan":9,"border":[false,false,false,false]},{},{},{},{},{},{},{},{}

	newColumn( text, style='tableCell', span=1 ) {
		// add another column with a 'text' property
		if (span == 1) {
			this._row.push({text: text, style: style});
		} else {
			this._row.push({text: text, style: style, colSpan: span});
			for (var i = 1; i < span; i++) {
				this._row.push({});
			}
		}
	// console.log(this._row)
 	return this
	}


	getRow() {
		// PDFmake fails unless it's a new copy so we
		// change it to a string and back to a new object
		return JSON.parse(JSON.stringify(this._row));
	}

}

module.exports = tableRow;