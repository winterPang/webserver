(function($){

    var MODULE_BASE = "maintain";
    var MODULE_NAME = MODULE_BASE + ".uploadfile";


    function initForm(){

        $("#toHDFS").click(function(){
            var jDlg = $("#formDlg");
            var jScope = {scope:jDlg,className:'modal-super'};
            Utils.Base.openDlg(null,{},jScope);
        });

        $("#file").on("change",function(){
            var value = $('input[name=filename]').val();
            if(value != ""){
                $('.btn.btn-info.success').removeAttr("disabled");
            }
            else
            {
                $(".btn.btn-info.success").attr("disabled","disabled");
            }
        });

        $("#cancle").click(function(){
            $('input[name=filename]').val("");
            $(".btn.btn-info.success").attr("disabled","disabled");
        });
    }


    function initData(){

    }

    function _init(){

        initData();
        initForm();
    }


    function _destroy(){

    }

    Utils.Pages.regModule(MODULE_NAME,{
        "init": _init,
        "destroy": _destroy,
        "widgets": ["Form"],
        "utils":["Base"]
    })
})(jQuery);