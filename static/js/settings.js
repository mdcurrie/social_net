$(function() {
	/* profile picture */
	$('#user-profile-pic img').on('click', function() {
		$(this).css({"opacity": 0.1});
		$('#user-profile-pic form').css({"display": "block"});
		$('#user-profile-pic input').eq(1).focus();
	});

	$('#user-profile-pic form').on('submit', function(e) {
		e.preventDefault();
		var picture_link = $('#user-profile-pic form input').eq(1).val();

		$("<img>", {
			src: picture_link,
			error: function() {
				$('#profile-pic-error').text("You must enter a link to an image.");
				$('#profile-pic-error').css({"display": "block"});
			},
			load: function() {
				$('#user-profile-pic form').unbind('submit').submit();
			}
		});
	});

	/* username */
	$('#username .wrapper').on('click', function() {
		$(this).css({"display": "none"});
		$('#username form').css({"display": "inline-block"});
		$('#username input').focus();
	});

	$('#username form').on('submit', function(e) {
		e.preventDefault();
		var username = $('#username input').eq(1).val();

		if (username == '') {
			$('#username-error').text("You must enter a username.");
			$('#username-error').css({"display": "block"});
			return;
		}
		if (!(/^[a-zA-Z0-9_ ]+$/i.test(username))) {
			$('#username-error').text("Your username can only contain letters, numbers, and underscores.");
			$('#username-error').css({"display": "block"});
			return;
		}
		if (username.length < 6 || username.length > 25) {
			$('#username-error').text("Your username must be between 6 and 25 characters long.");
			$('#username-error').css({"display": "block"});
			return;
		}

		$('#username form').unbind('submit').submit();
	});

	/* bio */
	$('#bio .wrapper').on('click', function() {
		$(this).css({"display": "none"});
		$('#bio form').css({"display": "inline-block"});
		$('#bio input').focus();
	});

	/* email */
	$('#email').on('click', function() {
		$(this).css({"display": "none"});
		$('.row:first-of-type form').css({"display": "block"});
		$('.row:first-of-type input').focus();
	});

	$('.row:first-of-type form').on('submit', function(e) {
		e.preventDefault();
		var email = $('.row:first-of-type input').eq(1).val();

		if (!(/^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/i.test(email))) {
			$('#email-error').text('That is not a valid email address.');
			$('#email-error').css({"display": "block"});
			return;
		}

		$('.row:first-of-type form').unbind('submit').submit();
	});

	/* password */
	$('#reset-password-button').on('click', function() {
		$(this).css({"display": "none"});
		$('.row:nth-of-type(2) form').css({"display": "block"});
		$('.row:nth-of-type(2) input').eq(1).focus();
	});

	$('.row:nth-of-type(2) form').on('submit', function(e) {
		e.preventDefault();
		var old_password = $('.row:nth-of-type(2) input').eq(1).val();
		var new_password = $('.row:nth-of-type(2) input').eq(2).val();

		if (new_password.length < 6) {
			$('#reset-password-error').text("Your new password must contain at least 6 characters.");
			$('#reset-password-error').css({"display": "block"});
			return;
		}

		$('.row:nth-of-type(2) form').unbind('submit').submit();
	});

	/* custom URL */
	$('#custom-url').on('click', function() {
		$(this).css({"display": "none"});
		$('.row:nth-of-type(3) form').css({"display": "block"});
		$('.row:nth-of-type(3) input').eq(1).focus();
	});

	$('.row:nth-of-type(3) form').on('submit', function(e) {
		e.preventDefault();
		var custom_url = $('.row:nth-of-type(3) input').eq(1).val();

		if (custom_url.length >= 1 && custom_url.length < 6) {
			$('#custom-url-error').text("Your custom URL must contain at least 6 characters.");
			$('#custom-url-error').css({"display": "block"});
			return;
		}
		if (custom_url == "signup" || custom_url == "login" || custom_url == "feed" || custom_url == "settings") {
			$('#custom-url-error').text("Sorry, but that custom URL is not allowed.");
			$('#custom-url-error').css({"display": "block"});
			return;
		}
		if (custom_url != '' && !(/^[a-zA-Z0-9_ ]+$/i.test(custom_url))) {
			$('#custom-url-error').text("Your custom URL can only contain letters, numbers, and, underscores.");
			$('#custom-url-error').css({"display": "block"});
			return;
		}

		$('.row:nth-of-type(3) form').unbind('submit').submit();
	});
});