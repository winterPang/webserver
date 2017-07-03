(function($) {
    var MODULE_NAME = "p_wire.bindservice";
    var MODULE_RC = "apinfo_aplist_rc";
    var MODULE_BASE = "p_wire";
    var g_aData=[];
    var g_aData2=[];


    function getRcText(sRcId){
        return Utils.Base.getRcString("ap_bindservice_rc", sRcId);
    }

    function showLink1(row, cell, value, columnDef, dataContext, type){
        value = value || "";

        if(""!= value)
        {           
            return '<a class="list-link" cell="'+cell+'"'+' ApGroupName="'+dataContext.apGroupName+'">'+value+'</a>';
        }else
        {
            return '<a class="list-link" cell="'+cell+'"'+' ApGroupName="'+dataContext.apGroupName+'">'+0+'</a>';
        }             
    }

    function showLink2(row, cell, value, columnDef, dataContext, type){
        if(type=="text"){
            return getRcText("OPERATION");
        }
        if(type=="html"){
            return '<a class="list-link" cell="'+cell+'"'+'ApGrouName="'+dataContext.ApGrouName+'"><i class="fa fa-link" style="font-size:20px"></i></a>';
        }
    }

    function onAPGroup(){
        var sType = $(this).attr("cell");
        var sAPGroupNmae=$(this).attr("apgroupname");

        if(sType==2){
            $("#APGroup_form").form ("init", "edit", {"title":getRcText("WIRELESS_SER"),
                "btn_apply":false, 
                "btn_cancel":false});
            Utils.Base.openDlg(null, null, {scope:$("#APGroup"),className:"modal-super"}); 
            getApGroupBindstList(sAPGroupNmae);
        }
        if(sType==3){
            var apgroupname=$(this).parent().parent().find("div:eq(1)").html(); 
            var oUrlPara = {
                np: MODULE_BASE + ".apgrouplist", 
                apGroupName:apgroupname,                                                          
            };
            Utils.Base.redirect(oUrlPara);
        }
    }

    function showLink3(row, cell, value, columnDef, dataContext, type){
        if(""!= value)
        {           
            return '<a class="list-link" cell="'+cell+'"'+' ApName="'+dataContext.apName+'">'+value+'</a>';
        }else
        {
            return '<a class="list-link" cell="'+cell+'"'+' ApName="'+dataContext.apName+'">'+0+'</a>';
        }
    }

    function showLink4(row, cell, value, columnDef, dataContext, type){
        if(type=="text"){
            return getRcText("OPERATION");
        }
        if(type=="html"){
            return "<a class='list-link' cell='"+cell+"'branchname='"+dataContext.BranchName+"'><i class='fa fa-link' style='font-size:20px'></i></a>";
        }
    }

    function onAP(){    
        var sType = $(this).attr("cell");
        var sAPName=$(this).attr("apname");

        if(sType==1){
             $("#AP_form").form ("init", "edit", {"title":getRcText("WIRELESS_SER"),
                "btn_apply":false, 
                "btn_cancel":false});
                Utils.Base.openDlg(null, null, {scope:$("#AP"),className:"modal-super"}); 

                getApBindstList(sAPName);
        }
        if(sType==2){       
            var apname=$(this).parent().parent().find("div:eq(1)").html();
            var apsn={};
            var radioid={};
            $.each(g_aData.apList,function(n,value){
               if(value.apName==apname){
                apsn=value.apSN;
                radioid=value.radioNum;
               }
            })
            var oUrlPara = {
                np: MODULE_BASE + ".aplist", 
                apName:apname, 
                apSN:apsn,
                radioId:radioid,            
            };           
            Utils.Base.redirect(oUrlPara);         
        }
    }

    function getApGroupBindstList(data) {
        function getApGroupBindstListSuc(aData){           
            $("#APGruopList2").SList ("refresh",aData.stList.stBindList);
        }

        function getApGroupBindstListFal(){
            console.log("err");
        }
        
        var getApGroupBindstListOpt={
            type: "GET",
            url: MyConfig.path+"/ssidmonitor/getapgroupbindstlist",
            dataType: "json",
            contentType: "application/json",
            data:{
                    devSN:FrameInfo.ACSN,  
                    apGroupName:data,           
                },
            onSuccess: getApGroupBindstListSuc,
            onFailed: getApGroupBindstListFal
        } 
        Utils.Request.sendRequest(getApGroupBindstListOpt); 
    }

    function getApBindstList(data) {
        function getApBindstListSuc(aData){           
            $("#APList").SList ("refresh",aData.stList.stBindList);
        }

        function getApBindstListFal(){
            console.log("err");
        }
        
        var getApBindstListOpt={
            type: "GET",
            url: MyConfig.path+"/ssidmonitor/getapbindstlist",
            dataType: "json",
            contentType: "application/json",
            data:{
                    devSN:FrameInfo.ACSN,  
                    apName:data,           
                },
            onSuccess: getApBindstListSuc,
            onFailed: getApBindstListFal
        } 
        Utils.Request.sendRequest(getApBindstListOpt); 
    }

    function initGrid(){
       
        var apGroupOpt = {
            showHeader: true,
            multiSelect: false,
            pageSize: 10,
            colNames: getRcText("BASE_HEADER_S"),
            showOperation: false,
            colModel: [
                { name: "apGroupName", datatype: "String"},
                { name: "apGrpDesc", datatype: "String"},
                { name: "stBindCount", datatype:"String",formatter:showLink1},
                { name: "operation", datatype:"String",formatter:showLink2}
            ],            
        };
        $("#apGroup").SList("head",apGroupOpt);


        var apOpt = {
            showHeader: true,
            multiSelect: false,
            pageSize: 10,
            colNames: getRcText("BASE_HEADER_W"),
            showOperation: false,
            colModel: [
                { name: "apName", datatype: "String"},               
                { name: "stBindCount", datatype:"String",formatter:showLink3},
                { name: "operation", datatype:"String",formatter:showLink4}
            ],  
        };
        $("#ap").SList("head", apOpt);
        $("#ap").hide();

        var APGruopListOpt={
            showHeader:true,
            multiSelect:false,
            pageSize:10,
            colNames: getRcText("Bind_HEADER"),
            showOperation: false,
            colModel: [
                { name: "stName", datatype: "String"},
                { name: "ssidName", datatype: "String"},
                { name: "stDesc", datatype: "String"}
            ],
        }
        $("#APGruopList2").SList("head", APGruopListOpt);

         var APListOpt={
            showHeader:true,
            multiSelect:false,
            pageSize:10,
            colNames: getRcText("Bind_HEADER"),
            showOperation: false,
            colModel: [
                { name: "stName", datatype: "String"},
                { name: "ssidName", datatype: "String"},
                { name: "stDesc", datatype: "String"}
            ],
        }
        $("#APList").SList("head", APListOpt);
    }

        
    function initData(){
        //获取AP绑定无线服务
        function getApBindstCountSuc(aData){
            g_aData=aData;
            $("#ap").SList ("refresh",aData.apList).resize();           
        }

        function getApBindstCountFal(){
            console.log("err");
        }
        
        var getApBindstCount={
            type: "GET",
            url: MyConfig.path+"/ssidmonitor/getapbindstcount",
            dataType: "json",
            contentType: "application/json",
            data:{
                    devSN:FrameInfo.ACSN,                 
                },
            onSuccess: getApBindstCountSuc,
            onFailed: getApBindstCountFal
        } 
        Utils.Request.sendRequest(getApBindstCount);

            
        //获取APGROUP绑定无线服务
        function getApGroupBindstCountSuc(aData2){
            g_aData2=aData2;

            var  aapGroupBind=[];
            $.each(aData2.apgroupList,function(key,value){
                var oapGroupBind={};
                oapGroupBind.apGroupName=value.apGroupName;
                oapGroupBind.apGrpDesc=value.apGrpDesc;
                oapGroupBind.stBindCount=value.stBindCount;
                aapGroupBind.push(oapGroupBind);
            })

            $("#apGroup").SList ("refresh",aapGroupBind).resize();         
        }

        function getApGroupBindstCountFal(){
            console.log("err");
        }
        
        var getApGroupBindstCount={
            type: "GET",
            url: MyConfig.path+"/ssidmonitor/getapgroupbindstcount",
            dataType: "json",
            contentType: "application/json",
            data:{
                    devSN:FrameInfo.ACSN,                 
                },
            onSuccess: getApGroupBindstCountSuc,
            onFailed: getApGroupBindstCountFal
        } 
        Utils.Request.sendRequest(getApGroupBindstCount);  
                 
    }

    function initForm(){      
        $('#alldevice').on("click", function() {
            $('#apGroup').show().resize();
            $('#ap').hide();
        });

        $('#singledevice').on("click", function() {
            $('#ap').show().resize();
            $('#apGroup').hide();
        });

        $("#ap").on('click','a.list-link',onAP);     
        $("#apGroup").on('click','a.list-link',onAPGroup);
    }

    function _init() {
        initGrid();
        initForm();
        initData();
    }

    function _resize (jParent){}

    function _destroy() {
        g_aData=[];
        g_aData2=[];
    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "resize": _resize,
        "widgets": ["SList", "Form", "Typehead", "Minput"],
        "utils": ["Base", "Request"],
        "subModules": []
    });
})(jQuery);
