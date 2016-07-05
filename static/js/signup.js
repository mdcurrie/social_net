var valid_username = false;
var valid_email    = false;
var valid_password = false;

$(function() {
	var timer_username = null;
	$('input[name="username"]').on('input', function() {
		clearTimeout(timer_username);
		timer_username = setTimeout(validateUsername, 500);
	});

	var timer_email = null;
	$('input[name="email"]').on('input', function() {
		clearTimeout(timer_email);
		timer_email = setTimeout(validateEmail, 500);
	});

	var timer_password = null;
	$('input[name="password"]').on('input', function() {
		clearTimeout(timer_password);
		timer_password = setTimeout(validatePassword, 500);
	});

	$('form').on('submit', function(e) {
		e.preventDefault();
		if (valid_username && valid_email && valid_password) {
			$('form').unbind('submit').submit();
		}
	});
});

function validateUsername() {
	var username  = $('input[name="username"]').val();
	var error     = $('.error-message').eq(0);

	valid_username = false;

	if (!(/^[a-zA-Z0-9_]+$/i.test(username))) {
		error.text('Letters, numbers, and underscores only.');
		error.css({"display": "block", "color": "red"});
	}
	else if (username.length < 6) {
		error.text('Your username must be at least 6 characters long.');
		error.css({"display": "block", "color": "red"});
	}
	else {
		$.getJSON('/username_lookup', {username: username}, function(data) {
			if (data.username_taken) {
				error.text('That username is already taken.');
				error.css({"display": "block", "color": "red"});
			}
			else {
				error.text('Great choice!');
				error.css({"display": "block", "color": "green"});
				valid_username = true;
			}
		});
	}
	error.animate({"opacity": 1}, 100);
}

function validateEmail() {
	var email     = $('input[name="email"]').val();
	var error     = $('.error-message').eq(1);
	
	valid_email = false;

	if (!(/^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/i.test(email))) {
		error.text('Please enter a valid email address.');
		error.css({"display": "block", "color": "red"});
	}
	else {
		$.getJSON('email_lookup', {email: email}, function(data) {
			if (data.email_taken) {
				error.text('That email is already taken.');
				error.css({"display": "block", "color": "red"});
			}
			else {
				error.text('Cool.');
				error.css({"display": "block", "color": "green"});
				valid_email = true;
			}
		});
	}
	error.animate({"opacity": 1}, 100);
}

function validatePassword() {
	var password  = $('input[name="password"]').val();
	var error     = $('.error-message').eq(2);

	valid_password = false;

	if (password.length < 6) {
		error.text('Your password must be at least 6 characters long.');
		error.css({"display": "block", "color": "red"});	
	}
	else {
		error.text('Looks good.');
		error.css({"display": "block", "color": "green"});
		valid_password = true;
	}
	error.animate({"opacity": 1}, 100);
}