"use strict";
var winston = require('winston');

Number.prototype.pad = function(size) {
    var s = String(this);
    while (s.length < (size || 2)) {s = "0" + s;}
    return s;
}

String.prototype.isOdd = function() {
	var s = String(this);

	return (s%2)==1;
}



String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

class X32 {

	constructor(name) {
		// this.xxx = name;
	}

	/**
	 * Process Commments and Commands from the scene file
	 *
	 * @param      {string}  line    Each line from the scene files
	 */
	parseLine(line) {
		this.line = line;
		this.arg = commandArgs2Array(line);

		// Comments begin with # and Commands begin with /
		var firstCharacter = this.line.charAt(0);
		if (firstCharacter == "#") {
			this.parseComment();
		} else if (firstCharacter == "/") {
			this.parseCommand();
		} else {
			throw new Error ('Invalid Line: '+this.line);
		}
	}

	/**
	 * Process lines beginnign with #
	 */
	parseComment() {
		// extract the name, note and safes fields
		this.name  = this.arg[1].replace(/["]+/g, '')
		this.note  = this.arg[2].replace(/["]+/g, '')
		this.safes = this.arg[3];
	}

	/**
	 * Process lines beginning with /
	 */
	parseCommand() {
		// parse out the command hierachy 
		this.cmd = this.arg[0].substring(1).split("/");

		// build the property structure based on the scene file
		this.build_x32_objects();
		// this['config']['routing']['ports'] = {};

		var c0 = this.cmd[0];
		var c1 = this.cmd[1];
		var c2 = this.cmd[2];
		var c3 = this.cmd[3];

		if (this.cmd[0] == 'config') 	this.parseConfig(c0,c1,c2,c3);
		if (this.cmd[0] == 'ch') 		this.parseChannel(c0,c1,c2,c3);
		if (this.cmd[0] == 'auxin') 	this.parseChannel(c0,c1,c2,c3);
		if (this.cmd[0] == 'fxrtn') 	this.parseChannel(c0,c1,c2,c3);
		if (this.cmd[0] == 'bus') 		this.parseChannel(c0,c1,c2,c3);
		if (this.cmd[0] == 'mtx') 		this.parseChannel(c0,c1,c2,c3);
		if (this.cmd[0] == 'main') 		this.parseChannel(c0,c1,c2,c3);
		if (this.cmd[0] == 'dca') 		this.parseDCA(c0,c1,c2,c3);
		if (this.cmd[0] == 'fx') 		this.parseFX(c0,c1,c2,c3);
		if (this.cmd[0] == 'outputs') 	this.parseOutput(c0,c1,c2,c3);
		if (this.cmd[0] == 'headamp') 	this.parseHeadamp(c0,c1,c2,c3);
	}

	/**
	 * Builds x32 data structure from scene file commands.
	 */
	build_x32_objects() {
		var c0 = this.cmd[0];
		var c1 = this.cmd[1];
		var c2 = this.cmd[2];
		var c3 = this.cmd[3];

		// argument 0 exists?
		if (typeof c0 != 'undefined') {
			// console.log ('arg 0 exists', this.cmd[0]);
			if (!this.hasOwnProperty( c0 )) {
				// console.log (c0, 'property does not exist' );
				this[c0] = {};
			} 
			if (typeof c1 != 'undefined') {
				if(!this[c0].hasOwnProperty( c1 )) {
					if (c0 == 'headamp') {
						var n = parseInt(c1);
						if (n >=0 && n<=31) {
							var n1 = 'XLR'+(n+1).pad().toString();
						} else if (n>= 32 && n<=79) {
							var n1 = 'A'+(n-31).pad().toString();
						} else if (n>=80 && n<=127) {
							var n1 = 'B'+(n-79).pad().toString();
						} else {
							throw new Error('Invalid Headamp: '+this.line)
						}
						this[c0][n1] = {headampId: c1}
					} else {				
						// console.log (c1, 'property does not exist' );
						this[c0][c1] = {};
					}
				}

				if (typeof c2 != 'undefined') {
					if (!this[c0][c1].hasOwnProperty( c2 )) {
						// console.log (c2, 'property does not exist' );
						this[c0][c1][c2] = {};
					}

					if (typeof c3 != 'undefined') {
						if (!this[c0][c1][c2].hasOwnProperty( c3 )) {
							// console.log (c2, 'property does not exist' );
							this[c0][c1][c2][c3] = {}
						}

					}
				}
			}

		}
	   // console.log(o[0], X32[o[0]]); [o[3]]
	   // if (typeof X32[o[0]] === 'undefined') X32[o[0]] = {};
	   // if (typeof X32[o[0]][o[1]] === 'undefined') X32[o[0]][o[1]] = {};

		// if (typeof this.cmd[0] != 'undefined') {
		// 	console.log(this.cmd[0]);
		// 	if (typeof this.cmd[0]] === 'undefined') this.cmd[0] = {};
			// if (typeof this.cmd[1] != 'undefined') {
			// 	if (typeof X32[this.cmd[0]][this.cmd[1]] === 'undefined') 
			// 		this.cmd[0].this.cmd[1] = {};
			// 	if (typeof this.cmd[2] != 'undefined') {
			// 		if (typeof X32[this.cmd[0]][this.cmd[1]][this.cmd[2]] === 'undefined') X32[this.cmd[0]][this.cmd[1]][this.cmd[2]] = {};
			// 		if (typeof this.cmd[3] != 'undefined') {
			// 			if (typeof X32[this.cmd[0]][this.cmd[1]][this.cmd[2]][this.cmd[3]] === 'undefined') X32[this.cmd[0]][this.cmd[1]][this.cmd[2]][this.cmd[3]] = {};
			// 			if (typeof this.cmd[4] != 'undefined') {
			// 				// console.log(this.cmd[4]);
			// 			}	
			// 		}
			// 	}
			// }
	}

	parseConfig(c0, c1, c2, c3) {
		if (c1 == 'chlink') {
			for (var i = 1; i <= 16; i++) {
				var argIndex = i.toString();
				var Index = (i*2-1).pad().toString();
				this[c0][c1][Index] = this.arg[argIndex];
			}
		} else if (c1 == 'auxlink') {
			for (var i = 1; i <= 4; i++) {
				var argIndex = i.toString();
				var Index = (i*2-1).pad().toString();
				this[c0][c1][Index] = this.arg[argIndex];
			}
		} else if (c1 == 'fxlink') {
			for (var i = 1; i <= 4; i++) {
				var argIndex = i.toString();
				var Index = (i*2-1).pad().toString();
				this[c0][c1][Index] = this.arg[argIndex];
			}
		} else if (c1 == 'buslink') {
			for (var i = 1; i <= 8; i++) {
				var argIndex = i.toString();
				var Index = (i*2-1).pad().toString();
				this[c0][c1][Index] = this.arg[argIndex];
			}
		} else if (c1 == 'mtxlink') {
			for (var i = 1; i <= 3; i++) {
				var argIndex = i.toString();
				var Index = (i*2-1).pad().toString();
				this[c0][c1][Index] = this.arg[argIndex];
			}
		} else if (c1 == 'mute') {
			for (var i = 1; i <= 6; i++) {
				var argIndex = i.toString();
				this[c0][c1][argIndex] = this.arg[argIndex];
			}
		} else if (c1 == 'linkcfg') {
			var labels = ['hadly','eq','dyn','fdmute'];
			for (var i = 0; i < labels.length; i++) {
				var argIndex = (i+1).toString();
				this[c0][c1][labels[i]] = this.arg[argIndex];
			}
		} else if (c1 == 'mono') {
			var labels = ['mode','link'];
			for (var i = 0; i < labels.length; i++) {
				var argIndex = (i+1).toString();
				this[c0][c1][labels[i]] = this.arg[argIndex];
			}
		} else if (c1 == 'solo') {
			var labels = ['level','link', 'sourcetrim', 'chmode','busmode','dcamode','exclusive','followsel','followsolo','dimatt','dim','mono','delay','delaytime','masterctrl','mute','dimpfl'];
			for (var i = 0; i < labels.length; i++) {
				var argIndex = (i+1).toString();
				this[c0][c1][labels[i]] = this.arg[argIndex];
			}
		} else if (c1 == 'talk' && typeof c2 === 'undefined') {
			var labels = ['enable','source'];
			for (var i = 0; i < labels.length; i++) {
				var argIndex = (i+1).toString();
				this[c0][c1][labels[i]] = this.arg[argIndex];
			}
		} else if (c1 == 'talk' && typeof c2 === 'string') {
			var labels = ['level','dim','latch','destmap'];
			for (var i = 0; i < labels.length; i++) {
				var argIndex = (i+1).toString();
				this[c0][c1][c2][labels[i]] = this.arg[argIndex];
			}
		} else if (c1 == 'osc') {
			var labels = ['level','f1','f2','fsel','type','dest'];
			for (var i = 0; i < labels.length; i++) {
				var argIndex = (i+1).toString();
				this[c0][c1][labels[i]] = this.arg[argIndex];
			}
		} else if (c1 == 'routing' && typeof c2 === 'undefined') {
			this[c0][c1]['routswitch'] = this.arg[1];
		} else if (c1 == 'routing' && c2 == 'IN') {
			var labels = ['1-8','9-16','17-24','25-32','AUX'];
			this[c0][c1]['ports'] = {};
			for (var i = 0; i < labels.length; i++) {
				var argIndex = (i+1).toString();
				this[c0][c1][c2][labels[i]] = {};
				var bus = this.arg[argIndex]
				// this[c0][c1][c2][labels[i]]['ports'] = busPorts(bus);
				// this[c0][c1][c2][labels[i]]['bus'] = bus;				this[c0][c1][c2][labels[i]]['ports'] = busPorts(bus);
				this[c0][c1]['ports'] = Object.assign(this[c0][c1]['ports'], busPorts((labels[i] =='AUX')?'Aux':c2,bus));
				this[c0][c1][c2][labels[i]] = bus;
			}
		} else if (c1 == 'routing' && (c2 == 'AES50A' || c2 == 'AES50B')) {
			var labels = ['1-8','9-16','17-24','25-32','33-40','41-48'];
			for (var i = 0; i < labels.length; i++) {
				var argIndex = (i+1).toString();
				this[c0][c1][c2][labels[i]] = {};
				var bus = this.arg[argIndex]
				// this[c0][c1][c2][labels[i]]['ports'] = busPorts(bus);
				// this[c0][c1][c2][labels[i]]['bus'] = bus;
				this[c0][c1][c2][labels[i]] = bus;
			}
		} else if (c1 == 'routing' && c2 == 'CARD') {
			var labels = ['1-8','9-16','17-24','25-32'];
			for (var i = 0; i < labels.length; i++) {
				var argIndex = (i+1).toString();
				this[c0][c1][c2][labels[i]] = {};
				var bus = this.arg[argIndex]
				// this[c0][c1][c2][labels[i]]['ports'] = busPorts(bus);
				// this[c0][c1][c2][labels[i]]['bus'] = bus;
				this[c0][c1][c2][labels[i]] = bus;
			}
		} else if (c1 == 'routing' && c2 == 'OUT') {
			var labels = ['1-4','5-8','9-12','13-16'];
			for (var i = 0; i < labels.length; i++) {
				var argIndex = (i+1).toString();
				this[c0][c1][c2][labels[i]] = {};
				var bus = this.arg[argIndex]
				// this[c0][c1][c2][labels[i]]['ports'] = busPorts(bus);
				// this[c0][c1][c2][labels[i]]['bus'] = bus;
				// this[c0][c1][c2][labels[i]]['ports'] = busPorts(bus);
				this[c0][c1][c2][labels[i]] = bus;
			}
		} else if (c1 == 'routing' && c2 == 'PLAY') {
			var labels = ['1-8','9-16','17-24','25-32','AUX'];
			for (var i = 0; i < labels.length; i++) {
				var argIndex = (i+1).toString();
				this[c0][c1][c2][labels[i]] = {};
				var bus = this.arg[argIndex]
				// this[c0][c1][c2][labels[i]]['ports'] = busPorts(bus);
				// this[c0][c1][c2][labels[i]]['bus'] = bus;
				this[c0][c1][c2][labels[i]] = bus;
			}
		} else if ((c1 == 'userctrl') 
			   &&  ('ABC'.indexOf(c2) != -1 ) 
			   &&  (typeof c3 === 'undefined')) {
			this[c0][c1][c2]['color'] = toColor(this.arg[1]);
		} else if ((c1 == 'userctrl') 
			   &&  ('ABC'.indexOf(c2) != -1 ) 
			   &&  (c3 == 'enc')) {
			var labels = ['1','2','3','4'];			
			for (var i = 0; i < labels.length; i++) {
				var argIndex = (i+1).toString();
				this[c0][c1][c2][c3][labels[i]] = this.arg[argIndex].replace(/["]+/g, '');
			}
		} else if ((c1 == 'userctrl') 
			   &&  ('ABC'.indexOf(c2) != -1 ) 
			   &&  (c3 == 'btn')) {
			var labels = ['5','6','7','8','9','10','11','12'];			
			for (var i = 0; i < labels.length; i++) {
				var argIndex = (i+1).toString();
				this[c0][c1][c2][c3][labels[i]] = this.arg[argIndex].replace(/["]+/g, '');
			}
		} else if (c1 == 'tape') {
			var labels = ['gainL','gainR','autoplay'];			
			for (var i = 0; i < labels.length; i++) {
				var argIndex = (i+1).toString();
				this[c0][c1][labels[i]] = this.arg[argIndex];
			}
		} else if (c1 == 'amixenable') {
			var labels = ['X','Y'];			
			for (var i = 0; i < labels.length; i++) {
				var argIndex = (i+1).toString();
				this[c0][c1][labels[i]] = this.arg[argIndex];
			}
		} else throw new Error('Invalid command: '+this.line);
	}

	/**
	 * Parse the Channel Commands
	 *
	 * @param      {string}  c0      /config command
	 * @param      {string}  c1      /01 - the channel id
	 * @param      {string}  c2      /config - example sub-command
	 * @param      {string}  c3      Subcommand detail
	 */
	parseChannel(c0,c1,c2,c3) {
		if (c2 == 'config') {
			if (c0 == 'ch' && typeof this['config']['chlink'][c1] != 'undefined' ) 
				this[c0][c1][c2]['linked'] = this['config']['chlink'][c1];
			
			if (c0 == 'auxin' && typeof this['config']['auxlink'][c1] != 'undefined' ) 
				this[c0][c1][c2]['linked'] = this['config']['auxlink'][c1];

			if (c0 == 'fxrtn' && typeof this['config']['fxlink'][c1] != 'undefined' ) 
				this[c0][c1][c2]['linked'] = this['config']['fxlink'][c1];
			
			if (c0 == 'bus' && typeof this['config']['buslink'][c1] != 'undefined' ) 
				this[c0][c1][c2]['linked'] = this['config']['buslink'][c1];

			if (c0 == 'mtx' && typeof this['config']['mtxlink'][c1] != 'undefined' ) 
				this[c0][c1][c2]['linked'] = this['config']['mtxlink'][c1];

			// if (c0 == 'fxrtn') {
			// };
			// if (c0 == 'bus')   {
			// };
			// if (c0 == 'mtx')   {
			// };

			// console.log('here');
			// var labels = ['name','icon','color','source'];
			// for (var i = 0; i < labels.length; i++) {
			// 	var argIndex = (i+1).toString();
			// 	this[c0][c1][labels[i]] = this.arg[argIndex];
			// }
			this[c0][c1][c2]['id'] = c0.toProperCase()+c1;
			this[c0][c1][c2]['name'] = this.arg[1].replace(/["]+/g, '');
			this[c0][c1][c2]['icon'] = this.arg[2];
			this[c0][c1][c2]['color'] = toColor(this.arg[3]);
			if (typeof this.arg[4] != 'undefined' )
				this[c0][c1][c2]['source'] = toSource(this.arg[4]);
		} else if (c2 == 'delay') {
			// winston.debug(this.line);
			var labels = ['on','time'];
			for (var i = 0; i < labels.length; i++) {
				var argIndex = (i+1).toString();
				this[c0][c1][c2][labels[i]] = this.arg[argIndex];
			}

		} else if (c2 == 'preamp') {
			var labels = [];
			// winston.debug(this.line);
			if (c0 == 'mtx') labels = ['preamp']
			else if (c0 == 'ch') labels = ['trim','invert','hpon','hpslope','hpf']
			else if (c0 == 'auxin') labels = ['trim','invert']
			for (var i = 0; i < labels.length; i++) {
				var argIndex = (i+1).toString();
				this[c0][c1][c2][labels[i]] = this.arg[argIndex];
			}
		} else if (c2 == 'gate' && typeof c3 === 'undefined') {			
			// winston.debug(this.line);
			var labels = ['on','mode','thr','range','attack','hold','release','keysrc'];
			for (var i = 0; i < labels.length; i++) {
				var argIndex = (i+1).toString();
				if (labels[i]=='keysrc') {
					this[c0][c1][c2][labels[i]] = toSource(this.arg[argIndex]);
				} else {
					this[c0][c1][c2][labels[i]] = this.arg[argIndex];
				}
			}
		} else if (c2 == 'gate' && c3 == 'filter') {
			// winston.debug(this.line);
			var labels = ['on','type','f'];
			for (var i = 0; i < labels.length; i++) {
				var argIndex = (i+1).toString();
				this[c0][c1][c2][c3][labels[i]] = this.arg[argIndex];
			}
		} else if (c2 == 'dyn' && typeof c3 === 'undefined') {			
			// winston.debug(this.line);
			if (c0 == 'main' || c0 == 'mtx') {
				var labels = ['on','mode','det','env','thr','ratio','knee','mgain','attack','hold','release','pos','mix','auto'];
			} else {
				var labels = ['on','mode','det','env','thr','ratio','knee','mgain','attack','hold','release','pos','keysrc','mix','auto'];
			}
			for (var i = 0; i < labels.length; i++) {
				var argIndex = (i+1).toString();
				if (labels[i]=='keysrc') {
					this[c0][c1][c2][labels[i]] = toSource(this.arg[argIndex]);
				} else {
					this[c0][c1][c2][labels[i]] = this.arg[argIndex];
				}
			}
		} else if (c2 == 'dyn' && c3 == 'filter') {
			// winston.debug(this.line);
			var labels = ['on','type','f'];
			for (var i = 0; i < labels.length; i++) {
				var argIndex = (i+1).toString();
				this[c0][c1][c2][c3][labels[i]] = this.arg[argIndex];

			}

		} else if (c2 == 'insert') {
			var labels = ['on','pos','sel'];
			for (var i = 0; i < labels.length; i++) {
				var argIndex = (i+1).toString();
				this[c0][c1][c2][labels[i]] = this.arg[argIndex];
			}				
		} else if (c2 == 'eq' && typeof c3 === 'undefined') {
			var labels = ['on'];
			for (var i = 0; i < labels.length; i++) {
				var argIndex = (i+1).toString();
				this[c0][c1][c2][labels[i]] = this.arg[argIndex];
			}				
		} else if (c2 == 'eq' && typeof c3 === 'string') {
			var labels = ['type','f','g','q'];
			for (var i = 0; i < labels.length; i++) {
				var argIndex = (i+1).toString();
				this[c0][c1][c2][c3][labels[i]] = this.arg[argIndex];
			}							
		} else if (c2 == 'mix' && typeof c3 === 'undefined') {
			if (c0 == 'mtx') {
				var labels = ['on','fader'];
			} else if (c0 == 'main' && c1 == 'st') {
				var labels = ['on','fader','pan'];			
			} else if (c0 == 'main' && c1 == 'm') {
				var labels = ['on','fader'];			
			} else {
				var labels = ['on','fader','st','pan','mono','mlevel'];
			}
			for (var i = 0; i < labels.length; i++) {
				var argIndex = (i+1).toString();
				this[c0][c1][c2][labels[i]] = this.arg[argIndex];
			}							
		} else if (c2 == 'mix' && typeof c3 === 'string') {
			var labels = parseInt(c3)%2 == 0 ? ['on','level'] : ['on','level','pan','type'];
			// if (parseInt(c2)%2 == 0) var labels = ['on','level','pan','type'];
			for (var i = 0; i < labels.length; i++) {
				var argIndex = (i+1).toString();
				this[c0][c1][c2][c3][labels[i]] = this.arg[argIndex];
			}										
		} else if (c2 == 'grp') {
				this[c0][c1][c2]['dca'] = dcaBitmap(this.arg[1]);
				this[c0][c1][c2]['mute'] = muteBitmap(this.arg[2]);		
		} else if (c2 == 'automix') {
			var labels = ['group','weight'];
			for (var i = 0; i < labels.length; i++) {
				var argIndex = (i+1).toString();
				this[c0][c1][c2][labels[i]] = this.arg[argIndex];
			}							
		} else throw new Error('Invalid Command: '+this.line );
	}

	parseDCA(c0,c1,c2,c3) {
		if (typeof c2 === 'undefined') {
			var labels = ['on','fader'];
			for (var i = 0; i < labels.length; i++) {
				var argIndex = (i+1).toString();
				this[c0][c1][labels[i]] = this.arg[argIndex];
			}							
		} else {
			var labels = ['name','icon','color'];
			for (var i = 0; i < labels.length; i++) {
				var argIndex = (i+1).toString();
				this[c0][c1][labels[i]] = this.arg[argIndex].replace(/["]+/g, '');
			}							
		}
	}

	parseFX(c0,c1,c2,c3) {
		if (typeof c2 === 'undefined') {
			// type
			this[c0][c1]['type']  = this.arg[1];		
		} else if (c2 == 'source') {
			// source
			this[c0][c1][c2]['L']  = this.arg[1];		
			this[c0][c1][c2]['R']  = this.arg[2];		
		} else if (c2 == 'par') {
			// console.log(line);
			// parameters
			for (var i = 1; i <= 64; i++) {
				if (typeof this.arg[i] != 'undefined') 
					this[c0][c1][c2][i.toString()]  = this.arg[i];
			}		
		}
	}

	parseOutput(c0,c1,c2,c3) {
		if (c1 == 'main' && typeof c3 === 'undefined') {
			var labels = ['src','pos','invert'];
			for (var i = 0; i < labels.length; i++) {
				var argIndex = (i+1).toString();
				this[c0][c1][c2][labels[i]] = this.arg[argIndex];
			}							
		} else if (c1 == 'main' && c3 == 'delay') {
			var labels = ['on','time'];
			for (var i = 0; i < labels.length; i++) {
				var argIndex = (i+1).toString();
				this[c0][c1][c2][c3][labels[i]] = this.arg[argIndex];
			}							
		} else if (c1 == 'aux' && typeof c3 === 'undefined') {
			var labels = ['src','pos','invert'];
			for (var i = 0; i < labels.length; i++) {
				var argIndex = (i+1).toString();
				this[c0][c1][c2][labels[i]] = this.arg[argIndex];
			}							
		} else if (c1 == 'p16' && typeof c3 === 'undefined') {
			var labels = ['src','pos','invert'];
			for (var i = 0; i < labels.length; i++) {
				var argIndex = (i+1).toString();
				this[c0][c1][c2][labels[i]] = this.arg[argIndex];
			}							
		} else if (c1 == 'p16' && c3 == 'iQ') {
			var labels = ['group','speaker','eq','model'];
			for (var i = 0; i < labels.length; i++) {
				var argIndex = (i+1).toString();
				this[c0][c1][c2][c3][labels[i]] = this.arg[argIndex];
			}							
		} else if (c1 == 'aes' && typeof c3 === 'undefined') {
			var labels = ['src','pos','invert'];
			for (var i = 0; i < labels.length; i++) {
				var argIndex = (i+1).toString();
				this[c0][c1][c2][labels[i]] = this.arg[argIndex];
			}							
		} else if (c1 == 'rec' && typeof c3 === 'undefined') {
			var labels = ['src','pos'];
			for (var i = 0; i < labels.length; i++) {
				var argIndex = (i+1).toString();
				this[c0][c1][c2][labels[i]] = this.arg[argIndex];
			}							
		} else {
			throw new Error('Invalid Output: '+ this.line);
		}
	}

	parseHeadamp(c0,c1,c2,c3) {
			var labels = ['gain','phantom'];
			var n = parseInt(c1);
			if (n >=0 && n<=31) {
				var n1 = 'XLR'+(n+1).pad().toString();
			} else if (n>= 32 && n<=79) {
				var n1 = 'A'+(n-31).pad().toString();
			} else if (n>=80 && n<=127) {
				var n1 = 'B'+(n-79).pad().toString();
			} else {
				throw new Error('Invalid Headamp: '+this.line)
			}
			for (var i = 0; i < labels.length; i++) {
				var argIndex = (i+1).toString();
				this[c0][n1][labels[i]] = this.arg[argIndex];
			}				
			// this[c0][n1]['id'] = c1;
	}
}

	function commandArgs2Array(text) {
	  const re = /^"[^"]*"$/; // Check if argument is surrounded with double-quotes
	  const re2 = /^([^"]|[^"].*?[^"])$/; // Check if argument is NOT surrounded with double-quotes

	  let arr = [];
	  let argPart = null;

	  text && text.split(" ").forEach(function(arg) {
	    if ((re.test(arg) || re2.test(arg)) && !argPart) {
	      arr.push(arg);
	    } else {
	      argPart = argPart ? argPart + " " + arg : arg;
	      // If part is complete (ends with a double quote), we can add it to the array
	      if (/"$/.test(argPart)) {
	        arr.push(argPart);
	        argPart = null;
	      }
	    }
	  });
	  return arr;
	}

function destmap_bitmap(bitmap) {
	var destmap = {};
	destmap.bitmap = bitmap;
	// Decode bits here TBD
	return destmap;
}

function busPorts(c2,bus) {
	// console.log('BUS:',bus, bus.substring(0,3), bus.substring(3));
	// special case for P16
	var p = c2.toProperCase();
	var n = (c2=='Aux')?1:2;
	// winston.info(p);
	if (bus.substring(0,3) == 'P16') {
		var regexStr = [bus.substring(0,3)+' ', bus.substring(3)];
	} else {
		var regexStr = bus.match(/[A-Z]+|[^A-Z]+/gi);
	}
	var limit = regexStr[1].split('-');
	// console.log(bus, regexStr, limit);
	var start = parseInt(limit[0]);
	var stop  = parseInt(limit[1]);
	var values = {};
	for (var i=start; i <= stop; i++) {
		// values[p+i.toString()] = regexStr[0]+i.toString();
		values[p+i.pad(n).toString()] = regexStr[0]+i.pad().toString();
		// console.log(regexStr[0]+i.toString());
	}
	// console.log(regexStr);
	return values;
}

function toColor(code) {
var on = false;
	if (on) {
		switch (code) {
			case 'RD':  return 'Red';
			case 'RDi': return '(Red)';
			case 'GN':  return 'Green';
			case 'GNi': return '(Green)';
			case 'YE':  return 'Yellow';
			case 'YEi': return '(Yellow)';
			case 'BL':  return 'Blue';
			case 'BLi': return '(Blue)';
			case 'MG':  return 'Magenta';
			case 'MGi': return '(Magenta)';
			case 'CY':  return 'Cyan';
			case 'CYi': return '(Cyan)';
			case 'WH':  return 'White';
			case 'WHi': return '(White)';
			case 'OFF':  return 'Off';
			default: return code;
		}
	} else return code;
}

function toSource(c) {
	var n = parseInt(c);
	if (n == 0) return 'OFF';
	else if (n >= 1 && n <= 32) { 
		return 'In'+n.pad();
	}
	else if (n >= 33 && n <= 38) return 'Aux'+(n-32);
	else if (n = 39 ) return 'USB L';
	else if (n = 40 ) return 'USB R';
	else if (n = 41 ) return 'FX1L';
	else if (n = 42 ) return 'FX1R';
	else if (n = 43 ) return 'FX2L';
	else if (n = 44 ) return 'FX2R';
	else if (n = 45 ) return 'FX3L';
	else if (n = 46 ) return 'FX3R';
	else if (n = 47 ) return 'FX4L';
	else if (n = 48 ) return 'FX4R';
	else if (n >= 49 && n <= 64) return 'Bus'+(n-48).pad();
	else throw new Error('Invalid Source: '+this.line);
}

function dcaBitmap(bitmap) {
	var dca = {};
	var s = '';
	dca.bitmap = bitmap;
	for (var i=1; i <= 8; i++) {
		var c = bitmap.charAt(9-i);
		if (c == '1') {
			dca[i] = 'ON';
			var is = i.toString();
			s = (s.length == 0) ? s.concat(is) : ',' +s.concat(is);
		} else {
			dca[i] = 'OFF'
		};
	} 
	dca.str = (s.length == 0) ? 'None' : s; 
	return dca;
}

function muteBitmap(bitmap) {
	var mute = {};
	var s = '';
	mute.bitmap = bitmap;
	for (var i=1; i <= 6; i++) {
		var c = bitmap.charAt(7-i);
		if (c == '1') {
			var is = i.toString();
			s = (s.length == 0) ? s.concat(is) : ',' +s.concat(is);
			mute[i] = 'ON';
		} else {
			mute[i] = 'OFF';
		}
	} 
	mute.str = (s.length == 0) ? 'None' : s; 
	return mute;
}

module.exports = X32;