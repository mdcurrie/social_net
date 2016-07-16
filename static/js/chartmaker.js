$(function() {
	Chart.defaults.global.defaultFontFamily = "Karla, sans-serif";
	Chart.defaults.global.defaultFontSize   = 16;

	$("canvas").each(function() {
		var ctx = $(this);
		const label = JSON.parse($(this).find('.chart-labels').html());
		const data  = JSON.parse($(this).find('.chart-data').html());

		const ordered_label = {};
		Object.keys(label).sort().forEach(function(key) {
			ordered_label[key] = label[key];
		});

		const ordered_data = {};
		Object.keys(data).sort().forEach(function(key) {
			ordered_data[key] = data[key];
		});

		var x = [];
		for (var key in ordered_label) {
			x.push(ordered_label[key]);
		}

		var y = [];
		for (var key in ordered_data) {
			y.push(ordered_data[key]);
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