$(function() {
	$('#username .wrapper').on('click', function() {
		$(this).css({"display": "none"});
		$('#username form').css({"display": "inline-block"});
		$('#username input').focus();
	});

	$('#username form').on('submit', function(e) {
		e.preventDefault();
		var username = $('#username input').eq(1).val();

		if (username == '')
			return;
		if (!(/^[a-zA-Z0-9_ ]+$/i.test(username)))
			return;
		if (username.length < 6)
			return;

		$('#username form').unbind('submit').submit();
	});

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

		if (!(/^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/i.test(email)))
			return;

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

		if (old_password.length < 6 || new_password.length < 6) {
			return;
		}

		$('.row:nth-of-type(2) form').unbind('submit').submit();
	})

	/* custom URL */
	$('#set-custom-url-button').on('click', function() {
		$(this).css({"display": "none"});
		$('.row:nth-of-type(3) form').css({"display": "block"});
		$('.row:nth-of-type(3) input').eq(1).focus();
	});

	$('.row:nth-of-type(3) form').on('submit', function(e) {
		e.preventDefault();
		var custom_url = $('.row:nth-of-type(3) input').eq(1).val();

		if (custom_url.length < 6) {
			return;
		}
		if (!(/^[a-zA-Z0-9_ ]+$/i.test(custom_url))) {
			return;
		}

		$('.row:nth-of-type(3) form').unbind('submit').submit();
	})

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
				;
			},
			load: function() {
				$('#user-profile-pic form').unbind('submit').submit();
			}
		});
	});
});