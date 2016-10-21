$(function() {
	if (window.innerWidth >= 900) {
		var new_height = $('.question-wrapper').height() + 'px';
		$(".comment-section").css({"height": new_height});
	}

	$(window).resize(function() {
		if (window.innerWidth >= 900) {
			var new_height = $('.question-wrapper').height() + 'px';
			$(".comment-section").css({"height": new_height});
		}
		else {
			$(".comment-section").css({"height": "initial"});
		}
	});
});