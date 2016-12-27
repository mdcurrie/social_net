$(function() {
	var resizeTimer;
	$(window).resize(function(e) {
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(function() {
			if ($('#off-canvas-question-form').css("display") == "block") {
				if ($(window).width() < 1200) {
					$('main').css({"display": "none"});
					$('#question-dark-overlay').css({"z-index": -100, opacity: 0});
				}
				else {
					$('#question-dark-overlay').css({"z-index": 40, opacity: 0.5});
					$('main').css({"display": "block"});
				}
			}
		}, 200);
	});

	$('#create-question button').hover(
		function() {
			$('#off-canvas-question-form-backer').css({"will-change": "transform"});
			$('#off-canvas-question-form').css({"will-change": "transform"});
		},
		function() {
			$('#off-canvas-question-form-backer').css({"will-change": "initial"});
			$('#off-canvas-question-form').css({"will-change": "initial"});
		}
	);

	$('#side-column').hover(
		function() {
			$('#off-canvas-question-form-backer').css({"will-change": "transform"});
			$('#off-canvas-question-form').css({"will-change": "transform"});
		},
		function() {
			$('#off-canvas-question-form-backer').css({"will-change": "initial"});
			$('#off-canvas-question-form').css({"will-change": "initial"});
		}
	);

	$('#create-question button').on('click', function() {
		backer  = $('#off-canvas-question-form-backer');
		form    = $('#off-canvas-question-form');
		overlay = $('#question-dark-overlay');
		title   = $('#question-title');

		sequence = [
			{e: backer,  p: {translateY: "-100%"}, o: {display: "block", duration: 300, easing: [1.000, 0.000, 1.000, 1.000]}},
			{e: form,    p: {translateY: "-100%"}, o: {display: "block", duration: 500, easing: [1.000, 0.000, 0.585, 1.000], sequenceQueue: false}},
			{e: overlay, p: {"z-index": 40},       o: {duration: 0}},
			{e: overlay, p: {opacity: 0.5},        o: {duration: 200, complete: function() {
				title.focus();
			}}}
		];

		$.Velocity.RunSequence(sequence);
	});

	$('#question-dark-overlay').on('click', function() {
		backer  = $('#off-canvas-question-form-backer');
		form    = $('#off-canvas-question-form');
		overlay = $('#question-dark-overlay');

		sequence = [
			{e: form,    p: {translateY: 0},  o: {display: "none", duration: 300, easing: [1.000, 0.000, 1.000, 1.000]}},
			{e: backer,  p: {translateY: 0},  o: {display: "none", duration: 500, easing: [1.000, 0.000, 0.585, 1.000], sequenceQueue: false}},
			{e: overlay, p: {opacity: 0},     o: {duration: 200}},
			{e: overlay, p: {"z-index": -10}, o: {duration: 0}}
		];

		$.Velocity.RunSequence(sequence);
	});

	var picture_upload_callback = function (res) {
        if (res.success == true) {
        	$('#image-link-text').css({display: "none"});
        	$('#image-link').val(res.data.link);
			$('.input-section:nth-of-type(2) .create-question-error').remove();
			$('.input-section:nth-of-type(2) .dropzone').css({"border": "none", "background-color": "transparent", "background-image": "url(" + res.data.link + ")"});
    	}
        else {
        	$('.input-section:nth-of-type(2)').append('<div class="create-question-error">There was an error uploading your image, please try again later.</div>');
        	$('.input-section:nth-of-type(2) .create-question-error').velocity({opacity: 1}, 300);
        }
    };

    new Imgur({
        clientid: 'a512d4db12a3c8d',
        callback: picture_upload_callback
    });

	jQuery.fn.preventDoubleSubmission = function() {
		$(this).on('submit', function(e) {
			e.preventDefault();
			form = $(this);
			if ($(this).data('submitted') == true) {
				;
			}
			else {
				if ($('#question-title').val() == '') {
					if (!$('.input-section:first-of-type .create-question-error').length) {
						$('.input-section:first-of-type').append('<div class="create-question-error">Please enter a title for your question.</div>');
						$('.input-section:first-of-type .create-question-error').velocity({opacity: 1}, 300);
					}
					else
						$('.input-section:first-of-type .create-question-error').text('Please enter a title for your question.');
					
					$('#question-title').focus();
					return;
				}

				if ($('#question-title').val().length > 120) {
					if (!$('.input-section:first-of-type .create-question-error').length) {
						$('.input-section:first-of-type').append('<div class="create-question-error">Question titles must be 120 characters or less.</div>');
						$('.input-section:first-of-type .create-question-error').velocity({opacity: 1}, 300);
					}
					else
						$('.input-section:first-of-type .create-question-error').text('Question titles must be 120 characters or less.');
					
					$('#question-title').focus();
					return;
				}
				$('.input-section:first-of-type .create-question-error').remove();

				if ($('#image-link').val() == '') {
					if (!$('.input-section:nth-of-type(2) .create-question-error').length) {
						$('.input-section:nth-of-type(2)').append('<div class="create-question-error">Please add an image.</div>');
						$('.input-section:nth-of-type(2) .create-question-error').velocity({opacity: 1}, 300);
					}
					else
						$('.input-section:nth-of-type(2) .create-question-error').text('Please add an image.');
					
					return;
				}
				$('.input-section:nth-of-type(2) .create-question-error').remove();

				if ($('#choice-a').val() == '') {
					if (!$('.input-section:nth-of-type(3) .create-question-error').length) {
						$('.input-section:nth-of-type(3)').append('<div class="create-question-error">Please enter a choice for voting.</div>');
						$('.input-section:nth-of-type(3) .create-question-error').velocity({opacity: 1}, 300);
					}
					else
						$('.input-section:nth-of-type(3) .create-question-error').text('Please enter a choice for voting.');
					
					$('#choice-a').focus();
					return;
				}
				$('.input-section:nth-of-type(3) .create-question-error').remove();

				if ($('#choice-b').val() == '') {
					if (!$('.input-section:nth-of-type(4) .create-question-error').length) {
						$('.input-section:nth-of-type(4)').append('<div class="create-question-error">Please enter a choice for voting.</div>');
						$('.input-section:nth-of-type(4) .create-question-error').velocity({opacity: 1}, 300);
					}
					else
						$('.input-section:nth-of-type(4) .create-question-error').text('Please enter a choice for voting.');
					
					$('#choice-b').focus();
					return;
				}
				$('.input-section:nth-of-type(4) .create-question-error').remove();

				if ($('#choice-a').val().length > 40 || $('#choice-b').val().length > 40 || $('#choice-c').val().length > 40 || $('#choice-d').val().length > 40 || $('#choice-e').val().length > 40) {
					if (!$('.input-section:nth-of-type(3) .create-question-error').length) {
						$('.input-section:nth-of-type(3)').append('<div class="create-question-error">Choices must be 40 characters or less.</div>');
						$('.input-section:nth-of-type(3) .create-question-error').velocity({opacity: 1}, 300);
					}
					else
						$('.input-section:nth-of-type(3) .create-question-error').text('Choices must be 40 characters or less.');
					
					return;
				}
				$('.input-section:nth-of-type(3) .create-question-error').remove();

				if ($('#topics-input').val() == '') {
					if (!$('.input-section:nth-of-type(8) .create-question-error').length) {
						$('.input-section:nth-of-type(8)').append('<div class="create-question-error">Please enter at least 1 topic.</div>');
						$('.input-section:nth-of-type(8) .create-question-error').velocity({opacity: 1}, 300);
					}
					else
						$('.input-section:nth-of-type(8) .create-question-error').text('Please enter at least 1 topic.');
					
					$('#topics-input').focus();
					return;
				}
				$('.input-section:nth-of-type(8) .create-question-error').remove();

				if (!(/^[a-zA-Z0-9 \-]+$/i.test($('#topics-input').val()))) {
					if (!$('.input-section:nth-of-type(8) .create-question-error').length) {
						$('.input-section:nth-of-type(8)').append('<div class="create-question-error">Topics can only contain letters, numbers, and hyphens.</div>');
						$('.input-section:nth-of-type(8) .create-question-error').velocity({opacity: 1}, 300);
					}
					else
						$('.input-section:nth-of-type(8) .create-question-error').text('Topics can only contain letters, numbers, and hyphens.');
					
					$('#topics-input').focus();
					return;
				}
				$('.input-section:nth-of-type(8) .create-question-error').remove();

				if ($('#choice-a').val() == $('#choice-b').val()) {
					if (!$('.input-section:nth-of-type(3) .create-question-error').length) {
						$('.input-section:nth-of-type(3)').append('<div class="create-question-error">Choice A must be different than Choice B.</div>');
						$('.input-section:nth-of-type(3) .create-question-error').velocity({opacity: 1}, 300);
					}
					else
						$('.input-section:nth-of-type(3) .create-question-error').text('Choice A must be different than Choice B.');
					
					$('#choice-a').focus();
					return;
				}
				$('.input-section:nth-of-type(3) .create-question-error').remove();

				question_data = $('#question-form-wrapper form').serialize();
				form.data('submitted', true);
				$.post('/create_question', question_data, function(data) {
					if (data.title_error) {
						if (!$('.input-section:first-of-type .create-question-error').length) {
							$('.input-section:first-of-type').append('<div class="create-question-error">' + data.title_error + '</div>');
							$('.input-section:first-of-type .create-question-error').velocity({opacity: 1}, 300);
						}
						else
							$('.input-section:first-of-type .create-question-error').text(data.title_error);
						
						$('#question-title').focus();
						form.data('submitted', false);
						return;
					}
					$('.input-section:first-of-type .create-question-error').remove();

					if (data.image_error) {
						if (!$('.input-section:nth-of-type(2) .create-question-error').length) {
							$('.input-section:nth-of-type(2)').append('<div class="create-question-error">' + data.image_error + '</div>');
							$('.input-section:nth-of-type(2) .create-question-error').velocity({opacity: 1}, 300);
						}
						else
							$('.input-section:nth-of-type(2) .create-question-error').text(data.image_error);
						
						form.data('submitted', false);
						return;
					}
					$('.input-section:nth-of-type(2) .create-question-error').remove();

					if (data.choice_error) {
						if (!$('.input-section:nth-of-type(3) .create-question-error').length) {
							$('.input-section:nth-of-type(3)').append('<div class="create-question-error">' + data.choice_error + '</div>');
							$('.input-section:nth-of-type(3) .create-question-error').velocity({opacity: 1}, 300);
						}
						else
							$('.input-section:nth-of-type(3) .create-question-error').text(data.choice_error);
						
						form.data('submitted', false);
						return;
					}
					$('.input-section:nth-of-type(3) .create-question-error').remove();

					if (data.topics_error) {
						if (!$('.input-section:nth-of-type(8) .create-question-error').length) {
							$('.input-section:nth-of-type(8)').append('<div class="create-question-error">' + data.topics_error + '</div>');
							$('.input-section:nth-of-type(8) .create-question-error').velocity({opacity: 1}, 300);
						}
						else
							$('.input-section:nth-of-type(8) .create-question-error').text(data.topics_error);
						
						$('#topics-input').focus();
						form.data('submitted', false);
						return;
					}
					$('.input-section:nth-of-type(8) .create-question-error').remove();

					if (data.redirect) {
						window.location.href = data.redirect;
					}
				});
			}
		});
		return this;
	};

	$('#question-form-wrapper form').preventDoubleSubmission();

	$('#choice-c').on('input', function() {
		if ($('#choice-c').val() != '') {
			if ($('.input-section:nth-of-type(6)').css("display") == "none") {
				$('.input-section:nth-of-type(6)').css({"display": "block"});
				$('.input-section:nth-of-type(6)').velocity({"opacity": 1}, 300);
			}
		}
		else {
			if ($('.input-section:nth-of-type(6)').css("display") == "block") {
				$('#choice-d').val('');
				$('.input-section:nth-of-type(6)').velocity({"opacity": 0}, 300, function() {
					$('.input-section:nth-of-type(6)').css({"display": "none"});
				});
			}
			if ($('.input-section:nth-of-type(7)').css("display") == "block") {
				$('#choice-e').val('');
				$('.input-section:nth-of-type(7)').velocity({"opacity": 0}, 300, function() {
					$('.input-section:nth-of-type(7)').css({"display": "none"});
				});
			}
		}
	});

	$('#choice-d').on('input', function() {
		if ($('#choice-d').val() != '') {
			if ($('.input-section:nth-of-type(7)').css("display") == "none") {
				$('.input-section:nth-of-type(7)').css({"display": "block"});
				$('.input-section:nth-of-type(7)').velocity({"opacity": 1}, 300);
			}
		}
		else {
			if ($('.input-section:nth-of-type(7)').css("display") == "block") {
				$('#choice-e').val('');
				$('.input-section:nth-of-type(7)').velocity({"opacity": 0}, 300, function() {
					$('.input-section:nth-of-type(7)').css({"display": "none"});
				});
			}
		}
	});
});