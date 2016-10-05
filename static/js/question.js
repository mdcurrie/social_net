$(function() {
	if ($(window).width() >= 480) {
		var new_height = $('.question-wrapper').height() +'px';
		$(".comment-section").css({"height": new_height});
	}
});