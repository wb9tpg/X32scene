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
			var tab1 = {style: 'tableExample', table: {headerRows: 2, widths: ['*',w,w,w,w,w,w,w,w],body: [] }};
			var tabConfigurations = {style: 'tableExample', table: {headerRows: 2, widths: ['*',w,w,w,w,w,w,w,w],body: [] }};
			var tabPreamps = {style: 'tableExample', table: {headerRows: 2, widths: ['*',w,w,w,w,w,w,w,w],body: [] }};
			var tabGates = {style: 'tableExample', table: {headerRows: 2, widths: ['*',w,w,w,w,w,w,w,w],body: [] }};
			var tabDynamics = {style: 'tableExample', table: {headerRows: 2, widths: ['*',w,w,w,w,w,w,w,w],body: [] }};
			var tabInserts = {style: 'tableExample', table: {headerRows: 2, widths: ['*',w,w,w,w,w,w,w,w],body: [] }};
			var tabEqs = {style: 'tableExample', table: {headerRows: 2, widths: ['*',w,w,w,w,w,w,w,w],body: [] }};
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
			var dynOns  = rowHeader('On / Off');
			var dynModes = rowHeader('Comp / Exp');
			var dynDets = rowHeader('Peak / RMS');
			var dynEnvs = rowHeader('Linear / Log');
			var dynThrs  = rowHeader('Threshold (dB)');
			var dynRatios = rowHeader('Ratio');
			var dynKnees = rowHeader('Knee');
			var dynMgains = rowHeader('Makeup Gain (dB)')
			var dynAttacks = rowHeader('Attack (ms)');
			var dynHolds = rowHeader('Hold (ms)');
			var dynReleases = rowHeader('Release (ms)');
			var dynPoss = rowHeader('Pre / Post');
			var dynKeysrcs = rowHeader('Key Source');
			var dynMixs	= rowHeader('Mix %');
			var dynAutos = rowHeader('Auto Time')
			var dynFilterOns = rowHeader('Filter On/Off');
			var dynFilterTypes = rowHeader('Filter Type');
			var dynFilterFreqs = rowHeader('Filter Freq (Hz)');

			// Inserts
			var insOns  = rowHeader('On / Off');
			var insPoss = rowHeader('Insert Pre/Post');
			var insSels = rowHeader('Selection');
			
			// var gates   = rowHeader('Gate Thr(dB)');
			var eqOns     = rowHeader('On / Off');
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

				// dynamics
				dynOns.push(cell(dyn.on));
				dynModes.push(cell(dyn.mode));
				dynDets.push(cell(dyn.det));
				dynEnvs.push(cell(dyn.env));
				dynThrs.push(cell(dyn.thr));
				dynRatios.push(cell(dyn.ratio));
				dynKnees.push(cell(dyn.knee));
				dynMgains.push(cell(dyn.mgain));
				dynAttacks.push(cell(dyn.attack));
				dynHolds.push(cell(dyn.hold));
				dynReleases.push(cell(dyn.release));
				dynPoss.push(cell(dyn.pos));
				dynKeysrcs.push(cell(dyn.keysrc));
				dynMixs.push(cell(dyn.mix));
				dynAutos.push(cell(dyn.auto));
				dynFilterOns.push(cell(dyn.filter.on));
				dynFilterTypes.push(cell(dyn.filter.type));
				dynFilterFreqs.push(cell(dyn.filter.f));

				// Inserts
				insOns.push(cell(insert.on));
				insPoss.push(cell(insert.pos));
				insSels.push(cell(insert.sel));

				// gates.push(cell(gate.on, gate.thr));
				eqOns.push(cell(eq.on));
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

			tabDynamics.table.body.push(
				// Dynamics Header
				[ {text:'Dynamics / Compressor',style:'sectionHeader',colSpan:9,border:[false,false,false,false]},{},{},{},{},{},{},{},{},],
				// Column Titles	
				[{text:'',border:[false,false,false,false]}, {text: ChIds[1],style:'tableHeader'}, {text: ChIds[2],style:'tableHeader'}, {text: ChIds[3],style:'tableHeader'}, {text: ChIds[4],style:'tableHeader'}, {text: ChIds[5],style:'tableHeader'}, {text: ChIds[6],style:'tableHeader'}, {text: ChIds[7],style:'tableHeader'}, {text: ChIds[8],style:'tableHeader'}, ],
				[
					{text: dynOns[0],style:'rowHeader'},
					{text: dynOns[1],style:'tableHeader'},
					{text: dynOns[2],style:'tableHeader'},
					{text: dynOns[3],style:'tableHeader'},
					{text: dynOns[4],style:'tableHeader'},
					{text: dynOns[5],style:'tableHeader'},
					{text: dynOns[6],style:'tableHeader'},
					{text: dynOns[7],style:'tableHeader'},
					{text: dynOns[8],style:'tableHeader'},
				],
				[
					{text: dynModes[0],style:'rowHeader'},
					{text: dynModes[1],style:'tableHeader'},
					{text: dynModes[2],style:'tableHeader'},
					{text: dynModes[3],style:'tableHeader'},
					{text: dynModes[4],style:'tableHeader'},
					{text: dynModes[5],style:'tableHeader'},
					{text: dynModes[6],style:'tableHeader'},
					{text: dynModes[7],style:'tableHeader'},
					{text: dynModes[8],style:'tableHeader'},
				],
				[
					{text: dynDets[0],style:'rowHeader'},
					{text: dynDets[1],style:'tableHeader'},
					{text: dynDets[2],style:'tableHeader'},
					{text: dynDets[3],style:'tableHeader'},
					{text: dynDets[4],style:'tableHeader'},
					{text: dynDets[5],style:'tableHeader'},
					{text: dynDets[6],style:'tableHeader'},
					{text: dynDets[7],style:'tableHeader'},
					{text: dynDets[8],style:'tableHeader'},
				],
				[
					{text: dynEnvs[0],style:'rowHeader'},
					{text: dynEnvs[1],style:'tableHeader'},
					{text: dynEnvs[2],style:'tableHeader'},
					{text: dynEnvs[3],style:'tableHeader'},
					{text: dynEnvs[4],style:'tableHeader'},
					{text: dynEnvs[5],style:'tableHeader'},
					{text: dynEnvs[6],style:'tableHeader'},
					{text: dynEnvs[7],style:'tableHeader'},
					{text: dynEnvs[8],style:'tableHeader'},
				],
				[
					{text: dynThrs[0],style:'rowHeader'},
					{text: dynThrs[1],style:'tableHeader'},
					{text: dynThrs[2],style:'tableHeader'},
					{text: dynThrs[3],style:'tableHeader'},
					{text: dynThrs[4],style:'tableHeader'},
					{text: dynThrs[5],style:'tableHeader'},
					{text: dynThrs[6],style:'tableHeader'},
					{text: dynThrs[7],style:'tableHeader'},
					{text: dynThrs[8],style:'tableHeader'},
				],
				[
					{text: dynRatios[0],style:'rowHeader'},
					{text: dynRatios[1],style:'tableHeader'},
					{text: dynRatios[2],style:'tableHeader'},
					{text: dynRatios[3],style:'tableHeader'},
					{text: dynRatios[4],style:'tableHeader'},
					{text: dynRatios[5],style:'tableHeader'},
					{text: dynRatios[6],style:'tableHeader'},
					{text: dynRatios[7],style:'tableHeader'},
					{text: dynRatios[8],style:'tableHeader'},
				],
				[
					{text: dynKnees[0],style:'rowHeader'},
					{text: dynKnees[1],style:'tableHeader'},
					{text: dynKnees[2],style:'tableHeader'},
					{text: dynKnees[3],style:'tableHeader'},
					{text: dynKnees[4],style:'tableHeader'},
					{text: dynKnees[5],style:'tableHeader'},
					{text: dynKnees[6],style:'tableHeader'},
					{text: dynKnees[7],style:'tableHeader'},
					{text: dynKnees[8],style:'tableHeader'},
				],
				[
					{text: dynMgains[0],style:'rowHeader'},
					{text: dynMgains[1],style:'tableHeader'},
					{text: dynMgains[2],style:'tableHeader'},
					{text: dynMgains[3],style:'tableHeader'},
					{text: dynMgains[4],style:'tableHeader'},
					{text: dynMgains[5],style:'tableHeader'},
					{text: dynMgains[6],style:'tableHeader'},
					{text: dynMgains[7],style:'tableHeader'},
					{text: dynMgains[8],style:'tableHeader'},
				],
				[
					{text: dynAttacks[0],style:'rowHeader'},
					{text: dynAttacks[1],style:'tableHeader'},
					{text: dynAttacks[2],style:'tableHeader'},
					{text: dynAttacks[3],style:'tableHeader'},
					{text: dynAttacks[4],style:'tableHeader'},
					{text: dynAttacks[5],style:'tableHeader'},
					{text: dynAttacks[6],style:'tableHeader'},
					{text: dynAttacks[7],style:'tableHeader'},
					{text: dynAttacks[8],style:'tableHeader'},
				],
				[
					{text: dynHolds[0],style:'rowHeader'},
					{text: dynHolds[1],style:'tableHeader'},
					{text: dynHolds[2],style:'tableHeader'},
					{text: dynHolds[3],style:'tableHeader'},
					{text: dynHolds[4],style:'tableHeader'},
					{text: dynHolds[5],style:'tableHeader'},
					{text: dynHolds[6],style:'tableHeader'},
					{text: dynHolds[7],style:'tableHeader'},
					{text: dynHolds[8],style:'tableHeader'},
				],
				[
					{text: dynReleases[0],style:'rowHeader'},
					{text: dynReleases[1],style:'tableHeader'},
					{text: dynReleases[2],style:'tableHeader'},
					{text: dynReleases[3],style:'tableHeader'},
					{text: dynReleases[4],style:'tableHeader'},
					{text: dynReleases[5],style:'tableHeader'},
					{text: dynReleases[6],style:'tableHeader'},
					{text: dynReleases[7],style:'tableHeader'},
					{text: dynReleases[8],style:'tableHeader'},
				],
				[
					{text: dynPoss[0],style:'rowHeader'},
					{text: dynPoss[1],style:'tableHeader'},
					{text: dynPoss[2],style:'tableHeader'},
					{text: dynPoss[3],style:'tableHeader'},
					{text: dynPoss[4],style:'tableHeader'},
					{text: dynPoss[5],style:'tableHeader'},
					{text: dynPoss[6],style:'tableHeader'},
					{text: dynPoss[7],style:'tableHeader'},
					{text: dynPoss[8],style:'tableHeader'},
				],
				[
					{text: dynKeysrcs[0],style:'rowHeader'},
					{text: dynKeysrcs[1],style:'tableHeader'},
					{text: dynKeysrcs[2],style:'tableHeader'},
					{text: dynKeysrcs[3],style:'tableHeader'},
					{text: dynKeysrcs[4],style:'tableHeader'},
					{text: dynKeysrcs[5],style:'tableHeader'},
					{text: dynKeysrcs[6],style:'tableHeader'},
					{text: dynKeysrcs[7],style:'tableHeader'},
					{text: dynKeysrcs[8],style:'tableHeader'},
				],
				[
					{text: dynMixs[0],style:'rowHeader'},
					{text: dynMixs[1],style:'tableHeader'},
					{text: dynMixs[2],style:'tableHeader'},
					{text: dynMixs[3],style:'tableHeader'},
					{text: dynMixs[4],style:'tableHeader'},
					{text: dynMixs[5],style:'tableHeader'},
					{text: dynMixs[6],style:'tableHeader'},
					{text: dynMixs[7],style:'tableHeader'},
					{text: dynMixs[8],style:'tableHeader'},
				],
				[
					{text: dynAutos[0],style:'rowHeader'},
					{text: dynAutos[1],style:'tableHeader'},
					{text: dynAutos[2],style:'tableHeader'},
					{text: dynAutos[3],style:'tableHeader'},
					{text: dynAutos[4],style:'tableHeader'},
					{text: dynAutos[5],style:'tableHeader'},
					{text: dynAutos[6],style:'tableHeader'},
					{text: dynAutos[7],style:'tableHeader'},
					{text: dynAutos[8],style:'tableHeader'},
				],
				[
					{text: dynFilterOns[0],style:'rowHeader'},
					{text: dynFilterOns[1],style:'tableHeader'},
					{text: dynFilterOns[2],style:'tableHeader'},
					{text: dynFilterOns[3],style:'tableHeader'},
					{text: dynFilterOns[4],style:'tableHeader'},
					{text: dynFilterOns[5],style:'tableHeader'},
					{text: dynFilterOns[6],style:'tableHeader'},
					{text: dynFilterOns[7],style:'tableHeader'},
					{text: dynFilterOns[8],style:'tableHeader'},
				],
				[
					{text: dynFilterTypes[0],style:'rowHeader'},
					{text: dynFilterTypes[1],style:'tableHeader'},
					{text: dynFilterTypes[2],style:'tableHeader'},
					{text: dynFilterTypes[3],style:'tableHeader'},
					{text: dynFilterTypes[4],style:'tableHeader'},
					{text: dynFilterTypes[5],style:'tableHeader'},
					{text: dynFilterTypes[6],style:'tableHeader'},
					{text: dynFilterTypes[7],style:'tableHeader'},
					{text: dynFilterTypes[8],style:'tableHeader'},
				],
				[
					{text: dynFilterFreqs[0],style:'rowHeader'},
					{text: dynFilterFreqs[1],style:'tableHeader'},
					{text: dynFilterFreqs[2],style:'tableHeader'},
					{text: dynFilterFreqs[3],style:'tableHeader'},
					{text: dynFilterFreqs[4],style:'tableHeader'},
					{text: dynFilterFreqs[5],style:'tableHeader'},
					{text: dynFilterFreqs[6],style:'tableHeader'},
					{text: dynFilterFreqs[7],style:'tableHeader'},
					{text: dynFilterFreqs[8],style:'tableHeader'},
				],
			);

			tabInserts.table.body.push(
				// Inserts Header
				[ {text:'Inserts',style:'sectionHeader',colSpan:9,border:[false,false,false,false]},{},{},{},{},{},{},{},{},],
				// Column Titles	
				[{text:'',border:[false,false,false,false]}, {text: ChIds[1],style:'tableHeader'}, {text: ChIds[2],style:'tableHeader'}, {text: ChIds[3],style:'tableHeader'}, {text: ChIds[4],style:'tableHeader'}, {text: ChIds[5],style:'tableHeader'}, {text: ChIds[6],style:'tableHeader'}, {text: ChIds[7],style:'tableHeader'}, {text: ChIds[8],style:'tableHeader'}, ],
				[
					{text: insOns[0],style:'rowHeader'},
					{text: insOns[1],style:'tableHeader'},
					{text: insOns[2],style:'tableHeader'},
					{text: insOns[3],style:'tableHeader'},
					{text: insOns[4],style:'tableHeader'},
					{text: insOns[5],style:'tableHeader'},
					{text: insOns[6],style:'tableHeader'},
					{text: insOns[7],style:'tableHeader'},
					{text: insOns[8],style:'tableHeader'},
				],				
				[
					{text: insPoss[0],style:'rowHeader'},
					{text: insPoss[1],style:'tableHeader'},
					{text: insPoss[2],style:'tableHeader'},
					{text: insPoss[3],style:'tableHeader'},
					{text: insPoss[4],style:'tableHeader'},
					{text: insPoss[5],style:'tableHeader'},
					{text: insPoss[6],style:'tableHeader'},
					{text: insPoss[7],style:'tableHeader'},
					{text: insPoss[8],style:'tableHeader'},
				],				
				[
					{text: insSels[0],style:'rowHeader'},
					{text: insSels[1],style:'tableHeader'},
					{text: insSels[2],style:'tableHeader'},
					{text: insSels[3],style:'tableHeader'},
					{text: insSels[4],style:'tableHeader'},
					{text: insSels[5],style:'tableHeader'},
					{text: insSels[6],style:'tableHeader'},
					{text: insSels[7],style:'tableHeader'},
					{text: insSels[8],style:'tableHeader'},
				],				
			);

			tabEqs.table.body.push(
				// Inserts Header
				[ {text:'Equalizer Settings',style:'sectionHeader',colSpan:9,border:[false,false,false,false]},{},{},{},{},{},{},{},{},],
				// Column Titles	
				[{text:'',border:[false,false,false,false]}, {text: ChIds[1],style:'tableHeader'}, {text: ChIds[2],style:'tableHeader'}, {text: ChIds[3],style:'tableHeader'}, {text: ChIds[4],style:'tableHeader'}, {text: ChIds[5],style:'tableHeader'}, {text: ChIds[6],style:'tableHeader'}, {text: ChIds[7],style:'tableHeader'}, {text: ChIds[8],style:'tableHeader'}, ],
				[
					{text: eqOns[0],style:'rowHeader'},
					{text: eqOns[1],style:'tableHeader'},
					{text: eqOns[2],style:'tableHeader'},
					{text: eqOns[3],style:'tableHeader'},
					{text: eqOns[4],style:'tableHeader'},
					{text: eqOns[5],style:'tableHeader'},
					{text: eqOns[6],style:'tableHeader'},
					{text: eqOns[7],style:'tableHeader'},
					{text: eqOns[8],style:'tableHeader'},
				],				
			);

			// Add the tables to the document
			this.addContent(tabConfigurations);
			this.addContent(tabPreamps);
			this.addContent(tabGates);
			this.addContent(tabDynamics);			
			this.addContent(tabInserts);
			this.addContent(tabEqs);

			tab1.table.body.push(

				// Dynamics Header
				[ {text:'tab1',style:'sectionHeader',colSpan:9,border:[false,false,false,false]},{},{},{},{},{},{},{},{},],
				// Column Titles	
				[{text:'',border:[false,false,false,false]}, {text: ChIds[1],style:'tableHeader'}, {text: ChIds[2],style:'tableHeader'}, {text: ChIds[3],style:'tableHeader'}, {text: ChIds[4],style:'tableHeader'}, {text: ChIds[5],style:'tableHeader'}, {text: ChIds[6],style:'tableHeader'}, {text: ChIds[7],style:'tableHeader'}, {text: ChIds[8],style:'tableHeader'}, ],



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