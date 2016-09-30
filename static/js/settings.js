$(function() {
	/* profile picture section */
	$('#user-profile-pic img').on('click', function() {
		$(this).css({"opacity": 0.1});
		$('#user-profile-pic form').css({"display": "block"});
		$('#user-profile-pic input').eq(1).focus();
	});

	/* validate profile pic URL before submitting form */
	$('#user-profile-pic form').on('submit', function(e) {
		e.preventDefault();
		var picture_link = $('#user-profile-pic form input').eq(1).val();

		if (!$('#profile-pic-error').length) {
			$('#user-profile-pic').append('<div id="profile-pic-error"></div>');
		}

		$("<img>", {
			src: picture_link,
			error: function() {
				$('#profile-pic-error').text("You must enter a link to an image.");
			},
			load: function() {
				$.post('/settings/updatePicture', {_xsrf: getCookie('_xsrf'), "profile-picture": picture_link}, function(data) {
					if (data.error) {
						$('#profile-pic-error').text(data.error);
					}
					else {
						$('#profile-pic-error').remove();
						$('#user-profile-pic img').attr({"src": picture_link});
						$('#current-user-profile-pic img').attr({"src": picture_link});
						$('#user-profile-pic form').css({"display": "none"});
						$('input[name="profile-picture"]').attr({"placeholder": picture_link}).val('');
						$('#user-profile-pic img').css({"opacity": 1});
					}
				});
			}
		});
	});

	/* username section */
	$('#username .wrapper').on('click', function() {
		$(this).css({"display": "none"});
		$('#username form').css({"display": "inline-block"});
		$('#username input').focus();
	});

	/* validate username before submitting form */
	$('#username form').on('submit', function(e) {
		e.preventDefault();
		var username = $('#username input').eq(1).val();

		if (!$('#username-error').length) {
			$('#username').append('<div id="username-error"></div>');
		}

		if (username == '') {
			$('#username-error').text("You must enter a username.");
			return;
		}
		if (!(/^[a-zA-Z0-9_. ]+$/i.test(username))) {
			$('#username-error').text("Your username can only contain letters, numbers, spaces, and underscores.");
			return;
		}
		if (username.length < 6 || username.length > 25) {
			$('#username-error').text("Your username must be between 6 and 25 characters long.");
			return;
		}

		$.post('/settings/updateUsername', {_xsrf: getCookie('_xsrf'), username: username}, function(data) {
			if (data.error) {
				$('#username-error').text(data.error);
			}
			else {
				$('#username-error').remove();
				$('#username .wrapper').text(username);
				$('#username form').css({"display": "none"});
				$('input[name="username"]').attr({"placeholder": username}).val('');
				$('#username .wrapper').css({"display": "inline-block"});
			}
		});
	});

	/* bio section */
	$('#bio .wrapper').on('click', function() {
		$(this).css({"display": "none"});
		$('#bio form').css({"display": "inline-block"});
		$('#bio input').focus();
	});

	$('#bio form').on('submit', function(e) {
		e.preventDefault();
		var bio = $('#bio input').eq(1).val();

		$.post('/settings/updateBio', {_xsrf: getCookie('_xsrf'), bio: bio}, function(data) {
			$('#bio .wrapper').text(bio);
			$('#bio form').css({"display": "none"});
			$('input[name="bio"]').attr({"placeholder": bio.slice(0, 140)}).val('');
			$('#bio .wrapper').css({"display": "inline-block"});
		});
	});

	/* email section */
	$('#email').on('click', function() {
		$(this).css({"display": "none"});
		$('.row:first-of-type .key').hide();
		$('.row:first-of-type form').css({"display": "block"});
		$('.row:first-of-type input').focus();
	});

	/* validate email before submitting form */
	$('.row:first-of-type form').on('submit', function(e) {
		e.preventDefault();
		var email = $('.row:first-of-type input').eq(1).val();

		if (!$('#email-error').length) {
			$('.row:first-of-type').append('<div class="error-message" id="email-error"></div>');
		}

		if (!(/^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/i.test(email))) {
			$('#email-error').text('That is not a valid email address.');
			$('.row:first-of-type input').eq(1).focus();
			return;
		}

		$.post('/settings/updateEmail', {_xsrf: getCookie('_xsrf'), email: email}, function(data) {
			if (data.error) {
				$('#email-error').text(data.error);
				$('.row:first-of-type input').eq(1).focus();
			}
			else {
				$('#email-error').remove();
				$('#email').text(email);
				$('.row:first-of-type form').css({"display": "none"});
				$('input[name="email"]').attr({"placeholder": email}).val('');
				$('#email').css({"display": "inline-block"});
				$('.row:first-of-type .key').show();
			}
		});
	});

	/* password section */
	$('#reset-password-button').on('click', function() {
		$(this).css({"display": "none"});
		$('.row:nth-of-type(2) .key').hide();
		$('.row:nth-of-type(2) form').css({"display": "block"});
		$('.row:nth-of-type(2) input').eq(1).focus();
	});

	/* validate passwords before submitting form */
	$('.row:nth-of-type(2) form').on('submit', function(e) {
		e.preventDefault();
		var old_password = $('.row:nth-of-type(2) input').eq(1).val();
		var new_password = $('.row:nth-of-type(2) input').eq(2).val();

		if (!$('#reset-password-error').length) {
			$('.row:nth-of-type(2)').append('<div class="error-message" id="reset-password-error"></div>');
		}

		if (new_password.length < 6) {
			$('#reset-password-error').text("Your new password must contain at least 6 characters.");
			$('.row:nth-of-type(2) input').eq(2).focus();
			return;
		}

		$.post('/settings/updatePassword', {_xsrf: getCookie('_xsrf'), "old-password": old_password, "new-password": new_password}, function(data) {
			if (data.error) {
				$('#reset-password-error').text(data.error);
				$('.row:nth-of-type(2) input').eq(1).val('').focus();
				$('.row:nth-of-type(2) input').eq(2).val('');
			}
			else {
				$('#reset-password-error').remove();
				$('.row:nth-of-type(2) form').css({"display": "none"});
				$('input[name="old-password"]').val('');
				$('input[name="new-password"]').val('');
				$('#reset-password-button').css({"display": "inline-block"});
				$('.row:nth-of-type(2) .key').show();
			}
		});
	});

	/* custom URL section */
	$('#custom-url').on('click', function() {
		$(this).css({"display": "none"});
		$('.row:nth-of-type(3) .key').hide();
		$('.row:nth-of-type(3) form').css({"display": "block"});
		$('.row:nth-of-type(3) input').eq(1).focus();
	});

	$('.row:nth-of-type(3) form').on('submit', function(e) {
		e.preventDefault();
		var custom_url = $('.row:nth-of-type(3) input').eq(1).val();

		if (!$('#custom-url-error').length) {
			$('.row:nth-of-type(3)').append('<div class="error-message" id="custom-url-error"></div>');
		}

		if (custom_url.length >= 1 && custom_url.length < 6) {
			$('#custom-url-error').text("Your custom URL must contain at least 6 characters.");
			$('.row:nth-of-type(3) input').eq(1).focus();
			return;
		}
		if (custom_url == "signup" || custom_url == "login" || custom_url == "feed" || custom_url == "settings") {
			$('#custom-url-error').text("Sorry, but that custom URL is not allowed.");
			$('.row:nth-of-type(3) input').eq(1).focus();
			return;
		}
		if (custom_url != '' && !(/^[a-zA-Z0-9_]+$/i.test(custom_url))) {
			$('#custom-url-error').text("Your custom URL can only contain letters, numbers, and, underscores.");
			$('.row:nth-of-type(3) input').eq(1).focus();
			return;
		}

		$.post('/settings/updateURL', {_xsrf: getCookie('_xsrf'), "custom-url": custom_url}, function(data) {
			if (data.error) {
				$('#custom-url-error').text(data.error);
				$('.row:nth-of-type(3) input').eq(1).focus();
			}
			else {
				$('#custom-url-error').remove();
				$('#custom-url').text('https://hive.com/' + custom_url);;
				$('.row:nth-of-type(3) form').css({"display": "none"});
				$('input[name="custom-url"]').attr({"placeholder": custom_url}).val('');
				$('#custom-url').css({"display": "block"});
				$('.row:nth-of-type(3) .key').show();
			}
		});
	});
});

function getCookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
}