(function ($)
{
    var MODULE_NAME = "h_frag.index";

    function getRcText(sRcName)
    {
        return Utils.Base.getRcString("frag_rc", sRcName);

    }

    function showLink(row, cell, value, columnDef, dataContext, type)
    {
        value = value || "";

        if("text" == type)
        {
            return value;
        }

        return '<a class="list-link" cell="'+cell+'">'+value+'</a>';
    }

    function onDisDetail(data)
    {
        var oData = $("#frag_list").SList("getSelectRow")[0];
        var sType = $(this).attr("cell");
        if(sType == 0)
        {
            //showWirelessInfo(oData);
            showFlowInfo(oData);
        }
    }

    function showFlowInfo(oData)
    {
        /*var aType = [];
         for(i = 0; i < 4; i++)
         {
         var oo = {
         wifi:getRcText("HIDE").split(",")[i],
         hide:getRcText("HIDE" + i)
         }
         aType.push(oo);
         }*/
        /* end */
        var tempData9 = [];
        tempData9.push(
            {
                name:getRcText("NAME"),
                describe:"7:30-9:00",
                content:"scheduler job openradio"
            },
            {
                name:getRcText("NAME"),
                describe:"11:00-14:00",
                content:"command 1 system-view"
            },
            {
                name:getRcText("NAME"),
                describe:"17:00-19:00",
                content:"command 2 wlan ap-group default-group"
            },
            {
                name:getRcText("NAME"),
                describe:"7:30-9:00",
                content:"scheduler job openradio"
            },
            {
                name:getRcText("NAME"),
                describe:"11:00-14:00",
                content:"command 1 system-view"
            },
            {
                name:getRcText("NAME"),
                describe:"17:00-19:00",
                content:"command 2 wlan ap-group default-group"
            }
        );
        $("#flowdetail_list").SList ("refresh", tempData9);
        //$("#flowdetail_list").SList ("refresh", aType);
        /* 缁勭粐濂芥暟鎹悗 */
        Utils.Base.openDlg(null, {}, {scope:$("#flowdetailDlg"),className:"modal-super"});
    }

    function draw(){
        var opt1 = {
            height:"",
            showHeader: true,
            multiSelect: true,
            pageSize : 10,
            colNames: getRcText ("FRAG_ITEM"),
            colModel: [
                {name: "issuedfragname", datatype: "String",width:100,formatter:showLink},//下发片段名称
                {name: "type", datatype: "String",width:100},
                {name: "creater", datatype: "String",width:100},//上传速率
            ],
            buttons:[
                {name: "default", value:getRcText ("FRESH"), action: Fresh}
            ]
        };
        $("#frag_list").SList ("head", opt1);
        $("#frag_list").on('click', 'a.list-link', onDisDetail);

        var tempData1 = [];
        tempData1.push(
            {
                issuedfragname:getRcText("FRAG"),
                type:getRcText("TYPE"),
                creater:"dongdian1106"
            },
            {
                issuedfragname:getRcText("FRAG1"),
                type:getRcText("TYPE"),
                creater:"dongdian1106"
            },
            {
                issuedfragname:getRcText("FRAG2"),
                type:getRcText("TYPE"),
                creater:"dongdian1106"
            },
            {
                issuedfragname:getRcText("FRAG3"),
                type:getRcText("TYPE"),
                creater:"dongdian1106"
            },
            {
                issuedfragname:getRcText("FRAG4"),
                type:getRcText("TYPE"),
                creater:"dongdian1106"
            },
            {
                issuedfragname:getRcText("FRAG"),
                type:getRcText("TYPE"),
                creater:"dongdian1106"
            },
            {
                issuedfragname:getRcText("FRAG1"),
                type:getRcText("TYPE"),
                creater:"dongdian1106"
            },
            {
                issuedfragname:getRcText("FRAG2"),
                type:getRcText("TYPE"),
                creater:"dongdian1106"
            },
            {
                issuedfragname:getRcText("FRAG3"),
                type:getRcText("TYPE"),
                creater:"dongdian1106"
            },
            {
                issuedfragname:getRcText("FRAG4"),
                type:getRcText("TYPE"),
                creater:"dongdian1106"
            }
        );
        $("#frag_list").SList ("refresh", tempData1);

        var opt9 = {
            colNames: getRcText ("FRAG_CONTENT"),
            showHeader: true,
            multiSelect : false ,
            colModel: [
                {name: "name", datatype: "String"},
                {name: "describe", datatype: "String"},
                {name: "content", datatype: "String"}
            ]
        };
        $("#flowdetail_list").SList ("head", opt9);

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