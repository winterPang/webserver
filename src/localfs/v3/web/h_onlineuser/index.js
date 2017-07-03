(function ($)
{
    var MODULE_NAME = "h_onlineuser.index";

    function getRcText(sRcName)
    {
        return Utils.Base.getRcString("onlineuser_rc", sRcName);

    }

    function draw(){
        var opt2 = {
            height:"70",
            showHeader: true,
            multiSelect: true,
            pageSize : 8,
            colNames: getRcText ("MANAGE_ITEM2"),
            colModel: [
                {name: "state", datatype: "String",width:80},//状态
                {name: "serialNum", datatype: "String",width:50},//序列号
                {name: "devicename", datatype: "String",width:60},//设备名称
                {name: "type", datatype: "String",width:60},//型号
                {name: "time", datatype: "String",width:100},//在线时长
                {name: "related", datatype: "String",width:60},//关联场所
                {name: "username", datatype: "String",width:50}//所属用户
            ]

        };
        $("#onlineuser_list").SList ("head", opt2);

        var tempData2 = [];
        tempData2.push(
            {
                state:"64-B4-73-3D-31-8E",
                serialNum:"",
                devicename:getRcText("AUTNENTICATE"),
                type:"192.168.202.112",
                time:"2016-02-29 09:25:59",
                related:"",
                username:"dongdian1106"
            },
            {
                state:"00-0C-E7-91-FC-03",
                serialNum:"",
                devicename:getRcText("AUTNENTICATE"),
                type:"192.168.202.198",
                time:"2016-02-29 09:20:21",
                related:getRcText("LOCATION"),
                username:"dongdian1106"
            },
            {
                state:"78-7E-61-04-12-21",
                serialNum:"",
                devicename:getRcText("AUTNENTICATE"),
                type:"192.168.201.0",

                time:"2016-02-29 09:17:24",
                related:getRcText("LOCATION"),
                username:"dongdian1106"
            },
            {
                state:"F4-29-81-B4-C0-B5",
                serialNum:"",
                devicename:getRcText("AUTNENTICATE"),
                type:"192.168.201.87",

                time:"2016-02-29 09:16:41",
                related:getRcText("LOCATION"),
                username:"dongdian1106"
            },
            {
                state:"10-F6-81-64-AC-CE",
                serialNum:"",
                devicename:getRcText("AUTNENTICATE"),
                type:"192.168.203.120",

                time:"2016-02-29 09:15:55",
                related:getRcText("LOCATION"),
                username:"dongdian1106"
            },
            {
                state:"28-FA-A0-18-B8-C0",
                serialNum:"",
                devicename:getRcText("AUTNENTICATE"),
                type:"192.168.201.113",

                time:"2016-02-29 09:13:28",
                related:getRcText("LOCATION"),
                username:"dongdian1106"
            },
            {
                state:"30-C7-AE-86-EC-B5",
                serialNum:"",
                devicename:getRcText("AUTNENTICATE"),
                type:"192.168.201.69",

                time:"2016-02-29 09:12:18",
                related:getRcText("LOCATION"),
                username:"dongdian1106"
            },
            {
                state:"48-6B-2C-B6-21-CA",
                serialNum:"",
                devicename:getRcText("AUTNENTICATE"),
                type:"192.168.201.82",

                time:"2016-02-29 09:09:18",
                related:getRcText("LOCATION"),
                username:"dongdian1106"
            }
        );
        $("#onlineuser_list").SList ("refresh", tempData2);

    }
    function Fresh(){
        Utils.Base.refreshCurPage();
    }
    /*function Fresh(){
        return $.ajax({
            type: "GEt",
            url:MyConfig.v2path+"/syncAc?acsn="+FrameInfo.ACSN,
            dataType: "json",
            contentType: "application/json",
            success:function(data){
                if(data&&data.error_code=="0"){
                    Utils.Base.refreshCurPage();
                }else{
                    Frame.Msg.info(data.error_message);
                }
            },
            error:function(err){

            }

        })
    }*/

    function initData(){
        draw();
    }

    function initForm(){
    }

    function _init ()
    {
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

}) (jQuery);;