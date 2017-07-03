/**
 * Created by Administrator on 2015/12/1.
 */
/**
 * Created by Administrator on 2015/12/1.
 */
(function ($)
{
    var MODULE_NAME = "auth.automaticreply";
    var g_jForm,g_oPara;

    function getRcText(sRcName)
    {
        return Utils.Base.getRcString("auto_rc", sRcName);
    }
    function showPage(){

    }
    function initGrid()
    {   
        var optpage = {
            colNames: getRcText ("Automaticreply_HEADER"),
            multiSelect: false,
            showOperation:true,
            colModel: [
                {name:'keyName', datatype:"String"},
                {name:'matchType', datatype:"String"},
                {name:'messageName', datatype:"String"}
            ],
            // onToggle : {
            //     action : showPage,
            //     jScope : $("#messageList"),
            //     BtnDel : {
            //         show : true,
            //         action : onDelPage
            //     }
            // },
            buttons:[
                {name: "add"},
                {name: "delete"}
            ]
        };
        $("#automaticreplyList").SList ("head", optpage);
    }

    function pageListData(){
        var data = {"data":[
            {
                keyName:"页面模板",
                matchType:"新的页面模板",
                messageName:"name1",
                pagemodel:"1"
            },
            {
                keyName:"页面模板1",
                matchType:"新的页面模板",
                messageName:"name2",
                pagemodel:"2"
            },
            {
                keyName:"页面模板2",
                matchType:"新的页面模板",
                messageName:"name3",
                pagemodel:"3"
            },
            {
                keyName:"页面模板3",
                matchType:"新的页面模板",
                messageName:"name4",
                pagemodel:"2"
            },
            {
                keyName:"页面模板4",
                matchType:"新的页面模板",
                messageName:"name5",
                pagemodel:"1"
            }
        ]}
        $("#automaticreplyList").SList ("refresh", data.data);
    }

    function initData()
    {   
        pageListData();
    }

    function initForm(){
        $("#registBtn1").on("click", function(){
            Utils.Base.redirect ({np:"auth.index"});
            return false;
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

    }

    function _resize()
    {

    }
    Utils.Pages.regModule (MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "resize": _resize,
        "widgets": ["SList","SingleSelect","Minput","Form"],
        "utils": ["Base"]
    });
}) (jQuery);
