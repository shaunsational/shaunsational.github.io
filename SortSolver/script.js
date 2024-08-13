const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

function delegate_event(event_type, ancestor_element, target_element_selector, listener_function) {
	ancestor_element.addEventListener(event_type, function(event) {
		if (event.target && event.target.matches && event.target.matches(target_element_selector)) {
			(listener_function)(event);
		}
	});
}

class GuessColors {
	constructor(debug=false) {
		this.segments = parseInt($('#segments').value);
		this.debug = debug;
		this.guesses = new Map();
		this.puzzle = false;
		
		updateAllBlockCounts();
		let remaining = [];
		for (let c in segmentCounts) {
			if (segmentCounts[c] > 0) {
				if (segmentCounts[c] < segments) {
					for (let x = segments - segmentCounts[c]; x > 0; x--){
						remaining.push(c);
					}
				}
			}
		}
		this.colorsLeft = remaining.reverse();
		this.maxLength = remaining.length;
		
		if (this.debug) {
			this.getSolutions(this.deepCopy(this.colorsLeft));
		}
		return this;
	}

	getSolutions() {
		this.bruteForce(this.deepCopy(this.colorsLeft));
		this.guesses = Array.from(this.guesses);
	}
	
	bruteForce(colorsLeft, _first=[]) {
		if (_first.length + colorsLeft.length > this.maxLength) {
			console.log('DANGER WILL ROBINSON!!!! MAX LENGTH HAS BEEN EXCEEDED:', this.maxLength);
			return false;
		} else {
			let max = colorsLeft.length;
			let modArray = this.deepCopy(colorsLeft);

			for (let x = 0; x <= max - 1; x++) {
				let _second = [];
					_second.push(modArray.pop());
				
				if (_first.length + _second.length + modArray.length === this.maxLength) {

					//if (_first.length < 3) {
					/******************    PERMUTATIONS   ************************
					**	I was going to attempt to calculate all the remaining	**
					**	permutations, but I think most people will abuse this	**
					**	and I dont want to bog down their computer so this		**
					**	should suffice for now, as they reveal more they can	**
					**	update the color blocks and try again. 					**
					**															**
				   /**/	  this.bruteForce(modArray, [..._first, ..._second]);  /**
					**															**
					**************************************************************/
					//}

					let guess = [..._first, ..._second, ...modArray];
					this.guesses.set(guess.join(''), guess);
				}
				modArray = [..._second, ...modArray];
			}
		}
		return true;
	}
	
	iterate(pass=false, start=0) {
		// LOOP THROUGH EACH BRUTE FORCE ATTEMPT UNTIL PUZZLE CAN BE SOLVED
		// this.attempt(X)
		
		// add permutation count to confirm

		if (this.debug || pass) 
		{
			let solution = [];
			try {
				if (!this.debug) {
					this.getSolutions(this.deepCopy(this.colorsLeft));
				}

				$('#progress progress').setAttribute('max', this.guesses.length);
				$('#progress #solutions').innerHTML = this.guesses.length;
				$('#progress').showModal();

				for (const guess in this.guesses) {
					if (guess < start) {
						continue;
					}

					$('#progress #solX').innerHTML = parseInt(guess) + 1;
					$('#progress progress').setAttribute('value', this.guesses.length - guess);

					let attempt = this.attempt(guess);
					if (attempt.length > 0) {
						//console.log('Attempt #'+ guess +' should work if I\'ve guessed correctly, if not it will at least unlock more known colors, which you can update and attempt again.', this.guesses[guess]);
						solution = attempt;
						break;
					}
				}
			} catch (error) {
				modal('alert', getString("noMemory"), getString("sorry"));
				console.error(error);
			}	
			$('#progress').close();
			return solution;
		}
	}
	
	undo() {
		//console.log('attempt of', this.guesses.length);
		let unknown = $$('.segment[data-guess]');
		unknown.forEach((el, i) => {
			el.removeAttribute('data-guess');
			el.setAttribute('data-node', '');
		});
	}
	
	attempt(x=0) {
		this.undo();

		let unknown = $$('.vial:not(.empty) .segment[data-node=""]');

		unknown.forEach((el, i) => {
			el.setAttribute('data-guess', true);
			el.setAttribute('data-node', this.guesses[x][0][i]); // << need to access map propery instead of array key
		});
		
		puzzle = new Puzzle(readVials(), this.segments);
		solution = puzzle.solve(puzzle);

		return solution;
	}
	
	deepCopy(input) {
		return JSON.parse(JSON.stringify(input));
	}
}

function createVial(segments, empty) {
	let vial = document.createElement('div');
	vial.classList.add('vial');
	if(empty) vial.classList.add('empty');
	
	let segment = document.createElement('div');
	segment.classList.add('segment');
	segment.setAttribute('data-node', '');
	
	let i=0;
	while(i < segments){
		vial.append(segment.cloneNode(true)); i++;
	}
	$('#colors').append(vial);
}

