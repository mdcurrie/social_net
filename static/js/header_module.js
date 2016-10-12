var didScroll;
var lastScrollTop = 0;
var delta = 5;
var navbarHeight = $('header').outerHeight();

$(function() {
	$('#current-user-profile-pic img').on('click', function() {
		if ($('header .dropdown-content').css("display") == 'none') {
			$('header .dropdown-content').css({"opacity": 0, "display": "block"});
			$('header .dropdown-content').transition({opacity: 1, y: "25px"}, 300, 'easeInOutCubic');
		}
		else {
			$('header .dropdown-content').transition({opacity: 0, y: 0}, 300, 'easeInOutCubic', function() {
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
	        $('header').transition({y: '-46px'}, 300, 'easeInOutCubic');
	    } else {
	        // Scroll Up
	        if(st + $(window).height() < $(document).height()) {
	            $('header').transition({y: '0px'}, 300, 'easeInOutCubic');
	        }
	    }
	    
	    lastScrollTop = st;
	}
}