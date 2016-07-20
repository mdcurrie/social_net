$(function() {
	Chart.defaults.global.defaultFontFamily = "Karla, sans-serif";
	Chart.defaults.global.defaultFontSize   = 16;

	$("canvas").each(function() {
		var ctx = $(this);
		var data  = JSON.parse($(this).find('.chart-data').html());

		var y = [];
		for (var key in data) {
			y.push(data[key]["votes"]);
		}

		var x = [];
		for (var key in data) {
			x.push(data[key]["label"]);
		}

		var myChart = new Chart(ctx, {
		    type: 'pie',
		    data: {
		        labels: x,
		        datasets: [{
		            label: '# of Votes',
		            data: y,
		            backgroundColor: [
		                '#EEE04B',
		                '#693CA1',
		                '#6A041D',
		                '#19AC9D',
                		'#3772FF'
		            ],
		            borderWidth: 0
		        }]
		    },
		    options: {
		    	cutoutPercentage: 35,
		    	animation: {
		    		animateScale: true,
		    	},
		    	legend: {
		    		display: false,
		    	}
		    },
		});
	});

	resizeQuestionImage();
	$(window).resize(function() {
		setTimeout(function() {
			resizeQuestionImage();
		}, 100);
	});
});

function resizeQuestionImage()
{
	$('.question-image').each(function(index) {
		$(this).height($('.chart').eq(index).height() + 40);
	});
}