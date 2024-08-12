let strings = {
	"en-US": {
		"noVialsSet": "I need to know how many vials there are.",
		"moreEmptyVials": "There cannot be the same amount or more empty vials than there are vials.",
		"manyGuesses": "If you have too many unknown fields this could potentially crash your computer/phone and require you to restart it, as the processing is handled by YOUR device.\nAs far as I know there is no harmful permanent damage that can be done to your device.\n\nDo you wish to continue?",
		"noMemory": "I ran out of memory looking for a solution, uncover more colors and try again.",
		"noSolution": "No solution found, check your colors and try again.",
		"tooManySolutions": "Too many possible solutions, I will probably crash your device trying to find a solution.",
		"drStrange": "There are %% possible answers, do you want to try? your device could crash.",
		"resetColors": "Are you sure, you will lose any colors currently set?",

		"colorSegments": "Color<br />Segments",
		"totalVials": "Total<br />Vials",
		"emptyVials": "Empty<br />Vials",

		"colors": "COLORS",
		"reset": "RESET",
		"attempt": "ATTEMPT",
		"solution": "SOLUTION",
		"back": "Back",
		"next": "Next"
	},
	"it-IT": {
		"noVialsSet": "Ho bisogno di sapere quante fiale ci sono.",
		"moreEmptyVials": "Non possono esserci fiale vuote in numero uguale o superiore alle fiale presenti.",
		"manyGuesses": "Se hai troppi campi sconosciuti, il tuo computer/telefono potrebbe bloccarsi e dovresti riavviarlo, poiché l'elaborazione è gestita dal TUO dispositivo.\nPer quanto ne so, non ci sono danni permanenti che potrebbero essere arrecati al tuo dispositivo.\n\nVuoi continuare?",
		"noMemory": "Ho esaurito la memoria cercando una soluzione, ho scoperto altri colori e ho riprovato.",
		"noSolution": "Nessuna soluzione trovata, controlla i colori e riprova.",
		"tooManySolutions": "Troppe soluzioni possibili, probabilmente farò crashare il tuo dispositivo nel tentativo di trovare una soluzione.",
		"drStrange": "Ci sono %% possibili risposte, vuoi provare? Il tuo dispositivo potrebbe bloccarsi.",
		"resetColors": "Sei sicuro che perderai tutti i colori attualmente impostati?",

		"colorSegments": "Colore<br />Segmenti",
		"totalVials": "Totale<br />Fiale",
		"emptyVials": "Fiale<br />vuote",

		"colors": "COLORI",
		"reset": "RESET",
		"attempt": "TENTATIVO",
		"solution": "SOLUZIONE",
		"back": "INDIETRO",
		"next": "PROSSIMO"
	}
}

let lang = "en-US";
function getString(key, replacements=[]) {
	let string = '';
	if (!strings.hasOwnProperty(lang) || !strings[lang].hasOwnProperty(key)) { string = strings['en-US'][key]; }
	else { string = strings[lang][key]; }

	for (let i=0; i < replacements.length; i++) {
		string = string.replace('%%', replacements[i]);
	}
	return string;
}
function setHTMLStrings() {
	$('.txtColorSegments').innerHTML = getString("colorSegments");
	$('.txtTotalVials').innerHTML = getString("totalVials");
	$('.txtEmptyVials').innerHTML = getString("emptyVials");

	$('.txtColors').innerHTML = getString("colors");
	$('.txtReset').innerHTML = getString("reset");
	$('a[href="#s3"]').dataset.attempt = getString("attempt");
	$('.txtSolution').innerHTML = getString("solution");
	$('.txtBack').innerHTML = getString("back");
	$('.txtNext').innerHTML = getString("next");
}