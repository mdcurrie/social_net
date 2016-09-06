$(function() {
	$('#create-question button').on('click', function() {
		$('#off-canvas-question-form').animate({right: 0}, 300, function() {
			$('#question-dark-overlay').css({'z-index': 40});
			$('#question-dark-overlay').animate({opacity: 0.5}, 200);
			$('#question-title').focus();
		});
	});

	$('#question-dark-overlay').on('click', function() {
		$('#off-canvas-question-form').animate({right: '-33%'}, 300, function() {
			$('#question-dark-overlay').animate({opacity: 0}, 200, function() {
				$('#question-dark-overlay').css({'z-index': -10});
			});
		});
	});

	$('#add-topics-button').on('click', function() {
		if ($('#topics li:first-of-type').css("display") == 'none') {
			$('#add-topics-button').html('&times;');
			$('#topics li:first-of-type').css({"opacity": 0, "display": "block"});
			$('#topics li:first-of-type').animate({"opacity": 1}, 300);
			$('#topic-name-input').focus();
		}
		else {
			$('#add-topics-button').text('+');
			$('#topics li:first-of-type').animate({"opacity": 0}, 300, function() {
				$('#topics li:first-of-type').css({"display": "none"});
			});
		}
	});

	$('#topics form').on('submit', function(e) {
		e.preventDefault();
		var topic_name = $('#topic-name-input').val();
		if (topic_name == '') {
			return;
		}
		if (topic_name.length > 30) {
			return;
		}
		if (!(/^[a-zA-Z0-9 \-]+$/i.test(topic_name))) {
			return;
		}
		$('#topics form').unbind('submit').submit();
	});
});