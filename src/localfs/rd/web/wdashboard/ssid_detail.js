(function ($)
{
    var MODULE_NAME = "WDashboard.ssid_detail";
    var hTimer = false, g_aAllAps;
    function getRcText (sRcId)
    {
        return Utils.Base.getRcString ("users_detail_rc", sRcId);
    }

    function initForm()
    {
        /* $("#filter_group").on("click", function(){
         $("#group_block").toggle();
         });
         $(document).on("mousedown", function(e){
         var e = e || window.event;
         var elem = e.target || e.srcElement;
         while(elem)
         {
         if(elem.id && elem.id == "group_block")
         {
         return false;
         }
         elem = elem.parentNode;
         }
         $("#group_block").hide();
         });
         $("#ApNameSelect").on("change", onGroupChange);
         $("#Download").on("click", function(){
         $(this).addClass("active");
         $("#Upload").removeClass("active");
         });
         $("#Upload").on("click", function(){
         $(this).addClass("active");
         $("#Download").removeClass("active");
         });
         $("#disconAp").on("click", disconnectAP);*/
    }

    function initGrid ()
    {
        var optAll = {
            multiSelect: true,
            height: 300,
            search:true,
            showStatus:false,
            showPages: false,
            columnChange:false,
           // listenRowChange: onRowChanged,
            colNames: getRcText ("ALLAP_HEADER"),
            colModel: [
                {name: "userName", datatype: "String",width:50},
                {name: "address", datatype: "String",width:60},
                {name: "tel", datatype: "String",width:60},
                {name: "email", datatype: "String",width:60},
                {name: "company", datatype: "String",width:80},
                {name: "acNumber", datatype: "String",width:80},
                {name: "apNumber", datatype: "String",width:80},
                {name: "status", datatype: "String",width:80},
            ], buttons: [
                {name: "add", enable:false},
                {name: "edit",enable:false},
                {name: "delete", enable:false}
            ]
        };
        $("#usersList").mlist ("head", optAll);
    }



    function initData ()
    {
        var aRunAPList = [
            {
                "userName":"liuchao",
                "address":"北京回龙观昌平区龙冠大厦",
                "tel":"15300120012",
                "email":"ssddsd@162.com",
                "company":"昌平区龙冠H3c",
                "acNumber":"5",
                "apNumber":"10",
                "status":"0"
            }
            ,{
                "userName":"zhaochao",
                "address":"北京回龙观昌平区龙冠大厦",
                "tel":"15300120012",
                "email":"ssddsd@162.com",
                "company":"昌平区龙冠H3c",
                "acNumber":"5",
                "apNumber":"10",
                "status":"0"
            }
            ,{
                "userName":"zhaoliu",
                "address":"北京回龙观昌平区龙冠大厦",
                "tel":"15300120012",
                "email":"ssddsd@162.com",
                "company":"昌平区龙冠H3c",
                "acNumber":"5",
                "apNumber":"10",
                "status":"0"
            }
            ,{
                "userName":"lisi",
                "address":"北京回龙观昌平区龙冠大厦",
                "tel":"15300120012",
                "email":"ssddsd@162.com",
                "company":"昌平区龙冠H3c",
                "acNumber":"5",
                "apNumber":"10",
                "status":"1"
            }
            ,{
                "userName":"张三",
                "address":"北京回龙观昌平区龙冠大厦",
                "tel":"15300120012",
                "email":"ssddsd@162.com",
                "company":"昌平区龙冠H3c",
                "acNumber":"5",
                "apNumber":"10",
                "status":"1"
            }
            ,{
                "userName":"李四",
                "address":"北京回龙观昌平区龙冠大厦",
                "tel":"15300120012",
                "email":"ssddsd@162.com",
                "company":"昌平区龙冠H3c",
                "acNumber":"5",
                "apNumber":"10",
                "status":"0"
            }
            ,{
                "userName":"刘超",
                "address":"北京回龙观昌平区龙冠大厦",
                "tel":"15300120012",
                "email":"ssddsd@162.com",
                "company":"昌平区龙冠H3c",
                "acNumber":"5",
                "apNumber":"10",
                "status":"1"
            }




        ];
        var status = getRcText ("SATUS").split(",");
        $.each(aRunAPList,function(key,value){
            value.status = status[value.status]
        })


        $("#usersList").mlist ("refresh", aRunAPList);

    }

    function _init ()
    {
        g_aAllAps = [];
        initGrid();
        initForm();
        initData();
    }


    function _destroy ()
    {

    }

    function _resize()
    {

    }

    Utils.Pages.regModule (MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "resize": _resize,
        "widgets": ["Mlist","Echart","SList","SingleSelect"],
        "utils": []
    });

}) (jQuery);
