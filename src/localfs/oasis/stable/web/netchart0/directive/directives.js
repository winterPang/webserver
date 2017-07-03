define(["angularAMD", "jquery"], function (app, $) {


    // 图例层
    app.directive("legendLayer", function () {

        return {
            restrict: "A",
            scope: {
                list: "=legendLayer"
            },
            link: function (scope, ele, attr) {
                var ctx = ele.get(0).getContext("2d");
                scope.$watch("list", function (newVal, oldVal) {
                    angular.forEach(newVal, function (value, key) {
                        ctx.beginPath();
                        ctx.font = "normal small-caps bold 16px arial";
                        ctx.textAlign = "center";
                        ctx.textBaseline = "hanging";
                        ctx.fillStyle = "#000";
                        ctx.fillText(value.text, 850, 30 * (key + 1));
                        ctx.rect(900, 30 * (key + 1), 30, 15);
                        ctx.fillStyle = value.lColor;
                        ctx.fill();
                    });
                });

            }
        };
    });




    // 背景层
    app.directive("bgLayer", function () {

        function drawImage(canvas, path, x, y) {
           //  path = "https://v3webtest.h3c.com/v3/wloc_map/210235A1CWC14B900027-1478844505375-background.jpg";
            var $img = $("<img>").attr("src", path);
            var posX = x || 0;
            var posY = y || 0;
            $img.bind("load", function () {
                canvas.drawImage($img.get(0), posX, posY);
            });
        }

        return {
            restrict: "A",
            scope: {
                options: "=bgLayer"
            },
            link: function (scope, ele) {
                var ctx = ele.get(0).getContext("2d");
                scope.$watch("options.path", function (newVal, oldVal) {
                    if (newVal != oldVal) {
                        drawImage(ctx, newVal);
                    }
                });
            }
        };

    });

    // ap层
    app.directive("apLayer", function () {

        function drawAp(dom, ap) {
            var sPath = "../netchart0/images/" + (ap.status == 1 ? "ap.png" : "offline_ap.png");
            $("<img>").attr({
                "src": sPath,
                "title": ap.apName + "\n" + ap.macAddr
            }).css({
                width: "30px",
                height: "30px",
                position: "absolute",
                left: ap.XCord - 15,
                top: ap.YCord - 15
            }).appendTo(dom);
        }

        return {
            restrict: "A",
            scope: {
                list: "=apLayer"
            },
            link: function (scope, ele) {
                scope.$watch("list", function (newVal, oldVal) {
                    if (newVal != oldVal) {
                        angular.forEach(scope.list, function (value) {
                            drawAp(ele, value);
                        });
                    }
                });
            }
        };
    });













});