$(function() {
	triangle = $('#triangle-wrapper');
	tab_wrapper = $('#mobile-tab-bar-wrapper');

	follower_url = $('#followers-count').attr('class');
	$.get(follower_url, function(data) {
		$('#misc').append(data);
		user_img = $('.user img');
		overlay  = $('.user-relationship-overlay');
		width    = user_img.width();
		sequence = [
			{e: user_img, p: {height: width},   o: {duration: 0}},
			{e: overlay,  p: {height: width},   o: {duration: 0}}
		];
		$.Velocity.RunSequence(sequence);
	});

	following_url = $('#following-count').attr('class');
	$.get(following_url, function(data) {
		$('#misc').append(data);
		user_img = $('.user img');
		overlay  = $('.user-relationship-overlay');
		width    = user_img.width();
		sequence = [
			{e: user_img, p: {height: width},   o: {duration: 0}},
			{e: overlay,  p: {height: width},   o: {duration: 0}}
		];
		$.Velocity.RunSequence(sequence);
	});

	$('#followers-count').on('click', function() {
		backer    = $('.backer');
		questions = $('#recent-answers');
		following = $('#following-wrapper');
		followers = $('#follower-wrapper');

		if (questions.hasClass("top-layer")) {
			questions.removeClass("top-layer");
			followers.addClass("top-layer");
			backer.velocity({translateX: 0}, 0).css({"z-index": parseInt(questions.css("z-index")) + 1});
			followers.velocity({translateX: 0}, 0).css({"z-index": parseInt(backer.css("z-index")) + 1});
			tab_wrapper.css({"z-index": parseInt(tab_wrapper.css("z-index")) + 2});

			sequence = [
				{e: triangle,  p: {translateX: "33.33%"}, o: {duration: 300}},
				{e: backer,    p: {translateX: "100%"},   o: {duration: 300, easing: [1.000, 0.000, 1.000, 1.000], sequenceQueue: false}},
				{e: followers, p: {translateX: "100%"},   o: {duration: 500, easing: [1.000, 0.000, 0.585, 1.000], sequenceQueue: false}},
			];

		$.Velocity.RunSequence(sequence);
		}
		else if (followers.hasClass("top-layer")) {
			;
		}
		else {
			following.removeClass("top-layer");
			followers.addClass("top-layer");
			backer.velocity({translateX: 0}, 0).css({"z-index": parseInt(following.css("z-index")) + 1});
			followers.velocity({translateX: 0}, 0).css({"z-index": parseInt(backer.css("z-index")) + 1});
			tab_wrapper.css({"z-index": parseInt(tab_wrapper.css("z-index")) + 2});

			sequence = [
				{e: triangle,  p: {translateX: "33.33%"}, o: {duration: 300}},
				{e: backer,    p: {translateX: "100%"},   o: {duration: 300, easing: [1.000, 0.000, 1.000, 1.000], sequenceQueue: false}},
				{e: followers, p: {translateX: "100%"},   o: {duration: 500, easing: [1.000, 0.000, 0.585, 1.000], sequenceQueue: false}}
			];

			$.Velocity.RunSequence(sequence);
		}
	});

	$('#following-count').on('click', function() {
		backer    = $('.backer');
		questions = $('#recent-answers');
		following = $('#following-wrapper');
		followers = $('#follower-wrapper');

		if (questions.hasClass("top-layer")) {
			questions.removeClass("top-layer");
			following.addClass("top-layer");
			backer.velocity({translateX: 0}, 0).css({"z-index": parseInt(questions.css("z-index")) + 1});
			following.velocity({translateX: 0}, 0).css({"z-index": parseInt(backer.css("z-index")) + 1});
			tab_wrapper.css({"z-index": parseInt(tab_wrapper.css("z-index")) + 2});

			sequence = [
				{e: triangle,  p: {translateX: "66.66%"}, o: {duration: 300}},
				{e: backer,    p: {translateX: "100%"},   o: {duration: 300, easing: [1.000, 0.000, 1.000, 1.000], sequenceQueue: false}},
				{e: following, p: {translateX: "100%"},   o: {duration: 500, easing: [1.000, 0.000, 0.585, 1.000], sequenceQueue: false}},
			];

		$.Velocity.RunSequence(sequence);
		}
		else if (followers.hasClass("top-layer")) {
			followers.removeClass("top-layer");
			following.addClass("top-layer");
			backer.velocity({translateX: 0}, 0).css({"z-index": parseInt(followers.css("z-index")) + 1});
			following.velocity({translateX: 0}, 0).css({"z-index": parseInt(backer.css("z-index")) + 1});
			tab_wrapper.css({"z-index": parseInt(tab_wrapper.css("z-index")) + 2});

			sequence = [
				{e: triangle,  p: {translateX: "66.66%"}, o: {duration: 300}},
				{e: backer,    p: {translateX: "100%"},   o: {duration: 300, easing: [1.000, 0.000, 1.000, 1.000], sequenceQueue: false}},
				{e: following, p: {translateX: "100%"},   o: {duration: 500, easing: [1.000, 0.000, 0.585, 1.000], sequenceQueue: false}}
			];

			$.Velocity.RunSequence(sequence);
		}
		else {
			;
		}
	});

	$('#question-count').on('click', function() {
		backer    = $('.backer');
		questions = $('#recent-answers');
		following = $('#following-wrapper');
		followers = $('#follower-wrapper');

		if (questions.hasClass("top-layer")) {
			;
		}
		else if (followers.hasClass("top-layer")) {
			followers.removeClass("top-layer");
			questions.addClass("top-layer");
			following.velocity({translateX: 0}, 0);

			sequence = [
				{e: triangle,  p: {translateX: 0}, o: {duration: 300}},
				{e: followers, p: {translateX: 0}, o: {duration: 300, easing: [1.000, 0.000, 1.000, 1.000], sequenceQueue: false}},
				{e: backer,    p: {translateX: 0}, o: {duration: 500, easing: [1.000, 0.000, 0.585, 1.000], sequenceQueue: false}}
			];

			$.Velocity.RunSequence(sequence);
		}
		else {
			following.removeClass("top-layer");
			questions.addClass("top-layer");
			followers.velocity({translateX: 0}, 0);

			sequence = [
				{e: triangle,  p: {translateX: 0}, o: {duration: 300}},
				{e: following, p: {translateX: 0}, o: {duration: 300, easing: [1.000, 0.000, 1.000, 1.000], sequenceQueue: false}},
				{e: backer,    p: {translateX: 0}, o: {duration: 500, easing: [1.000, 0.000, 0.585, 1.000], sequenceQueue: false}}
			];

			$.Velocity.RunSequence(sequence);
		}
	});

	$('#username-and-button button').on('click', function(e) {
		e.preventDefault();
		url = $('#username-and-button form').attr('action');
		clicked = $(this);
		count = $('#followers-count span');

		if (window.innerWidth < 900) {
			if (clicked.text() == "Following") {
	            sequence = [
	                {e: clicked, p: {scaleX: 1.15, scaleY: 1.15},                   o: {duration: 150}},
	                {e: clicked, p: {scaleX: 1, scaleY: 1},                         o: {duration: 150, complete: function() {
	                	clicked.text("Follow");
	                	clicked.removeClass("active");
	                }}},
	            ];
	        }
	        else {	
	            sequence = [
	                {e: clicked, p: {scaleX: 1.15, scaleY: 1.15},                   o: {duration: 150}},
	                {e: clicked, p: {scaleX: 1, scaleY: 1},                         o: {duration: 150, complete: function() {
	                	clicked.text("Following");
	                	clicked.addClass("active");
	                }}},
	            ];
	        }

	        $.Velocity.RunSequence(sequence);
	    }

		$.post(url, {_xsrf: getCookie('_xsrf')}, function(data) {
			if (data.redirect) {
				window.location.href = data.redirect;
			}
			else {
				count.text(data.followers);
				$('#username-and-button button').text(data.display_text);

				if (window.innerWidth < 900) {
					if (data.display_text == 'Follow') {
						$('#username-and-button button').removeClass("active");
					}
					else {
						$('#username-and-button button').addClass("active");
					}
				}
				else {
					if (data.display_text == 'Follow') {
						$('#username-and-button button').removeClass("active");
					}
					else {
						$('#username-and-button button').addClass("active");
					}
				}
			}
		});
	});

	var resizeTimer;
	$(window).resize(function(e) {
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(function() {
			$('.user img, .user-relationship-overlay').css({"height": $('.user img').eq(0).width() + 'px'});
		}, 200);
	});
});

function getCookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
}