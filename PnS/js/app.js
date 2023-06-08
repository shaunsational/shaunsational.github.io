function buildProgress(section, phases, score) {
	$(section +' .delete').remove();
	output = '<span class="flexbreak delete"></span><div class="phased diamond delete">';
	if (score < phases[0]) {
		output += '<ul class="steps"><li class="current"><span>✕</span></li>' + '<li><span>✕</span>'.repeat(9) + '</ul>';
		output += '<div>You will not make it to phase 1</div>';
	}
	else if (score > phases[9]) {
		output += '<ul class="steps">' + '<li><span>✓</span>'.repeat(10) + '</ul>';
		output += '<div>You will finish the event</div>';
	}
	else {
		phase = 0;
		output += '<ul class="steps">';
		for(var p in phases) {
			if (score >= phases[p]) {
				phase = parseInt(p) + 1;
				if (score < phases[phase]) {
					output += '<li class="current"><span>'+ phase +'</span></li>';
				} else {
					output += '<li><span>✓</span></li>';
				}
			}
			if (score < phases[p]) {
				output += '<li><span>✕</span></li>';
			}
		}
		output += '</ul>';
		output += '<div class="delete">You will make it to phase '+ phase +' with '+ score +' points.</div>';
	}
	output += '</div>';

	$(section).append(output);
}

function calcSpeeds() {
	speeds = [];
	total = 0
	output = '<span class="flexbreak delete"></span>';
	$('#speedups .delete').remove();

	$('#speedups > div').each(function(){
		section = this.className;
		speeds[section] = 0;
		$(this).find('input').each(function(){
			speeds[section] += $(this).val() * $(this).data('multiplier');
		})
	})

	for(var s in speeds) {
		total += speeds[s];
		output += '<div class="'+ s +' delete">';

		if (speeds[s] > 0) {
			hours = Math.floor(speeds[s] / 60);
			if (hours > 0)
				output += hours.toLocaleString('en-US') + '<span class="greyed">h</span> ';
			mins = speeds[s] % 60;
			if (mins > 0)
				output += mins +'<span class="greyed">m</span>';
		}
		output += '&nbsp;</div>';
	}

	if (total > 0) {
		output += '<span class="flexbreak delete"></span>';
		output += '<div class="total delete"><span class="">TOTAL &nbsp;</span>';
		thours = Math.floor(total / 60);
		if (thours > 0)
			output += thours.toLocaleString('en-US') + '<span class="greyed">h</span> ';
		tmins = total % 60;
		if (tmins > 0)
			output += tmins +'<span class="greyed">m</span>';
		output += '</div>';
	}

	$('#speedups').append(output);
}

function diamondExpert() {
	tiers = [864, 1728, 3024, 4320, 8640, 17280, 25920, 34560, 54000, 64800];
	score = $('#diamondexpert input').val();

	buildProgress('#diamondexpert', tiers, score);
}

function nanoweapon() {
	tiers = [15000, 30000, 55000, 75000, 150000, 300000, 450000, 625000, 1000000, 1250000];
	score = 0;
	$('#nanoweapon input').each(function(){
		score += parseInt($(this).val() * $(this).data('multiplier'));
	});

	buildProgress('#nanoweapon', tiers, score);
}

function novamod() {
	tiers = [12960, 25920, 47520, 64800, 162000, 324000, 486000, 675000, 1080000, 1350000];
	score = 0;
	$('#novamod input').each(function(){
		score += parseInt($(this).val() * $(this).data('multiplier'));
	});

	buildProgress('#novamod', tiers, score);
}

function ace5() {
	tiers = [15000, 30000, 60000, 120000, 300000, 600000];
}

$(function () {
	window.delay = null;
	$(".tab").click(function (e) {
		let tabId = this.href.substring(this.href.indexOf("#"));
		$(this).addClass("active").siblings().removeClass("active");
		$(tabId).addClass("active").siblings().removeClass("active");
	});

	allowed = [8, 9, 37, 38, 39, 40, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105];
	$('.container section input').keydown(function(e) {
		if (allowed.includes(e.keyCode)) {
			return true;
		} else {
			e.preventDefault();
			return false;
		}
	}).keyup (function(e){
		if (allowed.includes(e.keyCode)) {
			window.clearTimeout(window.delay);
			window.delay = window.setTimeout( $(this).parents('section.content').data('callback') , 1500);
		}
	})

	//setTimeout(function(){ $('#splash').fadeOut("slow") }, 1000);
});