function readVials() {
	let vials = [];
	document.querySelectorAll('#colors .vial').forEach(v => {
		let vial = [];
		let s = v.querySelectorAll('.segment');
		Array.from(s).reverse().forEach(s => {
			if(s.dataset.node != '')
			vial.push(s.dataset.node);
		});
		vials.push(vial);
	});
	return vials;
}

async function s1() {
	puzzle = null;
	let vials = document.querySelectorAll('#colors .segment[data-node]:not([data-node=""])');
	if (vials.length == 0 || await modal('confirm', getString("resetColors"))) {
		$('#colors').innerHTML = '';
		toPage('s1');
		return true;
	}
	return false;
}

let segments;
function s2() {	
	let vials = $('#vials').value;
	let empty = $('#empty').value;
	let filled = vials - empty;
	segments = $('#segments').value;
	
	if (vials == 0) {
		/* JUST TO DEBUG SOLVING, I DONT WANT TO INPUT THIS EVERY TIME
		return true; 
		/*/ 
		modal('alert', getString("noVialsSet"), getString('error'));
		return false;//*/
	}
	if (parseInt(empty) >= parseInt(vials)) {
		modal('alert', getString("moreEmptyVials"), getString('error'));
		return false;
	}
	if ($('#colors').innerHTML == '') {
		let i=0;
		while(i < filled) {
			createVial(segments, false); i++;
		}
		i=0;
		while(i < empty) {
			createVial(segments, true); i++;
		}
	}
	toPage('s2');
	return true;
}

function permutation(n, r) { 
	if (n < r) return -1 

	let result = n 
	for (let i = 1; i < r; i++)  
		result *= n - i; 

	return result 
} 

let puzzle, solution, lastStep;
async function s3() {
	if (solvePuzzle() == true) {
		// ALL VIALS ARE FILLED AND A SOLUTION WAS FOUND
		toPage('s3');
		return true; 
	}

	let attemptToSolve = new GuessColors();
	if (attemptToSolve.colorsLeft.length == 0 && attemptToSolve.guesses.length > 0) {
		// TODO - FIGURE OUT WHAT THIS CASE IS. NO MISSING COLORS, BUT THERE IS A GUESS???
		toPage('s3');
		return true;
	} else {
		let permutations = permutation(attemptToSolve.colorsLeft.length, attemptToSolve.colorsLeft.length);
		let confirm = await modal('confirm', getString("drStrange", [permutations, '<br /><br />', '<br /><br />']) );

		if (permutations <= 5040 && !confirm) {
			return false;
		}
		else if (permutations > 5040 && !confirm) {
			modal('alert', getString("tooManySolutions"), getString('sorry'));
		} 
		else if (confirm) {
			let solution = await attemptToSolve.iterate(true);
			if (typeof(solution) !== 'undefined' && solution.length > 0) {
				// NOT ALL VIALS ARE FILLED BUT THERE IS A POSSIBLE SOLUTION
				solvePuzzle();
				toPage('s3');
				return true;
			}
		} else {
			modal('alert', getString("noSolution"), getString('sorry'));
		}
	}
	return false;
}

function solvePuzzle() {
	puzzle = new Puzzle(readVials(), parseInt($('#segments').value));
	solution = puzzle.solve(puzzle);
	if (solution.length > 1) {
		console.log(solution);
		if ($('#solution').innerHTML == '') {
			let vials = $('#colors').cloneNode(true);
			$('#solution').innerHTML = vials.innerHTML.replaceAll('vial empty', 'vial');
			$('#current-step').setAttribute('data-step', 0);
			$('#current-step').innerHTML = '1 / '+ solution.length;
		}
		lastStep = solution.length - 1;
		renderStep(0);
		return true;
	}
	return false;
}

function renderVial(key) {	
	let vial = document.createElement('div');
	vial.classList.add('vial');	
	
	key.split('').reverse().forEach( s => {
		let segment = document.createElement('div');
		segment.classList.add('segment');
		segment.setAttribute('data-node', s);
		vial.append(segment);
	});
	return vial;
}

function renderStep(step=0) {
	$('#current-step').setAttribute('data-step', step);
	$('#current-step').innerHTML = (step + 1) +' / '+ solution.length;
	if (step-1 < 0) { $('#prev-step').setAttribute('disabled', 'disabled'); } else { $('#prev-step').removeAttribute('disabled'); }
	if (step+1 > lastStep) { $('#next-step').setAttribute('disabled', 'disabled'); } else { $('#next-step').removeAttribute('disabled'); }

	$('#solution').innerHTML = '';
	solution[step].forEach(v => {
		$('#solution').append(renderVial(v));
	});
}

function browse(dir) {
	let old = parseInt($('#current-step').getAttribute('data-step'));
	step = old + dir;
	if (step >= 0 && step <= lastStep)
	{
		renderStep(step);
	}
}

