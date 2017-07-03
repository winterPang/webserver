$(function() {
    var cos = {
        username: '',
        getUserName: function () {
            $.get("/v3/arb/wechatnotify/cas_session", function (data) {
                cos.username = data.user;
                $("#username").text(cos.username);

                $("#unbindBtn").click(function () {
                    var $dialog = $('#dialog1');
                    $dialog.show();
                    $dialog.find('.weui_btn_dialog').on('click', function () {
                        $dialog.hide();
                    });
                });
            });
        }
    };
    cos.getUserName();
})