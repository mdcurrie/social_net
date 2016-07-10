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
});