let segmentCounts = {};
function updateBlockCount(sR) {
	let sC = $$('#colors .segment[data-node="'+ sR +'"]').length;
	if (sC > 0) {
		$('dialog .colorBlock[data-node="'+ sR +'"]').setAttribute('data-count', sC);
		segmentCounts[sR] = sC;	
	}
	return sC;
}

function updateAllBlockCounts(r) {
	segmentCounts = {};
	$$('#colorPicker .colorBlock').forEach(cB => { cB.removeAttribute('data-count'); });
	let all = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
	for (const sR of all) {
		let count = updateBlockCount(sR);
		if (count > 0)
			$('#colorPicker .colorBlock[data-node="'+ sR +'"]').setAttribute('data-count', count);
	}
	return segmentCounts[r];
}

async function modal(type, text, title) {
	type = type || "alert";
	title = title || getString('modalTitle');
	text = text || getString('modalText');
	const dialog = new modalDialog({
		"type": type,
		"title": title,
		"text": text
	});
	let result = await dialog._result();
	return result;
}

class modalDialog {
	constructor({type, text, title}) {
		this.dialog = $('#confirmModal');
		this.trueButton = $('#confirmModal .actions button:first-child');
		this.falseButton = $('#confirmModal .actions button:last-child');
		this.__true; this.__false;

		$('#modalText').innerHTML = text;
		$('#modalTitle').innerHTML = title;

		this._open(type);
	}

	_result() {
		return new Promise((resolve, reject) => {
			this.dialog.showModal();
			this.falseButton.focus();

			this.__false = () => { resolve(false); this._close(); }
			this.falseButton.addEventListener("click", this.__false, { once: true });

			this.__true = () => { resolve(true); this._close(); }
			this.trueButton.addEventListener("click", this.__true, { once: true });
		});
	}

	_open(type) {
		$('#confirmModal').classList.add(type);
		this.dialog.showModal();
	}

	_close() {
		this.dialog.close();
		this.trueButton.removeEventListener('click', this.__true);
		this.falseButton.removeEventListener('click', this.__false);
		$('#confirmModal').classList.remove('alert');
		$('#confirmModal').classList.remove('confirm');
	}
}

let colorPicker = $('#colorPicker');
let targetSegment;
delegate_event('click', document, '.vial:not(.empty) .segment', function(e){
	targetSegment = e.target;
	colorPicker.showModal();
});

delegate_event('click', document, 'dialog:not(.colorBlock)', function(e){
	colorPicker.close();
});

function fullVials() {
	return $$('.vial:not(.empty) .segment[data-node=""]').length === 0;
}

function toPage(page) {
	$('#'+ page).scrollIntoView({
		behavior: 'smooth'
	});
}

class StorageModule {
	get(key, ifNull) {
		return localStorage.getItem(key) || ifNull;
	}

	set(key, value) {
		localStorage.setItem(key, value)
	}
}
let store = new StorageModule();
let lang = new URLSearchParams(location.search).get('lang') || store.get('lang', 'en-US');
window.addEventListener("load", (event) => {
	let i18n = $('#language').i18n({
		language:{
			"en-US": "English",
			"it-IT": "Italiano",
			"es-ES": "Español",
			"de-DE": "Deutsch",
			"ja-JP": "日本語",
			"fr-FR": "Français",
			"ru-RU": "Русский"
		},
		current: lang,
		callback: ((e)=>{
			let newLang = e.target.dataset['lang'];
			if (e.target.nodeName !== "DIV") {
				newLang = e.target.parentElement.dataset['lang']
			}
			$('#language').classList.remove('open');
			$('#language').setAttribute('data-current', newLang);
			store.set('lang', newLang);
			lang = newLang;
			setHTMLStrings();
		})
	});
	setHTMLStrings();
	$('#s1').scrollIntoView({
		behavior: 'smooth'
	});
	
	// TODO - count colors chosen already and hide from selection? or just warn user?
	delegate_event('click', document, '#colorPicker .colorBlock', function(e){
		targetSegment.setAttribute('data-node', e.target.dataset.node);
		let count = updateAllBlockCounts(e.target.dataset.node);
		/*
		let count = updateBlockCount(e.target.dataset.node);
		
		e.target.setAttribute('data-count', count);
		*/
		if(count == segments) {
			e.target.disabled = 'disabled';
		}
		if(fullVials()) {
			$('a.nav[href="#s3"]').classList.add('solve');
		}
		colorPicker.close();
	});	


	document.addEventListener('keydown', function(e) {
		if(document.body.className == 's3') {
			if (e.keyCode == '37') {
				browse(-1);				
			}
			if (e.keyCode == '39') {
				browse(+1);				
			}
		}
	});
	
	var navLinks = document.getElementsByClassName('nav');
	for (let a of navLinks) {
		a.addEventListener('click', async function(e) {
			e.preventDefault();
			let func = this.getAttribute('href').substr(1);
			window[func].call(this);
		});
	}
});