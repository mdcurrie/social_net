$(function() {
	$('.comment-count .svg-image').on('click', function() {
		var question_id = $(this).parents('.question-wrapper').attr('id');
		$.get('/comments/' + question_id, function(data) {
			$('#off-canvas-comments').html(data);
			$('.all-comments').scrollTop($('.all-comments')[0].scrollHeight);

			$('.comment-form form').off('submit');
			$('.comment-form form').on('submit', function(e) {
		        e.preventDefault();
		        submitForm();
		    });

			$('.comment-form img').off('click');
		    $('.comment-form img').on('click', function() {
		        submitForm();
		    });
		});

		$('#off-canvas-comments').animate({right: 0}, 300, function() {
			$('#content-overlay').css({'z-index': 40});
			$('#content-overlay').animate({opacity: 0.5}, 200);
		});
	});

	$('#content-overlay').on('click', function() {
		$('#off-canvas-comments').animate({right: '-33%'}, 300, function() {
			$('#content-overlay').animate({opacity: 0}, 200, function() {
				$('#content-overlay').css({'z-index': -10});
			});
		});
	});

	$('#modal form').on('submit', function(e) {
		e.preventDefault();
		if ($('#question-title').val() == '') {
			$('#question-error').text('Please enter a question.');
			return;
		}

		var an1 = $('#answer-1').val();
		var an2 = $('#answer-2').val();
		var an3 = $('#answer-3').val();
		var an4 = $('#answer-4').val();
		var an5 = $('#answer-5').val();

		if ((an1 == '') || (an2 == '')) {
			$('#question-error').text('Please fill out option 1 and option 2.');
			return;
		}
		if (an1 == an2) {
			$('#question-error').text('Please enter unique options.');
			return;
		}
		if (an3 != '' && (an3 == an1 || an3 == an2)) {
			$('#question-error').text('Please enter unique options.');
			return;
		}
		if (an4 != '' && (an4 == an1 || an4 == an2 || an4 == an3)) {
			$('#question-error').text('Please enter unique options.');
			return;
		}
		if (an5 != '' && (an5 == an1 || an5 == an2 || an5 == an3 || an5 == an4)) {
			$('#question-error').text('Please enter unique options.');
			return;
		}

		$(this).unbind('submit').submit();
	});

	$('#answer-2').on('change paste keyup', function() {
		if ($('#answer-2').val()) {
			$('#answer-3').css('display', 'block');
		}
		else {
			$('#answer-3').css('display', 'none');
		}
	});
	$('#answer-3').on('change paste keyup', function() {
		if ($('#answer-3').val()) {
			$('#answer-4').css('display', 'block');
		}
		else {
			$('#answer-4').css('display', 'none');
		}
	});
	$('#answer-4').on('change paste keyup', function() {
		if ($('#answer-4').val()) {
			$('#answer-5').css('display', 'block');
		}
		else {
			$('#answer-5').css('display', 'none');
		}
	});
});