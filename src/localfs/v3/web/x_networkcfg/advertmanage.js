(function ($) {
    var MODULE_NAME = "x_networkcfg.advertmanage";

    var shopName = null;
    var shopID = null;
    var templateId = null;
    var templatePath = null;
    var imgPathName = null;
    var hPending = null;
    var advercont_Info = [
        '<div class="advercont">',
        '<div class="advercont-img">',
        '<img src="[src]" adver="[adver]"/>',
        '</div>',
        '<div class="advercont-date">',
        '<span class="info">',
        getRcText("DELIVERY_TIME"),
        // '投放时间:'
        '</span>',
        '<br/>',
        '<span class="info">',
        '[advertingStartTime]',
        '[ad-space]',
        '[advertingEndTime]',
        '</span>',
        '</div>',
        '</div>',
        '<hr class="adverhr"/>'].join("");

    function getRcText(sRcName) {
        return Utils.Base.getRcString("x_advertmanage_rc", sRcName).split(",");
    }

    //获取场所名
    function getShopNameID(onSuccess,onFailed) {
        var ajax = {
            type: "post",
            url: "/v3/ace/oasis/oasis-rest-shop/restshop/o2oportal/getDeviceInfo",
            contentType: "application/json",
            dataType: "json",
            timeout: 150000,
            data: JSON.stringify({
                tenant_name: FrameInfo.g_user.user,
                dev_snlist: [
                    FrameInfo.ACSN
                ]
            }),
            onSuccess:onSuccess,
            onFailed:onFailed
        }

        Utils.Request.sendRequest(ajax);
    }
    //获取url中的参数
    function getUrlParam(name) {
        var para = Utils.Base.parseUrlPara()||[];
        return para[name];
    }
    //初始化接口
    function initserver(onSuccess,onFailed) {
        var ssid = decodeURIComponent(getUrlParam("ssid"));
        var ajax = {
            type: "POST",
            url: MyConfig.path + "/initserver",
            dataType: "json",
            contentType: "application/json",
            timeout: 300000,
            data: JSON.stringify({
                "Method": "initTemplate",
                "shopName": shopName,
                "ownerName": FrameInfo.g_user.attributes.name,
                "devSN": FrameInfo.ACSN,
                "nasID": shopID,
                //"ssidName": "",
                ssid:ssid,
                "weixinAccountName": "",
                "groupID": ""
            }),
            onSuccess:onSuccess,
            onFailed:onFailed
        }
        Utils.Request.sendRequest(ajax);
    }

    //查询预览图和投放时间
    function queryImgTime(onSuccess,onFailed) {
        var ajax = {
            type: "GET",
            url: MyConfig.v2path + "/advertisement/queryAdvertisementTemplate?ownerName=" + FrameInfo.g_user.attributes.name+ "&templateId=" + templateId,
            dataType: "json",
            contentType: "application/json",
            onSuccess:onSuccess,
            onFailed:onFailed
        }
        Utils.Request.sendRequest(ajax);
    }
    
    function initData(type,attrHref) {
        hPending = Frame.Msg.pending(getRcText("INIIADVER") + '');
        getShopNameID(function (data, textStatus, jqXHR) {//获取场所名            
                if (!('dev_list' in data && data.dev_list.length != 0)) {
                    hPending&&hPending.close();
                    return;
                }
                shopName = data.dev_list[0].shop_name;//场所名和id
                shopID = data.dev_list[0].nas_id;
                initserver(function (data, textStatus, jqXHR) {//初始化接口
                     
                    if (("errorcode" in data) && (data.errorcode != 0)) {
                        hPending&&hPending.close();
                        Frame.Msg.info(getRcText("SRRORADVER"), 'error');
                        return;
                    }
                    templateId = data.data.template.id;//查询到id和url
                    templatePath = data.data.template.domain;
                    getPic(
                        function (dat, textStatus, jqXHR) { 
                            if(dat.data&&(dat.errorcode==0)&&(dat.errormsg=="")){
                              var instance  = dat.data;
                            getTracker(
                                function (data, textStatus, jqXHR){
                                    if(data.data&&(data.errorcode==0)&&(data.errormsg=="")){
                                        hPending&&hPending.close();
                                        var pageType = instance.pageType;
                                        var subId = instance.id;
                                        var cfg = instance.pageCfg;
                                        var html = instance.pageHtml;

                                        // var pageShow =instance.pageShow;
                                        // pageShow = JSON.parse(pageShow); 
                                        // var Introduction_v = pageShow.push;
                                        // var time_v = pageShow.time;          
                                        //
                                        pathName = 'themepage/' + instance.pathName;
                                        
                                        var indexObj = $(attrHref+'>div>div');
                                        
                                        if(type == instance.pageType){
                                            indexObj.html(html);

                                            // indexCtrl = indexObj.phoneControl({
                                            //     // 定制记录时间戳路径
                                            //     imageUploadPath : "images/",
                                            //     jsonCfg : instance.pageCfg
                                            // });
                                        }
                                        indexObj.find("#weixinDiv").css("display","inline-block");
                                        indexObj.find("#wxwifiDiv").css("display","inline-block");
                                        
                                        cfg = JSON.parse(cfg);
                                        $.each(cfg, function(valueKey, value) {
                                            $.each(value, function(valueIndex, adValue) {
                                                $('#'+valueKey+ ' img').attr("src", data.data+'/'+adValue[0]);
                                            });
                                        });
                                        if(type!="1"){
                                            $(attrHref+'>div>div').addClass('telphone_2_box');
                                            $(attrHref+'>div>div>div').addClass('telphone_2');
                                            $(attrHref+'>div>div>div').css('padding-top','0px');                                   
                                        }else{                                       
                                            $(attrHref+'>div>div').css('padding','66px 0px 10px 20px');
                                            $(attrHref+'>div>div>div').css('width','256px');
                                            $('.adverright').css('display','none');
                                            
                                        }                                        
                                    }                                   
                                },
                                function(){
                                    hPending&&hPending.close();
                                    Frame.Msg.info(getRcText("SRRORADVER"), 'error');
                                }
                            );
                        }
                    }, function () {
                            hPending&&hPending.close();
                        Frame.Msg.info(getRcText("SRRORADVER"), 'error');
                    },type,attrHref);
                }, function () {
                    hPending&&hPending.close();
                    Frame.Msg.info(getRcText("SRRORADVER"), 'error');
                });

        },function () {
            hPending&&hPending.close();
            Frame.Msg.info(getRcText("SRRORADVER"), 'error');
        });

    }
    function initFrom() {
        $(".btn_ok").on("click", function () {
            var self = $(this);
            var adver = self.attr('adver');
            var type = null;
            switch (adver) {
                case 'index': type = 1; break;
                case 'login': type = 2; break;
                case 'loginsuccess': type = 3; break;
                case 'main': type = 4; break;
                default:
                    /*
                     Frame.Util.openpage(
                     {
                     pageURL: "http://lvzhou.h3c.com/o2o/uam/weixinwifi/20160324152018/draw.xhtml?templateId=1009",
                     height: "500px",
                     hotkeys: "no"
                     });
                     */
                    return false;
            }
            console.log(adver);         //oasisrd.h3c.com
            // sUrl           /oasis/stable/web/themepage_o2o/template01/draw.html?templateId=386&type=1
            //$scope.tracker       https://oasisrdauth.h3c.com   

           if($.MyLocale.Lang=="cn"){
               var pageURL = "https://oasisrd.h3c.com/oasis/stable/web/themepage_o2o/template01/draw.html?templateId="+ templateId + '&type='+ type +'&scene='+ "minibei" + "&tracker=https://oasisrdauth.h3c.com";
           }else{
               var pageURL = "https://oasisrd.h3c.com/oasis/stable/web/themepage_o2o/template01/drawEn.html?templateId="+ templateId + '&type='+ type +'&scene='+ "minibei" + "&tracker=https://oasisrdauth.h3c.com";
           }
            Frame.Util.openpage(
                {
                    pageURL: pageURL,
                    height: "500px",
                    hotkeys: "no"
                });
            return false;
        });

        //始终让左边显示右边第一张图
        $('.nav.nav-tabs li a').on('click', function () {
            var selt = $(this);
            var rightadver = selt.attr('href').substr(1);
            var rightimg1 = $('img[adver= "' + rightadver + '"]').attr("src");

            $('div[adver= "' + rightadver + '"] img:first').attr('src', rightimg1);

            $('img[adver= "' + rightadver + '"]').parents("div.advercont").removeClass("adveractive");
            $('img[adver= "' + rightadver + '"]').parents("div.advercont:first-child").addClass("adveractive");
        });

        //改变图片
        $(".advercont-img").live("click", function () {
            var self = $(this).find("img");
            var adver = self.attr('adver');
            var rightImgsrc = self.attr('src');
            $('div[adver= "' + adver + '"] img:first').attr('src', rightImgsrc);

            self.parents("div.advercont").siblings().removeClass("adveractive");
            self.parent().parent().addClass(" adveractive");

        });
    }
    function _init() {
        var adTypeArr = [getRcText("AD_TYPE_ARR")[0],getRcText("AD_TYPE_ARR")[1]];//, "合作方"
        // "本地模板""微信主页"
        $("#ad-type").singleSelect("InitData", adTypeArr);
        $("#ad-type").singleSelect("value", adTypeArr[0]);
        $("#ad-type").change(function () {
            $(".cont").hide();
            if (this.value == adTypeArr[0]) {
                $("#local-model").show();

            }
            else if (this.value == adTypeArr[1]) {
                $("#weChart-homepage").show();
            }
        });

        //$.mCustomScrollbar.defaults.scrollButtons.enable = true; //enable scrolling buttons by default
        //$.mCustomScrollbar.defaults.axis="y"; //enable y axis scrollbars by default


        $(".adverright").mCustomScrollbar({ theme: "3d-dark", axis: "y" });
        //$("#content").mCustomScrollbar({ theme: "3d-dark", axis: "x" });

        initData(1,'#index');
        initFrom();
        initFenJiFenQuan();

        $("#iBack").click(function(){
            Utils.Base.redirect({ np: "x_networkcfg.index"},'X_xNetworkCfg');
        });
        // getPic(
        //     function(data, textStatus, jqXHR){ },
        //     function(){ }
        // );
    }
    function getTracker(onSuccess,onFailed) {//获取
        var ajax = {
            type: "GET",
            url: "/v3/ace/oasis/auth-data/o2oportal/themetemplate/getTracker",
            contentType: "application/json",
            dataType: "json",
            timeout: 150000,
            onSuccess:onSuccess,
            onFailed:onFailed
        }

        Utils.Request.sendRequest(ajax);
    }
    function getPic(onSuccess,onFailed,type){//获取图片
        var ajax = {
            type: "GET",
            url: "/v3/ace/oasis/auth-data/o2oportal/themetemplate/preDraw/"+templateId+"/"+type,
            contentType: "application/json",
            dataType: "json",
            timeout: 150000,
            onSuccess:onSuccess,
            onFailed:onFailed
        }

        Utils.Request.sendRequest(ajax);
    }
    $('#local-model>ul>li').on('click',function(){
       var attrHref=$(this).children().attr('href');
       switch (attrHref) {
                case '#index': type = 1; break;
                case '#login': type = 2; break;
                case '#loginsuccess': type = 3; break;
                case '#main': type = 4; break;
                default:
                    return false;
        }
        getPic(function (dat, textStatus, jqXHR) { 
                        if(dat.data&&(dat.errorcode==0)&&(dat.errormsg=="")){
                              var instance  = dat.data;
                            getTracker(
                                function (data, textStatus, jqXHR){
                                    if(data.data&&(data.errorcode==0)&&(data.errormsg=="")){
                                        hPending&&hPending.close();
                                        var pageType = instance.pageType;
                                        var subId = instance.id;
                                        var cfg = instance.pageCfg;
                                        var html = instance.pageHtml;

                                        // var pageShow =instance.pageShow;
                                        // pageShow = JSON.parse(pageShow); 
                                        // var Introduction_v = pageShow.push;
                                        // var time_v = pageShow.time;          
                                        //
                                        pathName = 'themepage/' + instance.pathName;
                                        
                                        var indexObj = $(attrHref+'>div>div');
                                        
                                        if(type == instance.pageType){
                                            indexObj.html(html);

                                            // indexCtrl = indexObj.phoneControl({
                                            //     // 定制记录时间戳路径
                                            //     imageUploadPath : "images/",
                                            //     jsonCfg : instance.pageCfg
                                            // });
                                        }
                                        indexObj.find("#weixinDiv").css("display","inline-block");
                                        indexObj.find("#wxwifiDiv").css("display","inline-block");
                                        
                                        cfg = JSON.parse(cfg);
                                        $.each(cfg, function(valueKey, value) {
                                            $.each(value, function(valueIndex, adValue) {
                                                $('#'+valueKey+ ' img').attr("src", data.data+'/'+adValue[0]);
                                            });
                                        });
                                        if(type!="1"){
                                            $(attrHref+'>div>div').addClass('telphone_2_box');
                                            $(attrHref+'>div>div>div').addClass('telphone_2');
                                            $(attrHref+'>div>div>div').css('padding-top','0px');                                   
                                        }else{                                       
                                            $(attrHref+'>div>div').css('padding','66px 0px 10px 20px');
                                            $(attrHref+'>div>div>div').css('width','256px');
                                            $('.adverright').css('display','none');
                                            
                                        }
                                        
                                    }                                   
                                },
                                function(){
                                    hPending&&hPending.close();
                                    Frame.Msg.info(getRcText("SRRORADVER"), 'error');
                                }
                            );

                        }
                        

                    }, function () {
                       hPending&&hPending.close();
                        Frame.Msg.info(getRcText("SRRORADVER"), 'error');
                    },type,attrHref);
        
    })
    function tabToggle(){
        var $presentation=$('#local-model>ul>li');
        for (var i = $presentation.length - 1; i >= 0; i--) {
            if($presentation[i].className){ }
        }
    }
    function initFenJiFenQuan()
    {
        //1 获取到数组
        var arrayShuZu= Frame.Permission.getCurPermission();
        //2 将数组作简洁处理
        var arrayShuZuNew=[];
        $.each(arrayShuZu,function(i,item){
            var itemNew=item.split('_')[1];
            arrayShuZuNew.push(itemNew);
        });
        //3 作具体的“显示、隐藏”处理
        if($.inArray("WRITE",arrayShuZuNew) ==-1){
            //隐藏“写”的功能
            //写
            $(".hidemodify").css('display','none');
            $(".forbid").attr('disabled','true');
            $(".tab-pane").addClass("upwards");
           // $(".singleSelect").attr('disabled','true');
        }
    }
    function _destroy() {
        hPending&&hPending.close();
        Utils.Request.clearMoudleAjax(MODULE_NAME);
    }


    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["SingleSelect"],
        "utils": ["Base","Request"],
        "libs": [
            //"jqueryscroll.jquery_mcustomscrollbar_concat_min"
        ]
    });
})(jQuery);

