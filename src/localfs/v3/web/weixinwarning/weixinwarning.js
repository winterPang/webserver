/* Created by WeiXin（kf6675）on 2016/5/3*/
(function ($)
{
    var MODULE_NAME = "weixinwarning.weixinwarning";
    var rc_info = "weixinWarning_rc";
    var g_oTableData = {};
    var g_jForm,g_oPara;

    function getRcText(sRcName)
    {
        return Utils.Base.getRcString(rc_info, sRcName);
    }

    function editTest(){
        
    }

    function redirectStroe(){
       
    }

    function setNoDisturb (data) {

        function setNoDisturbSuc(){
            Frame.Msg.info("设置成功");
        }

        function setNoDisturbFail(){
            console.log("err");
        }

        var setNoDisturb= {
            type: "POST",
            url: MyConfig.path+"/subscribemgr/setNoDisturb",
            dataType: "json",
            contentType: "application/json",
            data:JSON.stringify({
                    devSN:FrameInfo.ACSN,
                    nasID:FrameInfo.Nasid,
                    config:
                    [
                        {
                            type:"wechat",
                            enable:$("#weixinSwitch>div").hasClass("switch-on"),
                            allowedTime:[{start:$("#startTime1").datetime("getTime"),end:$("#endTime1").datetime("getTime")}],
                            times:$("#max").val()
                        },
                        {
                            type:"sms",
                            enable:$("#mesSwitch>div").hasClass("switch-on"),
                            allowedTime:[{start:$("#startTime2").datetime("getTime"),end:$("#endTime2").datetime("getTime")}],
                            times:$("#maxTwo").val()
                        }, 
                        {
                            type:"lvzhouchat",
                            enable:$("#lvzhouSwitch>div").hasClass("switch-on"),
                            allowedTime:[{start:$("#startTime3").datetime("getTime"),end:$("#endTime3").datetime("getTime")}],
                        }
                    ]
                }),
            onSuccess: setNoDisturbSuc,
            onFailed: setNoDisturbFail
        } 
        Utils.Request.sendRequest(setNoDisturb);
    }

    function setNoticeOption (data) {
        
        function setNoticeOptionSuc(){
            Frame.Msg.info("设置成功");
        }

        function setNoticeOptionFail(){
            console.log("err");
        }

        var setNoticeOption= {
            type: "POST",
            url: MyConfig.path+"/subscribemgr/setNoticeOption",
            dataType: "json",
            contentType: "application/json",
            data:JSON.stringify({
                    devSN:FrameInfo.ACSN,
                    nasID:FrameInfo.Nasid,
                    config:
                    [
                        {
                            type:"W0010001",
                            enable:$("#APOn>div").hasClass("switch-on"),
                            noticeType:{
                                wechat:$("#equipmentOnLvzhou").hasClass("checked"),
                                sms:$("#equipmentOnWei").hasClass("checked"),
                                lvzhouchat:$("#equipmentOnSms").hasClass("checked")
                            }
                        },
                        {
                            type:"W0010002",
                            enable:$("#APOff>div").hasClass("switch-on"),
                            noticeType:{
                                wechat:$("#equipmentOffLvzhou").hasClass("checked"),
                                sms:$("#equipmentOffWei").hasClass("checked"),
                                lvzhouchat:$("#equipmentOffSms").hasClass("checked")
                            }
                        }, 
                       {
                            type:"W0010003",
                            enable:$("#equipmentOn>div").hasClass("switch-on"),
                            noticeType:{
                                wechat:$("#APOnLvzhou").hasClass("checked"),
                                sms:$("#APOnWei").hasClass("checked"),
                                lvzhouchat:$("#APOnSms").hasClass("checked")
                            }
                        },
                        {
                            type:"W0010004",
                            enable:$("#equipmentOff>div").hasClass("switch-on"),
                            noticeType:{
                                wechat:$("#APOffLvzhou").hasClass("checked"),
                                sms:$("#APOffWei").hasClass("checked"),
                                lvzhouchat:$("#APOffSms").hasClass("checked")
                            }
                        },
                        {
                            type:"W0010005",
                            enable:$("#equipmentReload>div").hasClass("switch-on"),
                            noticeType:{
                                wechat:$("#equipmentReloadLvzhou").hasClass("checked"),
                                sms:$("#equipmentReloadWei").hasClass("checked"),
                                lvzhouchat:$("#equipmentReloadSms").hasClass("checked")
                            }
                        },
                        {
                            type:"W0010006",
                            enable:$("#memoryAlarm>div").hasClass("switch-on"),
                            noticeType:{
                                wechat:$("#memoryAlarmLvzhou").hasClass("checked"),
                                sms:$("#memoryAlarmWei").hasClass("checked"),
                                lvzhouchat:$("#memoryAlarmSms").hasClass("checked")
                            }
                        },
                        {
                            type:"W0010007",
                            enable:$("#CPUAlarm>div").hasClass("switch-on"),
                            noticeType:{
                                wechat:$("#CPUAlarmLvzhou").hasClass("checked"),
                                sms:$("#CPUAlarmWei").hasClass("checked"),
                                lvzhouchat:$("#CPUAlarmSms").hasClass("checked")
                            }
                        },
                        {
                            type:"W0010008",
                            enable:$("#updateSuc>div").hasClass("switch-on"),
                            noticeType:{
                                wechat:$("#updateSucLvzhou").hasClass("checked"),
                                sms:$("#updateSucWei").hasClass("checked"),
                                lvzhouchat:$("#updateSucSms").hasClass("checked")
                            }
                        },
                        {
                            type:"W0010009",
                            enable:$("#updateFal>div").hasClass("switch-on"),
                            noticeType:{
                                wechat:$("#updateFalLvzhou").hasClass("checked"),
                                sms:$("#updateFalWei").hasClass("checked"),
                                lvzhouchat:$("#updateFalSms").hasClass("checked")
                            }
                        },
                    ]
                }),
            onSuccess: setNoticeOptionSuc,
            onFailed: setNoticeOptionFail
        } 
        Utils.Request.sendRequest(setNoticeOption);
    }
  
    function initGrid()
    {   
        //获取勿扰设置   
        function getNoDisturbSuc(msg){         

           
            function getEnable(type){                
                var enable = null;
                $.each(msg,function(i,n){
                    if(n.type == type){
                        enable = n.enable;                    
                }})
                return  enable;
            }

            function getTimes(type){                
                var times = null;
                $.each(msg,function(i,n){
                    if(n.type == type){
                        times = n.times;                    
                }})
                return  times;
            }

            function getStart(type){                
                var start = null;
                $.each(msg,function(i,n){
                    if(n.type == type){
                        start = n.allowedTime[0].start;                    
                }})
                return  start;
            }

            function getEnd(type){                
                var end = null;
                $.each(msg,function(i,n){
                    if(n.type == type){
                        end = n.allowedTime[0].end;                    
                }})
                return  end;
            }

            $("#weixinSwitch").Switch("setState",getEnable("wechat"));
            $("#timer").toggleClass("hide",!getEnable("wechat"));
            $("#startTime1").datetime("setTime",getStart("wechat"));
            $("#endTime1").datetime("setTime",getEnd("wechat"));
            $("#max").attr("value",getTimes("wechat"));
            
            $("#mesSwitch").Switch("setState",getEnable("sms"));
            $("#timerTwo").toggleClass("hide",!getEnable("sms"));
            $("#startTime2").datetime("setTime",getStart("sms"));
            $("#endTime2").datetime("setTime",getEnd("sms"));
            $("#maxTwo").attr("value",getTimes("sms"));

            $("#lvzhouSwitch").Switch("setState",getEnable("lvzhouchat")); 
            $("#timerThree").toggleClass("hide",!getEnable("lvzhouchat"));  
            $("#startTime3").datetime("setTime",getStart("lvzhouchat"));
            $("#endTime3").datetime("setTime",getEnd("lvzhouchat"));
            $("#maxThree").attr("value",getTimes("lvzhouchat"));
        }

        function getNoDisturbFail(){
            console.log("err");
        }

        var getNoDisturb= {
            type: "POST",
            url: MyConfig.path+"/subscribemgr/getNoDisturb",
            dataType: "json",
            contentType: "application/json",
            data:JSON.stringify({
                    devSN:FrameInfo.ACSN,
                    nasID:FrameInfo.Nasid,                  
                }),
            onSuccess: getNoDisturbSuc,
            onFailed: getNoDisturbFail
        } 
        Utils.Request.sendRequest(getNoDisturb);

        //获取通知设置
        function getNoticeOptionSuc(data){

            function getEnable(type){                
                var enable = null;
                $.each(data,function(i,n){
                    if(n.type == type){
                        enable = n.enable;                    }
                })
                return  enable;
            }

            function getNoticeEnable(type,notice){                
                var enable = null;
                $.each(data,function(i,n){
                    if(n.type == type){
                        enable = n.noticeType[notice];                    }
                })
                return  enable;
            }

            $("#equipmentOn").Switch("setState",getEnable("W0010003"));
            $("#equipmentOnLvzhou").toggleClass("checked",getNoticeEnable("W0010003","lvzhouchat"));
            $("#equipmentOnWei").toggleClass("checked",getNoticeEnable("W0010003","wechat"));
            $("#equipmentOnSms").toggleClass("checked",getNoticeEnable("W0010003","sms"));
            if(getEnable("W0010003")==true){
                    $("#noticeThree").css('display','block');
            }else{
                    $("#noticeThree").css('display','none');
            }

            $("#equipmentOff").Switch("setState",getEnable("W0010004"));
            $("#equipmentOffLvzhou").toggleClass("checked",getNoticeEnable("W0010004","lvzhouchat"));
            $("#equipmentOffWei").toggleClass("checked",getNoticeEnable("W0010004","wechat"));
            $("#equipmentOffSms").toggleClass("checked",getNoticeEnable("W0010004","sms"));
            if(getEnable("W0010004")==true){
                    $("#noticeFour").css('display','block');
            }else{
                    $("#noticeFour").css('display','none');
            }

            $("#APOn").Switch("setState",getEnable("W0010001"));
            $("#APOnLvzhou").toggleClass("checked",getNoticeEnable("W0010001","lvzhouchat"));
            $("#APOnWei").toggleClass("checked",getNoticeEnable("W0010001","wechat"));
            $("#APOnSms").toggleClass("checked",getNoticeEnable("W0010001","sms"));
            if(getEnable("W0010001")==true){
                    $("#noticeFive").css('display','block');
            }else{
                    $("#noticeFive").css('display','none');
            }


            $("#APOff").Switch("setState",getEnable("W0010002"));
            $("#APOffLvzhou").toggleClass("checked",getNoticeEnable("W0010002","lvzhouchat"));
            $("#APOffWei").toggleClass("checked",getNoticeEnable("W0010002","wechat"));
            $("#APOffSms").toggleClass("checked",getNoticeEnable("W0010002","sms"));
            if(getEnable("W0010002")==true){
                    $("#noticeSix").css('display','block');
            }else{
                    $("#noticeSix").css('display','none');
            }

            $("#equipmentReload").Switch("setState",getEnable("W0010005"));           
            $("#equipmentReloadLvzhou").toggleClass("checked",getNoticeEnable("W0010005","lvzhouchat"));
            $("#equipmentReloadWei").toggleClass("checked",getNoticeEnable("W0010005","wechat"));
            $("#equipmentReloadSms").toggleClass("checked",getNoticeEnable("W0010005","sms"));
            if(getEnable("W0010005")==true){
                    $("#noticeSeven").css('display','block');
            }else{
                    $("#noticeSeven").css('display','none');
            }

            $("#memoryAlarm").Switch("setState",getEnable("W0010006"));
            $("#memoryAlarmLvzhou").toggleClass("checked",getNoticeEnable("W0010006","lvzhouchat"));
            $("#memoryAlarmWei").toggleClass("checked",getNoticeEnable("W0010006","wechat"));
            $("#memoryAlarmSms").toggleClass("checked",getNoticeEnable("W0010006","sms"));
            if(getEnable("W0010006")==true){
                    $("#noticeEight").css('display','block');
            }else{
                    $("#noticeEight").css('display','none');
            }

            $("#CPUAlarm").Switch("setState",getEnable("W0010007"));
            $("#CPUAlarmLvzhou").toggleClass("checked",getNoticeEnable("W0010007","lvzhouchat"));
            $("#CPUAlarmWei").toggleClass("checked",getNoticeEnable("W0010007","wechat"));
            $("#CPUAlarmSms").toggleClass("checked",getNoticeEnable("W0010007","sms"));
            if(getEnable("W0010007")==true){
                    $("#noticeNine").css('display','block');
            }else{
                    $("#noticeNine").css('display','none');
            }

            $("#updateSuc").Switch("setState",getEnable("W0010008"));
            $("#updateSucLvzhou").toggleClass("checked",getNoticeEnable("W0010008","lvzhouchat"));
            $("#updateSucWei").toggleClass("checked",getNoticeEnable("W0010008","wechat"));
            $("#updateSucSms").toggleClass("checked",getNoticeEnable("W0010008","sms"));
            if(getEnable("W0010008")==true){
                    $("#noticeTen").css('display','block');
            }else{
                    $("#noticeTen").css('display','none');
            }

            $("#updateFal").Switch("setState",getEnable("W0010009"));
            $("#updateFalLvzhou").toggleClass("checked",getNoticeEnable("W0010009","lvzhouchat"));
            $("#updateFalWei").toggleClass("checked",getNoticeEnable("W0010009","wechat"));
            $("#updateFalSms").toggleClass("checked",getNoticeEnable("W0010009","sms"));
            if(getEnable("W0010009")==true){
                    $("#noticeEleven").css('display','block');
            }else{
                    $("#noticeEleven").css('display','none');
            }

        }

        function getNoticeOptionFail(){
            console.log("err");
        }

        var getNoticeOption= {
            type: "POST",
            url: MyConfig.path+"/subscribemgr/getNoticeOption",
            dataType: "json",
            contentType: "application/json",
            data:JSON.stringify({
                    devSN:FrameInfo.ACSN,
                    nasID:FrameInfo.Nasid,                  
                }),
            onSuccess: getNoticeOptionSuc,
            onFailed: getNoticeOptionFail
        } 
        Utils.Request.sendRequest(getNoticeOption);
        
    }


    function initData()
    {   
    
    }

    function initForm()
    {  
        $("#filter_weixinWarning").click(function () {
            $("#weixinWarning_block").toggle();
        });

        $("#numberSwitch").bind("switch-change",function(){
            $("#max").toggle();
        })

        
        $("#weixinSwitch").bind("switch-change",function(){
            $("#timer").toggle();
        })

         $("#mesSwitch").bind("switch-change",function(){
            $("#timerTwo").toggle();
        })
        
        
        $("#lvzhouSwitch").bind("switch-change",function(){
            $("#timerThree").toggle();
        })

        $("#equipmentOn").bind("switch-change",function(){
            $("#noticeThree").toggle();
        })

        $("#equipmentOff").bind("switch-change",function(){
            $("#noticeFour").toggle();
        })

        $("#APOn").bind("switch-change",function(){
            $("#noticeFive").toggle();
        })

        $("#APOff").bind("switch-change",function(){
            $("#noticeSix").toggle();
        })

        $("#equipmentReload").bind("switch-change",function(){
            $("#noticeSeven").toggle();
        })

        $("#memoryAlarm").bind("switch-change",function(){
            $("#noticeEight").toggle();
        })

        $("#CPUAlarm").bind("switch-change",function(){
            $("#noticeNine").toggle();
        })

        $("#updateSuc").bind("switch-change",function(){
            $("#noticeTen").toggle();
        })

        $("#updateFal").bind("switch-change",function(){
            $("#noticeEleven").toggle();
        })

        $("#btn-apply").click(function(){
            setNoDisturb();
        })

        $("#btn-applyTwo").click(function(){
            setNoticeOption();
        })

        $("span.checkbox-icon").click(function(){
            if($(this).hasClass("checked")){
                $(this).removeClass("checked");
            }else{
                $(this).addClass("checked");              
            }
        })
        $("#noDistrub label[for*=switch]").click(function() {
            $("#resure_one").show();
        });

        $("#noDistrub input").bind('input propertychange',function() {
            $("#resure_one").show();
        });

        $("#notice label[for*=switch]").click(function() {
            $("#resure_two").show();
        });

        $("#notice span[class*=checkbox-icon]").click(function() {
            $("#resure_two").show();
        });
    }

    function _init(oPara)
    {
        initGrid();
        initData();
        initForm();
    };

    function _destroy()
    {
        MODULE_NAME = null;
    }

    function _resize()
    {

    }
    Utils.Pages.regModule (MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "resize": _resize,
        "widgets": ["SList","DateTime","Switch"],
        "utils": ["Base","Request"]
    });
}) (jQuery);
