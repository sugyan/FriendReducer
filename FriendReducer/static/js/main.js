$(function () {
    $('#signout').click(function () {
        $('#signout_form').submit();
    });

    $('#start').click(function (e) {
        $.ajax({
            url: '/api/friends',
            success: function (data) {
                console.log(data);
            }
        });
    });
});
