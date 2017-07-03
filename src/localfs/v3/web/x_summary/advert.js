(function ($) {
    var MODULE_NAME = "x_summary.advert";

    var g_aTodayData = null,
        g_aYesterDayData = null,
        historyData = null;

    var g_days = null;
    var hPending = null;
    var g_sStoreId = FrameInfo.Nasid ;//;405
    
    var g_aTodaySpanData = [],
        g_aYesterDaySpanData = [];

    function getRcText(sRcName) {
        return Utils.Base.getRcString("x_adAnalysisi_rc", sRcName);
    }

    function drawAdShow() {
        option = {
            height: "90%",
            title: {
                show: false
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                x: "center",
                y: "bottom",
                data: ['h', 'l', 'm', 'n', 'i']
            },
            series: [
                {
                    name: getRcText("DRAW_AD_SHOW_NAME"),
                    // '广告展示'
                    type: 'pie',
                    radius: '65%',
                    center: ['50%', '40%'],
                    data: [
                        { value: 335, name: 'h' },
                        { value: 310, name: 'l' },
                        { value: 234, name: 'm' },
                        { value: 135, name: 'n' },
                        { value: 1548, name: 'i' }
                    ],
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
        var oTheme = {
            color: ['#53B9E7', '#31ADB4', '#69C4C5', '#FFBB33', '#FF8800']
        };
        $("#adShow").echart("init", option, oTheme);
    }

    function drawAdShowCount(type, adverDate) {
        var show_data = {};
        if (adverDate == "today") {
            show_data = g_aTodaySpanData;
        }
        else if (adverDate == "yesterday") {
            show_data = g_aYesterDaySpanData;
        }
        var data = [];
        if (show_data.length == 0) {
            data.push(0);
        } else {
            for (var i = 0; i < show_data.length; i++) {
                show_data[i].ctr = show_data[i].pv == 0?0: show_data[i].clickCount/show_data[i].pv;
                data.push(show_data[i][type]);
            }
        }

        option = {
            width: "100%",
            height: "300",
            title: false,
            tooltip: {
                trigger: 'axis',
                formatter: function (data) {
                    return getRcText(type) + ':'+data[0].value;
                }
            },
            grid: {
                show: "false"
            },
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    splitLine: {
                        show: true,
                        textStyle: { color: '#c9c4c5', fontSize: "1px", width: 4 },
                        lineStyle: {
                            // 使用深浅的间隔色
                            color: ['#e7e7e9']
                        }
                    },
                    data: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18'
                        , '19', '20', '21', '22', '23']
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    splitLine: {
                        show: true,
                        textStyle: { color: '#c9c4c5', fontSize: "1px", width: 4 },
                        lineStyle: {
                            // 使用深浅的间隔色
                            color: ['#e7e7e9']
                        }
                    },
                    axisLabel: {
                        show: true,
                        textStyle: { color: '#9da9b8', fontSize: "12px", width: 2 }
                    },
                    axisLine: {
                        show: true,
                        lineStyle: { color: '#9da9b8', width: 1 }
                    }
                }
            ],
            series: [{
                name: type,
                type: 'line',
                barCategoryGap: '40%',
                data: data,
                itemStyle: {
                    normal: {
                        label: {
                            show: true,
                            position: 'insideTop',
                            formatter: function (data) {
                                return data.value;

                            }
                        },
                        color: '#69C4C5'
                    }
                }

            }]
        };
        var oTheme = {
            color: ['#48BEF4', '#FCE1DC']
        };
        $("#adShowCount").echart("init", option, oTheme);

    }

    function drawBasicList() {
        var opt = {
            height: "120",
            showHeader: true,
            multiSelect: false,
            search :false,
            sortable:false,
            colNames: getRcText("BASIC_ITEM"),
            colModel: [
                { name: "title", datatype: "String", width: 50, hideSort: true},
                { name: "pv", datatype: "String", width: 100 },
                { name: "pu", datatype: "String", width: 100 },
                { name: "clickCount", datatype: "String", width: 100 },
                { name: "ctr", datatype: "String", width: 100 },
                //{ name: "visitorTimeAver", datatype: "String", width: 100 },
            ]
        };
        $("#basic_slist").SList("head", opt);
    }

    // function drawHistoryList() {
    //     var opt = {
    //         showHeader: true,
    //         multiSelect: false,
    //         search: false,
    //         pageSize: 10,
    //         colNames: getRcText("HISTORY_ITEM"),
    //         colModel: [
    //             { name: "title", datatype: "String", width: 150 },
    //             { name: "pv", datatype: "String", width: 150 },
    //             { name: "pu", datatype: "String", width: 150 },
    //             { name: "clickCount", datatype: "String", width: 150 },
    //             { name: "ctr", datatype: "String", width: 150 },
    //             // { name: "visitorTimeAver", datatype: "String", width: 150 }
    //         ],
    //         buttons: [
    //             { name: "default", value: getRcText("EXPORT"), action: exportData,className:"btn_ok" }
    //         ]
    //     };
    //     $("#history_slist").SList("head", opt);
    // }
    function exportData(){
        getUserType(function (usertype) {
            getAdertUrl(function (file_url) {
              //  var domain = "https://lvzhoutest.h3c.com/";
                var endTime = new Date(),
                    startTime = new Date();
                startTime.setDate(startTime.getDate() - 1);
                startTime.setHours(0, 0, 0);
                //if(usertype == "false"){
                //    domain = "https://lvzhou.h3c.com/";
                //}
                //$("#exportFile").get(0).src = domain + file_url;
                $("#exportFile").get(0).src =MyConfig.v2path + "/advertisement/downloadAdvertisement?ownerName=" + FrameInfo.g_user.user+ "&storeId=" + g_sStoreId  + "&startRowIndex=0&maxItems=50&startTime=" + startTime.getTime() + "&endTime=" + endTime.getTime();
            })
        })
    }
    function getUserType(cBack) {
        var opt ={
            type: "POST",
            url: MyConfig.path + "/scenarioserver",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({
                // devSN: FrameInfo.ACSN,
                // cloudModule: 'xiaoxiaobeicfg',
                // deviceModule: "xiaoxiaobei",
                Method: "getUserAttr",
                // configType :1,
                param: {
                    "userName": FrameInfo.g_user.user
                },
            }),
            onSuccess: function (data) {
                if (!('retCode' in data && data.retCode == 0)) {
                    return;
                }
                cBack(data.message.bUserTest);
            },
            onFailed: function (err) {
                hPending&&hPending.close();
                return;
            }
        }
        Utils.Request.sendRequest(opt);
    }
    // 导出数据
    function getAdertUrl(cback) {
            if(!g_sStoreId){
                return;
            }
        var endTime = new Date(),
            startTime = new Date();
            startTime.setDate(startTime.getDate() - 1);
            startTime.setHours(0, 0, 0);

        var exportDataOpt = {
            type: "GET",
            headers: { Accept: "application/json" },
            dataType: "json",
            url: MyConfig.v2path + "/advertisement/downloadAdvertisement?ownerName=" + FrameInfo.g_user.user+ "&storeId=" + g_sStoreId  + "&startRowIndex=0&maxItems=50&startTime=" + startTime.getTime() + "&endTime=" + endTime.getTime(),
            onSuccess:function(data){
                console.log(data);
                // $("#exportFile").get(0).src = "https://lvzhoutest.h3c.com/"+ data.data;
                cback(data);
            },
            onFailed:function(err){
                hPending&&hPending.close();
                console.log(err);
            }
        }
        Utils.Request.sendRequest(exportDataOpt);
    }

    function drawDetailList() {

        var opt = {
            multiSelect: false,
            search:false,
            sortable:false,
            colNames: getRcText("DETAIL_ITEM"),
            colModel: [
                { name: "url", datatype: "String", width: 300 },
                { name: "pv", datatype: "String", width: 80 },
                { name: "pu", datatype: "String", width: 80 },
                { name: "clickCount", datatype: "String", width: 50 },
                { name: "ctr", datatype: "String", width: 100 },
                //{ name: "stayTimeAver", datatype: "String", width: 100 }
            ]
        };
        $("#detail_slist").SList("head", opt);
    }

    function getAdvertMessage(strDay,onSuccess,datadate) {
        var endTime = new Date(),
            startTime = new Date();
        switch (strDay) {
            case "today":
                startTime.setHours(0, 0, 0);
                break;
            case "yesterday":
                endTime.setHours(0, 0, 0);
                startTime.setDate(startTime.getDate() - 1);
                startTime.setHours(0, 0, 0);
                break;
            case "history":
                var todayData = datadate.data;
                if (todayData) {

                    var start_times = [];

                    for (var i = 0; i < todayData.length; i++) {
                        start_times.push(new Date(todayData[i].ad_start_time));
                    }

                    var minstarttime = Math.min(start_times);
                    var preMonth = new Date(startTime.setMonth(startTime.getMonth() - 1));

                    if (preMonth - minstarttime <= 0) {
                        startTime = new Date(minstarttime);
                    } else {
                        startTime = new Date(preMonth);
                    }
                } else {

                    startTime.setMonth(startTime.getMonth() - 1);

                }

                startTime.setHours(0, 0, 0);
                g_days = Math.floor((endTime - startTime) / 1000 / 3600 / 24);
                break;
            default:
                return;
        }

        var AdvertMessageOpt = {
            type: "GET",
            headers: { Accept: "application/json" },
            dataType: "json",
            url: MyConfig.v2path + "/advertisement/query?ownerName=" + FrameInfo.g_user.user + "&storeId=" + g_sStoreId + "&startRowIndex=0&maxItems=50&startTime=" + startTime.getTime() + "&endTime=" + endTime.getTime(),
            onSuccess:onSuccess,
            onFailed:function(){
                hPending&&hPending.close();
                console.log("failed to getAdvertMessage");
            }
        }

        Utils.Request.sendRequest(AdvertMessageOpt);

    }

    function initDetailList(detailday) {
        var detailListTempData = [];

        if (detailday == "TODAY") {
            detailListTempData = g_aTodayData;
        }
        if (detailday == "YESTERDAY") {
            detailListTempData = g_aYesterDayData;//historyData;
        }
        detailListTempData.forEach(function (detail) {
            if (!("stayTimeAver" in detail)) {
                detail.stayTimeAver = "-:-:-"
            }
            if (detail.url == '-1'){
                detail.url = '-';
            }
        });

        $("#detail_slist").SList("refresh", detailListTempData);
    }
    function initBaseList(todayData, yesterdayData, historyData) {
        var basicListTempData = [];
        function dealWithData(data, title) {
            var oTempObj = {
                title: getRcText(title),
                pv: 0,
                pu: 0,
                clickCount: 0,
                ctr: 0,
                visitorTimeAver: "-:-:-",
                turnCount: "--"
            };
            data = data || [];
            data.forEach(function (data) {
                oTempObj.pv += data.pv;
                oTempObj.pu += data.pu;
                oTempObj.clickCount += data.clickCount;
                oTempObj.ctr += (parseFloat(data.ctr));
                console.log(parseFloat(data.ctr).toFixed(2));
            }, this);

            if (title == "HISTORYAVG") {
                oTempObj.pv = (oTempObj.pv / g_days).toFixed(2);//Math.ceil(oTempObj.pv / g_days);
                oTempObj.pu = (oTempObj.pu / g_days).toFixed(2);//Math.ceil(oTempObj.pu / g_days);
                oTempObj.clickCount = (oTempObj.clickCount / g_days).toFixed(2);//Math.ceil(oTempObj.clickCount / g_days);
                oTempObj.ctr /= g_days;

            }

            oTempObj.pv += "";
            oTempObj.pu += "";
            oTempObj.clickCount += "";

            oTempObj.ctr = data.length != 0 ? (oTempObj.ctr / data.length).toFixed(2)+"%" : "0%";


            return oTempObj;
        }
        basicListTempData.push(dealWithData(todayData, "TODAY"));
        basicListTempData.push(dealWithData(yesterdayData, "YESTERDAY"));
        basicListTempData.push(dealWithData(historyData, "HISTORYAVG"));
       // console.log("数据是data" + basicListTempData);
        console.log(getRcText("DATA_TEXT") + basicListTempData);
        $("#basic_slist").SList("refresh", basicListTempData);
        // 历史记录
        $("#history_slist").SList("refresh", basicListTempData);
    }

    function getAdvertBySpan(onSuccess,onFailed) {
        var opt = {
            type: "GET",
            url: MyConfig.v2path + "/advertisement/queryBySpan?ownerName=" +FrameInfo.g_user.user + "&storeId=" + g_sStoreId+'&span='+60*60*1000,
            headers: { Accept: "application/json" },
            dataType: "json",
            onSuccess:onSuccess,
            onFailed:onFailed
        }

        Utils.Request.sendRequest(opt);
    }

    function initAdvert() {
        getAdvertMessage("today",function (data, textStatus, jqXHR) {
            try {
                if (!('data' in data && 'errorcode' in data)){
                    throw (new Error('data1 not exist'));
                }
                    if (data.errorcode !== 0) {
                        console.log("get advert message failed errorcode:" + data.errorcode);
                        return;
                    }
                g_aTodayData = data.data;
                getAdvertMessage("yesterday", function (data, textStatus, jqXHR) {
                    try {
                            if (!('data' in data && 'errorcode' in data)) {
                                throw (new Error('data2 not exist'));
                            }
                            if (data.errorcode !== 0) {
                                console.log("get advert message failed errorcode:" + data.errorcode);
                                return;
                            }
                            g_aYesterDayData = data.data;
                            getAdvertMessage("history", function (data, textStatus, jqXHR) {
                                try {
                                    if (!('data' in data && 'errorcode' in data)) {
                                        throw (new Error('data2 not exist'));
                                    }
                                    historyData = data.data;

                                    initBaseList(g_aTodayData, g_aYesterDayData, historyData);
                                } catch(error){

                                }

                            }, g_aTodayData);
                    }catch(error){
                            console.log(error);
                    }

                });
            }catch(error){
                console.log(error);
            }finally {
                initDetailList("TODAY");
            }
        });

        function getAdverFail(){
            console.log('getAdvertBySpan Fail!!')
        }
        
        getAdvertBySpan(function (data, textStatus, jqXHR) {
            try {
                if(!('errorcode' in data && 'data' in data && data.data.length > 0)){
                    throw (new Error('data not exist'));
                }
                if (data.errorcode != 0 && data.data.length < 48) {
                    return;
                }
                data = data.data;
                for (var i = 0; i < 24; i++) {

                    g_aYesterDaySpanData.push(data[i]);
                }
                for (; i < 48; i++) {
                    g_aTodaySpanData.push(data[i]);
                }
            }catch(error){

            }finally{
                drawAdShowCount("pv", "today");
            }

        },getAdverFail);
    }

    function initData() {
        initAdvert();
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
               // $panel.hide();
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
    function initForm() {
        $(".toppannel #switch-text").html(getRcText("switchBtn"));
        var thisId = "pv";
        var thisType = "today";
        $("input[name='advert-info']").on("click", function () {
            var self = $(this);
            thisId = self.attr("id");
            console.log(thisId);
            drawAdShowCount(thisId, thisType);
        });
        $("#todayAd").on("click", function () {
            $(this).css("color", "#343e4e");
            $("#yesterdayAd").css("color", "#80878c");
            thisType = "today";
            drawAdShowCount(thisId, thisType);
        });
        $("#yesterdayAd").on("click", function () {
            $(this).css("color", "#343e4e");
            $("#todayAd").css("color", "#80878c");
            thisType = "yesterday";
            drawAdShowCount(thisId, thisType);
        });

        $("#todayPage").on("click", function () {
            $(this).css("color", "#343e4e");
            $("#yesterdayPage").css("color", "#80878c");
            //TODO change  the  data
            initDetailList("TODAY");
        });

        $("#yesterdayPage").on("click", function () {
            $(this).css("color", "#343e4e");
            $("#todayPage").css("color", "#80878c");
            initDetailList("YESTERDAY");
        });

        $("#a_history").on("click", function () {
            // $("#history_details").show();
            // Utils.Base.openDlg(null, {}, { scope: $("#history_details"), className: "modal-super" });
            exportData();
        });
        
        $("#his_close").on("click",function(){
            $("#exportFile").get(0).src = "";
        });
        
    }
    function initGrid() {
        //history();
        drawBasicList();
        // drawHistoryList();
        drawDetailList();
        optionPush();
    }

    function _init() {
        initGrid();
        initData();
        initForm();
    }
    function _resize(jParent) {
    }

    function _destroy() {
        hPending&&hPending.close();
        g_aTodaySpanData = [],
        g_aYesterDaySpanData = [];
    }
    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "resize": _resize,
        "widgets": ["Echart", "Minput", "SList"],
        "utils": ["Base", "Device","Request"]

    });

})(jQuery);