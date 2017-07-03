;(function ($) {
    var MODULE_BASE = "classroom";
    var MODULE_NAME = MODULE_BASE + ".iotinfo";
    var startNum = null;
    var devSN=FrameInfo.ACSN;

    function getRcText (sRcName)
    {
        return Utils.Base.getRcString("c_net_infor_rc",sRcName);
    }

    function getBangleInfo(startTime,endTime,getBangleInfolSuc)
    {
        var option = {
            type:"POST",
            url:"/v3/smartcampusread",
            contentType:"application/json",
            data:JSON.stringify({
                devSn:FrameInfo.ACSN,
                Method:"getOnsiteInfo",
                Param:{
                    devSn: FrameInfo.ACSN,
                    startTime:startTime,
                    endTime:endTime
                }
            }),
            onSuccess: getBangleInfolSuc,
            onFailed: function(jqXHR,textstatus,error){
                Frame.Msg.info("数据更新异常", "error");
            }
        };
        Utils.Request.sendRequest(option);
    }

    function getApList(startNum,oFilter,getWeChatDetailSuc) {
        var getApListOpt = {
            type: "POST",
            url: MyConfig.path + "/apmonitor/app/aplist_page?devSN="+devSN+"&skipnum="+startNum+"&limitnum=3",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({
                findoption:oFilter,
                sortoption:{apName:1}
            }),
            onSuccess: getWeChatDetailSuc,
            onFailed: function(jqXHR,textstatus,error) {
                Frame.Msg.info("获取ap列表异常", "error");
            }
        };

        Utils.Request.sendRequest(getApListOpt);
    }
    function initWristbandData()
    {
        var datetime =new Date();
        var startTime=datetime.getTime()-(30*24*60*60*1000),endTime=datetime.getTime();
        var aStu = [],aMod = [];
        var f = function(){return aMac[parseInt(Math.random()*15)]};
        var aMac = ['1','2','3','4','5','6','7','8','9','A','B','C','D','E','F'];
        function getBangleInfolSuc(data){
            if(data.retCode != 0)
            {
                Frame.Msg.info("获取手环数据失败");
                return;
            }
            for(var i=1;i<10;i++)
            {
                var oTemp = {
                    MAC : data.result[i].mac,
                    Power : data.result[i].major+"%",
                    Signal : data.result[i].rssi,
                    Channel : parseInt(Math.random()*200)+"",
                };
                aStu.push(oTemp);

            }
            $("#BraceList").SList ("refresh", aStu);
        }

        getBangleInfo(startTime,endTime, getBangleInfolSuc);
    }

    function initModuleData(pageNum,pageSize,oFilter)
    {
        var pageNum = pageNum || 1;
        var startNum = 3 * (pageNum - 1);

        function getApListSuc(data) {
            var aApList = [];
            var oTemps = [];
            var m= 0,k=0;
            for(var i=0;i < data.apList.length * 3;i++)
            {
                k++;
                if(k==4) {
                    k = 1;
                    m++;
                }
                oTemps = {
                    Id: k,
                    apName: data.apList[m].apName,
                    apSN: data.apList[m].apSN,
                    ModuleSerialId:"--"
                };
                aApList.push(oTemps);
            }
            $("#NetInforList").SList("refresh", {data: aApList, total: data.count_total*3});
        }
        getApList(startNum,oFilter, getApListSuc);
    }
    function initData()
    {

        initModuleData();
        initWristbandData();

    }

    function initGrid()
    {
        var optInfor = {
            colNames: getRcText ("INFOR_HEAD"),
            multiSelect: false,
            pageSize:10,
            colModel: [
                {name:'MAC', datatype:"String"},
                {name:'Power', datatype:"String"},
                {name:'Signal', datatype:"String"},
                //{name:'Mode', datatype:"String"}

            ]
        };
        $("#BraceList").SList ("head", optInfor);

        var optModuleInfor = {
            colNames: getRcText("MOD_INFOR_HEAD"),
            multiSelect: false,
            showHeader: true,
            pageSize: 9,
            asyncPaging:true,
            onPageChange:function(pageNum,pageSize,oFilter){
                initModuleData(pageNum, 10, oFilter);
            },
            onSearch:function(oFilter,oSorter){
                initModuleData(0,10,oFilter);
            },
            colModel: [
                {name:'apName', datatype:"String"},
                {name:'apSN', datatype:"String"},
                {name:'Id', datatype:"String"},
                {name:'ModuleSerialId', datatype:"String"}
            ]
        };

        $("#NetInforList").SList ("head", optModuleInfor);
    }

    function _init ()
    {
        initGrid();
        initData();
    }

    function _destroy ()
    {

    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["SList","Form","SingleSelect","Typehead"],
        "utils":["Request","Base"]
    });
})( jQuery );