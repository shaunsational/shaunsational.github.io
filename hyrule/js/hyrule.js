/*/
/*  TODO:
/*	Add method for touchscreens to swipe to next entry
/*
/*/

let settings = localStorage.getObj('compendium.settings');
if (settings) {
	$.each(settings, function (key, value) {
		if (value) {
			$(`#settings input[data-setting="${key}"]`).attr("checked", "checked");
			$('#compendium').addClass(key);
		}
	});
}

let showImage = ['creatures', 'monsters', 'materials', 'equipment', 'treasure'];
$(function () {
	let counts = {creatures: 0, monsters: 0, materials: 0, equipment: 0, treasure: 0};
	$.each(compendium, function (index, entry) {

		let link = buildCatLink(index, entry);


		$(link).appendTo($(`#${entry.category}`));
		counts[entry.category]++;
	});

	$.each($('nav a'), function (i, link) {
		if('cat' in link.dataset) {
			let section = link.dataset.cat.substring(1);
			$(`nav a[data-cat="#${section}"] i`).attr('data-total', counts[section])
		}
	});

	$("html").on("click", closeDetail);

	$(".category").on("click", "a.detail", loadDetail);

	$("#settings").on("click", 'input[type="checkbox"]', changeSetting);

	$(".detailPane").on("click", 'span.close', closeDetail);

	$(".detailPane").on("click", 'span.google', searchLocation);

	$(".detailPane").on("click", 'input[type="checkbox"]', function () {
		let id = $(this).data("id");
		localStorage.setObj(`compendium.data.HC${id}`, this.checked);
		$(`div[data-id="${id}"]`).toggleClass("completed");
	});

	$("a:not(.detail)").on("click", function () {
		changeCategory(this.href);
	});

	$('#armor').on('click', '.shoppingList', shoppingList)

	$('#armor').on('change', '.shoppingList input[type="tel"]', countParts);

	if (location.href.indexOf('#') !== -1) {
		changeCategory(location.href);
	}
});

function buildCatLink(index, entry) {
	let linkClass = "detail";
	linkClass += (!entry.dlc) ? '' : (entry.dlc == 'amiibo') ? ' amiibo' : ' DLC'+ entry.dlc;

	let linkData = null;
	let link, completedClass = '';

	switch (entry.category) {
		case 'armor':

			let level = localStorage.getObj('compendium.data.HC'+ entry.id);
			completedClass = (level + 1 == entry.tiers.length) ? ' completed' : '';

			linkData = {};
			if (!level || level + 1 < entry.tiers.length)
			{
				for(i=((!level || level <= 0) ? 0 : level); i<entry.tiers.length -1; i++){
					entry.tiers[i].materials.forEach((item) => {
						for (const [key, value] of Object.entries(item)) {
							if(linkData.hasOwnProperty(key)) {
								linkData[key] += value;
							} else {
								linkData[key] = value;
							}
						}
					});
				}
				var b=[]; Object.keys(linkData).forEach(function(k){b.push(`"${k}": ${linkData[k]}`);});
			}

			linkData = (Object.keys(linkData).length > 0) ? `data-materials='{${b.join(', ').replaceAll("'","&rsquo;")}}'` : '';

			link = `<div class="armorContainer ${linkClass}${completedClass}" data-id="${entry.id}"${linkData}>`;
			link += `<span class="level">${checkLevel(entry.id, localStorage.getObj('compendium.data.HC'+ entry.id), entry.tiers.length)}</span>`
			link += `<a class="${linkClass}${completedClass}" href="javascript:void(0);" data-index="${index}" data-id="${entry.id}"><span>${entry.name.toUpperCase()}</span></a>`;
		break;

		default:
			let img = (showImage.includes(entry.category)) ? `<img src="${entry.image}" alt="Image of ${entry.name}" />` : '';
			completedClass = (localStorage.getObj('compendium.data.HC'+ entry.id)) ? ' class="completed"' : "";
			link = `<div${completedClass} data-id="${entry.id}"><a class="${linkClass}" href="javascript:void(0);" data-index="${index}" data-id="${entry.id}">${img}<span>${entry.name.toUpperCase()}</span></a>`;
	}
	link = $(link += '</div>');
	return link;
}

function changeCategory(catHref) {
	cat = catHref.substring(catHref.lastIndexOf('#'));

	$("nav a").removeClass("active");
	$(`a[data-cat="${cat}"]`).addClass("active");

	$(".category").removeClass("active");
	$(cat).addClass("active");
}

// TODO: possible to tie back button to navigation to close detail pane?
function loadDetail(id) {
	let cat = $(this).closest('.category')[0]
	//console.log(cat.id, this.dataset.index); return;
	switch (cat.id) {
		case 'armor':
			loadArmorDetail(this.dataset.index);
		break;

		default:
			loadGenericDetail(this.dataset.index);
	}
}

