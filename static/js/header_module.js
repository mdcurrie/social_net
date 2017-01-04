var didScroll;
var lastScrollTop = 0;
var delta = 5;
var navbarHeight = $('header').outerHeight();

$(function() {
	$('#current-user-profile-pic img').on('click', function() {
		dropdown_content = $('header .dropdown-content');
		if (dropdown_content.css("display") == 'none') {
			sequence = [
				{e: dropdown_content, p: {opacity: 0},                 o: {display: "block", duration: 0}},
				{e: dropdown_content, p: {opacity: 1, translateY: 25}, o: {duration: 300, easing: 'easeInOutCubic'}},
			];
		}
		else {
			sequence = [
				{e: dropdown_content, p: {opacity: 0, translateY: 0},  o: {display: "none", duration: 300, easing: "easeInOutCubic"}},
			];
		}

		$.Velocity.RunSequence(sequence);
	});

	$('#notification-icon').on('click', function() {
		dropdown_content = $('#notifications-dropdown');
		indicator = $('#new-notifications-indicator');
		if (dropdown_content.css("display") == 'none') {
			sequence = [
				{e: dropdown_content, p: {opacity: 0},                 o: {display: "block", duration: 0}},
				{e: dropdown_content, p: {opacity: 1, translateY: 25}, o: {duration: 300, easing: 'easeInOutCubic'}},
				{e: indicator,        p: {opacity: 0},                 o: {duration: 300, display: "none", complete: function() {
					$.post("/process_notifications", {_xsrf: getCookie('_xsrf')}, function(data) {
						if (data.redirect) {
							window.location.href = data.redirect;
						}
					});
				}}}
			];
		}
		else {
			sequence = [
				{e: dropdown_content, p: {opacity: 0, translateY: 0},  o: {display: "none", duration: 300, easing: "easeInOutCubic"}},
			];
		}

		$.Velocity.RunSequence(sequence);
	});

	$(window).scroll(function(event){
	    didScroll = true;
	});

	setInterval(function() {
	    if (didScroll) {
	        hasScrolled();
	        didScroll = false;
	    }
	}, 250);

	$('.nav-option:nth-of-type(3)').on('click', function() {
		scroll_pos = $('body').scrollTop();
		option     = $(this);
		backer     = $('#off-canvas-question-form-backer');
		form       = $('#off-canvas-question-form');
		main       = $('main');

		sequence1 = [
			{e: option, p: {scaleY: 1.35, scaleX: 1.35}, o: {duration: 150}},
			{e: option, p: {scaleY: 1, scaleX: 1},       o: {duration: 150}}
		];

		sequence2 = [
			{e: backer, p: {translateY: "-100%"}, o: {display: "block", duration: 300, easing: [1.000, 0.000, 1.000, 1.000]}},
			{e: form,   p: {translateY: "-100%"}, o: {display: "block", duration: 500, easing: [1.000, 0.000, 0.585, 1.000], sequenceQueue: false}},
			{e: main,   p: {opacity: 1},          o: {display: "none", duration: 0}}
		];

		$.Velocity.RunSequence(sequence1);
		$.Velocity.RunSequence(sequence2);
	});

	$('#close-question div').on('click', function() {
		$('main').css({"display": "block"});
		$('body').scrollTop(scroll_pos);
		backer = $('#off-canvas-question-form-backer');
		form   = $('#off-canvas-question-form');

		sequence = [
			{e: backer, p: {translateY: 0}, o: {display: "none", duration: 500, easing: [1.000, 0.000, 0.585, 1.000]}},
			{e: form,   p: {translateY: 0}, o: {display: "none", duration: 300, easing: [1.000, 0.000, 1.000, 1.000], sequenceQueue: false}},
		];

		$.Velocity.RunSequence(sequence);
	});

	$('#mobile-search-icon').on('click', function() {
		backer  = $('#off-canvas-mobile-search-backer');
		search  = $('#off-canvas-mobile-search');
		overlay = $('#mobile-search-overlay');

		sequence = [
			{e: backer,  p: {translateX: "100%"}, o: {display: "block", duration: 300, easing: [1.000, 0.000, 1.000, 1.000]}},
			{e: search,  p: {translateX: "100%"}, o: {display: "block", duration: 500, easing: [1.000, 0.000, 0.585, 1.000], sequenceQueue: false}},
			{e: overlay, p: {"z-index": 40},      o: {duration: 0}},
			{e: overlay, p: {opacity: 0.5},       o: {duration: 200, complete: function() {
				$('#off-canvas-mobile-search input').focus();
			}}}
		];

		$.Velocity.RunSequence(sequence);
	});

	$('#mobile-search-overlay').on('click', function() {
		backer  = $('#off-canvas-mobile-search-backer');
		search  = $('#off-canvas-mobile-search');
		overlay = $('#mobile-search-overlay');

		sequence = [
			{e: search,  p: {translateX: 0},  o: {display: "none", duration: 300, easing: [1.000, 0.000, 1.000, 1.000]}},
			{e: backer,  p: {translateX: 0},  o: {display: "none", duration: 500, easing: [1.000, 0.000, 0.585, 1.000], sequenceQueue: false}},
			{e: overlay, p: {opacity: 0},     o: {duration: 200}},
			{e: overlay, p: {"z-index": -10}, o: {duration: 0}}
		];

		$.Velocity.RunSequence(sequence);
	});

	$('.nav-option:nth-of-type(5)').on('click', function() {
		options = $('#more-options-wrapper');
		overlay = $('#more-options-overlay');
		$('body').css({"overflow": "hidden"});

		sequence = [
			{e: options, p: {translateX: "100%"}, o: {display: "block", duration: 200}},
			{e: overlay, p: {"z-index": 150},     o: {display: "block", duration: 0}},
			{e: overlay, p: {opacity: 0.5},       o: {duration: 200}}
		];

		$.Velocity.RunSequence(sequence);
	});

	$('#more-options-overlay').on('click', function() {
		options = $('#more-options-wrapper');
		overlay = $('#more-options-overlay');
		$('body').css({"overflow": ""});

		sequence = [
			{e: options, p: {translateX: 0},  o: {display: "none", duration: 200}},
			{e: overlay, p: {opacity: 0},     o: {duration: 200}},
			{e: overlay, p: {"z-index": -10}, o: {display: "none", duration: 0}}
		];

		$.Velocity.RunSequence(sequence);
	});

	var resizeTimer;
	$(window).resize(function(e) {
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(function() {
			if ($('#more-options-wrapper').css("display") == "block" && $(window).width() >= 1200) {
				$('#more-options-wrapper').css({"transform": "translateX(0px)", "display": "none"});
				$('#more-options-overlay').css({"z-index": -10, "opacity": 0, "display": "none"});
				$('body').css({"overflow": ""});
			}
		}, 200);
	});

	var focusTimer;
	var form_inputs = $('input');
	$(form_inputs).on('focusout', function() {
		clearTimeout(focusTimer);
		focusTimer = setTimeout(function() {
			if (form_inputs.is(':focus')) {
				;
			}
			else {
				$('#mobile-tab-bar-wrapper').velocity({"translateY": 0}, {display: "block", duration: 250});
			}
		}, 600);
	});

	$(form_inputs).on('focusin', function() {
		clearTimeout(focusTimer);
		$('#mobile-tab-bar-wrapper').velocity({"translateY": 0}, {duration: 650}).velocity({"translateY": 46}, {display: "none", duration: 250});
	});
});

function hasScrolled() {
	if (window.innerWidth < 1200 && $(document).height() > $(window).height()) {
	    var st = $(this).scrollTop();
	    
	    // Make sure they scroll more than delta
	    if(Math.abs(lastScrollTop - st) <= delta)
	        return;
	    
	    // If they scrolled down and are past the navbar, add class .nav-up.
	    // This is necessary so you never see what is "behind" the navbar.
	    if (st > lastScrollTop && st > navbarHeight) {
	        // Scroll Down
	        header = $('header');
        	sequence = [
        		{e: header,  p: {translateY: -46}, o: {duration: 300, easing: "easeInOutCubic"}},
        	];
	        $.Velocity.RunSequence(sequence);
	    }
	    else {
	        // Scroll Up
	        header = $('header');
        	sequence = [
        		{e: header,  p: {translateY: 0}, o: {duration: 300, easing: "easeInOutCubic"}},
        	];
	        $.Velocity.RunSequence(sequence);
	    }

	    lastScrollTop = st;
	}
}

function getCookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
}