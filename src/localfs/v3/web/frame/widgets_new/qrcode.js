; (function ($) {
    
    var jDom = $(
        '<div class="toolbar">\
            <link rel="stylesheet" href="./css/qrcode/index.css">\
            <a href="javascript:;" class="toolbar-item">\
                <span class="toolbar-close">\
                    <i class="fa fa-angle-right"></i>\
                    <i class="fa fa-angle-left"></i>\
                </span>\
                <span class="sweep"></span>\
            </a>\
            <a href="javascript:;" class="toolbar-item">\
                <span class="toolbar-btn">\
                    <!--<span class="sweep"></span>-->\
                    <i class="toolbar-icon fa fa-weixin"></i>\
                    <span class="toolbar-text">公众<br />帐号</span>\
                </span>\
                <span class="toolbar-layer toolbar-layer-weixin"></span>\
            </a>\
            <a href="javascript:;" class="toolbar-item">\
                <span class="toolbar-btn">\
                    <i class="toolbar-icon fa fa-mobile"></i>\
                    <span class="toolbar-text">APP<br />下载</span>\
                </span>\
                <span class="toolbar-layer toolbar-layer-app"></span>\
            </a>\
        </div>'
    );
    
    var jBody = $('body');
    
    jBody.append(jDom);

    $('.toolbar-item:nth-of-type(1)', jDom).click(function () {
        $('.toolbar').toggleClass('toolbar-hide');
    });
})(jQuery);