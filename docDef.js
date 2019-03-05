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
			var tabConfigurations = {style: 'tableExample', table: { widths: ['*',w,w,w,w,w,w,w,w],body: [] }};
			var tabPreamps = {style: 'tableExample', table: { widths: ['*',w,w,w,w,w,w,w,w],body: [] }};
			var tabGates = {style: 'tableExample', table: { widths: ['*',w,w,w,w,w,w,w,w],body: [] }};
			var tabDynamics = {style: 'tableExample', table: { widths: ['*',w,w,w,w,w,w,w,w],body: [] }};
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
			// Configuration Section
			var names   = rowHeader('Name');
			var colors  = rowHeader('Color');
			var sources = rowHeader('Input Bus');
			var ports   = rowHeader('Source');
			var delays  = rowHeader('Delay');
			var links   = rowHeader('Linked');

			// Preamp Section
			var trims   = rowHeader('Trim (dB)');
			var inverts = rowHeader('Reverse / Invert');
			var lowcuts = rowHeader('Low Cut');

			// Gate Section
			var gateOns  = rowHeader('On / Off');
			var gateModes = rowHeader('Mode');
			var gateThrs  = rowHeader('Threshold (dB)');
			var gateRanges = rowHeader('Range (dB)');
			var gateAttacks = rowHeader('Attack (ms)');
			var gateHolds = rowHeader('Hold (ms)');
			var gateReleases = rowHeader('Release (ms)');
			var gateKeysrcs = rowHeader('Key Source');
			var gateFilterOns = rowHeader('Filter On/Off');
			var gateFilterTypes = rowHeader('Filter Type');
			var gateFilterFreqs = rowHeader('Filter Freq (Hz)');


			// Dynamics Section

			
			// var gates   = rowHeader('Gate Thr(dB)');
			var inserts = rowHeader('Insert Pre/Post');
			var dynPos  = rowHeader('Pre/Post')
			var eqs     = rowHeader('Eq');
			var dynThrs= rowHeader('Compr Thr(dB)');
			var mainPans = rowHeader('Main Pan');


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
				
				// Configuration
				names.push(cell(config.name));
				colors.push(cell(config.color));
				ports.push({text: (config.source=='OFF')? Off : this.x32['config']['routing']['ports'][source], style: 'tableCell'});
				delays.push(cell(delay.on, delay.time));
				links.push((typeof config['linked'] === 'undefined') ? {} : {text: ((config.linked=='ON')?On:Off), style:'tableCell', colSpan:2 } );

				// Preamp
				trims.push(cell(preamp.trim));
				inverts.push(cell(preamp.invert));
				lowcuts.push(cell(preamp.hpon, preamp.hpf+'Hz'));

				// gate
				gateOns.push(cell(gate.on));
				gateModes.push(cell(gate.mode));
				gateThrs.push(cell(gate.thr));
				gateRanges.push(cell(gate.range));
				gateAttacks.push(cell(gate.attack));
				gateHolds.push(cell(gate.hold));
				gateReleases.push(cell(gate.release));
				gateKeysrcs.push(cell(gate.keysrc));
				gateFilterOns.push(cell(gate.filter.on));
				gateFilterTypes.push(cell(gate.filter.type));
				gateFilterFreqs.push(cell(gate.filter.f));


				// Dynamics


				// gates.push(cell(gate.on, gate.thr));
				inserts.push(cell(insert.on, insert.pos));
				dynPos.push(cell(dyn.pos));
				eqs.push(cell(eq.on));
				// compThrs.push(cell())
				dynThrs.push(cell(dyn.on,dyn.thr));
				mainPans.push(cell(mix.st,mix.pan));


				// sources.push({text: config.source, style: 'tableCell'});
				// lowCuts.push({text: (preamp.hpon=='OFF')? Off : preamp.hpf+'Hz', style: 'tableCell'}); 
			}

			tabConfigurations.table.body.push(
				// Configuration Header
				[ {text:'Configuration',style:'sectionHeader',colSpan:9,border:[false,false,false,false]},{},{},{},{},{},{},{},{},],
				// Column Titles	
				[{text:'',border:[false,false,false,false]}, {text: ChIds[1],style:'tableHeader'}, {text: ChIds[2],style:'tableHeader'}, {text: ChIds[3],style:'tableHeader'}, {text: ChIds[4],style:'tableHeader'}, {text: ChIds[5],style:'tableHeader'}, {text: ChIds[6],style:'tableHeader'}, {text: ChIds[7],style:'tableHeader'}, {text: ChIds[8],style:'tableHeader'}, ],
				// Temporary Design Aid Index Row
				// ['0','1','2','3','4','5','6','7','8',],
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
				// Port selected
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
				// Delay settings
				[ 
					{text: delays[0],style:'rowHeader'},
					{text: delays[1],style:'tableHeader'},
					{text: delays[2],style:'tableHeader'},
					{text: delays[3],style:'tableHeader'},
					{text: delays[4],style:'tableHeader'},
					{text: delays[5],style:'tableHeader'},
					{text: delays[6],style:'tableHeader'},
					{text: delays[7],style:'tableHeader'},
					{text: delays[8],style:'tableHeader'},
				],
				// Linked settings
				[ 
					{text: links[0],style:'rowHeader'},
					{text: links[1],style:'tableHeader',colSpan:2},
					{},
					{text: links[3],style:'tableHeader',colSpan:2},
					{},
					{text: links[5],style:'tableHeader',colSpan:2},
					{},
					{text: links[7],style:'tableHeader',colSpan:2},
					{},
				],
			);
			this.addContent(tabConfigurations);

			tabPreamps.table.body.push(
				// Preamp Header
				[ {text:'Preamp',style:'sectionHeader',colSpan:9,border:[false,false,false,false]},{},{},{},{},{},{},{},{},],
				// Column Titles	
				[{text:'',border:[false,false,false,false]}, {text: ChIds[1],style:'tableHeader'}, {text: ChIds[2],style:'tableHeader'}, {text: ChIds[3],style:'tableHeader'}, {text: ChIds[4],style:'tableHeader'}, {text: ChIds[5],style:'tableHeader'}, {text: ChIds[6],style:'tableHeader'}, {text: ChIds[7],style:'tableHeader'}, {text: ChIds[8],style:'tableHeader'}, ],
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
				[
					{text: inverts[0],style:'rowHeader'},
					{text: inverts[1],style:'tableHeader'},
					{text: inverts[2],style:'tableHeader'},
					{text: inverts[3],style:'tableHeader'},
					{text: inverts[4],style:'tableHeader'},
					{text: inverts[5],style:'tableHeader'},
					{text: inverts[6],style:'tableHeader'},
					{text: inverts[7],style:'tableHeader'},
					{text: inverts[8],style:'tableHeader'},
				],
				[
					{text: lowcuts[0],style:'rowHeader'},
					{text: lowcuts[1],style:'tableHeader'},
					{text: lowcuts[2],style:'tableHeader'},
					{text: lowcuts[3],style:'tableHeader'},
					{text: lowcuts[4],style:'tableHeader'},
					{text: lowcuts[5],style:'tableHeader'},
					{text: lowcuts[6],style:'tableHeader'},
					{text: lowcuts[7],style:'tableHeader'},
					{text: lowcuts[8],style:'tableHeader'},
				],
			);
			this.addContent(tabPreamps);

			tabGates.table.body.push(
				// Gate Header
				[ {text:'Gate',style:'sectionHeader',colSpan:9,border:[false,false,false,false]},{},{},{},{},{},{},{},{},],
				// Column Titles	
				[{text:'',border:[false,false,false,false]}, {text: ChIds[1],style:'tableHeader'}, {text: ChIds[2],style:'tableHeader'}, {text: ChIds[3],style:'tableHeader'}, {text: ChIds[4],style:'tableHeader'}, {text: ChIds[5],style:'tableHeader'}, {text: ChIds[6],style:'tableHeader'}, {text: ChIds[7],style:'tableHeader'}, {text: ChIds[8],style:'tableHeader'}, ],
				[
					{text: gateOns[0],style:'rowHeader'},
					{text: gateOns[1],style:'tableHeader'},
					{text: gateOns[2],style:'tableHeader'},
					{text: gateOns[3],style:'tableHeader'},
					{text: gateOns[4],style:'tableHeader'},
					{text: gateOns[5],style:'tableHeader'},
					{text: gateOns[6],style:'tableHeader'},
					{text: gateOns[7],style:'tableHeader'},
					{text: gateOns[8],style:'tableHeader'},
				],
								[
					{text: gateModes[0],style:'rowHeader'},
					{text: gateModes[1],style:'tableHeader'},
					{text: gateModes[2],style:'tableHeader'},
					{text: gateModes[3],style:'tableHeader'},
					{text: gateModes[4],style:'tableHeader'},
					{text: gateModes[5],style:'tableHeader'},
					{text: gateModes[6],style:'tableHeader'},
					{text: gateModes[7],style:'tableHeader'},
					{text: gateModes[8],style:'tableHeader'},
				],
				[
					{text: gateThrs[0],style:'rowHeader'},
					{text: gateThrs[1],style:'tableHeader'},
					{text: gateThrs[2],style:'tableHeader'},
					{text: gateThrs[3],style:'tableHeader'},
					{text: gateThrs[4],style:'tableHeader'},
					{text: gateThrs[5],style:'tableHeader'},
					{text: gateThrs[6],style:'tableHeader'},
					{text: gateThrs[7],style:'tableHeader'},
					{text: gateThrs[8],style:'tableHeader'},
				],
				[
					{text: gateRanges[0],style:'rowHeader'},
					{text: gateRanges[1],style:'tableHeader'},
					{text: gateRanges[2],style:'tableHeader'},
					{text: gateRanges[3],style:'tableHeader'},
					{text: gateRanges[4],style:'tableHeader'},
					{text: gateRanges[5],style:'tableHeader'},
					{text: gateRanges[6],style:'tableHeader'},
					{text: gateRanges[7],style:'tableHeader'},
					{text: gateRanges[8],style:'tableHeader'},
				],
				[
					{text: gateAttacks[0],style:'rowHeader'},
					{text: gateAttacks[1],style:'tableHeader'},
					{text: gateAttacks[2],style:'tableHeader'},
					{text: gateAttacks[3],style:'tableHeader'},
					{text: gateAttacks[4],style:'tableHeader'},
					{text: gateAttacks[5],style:'tableHeader'},
					{text: gateAttacks[6],style:'tableHeader'},
					{text: gateAttacks[7],style:'tableHeader'},
					{text: gateAttacks[8],style:'tableHeader'},
				],
				[
					{text: gateHolds[0],style:'rowHeader'},
					{text: gateHolds[1],style:'tableHeader'},
					{text: gateHolds[2],style:'tableHeader'},
					{text: gateHolds[3],style:'tableHeader'},
					{text: gateHolds[4],style:'tableHeader'},
					{text: gateHolds[5],style:'tableHeader'},
					{text: gateHolds[6],style:'tableHeader'},
					{text: gateHolds[7],style:'tableHeader'},
					{text: gateHolds[8],style:'tableHeader'},
				],
				[
					{text: gateReleases[0],style:'rowHeader'},
					{text: gateReleases[1],style:'tableHeader'},
					{text: gateReleases[2],style:'tableHeader'},
					{text: gateReleases[3],style:'tableHeader'},
					{text: gateReleases[4],style:'tableHeader'},
					{text: gateReleases[5],style:'tableHeader'},
					{text: gateReleases[6],style:'tableHeader'},
					{text: gateReleases[7],style:'tableHeader'},
					{text: gateReleases[8],style:'tableHeader'},
				],
				[
					{text: gateKeysrcs[0],style:'rowHeader'},
					{text: gateKeysrcs[1],style:'tableHeader'},
					{text: gateKeysrcs[2],style:'tableHeader'},
					{text: gateKeysrcs[3],style:'tableHeader'},
					{text: gateKeysrcs[4],style:'tableHeader'},
					{text: gateKeysrcs[5],style:'tableHeader'},
					{text: gateKeysrcs[6],style:'tableHeader'},
					{text: gateKeysrcs[7],style:'tableHeader'},
					{text: gateKeysrcs[8],style:'tableHeader'},
				],
				[
					{text: gateFilterOns[0],style:'rowHeader'},
					{text: gateFilterOns[1],style:'tableHeader'},
					{text: gateFilterOns[2],style:'tableHeader'},
					{text: gateFilterOns[3],style:'tableHeader'},
					{text: gateFilterOns[4],style:'tableHeader'},
					{text: gateFilterOns[5],style:'tableHeader'},
					{text: gateFilterOns[6],style:'tableHeader'},
					{text: gateFilterOns[7],style:'tableHeader'},
					{text: gateFilterOns[8],style:'tableHeader'},
				],
				[
					{text: gateFilterTypes[0],style:'rowHeader'},
					{text: gateFilterTypes[1],style:'tableHeader'},
					{text: gateFilterTypes[2],style:'tableHeader'},
					{text: gateFilterTypes[3],style:'tableHeader'},
					{text: gateFilterTypes[4],style:'tableHeader'},
					{text: gateFilterTypes[5],style:'tableHeader'},
					{text: gateFilterTypes[6],style:'tableHeader'},
					{text: gateFilterTypes[7],style:'tableHeader'},
					{text: gateFilterTypes[8],style:'tableHeader'},
				],
				[
					{text: gateFilterFreqs[0],style:'rowHeader'},
					{text: gateFilterFreqs[1],style:'tableHeader'},
					{text: gateFilterFreqs[2],style:'tableHeader'},
					{text: gateFilterFreqs[3],style:'tableHeader'},
					{text: gateFilterFreqs[4],style:'tableHeader'},
					{text: gateFilterFreqs[5],style:'tableHeader'},
					{text: gateFilterFreqs[6],style:'tableHeader'},
					{text: gateFilterFreqs[7],style:'tableHeader'},
					{text: gateFilterFreqs[8],style:'tableHeader'},
				],				
			);
			this.addContent(tabGates);

			tabDynamics.table.body.push(
				// Dynamics Header
				[ {text:'Dynamics / Compressor',style:'sectionHeader',colSpan:9,border:[false,false,false,false]},{},{},{},{},{},{},{},{},],
				// Column Titles	
				[{text:'',border:[false,false,false,false]}, {text: ChIds[1],style:'tableHeader'}, {text: ChIds[2],style:'tableHeader'}, {text: ChIds[3],style:'tableHeader'}, {text: ChIds[4],style:'tableHeader'}, {text: ChIds[5],style:'tableHeader'}, {text: ChIds[6],style:'tableHeader'}, {text: ChIds[7],style:'tableHeader'}, {text: ChIds[8],style:'tableHeader'}, ],
			);
			this.addContent(tabDynamics);			

			tab1.table.body.push(

				// Dynamics Header
				[ {text:'tab1',style:'sectionHeader',colSpan:9,border:[false,false,false,false]},{},{},{},{},{},{},{},{},],
				// Column Titles	
				[{text:'',border:[false,false,false,false]}, {text: ChIds[1],style:'tableHeader'}, {text: ChIds[2],style:'tableHeader'}, {text: ChIds[3],style:'tableHeader'}, {text: ChIds[4],style:'tableHeader'}, {text: ChIds[5],style:'tableHeader'}, {text: ChIds[6],style:'tableHeader'}, {text: ChIds[7],style:'tableHeader'}, {text: ChIds[8],style:'tableHeader'}, ],



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
	text = (text == 'GATE') ? 'Gate' : text;
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