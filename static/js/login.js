$(function() {
	jQuery.fn.preventDoubleSubmission = function() {
		$(this).on('submit', function(e) {
			var $form = $(this);

			if ($form.data('submitted') === true) {
				e.preventDefault();
			} 
			else {
				if ($('input[name="email"]').val() == '') {
					$('.error-message').eq(1).transition({opacity: 0}, 300, function() {
						$('.error-message').eq(1).text('');
					});
					$('.error-message').eq(0).css({"opacity": 0}).text('Please enter your email address.').transition({opacity: 1}, 300);
					$('input[name="email"]').focus();
					e.preventDefault();
				}
				else if ($('input[name="password"]').val() == '') {
					$('.error-message').eq(0).transition({opacity: 0}, 300, function() {
						$('.error-message').eq(0).text('');
					});
					$('.error-message').eq(1).css({"opacity": 0}).text('Please enter your password.').transition({opacity: 1}, 300);
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