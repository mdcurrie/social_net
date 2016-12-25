$(function() {
	var userAgent = navigator.userAgent || navigator.vendor || window.opera;
	if (userAgent.match( /iPad/i ) || userAgent.match( /iPhone/i ) || userAgent.match( /iPod/i ))
	{
		userAgent = 'iOS';

	}

	var focusTimer;
	var form_inputs = $('main input');
	$(form_inputs).on('focusout', function() {
		clearTimeout(focusTimer);
		focusTimer = setTimeout(function() {
			if (form_inputs.is(':focus')) {
				;
			}
			else {
				$('#mobile-tab-bar-wrapper').velocity({"translateY": 0}, {display: "block", duration: 250});
			}
		}, 600);
	});

	$(form_inputs).on('focusin', function() {
		clearTimeout(focusTimer);
		$('#mobile-tab-bar-wrapper').velocity({"translateY": 0}, {duration: 650}).velocity({"translateY": 46}, {display: "none", duration: 250});
	});

	/* profile picture section */
	var picture_upload_callback = function (res) {
        if (res.success === true) {
			$.post('/settings/updatePicture', {_xsrf: getCookie('_xsrf'), "profile-picture": res.data.link}, function(data) {
				if (data.error) {
					$('#profile-pic-error').velocity({"opacity": 0}, 0).text(data.error).velocity({opacity: 1}, 300);
				}
				else {
					$('#profile-pic-error').remove();
					$('#user-profile-pic .dropzone > img').attr({"src": res.data.link});
					$('#current-user-profile-pic img').attr({"src": res.data.link});	
    			}
    		});
		}
        else {
        	$('#profile-pic-error').velocity({"opacity": 0}, 0).text("There was an error uploading your image, please try again later.").velocity({opacity: 1}, 300);
        }
    };

    new Imgur({
        clientid: 'a512d4db12a3c8d',
        callback: picture_upload_callback
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
			$('#username-error').velocity({"opacity": 0}, 0).text("You must enter a username.").velocity({opacity: 1}, 300);
			return;
		}
		if (!(/^[a-zA-Z0-9_. ]+$/i.test(username))) {
			$('#username-error').velocity({"opacity": 0}, 0).text("Your username can only contain letters, numbers, spaces, and underscores.").velocity({opacity: 1}, 300);
			return;
		}
		if (username.length < 6 || username.length > 25) {
			$('#username-error').velocity({"opacity": 0}, 0).text("Your username must be between 6 and 25 characters long.").velocity({opacity: 1}, 300);
			return;
		}

		$.post('/settings/updateUsername', {_xsrf: getCookie('_xsrf'), username: username}, function(data) {
			if (data.error) {
				$('#username-error').velocity({"opacity": 0}, 0).text(data.error).velocity({opacity: 1}, 300);
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
			if (bio == '') {
				$('input[name="bio"]').attr({"placeholder": "About you"});
				$('#bio .wrapper').addClass("active").text("About you");
			}
			else {
				$('input[name="bio"]').attr({"placeholder": bio.slice(0, 140)}).val('');
				$('#bio .wrapper').removeClass("active").text(bio.slice(0, 140));
			}
			$('#bio .wrapper').css({"display": "inline-block"});
		});
	});

	/* email section */
	$('#email').on('click', function() {
		row = $('.row:first-of-type');
		row_backer = $('.row:first-of-type .backer');
		form_wrapper = $('.row:first-of-type .form-wrapper');

		sequence = [
			{e: row,          p: {height: row.height() + 130}, o: {duration: 500}},
			{e: row_backer,   p: {opacity: 1},                 o: {duration: 0, sequenceQueue: false}},
			{e: row_backer,   p: {translateX: "100%"},         o: {duration: 300, easing: [1.000, 0.000, 1.000, 1.000], sequenceQueue: false}},
			{e: form_wrapper, p: {translateX: "100%"},         o: {duration: 500, easing: [1.000, 0.000, 0.585, 1.000], sequenceQueue: false}},
			{e: row_backer,   p: {opacity: 0},                 o: {duration: 0, complete: function() {
				if (userAgent != 'iOS') {
					$('.row:first-of-type input').eq(1).focus();
				}}}}
		];

		$.Velocity.RunSequence(sequence);
	});

	/* validate email before submitting form */
	$('.row:first-of-type form').on('submit', function(e) {
		e.preventDefault();
		var email = $('.row:first-of-type input').eq(1).val();

		if (!$('#email-error').length) {
			$('.row:first-of-type form').append('<div class="error-message" id="email-error"></div>');
		}

		if (!(/^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/i.test(email))) {
			$('#email-error').velocity({opacity: 0}, 0).text('That is not a valid email address.').velocity({opacity: 1}, {display: "block"}, 300);
			return;
		}

		$.post('/settings/updateEmail', {_xsrf: getCookie('_xsrf'), email: email}, function(data) {
			if (data.error) {
				$('#email-error').velocity({opacity: 0}, 0).text(data.error).velocity({opacity: 1}, {display: "block"}, 300);
			}
			else {
				$('#email-error').remove();
				$('#email').text(email);
				$('input[name="email"]').attr({"placeholder": email}).val('');
				$('input').blur();

				row = $('.row:first-of-type');
				value = $('.row:first-of-type .value')
				form_wrapper = $('.row:first-of-type .form-wrapper');
				backer = $('.row:first-of-type .backer');

				row.velocity({height: value.height() + 51}, 500);
				form_wrapper.velocity({translateX: 0}, 300, [1.000, 0.000, 1.000, 1.000]);
				backer.velocity({opacity: 1}, 0).velocity({translateX: 0}, {duration: 500, easing: [1.000, 0.000, 0.585, 1.000]});
			}
		});
	});

	/* password section */
	$('#reset-password-button').on('click', function() {
		row = $('.row:nth-of-type(2)');
		row_backer = $('.row:nth-of-type(2) .backer');
		form_wrapper = $('.row:nth-of-type(2) .form-wrapper');

		sequence = [
			{e: row,          p: {height: row.height() + 150}, o: {duration: 500}},
			{e: row_backer,   p: {opacity: 1},                 o: {duration: 0, sequenceQueue: false}},
			{e: row_backer,   p: {translateX: "100%"},         o: {duration: 300, easing: [1.000, 0.000, 1.000, 1.000], sequenceQueue: false}},
			{e: form_wrapper, p: {translateX: "100%"},         o: {duration: 500, easing: [1.000, 0.000, 0.585, 1.000], sequenceQueue: false}},
			{e: row_backer,   p: {opacity: 0},                 o: {duration: 0, complete: function() {
				if (userAgent != 'iOS') {
					$('.row:nth-of-type(2) input').eq(1).focus();
				}}}}
		];

		$.Velocity.RunSequence(sequence);
	});

	/* validate passwords before submitting form */
	$('.row:nth-of-type(2) form').on('submit', function(e) {
		e.preventDefault();
		var old_password = $('.row:nth-of-type(2) input').eq(1).val();
		var new_password = $('.row:nth-of-type(2) input').eq(2).val();

		if (!$('#reset-password-error').length) {
			$('.row:nth-of-type(2) form').append('<div class="error-message" id="reset-password-error"></div>');
		}

		if (new_password.length < 6) {
			$('#reset-password-error').velocity({opacity: 0}, 0).text("Your new password must contain at least 6 characters.").velocity({opacity: 1}, {display: "block"}, 300);
			return;
		}

		$.post('/settings/updatePassword', {_xsrf: getCookie('_xsrf'), "old-password": old_password, "new-password": new_password}, function(data) {
			if (data.error) {
				$('#reset-password-error').velocity({"opacity": 0}, 0).text(data.error).velocity({opacity: 1}, {display: "block"}, 300);
				$('.row:nth-of-type(2) input').eq(1).val('');
				$('.row:nth-of-type(2) input').eq(2).val('');
			}
			else {
				$('#reset-password-error').remove();
				$('input[name="old-password"]').val('');
				$('input[name="new-password"]').val('');
				$('input').blur();

				row = $('.row:nth-of-type(2)');
				value = $('.row:nth-of-type(2) .value')
				form_wrapper = $('.row:nth-of-type(2) .form-wrapper');
				backer = $('.row:nth-of-type(2) .backer');

				row.velocity({height: value.height() + 51}, 500);
				form_wrapper.velocity({translateX: 0}, 300, [1.000, 0.000, 1.000, 1.000]);
				backer.velocity({opacity: 1}, 0).velocity({translateX: 0}, {duration: 500, easing: [1.000, 0.000, 0.585, 1.000]});
			}
		});
	});

	/* custom URL section */
	$('#custom-url').on('click', function() {
		row = $('.row:nth-of-type(3)');
		row_backer = $('.row:nth-of-type(3) .backer');
		form_wrapper = $('.row:nth-of-type(3) .form-wrapper');

		sequence = [
			{e: row,          p: {height: row.height() + 125}, o: {duration: 500}},
			{e: row_backer,   p: {opacity: 1},                 o: {duration: 0, sequenceQueue: false}},
			{e: row_backer,   p: {translateX: "100%"},         o: {duration: 300, easing: [1.000, 0.000, 1.000, 1.000], sequenceQueue: false}},
			{e: form_wrapper, p: {translateX: "100%"},         o: {duration: 500, easing: [1.000, 0.000, 0.585, 1.000], sequenceQueue: false}},
			{e: row_backer,   p: {opacity: 0},                 o: {duration: 0, complete: function() {
				if (userAgent != 'iOS') {
					$('.row:nth-of-type(3) input').eq(1).focus();
				}}}}
		];

		$.Velocity.RunSequence(sequence);
	});

	$('.row:nth-of-type(3) form').on('submit', function(e) {
		e.preventDefault();
		var custom_url = $('.row:nth-of-type(3) input').eq(1).val();

		if (!$('#custom-url-error').length) {
			$('.row:nth-of-type(3) form').append('<div class="error-message" id="custom-url-error"></div>');
		}

		if (custom_url.length >= 1 && custom_url.length < 6) {
			$('#custom-url-error').velocity({"opacity": 0}, 0).text("Your custom URL must contain at least 6 characters.").velocity({opacity: 1}, {display: "block"}, 300);
			return;
		}
		if (custom_url.length > 20) {
			$('#custom-url-error').velocity({"opacity": 0}, 0).text("Sorry, but your custom URL can only contain up to 20 characters.").velocity({opacity: 1}, {display: "block"}, 300);
			return;
		}
		if (["feed", "login", "logout", "signup", "settings", "email_lookup", "users", "follow_or_hate", "questions", "comments", "favorite_or_share", "vote", "create_question", "add_topic", "topics", "favorites", "search"].indexOf(custom_url.toLowerCase()) > -1) {
			$('#custom-url-error').velocity({"opacity": 0}, 0).text("Sorry, but that custom URL is not allowed.").velocity({opacity: 1}, {display: "block"}, 300);
			return;
		}
		if (custom_url != '' && !(/^[a-zA-Z0-9_]+$/i.test(custom_url))) {
			$('#custom-url-error').velocity({"opacity": 0}, 0).text("Your custom URL can only contain letters, numbers, and, underscores.").velocity({opacity: 1}, {display: "block"}, 300);
			return;
		}

		$.post('/settings/updateURL', {_xsrf: getCookie('_xsrf'), "custom-url": custom_url}, function(data) {
			if (data.error) {
				$('#custom-url-error').velocity({"opacity": 0}, 0).text(data.error).velocity({opacity: 1}, {display: "block"}, 300);
			}
			else {
				if (custom_url.length == '') {
					$('#custom-url').replaceWith('<div id="custom-url"><button class="form-button" id="custom-url-button">Set Custom URL</button></div>');
					$('#custom-url').on('click', function() {
						row = $('.row:nth-of-type(3)');
						form = $('.row:nth-of-type(3) form');
						row_backer = $('.row:nth-of-type(3) .backer');
						form_wrapper = $('.row:nth-of-type(3) .form-wrapper');

						row.velocity({"height": form.height() + 70}, 500);
						row_backer.velocity({opacity: 1}, 0).velocity({translateX: "100%"}, {duration: 300, easing: [1.000, 0.000, 1.000, 1.000]});
						form_wrapper.velocity({translateX: "100%"}, 500, [1.000, 0.000, 0.585, 1.000], function() {
							if (userAgent != 'iOS') {
								$('.row:nth-of-type(3) input').eq(1).focus();
							}
						});
					});
				}
				else {
					$('#custom-url').text('https://hive.com/' + custom_url);
				}
				$('#custom-url-error').remove();
				$('input[name="custom-url"]').attr({"placeholder": custom_url}).val('');
				$('input').blur();

				row = $('.row:nth-of-type(3)');
				value = $('.row:nth-of-type(3) .value');
				row_backer = $('.row:nth-of-type(3) .backer');
				form_wrapper = $('.row:nth-of-type(3) .form-wrapper');

				row.velocity({height: value.height() + 51}, 500);
				form_wrapper.velocity({translateX: 0}, 300, [1.000, 0.000, 1.000, 1.000]);
				row_backer.velocity({opacity: 1}, 0).velocity({translateX: 0}, {duration: 500, easing: [1.000, 0.000, 0.585, 1.000]});
			}
		});
	});
});

function getCookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
}