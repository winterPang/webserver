define(["angularAMD"], function (app) {
    app
    .directive("bsTabs", function () {
            return{
                restrict:"EA",
                transclude: true,
                scope:{
                    init: '@',
                    current: '='
                },
                template:"<div class='table'>" +
                         "<ul class='nav nav-tabs'>" +
                         "<li ng-repeat='pane in scopes' ng-class='{active:pane.selected}'>" +
                         "<a href='javascript:void(0)' ng-click='select(pane)' class='list-link'>{{pane.tittle}}</a>" +
                         "</li>" +
                         "</ul>" +
                         "<div ng-transclude class='tab-content'></div>" +
                         "</div>",
                controller:["$scope", function ($scope) {
                    var panes = $scope.scopes = [];

                    $scope.select= function (pane) {
                        angular.forEach(panes, function (scope) {
                            scope.selected = false;
                        });
                        pane.selected = true;
                        $scope.current = getIndex(pane, panes)
                    };

                    this.addScope= function (scope) {
                        if(panes.length === 0){
                            $scope.select(scope);
                        }
                        panes.push(scope);
                    };

                    // get pane index in panes;
                    function getIndex (pane, panes){
                        for(var i = 0, len = panes.length;i < len;i++){
                            var current = panes[i];
                            if(pane === current){
                                return i;
                            }
                        }
                    }
                }],
                link: function (s, e, a) {
                    if(s.init !== ''){
                        s.select(s.scopes[s.init])
                        s.current = s.init;
                    }
                    var event = ['change.bs.tab'];
                    event.forEach(function (i) {
                        s.$on(i, function (ev, index){
                            s.select(s.scopes[i]);
                            // need to update the current
                        })
                    })
                }
            }
        })
    .directive("bsPane", function () {
            return{
                restrict:'EA',
                scope:{
                    tittle:'@'
                },
                transclude: true,
                require:'^bsTabs',
                template:"<div class='table-pane' ng-if='selected' ng-transclude></div>",
                link: function (s, e,a,c) {
                    c.addScope(s);
                }
            }
        });


});





