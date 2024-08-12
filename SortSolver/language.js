Element.prototype.i18n = function(settings) {
	let el = this;
	el.innerHTML = '';
	flagcss = ' fflag ff-md ff-wave ff-dk';

	const DEFAULTS = {
		language: {"en-US": "English", "it-IT": "Italian"},
		current: 'en-US',
		callback: ((e)=>{
			let newLang = e.target.dataset['lang'];
			if (e.target.nodeName !== "DIV") {
				newLang = e.target.parentElement.dataset['lang']
			}
			el.classList.remove('open');
			lang = newLang
			setHTMLStrings();
			console.log('i18n clicked', newLang)
		})
	};
	let options = Object.assign({}, DEFAULTS, settings);
	let d = document.createElement('div');
	let l = document.createElement('span');
	let f = document.createElement('span');
	l.innerHTML = '<i class="fa fa-user-circle" aria-hidden="true"></i>';
	f.className = 'en-US' + flagcss;
	d.append(l);
	d.append(f);
	el.append(d);

	for (var key in options.language){
		let d = document.createElement('div');
		let l = document.createElement('span');
		let f = document.createElement('span');
		l.innerHTML = options.language[key];
		f.className = key + flagcss;
		d.setAttribute('data-lang', key);
		d.onclick = options.callback;
		d.append(l);
		d.append(f);
		el.append(d);
	};
	el.setAttribute('data-current', options.current);

	let countdown;
	const eventHandler = {
		handlers: {
			mouseenter(e) {
				clearTimeout(countdown);
				el.classList.toggle('open');
			},
			mouseleave(e) {
				countdown = null;
				countdown = setTimeout(() => {
					el.classList.remove('open');
				}, 1000);
			}
		},
		handleEvent(e) {
			switch (e.type) {
				case "click":
				case "mouseenter":
				case "touchstart":
					this.handlers.mouseenter(e);
					break;
				case "mouseleave":
					this.handlers.mouseleave(e);
					break;
			}
		}
	}
	Object.keys(eventHandler.handlers).map(eventName => el.addEventListener(eventName, eventHandler));
	setHTMLStrings();

	return el;
};