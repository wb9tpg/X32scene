var winston = require('winston');
var moment = require('moment');
var tableRow = require('./tableRow');

String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

var Off = 'Off';
var On = 'On';
var Blank = ' ';

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
		this.buildPages('ch');
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

	buildPages ( pt ) {
		var Pt = pt.toProperCase();
		for (var i=0; i<32; i=i+8) {
			var w = 42;
			var tabConfigurations = {pageBreak: 'before',style: 'tableExample', table: {headerRows: 2, widths: ['*',w,w,w,w,w,w,w,w],body: [] }};
			var tabPreamps = {style: 'tableExample', table: {headerRows: 2, widths: ['*',w,w,w,w,w,w,w,w],body: [] }};
			var tabGates = {style: 'tableExample', table: {headerRows: 2, widths: ['*',w,w,w,w,w,w,w,w],body: [] }};
			var tabDynamics = {pageBreak: 'before',style: 'tableExample', table: {headerRows: 2, widths: ['*',w,w,w,w,w,w,w,w],body: [] }};
			var tabInserts = {style: 'tableExample', table: {headerRows: 2, widths: ['*',w,w,w,w,w,w,w,w],body: [] }};
			var tabEqs = {style: 'tableExample', table: {headerRows: 2, widths: ['*',w,w,w,w,w,w,w,w],body: [] }};
			var tabMixs = {pageBreak: 'before',style: 'tableExample', table: {headerRows: 2, widths: ['*',w,w,w,w,w,w,w,w],body: [] }};

			var chN = [(i+1).pad(),(i+2).pad(),(i+3).pad(),(i+4).pad(),
			           (i+5).pad(),(i+6).pad(),(i+7).pad(),(i+8).pad()];
			// var ids = [{text: ' ',border:[false,false,false,false]}]
			var IDs = ['x']
			var ChIds = [
				'',Pt+chN[0], Pt+chN[1], Pt+chN[2], Pt+chN[3], Pt+chN[4], Pt+chN[5], Pt+chN[6], Pt+chN[7]
			];

			/////////////////////////////////////
			// Configuration Section
			/////////////////////////////////////
			var names  			= new tableRow('Name');
			var colors 			= new tableRow('Color');
			var ports  			= new tableRow('Source');
			var delays 			= new tableRow('Delay');
			var links   		= new tableRow('Linked');
			var mixEnableds		= new tableRow('Hard Mute');
			var mutes   		= new tableRow('Mute Groups');
			var mixFaders		= new tableRow('Fader (dB)');
			var mixLRons		= new tableRow('LR Bus On / Off');
			var mixLRpans		= new tableRow('LR Pan');
			var mixMONOons		= new tableRow('Mono Bus On/Off');
			var mixMONOlevels	= new tableRow('Mono Level (dB)');
			var dcas   			= new tableRow('DCA');
			var automixs		= new tableRow('Automix');

			// Preamp Section
			var trims   = rowHeader('Trim (dB)');
			var inverts = rowHeader('Reverse / Invert');
			var lowcuts = rowHeader('Low Cut (Hz)');

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
			var eq1Types  = rowHeader('#1 Type');
			var eq1Fs     = rowHeader('#1 Frequency (Hz)');
			var eq1Gs     = rowHeader('#1 Gain (dB)');
			var eq1Qs     = rowHeader('#1 Q');
			var eq2Types  = rowHeader('#2 Type');
			var eq2Fs     = rowHeader('#2 Frequency (Hz)');
			var eq2Gs     = rowHeader('#2 Gain (dB)');
			var eq2Qs     = rowHeader('#2 Q');
			var eq3Types  = rowHeader('#3 Type');
			var eq3Fs     = rowHeader('#3 Frequency (Hz)');
			var eq3Gs     = rowHeader('#3 Gain (dB)');
			var eq3Qs     = rowHeader('#3 Q');
			var eq4Types  = rowHeader('#4 Type');
			var eq4Fs     = rowHeader('#4 Frequency (Hz)');
			var eq4Gs     = rowHeader('#4 Gain (dB)');
			var eq4Qs     = rowHeader('#4 Q');

			// Mix
			var mixBus01ons		= rowHeader('Bus 01 On / Off');
			var mixBus02ons		= rowHeader('Bus 02 On / Off');
			var mixBus03ons		= rowHeader('Bus 03 On / Off');
			var mixBus04ons		= rowHeader('Bus 04 On / Off');
			var mixBus05ons		= rowHeader('Bus 05 On / Off');
			var mixBus06ons		= rowHeader('Bus 06 On / Off');
			var mixBus07ons		= rowHeader('Bus 07 On / Off');
			var mixBus08ons		= rowHeader('Bus 08 On / Off');
			var mixBus09ons		= rowHeader('Bus 09 On / Off');
			var mixBus10ons		= rowHeader('Bus 10 On / Off');
			var mixBus11ons		= rowHeader('Bus 11 On / Off');
			var mixBus12ons		= rowHeader('Bus 12 On / Off');
			var mixBus13ons		= rowHeader('Bus 13 On / Off');
			var mixBus14ons		= rowHeader('Bus 14 On / Off');
			var mixBus15ons		= rowHeader('Bus 15 On / Off');
			var mixBus16ons		= rowHeader('Bus 16 On / Off');
			var mixBus01levels	= rowHeader('Bus 01 Level (dB)');
			var mixBus02levels	= rowHeader('Bus 02 Level (dB)');
			var mixBus03levels	= rowHeader('Bus 03 Level (dB)');
			var mixBus04levels	= rowHeader('Bus 04 Level (dB)');
			var mixBus05levels	= rowHeader('Bus 05 Level (dB)');
			var mixBus06levels	= rowHeader('Bus 06 Level (dB)');
			var mixBus07levels	= rowHeader('Bus 07 Level (dB)');
			var mixBus08levels	= rowHeader('Bus 08 Level (dB)');
			var mixBus09levels	= rowHeader('Bus 09 Level (dB)');
			var mixBus10levels	= rowHeader('Bus 10 Level (dB)');
			var mixBus11levels	= rowHeader('Bus 11 Level (dB)');
			var mixBus12levels	= rowHeader('Bus 12 Level (dB)');
			var mixBus13levels	= rowHeader('Bus 13 Level (dB)');
			var mixBus14levels	= rowHeader('Bus 14 Level (dB)');
			var mixBus15levels	= rowHeader('Bus 15 Level (dB)');
			var mixBus16levels	= rowHeader('Bus 16 Level (dB)');
			var mixBus01pans  = rowHeader('Bus 01 / 02 Pan (dB)');
			var mixBus03pans  = rowHeader('Bus 01 / 02 Pan (dB)');
			var mixBus05pans  = rowHeader('Bus 01 / 02 Pan (dB)');
			var mixBus07pans  = rowHeader('Bus 01 / 02 Pan (dB)');
			var mixBus09pans  = rowHeader('Bus 01 / 02 Pan (dB)');
			var mixBus11pans  = rowHeader('Bus 01 / 02 Pan (dB)');
			var mixBus13pans  = rowHeader('Bus 01 / 02 Pan (dB)');
			var mixBus15pans  = rowHeader('Bus 01 / 02 Pan (dB)');
			var mixBus01types  = rowHeader('Bus 01 / 02 Type');
			var mixBus03types  = rowHeader('Bus 01 / 02 Type');
			var mixBus05types  = rowHeader('Bus 01 / 02 Type');
			var mixBus07types  = rowHeader('Bus 01 / 02 Type');
			var mixBus09types  = rowHeader('Bus 01 / 02 Type');
			var mixBus11types  = rowHeader('Bus 01 / 02 Type');
			var mixBus13types  = rowHeader('Bus 01 / 02 Type');
			var mixBus15types  = rowHeader('Bus 01 / 02 Type');


			for (var j=0; j<8; j++) {

				var chId = chN[j];  
				var config 	= this.x32[pt][chId]['config'];				
				var delay 	= this.x32[pt][chId]['delay'];				
				var preamp 	= this.x32[pt][chId]['preamp'];				
				var gate 	= this.x32[pt][chId]['gate'];				
				var dyn 	= this.x32[pt][chId]['dyn'];				
				var insert 	= this.x32[pt][chId]['insert'];				
				var eq 		= this.x32[pt][chId]['eq'];				
				var mix 	= this.x32[pt][chId]['mix'];				
				var grp 	= this.x32[pt][chId]['grp'];				
				var autoMix = this.x32[pt][chId]['automix'];			
				var source 	= this.x32[pt][chN[j]]['config']['source']; 



				IDs.push('Ch'+chId);
				ChIds.push({text: 'Ch'+chId});
				
				//////////////////////////////////
				// Configuration
				//////////////////////////////////
				names.newColumn(config.name);
				colors.newColumn(config.color);
				ports.newColumn(
					(config.source=='OFF') ? 
						Off : 
						this.x32['config']['routing']['ports'][source]
				);
				delays.newColumn( (delay.on == 'OFF') ? Off : delay.time );
				if (typeof config['linked']  != 'undefined') links.newColumn( config['linked'], undefined, 2);
				mixEnableds.newColumn(muted(mix.on));	
				mutes.newColumn(grp.mute.str);
				mixFaders.newColumn(mix.fader);	 
				mixLRons.newColumn(mix.st);
				mixLRpans.newColumn(mix.pan);
				mixMONOons.newColumn(mix.mono);
				mixMONOlevels.newColumn(mix.mlevel);
				dcas.newColumn(grp.dca.str);
				automixs.newColumn(
					(autoMix.group == 'OFF') ? Off : (autoMix.group+': '+autoMix.weight)
				); 


				// Preamp
				trims.push(cell(preamp.trim));
				inverts.push(cell(preamp.invert));
				lowcuts.push(cell(preamp.hpon, freq(preamp.hpf)));

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
				gateFilterFreqs.push(cell(freq(gate.filter.f)));

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
				dynFilterFreqs.push(cell(freq(dyn.filter.f)));

				// Inserts
				insOns.push(cell(insert.on));
				insPoss.push(cell(insert.pos));
				insSels.push(cell(insert.sel));

				// gates.push(cell(gate.on, gate.thr));
				eqOns.push(cell(eq.on));
				eq1Types.push(cell(eq['1']['type']));
				eq1Fs.push(   cell(freq(eq['1']['f'])));
				eq1Gs.push(   cell(eq['1']['g']));
				eq1Qs.push(   cell(eq['1']['q']));
				eq2Types.push(cell(eq['2']['type']));
				eq2Fs.push(   cell(freq(eq['2']['f'])));
				eq2Gs.push(   cell(eq['2']['g']));
				eq2Qs.push(   cell(eq['2']['q']));
				eq3Types.push(cell(eq['3']['type']));
				eq3Fs.push(   cell(freq(eq['3']['f'])));
				eq3Gs.push(   cell(eq['3']['g']));
				eq3Qs.push(   cell(eq['3']['q']));
				eq4Types.push(cell(eq['4']['type']));
				eq4Fs.push(cell(freq(eq['4']['f'])));
				eq4Gs.push(   cell(eq['4']['g']));
				eq4Qs.push(   cell(eq['4']['q']));


				mixBus01ons.push(cell(mix['01']['on']));
				mixBus02ons.push(cell(mix['02']['on']));
				mixBus03ons.push(cell(mix['03']['on']));
				mixBus04ons.push(cell(mix['04']['on']));
				mixBus05ons.push(cell(mix['05']['on']));
				mixBus06ons.push(cell(mix['06']['on']));
				mixBus07ons.push(cell(mix['07']['on']));
				mixBus08ons.push(cell(mix['08']['on']));
				mixBus09ons.push(cell(mix['09']['on']));
				mixBus10ons.push(cell(mix['10']['on']));
				mixBus11ons.push(cell(mix['11']['on']));
				mixBus12ons.push(cell(mix['12']['on']));
				mixBus13ons.push(cell(mix['13']['on']));
				mixBus14ons.push(cell(mix['14']['on']));
				mixBus15ons.push(cell(mix['15']['on']));
				mixBus16ons.push(cell(mix['16']['on']));
				mixBus01levels.push(cell(mix['01']['level']));
				mixBus02levels.push(cell(mix['02']['level']));
				mixBus03levels.push(cell(mix['03']['level']));
				mixBus04levels.push(cell(mix['04']['level']));
				mixBus05levels.push(cell(mix['05']['level']));
				mixBus06levels.push(cell(mix['06']['level']));
				mixBus07levels.push(cell(mix['07']['level']));
				mixBus08levels.push(cell(mix['08']['level']));
				mixBus09levels.push(cell(mix['09']['level']));
				mixBus10levels.push(cell(mix['10']['level']));
				mixBus11levels.push(cell(mix['11']['level']));
				mixBus12levels.push(cell(mix['12']['level']));
				mixBus13levels.push(cell(mix['13']['level']));
				mixBus14levels.push(cell(mix['14']['level']));
				mixBus15levels.push(cell(mix['15']['level']));
				mixBus16levels.push(cell(mix['16']['level']));
				mixBus01types.push(cell(mix['01']['type']));
				mixBus03types.push(cell(mix['03']['type']));
				mixBus05types.push(cell(mix['05']['type']));
				mixBus07types.push(cell(mix['07']['type']));
				mixBus09types.push(cell(mix['09']['type']));
				mixBus11types.push(cell(mix['11']['type']));
				mixBus13types.push(cell(mix['13']['type']));
				mixBus15types.push(cell(mix['15']['type']));
				mixBus01pans.push(cell(mix['01']['pan']));
				mixBus03pans.push(cell(mix['03']['pan']));
				mixBus05pans.push(cell(mix['05']['pan']));
				mixBus07pans.push(cell(mix['07']['pan']));
				mixBus09pans.push(cell(mix['09']['pan']));
				mixBus11pans.push(cell(mix['11']['pan']));
				mixBus13pans.push(cell(mix['13']['pan']));
				mixBus15pans.push(cell(mix['15']['pan']));
			
			}

			// console.log(links.getRow());

			tabConfigurations.table.body.push(

				// Configuration Header
				[ {text:'Configuration',style:'sectionHeader',colSpan:9,border:[false,false,false,false]},{},{},{},{},{},{},{},{},],
				[{text:'',border:[false,false,false,false]}, {text: ChIds[1],style:'tableHeader'}, {text: ChIds[2],style:'tableHeader'}, {text: ChIds[3],style:'tableHeader'}, {text: ChIds[4],style:'tableHeader'}, {text: ChIds[5],style:'tableHeader'}, {text: ChIds[6],style:'tableHeader'}, {text: ChIds[7],style:'tableHeader'}, {text: ChIds[8],style:'tableHeader'}, ],

				names.getRow(),
				colors.getRow(),
				ports.getRow(),
				delays.getRow(),
				links.getRow(),
				mixEnableds.getRow(),
				mutes.getRow(),
				mixFaders.getRow(),
				mixLRons.getRow(),
				mixLRpans.getRow(),
				mixMONOons.getRow(),
				mixMONOlevels.getRow(),
				dcas.getRow(),
				automixs.getRow(),

			);

winston.debug(tabConfigurations.table.body)

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
				[
					{text: eq1Types[0],style:'rowHeader'},
					{text: eq1Types[1],style:'tableHeader'},
					{text: eq1Types[2],style:'tableHeader'},
					{text: eq1Types[3],style:'tableHeader'},
					{text: eq1Types[4],style:'tableHeader'},
					{text: eq1Types[5],style:'tableHeader'},
					{text: eq1Types[6],style:'tableHeader'},
					{text: eq1Types[7],style:'tableHeader'},
					{text: eq1Types[8],style:'tableHeader'},
				],				
				[
					{text: eq1Fs[0],style:'rowHeader'},
					{text: eq1Fs[1],style:'tableHeader'},
					{text: eq1Fs[2],style:'tableHeader'},
					{text: eq1Fs[3],style:'tableHeader'},
					{text: eq1Fs[4],style:'tableHeader'},
					{text: eq1Fs[5],style:'tableHeader'},
					{text: eq1Fs[6],style:'tableHeader'},
					{text: eq1Fs[7],style:'tableHeader'},
					{text: eq1Fs[8],style:'tableHeader'},
				],				
				[
					{text: eq1Gs[0],style:'rowHeader'},
					{text: eq1Gs[1],style:'tableHeader'},
					{text: eq1Gs[2],style:'tableHeader'},
					{text: eq1Gs[3],style:'tableHeader'},
					{text: eq1Gs[4],style:'tableHeader'},
					{text: eq1Gs[5],style:'tableHeader'},
					{text: eq1Gs[6],style:'tableHeader'},
					{text: eq1Gs[7],style:'tableHeader'},
					{text: eq1Gs[8],style:'tableHeader'},
				],				
				[
					{text: eq1Qs[0],style:'rowHeader'},
					{text: eq1Qs[1],style:'tableHeader'},
					{text: eq1Qs[2],style:'tableHeader'},
					{text: eq1Qs[3],style:'tableHeader'},
					{text: eq1Qs[4],style:'tableHeader'},
					{text: eq1Qs[5],style:'tableHeader'},
					{text: eq1Qs[6],style:'tableHeader'},
					{text: eq1Qs[7],style:'tableHeader'},
					{text: eq1Qs[8],style:'tableHeader'},
				],				
				[
					{text: eq2Types[0],style:'rowHeader'},
					{text: eq2Types[1],style:'tableHeader'},
					{text: eq2Types[2],style:'tableHeader'},
					{text: eq2Types[3],style:'tableHeader'},
					{text: eq2Types[4],style:'tableHeader'},
					{text: eq2Types[5],style:'tableHeader'},
					{text: eq2Types[6],style:'tableHeader'},
					{text: eq2Types[7],style:'tableHeader'},
					{text: eq2Types[8],style:'tableHeader'},
				],				
				[
					{text: eq2Fs[0],style:'rowHeader'},
					{text: eq2Fs[1],style:'tableHeader'},
					{text: eq2Fs[2],style:'tableHeader'},
					{text: eq2Fs[3],style:'tableHeader'},
					{text: eq2Fs[4],style:'tableHeader'},
					{text: eq2Fs[5],style:'tableHeader'},
					{text: eq2Fs[6],style:'tableHeader'},
					{text: eq2Fs[7],style:'tableHeader'},
					{text: eq2Fs[8],style:'tableHeader'},
				],				
				[
					{text: eq2Gs[0],style:'rowHeader'},
					{text: eq2Gs[1],style:'tableHeader'},
					{text: eq2Gs[2],style:'tableHeader'},
					{text: eq2Gs[3],style:'tableHeader'},
					{text: eq2Gs[4],style:'tableHeader'},
					{text: eq2Gs[5],style:'tableHeader'},
					{text: eq2Gs[6],style:'tableHeader'},
					{text: eq2Gs[7],style:'tableHeader'},
					{text: eq2Gs[8],style:'tableHeader'},
				],				
				[
					{text: eq2Qs[0],style:'rowHeader'},
					{text: eq2Qs[1],style:'tableHeader'},
					{text: eq2Qs[2],style:'tableHeader'},
					{text: eq2Qs[3],style:'tableHeader'},
					{text: eq2Qs[4],style:'tableHeader'},
					{text: eq2Qs[5],style:'tableHeader'},
					{text: eq2Qs[6],style:'tableHeader'},
					{text: eq2Qs[7],style:'tableHeader'},
					{text: eq2Qs[8],style:'tableHeader'},
				],				
				[
					{text: eq3Types[0],style:'rowHeader'},
					{text: eq3Types[1],style:'tableHeader'},
					{text: eq3Types[2],style:'tableHeader'},
					{text: eq3Types[3],style:'tableHeader'},
					{text: eq3Types[4],style:'tableHeader'},
					{text: eq3Types[5],style:'tableHeader'},
					{text: eq3Types[6],style:'tableHeader'},
					{text: eq3Types[7],style:'tableHeader'},
					{text: eq3Types[8],style:'tableHeader'},
				],				
				[
					{text: eq3Fs[0],style:'rowHeader'},
					{text: eq3Fs[1],style:'tableHeader'},
					{text: eq3Fs[2],style:'tableHeader'},
					{text: eq3Fs[3],style:'tableHeader'},
					{text: eq3Fs[4],style:'tableHeader'},
					{text: eq3Fs[5],style:'tableHeader'},
					{text: eq3Fs[6],style:'tableHeader'},
					{text: eq3Fs[7],style:'tableHeader'},
					{text: eq3Fs[8],style:'tableHeader'},
				],				
				[
					{text: eq3Gs[0],style:'rowHeader'},
					{text: eq3Gs[1],style:'tableHeader'},
					{text: eq3Gs[2],style:'tableHeader'},
					{text: eq3Gs[3],style:'tableHeader'},
					{text: eq3Gs[4],style:'tableHeader'},
					{text: eq3Gs[5],style:'tableHeader'},
					{text: eq3Gs[6],style:'tableHeader'},
					{text: eq3Gs[7],style:'tableHeader'},
					{text: eq3Gs[8],style:'tableHeader'},
				],				
				[
					{text: eq3Qs[0],style:'rowHeader'},
					{text: eq3Qs[1],style:'tableHeader'},
					{text: eq3Qs[2],style:'tableHeader'},
					{text: eq3Qs[3],style:'tableHeader'},
					{text: eq3Qs[4],style:'tableHeader'},
					{text: eq3Qs[5],style:'tableHeader'},
					{text: eq3Qs[6],style:'tableHeader'},
					{text: eq3Qs[7],style:'tableHeader'},
					{text: eq3Qs[8],style:'tableHeader'},
				],				
				[
					{text: eq4Types[0],style:'rowHeader'},
					{text: eq4Types[1],style:'tableHeader'},
					{text: eq4Types[2],style:'tableHeader'},
					{text: eq4Types[3],style:'tableHeader'},
					{text: eq4Types[4],style:'tableHeader'},
					{text: eq4Types[5],style:'tableHeader'},
					{text: eq4Types[6],style:'tableHeader'},
					{text: eq4Types[7],style:'tableHeader'},
					{text: eq4Types[8],style:'tableHeader'},
				],				
				[
					{text: eq4Fs[0],style:'rowHeader'},
					{text: eq4Fs[1],style:'tableHeader'},
					{text: eq4Fs[2],style:'tableHeader'},
					{text: eq4Fs[3],style:'tableHeader'},
					{text: eq4Fs[4],style:'tableHeader'},
					{text: eq4Fs[5],style:'tableHeader'},
					{text: eq4Fs[6],style:'tableHeader'},
					{text: eq4Fs[7],style:'tableHeader'},
					{text: eq4Fs[8],style:'tableHeader'},
				],				
				[
					{text: eq4Gs[0],style:'rowHeader'},
					{text: eq4Gs[1],style:'tableHeader'},
					{text: eq4Gs[2],style:'tableHeader'},
					{text: eq4Gs[3],style:'tableHeader'},
					{text: eq4Gs[4],style:'tableHeader'},
					{text: eq4Gs[5],style:'tableHeader'},
					{text: eq4Gs[6],style:'tableHeader'},
					{text: eq4Gs[7],style:'tableHeader'},
					{text: eq4Gs[8],style:'tableHeader'},
				],				
				[
					{text: eq4Qs[0],style:'rowHeader'},
					{text: eq4Qs[1],style:'tableHeader'},
					{text: eq4Qs[2],style:'tableHeader'},
					{text: eq4Qs[3],style:'tableHeader'},
					{text: eq4Qs[4],style:'tableHeader'},
					{text: eq4Qs[5],style:'tableHeader'},
					{text: eq4Qs[6],style:'tableHeader'},
					{text: eq4Qs[7],style:'tableHeader'},
					{text: eq4Qs[8],style:'tableHeader'},
				],				
			);

			tabMixs.table.body.push(
				// Inserts Header
				[ {text:'Mix Bus Sends',style:'sectionHeader',colSpan:9,border:[false,false,false,false]},{},{},{},{},{},{},{},{},],
				// Column Titles	
				[{text:'',border:[false,false,false,false]}, {text: ChIds[1],style:'tableHeader'}, {text: ChIds[2],style:'tableHeader'}, {text: ChIds[3],style:'tableHeader'}, {text: ChIds[4],style:'tableHeader'}, {text: ChIds[5],style:'tableHeader'}, {text: ChIds[6],style:'tableHeader'}, {text: ChIds[7],style:'tableHeader'}, {text: ChIds[8],style:'tableHeader'}, ],
				[
					{text: mixBus01types[0],style:'rowHeader'},
					{text: mixBus01types[1],style:'tableHeader'},
					{text: mixBus01types[2],style:'tableHeader'},
					{text: mixBus01types[3],style:'tableHeader'},
					{text: mixBus01types[4],style:'tableHeader'},
					{text: mixBus01types[5],style:'tableHeader'},
					{text: mixBus01types[6],style:'tableHeader'},
					{text: mixBus01types[7],style:'tableHeader'},
					{text: mixBus01types[8],style:'tableHeader'},
				],
				[
					{text: mixBus01pans[0],style:'rowHeader'},
					{text: mixBus01pans[1],style:'tableHeader'},
					{text: mixBus01pans[2],style:'tableHeader'},
					{text: mixBus01pans[3],style:'tableHeader'},
					{text: mixBus01pans[4],style:'tableHeader'},
					{text: mixBus01pans[5],style:'tableHeader'},
					{text: mixBus01pans[6],style:'tableHeader'},
					{text: mixBus01pans[7],style:'tableHeader'},
					{text: mixBus01pans[8],style:'tableHeader'},
				],
				[
					{text: mixBus01ons[0],style:'rowHeader'},
					{text: mixBus01ons[1],style:'tableHeader'},
					{text: mixBus01ons[2],style:'tableHeader'},
					{text: mixBus01ons[3],style:'tableHeader'},
					{text: mixBus01ons[4],style:'tableHeader'},
					{text: mixBus01ons[5],style:'tableHeader'},
					{text: mixBus01ons[6],style:'tableHeader'},
					{text: mixBus01ons[7],style:'tableHeader'},
					{text: mixBus01ons[8],style:'tableHeader'},
				],
				[
					{text: mixBus01levels[0],style:'rowHeader'},
					{text: mixBus01levels[1],style:'tableHeader'},
					{text: mixBus01levels[2],style:'tableHeader'},
					{text: mixBus01levels[3],style:'tableHeader'},
					{text: mixBus01levels[4],style:'tableHeader'},
					{text: mixBus01levels[5],style:'tableHeader'},
					{text: mixBus01levels[6],style:'tableHeader'},
					{text: mixBus01levels[7],style:'tableHeader'},
					{text: mixBus01levels[8],style:'tableHeader'},
				],
				[
					{text: mixBus02ons[0],style:'rowHeader'},
					{text: mixBus02ons[1],style:'tableHeader'},
					{text: mixBus02ons[2],style:'tableHeader'},
					{text: mixBus02ons[3],style:'tableHeader'},
					{text: mixBus02ons[4],style:'tableHeader'},
					{text: mixBus02ons[5],style:'tableHeader'},
					{text: mixBus02ons[6],style:'tableHeader'},
					{text: mixBus02ons[7],style:'tableHeader'},
					{text: mixBus02ons[8],style:'tableHeader'},
				],	
				[
					{text: mixBus02levels[0],style:'rowHeader'},
					{text: mixBus02levels[1],style:'tableHeader'},
					{text: mixBus02levels[2],style:'tableHeader'},
					{text: mixBus02levels[3],style:'tableHeader'},
					{text: mixBus02levels[4],style:'tableHeader'},
					{text: mixBus02levels[5],style:'tableHeader'},
					{text: mixBus02levels[6],style:'tableHeader'},
					{text: mixBus02levels[7],style:'tableHeader'},
					{text: mixBus02levels[8],style:'tableHeader'},
				],	
				[
					{text: mixBus03types[0],style:'rowHeader'},
					{text: mixBus03types[1],style:'tableHeader'},
					{text: mixBus03types[2],style:'tableHeader'},
					{text: mixBus03types[3],style:'tableHeader'},
					{text: mixBus03types[4],style:'tableHeader'},
					{text: mixBus03types[5],style:'tableHeader'},
					{text: mixBus03types[6],style:'tableHeader'},
					{text: mixBus03types[7],style:'tableHeader'},
					{text: mixBus03types[8],style:'tableHeader'},
				],
				[
					{text: mixBus03pans[0],style:'rowHeader'},
					{text: mixBus03pans[1],style:'tableHeader'},
					{text: mixBus03pans[2],style:'tableHeader'},
					{text: mixBus03pans[3],style:'tableHeader'},
					{text: mixBus03pans[4],style:'tableHeader'},
					{text: mixBus03pans[5],style:'tableHeader'},
					{text: mixBus03pans[6],style:'tableHeader'},
					{text: mixBus03pans[7],style:'tableHeader'},
					{text: mixBus03pans[8],style:'tableHeader'},
				],
				[
					{text: mixBus03ons[0],style:'rowHeader'},
					{text: mixBus03ons[1],style:'tableHeader'},
					{text: mixBus03ons[2],style:'tableHeader'},
					{text: mixBus03ons[3],style:'tableHeader'},
					{text: mixBus03ons[4],style:'tableHeader'},
					{text: mixBus03ons[5],style:'tableHeader'},
					{text: mixBus03ons[6],style:'tableHeader'},
					{text: mixBus03ons[7],style:'tableHeader'},
					{text: mixBus03ons[8],style:'tableHeader'},
				],	
				[
					{text: mixBus03levels[0],style:'rowHeader'},
					{text: mixBus03levels[1],style:'tableHeader'},
					{text: mixBus03levels[2],style:'tableHeader'},
					{text: mixBus03levels[3],style:'tableHeader'},
					{text: mixBus03levels[4],style:'tableHeader'},
					{text: mixBus03levels[5],style:'tableHeader'},
					{text: mixBus03levels[6],style:'tableHeader'},
					{text: mixBus03levels[7],style:'tableHeader'},
					{text: mixBus03levels[8],style:'tableHeader'},
				],	
				[
					{text: mixBus04ons[0],style:'rowHeader'},
					{text: mixBus04ons[1],style:'tableHeader'},
					{text: mixBus04ons[2],style:'tableHeader'},
					{text: mixBus04ons[3],style:'tableHeader'},
					{text: mixBus04ons[4],style:'tableHeader'},
					{text: mixBus04ons[5],style:'tableHeader'},
					{text: mixBus04ons[6],style:'tableHeader'},
					{text: mixBus04ons[7],style:'tableHeader'},
					{text: mixBus04ons[8],style:'tableHeader'},
				],	
				[
					{text: mixBus04levels[0],style:'rowHeader'},
					{text: mixBus04levels[1],style:'tableHeader'},
					{text: mixBus04levels[2],style:'tableHeader'},
					{text: mixBus04levels[3],style:'tableHeader'},
					{text: mixBus04levels[4],style:'tableHeader'},
					{text: mixBus04levels[5],style:'tableHeader'},
					{text: mixBus04levels[6],style:'tableHeader'},
					{text: mixBus04levels[7],style:'tableHeader'},
					{text: mixBus04levels[8],style:'tableHeader'},
				],	
				[
					{text: mixBus05types[0],style:'rowHeader'},
					{text: mixBus05types[1],style:'tableHeader'},
					{text: mixBus05types[2],style:'tableHeader'},
					{text: mixBus05types[3],style:'tableHeader'},
					{text: mixBus05types[4],style:'tableHeader'},
					{text: mixBus05types[5],style:'tableHeader'},
					{text: mixBus05types[6],style:'tableHeader'},
					{text: mixBus05types[7],style:'tableHeader'},
					{text: mixBus05types[8],style:'tableHeader'},
				],
				[
					{text: mixBus05pans[0],style:'rowHeader'},
					{text: mixBus05pans[1],style:'tableHeader'},
					{text: mixBus05pans[2],style:'tableHeader'},
					{text: mixBus05pans[3],style:'tableHeader'},
					{text: mixBus05pans[4],style:'tableHeader'},
					{text: mixBus05pans[5],style:'tableHeader'},
					{text: mixBus05pans[6],style:'tableHeader'},
					{text: mixBus05pans[7],style:'tableHeader'},
					{text: mixBus05pans[8],style:'tableHeader'},
				],
				[
					{text: mixBus05ons[0],style:'rowHeader'},
					{text: mixBus05ons[1],style:'tableHeader'},
					{text: mixBus05ons[2],style:'tableHeader'},
					{text: mixBus05ons[3],style:'tableHeader'},
					{text: mixBus05ons[4],style:'tableHeader'},
					{text: mixBus05ons[5],style:'tableHeader'},
					{text: mixBus05ons[6],style:'tableHeader'},
					{text: mixBus05ons[7],style:'tableHeader'},
					{text: mixBus05ons[8],style:'tableHeader'},
				],	
				[
					{text: mixBus05levels[0],style:'rowHeader'},
					{text: mixBus05levels[1],style:'tableHeader'},
					{text: mixBus05levels[2],style:'tableHeader'},
					{text: mixBus05levels[3],style:'tableHeader'},
					{text: mixBus05levels[4],style:'tableHeader'},
					{text: mixBus05levels[5],style:'tableHeader'},
					{text: mixBus05levels[6],style:'tableHeader'},
					{text: mixBus05levels[7],style:'tableHeader'},
					{text: mixBus05levels[8],style:'tableHeader'},
				],	
				[
					{text: mixBus06ons[0],style:'rowHeader'},
					{text: mixBus06ons[1],style:'tableHeader'},
					{text: mixBus06ons[2],style:'tableHeader'},
					{text: mixBus06ons[3],style:'tableHeader'},
					{text: mixBus06ons[4],style:'tableHeader'},
					{text: mixBus06ons[5],style:'tableHeader'},
					{text: mixBus06ons[6],style:'tableHeader'},
					{text: mixBus06ons[7],style:'tableHeader'},
					{text: mixBus06ons[8],style:'tableHeader'},
				],	
				[
					{text: mixBus06levels[0],style:'rowHeader'},
					{text: mixBus06levels[1],style:'tableHeader'},
					{text: mixBus06levels[2],style:'tableHeader'},
					{text: mixBus06levels[3],style:'tableHeader'},
					{text: mixBus06levels[4],style:'tableHeader'},
					{text: mixBus06levels[5],style:'tableHeader'},
					{text: mixBus06levels[6],style:'tableHeader'},
					{text: mixBus06levels[7],style:'tableHeader'},
					{text: mixBus06levels[8],style:'tableHeader'},
				],	
				[
					{text: mixBus07types[0],style:'rowHeader'},
					{text: mixBus07types[1],style:'tableHeader'},
					{text: mixBus07types[2],style:'tableHeader'},
					{text: mixBus07types[3],style:'tableHeader'},
					{text: mixBus07types[4],style:'tableHeader'},
					{text: mixBus07types[5],style:'tableHeader'},
					{text: mixBus07types[6],style:'tableHeader'},
					{text: mixBus07types[7],style:'tableHeader'},
					{text: mixBus07types[8],style:'tableHeader'},
				],
				[
					{text: mixBus07pans[0],style:'rowHeader'},
					{text: mixBus07pans[1],style:'tableHeader'},
					{text: mixBus07pans[2],style:'tableHeader'},
					{text: mixBus07pans[3],style:'tableHeader'},
					{text: mixBus07pans[4],style:'tableHeader'},
					{text: mixBus07pans[5],style:'tableHeader'},
					{text: mixBus07pans[6],style:'tableHeader'},
					{text: mixBus07pans[7],style:'tableHeader'},
					{text: mixBus07pans[8],style:'tableHeader'},
				],
				[
					{text: mixBus07ons[0],style:'rowHeader'},
					{text: mixBus07ons[1],style:'tableHeader'},
					{text: mixBus07ons[2],style:'tableHeader'},
					{text: mixBus07ons[3],style:'tableHeader'},
					{text: mixBus07ons[4],style:'tableHeader'},
					{text: mixBus07ons[5],style:'tableHeader'},
					{text: mixBus07ons[6],style:'tableHeader'},
					{text: mixBus07ons[7],style:'tableHeader'},
					{text: mixBus07ons[8],style:'tableHeader'},
				],	
				[
					{text: mixBus07levels[0],style:'rowHeader'},
					{text: mixBus07levels[1],style:'tableHeader'},
					{text: mixBus07levels[2],style:'tableHeader'},
					{text: mixBus07levels[3],style:'tableHeader'},
					{text: mixBus07levels[4],style:'tableHeader'},
					{text: mixBus07levels[5],style:'tableHeader'},
					{text: mixBus07levels[6],style:'tableHeader'},
					{text: mixBus07levels[7],style:'tableHeader'},
					{text: mixBus07levels[8],style:'tableHeader'},
				],	
				[
					{text: mixBus08ons[0],style:'rowHeader'},
					{text: mixBus08ons[1],style:'tableHeader'},
					{text: mixBus08ons[2],style:'tableHeader'},
					{text: mixBus08ons[3],style:'tableHeader'},
					{text: mixBus08ons[4],style:'tableHeader'},
					{text: mixBus08ons[5],style:'tableHeader'},
					{text: mixBus08ons[6],style:'tableHeader'},
					{text: mixBus08ons[7],style:'tableHeader'},
					{text: mixBus08ons[8],style:'tableHeader'},
				],	
				[
					{text: mixBus08levels[0],style:'rowHeader'},
					{text: mixBus08levels[1],style:'tableHeader'},
					{text: mixBus08levels[2],style:'tableHeader'},
					{text: mixBus08levels[3],style:'tableHeader'},
					{text: mixBus08levels[4],style:'tableHeader'},
					{text: mixBus08levels[5],style:'tableHeader'},
					{text: mixBus08levels[6],style:'tableHeader'},
					{text: mixBus08levels[7],style:'tableHeader'},
					{text: mixBus08levels[8],style:'tableHeader'},
				],	
				[
					{text: mixBus09types[0],style:'rowHeader'},
					{text: mixBus09types[1],style:'tableHeader'},
					{text: mixBus09types[2],style:'tableHeader'},
					{text: mixBus09types[3],style:'tableHeader'},
					{text: mixBus09types[4],style:'tableHeader'},
					{text: mixBus09types[5],style:'tableHeader'},
					{text: mixBus09types[6],style:'tableHeader'},
					{text: mixBus09types[7],style:'tableHeader'},
					{text: mixBus09types[8],style:'tableHeader'},
				],
				[
					{text: mixBus09pans[0],style:'rowHeader'},
					{text: mixBus09pans[1],style:'tableHeader'},
					{text: mixBus09pans[2],style:'tableHeader'},
					{text: mixBus09pans[3],style:'tableHeader'},
					{text: mixBus09pans[4],style:'tableHeader'},
					{text: mixBus09pans[5],style:'tableHeader'},
					{text: mixBus09pans[6],style:'tableHeader'},
					{text: mixBus09pans[7],style:'tableHeader'},
					{text: mixBus09pans[8],style:'tableHeader'},
				],
				[
					{text: mixBus09ons[0],style:'rowHeader'},
					{text: mixBus09ons[1],style:'tableHeader'},
					{text: mixBus09ons[2],style:'tableHeader'},
					{text: mixBus09ons[3],style:'tableHeader'},
					{text: mixBus09ons[4],style:'tableHeader'},
					{text: mixBus09ons[5],style:'tableHeader'},
					{text: mixBus09ons[6],style:'tableHeader'},
					{text: mixBus09ons[7],style:'tableHeader'},
					{text: mixBus09ons[8],style:'tableHeader'},
				],	
				[
					{text: mixBus09levels[0],style:'rowHeader'},
					{text: mixBus09levels[1],style:'tableHeader'},
					{text: mixBus09levels[2],style:'tableHeader'},
					{text: mixBus09levels[3],style:'tableHeader'},
					{text: mixBus09levels[4],style:'tableHeader'},
					{text: mixBus09levels[5],style:'tableHeader'},
					{text: mixBus09levels[6],style:'tableHeader'},
					{text: mixBus09levels[7],style:'tableHeader'},
					{text: mixBus09levels[8],style:'tableHeader'},
				],	
				[
					{text: mixBus10ons[0],style:'rowHeader'},
					{text: mixBus10ons[1],style:'tableHeader'},
					{text: mixBus10ons[2],style:'tableHeader'},
					{text: mixBus10ons[3],style:'tableHeader'},
					{text: mixBus10ons[4],style:'tableHeader'},
					{text: mixBus10ons[5],style:'tableHeader'},
					{text: mixBus10ons[6],style:'tableHeader'},
					{text: mixBus10ons[7],style:'tableHeader'},
					{text: mixBus10ons[8],style:'tableHeader'},
				],	
				[
					{text: mixBus10levels[0],style:'rowHeader'},
					{text: mixBus10levels[1],style:'tableHeader'},
					{text: mixBus10levels[2],style:'tableHeader'},
					{text: mixBus10levels[3],style:'tableHeader'},
					{text: mixBus10levels[4],style:'tableHeader'},
					{text: mixBus10levels[5],style:'tableHeader'},
					{text: mixBus10levels[6],style:'tableHeader'},
					{text: mixBus10levels[7],style:'tableHeader'},
					{text: mixBus10levels[8],style:'tableHeader'},
				],	
				[
					{text: mixBus11types[0],style:'rowHeader'},
					{text: mixBus11types[1],style:'tableHeader'},
					{text: mixBus11types[2],style:'tableHeader'},
					{text: mixBus11types[3],style:'tableHeader'},
					{text: mixBus11types[4],style:'tableHeader'},
					{text: mixBus11types[5],style:'tableHeader'},
					{text: mixBus11types[6],style:'tableHeader'},
					{text: mixBus11types[7],style:'tableHeader'},
					{text: mixBus11types[8],style:'tableHeader'},
				],
				[
					{text: mixBus11pans[0],style:'rowHeader'},
					{text: mixBus11pans[1],style:'tableHeader'},
					{text: mixBus11pans[2],style:'tableHeader'},
					{text: mixBus11pans[3],style:'tableHeader'},
					{text: mixBus11pans[4],style:'tableHeader'},
					{text: mixBus11pans[5],style:'tableHeader'},
					{text: mixBus11pans[6],style:'tableHeader'},
					{text: mixBus11pans[7],style:'tableHeader'},
					{text: mixBus11pans[8],style:'tableHeader'},
				],
				[
					{text: mixBus11ons[0],style:'rowHeader'},
					{text: mixBus11ons[1],style:'tableHeader'},
					{text: mixBus11ons[2],style:'tableHeader'},
					{text: mixBus11ons[3],style:'tableHeader'},
					{text: mixBus11ons[4],style:'tableHeader'},
					{text: mixBus11ons[5],style:'tableHeader'},
					{text: mixBus11ons[6],style:'tableHeader'},
					{text: mixBus11ons[7],style:'tableHeader'},
					{text: mixBus11ons[8],style:'tableHeader'},
				],	
				[
					{text: mixBus11levels[0],style:'rowHeader'},
					{text: mixBus11levels[1],style:'tableHeader'},
					{text: mixBus11levels[2],style:'tableHeader'},
					{text: mixBus11levels[3],style:'tableHeader'},
					{text: mixBus11levels[4],style:'tableHeader'},
					{text: mixBus11levels[5],style:'tableHeader'},
					{text: mixBus11levels[6],style:'tableHeader'},
					{text: mixBus11levels[7],style:'tableHeader'},
					{text: mixBus11levels[8],style:'tableHeader'},
				],	
				[
					{text: mixBus12ons[0],style:'rowHeader'},
					{text: mixBus12ons[1],style:'tableHeader'},
					{text: mixBus12ons[2],style:'tableHeader'},
					{text: mixBus12ons[3],style:'tableHeader'},
					{text: mixBus12ons[4],style:'tableHeader'},
					{text: mixBus12ons[5],style:'tableHeader'},
					{text: mixBus12ons[6],style:'tableHeader'},
					{text: mixBus12ons[7],style:'tableHeader'},
					{text: mixBus12ons[8],style:'tableHeader'},
				],	
				[
					{text: mixBus12levels[0],style:'rowHeader'},
					{text: mixBus12levels[1],style:'tableHeader'},
					{text: mixBus12levels[2],style:'tableHeader'},
					{text: mixBus12levels[3],style:'tableHeader'},
					{text: mixBus12levels[4],style:'tableHeader'},
					{text: mixBus12levels[5],style:'tableHeader'},
					{text: mixBus12levels[6],style:'tableHeader'},
					{text: mixBus12levels[7],style:'tableHeader'},
					{text: mixBus12levels[8],style:'tableHeader'},
				],	
				[
					{text: mixBus13types[0],style:'rowHeader'},
					{text: mixBus13types[1],style:'tableHeader'},
					{text: mixBus13types[2],style:'tableHeader'},
					{text: mixBus13types[3],style:'tableHeader'},
					{text: mixBus13types[4],style:'tableHeader'},
					{text: mixBus13types[5],style:'tableHeader'},
					{text: mixBus13types[6],style:'tableHeader'},
					{text: mixBus13types[7],style:'tableHeader'},
					{text: mixBus13types[8],style:'tableHeader'},
				],
				[
					{text: mixBus13pans[0],style:'rowHeader'},
					{text: mixBus13pans[1],style:'tableHeader'},
					{text: mixBus13pans[2],style:'tableHeader'},
					{text: mixBus13pans[3],style:'tableHeader'},
					{text: mixBus13pans[4],style:'tableHeader'},
					{text: mixBus13pans[5],style:'tableHeader'},
					{text: mixBus13pans[6],style:'tableHeader'},
					{text: mixBus13pans[7],style:'tableHeader'},
					{text: mixBus13pans[8],style:'tableHeader'},
				],
				[
					{text: mixBus13ons[0],style:'rowHeader'},
					{text: mixBus13ons[1],style:'tableHeader'},
					{text: mixBus13ons[2],style:'tableHeader'},
					{text: mixBus13ons[3],style:'tableHeader'},
					{text: mixBus13ons[4],style:'tableHeader'},
					{text: mixBus13ons[5],style:'tableHeader'},
					{text: mixBus13ons[6],style:'tableHeader'},
					{text: mixBus13ons[7],style:'tableHeader'},
					{text: mixBus13ons[8],style:'tableHeader'},
				],	
				[
					{text: mixBus13levels[0],style:'rowHeader'},
					{text: mixBus13levels[1],style:'tableHeader'},
					{text: mixBus13levels[2],style:'tableHeader'},
					{text: mixBus13levels[3],style:'tableHeader'},
					{text: mixBus13levels[4],style:'tableHeader'},
					{text: mixBus13levels[5],style:'tableHeader'},
					{text: mixBus13levels[6],style:'tableHeader'},
					{text: mixBus13levels[7],style:'tableHeader'},
					{text: mixBus13levels[8],style:'tableHeader'},
				],	
				[
					{text: mixBus14ons[0],style:'rowHeader'},
					{text: mixBus14ons[1],style:'tableHeader'},
					{text: mixBus14ons[2],style:'tableHeader'},
					{text: mixBus14ons[3],style:'tableHeader'},
					{text: mixBus14ons[4],style:'tableHeader'},
					{text: mixBus14ons[5],style:'tableHeader'},
					{text: mixBus14ons[6],style:'tableHeader'},
					{text: mixBus14ons[7],style:'tableHeader'},
					{text: mixBus14ons[8],style:'tableHeader'},
				],	
				[
					{text: mixBus14levels[0],style:'rowHeader'},
					{text: mixBus14levels[1],style:'tableHeader'},
					{text: mixBus14levels[2],style:'tableHeader'},
					{text: mixBus14levels[3],style:'tableHeader'},
					{text: mixBus14levels[4],style:'tableHeader'},
					{text: mixBus14levels[5],style:'tableHeader'},
					{text: mixBus14levels[6],style:'tableHeader'},
					{text: mixBus14levels[7],style:'tableHeader'},
					{text: mixBus14levels[8],style:'tableHeader'},
				],	
				[
					{text: mixBus15types[0],style:'rowHeader'},
					{text: mixBus15types[1],style:'tableHeader'},
					{text: mixBus15types[2],style:'tableHeader'},
					{text: mixBus15types[3],style:'tableHeader'},
					{text: mixBus15types[4],style:'tableHeader'},
					{text: mixBus15types[5],style:'tableHeader'},
					{text: mixBus15types[6],style:'tableHeader'},
					{text: mixBus15types[7],style:'tableHeader'},
					{text: mixBus15types[8],style:'tableHeader'},
				],
				[
					{text: mixBus15pans[0],style:'rowHeader'},
					{text: mixBus15pans[1],style:'tableHeader'},
					{text: mixBus15pans[2],style:'tableHeader'},
					{text: mixBus15pans[3],style:'tableHeader'},
					{text: mixBus15pans[4],style:'tableHeader'},
					{text: mixBus15pans[5],style:'tableHeader'},
					{text: mixBus15pans[6],style:'tableHeader'},
					{text: mixBus15pans[7],style:'tableHeader'},
					{text: mixBus15pans[8],style:'tableHeader'},
				],
				[
					{text: mixBus15ons[0],style:'rowHeader'},
					{text: mixBus15ons[1],style:'tableHeader'},
					{text: mixBus15ons[2],style:'tableHeader'},
					{text: mixBus15ons[3],style:'tableHeader'},
					{text: mixBus15ons[4],style:'tableHeader'},
					{text: mixBus15ons[5],style:'tableHeader'},
					{text: mixBus15ons[6],style:'tableHeader'},
					{text: mixBus15ons[7],style:'tableHeader'},
					{text: mixBus15ons[8],style:'tableHeader'},
				],	
				[
					{text: mixBus15levels[0],style:'rowHeader'},
					{text: mixBus15levels[1],style:'tableHeader'},
					{text: mixBus15levels[2],style:'tableHeader'},
					{text: mixBus15levels[3],style:'tableHeader'},
					{text: mixBus15levels[4],style:'tableHeader'},
					{text: mixBus15levels[5],style:'tableHeader'},
					{text: mixBus15levels[6],style:'tableHeader'},
					{text: mixBus15levels[7],style:'tableHeader'},
					{text: mixBus15levels[8],style:'tableHeader'},
				],	
				[
					{text: mixBus16ons[0],style:'rowHeader'},
					{text: mixBus16ons[1],style:'tableHeader'},
					{text: mixBus16ons[2],style:'tableHeader'},
					{text: mixBus16ons[3],style:'tableHeader'},
					{text: mixBus16ons[4],style:'tableHeader'},
					{text: mixBus16ons[5],style:'tableHeader'},
					{text: mixBus16ons[6],style:'tableHeader'},
					{text: mixBus16ons[7],style:'tableHeader'},
					{text: mixBus16ons[8],style:'tableHeader'},
				],	
				[
					{text: mixBus16levels[0],style:'rowHeader'},
					{text: mixBus16levels[1],style:'tableHeader'},
					{text: mixBus16levels[2],style:'tableHeader'},
					{text: mixBus16levels[3],style:'tableHeader'},
					{text: mixBus16levels[4],style:'tableHeader'},
					{text: mixBus16levels[5],style:'tableHeader'},
					{text: mixBus16levels[6],style:'tableHeader'},
					{text: mixBus16levels[7],style:'tableHeader'},
					{text: mixBus16levels[8],style:'tableHeader'},
				],	
			);
			// Add the tables to the document
			this.addContent(tabConfigurations);
			this.addContent(tabPreamps);
			this.addContent(tabGates);
			this.addContent(tabInserts);
			this.addContent(tabDynamics);			
			this.addContent(tabEqs);
			this.addContent(tabMixs);


		}
	}
}

