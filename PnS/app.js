function formatScore(score, locale) {
	if (typeof(locale) === "undefined") { locale = "en-US"; }
	return score.toLocaleString(locale);
}

function buildProgress(section, phases, score) {
	$(section +' .delete').remove();
	output = '<span class="flexbreak delete"></span><div class="phased diamond delete">';
	if (score < phases[0]) {
		output += '<ul class="steps"><li class="current"><span>✕</span></li>' + '<li><span>✕</span>'.repeat(9) + '</ul>';
		output += '<div>You will not make it to phase 1 with '+ formatScore(score) +' points.</div>';
	}
	else if (score > phases[9]) {
		output += '<ul class="steps">' + '<li><span>✓</span>'.repeat(10) + '</ul>';
		output += '<div>You will finish the event with '+ formatScore(score) +' points.</div>';
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
		output += '<div class="delete">You will make it to phase '+ phase +' with '+ formatScore(score) +' points.</div>';
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

// update html, ready to delete
	function diamondExpert() {
		tiers = [864, 1728, 3024, 4320, 8640, 17280, 25920, 34560, 54000, 64800];
		score = $('#diamondexpert input').val();

		buildProgress('#diamondexpert', tiers, score);
	}

// update html, ready to delete
	function nanoweapon() {
		tiers = [15000, 30000, 55000, 75000, 150000, 300000, 450000, 625000, 1000000, 1250000];
		score = 0;
		$('#nanoweapon input').each(function(){
			score += parseInt($(this).val() * $(this).data('multiplier'));
		});

		buildProgress('#nanoweapon', tiers, score);
	}

// update html, ready to delete
	function novamod() {
		tiers = [12960, 25920, 47520, 64800, 162000, 324000, 486000, 675000, 1080000, 1350000];
		score = 0;
		$('#novamod input').each(function(){
			score += parseInt($(this).val() * $(this).data('multiplier'));
		});

		buildProgress('#novamod', tiers, score);
	}

// update html, ready to delete
	function bioenhancer() {
		tiers = [14400, 28800, 52800, 72000, 180000, 360000, 540000, 750000, 1200000, 1500000];
		score = 0;
		$('#bioenhancer input').each(function(){
			score += parseInt($(this).val() * $(this).data('multiplier'));
		});

		buildProgress('#bioenhancer', tiers, score);
	}

// update html, ready to delete
	function breaklooseweapon() {
		tiers = [37500, 100000, 250000, 437500, 625000];
		score = 0;
		$('#breaklooseweapon input').each(function(){
			score += parseInt($(this).val() * $(this).data('multiplier'));
		});

		buildProgress('#breaklooseweapon', tiers, score);
	}

// need to verify values against the ones in the scoreTiers array
	function breakloosetrain() {
		tiers = [37500, 100000, 250000, 437500, 625000];
		score = 0;
		$('#breakloosetrain input').each(function(){
			score += parseInt($(this).val() * $(this).data('multiplier'));
		});

		buildProgress('#breakloosetrain', tiers, score);
	}

function ace5() {
	tiers = [15000, 30000, 60000, 120000, 300000, 600000];
}

var scoreTiers = {
	"heroupgrade":			[16800, 33600, 61600, 84000, 210000, 420000, 630000, 875000, 1400000, 1750000],
	"bioenhancer":			[14400, 28800, 52800, 72000, 180000, 360000, 540000, 750000, 1200000, 1500000],
	"diamondexpert":		[864, 1728, 3024, 4320, 8640, 17280, 25920, 34560, 54000, 64800],
	"nanoweapon":			[15000, 30000, 55000, 75000, 150000, 300000, 450000, 625000, 1000000, 1250000],
	"novamod":				[12960, 25920, 47520, 64800, 162000, 324000, 486000, 675000, 1080000, 1350000],

	"breakloosediamond":	[9000, 18000, 33000, 45000, 112500],
	"breakloosetrain":		[56250, 150000, 375000, 656250, 937500],
	"breaklooseweapon":		[37500, 100000, 250000, 437500, 625000]
}

function tabulateScore(el) {
	tiers = scoreTiers[el];
	if (typeof(tiers) === "undefined") { return alert('ERROR: cannot continue, score levels are not defined.'); }
	score = 0;
	$('#'+ el +' input').each(function(){
		score += parseInt($(this).val() * $(this).data('multiplier'));
	});

	buildProgress('#'+ el, tiers, score);
}

$(function () {
	window.delay = null;
	$("nav dl.tab").click(function (e) {
		$(this).toggleClass("expand");
	});

	$("nav a.tab").click(function (e) {
		let tabId = this.href.substring(this.href.indexOf("#"));
		$("nav").find(".active").removeClass("active");
		$(this).addClass("active");//.siblings().removeClass("active");
		$(tabId).addClass("active").siblings().removeClass("active");
		e.stopPropagation();
	});

	allowed = [8, 9, 37, 38, 39, 40, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 116];
	$('.container section input').keydown(function(e) {
		if (allowed.includes(e.keyCode) || e.ctrlKey == true && e.keyCode == 82) {
			return true;
		} else {
			console.log(e.keyCode);
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