define(["angularAMD", "jquery", "utils"], function (app, $, Utils) {
    var sLang = Utils.getLang();
    var url_detailPop_template = sprintf("../securitpolicy2/views/%s/detail_pop.html", sLang);
    var url_ModifyPop_template = sprintf("../securitpolicy2/views/%s/modify_pop.html", sLang);
    /*var url_detailPop_template = "../securitpolicy2/views/" + Utils.getLang() + "/detail_pop.html";
    var url_ModifyPop_template = "../securitpolicy2/views/" + Utils.getLang() + "/modify_pop.html";*/
    app.directive("detailPop", function () {
        return {
            restrict: "A",
            replace: true,
            templateUrl: url_detailPop_template,
            scope: {
                "data": "=detailPop"
            }
        };
    });
    app.directive("modifyPop", function () {
        return {
            restrict: "A",
            replace: true,
            templateUrl: url_ModifyPop_template,
            scope: {
                "data": "=modifyPop"
            }
        };
    });
});