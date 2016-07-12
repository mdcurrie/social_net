$(function() {
	Chart.defaults.global.defaultFontFamily = "Karla, sans-serif";
	Chart.defaults.global.defaultFontSize   = 16;

	$("canvas").each(function() {
		var ctx = $(this);
		var label = $(this).find('.chart-labels').html();
		var data = $(this).find('.chart-data').html();
		label = label.slice(1, -1);
		label = label.split(",");
		for (var i = 0; i < label.length; i++) {
			label[i] = label[i].slice(1, -1);
			if (i > 0) {
				label[i] = label[i].slice(1, label[i].length);
			}
		}
		data = data.slice(1, -1);
		data = data.split(",").map(Number);

		var myChart = new Chart(ctx, {
		    type: 'pie',
		    data: {
		        labels: label,
		        datasets: [{
		            label: '# of Votes',
		            data: data,
		            backgroundColor: [
		                '#EEE04B',
		                '#693CA1',
		                '#6A041D',
		                '#19AC9D',
                		'#3772FF'
		            ],
		            borderWidth: 3
		        }]
		    },
		    options: {
		    	cutoutPercentage: 50,
		    	animation: {
		    		animateScale: true,
		    	},
		    	legend: {
		    		labels: {
		    			fontColor: 'black',
		    		}
		    	}
		    },
		});
	});
	resizeQuestionImage();
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

	// Get the modal
	var modal = $('#myModal');

	// Get the button that opens the modal
	var btn = $('#myBtn');
	
	// When the user clicks on the button, open the modal
	btn.on('click', function() {
		modal.css({"display": "block"});
		//$('*:not(#myModal)').on('click', function() {
		//	modal.css({"display": "none"});
		//	$('*:not(#myModal)').off('click');
		//});
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

function resizeQuestionImage()
{
	$('.question-image').each(function(index) {
		$(this).height($('.chart').eq(index).height() + 40);
	});
}