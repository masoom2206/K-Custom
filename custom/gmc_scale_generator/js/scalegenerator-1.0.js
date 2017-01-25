	//<![CDATA[
	
	// Scalegenerator 1.0 
	// (C) 2010 GuitarMasterClass.Net
	// Author: Thomas Gradl
	
	// Array enhancement for IE:	
	//This prototype is provided by the Mozilla foundation and
	//is distributed under the MIT license.
	//http://www.ibiblio.org/pub/Linux/LICENSES/mit.license
	
(function ($, Drupal, window, document, undefined) {


// Place your code here.


})(jQuery, Drupal, this, this.document);


        var __PageHostName = (function(){
            var hostname ;
            if (  window.location.host  ) {
                hostname   = window.location.host ;
            } else if ( window.location.hostname ) {
                hostname =  window.location.hostname ;
            } else {
                var _host   = String( window.location.href );
               /^.+?\:\/\/([^\/]+)/.test(_host);
               hostname =  String( RegExp.$1 ) ;
            }
            return hostname ;
        })();
        
	if (!Array.prototype.indexOf)
	{
	  Array.prototype.indexOf = function(elt /*, from*/)
	  {
		var len = this.length;

		var from = Number(arguments[1]) || 0;
		from = (from < 0)
			 ? Math.ceil(from)
			 : Math.floor(from);
		if (from < 0)
		  from += len;

		for (; from < len; from++)
		{
		  if (from in this &&
			  this[from] === elt)
			return from;
		}
		return -1;
	  };
	}
	
	// implement trim()
	if (!String.prototype.trim) {
	
		String.prototype.trim = function () {
			return this.replace(/^\s*/, "").replace(/\s*$/, "");
		}
	
	}

	// get url parameters
	function gup( name )
	{
		name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
		
		var regexS = "[\\?&]"+name+"=([^&#]*)";
		var regex = new RegExp( regexS );
		var results = regex.exec( window.location.href );
		
		if( results == null )
			return "";
		else
			return results[1];
	}
	
	
	notes = Array();
	
	// notes in order to generate the notepool from; 2 octaves needed to be able to generate
	notes[0] = Array ( "C","CS","D","DS","E","F","FS","G","GS","A","AS","B","C","CS","D","DS","E","F","FS","G","GS","A","AS","B" );
	
	// real note names
	notes[1] = Array ( "C","C#","D","D#","E","F","F#","G","G#","A","A#","B" );
	
	// background colors for notes, currently not used
	notes['colors'] = Array ( 
		"blueviolet", 	// C
		"plum",			// C#
		"dodgerblue", 	// D
		"aquamarine",	// D#
		"chartreuse", 	// E
		"chocolate",	// F
		"coral",		// F#
		"yellow",		// G
		"#FFFF66",		// G#
		"crimson",		// A
		"hotpink", 		// A#
		"darkcyan"		// B
	);
	
	// note id matrix tying notename to element ids
	notes['C'] = Array ( "b_1", "a_3", "g_5", "e6_8", "e1_8", "d_10" );
	notes['CS'] = Array ( "b_2", "a_4", "g_6", "e6_9", "e1_9", "d_11" );
	notes['D'] = Array ( "d_0", "b_3", "a_5", "g_7", "e6_10", "e1_10", "d_12" );
	notes['DS'] = Array ( "d_1", "b_4", "a_6", "g_8", "e6_11", "e1_11" );
	notes['E'] = Array ( "e1_0", "e6_0", "d_2", "b_5", "a_7", "g_9", "e6_12", "e1_12" );
	notes['F'] = Array( "e6_1", "e1_1", "d_3", "b_6", "a_8", "g_10" );
	notes['FS'] = Array( "e6_2", "e1_2", "d_4", "b_7", "a_9", "g_11" );
	notes['G'] = Array( "g_0", "e6_3", "e1_3", "d_5", "b_8", "a_10", "g_12" );
	notes['GS'] = Array( "g_1", "e6_4", "e1_4", "d_6", "b_9", "a_11" );
	notes['A'] = Array( "a_0", "g_2", "e6_5", "e1_5", "d_7", "b_10", "a_12" );
	notes['AS'] = Array( "a_1", "g_3", "e6_6", "e1_6", "d_8", "b_11" );
	notes['B'] = Array( "b_0", "a_2", "g_4", "e6_7", "e1_7", "d_9", "b_12" );
	
	strings = Array();
	
	// name of each guitar string, used to generate element ids
	strings[0] = Array(	"e6","a","d","g","b","e1");
	
	// notes on fretboard by notename
	strings[6] = Array( "E","F","FS","G","GS","A","AS","B","C","CS","D","DS","E" );
	strings[5] = Array( "B","C","CS","D","DS","E","F","FS","G","GS","A","AS","B" );
	strings[4] = Array( "G","GS","A","AS","B","C","CS","D","DS","E","F","FS","G" );
	strings[3] = Array( "D","DS","E","F","FS","G","GS","A","AS","B","C","CS","D" );
	strings[2] = Array( "A","AS","B","C","CS","D","DS","E","F","FS","G","GS","A" );
	strings[1] = Array( "E","F","FS","G","GS","A","AS","B","C","CS","D","DS","E" );
	
	
	// numeric scale representations
	scales = Array();
	
	/*
	scales['user'] = Array();
	scales['current'] = Array();
	scales['minor'] = Array( 2,1,2,2,1,2 );
	scales['pentatonic'] = Array( 3,2,2,3 );
	scales['major'] = Array( 2,2,1,2,2,2 );
	scales['major_7_arpeggio'] = Array( 4,3,4 );
	scales['harmonic_minor'] = Array( 2,1,2,2,1,3 );
	scales['test'] = Array( 1,1,1,1,1,1 );
	
	scales['aeolian_mode']=Array(2,1,2,2,1,2);
	scales['algerian_scale']=Array(2,1,3,1,1,3);
	scales['altered_pentatonic_mode']=Array(1,3,3,2);
	scales['arabian_scale']=Array(2,2,1,1,2,2);
	scales['augmented_arpeggio']=Array(4,4);
	scales['augmented_scale']=Array(3,1,3,1,3);
	scales['augmented_fifth_scale']=Array(2,2,1,2,1,1,2);
	scales['balinese_scale']=Array(1,2,4,1);
	scales['bartok_scale']=Array(2,2,2,1,2,1);
	scales['be-bop_scale']=Array(2,2,1,2,2,1,1);
	scales['blues_major_scale']=Array(3,2,1,1,2);
	scales['blues_minor_scale']=Array(3,2,1,1,3);
	scales['blues_mode']=Array(3,2,1,1,2);
	scales['byzantine_scale']=Array(1,3,1,2,1,3);
	scales['chinese_scale']=Array(2,2,3,2);
	scales['chromatic_scale']=Array(1,1,1,1,1,1,1,1,1,1,1);
	scales['diminished_arpeggio']=Array(3,3,3);
	scales['dorian_mode']=Array(2,1,2,2,2,1);
	scales['dorian_sharp_4_mode']=Array(2,1,3,1,2,1);
	scales['dorian_b2_minor_mode']=Array(1,2,2,2,2,2);
	scales['egyptian_scale']=Array(2,3,2,3);
	scales['enigmatic_scale']=Array(1,3,2,2,2,1);
	scales['ethiopian_scale']=Array(2,1,2,2,1,2);
	scales['gypsy_scale']=Array(1,3,1,2,2,1);
	scales['half-whole_scale']=Array(1,2,1,2,1,2,1);
	scales['harmonic_minor_scale']=Array(2,1,2,2,1,3);
	scales['hawaiian_scale']=Array(2,1,2,2,2,2);
	scales['hindu_scale']=Array(2,2,1,2,1,2);
	scales['hirajoshi_scale']=Array(2,1,4,1);
	scales['hungarian_gypsy_scale']=Array(2,1,3,1,1,2);
	scales['hungarian_major_scale']=Array(3,1,2,1,2,1);
	scales['hungarian_minor_scale']=Array(2,1,3,1,1,3);
	scales['ionian_harmonic_mode']=Array(2,1,2,2,1,3);
	scales['ionian_mode']=Array(2,2,1,2,2,2);
	scales['iwato_scale']=Array(1,4,1,4);
	scales['japanese_scale']=Array(1,4,2,1);
	scales['javanese_scale']=Array(1,2,2,2,2,1);
	scales['jazz_minor_mode']=Array(2,1,2,2,2,2);
	scales['jewish_scale']=Array(1,3,1,2,1,2);
	scales['kumoi_scale']=Array(1,4,2,1);
	scales['leading_whole_tone_scale']=Array(2,2,2,2,2,1);
	scales['locrian_mode']=Array(1,2,2,1,2,2);
	scales['locrian_nat_6_mode']=Array(1,2,2,1,3,1);
	scales['locrian_sharp_2_minor_mode']=Array(2,1,2,1,2,2);
	scales['lydian_augmented_minor_mode']=Array(2,2,2,2,1,2);
	scales['lydian_flat_7_minor_mode']=Array(2,2,2,1,2,1);
	scales['lydian_mode']=Array(2,2,2,1,2,2);
	scales['lydian_sharp_2_mode']=Array(3,1,2,1,2,2);
	scales['major_11th_arpeggio']=Array(2,2,1,2,3);
	scales['major_13th_arpeggio']=Array(2,2,1,2,2,1);
	scales['major_7th_major_arpeggio']=Array(4,3,4);
	scales['major_7th_minor_arpeggio']=Array(4,3,3);
	scales['major_9th_arpeggio']=Array(2,2,3,3);
	scales['major_arpeggio']=Array(4,3);
	scales['major_scale']=Array(2,2,1,2,2,2);
	scales['major_sharp_5_mode']=Array(2,2,1,3,1,2);
	scales['melodic_minor_scale']=Array(2,1,2,2,2,2);
	scales['minor_11th_arpeggio']=Array(2,1,2,2,3);
	scales['minor_13th_arpeggio']=Array(2,1,2,2,2,1);
	scales['minor_7th_major_arpeggio']=Array(3,4,4);
	scales['minor_7th_minor_arpeggio']=Array(3,4,3);
	scales['minor_9th_arpeggio']=Array(2,1,4,3);
	scales['minor_arpeggio']=Array(3,4);
	scales['minor_scale']=Array(2,1,2,2,1,2);
	scales['mixolydian_flat_6_minor_mode']=Array(2,2,1,2,1,2);
	scales['mixolydian_mode']=Array(2,2,1,2,2,1);
	scales['mohammedan_scale']=Array(2,1,2,2,1,3);
	scales['mongolian_scale']=Array(2,2,3,2);
	scales['neapolitan_major_scale']=Array(1,2,2,2,2,2);
	scales['neapolitan_minor_scale']=Array(1,2,2,2,1,3);
	scales['oriental_scale']=Array(1,3,1,1,3,1);
	scales['overtone_scale']=Array(2,2,2,1,2,1);
	scales['pelog_scale']=Array(1,2,4,3);
	scales['pentatonic_dominant_mode']=Array(2,2,3,3);
	scales['pentatonic_majeur_mode']=Array(2,2,3,2);
	scales['pentatonic_major_scale_']=Array(2,2,3,2);
	scales['pentatonic_minor_mode']=Array(3,2,2,3);
	scales['pentatonic_minor_scale']=Array(3,2,2,3);
	scales['pentatonic_mode_2']=Array(2,3,2,3);
	scales['pentatonic_mode_3']=Array(3,2,3,2);
	scales['pentatonic_mode_4']=Array(2,3,2,2);
	scales['persian_scale']=Array(1,3,1,1,2,3);
	scales['phrygian_major_mode']=Array(1,3,1,2,1,2);
	scales['phrygian_mode']=Array(1,2,2,2,1,2);
	scales['spanish_8_tone_scale']=Array(1,2,1,1,1,2,2);
	scales['spanish_scale']=Array(1,3,1,2,1,2);
	scales['superlocrian_double_flat_7_mode']=Array(1,2,1,2,2,1);
	scales['superlocrian_minor_mode']=Array(1,2,1,2,2,2);
	scales['whole_tone_scale']=Array(2,2,2,2,2);
	scales['whole-half_scale']=Array(2,1,2,1,2,1,2);
	*/
	
	scales['aeolian_mode']=Array(2,1,2,2,1,2);
	scales['algerian_scale']=Array(2,1,3,1,1,3);
	scales['altered_pentatonic_mode']=Array(1,3,3,2);
	scales['arabian_scale']=Array(2,2,1,1,2,2);
	scales['augmented_arpeggio']=Array(4,4);
	scales['augmented_scale']=Array(3,1,3,1,3);
	scales['augmented_fifth_scale']=Array(2,2,1,2,1,1,2);
	scales['balinese_scale']=Array(1,2,4,1);
	scales['bartok_scale']=Array(2,2,2,1,2,1);
	scales['bebop_scale']=Array(2,2,1,2,2,1,1);
	scales['blues_major_scale']=Array(3,2,1,1,2);
	scales['blues_minor_scale']=Array(3,2,1,1,3);
	scales['blues_mode']=Array(3,2,1,1,2);
	scales['byzantine_scale']=Array(1,3,1,2,1,3);
	scales['chinese_scale']=Array(2,2,3,2);
	scales['chromatic_scale']=Array(1,1,1,1,1,1,1,1,1,1,1);
	scales['diminished_arpeggio']=Array(3,3,3);
    scales['dominant_7th_arpeggio']=Array(4,3,3);
	scales['dorian_mode']=Array(2,1,2,2,2,1);
	scales['dorian_sharp_4_mode']=Array(2,1,3,1,2,1);
	scales['dorian_b2_minor_mode']=Array(1,2,2,2,2,2);
	scales['egyptian_scale']=Array(2,3,2,3);
	scales['enigmatic_scale']=Array(1,3,2,2,2,1);
	scales['ethiopian_scale']=Array(2,1,2,2,1,2);
	scales['gypsy_scale']=Array(1,3,1,2,2,1);
	scales['half-whole_scale']=Array(1,2,1,2,1,2,1);
	scales['harmonic_minor_scale']=Array(2,1,2,2,1,3);
	scales['hawaiian_scale']=Array(2,1,2,2,2,2);
	scales['hindu_scale']=Array(2,2,1,2,1,2);
	scales['hirajoshi_scale']=Array(2,1,4,1);
	scales['hungarian_gypsy_scale']=Array(2,1,3,1,1,2);
	scales['hungarian_major_scale']=Array(3,1,2,1,2,1);
	scales['hungarian_minor_scale']=Array(2,1,3,1,1,3);
	scales['ionian_harmonic_mode']=Array(2,1,2,2,1,3);
	scales['ionian_mode']=Array(2,2,1,2,2,2);
	scales['iwato_scale']=Array(1,4,1,4);
	scales['japanese_scale']=Array(1,4,2,1);
	scales['javanese_scale']=Array(1,2,2,2,2,1);
	scales['jazz_minor_mode']=Array(2,1,2,2,2,2);
	scales['jewish_scale']=Array(1,3,1,2,1,2);
	scales['kumoi_scale']=Array(1,4,2,1);
	scales['leading_whole_tone_scale']=Array(2,2,2,2,2,1);
	scales['locrian_mode']=Array(1,2,2,1,2,2);
	scales['locrian_nat_6_mode']=Array(1,2,2,1,3,1);
	scales['locrian_sharp_2_minor_mode']=Array(2,1,2,1,2,2);
	scales['lydian_augmented_minor_mode']=Array(2,2,2,2,1,2);
	scales['lydian_flat_7_minor_mode']=Array(2,2,2,1,2,1);
	scales['lydian_mode']=Array(2,2,2,1,2,2);
	scales['lydian_sharp_2_mode']=Array(3,1,2,1,2,2);
	scales['major_11th_arpeggio']=Array(2,2,1,2,3);
	scales['major_13th_arpeggio']=Array(2,2,1,2,2,1);
	scales['major_7th_major_arpeggio']=Array(4,3,4);
	//scales['major_7th_minor_arpeggio']=Array(4,3,3);
	scales['major_9th_arpeggio']=Array(2,2,3,3);
	scales['major_arpeggio']=Array(4,3);
	scales['major_scale']=Array(2,2,1,2,2,2);
	scales['major_sharp_5_mode']=Array(2,2,1,3,1,2);
	scales['melodic_minor_scale']=Array(2,1,2,2,2,2);
	scales['minor_11th_arpeggio']=Array(2,1,2,2,3);
	scales['minor_13th_arpeggio']=Array(2,1,2,2,2,1);
    scales['minor_7th_flat_5_arpeggio']=Array(3,3,4);
	scales['minor_7th_major_arpeggio']=Array(3,4,4);
	scales['minor_7th_minor_arpeggio']=Array(3,4,3);
	scales['minor_9th_arpeggio']=Array(2,1,4,3);
	scales['minor_arpeggio']=Array(3,4);
	scales['minor_scale']=Array(2,1,2,2,1,2);
	scales['mixolydian_flat_6_minor_mode']=Array(2,2,1,2,1,2);
	scales['mixolydian_mode']=Array(2,2,1,2,2,1);
	scales['mohammedan_scale']=Array(2,1,2,2,1,3);
	scales['mongolian_scale']=Array(2,2,3,2);
	scales['neapolitan_major_scale']=Array(1,2,2,2,2,2);
	scales['neapolitan_minor_scale']=Array(1,2,2,2,1,3);
	scales['oriental_scale']=Array(1,3,1,1,3,1);
	scales['overtone_scale']=Array(2,2,2,1,2,1);
	scales['pelog_scale']=Array(1,2,4,3);
	scales['pentatonic_dominant_mode']=Array(2,2,3,3);
	scales['pentatonic_majeur_mode']=Array(2,2,3,2);
	scales['pentatonic_major_scale_']=Array(2,2,3,2);
	scales['pentatonic_minor_scale']=Array(3,2,2,3);
	scales['pentatonic_mode_2']=Array(2,3,2,3);
	scales['pentatonic_mode_3']=Array(3,2,3,2);
	scales['pentatonic_mode_4']=Array(2,3,2,2);
	scales['persian_scale']=Array(1,3,1,1,2,3);
	scales['phrygian_major_mode']=Array(1,3,1,2,1,2);
	scales['phrygian_mode']=Array(1,2,2,2,1,2);
	scales['spanish_8_tone_scale']=Array(1,2,1,1,1,2,2);
	scales['spanish_scale']=Array(1,3,1,2,1,2);
	scales['superlocrian_double_flat_7_mode']=Array(1,2,1,2,2,1);
	scales['superlocrian_minor_mode']=Array(1,2,1,2,2,2);
	scales['whole_tone_scale']=Array(2,2,2,2,2);
	scales['wholehalf_scale']=Array(2,1,2,1,2,1,2);
		
	
	
	// left relative coordinate and width for the cage
	cagepositions = Array( 17, 301, 56, 333, 122, 338, 191, 339, 
							263, 339, 333, 340, 404, 338, 475, 337, 546, 340 );	
	
	cagestart = 0; cagewidth = 4; scaleposition = 0; showcage = false;
	
	
	// retrieve a notes name
	function getNoteNameByPos(pos, gstr) {
		return strings[gstr][pos];
	}
	
	function getNoteNameByLayerId(id) {	
		pos = getNotePositionByLayerId(id);
		return getNoteNameByPos(pos[1], pos[0]);
	}
	
	// get the html id for a note
	function getNoteLayerIdByPos(pos, gstr) {
		return strings[0][gstr]+"_"+pos;
	}
	
	// get the name of the next note in the scale
	function getNextNoteName(lastnote, increment) {
		return notes[0][notes[0].indexOf(lastnote)+increment];
	}
	
	// get the position of a note on the board by the html id
	function getNotePositionByLayerId(id) {
		id = id.split("_");
		pos = parseInt(id[1]);

		switch (id[0]) {
			case "e1": 
				gstr=1;
				break;
			case "b":
				gstr=2;
				break;
			case "g":
				gstr=3;
				break;
			case "d":
				gstr=4;
				break;
			case "a":
				gstr=5;
				break;
			case "e6":
				gstr=6;
				break;
			default:
				gstr=0;			
		}
		
		return [gstr, pos];
	}
	
	// get the first occurance of a note on a string, starting at the cagestart
	function searchNote(note, gstring) {
		return strings[gstring].indexOf(note, cagestart);
	}
	
	// determine which notes belong to that scale
	function getNotePool(scale, key) {
		result = Array();
		result[0] = key;
	
		for (x=0; x<scales[scale].length; x++) {
			result[(parseInt(x)+1)] = getNextNoteName(result[x], scales[scale][x]);
		}
		
		return result;
	}
	
	positionMatrix = Array(); // data storage for a position
	fretBoardMatrix = Array(); // data storage for the whole fretboard, currently not used
	
	function resetFretBoardMatrix() {
		for (a=0;a<7;a++) 
			fretBoardMatrix[a] = [ '0','0','0','0','0','0','0','0','0','0','0','0','0' ]; // clear fretboard memory
	}
	
	function resetPositionMatrix() {
		for (a=0;a<7;a++) 
			positionMatrix[a] = []; // clear position memory
	}
	
	// show scale for the determined position, main algorithm for the scalegenerator
	function setScale (scale, key, position, showall) {
		
		
		resetPositionMatrix(); // clear position memory
		
		cagestart = position; // set cagestart;
		
		notepool = getNotePool(scale,key);	// find all notes in that scale
		
		for (gstring = 1; gstring<7; gstring++) {
			
			for (x=0; x<notepool.length; x++) {
				pos = searchNote(notepool[x], gstring); // find current note on fretboard
				if (pos==-1 || pos>cagestart+cagewidth) continue;
				
				// store note
				positionMatrix[gstring].push(pos);			
				
			}
			positionMatrix[gstring].sort(function(a,b){return a-b;}); // sort notes on fretboard
		}
		
		// filter G string for doubles and limit to 2 max
		lastNoteDString = 0; firstNoteGString = 0; lastNoteGString = 0; firstNoteBString = 0;
        
        if (showall!=true) {
		
		if (positionMatrix[3].length > 0 && positionMatrix[4].length > 0) {
			lastNoteDString = positionMatrix[3][positionMatrix[3].length-1];
			firstNoteGString = positionMatrix[4][0];
			
			if (getNoteNameByPos(lastNoteDString,3)==getNoteNameByPos(firstNoteGString,4)) {
				positionMatrix[4].splice(0,1);
			}
		}
		
		if (positionMatrix[4].length > 0 && positionMatrix[5].length > 0) {
			lastNoteGString = positionMatrix[4][positionMatrix[4].length-1];
			firstNoteBString = positionMatrix[5][0];
			
			if (getNoteNameByPos(lastNoteGString,4)==getNoteNameByPos(firstNoteBString,5)) {
				positionMatrix[4].pop();
			}
        }
        }
		
        // removed by Kris to fix problem with last position, example E Ionian (2011-01-07)
		// if (positionMatrix[4].length > 2 && positionMatrix[5].length > 2) positionMatrix[4].pop();
		
		// render position graphically
		for (gstring = 1; gstring<7; gstring++) {
			for (x=0; x<positionMatrix[gstring].length; x++) {
				showNote(strings[0][gstring-1]+"_"+positionMatrix[gstring][x]);	
				if (getNoteNameByPos(positionMatrix[gstring][x],gstring)==key) hightLightNote(strings[0][gstring-1]+"_"+positionMatrix[gstring][x]);
			}
		}
		
	}
	
	// show position
	function showPosition(pos) {
		
		scale = document.getElementById("sel_scales").value;
		key = document.getElementById("sel_keys").value;

		if (key=="key") return;
		if (scale=="scale") return;
		
		if (badpositions[scale] && badpositions[scale][key.toLowerCase()]) {
			//alert (badpositions[scale].indexOf(parseInt(pos)));
		
			if ( badpositions[scale][key.toLowerCase()].indexOf(parseInt(pos)) != -1 ) {
				document.getElementById("showthisposition").checked = false;	
				if (!showbad) return false;
			} else {
				document.getElementById("showthisposition").checked = true;
			}
		} else {
			if (document.getElementById("showthisposition")) {
				document.getElementById("showthisposition").checked = true;
			}
		}
		
		resetBoard();
		setScaleTitle (scale, key, pos);
		setScale (scale, key, pos);	
		return true;
		//setCage (pos);
	}
	     
	// show cage at position
	function setCage(pos) {
		document.getElementById("cage_l").style.left = cagepositions[pos*2]+"px";
		document.getElementById("cage_l").style.visibility = "visible";
		
		document.getElementById("cage_r").style.left = (cagepositions[pos*2]+cagepositions[pos*2+1])+1+"px";
		document.getElementById("cage_r").style.visibility = "visible";
		showcage = true;
	}
	
	// hide cage
	function hideCage() {
		document.getElementById("cage_l").style.visibility = "hidden";
		document.getElementById("cage_r").style.visibility = "hidden";
		showcage = false;
	}
	
	// show title for this scale
	function setScaleTitle (scale, key, pos ) {
	    key3 = key2 = key;
		postr = (pos=="All")?"All Positions":"Position "+(pos+1);
		if (key.length > 1) { 
			key = key.substr(0,1)+"_hash_"; 
			key2 = key.substr(0,1)+"#"; 
			key3 = key.substr(0,1)+" Sharp"; 
		}
		scale = scale.replace(/_/g,"+");
		//if (__PageHostName == 'localhost') __PageHostName = 'guitarmasterclass.net';
		//document.getElementById("scaleinfo").src="http://"+__PageHostName+"/font/+"+key+"+"+scale+"/10/";
		document.getElementById("scaleinfo").src="/font/+"+key+"+"+scale+"/10/";
		scale = scale.replace(/\+/g," ");
		scale = scale.toUpperCase();
		document.getElementById("imagecaption").value=key3+" "+scale/*+" "+postr*/;
	}
	
	// show all positions
	function showAllPositions() {

		scale = document.getElementById("sel_scales").value;
		key = document.getElementById("sel_keys").value;
		if (key=="key") return;
		if (scale=="scale") return;
		
		resetBoard();
		
		for (p=0;p<9; p++) {
			setScale (scale, key, p, true );
		}
		setScaleTitle (scale, key, "All" );
	}
	
	// show first position
	function showPredefined() {
		scale = document.getElementById("sel_scales").value;
		key = document.getElementById("sel_keys").value;
		if(key != "key" && scale != "scale") {
			jQuery.post("/scale/position/", {"scale":scale, "key":key}, function(response) {
				var num = parseInt(response);
				scaleposition = num;
				showPosition(num);
			});
		}
		/*alert("response 2 = "+response)
		scaleposition = 0;
		showPosition(0);*/
		/*scaleposition = 1;
		showPosition(scaleposition);*/
	}
	
	// show next position
	function showNextPosition() {
		scaleposition++;
		if (scaleposition>8) scaleposition=8;
		if (!showPosition(scaleposition) && scaleposition < 8) showNextPosition();
	}
	
	// show previous position
	function showPreviousPosition() {
		scaleposition--;
		if (scaleposition<0) scaleposition=0;
		if (!showPosition(scaleposition) && scaleposition > 0) showPreviousPosition();
	}
	// edit position toggle
	function editPosition(show) {
		if (show) 
			unDeletePosition();
		else
			deletePosition();
	}
	// hide a position
	function deletePosition() {
		scale = document.getElementById("sel_scales").value;
		key = document.getElementById("sel_keys").value;
		if (key=="key") return;
		if (scale=="scale") return;
		
		key = key.toLowerCase();

		if (!badpositions[scale]) badpositions[scale] = Array();
		if (!badpositions[scale][key]) badpositions[scale][key] = Array();
		
		badpositions[scale][key].push(scaleposition);		
	
		// jquery ajax
		
		jQuery.getScript("/scalegenerator/deleteposition/"+scale+"/"+key+"/"+scaleposition );
	}
	// unhide a position
	function unDeletePosition() {
		scale = document.getElementById("sel_scales").value;
		key = document.getElementById("sel_keys").value;
		if (key=="key") return;
		if (scale=="scale") return;
		
		key = key.toLowerCase();
				
		badpositions[scale][key].splice(badpositions[scale][key].indexOf(parseInt(scaleposition)),1);
		
		// jquery ajax
		jQuery.getScript("/scalegenerator/undeleteposition/"+scale+"/"+key+"/"+scaleposition );
	}
	
	// handle click on the fretboard
	function fretClick(n) {
		n = n.substr(3);	
		
		if (document.getElementById(n).style.visibility=="hidden") {			
		
			document.getElementById("imagecaption").value = document.getElementById("sel_keys").value == "key" ? "" : document.getElementById("sel_keys").value;
			
			showNote(n);
		} else { 
			hideNote(n);
		}
		
	}
	
	// display note on fretboard
	function showNote(n) {
		try{
			document.getElementById(n).style.visibility="visible";
			document.getElementById(n).parentNode.style.visibility="visible";
			document.getElementById(n).parentNode.parentNode.style.visibility="visible";		
			pos = getNotePositionByLayerId(n);
			fretBoardMatrix[pos[0]][pos[1]] = "1";
			if ( getNoteNameByPos(pos[1], 7-pos[0])==document.getElementById("sel_keys").value ) hightLightNote(n);
		} catch (e) {
			alert(e+ ": "+n);
		}
	}	
	
	// hide note on fretboard
	function hideNote(n) {
		document.getElementById(n).style.visibility="hidden";
		document.getElementById(n).parentNode.style.visibility="hidden";
		document.getElementById(n).parentNode.parentNode.style.visibility="hidden";
		removeHightLightFromNote(n);
		pos = getNotePositionByLayerId(n);
		fretBoardMatrix[pos[0]][pos[1]] = "0";
	}
	
	// highlight root note
	function hightLightNote(n) {
		document.getElementById(n).style.background = "url(./sites/all/themes/gmc_v2/css/images/root_note_24x22.png) no-repeat 0px 0px";
		pos = getNotePositionByLayerId(n);
		fretBoardMatrix[pos[0]][pos[1]] = "R";
	}
	
	// remove highlight from note
	function removeHightLightFromNote(n) {
		document.getElementById(n).style.background = "none";
	}
	
	// set element opacity
	function setOpacity(n, p) {
		document.getElementById(n).style.opacity = p/100;
		document.getElementById(n).style.msFilter =	"progid:DXImageTransform.Microsoft.Alpha(Opacity="+p+")";
		document.getElementById(n).style.filter = "alpha(opacity="+p+")";
	}
	
	// show all notes of one kind on fretboard, for example, show all C#s
	function showNotes(n) {

		for (x=0;x<13;x++) {
			if(strings[6][x]==n) showNote("e1_"+x);	
			if(strings[5][x]==n) showNote("b_"+x);	
			if(strings[4][x]==n) showNote("g_"+x);	
			if(strings[3][x]==n) showNote("d_"+x);	
			if(strings[2][x]==n) showNote("a_"+x);	
			if(strings[1][x]==n) showNote("e6_"+x);	
		}
	}
	
	// clear the fretboard
	function resetBoard() {
		hideCage();
		cagestart = 0;
		opacity = 100;
		resetFretBoardMatrix();
		for (x=0;x<13;x++) {
			hideNote("e1_"+x); removeHightLightFromNote("e1_"+x); 
			hideNote("b_"+x); removeHightLightFromNote("b_"+x); 
			hideNote("g_"+x); removeHightLightFromNote("g_"+x); 
			hideNote("d_"+x); removeHightLightFromNote("d_"+x);
			hideNote("a_"+x); removeHightLightFromNote("a_"+x); 
			hideNote("e6_"+x); removeHightLightFromNote("e6_"+x);
		}
		document.getElementById("scaleinfo").src="http://"+__PageHostName+"/font/+ /10/";
	}
	// reset key and scale pulldowns
	function resetPullDowns() {
		document.getElementById("sel_keys").selectedIndex = 0;
		document.getElementById("sel_scales").selectedIndex = 0;	
	}	
	// generate the appearance for the notes 
	function createNotes() {
		for (x=0;x<13;x++) {
			
			for (y=0; y<notes[notes[0][x]].length; y++) {	
				document.getElementById(notes[notes[0][x]][y]).src = "http://"+__PageHostName+"/sites/all/themes/gmc_v2/css/images/notes/"+notes[0][x].toLowerCase()+".png";
			}			
		}
	}
	// show image control panel
	function showImageControl() {
		if (document.getElementById("createimagepane").style.display == "none" || document.getElementById("createimagepane").style.display.length == 0) {
			document.getElementById("createimagepane").style.display = "block";
			//document.getElementById("createlinkpane").style.display = "none";
			return;
		} else {
			document.getElementById("createimagepane").style.display = "none";
			return;
		}
	}
	// show url control panel *currently not used*
	function showLinkControl() {
		if (document.getElementById("createlinkpane").style.display == "none" || document.getElementById("createlinkpane").style.display.length == 0) {
			document.getElementById("createlinkpane").style.display = "block";
			document.getElementById("createimagepane").style.display = "none";
			return;
		} else {
			document.getElementById("createlinkpane").style.display = "none";
			return;
		}
	}	
	//create image url	
	function createMatrixURL() {
		url = "";
		for (a=1; a<7; a++) {
			url += strings[0][6-a]+"="
			//url += strings[0][6-a]
			for (b=0; b<13; b++) {
				url = url + fretBoardMatrix[a][b];
			}
			if (a<6) url += "&";
			//if (a<6) url += "_";
		}
		return url;
	}
	// clean image caption
	function sanitizeCaption() {
		document.getElementById("imagecaption").value = document.getElementById("imagecaption").value.replace(/[^a-z 0-9]+/gi,'');
	}
	// create image filename
	function createFileName() {
		caption = document.getElementById("imagecaption").value;
		filename="gmcscale_";
		filename+= caption.trim().toLowerCase().replace(/\s/g,"_")+"_";
		filename+= createMatrixURL().replace(/&/g,"_").replace(/=/g,"");
		filename+= showcage ? "_cage_"+scaleposition : "";
		filename+= ".jpg";
		return filename;
	}
	// get document directory
	function getDocumentDirectory() {
		path = "";
		dir = document.location.href.split("/");
		for (a=0;a<dir.length-1; a++) {
			path+=dir[a];
			path+="/";
		}
		return path;
	}
	// show preview image
	function showPreviewImage() {
		document.getElementById("generatedimage").style.display="inline";
		document.getElementById("previewimage").value = "Hide preview";
		document.getElementById("previewimage").setAttribute("onClick","hidePreviewImage();");
		document.getElementById("previewimage").onclick = hidePreviewImage;
	}
	// hide preview image
	function hidePreviewImage() {
		document.getElementById("generatedimage").style.display="none";
		document.getElementById("previewimage").value = "Preview";
		document.getElementById("previewimage").setAttribute("onClick","showPreviewImage();");
		document.getElementById("previewimage").onclick = showPreviewImage;
	}	
	// create image and urls
	function createImage() {
		var domain =  __PageHostName ;
		url = "http://"  + domain + "/sites/default/files/generatescaleimage/scales/"+createFileName();
		caption = document.getElementById("imagecaption").value;
		//url = "http://"  + domain + "/generatescaleimage?"+createMatrixURL()+"&showcage="+showcage+"&cageposition="+scaleposition+"&caption="+caption;
		
		//document.getElementById("previewimage").setAttribute("onClick","window.open('"+url+"','Scale Preview')");
		document.getElementById("imageurl").value = url;
		document.getElementById("imagehtml").value = '<a href="http://' + __PageHostName + '/scalegenerator" target="_new" title="GMC Scalegenerator"><img src="'+url+'" width="883px" height="200px" border="0px" alt="'+caption+'" /></a>';
		document.getElementById("imagebbcode").value = "[url=http://" + __PageHostName + "/scalegenerator][img]"+url+"[/img][/url]";
		document.getElementById("generatedimage").src = "/generatescaleimage?"+createMatrixURL()+"&showcage="+showcage+"&cageposition="+scaleposition+"&caption="+caption;
	}	
	// not used placeholder
	function createLink() {
		alert("index.php?"+createMatrixURL()+"&showcage="+showcage+"&cageposition="+scaleposition);
	}	
	// initialize scalegenerator
	function initSG() {
		resetBoard();
		createNotes();
	}
	
	//]]>
	