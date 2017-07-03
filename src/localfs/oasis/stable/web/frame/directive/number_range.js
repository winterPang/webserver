define(['jquery', 'app'], function ($, app) {
    app.directive('numberRange', function () {
        return {
            require: 'ngModel',
            link: function (scope, elem, attrs, ctrl) {
                $(elem).on('keyup',function(){
                    var number = attrs.numberRange.split(",");
                    var v = (function(){
                        if(isNaN(elem.val())){
                            return false;
                        }else{
                            if(parseFloat(elem.val()) < parseFloat(number[0]) || parseFloat(elem.val()) > parseFloat(number[1])){
                                return false;
                            } else {
                                return true;
                            }
                        }
                    })();
                    scope.$apply(function () {
                        ctrl.$setValidity('numberRange', v);
                    })
                });
            }
        };
    });
});