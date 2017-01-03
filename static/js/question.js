$(function() {
	if (window.innerWidth >= 800) {
		var new_height = $('.question-wrapper').height() + 'px';
		$(".comment-section").css({"height": new_height});
	}

	var resizeTimer;
	$(window).resize(function(e) {
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(function() {
			if (window.innerWidth >= 800) {
				var new_height = $('.question-wrapper').height() + 'px';
				$(".comment-section").css({"height": new_height});
			}
			else {
				$(".comment-section").css({"height": "initial"});
			}
		}, 200);
	});
});