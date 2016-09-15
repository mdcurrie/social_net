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

		if ($('#question-title').val().length > 120) {
			if (!$('.input-section:first-of-type .question-form-error').length)
				$('.input-section:first-of-type').append('<div class="question-form-error">Question titles must be 120 characters or less.</div>');
			else
				$('.input-section:first-of-type .question-form-error').text('Question titles must be 120 characters or less.');
			
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

		if ($('#choice-a').val().length > 40 || $('#choice-b').val().length > 40 || $('#choice-c').val().length > 40 || $('#choice-d').val().length > 40 || $('#choice-e').val().length > 40) {
			if (!$('.input-section:nth-of-type(3) .question-form-error').length)
				$('.input-section:nth-of-type(3)').append('<div class="question-form-error">Choices must be 40 characters or less.</div>');
			else
				$('.input-section:nth-of-type(3) .question-form-error').text('Choices must be 40 characters or less.');
			
			$('#choice-a').focus();
			return;
		}
		$('.input-section:nth-of-type(3) .question-form-error').remove();

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
			if (!$('.input-section:nth-of-type(3) .question-form-error').length)
				$('.input-section:nth-of-type(3)').append('<div class="question-form-error">Choice A must be different from Choice B.</div>');
			else
				$('.input-section:nth-of-type(3) .question-form-error').text('Choice A must be different from Choice B.');
			
			$('#choice-a').focus();
			return;
		}
		$('.input-section:nth-of-type(3) .question-form-error').remove();

		$("<img>", {
			src: $('#image-link').val(),
			error: function() {
				if (!$('.input-section:nth-of-type(2) .question-form-error').length)
					$('.input-section:nth-of-type(2)').append('<div class="question-form-error">Please enter a link to an image.</div>');
				else
					$('.input-section:nth-of-type(2) .question-form-error').text('Please enter a link to an image.');
				
				$('#image-link').focus();
				return;
			},

			load: function() {
				$('.input-section:nth-of-type(2) .question-form-error').remove();

				var question_data = $('#question-form-wrapper form').serialize();
				$.post('/create_question', question_data, function(data) {
					if (data.title_error) {
						if (!$('.input-section:first-of-type .question-form-error').length)
							$('.input-section:first-of-type').append('<div class="question-form-error">' + data.title_error + '</div>');
						else
							$('.input-section:first-of-type .question-form-error').text(data.title_error);
						
						$('#question-title').focus();
						return;
					}
					$('.input-section:first-of-type .question-form-error').remove();

					if (data.image_error) {
						if (!$('.input-section:nth-of-type(2) .question-form-error').length)
							$('.input-section:nth-of-type(2)').append('<div class="question-form-error">' + data.image_error + '</div>');
						else
							$('.input-section:nth-of-type(2) .question-form-error').text(data.image_error);
						
						$('#image-link').focus();
						return;
					}
					$('.input-section:nth-of-type(2) .question-form-error').remove();

					if (data.choice_error) {
						if (!$('.input-section:nth-of-type(3) .question-form-error').length)
							$('.input-section:nth-of-type(3)').append('<div class="question-form-error">' + data.choice_error + '</div>');
						else
							$('.input-section:nth-of-type(3) .question-form-error').text(data.choice_error);
						
						$('#choice-a').focus();
						return;
					}
					$('.input-section:nth-of-type(3) .question-form-error').remove();

					if (data.topics_error) {
						if (!$('.input-section:nth-of-type(8) .question-form-error').length)
							$('.input-section:nth-of-type(8)').append('<div class="question-form-error">' + data.topics_error + '</div>');
						else
							$('.input-section:nth-of-type(8) .question-form-error').text(data.topics_error);
						
						$('#topics-input').focus();
						return;
					}
					$('.input-section:nth-of-type(8) .question-form-error').remove();

					if (data.question_link) {
						window.location.href = data.question_link;
					}
				});
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