(function($){
    var MODULE_NAME = "classroom.safenotice_campus";
    var g_para = {devSn:FrameInfo.ACSN, nStartTime:0, nEndTime:0, alarmlevel:"normal"};
    
    var g_param=[];
    var g_alarmlevel=null;
    var g_startTime=0;
    var g_endTime=0; 
    
    function getRcText(sRcName)
    {
        return Utils.Base.getRcString("noticelist_rc", sRcName);
    }
    
    function GetLoginTime(logintime)
    {
        function doublenum(num)
        {
            if(num < 10)
            {
                return '0'+num;
            }
            return num;
        }
        var myDate = new Date(logintime);
        var year = myDate.getFullYear();
        var month = doublenum(myDate.getMonth() + 1);
        var day = doublenum(myDate.getDate());
        var hours = doublenum(myDate.getHours());
        var minutes = doublenum(myDate.getMinutes());
        var seconds = doublenum(myDate.getSeconds());
        return year+'-'+month+'-'+day+' '+hours+':'+minutes+':'+seconds;
    }
    
    function http_getDetailList(cBack) {
        var demoList = [{crowdAreaName:'会议正大门', crowdAreaMac:['11-22-33-44-55-66'], time:1476950138765, url:'', alarmlevel:"normal",alarmDescribe:"拥挤程度一般",crowdAreaPeopleNum:10},
                        {crowdAreaName:'教学楼一号厅', crowdAreaMac:['11-22-33-44-55-66'], time:1476950238765, url:'', alarmlevel:"normal",alarmDescribe:"拥挤程度一般",crowdAreaPeopleNum:23}]
        function onSuccess(data){
            if (data.retCode == 0){ //0 代表成功
                
                cBack(data.result);
                g_param=data.result;
                //g_param = demoList;
                //cBack(demoList);
            }else{
                g_param=demoList;
                cBack(demoList);
            }
        }
        
        function onFailed(){
            cBack(demoList);
        }
        
        var ajax = {
            type: 'POST',
            url: MyConfig.path + "/smartcampusread",
            contentType: "application/json",
            dataType: "json",
            timeout:20000,
            data: JSON.stringify({
                devSN: FrameInfo.ACSN,
                Method: "getCrowdDetailsbyLevel",
                Param:g_para
            }),
           onSuccess:onSuccess,
           onFailed:onFailed
        }

        Utils.Request.sendRequest(ajax);
    }

    function openVideo() {
        
        var client = new WebSocket( 'wss://lvzhouv3.h3c.com:25550/' );

        var canvas = document.getElementById('videoCanvas');
        var player = new jsmpeg(client, {canvas:canvas});
    }
    
    function onClickVideo() {
        //var ApNames = $(this).attr("ApName");
        var type = $(".list-link").attr("type");
        if ($(this).attr("type") == "video") {
            
            function cancelFun(){
                Utils.Pages.closeWindow(Utils.Pages.getWindow( $("#Statu_form")));
            }
            
            $("#Statu_form").form ("init", "edit", {"title":getRcText("STATU_NAME"),
                "btn_apply":false, "btn_cancel":cancelFun/*CancelShop*/});
                
            Utils.Base.openDlg(null, {}, {
                scope: $("#live_video"),
                className: "modal-super"
            });
            
            openVideo();
            
            
                
            // Frame.Util.openpage(
            //     {
            //         pageURL: "file:///F:/video_pro/jsmpeg-master/stream-example.html",
            //         height: "500px",
            //         hotkeys: "no"
            // //     });
            //     window.open("stream-example.html");   
        } 

    }
    
    function position_text(row, cell, value, columnDef, dataContext, type)
    {
        if(!value)
        {
            return "";
        }
        
        if("text" == type)
        {
            return value;
        }
        switch(cell)
        {
            case 4:
            {
                var text = "<img class='list-link' type='video'  style='height:15px; width:15px; cursor:pointer' src='../frame/css/image/camera.png'>";
                return text;
            }
            default:
                break;
        }
        return false;
    }
    
    function getDetailList(){
        http_getDetailList(function(res) {
            
            var alertEvetList = [];
            for(var i=0; i<res.length; i++){
                alertEvetList.push({
                    time:GetLoginTime(res[i].time),
                    position:res[i].crowdAreaName,
                    detail: res[i].alarmDescribe,
                    crowdAreaPeopleNum:res[i].crowdAreaPeopleNum,
                    picture: 'N/A'});
            }
            
            $("#alertList").SList ("refresh", alertEvetList);
        });
    }
    
    function initUserGrid(){
        
        function setBreadContent(paraArr){
            
            if(paraArr[0].text != ""){
                $("#bread_1").css("display",'inline');
                $("#bread_1 a").attr("href",paraArr[0].href);
                $("#bread_1 a").text(paraArr[0].text);
            }else{
                $("#bread_1").css("display",'none');
            }
            
            if(paraArr[1].text != ""){
                $("#bread_2").css("display",'inline');
                $("#bread_2 a").attr("href",paraArr[1].href);
                $("#bread_2 a").text(paraArr[1].text);
            }else{
                $("#bread_2").css("display",'none');
            }
            
            if(paraArr[2].text != ""){
                $("#bread_active").css("display",'inline');
                $("#bread_active").text(paraArr[2].text);
            }else{
                $("#bread_active").css("display",'none');
            }
        }
        setBreadContent([{text:'',href:''},
                        {text:'校园概览',href:'#C_CDashboard'},
                        {text:'告警详情',href:''}]);
                        
        var para = Utils.Base.parseUrlPara();
        g_startTime=parseInt(para.nStartTime) || g_startTime;
        g_endTime=parseInt(para.nEndTime) || g_endTime;
        g_alarmlevel=para.alarmlevel || g_alarmlevel;
        $.extend(g_para, {nStartTime:g_startTime , nEndTime: g_endTime, alarmlevel:g_alarmlevel});
        
        if (g_para.alarmlevel == "serious"){
            $("#title_id").text('紧急告警详情');
        }else if(g_para.alarmlevel == "general"){
            $("#title_id").text('重要告警详情');
        }else{
            $("#title_id").text('安全提示详情');
        }
        
        // $("#iBack").click(function(){
        //     Utils.Base.redirect({ np: "classroom.campusdashboard"});
        // });
        
        var optvisitor={
            colNames: getRcText("NOTICE"),
            showHeader: true,
            showOperation:true,
            multiSelect: false,
            pageSize:10,
            colModel: [
                {name:"time", datatype:"String"},
                {name:"position", datatype:"String"},
                {name:"detail", datatype:"String"},
                {name:"crowdAreaPeopleNum",datatype:"Number"},
                {name:"picture", datatype:"String",formatter:position_text}
            ],
            buttons: [
                {name: "detail", enable: true, value: "详情", action: enterDetail}
            ]
        };
        $("#alertList").SList ("head", optvisitor);
        $("#alertList").on('click', 'img.list-link', onClickVideo);
    }
    
    function enterDetail(param){
        var aCrowdAreaMac=[];
        for(var i=0;i<g_param.length;i++){
            if(g_param[i].crowdAreaName == param[0].position){
                aCrowdAreaMac=g_param[i].crowdAreaMac
            }
        }
        var str=aCrowdAreaMac.join("*");
        Utils.Base.redirect({np: 'classroom.crowddetail_campus',position:param[0].position,time:param[0].time,detail:param[0].detail,crowdAreaMac:str});
    }
    function initUserData()
    {
        // var alertEvetList = [{time:'2016/10/14 9:15', position:'东门出口', detail:'车辆行人拥堵', picture: 'N/A'},
        //                      {time:'2016/10/13 17:35', position:'A楼主电梯口', detail:'围观群众', picture: 'N/A'}];
        // $("#alertList").SList ("refresh", alertEvetList);
        getDetailList();
        
    }
    
    function _init ()
    {
        //g_sShopName = Utils.Device.deviceInfo.shop_name;
        initUserGrid();
        initUserData();
        
    }
    
    function _destroy()
    {

    }

    Utils.Pages.regModule (MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["SList","Echart","SingleSelect","Minput","Form"],
        "utils": ["Base","Request", 'Device']
    });
})(jQuery);
