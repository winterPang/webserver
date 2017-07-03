
(function ($)
{
    var MODULE_NAME = "order.index";
    var g_jForm,g_oPara,g_iTimerCnt;
    var g_oTimer;
    function initForm()
    {
        $("input").on("click",function(){
            $("input").hide();
            $("textarea").show();
        });
        $("#clear").on("click",function() {
            $("#order_text").val('');
            $("#order_text1").val('');
        })
        $("#order").on("click", function(){
            Utils.Base.redirect ({np:"order.order"});
            return false;
        });
        $("#close_btn").on("click",function() {
            $("#warning").css("visibility","hidden");
        })
        function printDot () {
            var sPrint = "<H3C>";
            g_iTimerCnt++;
            if (9 == g_iTimerCnt)
            {
                $("#order_text1").val('');
                g_iTimerCnt = 1;
            }

            for (var i = 0; i < g_iTimerCnt; i++)
            {
                sPrint += ".";
            }

            $("#order_text1").val(sPrint);

            g_oTimer = setTimeout(function(){printDot();},200);
        }
        $("#send").on("click",function(){
            g_iTimerCnt = 0;
            g_oTimer = setTimeout(function(){printDot();},200);
            $("#send").css("background","#f5f5f5");
            var order = $("#order_text").val();
            $.ajax({
                    url:"/v3/ant/confmgr",
                    dataType:"json",
                    type:"post",        
                    data:{
                        configType : 0, 
                        devSN :FrameInfo.ACSN,
                        deviceModule : "CMDPROXY", 
                        echo : 1,
                        cmdProxy:order
                    },
                success:function (data)
                {
                    clearTimeout(g_oTimer);
                    if(data.communicateResult == "success")
                    {
                        var sCmdRet = data.echoInfo;
                        var aCmdRet = new Array();
                        aCmdRet = sCmdRet.split("\r\n");
                        $("#order_text1").val(aCmdRet.join(""));
                    }
                    else{
                        var _sReason = "下发失败";
                        if (data.reason)
                        {
                            _sReason += "（错误原因：";
                            _sReason += data.reason;
                            _sReason += "）";
                        }

                        $("#order_text1").val(_sReason);
                    }
                    $("#send").css("background","#4ec1b2");
                },
                error: function(err)
                {
                    alert("error");
                }
            });
        })
    }
    function _init(oPara)
    {
        initForm();
    };

    function _destroy()
    {

    }

    Utils.Pages.regModule (MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": []
    });
}) (jQuery);
