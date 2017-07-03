var mainApp = angular.module('mainApp', ['ngResource']);

mainApp.config(function ($httpProvider) {
    // Use x-www-form-urlencoded Content-Type
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

    /**
     * The workhorse; converts an object to x-www-form-urlencoded serialization.
     * @param {Object} obj
     * @return {String}
     */
    var param = function (obj) {
        var query = '', name = {}, value, fullSubName, subName = {}, subValue, innerObj, i;

        for (name in obj) {
            value = obj[name];

            if (value instanceof Array) {
                for (i = 0; i < value.length; ++i) {
                    subValue = value[i];
                    fullSubName = name + '[' + i + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += param(innerObj) + '&';
                }
            }
            else if (value instanceof Object) {
                for (subName in value) {
                    subValue = value[subName];
                    fullSubName = name + '.' + subName;
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += param(innerObj) + '&';
                }
            }
            else if (value !== undefined && value !== null)
                query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
        }

        return query.length ? query.substr(0, query.length - 1) : query;
    };

    // Override $http service's default transformRequest
    $httpProvider.defaults.transformRequest = [function (data) {
        return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
    }];
});

var o2oPathName = "/v3/ace/oasis/auth-data/o2oportal/";
mainApp.controller('o2oThemeTemplateController', [
    '$scope',
    '$http',
    '$window',
    '$location',
    '$sce',
    function ($scope, $http, $window, $location, $sce) {

        jq('#tabs').find('li.ui-tabs-active ui-state-active').each(function (i) {
            jq(this).removeClass('ui-tabs-active ui-state-active');
        });
        $scope.model = {};
        // 从url后面获取templateId
        $scope.type = jq.getUrlParams('type');
        $scope.templateId = jq.getUrlParams('templateId');
        $scope.tracker = jq.getUrlParams('tracker');
        $scope.scene = false;
        //小小贝场景隐藏一部分内容
        if (jq.getUrlParams('scene') == 'minibei') {
            $scope.scene = true;
        }

        $scope.model.type = $scope.type;
        $scope.model.templateId = $scope.templateId;
        $scope.model.tracker = $scope.tracker;
        $scope.cfg = "";
        $scope.html = "";

        // var urlget = "/restapp/o2oportal/themetemplate/preDraw";
        var urlget = o2oPathName + "themetemplate/preDraw";
        $http.get(urlget + '/' + $scope.templateId + '/' + $scope.type, {}).success(function (response) {
            if (response.errorcode == 0) {
                console.log(response.data);

                //$scope.instance = value.data;
                $scope.instance = response.data;

                $scope.pageType = $scope.instance.pageType;
                if ($scope.pageType % 2 == 1) {
                    $scope.dShow = false;
                } else {
                    $scope.dShow = true;
                }
                ;

                if (!$scope.instance.pageShow) {
                    if ($scope.pageType == 1) {
                        $scope.instance.pageShow = {"push": 0, "time": 8};
                        $scope.instance.pageShow = JSON.stringify($scope.instance.pageShow);
                    } else {
                        $scope.instance.pageShow = {"push": 1, "time": 8};
                        $scope.instance.pageShow = JSON.stringify($scope.instance.pageShow);
                    }
                }

                if (!$scope.instance.weatherCfg) {
                    $scope.instance.weatherCfg = {"push": 0, "s": 3, "z": 2, "d": 1};
                    $scope.instance.weatherCfg = JSON.stringify($scope.instance.weatherCfg);
                }

                $scope.subId = $scope.instance.id;
                $scope.cfg = $scope.instance.pageCfg;
                $scope.html = $scope.instance.pageHtml;
                $scope.pageShow = $scope.instance.pageShow;
                $scope.pageShow = JSON.parse($scope.pageShow);
                $scope.Introduction_v = $scope.pageShow.push;
                $scope.time_v = $scope.pageShow.time;

                // 天气
                $scope.weatther = $scope.instance.weatherCfg;
                $scope.weatther = JSON.parse($scope.weatther);
                $scope.Weather_v = $scope.weatther.push;
                $scope.Template = $scope.weatther.s;
                $scope.Style = $scope.weatther.z;
                $scope.Day = $scope.weatther.d;

                pathName = 'themepage/' + $scope.instance.pathName;
                var indexObj = jq("#indexContent");
                // 由于页面显示自信息都是乱序，所以通过循环获取记录
                if ($scope.type == $scope.instance.pageType) {
                    indexObj.html($scope.html);
                    indexCtrl = indexObj.phoneControl({
                        // 定制记录时间戳路径
                        imageUploadPath: "images/",
                        jsonCfg: $scope.instance.pageCfg
                    });
                }
                indexObj.find("#phoneTgudingForm").css("display", "block");//账号登录框显示
                indexObj.find("#weixinDiv").css("display", "inline-block");
                indexObj.find("#wxwifiDiv").css("display", "inline-block");
                //小小贝
                if ($scope.scene) {
                    indexObj.find("#weixinDiv").css("display", "none");
                    indexObj.find("#phoneTgudingForm").css("display", "none");
                    indexObj.find("#phoneForm").css("display", "inline-block");
                }

                cfg = JSON.parse($scope.cfg);
                jq.each(cfg, function (valueKey, value) {
                    jq.each(value, function (valueIndex, adValue) {
                        jq('#' + valueKey + ' img').attr("src", $scope.tracker + '/' + adValue[0]);
                    });
                });
                // 小手机的中英文
                if ($scope.pageType == 1) {
                    //补丁，点我上网
                    jq("#quickLoginImg").remove();
                    var quickLoginImg = jq('<div id="quickLoginImg" class="btn-cus" style="position: absolute;text-align:center;font-family: Microsoft YaHei; background:url(images/btn.png) no-repeat; background-size:contain;color: #fff;text-shadow:#7F7F7F 1px 1px 9px;font-size: 15px;    height: 56px;line-height: 56px;bottom: 110px;width: 266px;left: 0;right: 0;margin: 0 auto; text-decoration: none;    box-shadow: 0 0px rgba(0, 0, 0, 0); border-radius: 0px; ">   One-click Access Internet</div>')
                    jq("#indexContent").append(quickLoginImg);
                    i18_init_index_simple();
                } else if ($scope.pageType == 2) {
                    i18_init_login_simple();
                } else if ($scope.pageType == 3) {
                    i18_init_loginSuc_simple();
                } else {
                    i18_init_home_simple();
                }

                // 补丁区
                jq("#homePage").css({"top": "0", "right": "0"});
            } else {
                alert('Nonexistent data or network error.Please contact you administrator.');
            }
        });

        // 切换tab页
        $scope.changeValue = function (ptype) {
            $scope.type = ptype;
            var url = $location.$$absUrl.split("?");
            if ($scope.scene) {
                $window.location.href = url[0] + '?templateId=' + $scope.templateId + '&type=' + ptype + '&scene=' + jq.getUrlParams('scene') + '&tracker=' + $scope.tracker;
            } else {
            $window.location.href = url[0] + '?templateId=' + $scope.templateId + '&type=' + ptype + '&tracker=' + $scope.tracker;
            }
        }

        // 监听变量
        $scope.$watch('Introduction_v', function (v, v2) {
            // console.log(v,v2);
            if ($scope.Introduction_v == 0) {
                $scope.tShow = true;
            } else {
                $scope.tShow = false;
            }
            ;
        });

        $scope.handle = function () {
            if ($scope.Weather_v == 1) {
                $scope.Template_v = true;
            } else {
                $scope.Template_v = false;
            }

            if ($scope.Weather_v == 1 && $scope.Template == 3) {
                $scope.Style_v = true;
            } else {
                $scope.Style_v = false;
            }

            if ($scope.Weather_v == 0 || $scope.Template == 3) {
                $scope.Day_v = false;
            } else {
                $scope.Day_v = true;
            }

            $scope.kk = "//tianqi.2345.com/plugin/widget/index.htm?s=" + $scope.Template + "&z=" + $scope.Style + "&t=0&v=0&d=" + $scope.Day + "&bd=0&k=&f=&q=1&e=0&a=1&c=54511&w=100%&h=" + $scope.h + "&align=center";
            $scope.kk = $sce.trustAsResourceUrl($scope.kk);
        };
        $scope.$watch('Weather_v', function (v, v2) {
            $scope.handle();
        });
        $scope.$watch('Template', function (v, v2) {
            if (v == 3) {
                $scope.Day = 1;
                if ($scope.Style != 1) {
                    $scope.h = 38;
                } else {
                    $scope.h = 28;
                }
            } else {
                $scope.h = 98;
            }
            $scope.handle();
        });
        $scope.$watch('Style', function (v, v2) {
            if ($scope.Template == 3) {
                if (v != 1) {
                    $scope.h = 38;
                } else {
                    $scope.h = 28;
                }
                $scope.handle();
            }
        });
        $scope.$watch('Day', function (v, v2) {
            $scope.handle();
        });

        // 发布文件
        $scope.publishData = function () {

            if (null != indexCtrl && undefined != indexCtrl) {
                $scope.model.pageCfg = indexCtrl.getFinalCfg();
                // 校验图片的相关情况
                if (indexCtrl.getFinalHtml().indexOf("resources/images/add.gif") != -1) {
                    alert("Please upload a picture.");
                    return;
                }
                var imageCfg = JSON.parse($scope.model.pageCfg);
                var imgUpload = false;
                var flag = false;
                var timeFlag = false;
                jq.each(imageCfg, function (valueKey, value) {
                    jq.each(value, function (valueIndex, adValue) {
                        if (adValue[0].indexOf("resources/images/add.gif") != -1) {
                            imgUpload = true;
                        }
                        if (adValue.length > 1) {
                            href = adValue[3];
                            if (href != -1) {
                                var _url = "^((https|http)://)"
                                var re = new RegExp(_url, 'i');
                                if (!re.test(href)) {
                                    flag = true;
                                }
                            }
                            if (adValue[1] != "-1" && adValue[2] != "-1") {
                                var starttime = adValue[1].replace(/-/g, "/");
                                var endtime = adValue[2].replace(/-/g, "/");
                                starttime = (new Date(starttime)).getTime();
                                endtime = (new Date(endtime)).getTime();
                                if (starttime - endtime > 0) {
                                    timeFlag = true;
                                }
                            }
                        }
                    });
                });
                if (imgUpload) {
                    alert("Please upload a picture.");
                    return;
                }
                if (flag) {
                    alert("Picture link error.");
                    return;
                }
                if (timeFlag) {
                    alert("The start time cannot be later than the end time.");
                    return;
                }
                // base64
                $scope.model.pageHtml = encode64(utf16to8(indexCtrl.getFinalHtml()));
                $scope.model.pageShow = {"push": $scope.Introduction_v, "time": $scope.time_v};
                $scope.model.weatherCfg = {
                    "push": $scope.Weather_v,
                    "s": $scope.Template,
                    "z": $scope.Style,
                    "d": $scope.Day
                };
                var reg = /^[1-9]$/g;
                var t = reg.test($scope.time_v);
                if (t) {

                } else {
                    alert("The interval must be in the range of 1 to 9 seconds.");
                    return false;
                }
                ;
                $scope.model.pageShow = JSON.stringify($scope.model.pageShow);
                $scope.model.weatherCfg = JSON.stringify($scope.model.weatherCfg);
            }
            var urlpost = o2oPathName + "themetemplate/publish";
            $http({
                method: 'POST',
                url: urlpost,
                headers: {'Content-Type': 'application/json'},
                data: JSON.stringify($scope.model),
            }).success(function (response) {
                if (response.errorcode == 0) {
                    alert('File published successfully.');
                } else {
                    alert('Nonexistent data or network error.Please contact you administrator.');
                }
            }).error(function (response) {
                alert('Nonexistent data or network error.Please contact you administrator.error');
            });
            ;
        }

    }]);

