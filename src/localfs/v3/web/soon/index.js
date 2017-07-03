
(function ($)
{
    var MODULE_NAME = "order.index";
    var g_jForm,g_oPara;

    

   
    
    function initForm()
    {
         $("#send").on("click",function(){
            var order = $("#order_text").val();
            $.ajax({
            url: MyConfig.path + "/ant/confmgr?acSN=" + FrameInfo.ACSN,
                type:"POST",
                dataType: "json",
                data:{configType:0,
                      cloudModule:"CMDPROXY",
                      deviceModule:"CMDPROXY",
                      method:"cmdProxy",
                      cmdProxy:"wips\nvirtual-security-domain aaa\nundo apply detect policy aaa"
                     },
                success:function (data){

                },
                error:function(err){
                    alert(err);
                }
            }); 
        });
        
        $("input").on("click",function(){
            $("input").hide();
            $("textarea").show();
        });
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
