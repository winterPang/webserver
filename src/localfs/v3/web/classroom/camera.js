;(function ($) {
    var MODULE_NAME = "classroom.camera";
    var dCamera=[];
    var eCamera=[];
    var minFlag=0;
    var maxFlag=0;
    function getRcText (sRcName)
    {
        return Utils.Base.getRcString("c_net_infor_rc",sRcName);
    }

    function setCameraConfig(oParam,onSuc,onFail){
        var oParam1 = {
            devSn:FrameInfo.ACSN
        }
        $.extend(oParam1,oParam);
        var Option = {
            type:"POST",
            url:MyConfig.path+"/smartcampuswrite",
            contentType:"application/json",
            data:JSON.stringify({
                devSN:FrameInfo.ACSN,
                Method:"setCameraConfig",
                Param:oParam1
            }),
            onSuccess:onSuc,
            onFailed:onFail
        }
        Utils.Request.sendRequest(Option);
    }

    function delCameraConfig(oPara,onSuc){
        var oParam = {
            devSn:FrameInfo.ACSN
        }
        $.extend(oParam,oPara);
        var option = {
            type: 'POST',
            url: MyConfig.path + '/smartcampuswrite',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify({
                devSN: FrameInfo.ACSN,
                Method: 'delCameraConfig',
                Param: oParam
            }),
            onSuccess: onSuc,
            onFailed: function (jqXHR,textstatus,error) {
                Frame.Msg.info("删除摄像头信息失败", "error");
            }
        }
        Utils.Request.sendRequest(option);
    }
    //添加摄像头弹出框
    function addCamera(){
        initEvent();
        $("#addCamera_form").form('updateForm', {
            'cameraName':'',
            'ipAddr':'',
            'port':'',
            'userName':'',
            'password':''
        });
        var closeWindow = function () {
            Utils.Pages.closeWindow(Utils.Pages.getWindow($("#addCamera_form")));
        };
        var oTempTable = {
            index: [],
            column: [
                'cameraName',
                'ipAddr',
                'port',
                'userName',
                'password'
            ]
        };
        $("#addCamera_form").form("init", "edit", {
            "title": "新建摄像头",
            "btn_apply": function () {
                var re=/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
                //$("#port").on("focus",function(){
                    var str= $("#ipAddr").val();
                    if(!re.test(str)){
                        $("#IPaddress_error").css({display:"inline-block",height:"22px",width:"135px"});
                        $("#IPaddress_error").html("格式不正确！");
                        this.value=str.replace(re,"");
                    }
                //});
                else{
                var oStData = $("#addCamera_form").form("getTableValue", oTempTable);
                addCameraData(oStData);
                closeWindow();}
            }, "btn_cancel": closeWindow
        });
        $("#cameraName,#ipAddr,#port,#userName,#password").val("");
        $("#camera_error,#IPaddress_error,#portnumber_error,#username_error，#password_error").css({display:"none"});
        $("input[type=text]",$("#addCamera_form")).each(function() {
            Utils.Widget.setError($(this),"");
        });
        $('#cameraName').removeAttr("disabled");
        //$("#classAP").removeAttr("disabled");
        Utils.Base.openDlg(null, {}, { scope: $("#AddCameraDlg"), className: "modal-super" });
    }
    function modifyCameraData(cameraData){

        var oTemp1 = {
            cameraName:cameraData["cameraName"] || "null",
            ipAddr:cameraData["ipAddr"] || "null",
            port:cameraData["port"] || "null",
            userName:cameraData["userName"] || "null",
            password:cameraData["password"] || "null",
        };
        oTemp1.cameraName = dCamera[0].cameraName;
        oTemp1.type = 1;
        setCameraConfig(oTemp1,onSuc,onFail);
        function onSuc(data){
            if(data.retCode!=0){
                Frame.Msg.info("编辑摄像头失败！");
                Utils.Base.refreshCurPage();
                return;
            }
            Frame.Msg.info("编辑摄像头成功！");
            Utils.Base.refreshCurPage();
        }
        function onFail(){
            Frame.Msg.info("编辑摄像头失败！");
        }
    }

    function editCamera(param){
        dCamera=param;
        var closeWindow = function () {
            Utils.Pages.closeWindow(Utils.Pages.getWindow($("#addCamera_form")));
        };
        var oTempTable = {
            index: [],
            column: [
                'cameraName',
                'ipAddr',
                'port',
                'userName',
                'password'
            ]
        };
        $("#addCamera_form").form("init", "edit", {
            "title": "编辑摄像头",
            "btn_apply": function () {
                var re=/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
                //$("#port").on("focus",function(){
                var str= $("#ipAddr").val();
                if(!re.test(str)){
                    $("#IPaddress_error").css({display:"inline-block",height:"22px",width:"135px"});
                    $("#IPaddress_error").html("格式不正确！");
                    this.value=str.replace(re,"");
                }
                else{
                var oStData = $("#addCamera_form").form("getTableValue", oTempTable);
                modifyCameraData(oStData);
                closeWindow();}
            }, "btn_cancel": closeWindow
        });
        if (param.length > 0) {
            $("#addCamera_form").form('updateForm', {
                'cameraName': param[0].cameraName,
                'ipAddr':param[0].ipAddr,
                'port': param[0].port,
                'userName':param[0].userName,
                'password':param[0].password
            });
        } else {
            $("#addCamera_form").form('updateForm', {
                'cameraName': '',
                'ipAddr':'',
                'port': '',
                'userName':'',
                'password':''
            });
        }
        $("input[type=text]",$("#addCamera_form")).each(function() {
            Utils.Widget.setError($(this),"");
        });
        $("#camera_error,#IPaddress_error,#portnumber_error,#username_error，#password_error").css({display:"none"});
        Utils.Base.openDlg(null, {}, { scope: $("#AddCameraDlg"), className: "modal-super" });
        $('#cameraName').attr({ disabled: "disabled" });
    }
    //获取摄像头数据
    function getCameraConfig(pageSize, pageNum, oParam) {
        pageSize = pageSize || 5;
        pageNum = pageNum || 1;
        var oParam1 = {
            devSn:FrameInfo.ACSN,
            startRowIndex:pageSize * (pageNum-1),
            maxItem:pageSize
        }
        $.extend(oParam1,oParam);
        var option = {
            type: 'POST',
            url: MyConfig.path + '/smartcampusread',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify({
                devSN: FrameInfo.ACSN,
                Method: 'getCameraConfig',
                Param: oParam1
            }),
            onSuccess: function (data) {
                var oData=data.result.data || [];
                //eRoom=oData;
                var aCamera=[];
                for(var i=0;i<oData.length;i++){
                    var oTemp1 = {
                        //cameraName:cameraName  /* 摄像头名称 */
                        //ipAddr:ipAddr          /* 摄像头IP地址 */
                        //port:port              /* 摄像头端口号 */
                        //userName:userName      /* 摄像头用户名 */
                        //password:password      /* 摄像头密码 */
                        cameraName:oData[i].cameraName,
                        ipAddr :oData[i].ipAddr!="null"?oData[i].ipAddr:"",
                        port:oData[i].port!="null"?oData[i].port:"",
                        userName:oData[i].userName!="null"?oData[i].userName:"",
                        password:oData[i].password!="null"?oData[i].password:""
                    };
                    aCamera.push(oTemp1);
                }
                $("#cameraList").SList ("refresh", {data: aCamera, total: data.result.rowCount});
            },
            onFailed: function (err) {
                Frame.Msg.info("读取摄像头失败", "error");
            }
        }
        Utils.Request.sendRequest(option);
    }

    function addCameraData(cameraData){
        var oTemp1 = {
            cameraName:cameraData["cameraName"] || "null",
            ipAddr:cameraData["ipAddr"] || "null",
            port:cameraData["port"] || "null",
            userName:cameraData["userName"] || "null",
            password:cameraData["password"]|| "null"
        };
        oTemp1.type=0;
        setCameraConfig(oTemp1,onSuc,onFail);
        function onSuc(data){
            if(data.retCode==0){
                Frame.Msg.info("添加摄像头成功！");
                Utils.Base.refreshCurPage();
            }
            else{
               if(data.retCode==-2){
                    Frame.Msg.info("添加摄像头失败！摄像头名称重复！");
                    //Utils.Base.refreshCurPage();
                }else if(data.retCode==-4){
                    Frame.Msg.info("添加摄像头失败！摄像头ip地址和port重复！");
                    //Utils.Base.refreshCurPage();
                }
                else{
                    Frame.Msg.info("添加摄像头失败！");

                }
                Utils.Base.refreshCurPage();
                return;

            }

        }
        function onFail(){
            Frame.Msg.info("添加摄像头失败！");
        }
    }

    function delCamera(param){
        console.log(param);
        Frame.Msg.confirm("是否确定删除？",function() {
        for(var i=0;i<param.length;i++){
            var oTempDel={
                //cameraName:cameraName  /* 摄像头名称 */
                //ipAddr:ipAddr          /* 摄像头IP地址 */
                //port:port              /* 摄像头端口号 */
                //userName:userName      /* 摄像头用户名 */
                //password:password      /* 摄像头密码 */
                cameraName:param[i].cameraName,
                ipAddr: param[i].ipAddr,
                port: param[i].port,
                userName: param[i].userName,
                password: param[i].password,
            };
            console.log(oTempDel);
            delCameraConfig(oTempDel,onSuc);
        }
        function onSuc(aData){
                if(aData.retCode != 0){
                    if(aData.retCode ==-2){
                        Frame.Msg.info("此摄像头已被绑定不能删除！");//
                    }else{
                        Frame.Msg.info("删除摄像头失败！");
                    }
                    Utils.Base.refreshCurPage();
                    return;
                }
            Frame.Msg.info("删除摄像头信息成功！");
            Utils.Base.refreshCurPage();
        }

        })
    }


    //初始化显示列表
    function initList(){
        var optInfo = {
            colNames: getRcText("CAMERA_HEAD"),//摄像头名称,IP地址,端口号,用户名，密码
            showHeader: true,
            multiSelect: true,
            showOperation: true,
            pageSize:5,
            asyncPaging:true,
            onPageChange:function(pageNum,pageSize,oFilter){
                if(oFilter){
                    var oFilt = {};
                    oFilt.cameraNameWeak = oFilter.cameraNameWeek;
                    oFilt.ipAddr = oFilter.ipAddr;
                    oFilt.port = oFilter.port;
                    oFilt.userName = oFilter.userName;
                    oFilt.password = oFilter.password;
                }
                getCameraConfig(pageSize, pageNum, oFilt);
            },

            onSearch:function(oFilter,oSorter){
                if(oFilter){
                    var oFilt = {};
                    oFilt.cameraNameWeak = oFilter.cameraName;
                    oFilt.ipAddr = oFilter.ipAddr;
                    oFilt.port = oFilter.port;
                    oFilt.userName = oFilter.userName;
                    oFilt.password = oFilter.password;
                }
                getCameraConfig(5, 1, oFilt);
            },

            colModel: [
                {name:'cameraName'},
                {name:'ipAddr'},
                {name:'port'},
                {name:'userName'},
                {name:'password'}
            ],
            buttons: [
                { name: 'add', action:addCamera},
                { name: 'default', value: '删除', enable: ">0", icon: 'slist-del', action: delCamera},
                { name: 'edit', action: editCamera },
                { name: 'delete', action: delCamera }
            ]
        };
        $("#cameraList").SList ("head", optInfo);
    }
    function initData(){
        getCameraConfig(5,1);
    }

    function initEvent(){
        //var re=/[^(0-9A-Za-z)]/;
        //var re=/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
        //$("#port").on("focus",function(){
        //    var str= $("#ipAddr").val();
        //    if(!re.test(str)){
        //        $("#IPaddress_error").css({display:"inline-block",height:"22px",width:"135px"});
        //        $("#IPaddress_error").html("格式不正确！");
        //        this.value=str.replace(re,"");
        //    }
        //});
    }
    function _init ()
    {
        function setBreadContent(paraArr){
            
            $("#bread_index").css("display",'inline');
            $("#bread_index a").attr("href","#C_CDashboard");
            $("#bread_index a").text("网络管理");
            
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
                        {text:'摄像头管理',href:''}]);
        //initSingleSelect();
        initList();
        initData();
    }

    function _destroy ()
    {
        eCamera=[];
        dCamera=[];
        maxFlag=null;
        minFlag=null;
    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["SList","Form",'SingleSelect'],
        "utils":["Request","Base", 'Device']
    });
})( jQuery );
