/**
 * Created by Administrator on 2017/5/25.
 */
define(['utils', 'jquery', 'css!dataset/css/detail','css!dataset/directive/jquery-ui','dataset/directive/jquery-ui'], function (Utils, $) {
    return ['$scope', '$rootScope', '$http', '$state', '$window', '$alertService', '$stateParams', '$timeout',function ($scope, $rootScope, $http, $state, $window, $alert, $stateParams,$timeout) {
        $( function() {
            var handle = $( "div[id^='custom-handle']" );
            $( "div[id^='slider']" ).slider({
                max: 30,
                value: 7,
                create: function() {
                    handle.text( $( this ).slider( "value")+'天' );
                },
                slide: function( event, ui ) {
                    $(ui.handle).text(ui.value + "天")
                }
            });
        } );
    }]
})