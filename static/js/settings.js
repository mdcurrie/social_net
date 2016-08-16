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

	$('#user-profile-pic img').on('click', function() {
		$(this).css({"opacity": 0.1});
		$('#user-profile-pic form').css({"display": "block"});
		$('#user-profile-pic input').eq(1).focus();
	});

	$('#user-profile-pic form').on('submit', function(e) {
		e.preventDefault();
		var picture_link = $('#user-profile-pic form input').eq(1).val();

		if (!(/\.(jpeg|jpg|gif|png)$/i.test(picture_link)))
			return;

		$('#user-profile-pic form').unbind('submit').submit();
	});
});