function loadGenericDetail(id) {
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
	$("#detail").html(`<span class="close">&#215;</span><input type="checkbox" data-id="${entry.id}"${checked}/><h2>${entry.name}</h2><div><image src="${entry.image}" alt="image of ${entry.name}" />${locations}</div><p>${entry.description}</p>${drops}`).addClass("focus");
}

function loadArmorDetail(id) {
	let entry = compendium[id];

	let tier = localStorage.getObj('compendium.data.HC'+ entry.id);

	$('#level').html(checkLevel(entry.id, tier, entry.tiers.length));
	$("#armorDetail .name").html(entry.name);
	$("#armorDetail .description").html(entry.description);
	$("#armorDetail .effects").html(entry.effects);
	let tierChart = '';
	//☆★
	$.each(entry.tiers, function (i, tier) {
		let materials = '';
		if (tier.materials == null) {
			materials += `<td></td><td>Enhancement Maxed</td>`;
		} else {
			let materialCount = 0;
			$.each(tier.materials, function (m, material) {
				if (m > 0) { materials += `<tr class="extra tier${i}"><td colspan="2"></td>`}
			    Object.keys(material).map(function(k){
			    	materials += `<td class="materials">${material[k]}</td><td class="materials">${k}</td></tr>`;
			    })
			    materialCount++;
			})
		}

		tierChart += `<tr class="material tier${i}"><td>${i}</td><td>${tier.defense}</td>${materials}`;
	});
	$("#armorDetail tbody").html(tierChart);
	$("#armorDetail").addClass('focus');
}

function countParts() {
	let needed = this.dataset.start - this.value;
	if (needed < 1) {
		$(this.parentNode).addClass('dim').find('.amount-remain').html('✓&nbsp;').addClass('done');
	} else {
		$(this.parentNode).removeClass('dim').find('.amount-remain').html(needed).removeClass('done');
	}
}

function checkLevel(id, level, max) {
	$('#armorDetail').attr('data-level', level);

	let stars = `<i onclick="javascript:setLevel('${id}', -1, ${max})" data-level="0">⊗</i>`
	for (i=1; i<max; i++) {
		stars += `<i onclick="javascript:setLevel('${id}', ${i}, ${max})" data-level="${i}">`;
		stars += (level >= i) ? '★' : '☆';
		stars += '</i>';
	}
	stars += `<i onclick="javascript:setLevel('${id}', 0, ${max})" data-level="max">Collect`;

	if (level + 1 === max) {
		$(`#armor a[data-id="${id}"]`).closest('div.armorContainer').addClass('completed');
		stars += 'ed';
	} else {
		$(`#armor a[data-id="${id}"]`).removeClass('completed');
	}

	return stars +'</i>';
}
function setLevel(id, level, max) {
	event.preventDefault();
	console.log(id, level, max)
	localStorage.setObj('compendium.data.HC'+ id, level);
	let cont = $(event.target).closest('.level').html(checkLevel(id, level, max));
}

function closeDetail(e) {
	let target = $(e.target);
	let checks = { catLink: false, detailPane: false, inDetail: false };

	if (target.closest(".detail").length > 0) { checks.catLink = true; }
	if (target.closest(".detailPane").length > 0 && !target.hasClass('close')) { checks.inDetail = true; }
	if (e.target.id == "detail") { checks.detailPane = true; }

	if (!checks.catLink && !checks.detailPane && !checks.inDetail) {
		$(".detailPane").removeClass("focus");
	}
}

function shoppingList() {
	event.stopPropagation();

	let list = $(this);
		list.html('');

	let remaining = {};
	document.querySelectorAll('div.armorContainer').forEach((item) => {
		if (item.dataset.hasOwnProperty('materials') && !item.classList.contains('completed'))
		{
			let materials = JSON.parse(item.dataset.materials);
			console.log(materials)
			for (const [key, value] of Object.entries(materials)) {
				if(remaining.hasOwnProperty(key)) {
					remaining[key] += value;
				} else {
					remaining[key] = value;
				}
			}
		}
	});
	Object.keys(remaining).forEach(function(k){
		list.append(`<div><span class="amount-needed">${remaining[k]}</span><input type="tel" name="materials[${k.toLowerCase().replace(' ','_')}]" data-start="${remaining[k]}" /><span class="amount-remain">${remaining[k]}</span><span class="item-needed">${k}</span></div>`);// shoppingList[k]+"x "+k);
	});

	list.toggleClass('showList')
}

function searchLocation() {
	window.open('https://www.bing.com/search?q=BOTW '+ this.dataset.search +' Respawn Location', 'botwsearch')
}

function changeSetting() {
	localStorage.setObj('compendium.settings.'+ this.dataset.setting, this.checked);
	(this.checked) ? $('#compendium').addClass(this.dataset.setting) : $('#compendium').removeClass(this.dataset.setting);
}