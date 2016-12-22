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

	var focusTimer;
	var comment_input = $('input[name="comment"]');
	$(comment_input).on('focusout', function() {
		clearTimeout(focusTimer);
		focusTimer = setTimeout(function() {
			if (comment_input.is(':focus')) {
				;
			}
			else {
				$('#mobile-tab-bar-wrapper').velocity({"translateY": 0}, {display: "block", duration: 250});
			}
		}, 500);
	});

	$(comment_input).on('focusin', function() {
		clearTimeout(focusTimer);
		$('#mobile-tab-bar-wrapper').velocity({"translateY": 0}, {duration: 650}).velocity({"translateY": 46}, {display: "none", duration: 250});
	});
});