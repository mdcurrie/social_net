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
		if ($('#question-title').val() == '') {
			if (!$('.input-section:first-of-type .question-form-error').length)
				$('.input-section:first-of-type').append('<div class="question-form-error">Please enter a title for your question.</div>');
			else
				$('.input-section:first-of-type .question-form-error').text('Please enter a title for your question.');
			
			$('#question-title').focus();
			return;
		}
		$('.input-section:first-of-type .question-form-error').remove();

		if ($('#image-link').val() == '') {
			if (!$('.input-section:nth-of-type(2) .question-form-error').length)
				$('.input-section:nth-of-type(2)').append('<div class="question-form-error">Please enter a link to an image.</div>');
			else
				$('.input-section:nth-of-type(2) .question-form-error').text('Please enter a link to an image.');
			
			$('#image-link').focus();
			return;
		}
		$('.input-section:nth-of-type(2) .question-form-error').remove();

		if ($('#choice-a').val() == '') {
			if (!$('.input-section:nth-of-type(3) .question-form-error').length)
				$('.input-section:nth-of-type(3)').append('<div class="question-form-error">Please enter a choice for voting.</div>');
			else
				$('.input-section:nth-of-type(3) .question-form-error').text('Please enter a choice for voting.');
			
			$('#choice-a').focus();
			return;
		}
		$('.input-section:nth-of-type(3) .question-form-error').remove();

		if ($('#choice-b').val() == '') {
			if (!$('.input-section:nth-of-type(4) .question-form-error').length)
				$('.input-section:nth-of-type(4)').append('<div class="question-form-error">Please enter a choice for voting.</div>');
			else
				$('.input-section:nth-of-type(4) .question-form-error').text('Please enter a choice for voting.');
			
			$('#choice-b').focus();
			return;
		}
		$('.input-section:nth-of-type(4) .question-form-error').remove();

		if ($('#topics-input').val() == '') {
			if (!$('.input-section:nth-of-type(8) .question-form-error').length)
				$('.input-section:nth-of-type(8)').append('<div class="question-form-error">Please enter at least 1 topic.</div>');
			else
				$('.input-section:nth-of-type(8) .question-form-error').text('Please enter at least 1 topic.');
			
			$('#topics-input').focus();
			return;
		}
		$('.input-section:nth-of-type(8) .question-form-error').remove();

		if (!(/^[a-zA-Z0-9 \-]+$/i.test($('#topics-input').val()))) {
			if (!$('.input-section:nth-of-type(8) .question-form-error').length)
				$('.input-section:nth-of-type(8)').append('<div class="question-form-error">Topics can only contain letters, numbers, and hyphens.</div>');
			else
				$('.input-section:nth-of-type(8) .question-form-error').text('Topics can only contain letters, numbers, and hyphens.');
			
			$('#topics-input').focus();
			return;
		}
		$('.input-section:nth-of-type(8) .question-form-error').remove();

		if ($('#choice-a').val() == $('#choice-b').val()) {
			if (!$('.input-section:nth-of-type(4) .question-form-error').length)
				$('.input-section:nth-of-type(4)').append('<div class="question-form-error">Choice B must be different from Choice A.</div>');
			else
				$('.input-section:nth-of-type(4) .question-form-error').text('Choice B must be different from Choice A.');
			
			$('#choice-b').focus();
			return;
		}
		$('.input-section:nth-of-type(4) .question-form-error').remove();

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