(function ($)
{
    var MODULE_NAME = "h_operationLog.index";

    function getRcText(sRcName)
    {
        return Utils.Base.getRcString("operationLog_rc", sRcName);

    }
  
    function draw(){
        var opt1 = {
            height:"",
            showHeader: true,
            multiSelect: false,
            pageSize : 11,
            colNames: getRcText ("NET_ITEM"),
            colModel: [
                {name: "operator", datatype: "String",width:60},//操作员
                {name: "timeOperation", datatype: "String",width:100},//时间操作
                {name: "IPAdd", datatype: "String",width:100},//IP地址
                {name: "moduleName", datatype: "String",width:60},//模块名称
                {name: "operationDec", datatype: "String",width:100},//操作描述
                {name: "operationResult", datatype: "String",width:100},//操作结果
                {name: "failCause", datatype: "String",width:70}//失败原因
            ],
            buttons:[
                {name: "default", value:getRcText ("FRESH"), action: Fresh}
            ]
        };
        $("#operationLog_list").SList ("head", opt1);
        var tempData1 = [];
        tempData1.push(
            {
                operator:"liuchao",
                timeOperation:"2016-03-03 09:49:41",
                IPAdd:"221.12.31.29",
                moduleName:getRcText("MODULENAME"),
                operationDec:getRcText("OPERATIONDEC")+"liuchao",
                operationResult:getRcText("OPERATIONRESULT"),
                failCause:""
            },
            {
                operator:"liuchao",
                timeOperation:"2016-03-03 09:49:41",
                IPAdd:"221.12.31.29",
                moduleName:getRcText("MODULENAME"),
                operationDec:getRcText("OPERATIONDEC")+'"dddddddddddddd"',
                operationResult:getRcText("OPERATIONRESULT"),
                failCause:getRcText("FAILCAUSE")
            },
            {
                operator:"liuchao",
                timeOperation:"2016-03-03 09:49:41",
                IPAdd:"221.12.31.29",
                moduleName:getRcText("MODULENAME"),
                operationDec:getRcText("OPERATIONDEC")+'"sdddddd"',
                operationResult:getRcText("OPERATIONRESULT"),
                failCause:""
            },
           {
                operator:"liuchao",
                timeOperation:"2016-03-03 09:49:41",
                IPAdd:"221.12.31.29",
                moduleName:getRcText("MODULENAME"),
                operationDec:getRcText("OPERATIONDEC")+'"dddddddddddddd"',
                operationResult:getRcText("OPERATIONRESULT"),
                failCause:""
            },
            {
                operator:"liuchao",
                timeOperation:"2016-03-03 09:49:41",
                IPAdd:"221.12.31.29",
                moduleName:getRcText("MODULENAME"),
                operationDec:getRcText("OPERATIONDEC")+'"dddddddsss"',
                operationResult:getRcText("OPERATIONRESULT"),
                failCause:""
            },
            {
                operator:"liuchao",
                timeOperation:"2016-03-03 09:49:41",
                IPAdd:"221.12.31.29",
                moduleName:getRcText("MODULENAME"),
                operationDec:getRcText("OPERATIONDEC")+'"sddddddfddfdfdssssss"',
                operationResult:getRcText("OPERATIONRESULT"),
                failCause:""
            },
            {
                operator:"liuchao",
                timeOperation:"2016-03-03 09:49:41",
                IPAdd:"221.12.31.29",
                moduleName:getRcText("MODULENAME"),
                operationDec:getRcText("OPERATIONDEC")+'"ddddddddd"',
                operationResult:getRcText("OPERATIONRESULT"),
                failCause:""
            },
           {
                operator:"liuchao",
                timeOperation:"2016-03-03 09:49:41",
                IPAdd:"221.12.31.29",
                moduleName:getRcText("MODULENAME"),
                operationDec:getRcText("OPERATIONDEC")+'"ddddddddddddd"',
                operationResult:getRcText("OPERATIONRESULT"),
                failCause:""
            },
            {
                operator:"liuchao",
                timeOperation:"2016-03-03 09:49:41",
                IPAdd:"221.12.31.29",
                moduleName:getRcText("MODULENAME"),
                operationDec:getRcText("OPERATIONDEC")+"liuchao",
                operationResult:getRcText("OPERATIONRESULT"),
                failCause:""
            },
            {
                operator:"liuchao",
                timeOperation:"2016-03-03 09:49:41",
                IPAdd:"221.12.31.29",
                moduleName:getRcText("MODULENAME"),
                operationDec:getRcText("OPERATIONDEC")+"liuchao",
                operationResult:getRcText("OPERATIONRESULT"),
                failCause:""
            },
            {
                operator:"liuchao",
                timeOperation:"2016-03-03 09:49:41",
                IPAdd:"221.12.31.29",
                moduleName:getRcText("MODULENAME"),
                operationDec:getRcText("OPERATIONDEC")+"liuchao",
                operationResult:getRcText("OPERATIONRESULT"),
                failCause:""
            },
            {
                operator:"liuchao",
                timeOperation:"2016-03-03 09:49:41",
                IPAdd:"221.12.31.29",
                moduleName:getRcText("MODULENAME"),
                operationDec:getRcText("OPERATIONDEC")+"liuchao",
                operationResult:getRcText("OPERATIONRESULT"),
                failCause:""
            }
        );
        $("#operationLog_list").SList ("refresh", tempData1);
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