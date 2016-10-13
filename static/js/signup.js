var valid_username = false;
var valid_email    = false;
var valid_password = false;

$(function() {
	var timer_username = null;
	$('input[name="username"]').on('input', function() {
		clearTimeout(timer_username);
		timer_username = setTimeout(validateUsername, 1000);
	});

	var timer_email = null;
	$('input[name="email"]').on('input', function() {
		clearTimeout(timer_email);
		timer_email = setTimeout(validateEmail, 1000);
	});

	var timer_password = null;
	$('input[name="password"]').on('input', function() {
		clearTimeout(timer_password);
		timer_password = setTimeout(validatePassword, 1000);
	});

	jQuery.fn.preventDoubleSubmission = function() {
		$(this).on('submit', function(e) {
			var $form = $(this);

			if ($form.data('submitted') === true) {
				e.preventDefault();
			}
			else {
				validateUsername();
				validateEmail(false);
				validatePassword();
				if (!valid_username || !valid_email || !valid_password) {
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

function validateUsername() {
	var username = $('input[name="username"]').val();
	var error    = $('.error-message').eq(0);

	valid_username = false;

	if (username == '') {
		error.text('');
		return;
	}
	if (!(/^[a-zA-Z0-9_. ]+$/i.test(username))) {
		error.css({"opacity": 0, "display": "block", "color": "#e64c65"}).text('Letters, numbers, spaces, and underscores only.').transition({opacity: 1}, 300);
	}
	else if (username.length < 6 || username.length > 25) {
		error.css({"opacity": 0, "display": "block", "color": "#e64c65"}).text('Your username must be 6-25 characters long.').transition({opacity: 1}, 300);
	}
	else {
		error.css({"opacity": 0, "display": "block", "color": "#2eb398"}).text('Great choice!').transition({opacity: 1}, 300);
		valid_username = true;
	}
}

function validateEmail(send_json=true) {
	var email = $('input[name="email"]').val();
	var error = $('.error-message').eq(1);
	
	valid_email = false;

	if (email == '') {
		error.text('');
		return;
	}
	if (!(/^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/i.test(email))) {
		error.css({"opacity": 0, "display": "block", "color": "#e64c65"}).text('Please enter a valid email address.').transition({opacity: 1}, 300);
		return;
	}
	if (send_json == false) {
		valid_email = true;
		return;
	}
	else {
		$.getJSON('email_lookup', {email: email}, function(data) {
			if (data.email_taken) {
				error.css({"opacity": 0, "display": "block", "color": "#e64c65"}).text('That email is already taken.').transition({opacity: 1}, 300);
			}
			else {
				error.css({"opacity": 0, "display": "block", "color": "#2eb398"}).text('Looks good.').transition({opacity: 1}, 300);
				valid_email = true;
			}
		});
	}
}

function validatePassword() {
	var password = $('input[name="password"]').val();
	var error    = $('.error-message').eq(2);

	valid_password = false;

	if (password == '') {
		error.text('');
		return;
	}
	if (password.length < 6) {
		error.css({"opacity": 0, "display": "block", "color": "#e64c65"}).text('Your password must be at least 6 characters long.').transition({opacity: 1}, 300);	
	}
	else {
		error.css({"opacity": 0, "display": "block", "color": "#2eb398"}).text("Don't share it with anyone.").transition({opacity: 1}, 300);
		valid_password = true;
	}
}