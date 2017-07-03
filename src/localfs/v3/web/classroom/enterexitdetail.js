(function($){
    var MODULE_NAME = "classroom.enterexitdetail";
    
    function getRcText(sRcName)
    {
        return Utils.Base.getRcString("html_rc", sRcName).split(',');
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
        
        var isWork = false;
        if ((hours > 8) && (hours < 17)){
            isWork = true;
        }
        return {time:hours+':'+minutes+':'+seconds, work:isWork};
    }
    
    function http_getStuList(method, cBack){
        var demoList = [{studentName:'刘易斯', sex:'男', inSchoolTimeStamp: '7:30'},
                        {studentName:'李彩', sex:'女', inSchoolTimeStamp: '7:56'},
                        {studentName:'赵日天', sex:'男', inSchoolTimeStamp: '9:15'}]
        function onSuccess(data){
            if (data.retCode == 0){ //0 代表成功
                var res = data.result;
                if(res.retCode == 0){ //0 代表成功
                    cBack(res.data);
                }else{
                    cBack(demoList);
                }
            }else{
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
            data: JSON.stringify({
                devSN: FrameInfo.ACSN,
                Method: method,//"getStudentInSchoolSta",
                Param:{
                    devSn:FrameInfo.ACSN
                }
            }),
           onSuccess:onSuccess,
           onFailed:onFailed
        }

        Utils.Request.sendRequest(ajax);
    }
    
    function getDetailList(type) {
        var method = 'getStudentInSchoolSta';
        var action = "进校";
        if(type == 1){
            method = 'getStudentOutSchoolSta';
            action = '离校';
        }
        
        http_getStuList(method, function(res) {
            var enterEvetList = [];
            var tempValue = null;
            
            for(var i=0; i<res.length; i++){
                tempValue = GetLoginTime(res[i].inOutSchoolTimesStamp);
                enterEvetList.push({time:tempValue.time, 
                                    stu_name:res[i].studentName, 
                                    action:action, 
                                    acType:tempValue.work?type ?'早退':'迟到':'正常'});
            }
            $("#actionList").SList ("refresh", enterEvetList);
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
                        {text:'校园安全',href:'#C_Safe'},
                        {text:'进出校详情',href:''}]);
                        
        var para = Utils.Base.parseUrlPara();
        
        $("#title_id").text(getRcText('TITLE')[para.showtype]);
        
        var optvisitor={
            colNames: getRcText('LIST_TITLE'),
            showHeader: true,
            showOperation:false,
            multiSelect: false,
            pageSize:10,
            colModel: [
                {name:"time", datatype:"String"},
                {name:"stu_name", datatype:"String"},
                {name:"action", datatype:"String"},
                {name:"acType", datatype:"String"},
                // {name:"authAccount", datatype:"String"},
            ],
        };
        $("#actionList").SList ("head", optvisitor);
    }
    
    function initUserData()
    {
        var para = Utils.Base.parseUrlPara();
        // var enterEvetList = [{time:'7:15', stu_name:'张三', action:'进校', acType:'正常'},
        //                      {time:'8:15', stu_name:'张三1', action:'进校', acType:'正常'},
        //                      {time:'11:15', stu_name:'张三2', action:'进校', acType:'迟到'},
        //                      {time:'12:15', stu_name:'张三3', action:'进校', acType:'迟到'},
        //                      {time:'15:15', stu_name:'张三4', action:'进校', acType:'迟到'}];
                             
        // if (para.showtype == 1){
        //     enterEvetList = [{time:'17:15', stu_name:'张三', action:'进校', acType:'早退'},
        //                      {time:'17:55', stu_name:'张三1', action:'进校', acType:'早退'},
        //                      {time:'18:15', stu_name:'张三2', action:'进校', acType:'正常'},
        //                      {time:'18:35', stu_name:'张三3', action:'进校', acType:'正常'},
        //                      {time:'20:35', stu_name:'张三4', action:'进校', acType:'正常'}];
        // }
        
        // $("#actionList").SList ("refresh", enterEvetList);
        getDetailList( parseInt(para.showtype));
        
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
