(function ($)
{
    var MODULE_NAME = "h_apinfo.skip";
    var g_allData;

    function getRcText(sRcName)
    {
        return Utils.Base.getRcString("skip_rc", sRcName);

    }

    function draw(){
        var opt1 = {
            multiSelect: false,
            colNames: getRcText ("SKIP_ITEM"),
            colModel: [
                {name: "Name", datatype: "String"},
                {name: "Model", datatype: "String"},
                {name: "CfgSerialID", datatype: "String"},
                {name: "CfgMacAddress", datatype: "Mac"},
                {name: "GroupName", datatype: "String"},
                {name: "RadioInfo", datatype: "String"},
                {name: "Status",datatype: "String"}
            ],
            buttons: [
                {name: "default", value:getRcText ("FRESH"), action: Fresh}
            ]
        };
        $("#skip_list").SList ("head", opt1);
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
    //---------------------------------------------------------------------------------------------------------------
  
    //--------------------------------------------------------------------------------------------------------------- 

    function initData(){
        draw();

            var aTemplate = [
                { 
                  "Name":"AP1",
                  "Model":"WA2620i-AGN",
                  "CfgSerialID":"219801A0CNC11A000000",
                  "CfgMacAddress":"00-d0-1e-00-00-00",
                  "GroupName":"Group-1",
                  "RadioInfo":"1,802.11ac(2.4GHz)(2),802.",
                  "Status":"false"
                },
                { 
                  "Name":"AP1",
                  "Model":"WA2620i-AGN",
                  "CfgSerialID":"219801A0CNC11A000000",
                  "CfgMacAddress":"00-d0-1e-00-00-00",
                  "GroupName":"Group-1",
                  "RadioInfo":"1,802.11ac(2.4GHz)(2),802.",
                  "Status":"false"
                },
                { 
                  "Name":"AP1",
                  "Model":"WA2620i-AGN",
                  "CfgSerialID":"219801A0CNC11A000000",
                  "CfgMacAddress":"00-d0-1e-00-00-00",
                  "GroupName":"Group-1",
                  "RadioInfo":"1,802.11ac(2.4GHz)(2),802.",
                  "Status":"false"
                 },
                 { 
                   "Name":"AP1",
                   "Model":"WA2620i-AGN",
                   "CfgSerialID":"219801A0CNC11A000000",
                   "CfgMacAddress":"00-d0-1e-00-00-00",
                   "GroupName":"Group-1",
                   "RadioInfo":"1,802.11ac(2.4GHz)(2),802.",
                   "Status":"false"
                }
            ];
             $("#skip_list").SList ("refresh", aTemplate);
    }

    function initForm(){
    }

    function _init ()
    {
        initForm();
        initData();
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