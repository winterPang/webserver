(function ($) {
    $.jqueryNotice = {};
    $.jqueryNotice.show = function (options) {

        var timer = null;

        options = $.extend({}, $.jqueryNotice.defaults, options);
        //向body右上角添加通知栏
        var $div = $('<div class="alert alert-' + options.theme + '"><button class="close">&times;</button><h1>' + options.title + '</h1><p>' + options.msg + '</p></div>');
        $div.find('button.close').off('click').on('click', removeOnce);
        //添加通知栏元素成功后先调用一次消失函数
        setTimeout(function () {
            canhide();
        }, 500);
        //通知栏hover事件
        $div.hover(function () {
            //console.log('不能消失！');
            $(this).addClass('unfade');
            clearTimeout(timer);
            $(this).removeClass('fade');
        }, function () {
            canhide();
        });

        //点击关闭按钮立刻移除通知栏
        function removeOnce() {
            $div.remove();
        }

        //消失函数
        function canhide() {
            //console.log('开始消失。。。');
            $div.addClass('fade');
            timer = setTimeout(function () {
                $div.remove();
            }, 2000);
        }

        //将通知栏元素添加到DOM树上
        $div.appendTo('body');
    };

    $.jqueryNotice.msgDialog = function (text, theme) {
        theme = theme || 'success';
        var $html = $('<div class="msg-dialog fade"><div class="msg-' + theme + '"></div>' + text + '</div>');
        $html.appendTo('body');
        setTimeout(function () {
            $html.removeClass('fade').addClass('unfade');
            setTimeout(function () {
                $html.removeClass('unfade').addClass('fade');
                setTimeout(function () {
                    $html.remove();
                }, 800);
            }, 2000);
        });
    };
    $.jqueryNotice.defaults = {
        theme: 'info',
        msg: '',
        title: ''
    };
})(jQuery);
