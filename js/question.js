$(function() {
	var scroll_pos = 0;
    $(document).scroll(function() { 
        scroll_pos = $(this).scrollTop();
        if(scroll_pos >= 80) {
            $("header").css('background-color', '#eee04b');
            $("header a").css('color', '#333');
        } else {
            $("header").css('background-color', '#333');
            $("header a").css('color', 'white');
        }
    });

    $('.chart-footer img').eq(0).on('click', function(e) {
        var question_id = window.location.href.split("/").pop();
        $.getJSON('/favorite/' + question_id, function(data) {
            if (data.favorite == true) {
                $('.chart-footer img').eq(1).removeClass('active');
                $('.chart-footer img').eq(0).addClass('active');
            }
            else {
                $('.chart-footer img').eq(0).removeClass('active');
                $('.chart-footer img').eq(1).addClass('active');
            }
        })
    });

    $('.chart-footer img').eq(1).on('click', function(e) {
        var question_id = window.location.href.split("/").pop();
        $.getJSON('/favorite/' + question_id, function(data) {
            if (data.favorite == true) {
                $('.chart-footer img').eq(1).removeClass('active');
                $('.chart-footer img').eq(0).addClass('active');
            }
            else {
                $('.chart-footer img').eq(0).removeClass('active');
                $('.chart-footer img').eq(1).addClass('active');
            }
        })
    });

    $('.chart-footer img').eq(2).on('click', function(e) {
        var question_id = window.location.href.split("/").pop();
        $.getJSON('/share/' + question_id, function(data) {
            if (data.share == true) {
                $('.chart-footer img').eq(3).removeClass('active');
                $('.chart-footer img').eq(2).addClass('active');
            }
            else {
                $('.chart-footer img').eq(2).removeClass('active');
                $('.chart-footer img').eq(3).addClass('active');
            }
        })
    });

    $('.chart-footer img').eq(3).on('click', function(e) {
        var question_id = window.location.href.split("/").pop();
        $.getJSON('/share/' + question_id, function(data) {
            if (data.share == true) {
                $('.chart-footer img').eq(3).removeClass('active');
                $('.chart-footer img').eq(2).addClass('active');
            }
            else {
                $('.chart-footer img').eq(2).removeClass('active');
                $('.chart-footer img').eq(3).addClass('active');
            }
        })
    });

});