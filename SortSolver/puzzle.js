"use strict";

class Puzzle {
	constructor(vials, segments) {
		this.vials = [];
		this.segments = segments;
		
		this.reset(vials, segments)
	}

	reset(vials, segments) {
		for (const v of vials) {
			this.vials.push(new Vial(v, segments));
		}
	}
	
	deepcopy() {
		const segments = this.segments;
		const vials = [];
		for (const v of this.vials) {
			vials.push(v.getItems());
		}
		return new Puzzle(vials, segments);
	}
	
	isLegalMove(orig, dest) {
		if (orig === dest) return false;
		let from = this.vials[orig];
		let to = this.vials[dest];
		
		let full = to.full();
		if (full)
			return false;
		
		let empty = from.empty(), solved = from.solved();
		if (empty || solved) 
			return false;
		
		if (to.empty()) {
			// Not illegal, but moving monocolor stack into empty makes no progress.
			return from.monocolor() ? false : true;
		}
		
		// Not illegal, but moving monocolor 3-stack makes no progress.
		let missing = from.missingOne();
		if (missing) 
			return false;
		
		let f1 = from.top(), t1 = to.top();
		if (f1 !== t1)
			return false;
		
		return true;
	}
	
	getLegalMoves(state) {
		const legal_moves = []; // [from, to]
		for (let orig = 0; orig < this.vials.length; orig++) {
			for (let dest = 0; dest < this.vials.length; dest++) {
				if (this.isLegalMove(orig, dest)) {
					legal_moves.push([orig, dest]);
				}
			}
		}
		return legal_moves;
	}
	
	move(orig, dest) {
		while (this.isLegalMove(orig, dest)) {
			this.vials[dest].push(this.vials[orig].pop());
		}
	}
	
	solve(initial_state) {
		// TODO: Implement a more optimal algorithm than depth-first-search.
		const stack = [initial_state];
		const visited = new Set([initial_state.getKey()]);
		const parent = new Map();
		while (stack.length > 0) {
			
			
			let current_state = stack.pop();
			if (current_state.solved()) {
				let current_key = current_state.getKey();
				const steps = [];
				while (current_key !== initial_state.getKey()) {
					steps.push(current_key.split('|'));
					current_key = parent.get(current_key);
				}
				steps.push(initial_state.getKey().split('|'));
				return steps.reverse();
			}
			for (const move of current_state.getLegalMoves().reverse()) {
				const new_state = current_state.deepcopy();
				new_state.move(move[0], move[1]);
				let nK = new_state.getKey();
				if (!visited.has(nK)) {
					stack.push(new_state);
					parent.set(nK, current_state.getKey());
					visited.add(nK);
				}
			}
			
			
			/*
			let current_state = stack.pop();
			if (current_state.solved()) {
				
				let current_key = current_state.getKey();
				const steps = [this.keyToStacks(current_key)];
				while (current_key !== initial_state.getKey()) {
					steps.push(this.keyToStacks(parent[current_key]));
					current_key = parent[current_key];
				}
				return steps.reverse();
				
				
				parent[current_state.getKey()] = '';
				
				let temp ='', steps = [];
				for(var step in parent) {
					steps.push({key:step, move:temp});
					temp = parent[step];
				}
				return steps;
			}
			for (const move of current_state.getLegalMoves()) {
				const new_state = current_state.deepcopy();
				new_state.move(move[0], move[1]);
				let nK = new_state.getKey();
				if (!visited.has(nK)) {
					stack.push(new_state);
					parent[new_state.getKey()] = [move[0], move[1]];
					visited.add(nK);
				}
			}
			*/
		}
		return [];
	}
	
	solved() {
		return this.vials.every(v => v.solved() || v.empty());
	}
	
	///// KEY FUNCTIONS
	
	getKey() {
		return this.vialsToKey(this.vials);
	}
	
	vialsToKey() {
		const key = [];
		for (const vial of this.vials) {
			key.push(vial.toString());
		}
		return key.join("|");
	}
	
	keyToStacks(key) {
		const vials = [];
		for (const split of this.getKey().split("|")) {
			vials.push(split.trim());
		}
		return vials;
	}	
}

class Vial {
	constructor(items="", segments=4) {
		this.items = [...items];
		this.segments = segments;
	}
	push(item) {
		this.items.push(item);
	}
	pop() {
		return this.items.pop();
	}
	top() {
		return this.items.slice(-1)[0];
	}
	top2() {
		return this.items.slice(-2)[0];
	}
	full() {
		return this.items.length === this.segments;
	}
	empty() {
		return this.items.length === 0;
	}
	missingOne() {
		return this.items.length == (this.segments - 1) && this.monocolor();
	}
	monocolor() {
		return this.items.every(elem => elem === this.items[0]);
	}
	solved() {
		return this.full() && this.monocolor();
	}
	getItems() {
		return this.items;
	}
	toString() {
		return this.items.join("").padEnd(this.segments, " ");
	}
}