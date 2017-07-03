;(function($){
    var MODULE_BASE = "classroom";
    var MODULE_NAME = MODULE_BASE + ".schoolsafe";

    var g_normal = {devSn:FrameInfo.ACSN, nStartTime:0, nEndTime:0, alarmlevel:"normal"};
    var g_general = {devSn:FrameInfo.ACSN, nStartTime:0, nEndTime:0, alarmlevel:"general"};
    var g_serious = {devSn:FrameInfo.ACSN, nStartTime:0, nEndTime:0, alarmlevel:"serious"};
    
    function getRcText(sRcName) {
        return Utils.Base.getRcString("c_campus_rc", sRcName).split(',');
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
        return hours+':'+minutes+':'+seconds;
    }
    
    function insertGlobalData(res){
        $.extend(g_normal,res.normal);
        $.extend(g_general,res.general);
        $.extend(g_serious,res.serious);
    }
    
    function http_getEnterList(cBack){
        var demoList = [{studentName:'刘易斯', sex:'男', inOutSchoolTimesStamp:1477273902181},
                        {studentName:'李彩', sex:'女', inOutSchoolTimesStamp:1477273914653},
                        {studentName:'赵日天', sex:'男', inOutSchoolTimesStamp:1477273792597}]
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
            timeout:20000,
            data: JSON.stringify({
                devSN: FrameInfo.ACSN,
                Method: "getStudentInSchoolSta",
                Param:{
                    devSn:FrameInfo.ACSN
                }
            }),
           onSuccess:onSuccess,
           onFailed:onFailed
        }

        Utils.Request.sendRequest(ajax);
    }
    
    function http_getExitList(cBack){
        var demoList = [{studentName:'刘采妮', sex:'女', inOutSchoolTimesStamp:1477390902181},
                        {studentName:'叶良辰', sex:'男', inOutSchoolTimesStamp:1477390914653},
                        {studentName:'赵日天', sex:'男', inOutSchoolTimesStamp:1477390792597}]
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
            timeout:20000,
            data: JSON.stringify({
                devSN: FrameInfo.ACSN,
                Method: "getStudentOutSchoolSta",
                Param:{
                    devSn:FrameInfo.ACSN
                }
            }),
           onSuccess:onSuccess,
           onFailed:onFailed
        }

        Utils.Request.sendRequest(ajax);
    }
    
    function http_getAlertCount(cBack){
        
        var demoList = {normal: {nCount: 8, nStartTime: "", nEndTime: ""},
                        general: {nCount: 2, nStartTime: "", nEndTime: ""},
                        serious: {nCount: 10, nStartTime: "", nEndTime: ""},}
        function onSuccess(data){
            if (data.retCode == 0){ //0 代表成功
                
                cBack(data.result);
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
            timeout:20000,
            data: JSON.stringify({
                devSN: FrameInfo.ACSN,
                Method: "getCrowdAlarmlNum",
                Param:{
                    devSn:FrameInfo.ACSN
                }
            }),
           onSuccess:onSuccess,
           onFailed:onFailed
        }

        Utils.Request.sendRequest(ajax);
    }
    
    function drawScollList(stuList, ele_id, action){
                    
        document.getElementById(ele_id).innerHTML = "";
        
        var ele_ul = document.createElement('ul');
        var ele_li = null;
        var ele_div = null;
        
        for(var i=0; i<stuList.length; i++){
            ele_li = document.createElement('li');
            ele_div_pre = document.createElement('div');
            ele_div_pre.setAttribute('class','col-xs-12');
            
            ele_div = document.createElement('div');
            ele_div.setAttribute('class','col-xs-offset-2 col-xs-2');
            ele_div.innerHTML = GetLoginTime(stuList[i].inOutSchoolTimesStamp);// + stuList[i].studentName + stuList[i].sex + action;
            ele_div_pre.appendChild(ele_div);
            
            ele_div = document.createElement('div');
            ele_div.setAttribute('class','col-xs-offset-2 col-xs-2');
            ele_div.innerHTML = stuList[i].studentName;// + stuList[i].sex + action;
            ele_div_pre.appendChild(ele_div);
            
            ele_div = document.createElement('div');
            ele_div.setAttribute('class','col-xs-offset-2 col-xs-2');
            ele_div.innerHTML = action;
            ele_div_pre.appendChild(ele_div);
            
            ele_li.appendChild(ele_div_pre);
            ele_ul.appendChild(ele_li);
        }
        document.getElementById(ele_id).appendChild(ele_ul);
        
        $("#"+ele_id).textSlider({line:1,speed:100,timer:3000});
    }
    
    function getEnterStuInfo(){
        http_getEnterList(function(res){
            drawScollList(res, "scrollDiv1", "进校");
        });
    }
    
    
    function getExitStuInfo(){
        http_getExitList(function(res){
            drawScollList(res, "scrollDiv2", "离校");
        });
    }
    
    function getAlertCount(){
        http_getAlertCount(function(res){
            insertGlobalData(res); 
            document.getElementById("emergency_text_1").innerText = res.serious.nCount;
            document.getElementById("importance_text_1").innerText = res.general.nCount;
            document.getElementById("tishi_text_1").innerText = res.normal.nCount;
        });
    }
    
    
    function initData() {
        getAlertCount();
        getEnterStuInfo();
        getExitStuInfo();
        
    }

    function initGrid() {
        
        $("#emegency_id_1").click(function(){
            if(g_serious.nEndTime != 0){
                Utils.Base.redirect({ np: "classroom.safenotice", nStartTime:g_serious.nStartTime, nEndTime:g_serious.nEndTime, alarmlevel:g_serious.alarmlevel});
            }
        });
        
        $("#importance_id_1").click(function(){
            if(g_general.nEndTime != 0){
                Utils.Base.redirect({ np: "classroom.safenotice", nStartTime:g_general.nStartTime, nEndTime:g_general.nEndTime, alarmlevel:g_general.alarmlevel});
            }
        });
        
        
        $("#notice_id_1").click(function(){
            if(g_normal.nEndTime != 0){
                Utils.Base.redirect({ np: "classroom.safenotice", nStartTime:g_normal.nStartTime, nEndTime:g_normal.nEndTime, alarmlevel:g_normal.alarmlevel});
            }
        });
        
        $("#enter_chart").click(function(){
            Utils.Base.redirect({ np: "classroom.enterexitdetail", showtype: "0"});
        });
        
        $("#exit_chart").click(function(){
            Utils.Base.redirect({ np: "classroom.enterexitdetail", showtype: "1"});
        });
        
        
        var oSEnterListHead = { 
            height: "70",
            showHeader: true,
            multiSelect: false,
            pageSize: 10,
            colNames: getRcText("ENTER_EXIT_LIST"),
            colModel: [{name: "time",datatype: "String",width: 80},
					   {name: "stu_name",datatype: "String",width: 80},
					   {name: "actionType",datatype: "String",width: 80}
					   ]
        };
		//$("#enter_list").SList("head", oSEnterListHead);
		$("#exitlist_form").form("init", "edit", {"title":getRcText("ENTER_DLG_TITLE")[1],"btn_apply": false,"btn_cancel":true});
    
    }

    (function($){
        $.fn.FontScroll = function(options){
            var d = {time: 3000,s: 'fontColor',num: 1}
            var o = $.extend(d,options);
            

            this.children('ul').addClass('line');
            var _con = $('.line').eq(0);
            var _conH = _con.height(); //滚动总高度
            var _conChildH = _con.children().eq(0).height();//一次滚动高度
            var _temp = _conChildH;  //临时变量
            var _time = d.time;  //滚动间隔
            var _s = d.s;  //滚动间隔


            _con.clone().insertAfter(_con);//初始化克隆

            //样式控制
            var num = d.num;
            var _p = this.find('li');
            var allNum = _p.length;

            _p.eq(num).addClass(_s);


            var timeID = setInterval(Up,_time);
            this.hover(function(){clearInterval(timeID)},function(){timeID = setInterval(Up,_time);});

            function Up(){
                _con.animate({marginTop: '-'+_conChildH});
                //样式控制
                _p.removeClass(_s);
                num += 1;
                _p.eq(num).addClass(_s);
                
                if(_conH == _conChildH){
                    _con.animate({marginTop: '-'+_conChildH},"normal",over);
                } else {
                    _conChildH += _temp;
                }
            }
            function over(){
                _con.attr("style",'margin-top:0');
                _conChildH = _temp;
                num = 1;
                _p.removeClass(_s);
                _p.eq(num).addClass(_s);
            }
        };
        
    })(jQuery);
    (function($){
        $.fn.FontScroll_exit = function(options){
            var d = {time: 3000,s: 'fontColor',num: 1}
            var o = $.extend(d,options);
            

            this.children('ul').addClass('line');
            var _con = $('.line').eq(0);
            var _conH = _con.height(); //滚动总高度
            var _conChildH = _con.children().eq(0).height();//一次滚动高度
            var _temp = _conChildH;  //临时变量
            var _time = d.time;  //滚动间隔
            var _s = d.s;  //滚动间隔


            _con.clone().insertAfter(_con);//初始化克隆

            //样式控制
            var num = d.num;
            var _p = this.find('li');
            var allNum = _p.length;

            _p.eq(num).addClass(_s);


            var timeID = setInterval(Up,_time);
            this.hover(function(){clearInterval(timeID)},function(){timeID = setInterval(Up,_time);});

            function Up(){
                _con.animate({marginTop: '-'+_conChildH});
                //样式控制
                _p.removeClass(_s);
                num += 1;
                _p.eq(num).addClass(_s);
                
                if(_conH == _conChildH){
                    _con.animate({marginTop: '-'+_conChildH},"normal",over);
                } else {
                    _conChildH += _temp;
                }
            }
            function over(){
                _con.attr("style",'margin-top:0');
                _conChildH = _temp;
                num = 1;
                _p.removeClass(_s);
                _p.eq(num).addClass(_s);
            }
        }
    })(jQuery);



    function _init() {
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
                        {text:'',href:''},
                        {text:'校园安全',href:''}]);
                        
       initGrid();
       initData();
       
        $("#scrollDiv1").textSlider({line:1,speed:500,timer:1000});
        
        // $("#scrollDiv2").textSlider({line:1,speed:500,timer:1000});
    }

    function _destroy() {
        //clearInterval(g_time);

    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["SList", "Echart", 'SingleSelect', "Form"],
        "utils": ["Request", "Base", 'Device']
    });
})(jQuery);