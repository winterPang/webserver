/**
 * Created by liuyanping(kf6877) on 2017/1/11.
 */
require.config({
    baseUrl: '../',
    waitSeconds: 0,
    paths: {
        "jquery": [
            "//cdn.bootcss.com/jquery/1.11.3/jquery.min",
            "frame/libs/jquery/jquery-1.11.3.min"
        ],
        "angular": [
            "//cdn.bootcss.com/angular.js/1.5.7/angular.min",
            "frame/libs/angularjs/angular.min"
        ],
        "angularAMD": [
            "frame/libs/angularjs/angularAMD"
        ],
        "angular-messages": [
            "//cdn.bootcss.com/angular-messages/1.5.7/angular-messages.min",
            "frame/libs/angularjs/angular-messages.min"
        ],
        "angular-ui-router": [
            "//cdn.bootcss.com/angular-ui-router/0.2.18/angular-ui-router.min",
            "frame/libs/ui-router/angular-ui-router.min"
        ],
        'utils': 'frame/js/utils',
        'app': 'frame/js/app'
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
        "angularAMD": {
            deps: ["angular"],
            exports: "angularAMD"
        }
    },
    deps: [
        'jquery', 'angular','app', 'angular-messages',
        'frame/directive/ajax_valid', 'frame/directive/reptpas'
    ]
});