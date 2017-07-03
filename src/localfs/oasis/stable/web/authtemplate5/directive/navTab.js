define(["angularAMD"], function (app) {
    app
    .directive("bsRadio", function () {
            return{
                restrict:"EA",
                transclude: true,
                scope:{
                    init : '='
                },
                template:"<ul class='nav'>" +
                         "<li ng-repeat='pane in scopes track by $index'>" +
                         "<div class='xb-input xb-radio' ng-click='select(pane)'>" +
                         '<span class="input-icon circle-icon" ng-class="{checked:pane.selected}"></span>' +
                         '<label for="tab{{$index}}">{{pane.tittle}}</label>' +
                         '</div>'+
                         '</li>' +
                         '</ul>' +
                         '<div ng-transclude class="table-pane container-fluid"></div>',
                controller:["$scope", function ($scope) {
                    var panes = $scope.scopes = [];

                    this.addScope= function (scope) {
                        panes.push(scope);
                    };

                    $scope.select= function (pane) {
                        angular.forEach(panes, function (scope) {
                            scope.selected = false;
                        });
                        pane.selected = true;
                        $scope.$emit('nav.tab.change',pane)
                    };
                }],
                link:function (s, e, a){
                    var opt = s.opt,
                        events = ['nav.tab.index'];

                    events.forEach(function (i){
                        s.$on(i,function (ev,index) {
                            s.select(s.scopes[index])
                        })
                    });

                    if(s.init !== ''){
                        s.scopes[s.init].selected = true;
                    }else{
                        s.scopes[0].selected = true;
                    }
                }
            }
        })
    .directive("bsItem", function () {
            return{
                restrict:'EA',
                scope:{
                    tittle:'@',
                    sign:'@'
                },
                transclude: true,
                require:'^bsRadio',
                template:"<div class='table-pane' ng-show='selected' ng-transclude></div>",
                link: function (s, e,a,c) {
                    c.addScope(s);
                }
            }
        });


});





