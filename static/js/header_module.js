$(function() {
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
});