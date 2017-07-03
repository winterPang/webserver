;(function ($) {
    var MODULE_BASE = "x_summary";
    var MODULE_NAME = MODULE_BASE + ".dpi_url";
    var g_sn = FrameInfo.ACSN;
    var searchUrl="";
    var searchMac="";
    var searchUrlPie="";
    var searchMacPie="";
    var pageData=[];
    var iPage=1;
    var iCount;
    var bLang= $.cookie("lang")||"cn";
    var iPageNumber;
    var nullContent=false;
    var timeChange=getRcText("TimeChange").split(",")[0];
    var searchFlag=false;
    var timerWeb;
    var timerUser;
    var sortFlag=false;;
    var sortName;
    var sortRule;


    /*定义全局变量来标识所选的状态和过滤条件*/
    var g_MacAndUrl = 0; //选择过滤的是的全部（0）还是MAC（1）或Url（2）；
    var g_SelectTime = 0; //选择时间过滤 一天（0）七天（1）一月（2）一年（3），其他（4）；

    function getRcText(sRcName) {
        return Utils.Base.getRcString("dpi_monitor_rc", sRcName);
    }

    /*验证MAC地址的合法性*/
    function macFormCheck(mac)
    {
        var macs = new Array();
        macs = mac.split("-");
        if(macs.length != 3)
        {
            return false;
        }
        for (var s=0; s<3; s++) {
            var temp = parseInt(macs[s],16);

            if(isNaN(temp))
            {
                return false;
            }


            if(temp < 0 || temp > 65535)
            {
                return false;
            }
        }
        return true;
    }

    //获取时间函数
    function getTheDate(str1,str2)
    {
        var oDate=new Date();
        var tNow = oDate.getTime();
        oDate.setHours(0);
        oDate.setMinutes(0);
        oDate.setSeconds(0);
        var sNow=oDate.getTime();
        var oneDay = 60*60*1000*24;
        if(str2=="end"){
            return tNow;
        }
        switch(str1) {
            case "one":
                return sNow - oneDay;
                break;
            case "aweek":
                return sNow - oneDay*7;
                break;
            case "month":
                return sNow - oneDay*31;
                break;
            case "year":
                return sNow - oneDay*361;
                break;
            case "today":
                // oDate.setHours(0);
                // oDate.setMinutes(0);
                // oDate.setSeconds(0);
                return oDate.getTime();
                break;
            default:
                return tNow - oneDay;
            break;
        }

    }

    function topChange(top, lineHeight,sum, mixTop)//中间点距离上边高度， 行高， 数量， 最小上边距
    {
        if(mixTop != undefined)
        {
            if(top - sum * lineHeight / 2 < mixTop)
            {
                return mixTop;
            }
        }
        return parseInt(top - sum * lineHeight / 2);
    }

    /*饼图option*/
    function initUrlPie(aData) {
        if(aData.length == 0)
        {
            var option = {
                calculable : false,
                height:300,
                tooltip : {
                    show:false
                },
                series : [
                    {
                        type: 'pie',
                        radius: ['35%', '65%'],
                        center: ['25%', '47%'],
                        itemStyle: {
                            normal: {
                                labelLine:{
                                    show:false
                                },
                                label:
                                {
                                    show:false
                                }
                            }
                        },
                        data: [{name:"",value:1}]
                    }
                ]
            };
            var oTheme = {color: ['#B7ADAD']};
        }
        else
        {
            var adata = aData;
            /*防止时长为0而出现错误*/
            for(var i=0;i<adata.length;i++)
            {
                if(adata[i].value == 0)
                {
                    adata[i].value = 1;
                }
            }
            var option = {
                height: 300,
                tooltip: {
                    trigger: 'item',
                    formatter: " {b}: {d}%"
                },
                myLegend: {
                    scope: "#UrlType_message",
                    width: "33%",
                    height: 150,
                    right: "25%",
                    top: topChange(140, 31,aData.length,8)
                },
                calculable: false,
                series: [
                    {
                        //  name: aID[2],
                        type: 'pie',
                        radius: ['35%', '65%'],
                        center: ['25%', '47%'],
                        itemStyle: {
                            normal: {
                                labelLine: {
                                    show: false
                                },
                                label: {
                                    position:"inner",
                                    formatter: function(a){
                                        return"";
                                    }
                                }
                            }
                        },
                        data: adata
                    }
                ]
            };
            /* var oTheme = {
             color: ['#C72222','#S0E014','#FFFF00','#8A2BE2','#33FF00','#483D8B','#BB860B','#006400']
             };*/
            var oTheme = {
                color: ['#D52B4D', '#FF9900', '#44BB74', '#D56F2B', '#C48D3C', '#55AA66', '#44A3BB', '#2BD5D5', '#91B2D2', '#D7DDE4']
            };
        }
        $("#UrlType_pie").echart("init", option, oTheme);
    }

    /*分页事件添加*/
    function pageChange(){
        console.log("first",iPage,iPageNumber);
        var $pageNext=$("#WelcomeList .page-next");
        var $pagePrev=$("#WelcomeList .page-prev");
        var $pageLast=$("#WelcomeList .page-last");
        var $pageFirst=$("#WelcomeList .page-first");
        var $pageStatus=$("#WelcomeList .page-status");
        if(iPage==iPageNumber){
            $pageStatus.html("当前是第"+iPage+"页，第"+((iPage-1)*10+1)+"条到第"+iCount+"条数据，共"+iCount+"条数据。");
        }else{
            console.log(iPage,iCount);
            $pageStatus.html("当前是第"+iPage+"页，第"+((iPage-1)*10+1)+"条到第"+((iPage-1)*10+10)+"条数据，共"+iCount+"条数据。");
        }
        if(nullContent){
            $pageStatus.html("暂无数据。");
        }
        $pageNext.off("click");
        $pageFirst.off("click");
        $pageLast.off("click");
        $pagePrev.off("click");
        $pageFirst.click(function(){
            iPage=1;
            listPageData("firstPage");
        });
        $pageLast.click(function(){
            //listPageData("lastPage");
            if(iPage==iPageNumber){
                $pageStatus.html("当前是第"+iPage+"页，第"+((iPage-1)*10+1)+"条到第"+iCount+"条数据，共"+iCount+"条数据。");
                return;
            }else{
                console.log("iPage!=iPageNumber",iPage,iPageNumber);
                listPageData("lastPage");
                iPage=iPageNumber;
                //$pageStatus.html("当前是第"+iPage+"页，第"+((iPage-1)*10+1)+"条到第"+iCount+"条数据，共"+iCount+"条数据。");
            }

        });
        $pagePrev.click(function(){
            if(iPage==1){
                return;
            }else{
                listPageData("previousPage");
                iPage--;
            }
        });
        $pageNext.click(function(){
            console.log("iPage=iPageNumber",iPage,iPageNumber);
            if((iPage+1)==iPageNumber){
                listPageData("lastPage");
                //$pageStatus.html("当前是第"+iPage+"页，第"+((iPage-1)*10+1)+"条到第"+iCount+"条数据，共"+iCount+"条数据。");
            }else if(iPage>iPageNumber){
                return;
            }else if(iPage<iPageNumber){
                listPageData("nextPage");
                iPage++;
            }
        });
        console.log("iPage",iPage,iPageNumber);
    }

    /*表格分页请求*/
    function listPageData(flag,name,sign){

        /*模糊搜索是否开启*/
        if(!searchFlag){
            searchUrl="";
            searchMac="";
        }

        /*今日*/
        var nStartTime = getTheDate("today", "start");
        var nEndTime = (new Date()).getTime();
        /*请求*/
        var paramData={
            family: 0,
            ACSN: FrameInfo.ACSN,
            limit:10,
            startTime: nStartTime,
            endTime: nEndTime,
            userMAC:searchMac,
            WebSiteName:searchUrl
        };
        var local={

        };

        /*是否排序*/
        if(sortFlag){
            paramData.sortName=sortName;
            paramData.sortRule=sortRule;
        }

        /*method*/
        switch(flag){
            case "firstPage":
                paramData.action="firstPage";
                break;
            case "lastPage":
                paramData.action="lastPage";
                break;
            case "nextPage":
                paramData.action="nextPage";
                local=pageData[pageData.length-1];
                break;
            case "previousPage":
                paramData.action="previousPage";
                local=pageData[0];
                break;
            default:
                paramData.action="firstPage";
                break;
        }

        /*send request*/
        var SendMsg = {
            url: MyConfig.path + "/ant/read_dpi_url",
            type: "POST",
            dataType: "json",
            ContentType: "application/json",
            data: {
                "method": 'getUrlPageData',
                "local":local,
                "param": paramData
            },
            onSuccess:getMsgSuccess,
            onFailed:getMsgFail
        };
        Utils.Request.sendRequest(SendMsg);
        function getMsgSuccess(data)
        {
            var aMessage = data.message.data;
            /*保存当页数据*/
            if(data.message.data.length!=0){
                pageData=[];
                for(var i=0;i<data.message.data.length;i++){
                    var singleData={
                        "ACSN":data.message.data[i].ACSN,
                        "CategoryName":data.message.data[i].CategoryName,
                        "CategoryNameCN":data.message.data[i].CategoryNameCN,
                        "DestIP":data.message.data[i].DestIP,
                        "FirstTime":data.message.data[i].FirstTime,
                        "LastTime":data.message.data[i].LastTime,
                        "TotalTime":data.message.data[i].TotalTime,
                        "UrlName":data.message.data[i].UrlName,
                        "UserMAC":data.message.data[i].UserMAC,
                        "WebSiteName":data.message.data[i].WebSiteName,
                        "_id":data.message.data[i]._id
                    };
                    aMessage[i].FirstTime=(new Date(aMessage[i].FirstTime)).toLocaleString();
                    pageData.push(singleData);
                }
            }
            $("#WelcomeList").SList ("refresh", data.message.data);
            /*首尾页处理*/
            if("totalCount" in data.message){
                nullContent=false;
                iCount=data.message.totalCount;
                if(data.message.totalCount%10){
                    iPageNumber=(parseInt((data.message.totalCount)/10)+1)||iPageNumber;
                }else{
                    iPageNumber=parseInt((data.message.totalCount)/10)||iPageNumber;
                }
                if(data.message.totalCount==0){
                    nullContent=true;
                }
            }else{

            }
            console.log("iPageNumber",iPageNumber,iPage,pageData);
            /*事件处理*/
            pageChange();
        }
        function getMsgFail()
        {
            console.log("get url data fail!");
        }
    }

    /*slist模糊搜索,间隔发送*/
    function searchData(){
        $(".cancel-icon").click(function(){
            searchFlag=false;
            listPageData("firstPage");
        });
        $(".search-icon").click(function(){
            searchFlag=true;
        });
        var $WebSiteName=$("#WelcomeList input[sid=WebSiteName]");
        var $UserMAC=$("#WelcomeList input[sid=UserMAC]");
        $WebSiteName.keyup(function(){
            searchMac=$UserMAC.val()||"";
            searchUrl=$WebSiteName.val()||"";
            clearTimeout(timerWeb);
            timerWeb=setTimeout(function(){
                listPageData("firstPage");
            },500);
        });
        $UserMAC.keyup(function(){
            searchMac=$UserMAC.val()||"";
            searchUrl=$WebSiteName.val()||"";
            clearTimeout(timerUser);
            timerUser=setTimeout(function(){
                listPageData("firstPage");
            },500);
        });
    }

    /*网站人次饼图初始化*//*没有输入MAC地址和URL*//*统计单个或所有的网站类型的访问人次的前10*/
    function aiaxPersonForPie(st,en)
    {
        /*是否选择时间范围*/
        if(st&&en){
            var nStartTime = st;
            var nEndTime = en ;
        } else if($("#InputselecTime").text() == getRcText("TODAY")){
            var nStartTime = getTheDate(timeChange, "Start");
            var nEndTime = (new Date()).getTime();
        } else{
            var nStartTime = getTheDate(timeChange, "Start");
            var endTime = new Date();
                endTime.setHours(0);
                endTime.setMinutes(0);
                endTime.setSeconds(0);
            var nEndTime = endTime.getTime();

        }
        console.log("饼图",timeChange,nStartTime,nEndTime);

        /*饼图请求*/
        var SendMsg = {
            url: MyConfig.path + "/ant/read_dpi_url",
            type: "POST",
            dataType: "json",
            ContentType: "application/json",
            data: {
                method:'getUrlTop10',
                param: {
                    family:0,
                    ACSN:FrameInfo.ACSN,
                    userMAC:searchMacPie,
                    WebSiteName:searchUrlPie,
                    startTime:nStartTime,
                    endTime:nEndTime
                }
            },
            onSuccess:getMsgSuccess,
            onFailed:getMsgFail
        };
        Utils.Request.sendRequest(SendMsg);
        function getMsgSuccess(data)
        {
            console.log("datatop10",data);
            var aMessage = data.message;
            var aData = [];
            for(var i=0;i<aMessage.length;i++)
            {
                var oTemp = {};
                oTemp.name = aMessage[i]._id;
                oTemp.value = aMessage[i].Count;
                aData.push(oTemp);
            }
            initUrlPie(aData);
        }
        function getMsgFail()
        {
            console.log("fail terminal fail!");
        }
    }


    /*初始化第一张图的饼图*/
    function initPie(st,en)
    {
        if(st&&en){
            aiaxPersonForPie(st,en);
        }else{
            aiaxPersonForPie();
        }

    }

    function initGrid()
    {
        //选择全部时显示
        var opt = {
            colNames: getRcText ("WELCOME_HEAD"),
            pageSize:10,
            showHeader: true,
            asyncPaging:true,
            multiSelect:false,
            search:true,
            onSort:function (sName,isDesc)
            {
                sortFlag=true;
                sortName=sName;
                if(isDesc){
                    sortRule="descending";
                }else{
                    sortRule="ascending";
                }
                console.log("sortFlag,sortName,sortRule",sortFlag,sortName,sortRule);
                listPageData("firstPage");
            },

            colModel: [
                // {name: "CategoryName", datatype: "String"},
                {name: "WebSiteName", datatype: "String"},
                {name:"UserMAC",datatype:"Mac"},
                //{name: "value", datatype: "Integer"},
                //{name: "TotalTime", datatype: "Integer"}
                //{name: "FirstTime", datatype: "Integer"},
                {name: "FirstTime",searcher:false,datatype: "String"}
            ]
        };
        $("#WelcomeList").SList ("head", opt);
    }

    /*有输入框的下拉框的事件处理*/
    var dealEvent   = {
        nowState : {},
        nowRadio : 0,
        scope    : "",
        currentid:"",
        init: function(){
            var jscope = $(".probe-choice");
            for(var i = 0; i < jscope.length; i++)
            {
                dealEvent.nowState[jscope[i].getAttribute("id")] = 1;
            }
        },
        liOnClick: function(e){
            var scope = $(this);
            timeChange=getRcText("TimeChange").split(",")[scope.val()];
            if(scope.val() == dealEvent.nowState[dealEvent.currentid])
            {
                $(".choice-show", dealEvent.scope).removeClass("height-change");
                return false;
            }
            else
            {
                dealEvent.nowState[dealEvent.currentid] = scope.val();
                $(".current-state", dealEvent.scope).text(scope.text());
                $(".choice-show", dealEvent.scope).removeClass("height-change");
            }
            $("#body_over").addClass("hide");

            $(dealEvent.scope).trigger({type:"probechange.probe"}, {value:dealEvent.nowState[dealEvent.currentid]});
        },
        inputClick:function(e){
            $("#tip").removeClass("hide").addClass("show");
            dealEvent.currentid = $(this).closest(".probe-choice").attr("id");
            dealEvent.scope = "#" + dealEvent.currentid;
            $("#body_over").removeClass("hide");
            $(".choice-show", dealEvent.scope).addClass("height-change");

            return false;
        },
        blackClick:function(e){
            $("#body_over").addClass("hide");
            $(".choice-show", dealEvent.scope).hasClass("height-change") && $(".choice-show", dealEvent.scope).removeClass("height-change");
        },
        searchClick:function(e){
            dealEvent.nowState[dealEvent.currentid] = 0;
            $("#body_over").addClass("hide");
            $(".choice-show", dealEvent.scope).removeClass("height-change");
            $(".current-state", dealEvent.scope).text($(".probe-input").val());

            $(dealEvent.scope).trigger({type:"probechange.probe"}, {value:dealEvent.nowState[dealEvent.currentid]});

        },
        searchClickAll:function(e){
            dealEvent.nowState[dealEvent.currentid] = 0;
            $("#body_over").addClass("hide");
            $(".choice-show", dealEvent.scope).removeClass("height-change");
            $(".current-state", dealEvent.scope).text(getRcText("TEXT"));
            $(dealEvent.scope).trigger({type:"probechange.probe"}, {value:dealEvent.nowState[dealEvent.currentid]});
            document.getElementById("MACinput").value=getRcText("URL").split(',')[0];
            document.getElementById("URLinput").value=getRcText("URL").split(',')[1];
            /*显示饼图  折线图两个按钮*/
            // $("#AllShowType").removeClass("hide");
            // $("#OneShowType").addClass("hide");
            /*取消URL和MAC显示的红框*/
            $("#MACinput").removeClass("border-red");
            $("#URLinput").removeClass("border-red");
            var value = 0;
            searchMacPie = "";
            searchUrlPie = "";
            initPie();
        },
        searchClickMAC:function(e){
            /*取消URL显示的红框*/
            $("#URLinput").removeClass("border-red");
            /*清除输入的url*/
            //document.getElementById("URLinput").value="访问网址";
            document.getElementById("URLinput").value=getRcText("URL").split(',')[1];
            /*判断MAC地址的合法性 如果不合法则不收回下拉框*/
            var MacValue = $("#MACinput").val();
            searchMacPie =  $("#MACinput").val();
            searchUrlPie = "";
            if((!macFormCheck(MacValue)))
            {
                $("#MACinput").addClass("border-red");
                return;
            }
            else
            {
                $("#MACinput").removeClass("border-red");
            }

            dealEvent.nowState[dealEvent.currentid] = 0;
            $("#body_over").addClass("hide");
            $(".choice-show", dealEvent.scope).removeClass("height-change");
            $(".current-state", dealEvent.scope).text($("#MACinput").val());
            $(dealEvent.scope).trigger({type:"probechange.probe"}, {value:dealEvent.nowState[dealEvent.currentid]});
            initPie();
        },
        searchClickURL:function(e){
            /*取消MAC地址显示的红框*/
            $("#MACinput").removeClass("border-red");
            /*清除输入的MAC*/
            document.getElementById("MACinput").value=getRcText("URL").split(',')[0];
            /*如果输入的网址是空，则提示 并不收回下拉框*/
            var UrlValue = $("#URLinput").val();
            searchUrlPie = $("#URLinput").val();
            searchMacPie = "";

            if(UrlValue == ""||UrlValue == getRcText("URL").split(',')[1])
            {
                $("#URLinput").addClass("border-red");
                return;
            }
            else
            {
                $("#URLinput").removeClass("border-red");
            }

            dealEvent.nowState[dealEvent.currentid] = 0;
            $("#body_over").addClass("hide");
            $(".choice-show", dealEvent.scope).removeClass("height-change");
            $(".current-state", dealEvent.scope).text($("#URLinput").val());
            $(dealEvent.scope).trigger({type:"probechange.probe"}, {value:dealEvent.nowState[dealEvent.currentid]});
            initPie();
        },
        timeClick: function (e) {
            $("#probe_timechoice").addClass("hide");
        },
        dateChange: function (e) {
            dealEvent.nowState[dealEvent.currentid] = 4;///

            var orange = $(this,dealEvent.scope).daterange("getRangeData");
            $(".current-state", dealEvent.scope).text(orange.startData + '-' +orange.endData);
            var  sinputTime = orange.startData + '-' +orange.endData
            document.getElementById("daterange").value=sinputTime;
            $(".choice-show", dealEvent.scope).removeClass("height-change");

            StartTime = new Date(orange.startData)-0;////
            EndTime = new Date(orange.endData)-0;/////
            $(dealEvent.scope).trigger({type:"probechange.probe"}, {value:dealEvent.nowState[dealEvent.currentid],startTime:StartTime,endTime:EndTime});

        }
    };


    function optionPush(){
        $(".toppannel #switch-text").html(getRcText("switchBtn"));
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

        /*生成dev下拉框并设置值*/
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

            /*获取设备在线状态   1:不在线   0:在线微服务: renwenjie*/
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
                data: JSON.stringify({
                    "Method": "getdevListByUser",
                    "param": {
                        "userName": FrameInfo.g_user.attributes.name

                    }
                }),
                dataType: "json",
                timeout: 150000,
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

    function ClickInput()
    {
        document.getElementById("MACinput").value="";
        //document.getElementById("URLinput").value="访问网址";
        document.getElementById("URLinput").value=getRcText("URL").split(',')[1];
    }

    function focusMac(){
        var $MACinput=$("#MACinput");
        $MACinput.on("blur",function(){
            if($MACinput.val()==""){
                $MACinput.val(getRcText("URL").split(',')[0]);
            }
        })
    }

    function focusUrl(){
        var $URLinput=$("#URLinput");
        $URLinput.on("blur",function(){
            if($URLinput.val()==""){
                $URLinput.val(getRcText("URL").split(',')[1]);
            }
        })
    }

    function ClickURLInput()
    {
        //document.getElementById("MACinput").value="用户MAC";
        document.getElementById("MACinput").value=getRcText("URL").split(',')[0];
        document.getElementById("URLinput").value="";
    }

    /*取消告警的红框*/
    function changeColor()
    {
        var MacValue = $("#MACinput").val();
        if((MacValue == "")||(macFormCheck(MacValue)))
        {
            $("#MACinput").removeClass("border-red");
        }
    }

    function initForm()
    {
        /*选择显示的周期*/
        $("#selectTime").on("probechange.probe",function(e, param){
            console.log("e, param",e, param);
            var st=param.startTime;
            var en=param.endTime;
            initPie(st,en);
        });
        //$("#daterange").on("change",otherTime);


        //$("#SelectType").on("change",SelectUrlType);
        /*选择人次或时长*/
        //$("#SelectWay").on("change",SelectWay);

        $("#all").click(dealEvent.searchClickAll);
        $("#MACinput").on("click",ClickInput);
        $("#URLinput").on("click",ClickURLInput);
        //$("#MACinput").on("click",focusMac);
        //$("#URLinput").on("click",focusUrl);
        $("#UserMAC").click(dealEvent.searchClickMAC);
        $("#Url").click(dealEvent.searchClickURL);

        /*有输入框的下拉框事件*/
        $(".choice-head").click(dealEvent.inputClick);
        $(".choice-show li").click(dealEvent.liOnClick);
        $("#body_over").click(dealEvent.blackClick);
        /*$(".search-icon").click(dealEvent.searchClick);
         $(".search-icon1").click(dealEvent.searchClick);*/
        $("#daterange").on("inputchange",dealEvent.dateChange);

    }

    function initData()
    {
        initPie();
        optionPush();
        listPageData("firstPage");
        searchData();
    }


    function _init()
    {

        initForm();
        initGrid();
        initData();

    }

    function _destroy()
    {
        Utils.Request.clearMoudleAjax(MODULE_NAME);
    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["SList","Echart","DateRange","SingleSelect","DateTime"],
        "utils":["Base","Request"]
    });
})( jQuery );

