$(function() {
	var userAgent = navigator.userAgent || navigator.vendor || window.opera;
	if (userAgent.match( /iPad/i ) || userAgent.match( /iPhone/i ) || userAgent.match( /iPod/i ))
	{
		userAgent = 'iOS';

	}

	$('input').on('focusin', function() {
		$('#mobile-tab-bar-wrapper').velocity({translateY: 46}, 0);
	});

	$('input').on('focusout', function() {
		$('#mobile-tab-bar-wrapper').velocity({translateY: 0}, 0);
	});

	/* profile picture section */
	var picture_upload_callback = function (res) {
        if (res.success === true) {
        	$("<img>", {
        		src: res.data.link,
        		error: function() {
        			console.log('imgur error');
        		},
        		load: function() {
        			$.post('/settings/updatePicture', {_xsrf: getCookie('_xsrf'), "profile-picture": res.data.link}, function(data) {
        				if (data.error) {
							$('#profile-pic-error').velocity({"opacity": 0}, 0).text(data.error).velocity({opacity: 1}, 300);
						}
						else {
							$('#profile-pic-error').remove();
							$('#user-profile-pic img').attr({"src": res.data.link});
							$('#current-user-profile-pic img').attr({"src": res.data.link});	
	        			}
	        		});
        		}
        	});
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
		if (userAgent != 'iOS') {
			$('#username input').focus();
		}
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
		if (userAgent != 'iOS') {
			$('#bio input').focus();
		}
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
		row = $('.row:first-of-type');
		row_backer = $('.row:first-of-type .backer');
		form_wrapper = $('.row:first-of-type .form-wrapper');

		row.velocity({"height": row.height() + 110}, 500);
		row_backer.velocity({translateX: "100%"}, 300, [1.000, 0.000, 1.000, 1.000]);
		form_wrapper.velocity({translateX: "100%"}, 500, [1.000, 0.000, 0.585, 1.000], function() {
			if (userAgent != 'iOS') {
				$('.row:first-of-type input').eq(1).focus();
			}
		});
	});

	/* validate email before submitting form */
	$('.row:first-of-type form').on('submit', function(e) {
		e.preventDefault();
		var email = $('.row:first-of-type input').eq(1).val();

		if (!$('#email-error').length) {
			$('.row:first-of-type .form-wrapper').append('<div class="error-message" id="email-error"></div>');
			$('#email-error').hide();
		}

		if (!(/^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/i.test(email))) {
			$('#email-error').velocity({opacity: 0}, 0).text('That is not a valid email address.').velocity({opacity: 1}, {display: "block"}, 300, function() {
				if (userAgent != 'iOS') {
					$('.row:first-of-type input').eq(1).focus();
				}
			});
			return;
		}

		$.post('/settings/updateEmail', {_xsrf: getCookie('_xsrf'), email: email}, function(data) {
			if (data.error) {
				$('#email-error').velocity({opacity: 0}, 0).text(data.error).velocity({opacity: 1}, {display: "block"}, 300, function() {
					if (userAgent != 'iOS') {
						$('.row:first-of-type input').eq(1).focus();
					}
				});
				return;
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
				backer.velocity({translateX: 0}, 500, [1.000, 0.000, 0.585, 1.000]);
			}
		});
	});

	/* password section */
	$('#reset-password-button').on('click', function() {
		row = $('.row:nth-of-type(2)');
		row_backer = $('.row:nth-of-type(2) .backer');
		form_wrapper = $('.row:nth-of-type(2) .form-wrapper');

		row.velocity({"height": row.height() + 130}, 500);
		row_backer.velocity({translateX: "100%"}, 300, [1.000, 0.000, 1.000, 1.000]);
		form_wrapper.velocity({translateX: "100%"}, 500, [1.000, 0.000, 0.585, 1.000], function() {
			if (userAgent != 'iOS') {
				$('.row:nth-of-type(2) input').eq(1).focus();
			}
		});
	});

	/* validate passwords before submitting form */
	$('.row:nth-of-type(2) form').on('submit', function(e) {
		e.preventDefault();
		var old_password = $('.row:nth-of-type(2) input').eq(1).val();
		var new_password = $('.row:nth-of-type(2) input').eq(2).val();

		if (!$('#reset-password-error').length) {
			$('.row:nth-of-type(2) .form-wrapper').append('<div class="error-message" id="reset-password-error"></div>');
			$('#reset-password-error').hide()
		}

		if (new_password.length < 6) {
			$('#reset-password-error').velocity({opacity: 0}, 0).text("Your new password must contain at least 6 characters.").velocity({opacity: 1}, {display: "block"}, 300, function() {
				if (userAgent != 'iOS') {
					$('.row:nth-of-type(2) input').eq(2).focus();
				}
			});
			return;
		}

		$.post('/settings/updatePassword', {_xsrf: getCookie('_xsrf'), "old-password": old_password, "new-password": new_password}, function(data) {
			if (data.error) {
				$('#reset-password-error').velocity({"opacity": 0}, 0).text(data.error).velocity({opacity: 1}, {display: "block"}, 300);
				$('.row:nth-of-type(2) input').eq(1).val('');
				$('.row:nth-of-type(2) input').eq(2).val('');
				if (userAgent != 'iOS') {
					$('.row:nth-of-type(2) input').eq(1).focus();
				}
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
				backer.velocity({translateX: 0}, 500, [1.000, 0.000, 0.585, 1.000]);
			}
		});
	});

	/* custom URL section */
	$('#custom-url').on('click', function() {
		row = $('.row:nth-of-type(3)');
		row_backer = $('.row:nth-of-type(3) .backer');
		form_wrapper = $('.row:nth-of-type(3) .form-wrapper');

		row.velocity({"height": row.height() + 115}, 500);
		row_backer.velocity({translateX: "100%"}, 300, [1.000, 0.000, 1.000, 1.000]);
		form_wrapper.velocity({translateX: "100%"}, 500, [1.000, 0.000, 0.585, 1.000], function() {
			if (userAgent != 'iOS') {
				$('.row:nth-of-type(3) input').eq(1).focus();
			}
		});
	});

	$('.row:nth-of-type(3) form').on('submit', function(e) {
		e.preventDefault();
		var custom_url = $('.row:nth-of-type(3) input').eq(1).val();

		if (!$('#custom-url-error').length) {
			$('.row:nth-of-type(3) .form-wrapper').append('<div class="error-message" id="custom-url-error"></div>');
			$('#custom-url-error').hide();
		}

		if (custom_url.length >= 1 && custom_url.length < 6) {
			$('#custom-url-error').velocity({"opacity": 0}, 0).text("Your custom URL must contain at least 6 characters.").velocity({opacity: 1}, {display: "block"}, 300, function() {
				if (userAgent != 'iOS') {
					$('.row:nth-of-type(3) input').eq(1).focus();
				}
			});
			return;
		}
		if (custom_url.length > 20) {
			$('#custom-url-error').velocity({"opacity": 0}, 0).text("Sorry, but your custom URL can only contain up to 20 characters.").velocity({opacity: 1}, {display: "block"}, 300, function() {
				if (userAgent != 'iOS') {
					$('.row:nth-of-type(3) input').eq(1).focus();
				}
			});
			return;
		}
		if (custom_url == "signup" || custom_url == "login" || custom_url == "feed" || custom_url == "settings") {
			$('#custom-url-error').velocity({"opacity": 0}, 0).text("Sorry, but that custom URL is not allowed.").velocity({opacity: 1}, {display: "block"}, 300, function() {
				if (userAgent != 'iOS') {
					$('.row:nth-of-type(3) input').eq(1).focus();
				}
			});
			return;
		}
		if (custom_url != '' && !(/^[a-zA-Z0-9_]+$/i.test(custom_url))) {
			$('#custom-url-error').velocity({"opacity": 0}, 0).text("Your custom URL can only contain letters, numbers, and, underscores.").velocity({opacity: 1}, {display: "block"}, 300, function() {
				if (userAgent != 'iOS') {
					$('.row:nth-of-type(3) input').eq(1).focus();
				}
			});
			return;
		}

		$.post('/settings/updateURL', {_xsrf: getCookie('_xsrf'), "custom-url": custom_url}, function(data) {
			if (data.error) {
				$('#custom-url-error').velocity({"opacity": 0}, 0).text(data.error).velocity({opacity: 1}, {display: "block"}, 300, function() {
					if (userAgent != 'iOS') {
						$('.row:nth-of-type(3) input').eq(1).focus();
					}
				});
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
						row_backer.velocity({translateX: "100%"}, 300, [1.000, 0.000, 1.000, 1.000]);
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
				row_backer.velocity({translateX: 0}, 500, [1.000, 0.000, 0.585, 1.000]);
			}
		});
	});
});

function getCookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
}