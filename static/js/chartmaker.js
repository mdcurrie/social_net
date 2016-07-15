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