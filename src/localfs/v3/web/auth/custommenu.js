/**
 * Created by Administrator on 2015/12/1.
 */
/**
 * Created by Administrator on 2015/12/1.
 */
(function ($)
{
    var MODULE_NAME = "auth.custommenu";
    var g_jForm,g_oPara;

    function getRcText(sRcName)
    {
        return Utils.Base.getRcString("custom_rc", sRcName);
    }
    function showPage(){

    }
    function initGrid()
    {   
        var optpage = {
            colNames: getRcText ("Custom_HEADER"),
            multiSelect: false,
            showOperation:true,
            colModel: [
                {name:'menuName', datatype:"String"},
                {name:'replyType', datatype:"String"},
                {name:'childMenu', datatype:"String"},
                {name:"priority",datatype:"String"}
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
                {name: "delete"},
                {name:"edit"}
            ]
        };
        $("#custommerList").SList ("head", optpage);
    }

    function pageListData(){
        var data = {"data":[
            {
                menuName:"页面模板",
                replyType:"新的页面模板",
                childMenu:"name1",
                priority:"1",
                pagemodel:"1"
            },
            {
                menuName:"页面模板1",
                replyType:"新的页面模板",
                childMenu:"name2",
                priority:"2",
                pagemodel:"2"
            },
            {
                menuName:"页面模板2",
                replyType:"新的页面模板",
                childMenu:"name3",
                priority:"3",
                pagemodel:"3"
            },
            {
                menuName:"页面模板3",
                matchType:"新的页面模板",
                childMenu:"name4",
                priority:"4",
                pagemodel:"2"
            },
            {
                menuName:"页面模板4",
                replyType:"新的页面模板",
                childMenu:"name5",
                priority:"5",
                pagemodel:"1"
            }
        ]}
        $("#custommerList").SList ("refresh", data.data);
    }

    function initData()
    {   
        pageListData();
    }

    function initForm(){
        $("#registBtn").on("click", function(){
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
