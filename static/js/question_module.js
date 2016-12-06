$(function() {
    $('.poll-answer').on('click', function() {
        var question_id = $(this).parent().attr('class').split(' ')[1];
        var vote_index  = $(this).prevAll().length;
        var q = $(this);

        $.post('/vote/' + question_id, {_xsrf: getCookie('_xsrf'), vote_index: vote_index}, function(data) {
            if (data.redirect) {
                window.location.href = data.redirect;
            }
            else {
                q.removeClass('active');
                q.siblings().removeClass('active');
                if (!data.removed_vote) {
                    q.addClass('active');
                }
                q.parents('.question-wrapper').find('.vote-count').text(data.votes + ' Votes');
                for (var i=0; i < data.percentages.length; i++) {
                    q.parents('.question-wrapper').find('.poll-percentage').eq(i).text(parseInt(data.percentages[i]) + '%');
                    q.parents('.question-wrapper').find('.bar-wrapper2').eq(i).css('width', data.percentages[i] + '%');
                }
            }
        });
    });

    $('.favorite-count').on('click', function() {
        var question_id = $(this).find('.svg-image').attr('class').split(' ')[1];
        var clicked = $(this).find('.svg-image');
        var svg = clicked.find('svg');

        if (svg.css("fill") == "rgb(255, 255, 255)") {
            sequence = [
                {e: clicked, p: {scaleX: 1.5, scaleY: 1.5}, o: {duration: 150}},
                {e: clicked, p: {scaleX: 1, scaleY: 1},     o: {duration: 150}},
                {e: svg,     p: {fill: "#e64c65"},          o: {duration: 200, sequenceQueue: false}}
            ];
        }
        else {
            sequence = [
                {e: clicked, p: {scaleX: 1.5, scaleY: 1.5}, o: {duration: 150}},
                {e: clicked, p: {scaleX: 1, scaleY: 1},       o: {duration: 150}},
                {e: svg,     p: {fill: "#ffffff"},            o: {duration: 200, sequenceQueue: false}}
            ];
        }

        $.Velocity.RunSequence(sequence);

        $.post('/favorite_or_share/' + question_id, {_xsrf: getCookie('_xsrf'), action: "favorite"}, function(data) {
            if (data.redirect) {
                window.location.href = data.redirect;
            }
            else {
                if (data.favorite && svg.css("fill") != "rgb(230, 76, 101)") {
                    svg.velocity({fill: "#e64c65"}, 200);
                }
                if (!data.favorite && svg.css("fill") != "rgb(255, 255, 255)") {
                    svg.velocity({fill: "#ffffff"}, 200);
                }
                clicked.parents('.favorite-count').children('.count-text').text(data.count);
            }
        });
    });
});

function getCookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
}