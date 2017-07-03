require.config({
    baseUrl: '../',
    waitSeconds: 0,
    paths: {
        // require plugin async
        // use this plugin to load script by an async script
        "async-plugin" : "frame/libs/requirejs/plugins/async",
        "text" : "frame/libs/requirejs/plugins/text",
        "json" : "frame/libs/requirejs/plugins/json",
        "BMap": "https://api.map.baidu.com/api?v=2.0&ak=orgNBlAZ46Dx7Bw0gfBMLawUFlBADy8R&s=1",

        "jquery":  "frame/libs/jquery/jquery-1.11.3",

        "jquery.twbsPagination":"frame/libs/jquery/jquery.twbsPagination",

        "async":"frame/libs/async/2.0.1/async.min",

        "echarts":  "frame/libs/echarts/echarts-all",

        "echarts3": "frame/libs/echarts3.6.1/echarts.min",

        "angular":  "frame/libs/angularjs/angular",

        "angular-messages": "frame/libs/angularjs/angular-messages",

        "angular-ui-router":  "frame/libs/ui-router/angular-ui-router",

        "angularAMD": "frame/libs/angularjs/angularAMD",

        "bootstrap": "frame/libs/bootstrap/js/bootstrap",

        "bootstrapTable":"frame/libs/bootstrap-table/bootstrap-table",
        "bootstrap-table-CN": "frame/js/empty",

        "select2":"frame/libs/select2-4.0.3/js/select2.min",

        "select2-cn":"frame/libs/select2-4.0.3/js/i18n/zh-CN",

        "layer": "frame/libs/layer/layer",
        'rangepicker': "frame/libs/rangepicker/rangepicker",

        "bootstrapValidator":"frame/libs/bootstrap-validator/js/bootstrapValidator",
        "bootstrapValidatorCN": "frame/libs/bootstrap-validator/js/language/zh_CN",
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
        "jqueryValidator":"frame/libs/jquery-validator/jquery.validate.min",
        "jqueryValidatorAddMethods": "frame/libs/jquery-validator/additional-methods.min",
        "notice": "frame/libs/notice/jquery-notice",
        'bootmodal': 'frame/libs/bootmodal/bootModal',
        'socketio': '../../../v3/web/chat/js/socket.io',
        'xiaobeichat': '../../../v3/web/chat/xiaobeichat',
        'utils': 'frame/js/utils',
        "sprintf":"frame/libs/sprintf/1.0.3/sprintf.min",
        'app': 'frame/js/app',
        //'routes': 'frame/js/routes',
        //'loader': 'frame/js/loader',
        //baseService
        "baseService": "frame/js/base_service",
        // controller
        //'menuController': 'frame/js/menuController',
        
        //directive
        //bsTable -- bootstrapTable -- zhangfq
       

        //CSS配置 -- zhangfq
        bootstrap_css: 'frame/libs/bootstrap/css/bootstrap.min',
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
        fullcalendar_css:  "frame/libs/fullcalendar-3.0.1/css/fullcalendar",

        //component define
        // bsTable: 'frame/directive/bs_table',
        oasisRow: "frame/component/layout/oasis-row",
        oasisCol: "frame/component/layout/oasis-col",
        oasisBox: "frame/component/layout/oasis-box",
        oasisBoxHeader: "frame/component/layout/oasis-box-header",
        oasisBoxBody: "frame/component/layout/oasis-box-body",
        oasisBoxFooter: "frame/component/layout/oasis-box-footer",
        oasisButton: "frame/component/button/oasis-button",
        oasisRadio:'frame/component/form/oasis-radio',
        bsTable: "frame/component/table/bs_table",
        oasisModal: 'frame/component/modal/bs_modal',
           
        echartNodataPie: "frame/component/echart_nodata_pie"
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
        },
        // baidu map api dependence
        "BMap": {
            deps: ['jquery'],
            exports: 'BMap'
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
        'oasisModal', 'frame/directive/bs_pager',
        'frame/directive/ajax_valid', 'frame/directive/reptpas',
        'frame/directive/changepwd', 'frame/directive/number_range', 
        'frame/directive/select2','oasisRow','oasisCol','oasisBox',
        'oasisBoxHeader','oasisBoxBody','oasisBoxFooter','oasisButton','oasisRadio'
    ]/*,
     urlArgs: "bust=" + (new Date()).getTime()*/
});