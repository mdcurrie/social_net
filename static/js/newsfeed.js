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
			$('input[name="comment"]').focus();
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
});