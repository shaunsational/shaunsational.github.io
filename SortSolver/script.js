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
			//this.bruteForce(this.deepCopy(this.colorsLeft));
			this.getSolutions(this.deepCopy(this.colorsLeft));
		}
		console.log(this);
		return this;
	}

	getSolutions() {
		const futures = new Promise((resolve, reject) => {
			resolve(this.bruteForce(this.deepCopy(this.colorsLeft)));
		}).then((value) => {
			this.guesses = Array.from(this.guesses);
		});
		return futures;
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
			//this.guesses = Array.from(this.guesses);
		}
		return true;
	}
	
	iterate(start=0) {
		// LOOP THROUGH EACH BRUTE FORCE ATTEMPT UNTIL PUZZLE CAN BE SOLVED
		// this.attempt(X)
		
		// add permutation count to confirm

		if (this.debug || confirm('If you have too many unknown fields this could potentially crash your computer/phone and require you to restart it, as the processing is handled by YOUR device.\nAs far as I know there is no harmful permanent damage that can be done to your device.\n\nDo you wish to continue?')) 
		{			
			try {
				// BRUTE FORCE!!!
				if (!this.debug) {
					//this.bruteForce(this.deepCopy(this.colorsLeft));
					this.getSolutions(this.deepCopy(this.colorsLeft));
				}

				// modal that updates text with "Attempting guess X / GUESSES 
				$('#progress progress').setAttribute('max', this.guesses.length);
				$('#progress #solutions').innerHTML = this.guesses.length;
				$('#progress').showModal();

				for (const guess in this.guesses) {
					if (guess < start) {
						continue;
					}

					$('#progress #solX').innerHTML = parseInt(guess) + 1;
					$('#progress progress').setAttribute('value', this.guesses.length - guess);

					if (this.attempt(guess).length > 0) {
						console.log('Attempt #'+ guess +' should work if I\'ve guessed correctly, if not it will at least unlock more known colors, which you can update and attempt again.', this.guesses[guess]);
						break;
					}
				}			
			} catch (error) {
				alert('I ran out of memory looking for a solution, uncover more colors and try again');
				console.error(error);
			}	
			$('#progress').close();
		}		
		
			
	}
	
	undo() {
		console.log('attempt of', this.guesses.length);
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
	
	modalConfirm() {
		
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

function s1() {
	puzzle = null;
	let vials = document.querySelectorAll('#colors .segment[data-node]:not([data-node=""])');
	if (vials.length == 0 || confirm("Are you sure, you will lose any colors currently set?")) {
		$('#colors').innerHTML = '';
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
		alert('I need to know how many vials there are.');
		return false;//*/
	}
	if (parseInt(empty) >= parseInt(vials)) {
		alert('There cannot be the same amount or more empty vials than there are vials.');
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
	return true;
}

let puzzle, solution, lastStep;
function s3() {
	puzzle = new Puzzle(readVials(), parseInt($('#segments').value));
	solution = puzzle.solve(puzzle);
	console.log(solution);
	if (solution.length > 1) {
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
	alert('No solution found, check your colors and try again');
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
	renderStep(step);
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


/*
const image = document.querySelector("img");
const newCatButton = document.querySelector(".js-new-cat");

newCatButton.addEventListener("click", async () => {
  const dialog = new ConfirmDialog({
    trueButtonText: "Yes!",
    falseButtonText: "Noo",
    questionText: "Are you sure you want to see yet another picture of a cat?" });


  const shouldFetchNewImage = await dialog.confirm();
  if (shouldFetchNewImage) {
    image.src = `https://cataas.com/cat?width=400&height=300&timestamp=${Date.now()}`;
  }
});

*/

// TODO attach s1() and s3() to modal events for clearing the colors and doing the iteration if guessing
class ConfirmDialog {
	constructor({ questionText, trueButtonText, falseButtonText, parent }) {
		this.questionText = questionText || "Are you sure?";
		this.trueButtonText = trueButtonText || "Ok";
		this.falseButtonText = falseButtonText || "Cancel";
		this.parent = parent || document.body;

		this.dialog = undefined;
		this.trueButton = undefined;
		this.falseButton = undefined;

		this._createDialog();
		this._appendDialog();
	}

	confirm() {
		return new Promise((resolve, reject) => {
			const somethingWentWrongUponCreation = !this.dialog || !this.trueButton || !this.falseButton;
			if (somethingWentWrongUponCreation) {
				reject('Someting went wrong when creating the modal');
				return;
			}

			this.dialog.showModal();
			this.falseButton.focus();

			this.trueButton.addEventListener("click", () => {
				resolve(true);
				this._destroy();
			});

			this.falseButton.addEventListener("click", () => {
				resolve(false);
				this._destroy();
			});
		});
	}

	_createDialog() {
		this.dialog = document.createElement("dialog");
		this.dialog.classList.add("confirm-dialog");

		const question = document.createElement("div");
		question.textContent = this.questionText;
		question.classList.add("confirm-dialog-question");
		this.dialog.appendChild(question);

		const buttonGroup = document.createElement("div");
		buttonGroup.classList.add("confirm-dialog-button-group");
		this.dialog.appendChild(buttonGroup);

		this.falseButton = document.createElement("button");
		this.falseButton.classList.add(
		"confirm-dialog-button",
		"confirm-dialog-button--false");

		this.falseButton.type = "button";
		this.falseButton.textContent = this.falseButtonText;
		buttonGroup.appendChild(this.falseButton);

		this.trueButton = document.createElement("button");
		this.trueButton.classList.add(
		"confirm-dialog-button",
		"confirm-dialog-button--true");

		this.trueButton.type = "button";
		this.trueButton.textContent = this.trueButtonText;
		buttonGroup.appendChild(this.trueButton);
	}

	_appendDialog() {
		this.parent.appendChild(this.dialog);
	}

	_destroy() {
		this.parent.removeChild(this.dialog);
		delete this;
	}
}








let confirmModal = $('#confirm');
function promptConfirm(msg, fn) {
	$('#confirm p').innerHTML = msg;
	confirmModal.showModal();
	$('#confirm .confirm').addEventListener('click', fn, { once: true });
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

window.addEventListener("load", (event) => {
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
	
	var navLinks = document.getElementsByClassName('nav');
	for (let a of navLinks) {
		a.addEventListener('click', function(e) {
			e.preventDefault();
			let func = this.getAttribute('href').substr(1);
			
			if (window[func].call(this)) {
				$('#'+ func).scrollIntoView({
					behavior: 'smooth'
				});
			}
		});
	}
});