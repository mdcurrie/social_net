$(function() {
	$('.mini-question-wrapper').on('click', function() {
		$('.asker-profile-pic').html($(this).find('.mini-asker-profile-pic').html());
		$('.asker-username').html($(this).find('.mini-asker-username').html());
		$('.question-date').html($(this).find('.mini-question-date').html());
		$('.vote-count').html($(this).find('.mini-vote-count').html());
		$('.question-title').html($(this).find('.mini-question-title').html());
		$('.question-image').css('background-image', $(this).find('.mini-question-image').css('background-image'));
		$('.action-buttons').html($(this).find('.mini-action-buttons').html());
		$('.labels').html($(this).find('.mini-labels').html());
		$('.labels').attr('class', $('.labels').attr('class').split(' ')[0]);
		$('.labels').addClass($(this).find('.mini-labels').attr('class').split(' ')[1]);

		$('.favorite-count .svg-image').on('click', function() {
	        var question_id = $(this).attr('class').split(' ')[1];
	        var clicked = $(this);
	        $.getJSON('/favorite_or_share/' + question_id, {action: "favorite"}, function(data) {
	            if (data.favorite) {
	                clicked.addClass('svg-active');
	            }
	            else {
	                clicked.removeClass('svg-active');
	            }
	            clicked.parents('.favorite-count').children('span').text(data.count);
	        });
	    });

   		$('.share-count .svg-image').on('click', function() {
	        var question_id = $(this).attr('class').split(' ')[1];
	        var clicked = $(this);
	        $.getJSON('/favorite_or_share/' + question_id, {action: "share"}, function(data) {
	            if (data.share) {
	                clicked.addClass('svg-active');
	            }
	            else {
	                clicked.removeClass('svg-active');
	            }
	            clicked.parents('.share-count').children('span').text(data.count);
	        });
	    });

	    $('.poll-answer').on('click', function() {
	        var question_id = $(this).parent().attr('class').split(' ')[1];
	        var vote_index  = $(this).prevAll().length;
	        var q = $(this);
	        $.getJSON('/vote/' + question_id, {vote_index: vote_index}, function(data) {
	            q.parent().find('.poll-percentage-wrapper').removeClass('active');
	            q.find('.poll-percentage-wrapper').addClass('active');
	            q.parents('#question-wrapper').find('.vote-count').text(data.votes + ' Votes');
	            for (var i=0; i < data.percentages.length; i++) {
	                $('#question-wrapper').find('.poll-percentage').eq(i).text(parseInt(data.percentages[i]) + '%');
	                $('#question-wrapper').find('.bar-wrapper2').eq(i).css('width', data.percentages[i] + '%');
	            }
	        });
	    });
	});

	$('#modal form').on('submit', function(e) {
		e.preventDefault();
		if ($('#question-title').val() == '') {
			$('#question-error').text('Please enter a question.');
			return;
		}

		var an1 = $('#answer-1').val();
		var an2 = $('#answer-2').val();
		var an3 = $('#answer-3').val();
		var an4 = $('#answer-4').val();
		var an5 = $('#answer-5').val();

		if ((an1 == '') || (an2 == '')) {
			$('#question-error').text('Please fill out option 1 and option 2.');
			return;
		}
		if (an1 == an2) {
			$('#question-error').text('Please enter unique options.');
			return;
		}
		if (an3 != '' && (an3 == an1 || an3 == an2)) {
			$('#question-error').text('Please enter unique options.');
			return;
		}
		if (an4 != '' && (an4 == an1 || an4 == an2 || an4 == an3)) {
			$('#question-error').text('Please enter unique options.');
			return;
		}
		if (an5 != '' && (an5 == an1 || an5 == an2 || an5 == an3 || an5 == an4)) {
			$('#question-error').text('Please enter unique options.');
			return;
		}

		$(this).unbind('submit').submit();
	});

  	$(window).resize(function() {
  		setTimeout(function() {
  			resizeQuestionImage();
 			metrics_top = $('#profile-metrics').position().top - 3;
 			if ($(window).width() < 768) {
				$('#overlay-content').height($(window).height() - 90);
			}
			else {
				$('#overlay-content').height(300);
			}
  		}, 100);
  	});

    $('#profile-metrics a').on('click', function(e) {
    	e.preventDefault();
    	var clicked = $(this);
    	var url = $(this).attr('href');
    	$.getJSON(url, function(data) {
    		console.log(data);
    		$('body').addClass('no-scroll');
    		$('#background-dark').css({"display": "block"});
    		$('#overlay-close').css({"display": "block"});
    		$('#overlay-content').html('');

    		if ($('#profile-metrics a').index(clicked) == 0) {
    			$('#overlay-title').text('Followers');
    		}
    		else if ($('#profile-metrics a').index(clicked) == 1) {
    			$('#overlay-title').text('Following');
    		}
    		else {
    			$('#overlay-title').text('Haters');
    		}

    		for (var key in data) {
    			if (data[key]["follow_text"] != false) {
	    			$('#overlay-content').append('<div class="image-row"><a href="/users/' + data[key]["_id"] + '"><img src="' + data[key]["profile_pic_link"] + '"/><h4>' + data[key]["username"] +
	    										 '</h4></a><div class="row-buttons"><button>' + data[key]["follow_text"] + '</button><button>' + data[key]["hate_text"] + '</button></div></div>');
	    		}
	    		else {
	    			$('#overlay-content').append('<div class="image-row"><a href="/users/' + data[key]["_id"] + '"><img src="' + data[key]["profile_pic_link"] + '"/><h4>' + data[key]["username"] +
	    										 '</h4></a></div>');
	    		}
    		}
    		$('#overlay').css({"display": "block"});
    	});
    });

    $('#overlay-close, #background-dark').on('click', function() {
	    $('body').removeClass('no-scroll');
		$('#background-dark').css({"display": "none"});
		$('#overlay-close').css({"display": "none"});
		$('#overlay').css({"display": "none"});
    });

    $('#follow-button').on('click', function() {
		var user_id = window.location.href.split("/").pop();
		$.getJSON('/follow_or_hate/' + user_id, {action: "follow"}, function(data) {
			$('.text-num').eq(0).text(data.followers);
			$('#follow-button').text(data.display_text);
			if (data.display_text == "Following") {
				$('#follow-button').addClass('active');
			}
			else {
				$('#follow-button').removeClass('active');
			}
		})
	});

	$('#hate-button').on('click', function() {
		var user_id = window.location.href.split("/").pop();
		$.getJSON('/follow_or_hate/' + user_id, {action: "hate"}, function(data) {
			$('.text-num').eq(2).text(data.haters);
			$('#hate-button').text(data.display_text);
			if (data.display_text == "Hating") {
				$('#hate-button').addClass('active');
			}
			else {
				$('#hate-button').removeClass('active');
			}
		})
	});

	$('#open-button').on('click', function() {
		$(this).css({"display": "none"});
		$('#close-button').css({"display": "block"});
		$('#modal').css({"display": "block"});
		$('#question-title').focus();
	});

	$('#close-button').on('click', function() {
		$(this).css({"display": "none"});
		$('#modal').css({"display": "none"});
		$('#open-button').css({"display": "block"});
		$('.input-row input').val('');
		$('#question-error').text('');
	});

	$('#answer-2').on('change paste keyup', function() {
		if ($('#answer-2').val()) {
			$('#answer-3').css('display', 'block');
		}
		else {
			$('#answer-3').css('display', 'none');
		}
	});
	$('#answer-3').on('change paste keyup', function() {
		if ($('#answer-3').val()) {
			$('#answer-4').css('display', 'block');
		}
		else {
			$('#answer-4').css('display', 'none');
		}
	});
	$('#answer-4').on('change paste keyup', function() {
		if ($('#answer-4').val()) {
			$('#answer-5').css('display', 'block');
		}
		else {
			$('#answer-5').css('display', 'none');
		}
	});
});