"use strict";
var winston = require('winston');
var fs = require('fs');

var fonts = {
  Courier: {
    normal: 'Courier',
    bold: 'Courier-Bold',
    italics: 'Courier-Oblique',
    bolditalics: 'Courier-BoldOblique'
  },
  Helvetica: {
    normal: 'Helvetica',
    bold: 'Helvetica-Bold',
    italics: 'Helvetica-Oblique',
    bolditalics: 'Helvetica-BoldOblique'
  },
  Times: {
    normal: 'Times-Roman',
    bold: 'Times-Bold',
    italics: 'Times-Italic',
    bolditalics: 'Times-BoldItalic'
  },
  Symbol: {
    normal: 'Symbol'
  },
  ZapfDingbats: {
    normal: 'ZapfDingbats'
  }
};




var PdfPrinter = require('pdfmake');

class Pdf extends PdfPrinter {
	constructor(fonts) {
		super(fonts);	// can the PDFmake constructor
	}

	outputPDF(dd,fn) {
    // console.log('here');
    // console.log(dd);
		var pdfDoc = this.createPdfKitDocument(dd);
		pdfDoc.pipe(fs.createWriteStream(fn));
		pdfDoc.end();
	}
}

var printer = new Pdf(fonts);

module.exports = printer;