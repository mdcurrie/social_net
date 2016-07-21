var old_value1 = false;
var old_value2 = false;
var old_value3 = false;

$(function() {
    $('.labels h4').on('click', function(e) {
        var question_id = $(this).parent().attr('class').split(' ')[1];
        var vote_index = $(this).prevAll().length;
        var q = $(this);
        $.getJSON('/vote/' + question_id, {vote_index: vote_index}, function(data) {
            q.siblings().removeClass('active');
            q.addClass('active');
            $('.vote-count h4').text(data.votes + ' Votes');
        });
    });

    $('.favorite-count .svg-image').hover(
        function() {
            old_value1 = $(this).find('path').css("fill");
            $(this).find('path').css({"fill": "#693ca1"});
        },
        function() {
            $(this).find('path').css({"fill": old_value1});
        });

    $('.favorite-count .svg-image').on('click', function(e) {
        var question_id = $(this).attr('class').split(' ')[1];
        var clicked = $(this);
        $.getJSON('/favorite/' + question_id, function(data) {
            if (data.favorite) {
                old_value1 = "#693ca1";
                clicked.find('path').css({"fill": "#693ca1"});
            }
            else {
                old_value1 = "#8d8d8d";
                clicked.find('path').css({"fill": "#8d8d8d"});
            }
        });
    });

    $('.share-count .svg-image').hover(
        function() {
            old_value2 = $(this).find('path').css("fill");
            $(this).find('path').css({"fill": "#693ca1"});
        },
        function() {
            $(this).find('path').css({"fill": old_value2});
        });

    $('.share-count .svg-image').on('click', function(e) {
        var question_id = $(this).attr('class').split(' ')[1];
        var clicked = $(this);
        $.getJSON('/share/' + question_id, function(data) {
            if (data.share) {
                old_value2 = "#693ca1";
                clicked.find('path').css({"fill": "#693ca1"});
            }
            else {
                old_value2 = "#8d8d8d";
                clicked.find('path').css({"fill": "#8d8d8d"});
            }
        });
    });

    $('.comment-count .svg-image').hover(
        function() {
            old_value3 = $(this).find('path').css("fill");
            $(this).find('path').css({"fill": "#693ca1"});
        },
        function() {
            $(this).find('path').css({"fill": old_value3});
        });
});