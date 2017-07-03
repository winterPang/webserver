(function ($){

    var MODULE_BASE = "b_device";
    var MODULE_NAME = MODULE_BASE + ".ap_detail";
    var MODULE_RC = "apinfo_aplist_rc";
    var baseData = [];

    function getRcText(sRcName){
        return Utils.Base.getRcString(MODULE_RC, sRcName);
    }

    function ChangeAPInfo(row, cell, value, columnDef, dataContext, type)
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
            case  0:
            {
                var titletest = getRcText("AP_STATUS").split(',')[0];
                if(dataContext["status"] =="0")
                {
                    titletest = getRcText("AP_STATUS").split(',')[2];
                    return "<p class='float-left' type='0'>"+dataContext["apName"]+"</p><p title='"+titletest+"' class='index_icon_count index_icon_offline'></p>";
                    //return dataContext["Name"];
                }else if(dataContext["status"] =="1"){
                    titletest = getRcText("AP_STATUS").split(',')[1];
                    return "<p class='float-left' type='0'>"+dataContext["apName"]+"</p><p title='"+titletest+"' class='index_icon_count index_icon_online'></p>";
                }

                return "<p class='float-left' type='0'></p><p title='' class='index_icon_count'></p>";
                break;
            }
            default:
                break;
        }
        return false;
    }

    function datatime (argument) {

        var day  = parseInt(argument/86400);
        var temp = argument%86400;
        var hour = parseInt(temp/3600);
        temp = argument%3600;
        var mini = parseInt(temp/60);
        var sec  = argument%60;
        if (hour < 10)
        {
            var sDatatime = day+":0"+hour;
        }
        else
        {
            var sDatatime = day+":"+hour;
        }
        if (mini < 10)
        {
            sDatatime = sDatatime+":0"+mini;
        } else
        {
            sDatatime = sDatatime+":"+mini;
        }
        if (sec < 10)
        {
            sDatatime = sDatatime+":0"+sec;
        } else
        {
            sDatatime = sDatatime+":"+sec;
        }
        return sDatatime;
    }

    function baseInfoData(){
       baseData = [];
       baseData.push({           
           "apName":"h3c-wifi",
           "apModel":"手工Ap",          
           "apSN":"ASN12435553",
           "macAddr":"a1-ff-ff-ff",
           "apGroupName":"h3c-app",
           "status":"0"
       });
       baseData.push({           
           "apName":"h3c-mifi2",
           "apModel":"在线手工Ap",           
           "apSN":"BSN12435553",
           "macAddr":"11-1f-ff-ff",
           "apGroupName":"h3c-wmm",
           "status":"1"
       });
       $("#BaseInfoList").SList("refresh",baseData);

    }

    function radioInfoData(){
        var radioData = [];
        radioData.push({
            "apName":"h3c-wifi",
            "apSN":"ASN12435553",
            "radioInfo":"5GHZ",
            "channelInfo":"1",
            "powerrate":"5kwh",
            "counts":"100"
        },{
            "apName":"h3c-mifi2",
            "apSN":"BSN12435553",
            "radioInfo":"2.4GHZ",
            "channelInfo":"2",
            "powerrate":"2kwh",
            "counts":"300"
        });
        $("#RadioInfoList").SList("refresh",radioData);

    }

    function totalInfoData(){
        var totalData = [];
        totalData.push({
            "apName":"h3c-wifi",
            "apSN":"ASN12435553",
            "highflow":"500M",
            "lowflow":"10kb",
            "onlineTime":"10:00——11:00"

        },{
            "apName":"h3c-mifi2",
            "apSN":"BSN12435553",
            "highflow":"300M",
            "lowflow":"10kb",
            "channelInfo":"2",
            "onlineTime":"00:00——01:00"

        });
        $("#TotalInfoList").SList("refresh",totalData);
    }
    
    function wifiInfoData(){
        var wifiData = [];
        wifiData.push({
            "apName":"h3c-mifi",
            "innerSSID":"BSN12435553",
            "guestSSID":"BSN12435553",
            "one":"1",
            "two":"2",
            "three":"3"
        },{
           "apName":"h3c-mifi2",
            "innerSSID":"ASN12435552",
            "guestSSID":"ASN12435552",
            "one":"1",
            "two":"2",
            "three":"3"
            
        });
        $("#WifiInfoList").SList("refresh",wifiData)
    }

  
     
    function initBaseGrid(){
        var opt = {
            height:"70",
            showHeader: true,
            multiSelect: false,
            pageSize : 10,
            colNames: getRcText ("BASE_HEADER"),
            colModel: [
                 {name: "apName",datatype: "String",formatter:ChangeAPInfo}  //AP名称  及状态              
                ,{name: "apModel", datatype: "String"} //AP型号                
                ,{name: "apSN", datatype: "String"}   //序列号
                ,{name: "macAddr",  datatype: "String"}  //MAC地址               
                ,{name: "apGroupName", datatype: "String"} //AP组名称
            ]
        };
        $("#BaseInfoList").SList ("head", opt);
        //$("#BaseInfoList").SList ("resize");

    }

    function initRadioGrid(){
        var oSListOptions = {
            height:"70",
            showHeader: true,
            multiSelect: false,
            pageSize : 10,
            colNames: getRcText ("RADIO_HEADER"),
            colModel: [
                {name: "apName",datatype: "String",width:200} //AP名称               
                ,{name: "apSN",datatype: "String",width:200}//AP序列号               
                ,{name: "radioInfo",datatype: "String",width:200}//射频信息               
                ,{name: "channelInfo",datatype: "String",width:200}//信道信息             
                ,{name: "powerrate", datatype: "String",width:200} //功率
                ,{name: "counts", datatype: "String",width:200} //终端数
            ]
        };
        $("#RadioInfoList").SList ("head", oSListOptions);
        //$("#RadioInfoList").SList("resize");
    }

    function initTotalGrid(){
        var oSListOptions = {
            height:"70",
            showHeader: true,
            multiSelect: false,
            pageSize : 10,
            colNames: getRcText ("TOTAL_HEADER"),
            colModel: [
                {name: "apName",datatype: "String",width:200}//AP名称
                //,{name: "apModel",            datatype: "String", width:80}
                ,{name: "apSN",  datatype: "String",width:200}//AP序列号
                ,{name: "highflow",datatype: "String",width:200} //上行流量
                ,{name: "lowflow",datatype: "String",width:200}//下行流量              
                ,{name: "onlineTime",         datatype: "String",width:210}
            ]
        };
        $("#TotalInfoList").SList ("head", oSListOptions);
        //$("#TotalInfoList").SList ("resize");
    }
     function initWifiGrid(){
        var oSListOptions = {
            height:"70",
            showHeader: true,
            multiSelect: false,
            pageSize : 10,
            colNames: getRcText ("WIFI_HEADER"),
            colModel: [
                {name: "apName",datatype: "String",width:200}//AP名称               
                ,{name: "innerSSID",  datatype: "String",width:200}//内部SSID
                ,{name: "guestSSID",datatype: "String",width:200} //访客SSID
                ,{name: "one",datatype: "String",width:200}//1            
                ,{name: "two",datatype: "String",width:200}  //2
                ,{name: "three",datatype: "String",width:200}  //3             
            ]
        };
        $("#WifiInfoList").SList ("head", oSListOptions);
        //$("#TotalInfoList").SList ("resize");
    }
    function initGrid(){
        initBaseGrid();
        initTotalGrid();
        initRadioGrid();
        initWifiGrid();
    }


    function initData(){
        //draw();
        baseInfoData();
        radioInfoData();
        totalInfoData();
        wifiInfoData();
    }

    function initForm(){
        $("#return").on('click',function(){ history.back();});
        $("#BaseInfo").MCheckbox("setState",true);
        $("#BaseInfoList").removeClass("hide");
        $("#RadioInfoList").addClass("hide");
        $("#TotalInfoList").addClass("hide");
         $("#WifiInfoList").addClass("hide");
        $("input[name=type]").on("change",function(){
            if($("#BaseInfo").MCheckbox("getState")){
                $("#BaseInfoList").SList("resize");
                $("#BaseInfoList").removeClass("hide");
                $("#RadioInfoList").addClass("hide");
                $("#TotalInfoList").addClass("hide");
                $("#WifiInfoList").addClass("hide");
            }else if($("#RadioInfo").MCheckbox("getState")){
                $("#RadioInfoList").SList("resize");
                $("#RadioInfoList").removeClass("hide");
                $("#BaseInfoList").addClass("hide");
                $("#TotalInfoList").addClass("hide");
                $("#WifiInfoList").addClass("hide");
            }else if($("#TotalInfo").MCheckbox("getState")){
                $("#TotalInfoList").SList("resize");
                $("#TotalInfoList").removeClass("hide");
                $("#BaseInfoList").addClass("hide");
                $("#RadioInfoList").addClass("hide");
                $("#WifiInfoList").addClass("hide");
            }else if($("#WifiInfo").MCheckbox("getState")){
                $("#WifiInfoList").SList("resize");
                $("#WifiInfoList").removeClass("hide");
                $("#BaseInfoList").addClass("hide");
                $("#RadioInfoList").addClass("hide");
                $("#TotalInfoList").addClass("hide");
            }
        })

    }

    function _init ()
    {
        initGrid();
        initData();
        initForm();
    }
    function _resize (jParent)
    {
    }

    function _destroy()
    {
    }
    Utils.Pages.regModule (MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "resize": _resize,
        "widgets": ["Echart","Minput","SList"],
        "utils": ["Base", "Device"]

    });

}) (jQuery);
