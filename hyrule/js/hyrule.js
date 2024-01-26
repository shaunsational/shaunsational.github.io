//Add method for touchscreens to swipe to next entry
// find a way to loop settings and breakout into named functions
let settings = localStorage.getObj('compendium.settings');
if (settings) {
	$.each(settings, function (key, value) {
		console.log(key, value)
		if (value) {
			$(`#settings input[data-setting="${key}"]`).attr("checked", "checked");
			$('#compendium').addClass(key);
		}
	});
}

$(function () {
	let counts = {creatures: 0, monsters: 0, materials: 0, equipment: 0, treasure: 0};
	$.each(compendium, function (index, entry) {
		let linkClass = "detail";
		linkClass += (localStorage.getObj('compendium.data.HC'+ entry.id)) ? " completed" : "";

		let dlcClass = (!entry.dlc) ? '' : ' DLC'+ entry.dlc;

		$(`<a class="${linkClass}${dlcClass}" href="javascript:void(0);" data-index="${index}" data-id="${entry.id}"><img src="${entry.image}" alt="Image of ${entry.name}" /><span>${entry.name.toUpperCase()}</span></a>`).appendTo($(`#${entry.category}`));
		counts[entry.category]++;
	});

	$.each($('nav a'), function (i, link) {
		if('cat' in link.dataset) {
			let section = link.dataset.cat.substring(1);
			$(`nav a[data-cat="#${section}"] i`).attr('data-total', counts[section])
		}
	});

	$("html").on("click", function (e) {
		let checks = { catLink: false, detailPane: false, inDetail: false };

		if (e.target.classList.contains("detail")) { checks.catLink = true; }
		if ($(e.target).closest("#detail").length > 0) { checks.inDetail = true; }
		if (e.target.id == "detail") { checks.detailPane = true; }

		if (!checks.catLink && !checks.detailPane && !checks.inDetail) {
			closeDetail();
		}
	});

	$("nav a").on("click", function () {
		changeCategory(this.href.substring(this.href.indexOf('#')));
	});

	$(".category").on("click", "a", function () {
		loadDetail(this.dataset.index);
	});

	$("#detail").on("click", 'input[type="checkbox"]', function () {
		let id = $(this).data("id");
		localStorage.setObj(`compendium.data.HC${id}`, this.checked);
		$(`a[data-id="${id}"]`).toggleClass("completed");
	});

	$("#detail").on("click", 'span.close', closeDetail);

	$("#detail").on("click", 'span.google', searchLocation);

	$("#settings").on("click", 'input[type="checkbox"]', changeSetting);
});

function changeCategory(cat) {
	$("nav a").removeClass("active");
	$(`a[data-cat="${cat}"]`).addClass("active");

	$(".category").removeClass("active");
	$(cat).addClass("active");
}

function loadDetail(id) {
	let entry = compendium[id];
	let goog = ` <span class="google" data-search="${entry.name}">Search for Exact Location</span>`;

	let locations;
	if (entry.common_locations != null) {
		entry.common_locations > 0
			? (locations = `<h3>Common Locations${goog}</h3>`)
		: (locations = `<h3>Location${goog}</h3>`);
		locations +=
			"<ul><li>" + entry.common_locations.join("</li><li>") + "</li></ul>";
	} else {
		locations = `<h3>Location${goog}</h3><ul><li>Unknown (or API error occured)</li></ul>`;
	}

	let drops = "";
	if ("drops" in entry && entry.drops !== null && entry.drops.length > 0) {
		drops = `<h3>Possible Loot</h3><ul><li>${entry.drops.join(
			"</li><li>"
		)}</li></ul>`;
	}

	let checked = "";
	checked = localStorage.getObj('compendium.data.HC'+ entry.id) ? ' checked="checked"' : "";
	$("#detail").html(`<span class="close">&#215;</span><input type="checkbox" data-id="${entry.id}"${checked}/><h2>${entry.name.toUpperCase()}</h2><div><image src="${entry.image}" alt="image of ${entry.name}" />${locations}</div><p>${entry.description}</p>${drops}`).addClass("focus");
}

function closeDetail() {
	$("#detail").removeClass("focus");
}

function searchLocation() {
	window.open('https://www.bing.com/search?q=BOTW '+ this.dataset.search +' Respawn Location', 'botwsearch')
}

function changeSetting() {
	localStorage.setObj('compendium.settings.'+ this.dataset.setting, this.checked);
	(this.checked) ? $('#compendium').addClass(this.dataset.setting) : $('#compendium').removeClass(this.dataset.setting);
}