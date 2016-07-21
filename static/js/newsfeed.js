$(function() {
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

	var metrics_top = $('#poll-metrics').position().top - 3;
  	$(window).resize(function() {
  		setTimeout(function() {
  			resizeQuestionImage();
 			metrics_top = $('#poll-metrics').position().top - 3;
  		}, 100);
  	});

	var scroll_pos = 0;
    $(document).scroll(function() { 
        scroll_pos = $(this).scrollTop();
        if(scroll_pos >= metrics_top) {
            $(".header-wrapper").css('background-color', '#eee04b');
            $("#logo > a").css('color', '#333');
            $("footer").css('position', 'fixed');
            $("footer").css('top', '172px');
        } else {
            $(".header-wrapper").css('background-color', '#333');
            $("#logo > a").css('color', 'white');
            $("footer").css('position', 'absolute');
            $("footer").css('top', '450px');
        }
    });

    $('#follow-button').on('click', function(e) {
		var user_id = window.location.href.split("/").pop();
		$.getJSON('/follow/' + user_id, function(data) {
			$('#followers h2').text(data.followers);
			$('#follow-button').text(data.display_text);
			if (data.display_text == "Followed") {
				$('#follow-button').addClass('active');
			}
			else {
				$('#follow-button').removeClass('active');
			}
		})
	});

	$('#hate-button').on('click', function(e) {
		var user_id = window.location.href.split("/").pop();
		$.getJSON('/hate/' + user_id, function(data) {
			$('#haters h2').text(data.haters);
			$('#hate-button').text(data.display_text);
			if (data.display_text == "Hated") {
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