function cell (text, onOption='', offOption='') {
	// console.log(text, onOption) 
	text = (text == 'POST') ? 'Post' : text;
	text = (text == 'GATE') ? 'Gate' : text;
	// text = (text == '-oo') ? String.fromCharCode(0x221E) : text;
	text = (text == 'ON' && onOption != '') ? onOption : text;
	text = (text == 'ON' && onOption == '') ? On : text;
	text = (text == 'OFF' && offOption != '') ? offOption : text;
	text = (text == 'OFF' && offOption == '') ? Off : text;
	return {text: text, style: 'tableCell'};
}

function rowHeader( text , style='rowHeader') {
  return	[{text: text, style: style}]
}

function simple( text ) {
	return {text: text} 
}

// the beringer logic is backwards so reverse it to make it readable
function muted(OnOff) {
	if (OnOff == 'On' || OnOff == 'ON') {
		return 'Off';
	} else if (OnOff == 'Off' || OnOff == 'OFF') {
		return 'On';
 	} else return OnOff;
}

function freq(f) {
	if (typeof f != 'string') f = f.toString();
	var i = f.indexOf('k');
	if (i != -1) {
    	var s = f.split('k');
    	f = s[0]+','+(s[1]+'000').substring(0,3);
 	} 
	return f;
}

module.exports = DocumentDefinition;