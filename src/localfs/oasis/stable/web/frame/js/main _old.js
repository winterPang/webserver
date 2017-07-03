require.config({
    baseUrl: '../',
    waitSeconds: 0,
    paths: {
        "jquery": [
            "//cdn.bootcss.com/jquery/1.11.3/jquery",
            "frame/libs/jquery/jquery-1.11.3"
        ],
        "jquery.twbsPagination": [
            '//cdn.bootcss.com/twbs-pagination/1.3.1/jquery.twbsPagination.min',
            "frame/libs/jquery/jquery.twbsPagination"
        ],
        "async": [
            "//cdn.bootcss.com/async/2.0.1/async.min",
            "frame/libs/async/2.0.1/async.min"
        ],
        "echarts": [
            "//cdn.bootcss.com/echarts/2.2.7/echarts-all",
            "frame/libs/echarts2/echarts-all"
        ],
        "echarts3": [
            "//cdn.bootcss.com/echarts/3.2.2/echarts.min",
            "frame/libs/echarts/echarts.min"
        ],
        "angular": [
            "//cdn.bootcss.com/angular.js/1.5.7/angular",
            "frame/libs/angularjs/angular"
        ],
        "angular-messages": [
            "//cdn.bootcss.com/angular-messages/1.5.7/angular-messages",
            "frame/libs/angularjs/angular-messages"
        ],
        "angular-ui-router": [
            "//cdn.bootcss.com/angular-ui-router/0.2.18/angular-ui-router",
            "frame/libs/ui-router/angular-ui-router"
        ],
        "angularAMD": "frame/libs/angularjs/angularAMD",
        "bootstrap": [
            "//cdn.bootcss.com/bootstrap/3.3.5/js/bootstrap",
            "frame/libs/bootstrap/js/bootstrap"
        ],
        "bootstrapTable": [
            // "//cdn.bootcss.com/bootstrap-table/1.10.1/bootstrap-table",
            "frame/libs/bootstrap-table/bootstrap-table"
        ],

        "bootstrap-table-CN": "frame/js/empty",
        "select2": [
            "//cdn.bootcss.com/select2/4.0.3/js/select2.min",
            "frame/libs/select2-4.0.3/js/select2.min"
        ],

        "select2-cn": [
            "//cdn.bootcss.com/select2/4.0.3/js/i18n/zh-CN",
            "frame/libs/select2-4.0.3/js/i18n/zh-CN"
        ],
        "layer": [
            "//cdn.bootcss.com/layer/2.3/layer",
            "frame/libs/layer/layer"
        ],
        "bootstrapValidator": [
            "//cdn.bootcss.com/bootstrap-validator/0.5.3/js/bootstrapValidator",
            "frame/libs/bootstrap-validator/js/bootstrapValidator"
        ],
        "bootstrapValidatorCN": [
            "//cdn.bootcss.com/bootstrap-validator/0.5.3/js/language/zh_CN",
            "frame/libs/bootstrap-validator/js/language/zh_CN"
        ],
        "jqueryZtree": "frame/libs/ztree/js/jquery.ztree.all.min",
        "jqueryTreetable": "frame/libs/treetable/jquery-treetable",
        'require-plugin-async': "frame/libs/requirejs/plugins/async",
        "moment": "frame/libs/bootstrap-daterangepicker/moment",
        "moment2_1": "frame/libs/bootstrap-daterangepicker/moment2_1",
        "bootstrap-daterangepicker": "frame/libs/bootstrap-daterangepicker/daterangepicker",
        "bootstrap-daterangepicker-1_2": "frame/libs/bootstrap-daterangepicker/daterangepicker1_2",
        "bootstrapDatepicker": "frame/libs/bootstrap-datepicker/js/bootstrap-datepicker.min",
        "bootstrapDatetimepicker": "frame/libs/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min",
        "bootstrapDatepickerCN": "frame/libs/bootstrap-datepicker/js/bootstrap-datepicker.zh-CN.min",
        "fullcalendar": "frame/libs/fullcalendar-3.0.1/js/fullcalendar",
        "jqueryValidator": [
            "//cdn.bootcss.com/jquery-validate/1.15.1/jquery.validate.min",
            "frame/libs/jquery-validator/jquery.validate.min"
        ],
        "jqueryValidatorAddMethods": [
            "//cdn.bootcss.com/jquery-validate/1.15.1/additional-methods.min",
            "frame/libs/jquery-validator/additional-methods.min"
        ],
        "notice": "frame/libs/notice/jquery-notice",
        'bootmodal': 'frame/libs/bootmodal/bootModal',
        'socketio': '../../../v3/web/chat/js/socket.io',
        'xiaobeichat': '../../../v3/web/chat/xiaobeichat',
        'utils': 'frame/js/utils',
        "sprintf": [
            "//cdn.bootcss.com/sprintf/1.0.3/sprintf.min",
            "frame/libs/sprintf/1.0.3/sprintf.min"
        ],
        'app': 'frame/js/app',
        //'routes': 'frame/js/routes',
        //'loader': 'frame/js/loader',
        //baseService
        "baseService": "frame/js/base_service",
        // controller
        //'menuController': 'frame/js/menuController',
        "BMap": ["https://api.map.baidu.com/api?v=2.0&ak=MbtCg93QgCqqCn3GgkmHhS5Mem0W44l0&s=1"],

        "fileModel": "mapmanage/directive/fileModel",
        "fileReader": "mapmanage/service/fileReader",
        //directive
        //bsTable -- bootstrapTable -- zhangfq
        bsTable: 'frame/directive/bs_table',

        //CSS配置 -- zhangfq
        bootstrap_css: [
            // '//cdn.bootcss.com/bootswatch/3.3.5/cerulean/bootstrap.min',
            'frame/libs/bootstrap/css/bootstrap.min'
        ],
        frame_css: 'frame/css/frame',
        private_css: 'frame/css/private',
        common_css: 'frame/css/common',
        top_panel_css: 'frame/css/top-panel',
        navbar_css: 'frame/css/navbar',
        leftmenu_css: 'frame/css/leftmenu',
        content_css: 'frame/css/content',
        jqueryNotice_css: 'frame/css/jqueryNotice',
        bootstrap_table_css: 'frame/libs/bootstrap-table/bootstrap-table.min',
        ztree_css: 'frame/libs/ztree/css/zTreeStyle',
        treetable_css: [
            'frame/libs/treetable/css/jquery.treetable',
            'frame/libs/treetable/css/jquery.treetable.theme.default',
            'frame/libs/treetable/css/screen'
        ],
        select2_css: "frame/libs/select2-4.0.3/css/select2.min",
        fontawesome_min_css: 'frame/libs/Font-Awesome/css/font-awesome.min',
        bootstrap_daterangepicker_css: "frame/libs/bootstrap-daterangepicker/daterangepicker",
        bootstrap_daterangepicker1_2_css: "frame/libs/bootstrap-daterangepicker/daterangepicker1_2",
        // fullcalendar_css:"frame/libs/fullcalendar-3.0.1/css/fullcalendar.min",
        fullcalendar_css: [
            // "//cdn.bootcss.com/fullcalendar/3.0.1/fullcalendar.min.css",
            "frame/libs/fullcalendar-3.0.1/css/fullcalendar"
        ]
    },
    shim: {
        "angular": {
            exports: "angular"
        },
        "angular-ui-router": {
            deps: ['angular'],
            exports: "angular-ui-router"
        },
        "angular-messages": {
            deps: ["angular"]
        },
        'socketio': {
            exports: "socket"
        },
        'xiaobeichat': {
            deps: ['socketio', 'jquery'],
            exports: "xiaobeichat"
        },
        "angularAMD": {
            deps: ["angular"],
            exports: "angularAMD"
        },
        "bootstrap": {
            deps: ["jquery"],
            exports: '$'
        },
        "echarts": {
            exports: 'echarts'
        },
        "bootstrapTable": {
            deps: ["bootstrap"],
            exports: '$'
        },
        'bootstrapValidator': {
            deps: ['bootstrap'],
            exports: '$'
        },
        'bootstrapValidatorCN': {
            deps: ['bootstrapValidator'],
            exports: '$'
        },
        'jqueryValidator': {
            deps: ["jquery"],
            exports: '$'
        },
        'jqueryValidatorAddMethods': {
            deps: ["jqueryValidator"],
            exports: '$'
        },
        "jquery.twbsPagination": {
            deps: ["jquery"],
            exports: '$'
        },
        'bootstrapDatepicker': {
            deps: ['bootstrap'],
            exports: '$'
        },
        "bootstrap-daterangepicker": {
            deps: ["bootstrap", "moment"]
        },
        "bootstrap-daterangepicker-1_2": {
            deps: ["bootstrap", "moment2_1"]
        },
        'bootstrapDatepickerCN': {
            deps: ['bootstrapDatepicker'],
            exports: '$'
        },
        "notice": {
            deps: ["jquery"],
            exports: '$'
        },
        "bootmodal": {
            deps: ["bootstrap"],
            exports: '$'
        },
        "layer": {
            deps: ["jquery"]
        },
        "BMap": {
            deps: ["jquery"],
            exports: 'BMap'
        },
        "jqueryTreetable": {
            deps: ["jquery"],
            exports: '$'
        },
        "fullcalendar": {
            deps: ["jquery", "moment"],
            exports: '$'
        },
        "select2-cn": {
            deps: ['select2']
        }
    },
    map: {
        '*': {
            // 加载css文件的配置
            css: 'frame/libs/requirejs/css.min'
        }
    },
    deps: [
        //  启动加载的css文件
        'css!bootstrap_css', 'css!navbar_css', 'css!bootstrap_table_css', 'css!frame_css', 'css!private_css',
        'css!common_css', 'css!leftmenu_css', 'css!top_panel_css', 'css!content_css',
        'css!jqueryNotice_css', 'css!fontawesome_min_css', 'css!select2_css',
        //  启动加载的js文件
        //  I think 'jquery' must be loaded first,set angular.element === $.
        'jquery', 'app', 'baseService', 'bsTable', 'angular-messages', 'select2',
        'frame/directive/bs_modal', 'frame/directive/bs_pager',
        'frame/directive/ajax_valid', 'frame/directive/reptpas',
        'frame/directive/changepwd', 'frame/directive/number_range', 'frame/directive/select2'
    ]/*,
     urlArgs: "bust=" + (new Date()).getTime()*/
});