$(function() {
	user_width = $('.search-user').width();
	$('.search-user').height(user_width);
	max_height = Math.max($('#search-results-questions').height(), $('#search-results-users').height(), $('#search-results-topics').height());
	$('#search-results-questions').height(max_height);
	$('#search-results-users').height(max_height);
	$('#search-results-topics').height(max_height);
	$('#search-results-backer').height(max_height);
	$('#search-tabs').height(max_height + 20);

	triangle = $('#search-triangle-wrapper');
	tab_wrapper = $('#mobile-tab-bar-wrapper');
	$('.search-results-header:nth-of-type(1)').on('click', function() {
		backer    = $('#search-results-backer');
		questions = $('#search-results-questions');
		users     = $('#search-results-users');
		topics    = $('#search-results-topics');

		if (questions.hasClass("search-top")) {
			;
		}
		else if (users.hasClass("search-top")) {
			users.removeClass("search-top");
			questions.addClass("search-top");
			topics.velocity({translateX: 0}, 0);

			sequence = [
				{e: triangle, p: {translateX: 0}, o: {duration: 300}},
				{e: users,    p: {translateX: 0}, o: {duration: 300, easing: [1.000, 0.000, 1.000, 1.000], sequenceQueue: false}},
				{e: backer,   p: {translateX: 0}, o: {duration: 500, easing: [1.000, 0.000, 0.585, 1.000], sequenceQueue: false}}
			];

			$.Velocity.RunSequence(sequence);
		}
		else {
			topics.removeClass("search-top");
			questions.addClass("search-top");
			users.velocity({translateX: 0}, 0);

			sequence = [
				{e: triangle, p: {translateX: 0}, o: {duration: 300}},
				{e: topics,   p: {translateX: 0}, o: {duration: 300, easing: [1.000, 0.000, 1.000, 1.000], sequenceQueue: false}},
				{e: backer,   p: {translateX: 0}, o: {duration: 500, easing: [1.000, 0.000, 0.585, 1.000], sequenceQueue: false}}
			];

			$.Velocity.RunSequence(sequence);
		}
	});

	$('.search-results-header:nth-of-type(2)').on('click', function() {
		backer    = $('#search-results-backer');
		questions = $('#search-results-questions');
		users     = $('#search-results-users');
		topics    = $('#search-results-topics');

		if (questions.hasClass("search-top")) {
			questions.removeClass("search-top");
			users.addClass("search-top");
			backer.velocity({translateX: 0}, 0).css({"z-index": parseInt(questions.css("z-index")) + 1});
			users.velocity({translateX: 0}, 0).css({"z-index": parseInt(questions.css("z-index")) + 2});
			tab_wrapper.css({"z-index": parseInt(tab_wrapper.css("z-index")) + 2});

			sequence = [
				{e: triangle, p: {translateX: "33.33%"}, o: {duration: 300}},
				{e: backer,   p: {translateX: "100%"},   o: {duration: 300, easing: [1.000, 0.000, 1.000, 1.000], sequenceQueue: false}},
				{e: users,    p: {translateX: "100%"},   o: {duration: 500, easing: [1.000, 0.000, 0.585, 1.000], sequenceQueue: false}},
			];

			$.Velocity.RunSequence(sequence);
		}
		else if (users.hasClass("search-top")) {
			;
		}
		else {
			topics.removeClass("search-top");
			users.addClass("search-top");
			backer.velocity({translateX: 0}, 0).css({"z-index": parseInt(topics.css("z-index")) + 1});
			users.velocity({translateX: 0}, 0).css({"z-index": parseInt(topics.css("z-index")) + 2});
			tab_wrapper.css({"z-index": parseInt(tab_wrapper.css("z-index")) + 2});

			sequence = [
				{e: triangle, p: {translateX: "33.33%"}, o: {duration: 300}},
				{e: backer,   p: {translateX: "100%"},   o: {duration: 300, easing: [1.000, 0.000, 1.000, 1.000], sequenceQueue: false}},
				{e: users,    p: {translateX: "100%"},   o: {duration: 500, easing: [1.000, 0.000, 0.585, 1.000], sequenceQueue: false}}
			];

			$.Velocity.RunSequence(sequence);
		}
	});

	$('.search-results-header:nth-of-type(3)').on('click', function() {
		backer    = $('#search-results-backer');
		questions = $('#search-results-questions');
		users     = $('#search-results-users');
		topics    = $('#search-results-topics');

		if (questions.hasClass("search-top")) {
			questions.removeClass("search-top");
			topics.addClass("search-top");
			backer.velocity({translateX: 0}, 0).css({"z-index": parseInt(questions.css("z-index")) + 1});
			topics.velocity({translateX: 0}, 0).css({"z-index": parseInt(questions.css("z-index")) + 2});
			tab_wrapper.css({"z-index": parseInt(tab_wrapper.css("z-index")) + 2});

			sequence = [
				{e: triangle, p: {translateX: "66.66%"}, o: {duration: 300}},
				{e: backer,   p: {translateX: "100%"},   o: {duration: 300, easing: [1.000, 0.000, 1.000, 1.000], sequenceQueue: false}},
				{e: topics,   p: {translateX: "100%"},   o: {duration: 500, easing: [1.000, 0.000, 0.585, 1.000], sequenceQueue: false}}
			];

			$.Velocity.RunSequence(sequence);
		}
		else if (users.hasClass("search-top")) {
			users.removeClass("search-top");
			topics.addClass("search-top");
			backer.velocity({translateX: 0}, 0).css({"z-index": parseInt(users.css("z-index")) + 1});
			topics.velocity({translateX: 0}, 0).css({"z-index": parseInt(users.css("z-index")) + 2});
			tab_wrapper.css({"z-index": parseInt(tab_wrapper.css("z-index")) + 2});

			sequence = [
				{e: triangle, p: {translateX: "66.66%"}, o: {duration: 300}},
				{e: backer,   p: {translateX: "100%"},   o: {duration: 300, easing: [1.000, 0.000, 1.000, 1.000], sequenceQueue: false}},
				{e: topics,   p: {translateX: "100%"},   o: {duration: 500, easing: [1.000, 0.000, 0.585, 1.000], sequenceQueue: false}}
			];

			$.Velocity.RunSequence(sequence);
		}
		else {
			;
		}
	});

	var resizeTimer;
	$(window).resize(function(e) {
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(function() {
			user_width = $('.search-user').width();
			$('.search-user').height(user_width);
			$('#search-results-questions').css({"height": ""});
			$('#search-results-users').css({"height": ""});
			$('#search-results-topics').css({"height": ""});
			max_height = Math.max($('#search-results-questions').height(), $('#search-results-users').height(), $('#search-results-topics').height());
			$('#search-results-questions').height(max_height);
			$('#search-results-users').height(max_height);
			$('#search-results-topics').height(max_height);
			$('#search-results-backer').height(max_height);
			$('#search-tabs').height(max_height + 20);
		}, 200);
	});
});