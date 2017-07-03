/**
 * Created by Administrator on 2016/4/4.
 */
var compress = require('./compress');
var fs = require('fs');
var basePath = './localfs/v3/web/frame/';
var cssPath1 = './localfs/v3/web/frame/libs/css/all-min1.css';
var cssPath2 = './localfs/v3/web/frame/css/all-min2.css';
var cssPath3 = './localfs/v3/web/frame/css/all-min3.css';
var busiaccssPath = './localfs/v3/web/frame/css/busiacall-min.css';
var jsminPath = './localfs/v3/web/frame/libs/js/all-min.js';

var jsPath = './localfs/v3/web/frame/libs/js/all.js';
var busiacjsPath = './localfs/v3/web/frame/js/busiacall-min.js';
var libcsspath = './localfs/v3/web/frame/libs/css/alllibcss-min.css';
var libcsspath1 = './localfs/v3/web/frame/libs/css/alllibcss-min1.css';

var css1 = [basePath + "libs/css/bootstrap.css",
    basePath + "libs/css/bootstrap-responsive.css"
];

var css2 = [
    basePath + "css/other.css",
    basePath + "css/frame.css",
    basePath + "css/widget.css",
    basePath + "css/menu.css"
];

var css3 = [
    basePath + "css/private.css",
    basePath + "css/style-responsive.css",
];

var libcss = [
    basePath + "libs/css/jquery.easy-pie-chart.css",
    basePath + "libs/css/bootstrap-modal.css",
    basePath + "libs/css/font-awesome.min.css",

    basePath + "libs/css/jquery.ui.css",
    basePath + "libs/css/slick-default-theme.css",
    basePath + "libs/css/slick.grid.css",
    basePath + "libs/css/slick.columnpicker.css",
    basePath + "libs/css/slick.pager.css",
];

var libcss1 = [
    basePath + "libs/css/jquery.tagsinput.css",
    basePath + "libs/css/clockface.css",
    basePath + "libs/css/bootstrap-wysihtml5.css",
    basePath + "libs/css/colorpicker.css",
    basePath + "libs/css/bootstrap-toggle-buttons.css",
];
var businessAccss = [
    basePath + "libs/css/bootstrap.css",
    basePath + "libs/css/bootstrap-responsive.css",
    basePath + "css/other.css",
    basePath + "css/frame.css",
    basePath + "css/widget.css",
    basePath + "css/mlist.css",
    basePath + "css/menu.css",
    basePath + "css/private.css",
    basePath + "css/style-responsive.css",
    basePath + "libs/css/font.css",
    "./localfs/v3/web/frame/css/plugin.css"
];
var alljs =[
    basePath + 'libs/js/jquery.js',
    basePath + 'libs/js/jquery.cookie.js',
    basePath + 'libs/js/jquery-ui.js',
    basePath + 'libs/js/bootstrap.min.js',
    basePath + 'libs/js/jquery.event.drag-2.2.js',
    './localfs/v3/web/chat/js/socket.io.js',
    './localfs/v3/web/chat/xiaobeichat.js',
    basePath + 'libs/js/excanvas.min.js',
    basePath + 'libs/js/respond.min.js',
    basePath + 'libs/js/bootstrap-modal.js',
    basePath + 'libs/js/bootstrap-modalmanager.js',
    basePath + 'libs/js/bootstrap-carousel.js',
    basePath + 'libs/fullcalendar/lib/moment-min.js',
    basePath + 'libs/fullcalendar/lib/jquery-ui-custom-min.js',
    basePath + 'libs/fullcalendar/fullcalendar.js',
    basePath + 'config.js',
    basePath + 'libs/js/mainframe.js',
    basePath + 'js/menu.js',
    basePath + 'widgets/debuger.js',
    basePath + 'widgets/frame.js',
    basePath + 'js/mjs.js',
    basePath + 'widgets/util.js',
    basePath + 'widgets/dialog.js',
    basePath + 'widgets/dbm.js',
    basePath + 'utils/base.js',
    './localfs/v3/web/beibei/js/beibei.js'
];

var businessAcjs = [
    basePath + 'libs/js/jquery.js',
    basePath + 'libs/js/jquery.cookie.js',
    basePath + 'libs/js/jquery-ui.js',
    basePath + 'libs/js/bootstrap.min.js',
    basePath + 'libs/js/jquery.event.drag-2.2.js',
    './localfs/v3/web/chat/js/socket.io.js',
    './localfs/v3/web/chat/xiaobeichat.js',
    basePath + 'libs/js/excanvas.min.js',
    basePath + 'libs/js/respond.min.js',
    basePath + 'libs/js/bootstrap-modal.js',
    basePath + 'libs/js/bootstrap-modalmanager.js',
    basePath + 'libs/js/bootstrap-carousel.js',
    basePath + 'config.js',
    basePath + 'libs/js/mainframe.js',
    basePath + 'js/menu.js',
    basePath + 'widgets/debuger.js',
    basePath + 'widgets/frame.js',
    basePath + 'js/mjs.js',
    basePath + 'widgets/util.js',
    basePath + 'widgets/dialog.js',
    basePath + 'widgets/dbm.js',
    basePath + 'utils/base.js',
    './localfs/v3/web/beibei/js/beibei.js',
    basePath + 'libs/fullcalendar/lib/moment-min.js',
    basePath + 'libs/fullcalendar/lib/jquery-ui-custom-min.js',
    basePath + 'libs/fullcalendar/fullcalendar.js'
];

fs.exists(cssPath1, function (exit) {
    compress.cssMinifier(css1,cssPath1);
});

fs.exists(cssPath2, function (exit) {
    compress.cssMinifier(css2,cssPath2);
});

fs.exists(cssPath3, function (exit) {
    compress.cssMinifier(css3,cssPath3);
});

fs.exists(busiaccssPath, function (exit) {
    compress.cssMinifier(businessAccss,busiaccssPath);
});

fs.exists(libcsspath, function (exit) {
    compress.cssMinifier(libcss,libcsspath);
});

fs.exists(libcsspath1, function (exit) {
    compress.cssMinifier(libcss1,libcsspath1);
});

fs.exists(jsminPath, function (exit) {
    compress.compressjs(alljs,jsminPath);
});

fs.exists(jsPath, function (exit) {
    compress.combineJs(alljs,jsPath);
});

fs.exists(busiacjsPath, function (exit) {
    compress.compressjs(businessAcjs,busiacjsPath);

});