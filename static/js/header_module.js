var didScroll;
var lastScrollTop = 0;
var delta = 5;
var navbarHeight = $('header').outerHeight();

$(function() {
	/*$('#current-user-profile-pic img').hover(
		function() {
			$('header .dropdown-content').css({"opacity": 0, "top": "65px", "display": "block"});
			$('header .dropdown-content').animate({"opacity": 1, "top": "85px"}, 300);
		},
		function() {
			$('header .dropdown-content').animate({"opacity": 0, "top": "65px"}, 300, function() {
				$('header .dropdown-content').css({"display": "none"});
			});
		}
	);*/


	$('#current-user-profile-pic img').on('click', function() {
		if ($('header .dropdown-content').css("display") == 'none') {
			$('header .dropdown-content').css({"opacity": 0, "top": "65px", "display": "block"});
			$('header .dropdown-content').animate({"opacity": 1, "top": "85px"}, 300);
		}
		else {
			$('header .dropdown-content').animate({"opacity": 0, "top": "65px"}, 300, function() {
				$('header .dropdown-content').css({"display": "none"});
			});
		}
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
});

function hasScrolled() {
	if ($(window).width() < 900) {
	    var st = $(this).scrollTop();
	    
	    // Make sure they scroll more than delta
	    if(Math.abs(lastScrollTop - st) <= delta)
	        return;
	    
	    // If they scrolled down and are past the navbar, add class .nav-up.
	    // This is necessary so you never see what is "behind" the navbar.
	    if (st > lastScrollTop && st > navbarHeight){
	        // Scroll Down
	        $('header').removeClass('nav-down').addClass('nav-up');
	        $('header').transition({y: '-46px'}, 300, 'ease');
	    } else {
	        // Scroll Up
	        if(st + $(window).height() < $(document).height()) {
	            $('header').removeClass('nav-up').addClass('nav-down');
	            $('header').transition({y: '0px'}, 300, 'ease');
	        }
	    }
	    
	    lastScrollTop = st;
	}
}