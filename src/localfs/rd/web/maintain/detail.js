(function($){

    var MODULE_BASE = "maintain";
    var MODULE_NAME = MODULE_BASE + ".detail";


    function getRcText(sRcName){
        return Utils.Base.getRcString("rc_more",sRcName);
    }

    function initGrid(){

        var opt_head = {
            colNames: getRcText ("title"),
            multiSelect: false,
            PageSize:10,
            colModel:[
                {name:'name', datatype:"String"},
                {name:'count', datatype:"String"}
            ]
        };

        $("#moreDetail").SList("head",opt_head);
    }

    function initMoreDetail(data){

        var optData = [];
        for(var i=0; i < data.length;i++){
            optData[i] = {};
            optData[i].name = data[i].name;
            optData[i].count = data[i].value;
        }

        $("#moreDetail").SList("refresh",optData);
    }

    function _init(oPara){

        initGrid();
        initMoreDetail(oPara);
    }

    function _destroy(){

    }

    Utils.Pages.regModule(MODULE_NAME,{
        "init":_init,
        "destroy":_destroy,
        "widgets":["SList"],
        "Utils":["Base"]
    })

})(jQuery);