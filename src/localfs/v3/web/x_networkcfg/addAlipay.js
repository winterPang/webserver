/**
 * Created by Administrator on 2016/3/10.
 */
(function ($) {
    var MODULE_NAME = "x_networkcfg.addAlipay";
    //��ȡurl�еĲ���
    function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //����һ������Ŀ�������������ʽ����
        var r = window.location.hash.substr(1).match(reg);  //ƥ��Ŀ�����
        if (r != null) return unescape(r[2]); return null; //���ز���ֵ
    }
    function getRcText(sRcName)
    {
        return Utils.Base.getRcString("we_chat_rc", sRcName);
    }

    function initForm()
    {


    }

    function initGrid() {
        $("#cancelInfo").click(function(){
            Utils.Base.redirect({ np:"x_networkcfg.relateid"});
            //return false;
        });
    }

    function initData()
    {


    }

    function _init() {

        initGrid();
        initForm();
        initData();


    }

    function _destroy() {
        Utils.Request.clearMoudleAjax(MODULE_NAME);
    }

    function _resize() {

    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "resize": _resize,
        "widgets": ["SList", "SingleSelect", "Minput", "Form", "MSelect"],
        "utils": ["Base"]
    });

})(jQuery);
