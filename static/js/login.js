$(function() {
	$('form').on('submit', function(e) {
		e.preventDefault();
		if ($('input[name="email"]').val() == '') {
			$('.error-message').eq(0).text('Please enter your email address.');
			$('input[name="email"]').focus();
			return;
		}
		if ($('input[name="password"]').val() == '') {
			$('.error-message').eq(0).text('');
			$('.error-message').eq(1).text('Please enter your password.');
			$('input[name="password"]').focus();
			return;
		}
		$(this).unbind('submit').submit();

		/* prevent double submission of form */
		$('form').on('submit', function(e) {
			e.preventDefault();
		});
	});
});