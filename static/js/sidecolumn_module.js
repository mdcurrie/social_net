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

	$('#question-form-wrapper form').on('submit', function(e) {
		e.preventDefault();
		if ($('#question-title').val() == '')
			return;
		if ($('#image-link').val() == '')
			return;
		if ($('#choice-a').val() == '')
			return;
		if ($('#choice-b').val() == '')
			return;
		if ($('#topics-input').val() == '')
			return;
		if (!(/^[a-zA-Z0-9 \-]+$/i.test($('#topics-input').val()))) {
			return;
		}
		if ($('#choice-a').val() == $('#choice-b').val())
			return;

		$("<img>", {
			src: $('#image-link').val(),
			error: function() {
				;
			},
			load: function() {
				$('#question-form-wrapper form').unbind('submit').submit();
			}
		});
	});

	$('#choice-c').on('input', function() {
		if ($('#choice-c').val() != '') {
			if ($('.input-section:nth-of-type(6)').css("display") == "none") {
				$('.input-section:nth-of-type(6)').css({"display": "block"});
				$('.input-section:nth-of-type(6)').animate({"opacity": 1}, 300);
			}
		}
		else {
			if ($('.input-section:nth-of-type(6)').css("display") == "block") {
				$('#choice-d').val('');
				$('.input-section:nth-of-type(6)').animate({"opacity": 0}, 300, function() {
					$('.input-section:nth-of-type(6)').css({"display": "none"});
				});
			}
			if ($('.input-section:nth-of-type(7)').css("display") == "block") {
				$('#choice-e').val('');
				$('.input-section:nth-of-type(7)').animate({"opacity": 0}, 300, function() {
					$('.input-section:nth-of-type(7)').css({"display": "none"});
				});
			}
		}
	});

	$('#choice-d').on('input', function() {
		if ($('#choice-d').val() != '') {
			if ($('.input-section:nth-of-type(7)').css("display") == "none") {
				$('.input-section:nth-of-type(7)').css({"display": "block"});
				$('.input-section:nth-of-type(7)').animate({"opacity": 1}, 300);
			}
		}
		else {
			if ($('.input-section:nth-of-type(7)').css("display") == "block") {
				$('#choice-e').val('');
				$('.input-section:nth-of-type(7)').animate({"opacity": 0}, 300, function() {
					$('.input-section:nth-of-type(7)').css({"display": "none"});
				});
			}
		}
	});
});