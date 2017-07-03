/* Created by WeiXin（kf6675） on 2016/5/4*/
(function ($)
{
    var MODULE_NAME = "faultlog.faultlog";
    var rc_info = "faultLog_rc";
    var g_jForm,g_oPara;

    function getRcText(sRcName)
    {
        return Utils.Base.getRcString(rc_info, sRcName);
    }

    function editTest(){       
    }
    function redirectStroe(){        
    }
  
    function initGrid() 
    {   

        var failRecordOpt = {
                colNames: getRcText ("faultLog_HEADER"),
                showOperation:false,
                pageSize:10,
                colModel: [
                    {name:'UserIP', datatype:"String"},
                    {name:'ApName',datatype:"String"},
                    {name: 'Ssid',datatype:"String"},
                    {name: 'UserMac',datatype:"String"},
                    {name: 'UserName',datatype:"String"},
                    {name: 'AuthFailTime',datatype:"String"},
                    {name: 'AuthFailReason',datatype:"String"},
                ],
                buttons:[]
            };          
        $("#failRecordList").SList ("head", failRecordOpt);

        var abnormallRecordOpt = {
                colNames: getRcText ("faultLog_HEADER2"),
                showOperation:false,
                pageSize:10,
                colModel: [
                    {name:'UserIP', datatype:"String"},
                    {name:'ApName',datatype:"String"},
                    {name: 'Ssid',datatype:"String"},
                    {name: 'UserMac',datatype:"String"},
                    {name: 'AuthErrorTime',datatype:"String"},
                    {name: 'AuthErrorReason',datatype:"String"},
                ],
                buttons:[]
        };
        $("#abnormalRecordList").SList ("head", abnormallRecordOpt);                  
    }

    function getFailRecord() 
    {
        //绘制failRecordSlist
        function getFailRecordSuc(data){
           
            for(i=0,len=data.userList.length;i<len;i++){
                time(i);
            }

            function time(i){               
                var date = new Date(data.userList[i].AuthFailTime);
                Y = date.getFullYear() + '-';
                M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
                D = date.getDate() + ' ';
                h = date.getHours() + ':';
                m = date.getMinutes() + ':';
                s = date.getSeconds(); 
                data.userList[i].AuthFailTime=Y+M+D+h+m+s;
            }
            
            $("#failRecordList").SList ("refresh",data.userList);            
        }

        function getFailRecordFail(err){
            console.log(err);
        }

        var getFailRecordOpt = {
            type: "GET",
            url: MyConfig.path+"/portalmonitor/app/getfailrecord_page",
            dataType: "json",
            contentType: "application/json",
            data:{
                    devSN:FrameInfo.ACSN,
                    Skipnum:0,
                    Limitnum:500
                },
            onSuccess: getFailRecordSuc,
            onFailed: getFailRecordFail
        }
        Utils.Request.sendRequest(getFailRecordOpt); 
    }

    function getAbnormalRecordSuc()
    {
        //绘制abnormalRecordSlist 
        function getAbnormalRecordSuc(aData){            
            for(i=0,len=aData.userList.length;i<len;i++){
                time(i);
            }

            function time(i){               
                var date = new Date(aData.userList[i].AuthErrorTime);
                Y = date.getFullYear() + '-';
                M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
                D = date.getDate() + ' ';
                h = date.getHours() + ':';
                m = date.getMinutes() + ':';
                s = date.getSeconds(); 
                aData.userList[i].AuthErrorTime=Y+M+D+h+m+s;
            }

            $("#abnormalRecordList").SList ("refresh", aData.userList); 
            $("#abnormalRecordList").hide();      
        }

        function getAbnormalRecordFail(err){
            console.log(err);
        }

        var getAbnormalRecordOpt = {
            type: "GET",
            url: MyConfig.path+"/portalmonitor/app/getabnormalrecord_page",
            dataType: "json",
            contentType: "application/json",
            data:{
                    devSN:FrameInfo.ACSN,
                    Skipnum:0,
                    Limitnum:500
                },
            onSuccess:getAbnormalRecordSuc,
            onFailed: getAbnormalRecordFail
        }
        Utils.Request.sendRequest(getAbnormalRecordOpt);
    }
    
    function initData()
    {   
        getFailRecord();
        getAbnormalRecordSuc();

        var aIntList=["认证失败记录","认证异常记录"]
        $("#faultLog_select").singleSelect("InitData",aIntList);
        $("#faultLog_select").singleSelect("value",aIntList[0]);    
    }
   
    function initForm()
    {
        // 各种事件
        $("#filter_faultLog").click(function () {
            $("#faultLog_block").toggle();
        });

        $("#failRecord").click(function () {
            $("#failRecordList").show();
            $("#abnormalRecordList").hide();
        });

        $("#abnormalRecord").click(function () {
            $("#abnormalRecordList").show();
            $("#failRecordList").hide();
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
        "widgets": ["SList","SingleSelect","Minput"],
        "utils": ["Base","Request"]
    });
}) (jQuery);
