$(function() {
	jQuery.fn.preventDoubleSubmission = function() {
		$(this).on('submit', function(e) {
			var $form = $(this);

			if ($form.data('submitted') === true) {
				e.preventDefault();
			} 
			else {
				if ($('input[name="email"]').val() == '') {
					$('.error-message').eq(0).text('Please enter your email address.');
					$('input[name="email"]').focus();
					e.preventDefault();
				}
				else if ($('input[name="password"]').val() == '') {
					$('.error-message').eq(0).text('');
					$('.error-message').eq(1).text('Please enter your password.');
					$('input[name="password"]').focus();
					e.preventDefault();
				}
				else {
					$form.data('submitted', true);
				}
			}
		});

		return this;
	};

	$('form').preventDoubleSubmission();
});