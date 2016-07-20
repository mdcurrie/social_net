$(function() {
	$('form').on('submit', function(e) {
		e.preventDefault();
		if ($('input[name="email"]').val() == '') {
			$('.error-message').eq(0).text('Please enter your email address.');
			return;
		}
		if ($('input[name="password"]').val() == '') {
			$('.error-message').eq(1).text('Please enter your password.');
			return;
		}
		$(this).unbind('submit').submit();
	});
});