$(function() {
	$('input[name="username"]').on('change paste keyup', function(e) {
		var error = $('.error-message').eq(0);
			if (!validUsername()) {
				error.text('Letters, numbers, and underscores only.');
				error.css({"display": "block", "color": "red"});
			}
			else if ($('input[name="username"]').val().length < 6) {
				error.text('Your username must be at least 6 characters long.');
				error.css({"display": "block", "color": "red"});
			}
			else {
				error.text('Great choice!');
				error.css({"display": "block", "color": "green"});
			}
			error.animate({"opacity": 1}, 100);
	});

	$('input[name="email"]').on('change paste keyup', function() {
		var error = $('.error-message').eq(1);
		if ($('input[name="email"]').val()) {
			if (!validEmail()) {
				error.text('Please enter a valid email address.');
				error.css({"display": "block", "color": "red"});
			}
			else {
				error.text('Cool.');
				error.css({"display": "block", "color": "green"});
			}
			error.animate({"opacity": 1}, 100);
		}
	});

	$('input[name="password"]').on('change paste keyup', function() {
		var error = $('.error-message').eq(2);
		if ($('input[name="password"]').val()) {
			if (!validPassword()) {
				error.text('Your password must be at least 6 characters long.');
				error.css({"display": "block", "color": "red"});
			}
			else {
				error.text('Looks good.');
				error.css({"display": "block", "color": "green"});
			}
			error.animate({"opacity": 1}, 100);
		}
	});

});

function validUsername() {
	var username = $('input[name="username"]').val();
	return (/^[a-zA-Z0-9_]+$/i.test(username));
}

function validEmail() {
	var email = $('input[name="email"]').val();
	return (/^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/i.test(email));
}

function validPassword() {
	var password = $('input[name="password"]').val();
	return password.length >= 6;
}