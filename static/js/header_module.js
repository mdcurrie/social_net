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
		$('#off-canvas-question-form-backer').css({"display": "block"}).transition({y: 0}, 300, 'cubic-bezier(1.000, 0.000, 1.000, 1.000)');
		$('#off-canvas-question-form').css({"display": "block"}).transition({y: 0}, 500, 'cubic-bezier(1.000, 0.000, 0.585, 1.000)', function() {
			$('main').css({"display": "none"});
		});
	});

	$('#close-question div').on('click', function() {
		$('main').css({"display": "block"});
		$('body').scrollTop(scroll_pos);
		$('#off-canvas-question-form').transition({y: "100%"}, 300, 'cubic-bezier(1.000, 0.000, 1.000, 1.000)');
		$('#off-canvas-question-form-backer').transition({y: "100%"}, 500, 'cubic-bezier(1.000, 0.000, 0.585, 1.000)', function() {
			$(this).css({"display": "none"});
			$('#off-canvas-question-form').css({"display": "none"});
		});
	});

	$('#mobile-search-icon').on('click', function() {
		console.log('here');
		$('#off-canvas-mobile-search-backer').css({"display": "block"}).transition({x: 0}, 300, 'cubic-bezier(1.000, 0.000, 1.000, 1.000)');
		$('#off-canvas-mobile-search').css({"display": "block"}).transition({x: 0}, 500, 'cubic-bezier(1.000, 0.000, 0.585, 1.000)', function() {
			$('#mobile-search-overlay').css({'z-index': 40});
			$('#mobile-search-overlay').transition({opacity: 0.5}, 200);
		});
	});

	$('#mobile-search-overlay').on('click', function() {
		$('#off-canvas-mobile-search').transition({x: "-100%"}, 300, 'cubic-bezier(1.000, 0.000, 1.000, 1.000)', function() {
			$(this).css({"display": "none"});
		});
		$('#off-canvas-mobile-search-backer').transition({x: "-100%"}, 500, 'cubic-bezier(1.000, 0.000, 0.585, 1.000)', function() {
			$(this).css({"display": "none"});
			$('#mobile-search-overlay').transition({opacity: 0}, 200, function() {
				$('#mobile-search-overlay').css({'z-index': -10});
			});
		});
	});

	$('.nav-option:nth-of-type(3)').on('click', function() {
		$(this).transition({scale: 1.35}, 150).transition({scale: 1}, 150);
	});

	
});

var comment_enabled = false;

function hasScrolled() {
	if ($(window).width() < 1200) {
	    var st = $(this).scrollTop();
	    
	    // Make sure they scroll more than delta
	    if(Math.abs(lastScrollTop - st) <= delta)
	        return;
	    
	    // If they scrolled down and are past the navbar, add class .nav-up.
	    // This is necessary so you never see what is "behind" the navbar.
	    if (st > lastScrollTop && st > navbarHeight){
	        // Scroll Down
	        $('header').transition({y: '-46px'}, 300, 'easeInOutCubic');
	        if ($('.comment-form').length && !comment_enabled) {
	        	comment_enabled = true;
	        	$('.comment-form').css({"opacity": 0});
	        	$('.comment-form').transition({opacity: 1}, 300);
	        	$('#mobile-tab-bar-wrapper').transition({opacity: 0}, 300, function() {
	        		$(this).css({"display": "none"});
	        	});
	        }
	    } else {
	        // Scroll Up
	        if(st + $(window).height() < $(document).height()) {
	            $('header').transition({y: '0px'}, 300, 'easeInOutCubic');
	            if (comment_enabled) {
	            	comment_enabled = false;
		            $('#mobile-tab-bar-wrapper').css({"display": "block"}).transition({opacity: 1}, 300);
		        	$('.comment-form').transition({opacity: 1}, 300);
		        }
	        }
	    }
	    
	    lastScrollTop = st;
	}
}