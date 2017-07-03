
(function ($)
{
    var MODULE_NAME = "h_mchannel.subscription";
    var g_jForm,g_oPara;

    function getRcText(sRcName)
    {
        return Utils.Base.getRcString("sub_rc", sRcName);
    }
    function showPage(){

    }
    function initGrid()
    {
        var optpage = {
            colNames: getRcText ("Subscription_HEADER"),
            multiSelect: false,
            showOperation:true,
            colModel: [
                {name:'messageName', datatype:"String"},
                {name:'messageType', datatype:"String"}
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
        $("#messageList").SList ("head", optpage);
    }

    function pageListData(){
        var data = {"data":[
            {
                messageName:"页面模板",
                messageType:"新的页面模板",
                pagemodel:"1"
            },
            {
                messageName:"页面模板1",
                messageType:"新的页面模板",
                pagemodel:"2"
            },
            {
                messageName:"页面模板2",
                messageType:"新的页面模板",
                pagemodel:"3"
            },
            {
                messageName:"页面模板3",
                messageType:"新的页面模板",
                pagemodel:"2"
            },
            {
                messageName:"页面模板4",
                messageType:"新的页面模板",
                pagemodel:"1"
            }
        ]}
        $("#messageList").SList ("refresh", data.data);
    }

    function initData()
    {
        pageListData();
    }

    function initForm(){
        $("#registBtn2").on("click", function(){
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
