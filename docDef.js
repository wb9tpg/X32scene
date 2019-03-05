var winston = require('winston');
var moment = require('moment');

var Off = 'Off';
var On = 'On';

class DocumentDefinition {

	constructor(s, d) {
		this.dd = {};  
		this.dd.content = [];
		this.dd.styles = s;
		this.dd.defaultStyle = d;
	}

	addContent(c) {
		this.dd.content.push(c);
	}

	getDD() {
		return this.dd
	}

	buildSceneDocument(x32) {
		this.x32 = x32;
		this.titlePage();
		this.channelPage();
	}

	titlePage ( ) {
		this.addContent({
			text: this.x32.name, 
			style: 'title'
		});
		this.addContent({
			text: 'X32 Scene Documenation\n\n'+moment(new Date).format("MMMM D, YYYY"),
			style: 'subtitle'
		});
	}

	titleBar( title ) { 
		return (title=='') ? ([{text: ' ', colSpan:9, style:'tableHeader', border: [false,false,false,false]},{},{},{},{},{},{},{},{}]) : ([{text: title,colSpan:9,style:'tableHeader',alignment:'center',border:[false,false,false,false]},{},{},{},{},{},{},{},{}]);
	}  

	channelPage ( ) {
		for (var i=0; i<32; i=i+8) {
			var w = 42;
			var tab1 = {style: 'tableExample', table: { widths: ['*',w,w,w,w,w,w,w,w],body: [] }};
			// var tab2 = {style: 'tableExample', table: {headerRows: 2, body: [] }};
			this.addContent({
				text: 'Channels',
				style: 'header',
				pageBreak: 'before'
			});
			var chN = [(i+1).pad(),(i+2).pad(),(i+3).pad(),(i+4).pad(),
			           (i+5).pad(),(i+6).pad(),(i+7).pad(),(i+8).pad()];
			// var ids = [{text: ' ',border:[false,false,false,false]}]
			var IDs = ['x']
			var ChIds = [
				'','Ch'+chN[0], 'Ch'+chN[1], 'Ch'+chN[2], 'Ch'+chN[3], 'Ch'+chN[4], 'Ch'+chN[5], 'Ch'+chN[6], 'Ch'+chN[7]
			];
			// var names = [{text: 'Name', style: 'tableHeader'}];
			var names   = rowHeader('Name');
			var colors  = rowHeader('Color');
			var trims   = rowHeader('Trim (dB)');
			var links   = rowHeader('Linked');
			var gates   = rowHeader('Gate Thr(dB)');
			var inserts = rowHeader('Insert Pre/Post');
			var dynPos  = rowHeader('Dyn Pre/Post')
			var eqs     = rowHeader('Eq');
			var dynThrs= rowHeader('Compr Thr(dB)');
			var mainPans = rowHeader('Main Pan');

			var sources = rowHeader('Input Bus');
			var ports   = rowHeader('Source');
			var delays  = rowHeader('Delay');
			var lowCuts = rowHeader('Low Cut');

			for (var j=0; j<8; j++) {

				var chId = chN[j];  
				var config = this.x32['ch'][chId]['config'];				
				var delay = this.x32['ch'][chId]['delay'];				
				var preamp = this.x32['ch'][chId]['preamp'];				
				var gate = this.x32['ch'][chId]['gate'];				
				var dyn = this.x32['ch'][chId]['dyn'];				
				var insert = this.x32['ch'][chId]['insert'];				
				var eq = this.x32['ch'][chId]['eq'];				
				var mix = this.x32['ch'][chId]['mix'];				
				var grp = this.x32['ch'][chId]['grp'];				
				var autoMix = this.x32['ch'][chId]['automix'];			
				var source = this.x32['ch'][chN[j]]['config']['source']; 

				IDs.push('Ch'+chId);
				ChIds.push({text: 'Ch'+chId});
				names.push(cell(config.name));
				colors.push(cell(config.color));
				ports.push({text: (config.source=='OFF')? Off : this.x32['config']['routing']['ports'][source], style: 'tableCell'});
				trims.push(cell(preamp.trim));
				links.push((typeof config['linked'] === 'undefined') ? {} : {text: ((config.linked=='ON')?On:Off), style:'tableCell', colSpan:2 } );
				gates.push(cell(gate.on, gate.thr));
				inserts.push(cell(insert.on, insert.pos));
				dynPos.push(cell(dyn.pos));
				eqs.push(cell(eq.on));
				// compThrs.push(cell())
				dynThrs.push(cell(dyn.on,dyn.thr));
				mainPans.push(cell(mix.st,mix.pan));


				// sources.push({text: config.source, style: 'tableCell'});
				delays.push(cell(delay.on, delay.time));
				lowCuts.push(cell(preamp.hpon, preamp.hpf+'Hz'));
				// lowCuts.push({text: (preamp.hpon=='OFF')? Off : preamp.hpf+'Hz', style: 'tableCell'}); 
			}

			tab1.table.body.push(
				// Column Titles	
				[
					{text:''},
					{text: ChIds[1],style:'tableHeader'},
					{text: ChIds[2],style:'tableHeader'},
					{text: ChIds[3],style:'tableHeader'},
					{text: ChIds[4],style:'tableHeader'},
					{text: ChIds[5],style:'tableHeader'},
					{text: ChIds[6],style:'tableHeader'},
					{text: ChIds[7],style:'tableHeader'},
					{text: ChIds[8],style:'tableHeader'},
				],
				// Temporary Design Aid Index Row
				['0','1','2','3','4','5','6','7','8',],
				// Scribble Strip Names
				[
					{text: names[0],style:'rowHeader'},
					{text: names[1]},
					{text: names[2]},
					{text: names[3]},
					{text: names[4]},
					{text: names[5]},
					{text: names[6]},
					{text: names[7]},
					{text: names[8]},
				],
				// Scribble Strip Colors
				[
					{text: colors[0],style:'rowHeader'},
					{text: colors[1],style:'tableHeader'},
					{text: colors[2],style:'tableHeader'},
					{text: colors[3],style:'tableHeader'},
					{text: colors[4],style:'tableHeader'},
					{text: colors[5],style:'tableHeader'},
					{text: colors[6],style:'tableHeader'},
					{text: colors[7],style:'tableHeader'},
					{text: colors[8],style:'tableHeader'},
				],
				[ 
					{text: ports[0],style:'rowHeader'},
					{text: ports[1],style:'tableHeader'},
					{text: ports[2],style:'tableHeader'},
					{text: ports[3],style:'tableHeader'},
					{text: ports[4],style:'tableHeader'},
					{text: ports[5],style:'tableHeader'},
					{text: ports[6],style:'tableHeader'},
					{text: ports[7],style:'tableHeader'},
					{text: ports[8],style:'tableHeader'},
				],
				// Column Titles	
				[
					{text:''},
					{text: ChIds[1],style:'tableHeader'},
					{text: ChIds[2],style:'tableHeader'},
					{text: ChIds[3],style:'tableHeader'},
					{text: ChIds[4],style:'tableHeader'},
					{text: ChIds[5],style:'tableHeader'},
					{text: ChIds[6],style:'tableHeader'},
					{text: ChIds[7],style:'tableHeader'},
					{text: ChIds[8],style:'tableHeader'},
				],
				// Home Tab - Trims
				[
					{text: trims[0],style:'rowHeader'},
					{text: trims[1],style:'tableHeader'},
					{text: trims[2],style:'tableHeader'},
					{text: trims[3],style:'tableHeader'},
					{text: trims[4],style:'tableHeader'},
					{text: trims[5],style:'tableHeader'},
					{text: trims[6],style:'tableHeader'},
					{text: trims[7],style:'tableHeader'},
					{text: trims[8],style:'tableHeader'},
				],
				links,
				gates,
				inserts,
				dynPos,
				eqs,
				dynThrs,
				mainPans,


				// [
				// 	{text: names[0],style:'rowHeader'},
				// 	names[1], names[2], names[3], names[4], names[5], names[6], names[7], names[8],
				// ]	
			);
			// winston.debug(JSON.stringify(tab1, (k, v) => v === undefined ? null : v,4));
			this.addContent(tab1);
		}
	}
}

function cell (text, onOption='') {
	// console.log(text, onOption)
	text = (text == 'OFF') ? Off : text;
	text = (text == 'POST') ? 'Post' : text;
	text = (text == 'ON' && onOption != '') ? onOption : text;
	text = (text == 'ON' && onOption == '') ? On : text;
	return {text: text, style: 'tableCell'};
}

function rowHeader( text ) {
  return	[{text: text, style: 'rowHeader'}]
}

function simple( text ) {
	return {text: text} 
}


module.exports = DocumentDefinition;