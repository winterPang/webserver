; (function($) {
    var MODULE_NAME = "x_summary.alert";
    var hPending = null;
    // 对Date的扩展，将 Date 转化为指定格式的String
    // 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
    // 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
    // 例子： 
    // (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
    // (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
    Date.prototype.Format = function(fmt) { //author: meizz 
        var o = {
            "M+": this.getMonth() + 1, //月份 
            "d+": this.getDate(), //日 
            "h+": this.getHours(), //小时 
            "m+": this.getMinutes(), //分 
            "s+": this.getSeconds(), //秒 
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
            "S": this.getMilliseconds() //毫秒 
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }



    function getRcText(sRcName) {
        return Utils.Base.getRcString("alert_monitor_rc", sRcName);
    }

    function initData() {
        var apname = "little2bay";
        
        function getApName(onSuccess,onFailed) {

            var getApInfoOpt = {
                type: "GET",
                url: MyConfig.path + "/apmonitor/web/aplist?devSN=" + FrameInfo.ACSN,
                dataType: "json",
                timeout: 150000,
                onSuccess:onSuccess,
                onFailed:onFailed
            }

            Utils.Request.sendRequest(getApInfoOpt);
        }
        
        function getLogInfo(onSuccess,onFailed) {
            //return $.ajax({
            //    type: "GET",
            //    url: MyConfig.path + "/devlogserver/getdevlog" + "?devSN=" + FrameInfo.ACSN,
            //    dataType: "json"
            //});
           var logInfoOpt = {
                type: "GET",
                url: MyConfig.path + "/devlogserver/getdevlog" + "?devSN=" + FrameInfo.ACSN,
                dataType: "json",
                timeout: 150000,
                onSuccess: onSuccess,
                onFailed: onFailed
            }

            Utils.Request.sendRequest(logInfoOpt);
        }

        function fail(jqXHR,textStatus,error){
            console.log("getLogInfo fail!!!Error:"+error);
        }
        
        function success(data, textStatus, jqXHR){
            try {
                if(!('devLog' in data && data.devLog instanceof Array && data.devLog.length > 0)){
                    throw (new Error('devLog  not exist'));
                }
                if(data.devLog.length != 0){
                    var devLog = data.devLog;
                    devLog.forEach(function (log) {
                        log.apName = apname;
                        log.logTime = (new Date(log.logTime)).Format("yyyy/MM/dd hh:mm:ss");
                        log.deal = '---';
                    });
                }
                $("#alert_list").SList("refresh", devLog);
            }catch(error){
                console.log(error);
            }
        }
        
        getApName(function (data, textStatus, jqXHR) {
            var apList = data["apList"];
            if(data.apList.length != 0){
                apList.forEach(function(ap) {
                    apname = ap["apName"];
                });
            }
            getLogInfo(success,fail);
            
        },function (jqXHR,textStatus,error) {
            console.log("get apname fail!!!Error:"+error);
            getLogInfo(success,fail);
        });

    }
    function optionPush(){
        function parseQuery(location) {
            var query = location.search.replace('?', '');
            var params = query.split('&');
            var result = {};
            $.each(params, function () {
                var temp = this.split('=');
                result[temp[0]] = temp.length === 2 ? temp[1] : undefined;
            });
            return result;
        }
        /*var $panel = $('#scenes_panel'), //  下拉面板
         $trigger = $('#change_scenes_trigger'),  //  点击展开的按钮
         $btnChange = $('#switchScenesBtn'),  //  确认按钮
         $selectedScene = $('#selectedScene'),  //  场景选择下拉框
         $devSn = $('#devSn'),  //  设备管理下拉
         $devContain = $('#device-contain'),
         $contain = $('#scene-contain');  //  容器*/
        var $panel = $('#reDevSelect #scenes_panel'), //  下拉面板
            $trigger = $('#reDevSelect #change_scenes_trigger'),  //  点击展开的按钮
            $btnChange = $('#reDevSelect #switchScenesBtn'),  //  确认按钮
            $selectedScene = $('#reDevSelect #selectedScene'),  //  场景选择下拉框
            $devSn = $('#reDevSelect #devSn'),  //  设备管理下拉
            $devContain = $('#reDevSelect #device-contain'),
            $contain = $('#reDevSelect #scene-contain');  //  容器
        //  if first load,set devsn value param's devsn
        var firstLoad = true, //   是否首次加载
            locales = {
                cn: {
                    trigger: '切换设备',
                    device: '选择设备',
                    shop: '选择场所',
                    online: '在线',
                    offline: '不在线'
                },
                en: {
                    trigger: 'Switch Device',
                    device: 'Device',
                    shop: 'Shop',
                    online: 'Online',
                    offline: 'Offline'
                }
            },
            _lang = $.cookie('lang') || 'cn';

        var senceInfo = parseQuery(window.location),
            model = senceInfo.model,  // 存储model信息
            sn = senceInfo.sn,
            nasid = senceInfo.nasid,
            sceneDevList = {}, //   场景和设备的关联关系
            sceneModelObj = {}, //  场景和model的对应关系  {shopId:model}
            devInfoList = {};  //  设备信息列表  {devSN:{devInfo}}

        $('#reDevSelect #switch-text').html(locales[_lang].trigger);  //  点击展开的文本
        $('#reDevSelect #switch-shop').html(locales[_lang].shop);   //  选择场所label
        $('#reDevSelect #switch-device').html(locales[_lang].device);   //   选择设备label

        /**
         * 生成dev下拉框并设置值
         */
        function fillDevField() {
            var val = $selectedScene.val(), devs = sceneDevList[val], devHtml = [];
            $devSn.html('');
            var selectedModel = sceneModelObj[val];
            //  model是1的时候，隐藏设备选择   model是1的时候是小小贝
            //$devContain[selectedModel === 1 ? 'hide' : 'show']();
            var devSnList = [];
            $.each(devs, function (i, d) {
                devSnList.push(d.devSN);
            });

            /**
             * 获取设备在线状态   1:不在线   0:在线
             * 微服务: renwenjie
             */
            $.post('/base/getDevs', {devSN: devSnList}, function (data) {
                var statusList = JSON.parse(data).detail, devList = [];
                $.each(devs, function (i, dev) {
                    $.each(statusList, function (j, sta) {
                        if (dev.devSN === sta.devSN) {
                            dev.status = sta.status;
                            devList.push(dev);
                        }
                    });
                });
                callback(devList);
            }, 'html');

            /**
             * 拼接select下拉框的数据
             * @param devs   所有的设备信息
             */
            function callback(devs) {
                $.each(devs, function (i, dev) {
                    devHtml.push('<option value="', dev.devSN, '">',
                        dev.devName + '(' + (dev.status == 0 ? locales[_lang].online : locales[_lang].offline) + ')',
                        '</option>');
                });
                //  如果是第一次加载就现在进来的sn，如果不是第一次进页面就选择默认的
                $devSn.html(devHtml.join('')).val((devs.length && !firstLoad) ? devs[0].devSN : sn);
                firstLoad = false;
            }
        }

        /**
         * 获取场景信息
         * @param sceneDevList
         * @param devInfoList
         */
        function getSceneList(sceneDevList, devInfoList) {
            $.get("/v3/web/cas_session?refresh=" + Math.random(), function (data) {
                $.post('/v3/scenarioserver', {
                    Method: 'getdevListByUser',
                    param: {
                        userName: data.user
                    }
                }, function (data) {
                    data = JSON.parse(data);
                    if (data && data.retCode == '0') {
                        var sceneHtmlList = [];
                        var sceneObj = {};
                        $.each(data.message, function (i, s) {
                            var devInfo = {
                                devName: s.devName,
                                devSN: s.devSN,
                                url: s.redirectUrl
                            };
                            if (!sceneDevList[s.scenarioId]) {
                                sceneDevList[s.scenarioId] = [];
                            }
                            // 设备信息
                            devInfoList[s.devSN] = devInfo;
                            //  {场景ID:devList}  场景和设备的对应关系
                            sceneDevList[s.scenarioId].push(devInfo);
                            //  {场所ID:场所名称}
                            sceneObj[s.scenarioId] = s.shopName;
                            //  {场所ID:场所model}
                            sceneModelObj[s.scenarioId] = Number(s.model);
                        });
                        // 拼接select框的option
                        $.each(sceneObj, function (k, v) {
                            sceneHtmlList.push('<option value="', k, '">', v, '</option>');
                        });
                        $selectedScene.html(sceneHtmlList.join('')).val(nasid);
                        // 填充设备列表
                        fillDevField();
                    }
                }, 'html');
            });
        }

        getSceneList(sceneDevList, devInfoList);
        $trigger.off('click').on('click', function () {
            $panel.toggle();
        });

        //$btnChange.off('click').on('click', function () {
        //    $devSn.val() && location.replace(devInfoList[$devSn.val()].url.replace('oasis.h3c.com', location.hostname)+location.hash);
        //    $panel.hide();
        //});

        $devSn.off("change").on("change",function(){
            $devSn.val() && location.replace(devInfoList[$devSn.val()].url.replace('oasis.h3c.com', location.hostname)+location.hash);
            //$panel.hide();
        });

        $selectedScene.off('change').on('change', fillDevField);

        $(document).on('click', function (e) {
            var $target = $(e.target);
            if ($target != $contain && !$.contains($contain.get(0), e.target)) {
                //$panel.hide();
            }
        });
        // ==============  选择场所，end  ==============

        $panel.show();

        function getuserSession() {
            $.ajax({
                url: MyConfig.path + "/scenarioserver",
                type: "POST",
                headers: {Accept: "application/json"},
                contentType: "application/json",
                timeout: 150000,
                data: JSON.stringify({
                    "Method": "getdevListByUser",
                    "param": {
                        "userName": FrameInfo.g_user.attributes.name

                    }
                }),
                dataType: "json",
                success: function (data) {
                    var AcInfo = [];
                    if (data.retCode == 0 && data.message) {
                        var snList = [];
                        var aclist = data.message;
                        for (var i = 0; i < aclist.length; i++) {
                            if (aclist[i].shopName) {
                                AcInfo.push({
                                    shop_name: aclist[i].shopName,
                                    sn: aclist[i].devSN,
                                    placeTypeName: aclist[i].scenarioName,
                                    redirectUrl: aclist[i].redirectUrl,
                                    nasid: aclist[i].scenarioId
                                });
                                snList.push(aclist[i].devSN);
                            } else if (aclist[i].devSN) {
                                snList.push(aclist[i].devSN);
                            }
                        }

                    } else {
                        Frame.Debuger.error("[ajax] error,url=====" + MyConfig.path + "/scenarioserver");
                    }
                    getAcInfo(AcInfo);
                }
            });
        }

        getuserSession();

        function getAcInfo(aclist) {
            var opShtmlTemple = "<li data_sn=vals  sel data-url=urls>palce</li>";
            var ulhtml = '<div class="select">' +
                '<p>' +
                '</p>' +
                '<ul>' +
                '</ul>' +
                '</div>';
            $("#station").append(ulhtml);
            for (var i = 0; i < aclist.length; i++) {
                if (window.location.host == "v3webtest.h3c.com") {
                    aclist[i].redirectUrl = aclist[i].redirectUrl.replace("lvzhouv3.h3c.com", "v3webtest.h3c.com");
                }
                var newHtmTemple = opShtmlTemple.replace(/vals/g, aclist[i].sn)
                    .replace(/urls/g, aclist[i].redirectUrl).replace(/palce/g, aclist[i].shop_name);
                var newHtmlTemple_1 = "";
                if (FrameInfo.ACSN == aclist[i].sn) {
                    $(".select > p").text($(newHtmTemple).text());
                } else {
                    newHtmlTemple_1 = newHtmTemple.replace(/sel/g, "");
                }
                $(".content .select ul").append(newHtmlTemple_1);

            }
            $(".select").click(function (e) {
                $(".select").toggleClass('open');
                return false;
            });

            $(".content .select ul li").on("click", function () {
                var _this = $(this);
                $(".select > p").text(_this.html());
                $.cookie("current_menu", "");
                var redirectUrl = $(this).attr("data-url");
                window.location.href = redirectUrl;
                _this.addClass("selected").siblings().removeClass("selected");
                $(".select").removeClass("open");
            });
            $(document).on('click', function () {
                $(".select").removeClass("open");
            })
        }
    }
    function deleteAlert() {

    }
    // 告警事件导出
    function downLoadNow(){

        var downLoadNowOpt = {
            url: MyConfig.path+"/fs/exportLogfile",
            type: "POST",
            dataType: "json",
            timeout: 150000,
            data: {
                devSN: FrameInfo.ACSN
            },
            onSuccess:function(data){
                        try {
                            if(!('fileName' in data && (data.failName != ""))){
                                throw (new Error('file not exist'));
                            }
                            console.log(data);
                            $("#exportFile").get(0).src = data.fileName;
                        }catch(error){
                            console.log(error);
                        }
                    },
            onFailed:  function (err){
                hPending&&hPending.close();
                            console.log(err);
                       }
        }

        Utils.Request.sendRequest(downLoadNowOpt);
    }

    function initGrid() {
        $(".toppannel #switch-text").html(getRcText("switchBtn"));
        var option = {
            colNames: getRcText("ALERT_HEADER"),
            pageSize:10,
            colModel: [
                { name: "apName", datatype: "String", width: 100 },
                //{ name: "devSN", datatype: "String", width: 100 },
                //{ name: "logModule", datatype: "String", width: 100 },
                { name: "logStr", datatype: "String", width: 100 },
                //{ name: "logLevel", datatype: "Int", width: 100 },
                { name: "logTime", datatype: "String", width: 100 },
                // { name: "deal", datatype: "String", width: 100 }
            ],
            buttons: [
                {name: "default", value:getRcText ("ALERT_DOWNLOAD"), action: downLoadNow}
            ]
        };
        $("#alert_list").SList("head", option);
    }
    //function initGrid1() {
    //    var option = {
    //        colNames: getRcText("ALERT_HEADER"),
    //        pageSize:10,
    //        colModel: [
    //            { name: "apName", datatype: "String", width: 100 },
    //            //{ name: "devSN", datatype: "String", width: 100 },
    //            //{ name: "logModule", datatype: "String", width: 100 },
    //            { name: "logStr", datatype: "String", width: 100 },
    //            //{ name: "logLevel", datatype: "Int", width: 100 },
    //            { name: "logTime", datatype: "String", width: 100 },
    //            // { name: "deal", datatype: "String", width: 100 }
    //        ],
    //        buttons: [
    //            {name: "default",enable:false, value:getRcText ("ALERT_DOWNLOAD"), action: downLoadNow}
    //        ]
    //    };
    //    $("#alert_list").SList("head", option);
    //}
    function _init() {
        //initForm();
        initGrid();
        initData();
        optionPush();
    }
    //function initFenJiFenQuan()
    //{
    //    //1 获取到数组
    //    var arrayShuZu= Frame.Permission.getCurPermission();
    //    //2 将数组作简洁处理
    //    var arrayShuZuNew=[];
    //    $.each(arrayShuZu,function(i,item){
    //        var itemNew=item.split('_')[1];
    //        arrayShuZuNew.push(itemNew);
    //    });
    //    if($.inArray("EXEC",arrayShuZuNew) ==-1){
    //        initGrid1();
    //        //隐藏“执行”的功能
    //        //执行
    //        $("#alert_list").addClass("upward");
    //    }
    //    else{
    //        initGrid();
    //        //$("#WipsList").SList ("head", opt);
    //    }
    //}
    function _destroy() {
        hPending&&hPending.close();
        Utils.Request.clearMoudleAjax(MODULE_NAME);
    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["SList"],
        "utils": ["Base","Request"]
    });
})(jQuery);