/**
 * 上传图片
 */
var currImgId;
var canvasImgId;
function uploadImg(canvasId, imgId) {
    // 记录当前操作的图片域id
    currImgId = imgId;
    canvasImgId = canvasId;
    openwindow('/oasis/stable/web/themepage_o2o/uploadEn.html?pathName=' + pathName, 'upload', 420, 250);
}

// 刷新图片 ,如果是画布需要替换的图片，则图片class必须是canvas_img_replace

function refreshImg(imgName) {

    var tracker = jq.getUrlParams('tracker');
    // 当前上传图片个数
    if (undefined != canvasImgId && null != canvasImgId) {
        jq('#' + canvasImgId).find('.canvas_img_replace')[0].src = tracker + '/' + imgName;
    }
    if (currImgId != '') {
        jq('#' + currImgId)[0].src = tracker + '/' + imgName;
    }
}

function openwindow(url, name, iWidth, iHeight) {
    var url; //转向网页的地址;
    var name; //网页名称，可为空;
    var iWidth; //弹出窗口的宽度;
    var iHeight; //弹出窗口的高度;
    //window.screen.height获得屏幕的高，window.screen.width获得屏幕的宽
    var iTop = (window.screen.height - 30 - iHeight) / 2; //获得窗口的垂直位置;
    var iLeft = (window.screen.width - 10 - iWidth) / 2; //获得窗口的水平位置;
    window.open(url, name, 'height=' + iHeight + ',,innerHeight=' + iHeight + ',width=' + iWidth + ',innerWidth=' + iWidth + ',top=' + iTop + ',left=' + iLeft + ',toolbar=no,menubar=no,scrollbars=auto,resizeable=no,location=no,status=no');
}


