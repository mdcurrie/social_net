var animate_down = false;

$(function() {
   /* function runIt() {
        if (animate_down) {
            animate_down = false;
            $('.question-image').animate({'background-position-x': '50%', 'background-position-y': '43%'}, 3000, 'linear', function() {
                runIt();
            });
        }
        else {
            animate_down = true;
            $('.question-image').animate({'background-position-x': '50%', 'background-position-y': '37%'}, 3000, 'linear', function() {
                runIt();
            });
        }
    }

    runIt();*/

    $('.poll-answer').on('click', function() {
        var question_id = $(this).parent().attr('class').split(' ')[1];
        var vote_index  = $(this).prevAll().length;
        var q = $(this);
        $.getJSON('/vote/' + question_id, {vote_index: vote_index}, function(data) {
            q.parent().find('.poll-percentage-wrapper').removeClass('active');
            q.find('.poll-percentage-wrapper').addClass('active');
            q.parents('.question-wrapper').find('.vote-count').text(data.votes + ' Votes');
            for (var i=0; i < data.percentages.length; i++) {
                $('.question-wrapper').find('.poll-percentage').eq(i).text(parseInt(data.percentages[i]) + '%');
                $('.question-wrapper').find('.bar-wrapper2').eq(i).css('width', data.percentages[i] + '%');
            }
        });
    });

    $('.favorite-count .svg-image').on('click', function() {
        var question_id = $(this).attr('class').split(' ')[1];
        var clicked = $(this);
        $.getJSON('/favorite_or_share/' + question_id, {action: "favorite"}, function(data) {
            if (data.favorite) {
                clicked.siblings('.icon-indicator').addClass('active');
            }
            else {
                clicked.siblings('.icon-indicator').removeClass('active');
            }
            clicked.parents('.favorite-count').children('.count-text').text(data.count);
        });
    });

    $('.share-count .svg-image').on('click', function() {
        var question_id = $(this).attr('class').split(' ')[1];
        var clicked = $(this);
        $.getJSON('/favorite_or_share/' + question_id, {action: "share"}, function(data) {
            if (data.share) {
                clicked.siblings('.icon-indicator').addClass('active');
            }
            else {
                clicked.siblings('.icon-indicator').removeClass('active');
            }
            clicked.parents('.share-count').children('.count-text').text(data.count);
        });
    });
});