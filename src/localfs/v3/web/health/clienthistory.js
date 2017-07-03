/**
 * Created by Administrator on 2016/5/25.
 */
(function($){

    var MODULE_BASE = "health";
    var MODULE_NAME = MODULE_BASE + ".clienthistory";
    var g_data  = []; //模糊查询
    var g_data2 = []; //排序
    var g_count = 0;

    function getRcText(sRcName){
        return Utils.Base.getRcString("terminal_rc", sRcName);
    }

    function initGrid(){

        var opt_clientHistoryHead = {
            colNames:getRcText('clientHistory'),
            showHeader: true,
            multiSelect:false,
            asyncPaging:true,
            pageSize:10,
            onPageChange:function(pageNum,pageSize,oFilter){

                pageSize = 5;
                var valueOfskipnum=(parseInt(pageNum-1))*(parseInt(pageSize));
                var valueOflimitnum=pageSize;


                getClientHistory(valueOfskipnum,valueOflimitnum,oFilter);
            },
            onSearch:function(oFilter){

                var Data = g_data;
                var number = 0;
                if(Data.length == 0){
                    return;
                }

                if( oFilter ==  null){
                    $("#clientHistory_slist").SList("refresh",g_data);
                    g_data2 = g_data;
                    return;
                }

                var filterData_time = new Array();
                var filterData_Mac = new Array();
                var filterData_Ip = new Array();
                var filterData_Ssid = new Array();
                var filterData_ApName = new Array();
                var filterData_Type = new Array();
                var filterData_Reason = new Array();

                if(oFilter.time){
                    var reg_time = new RegExp(oFilter.time);

                    for( var i = 0, l = Data.length ; i < l ; i++){
                       if( reg_time.test(Data[i].time) == true){
                           filterData_time.push(Data[i]);
                       }
                    }
                    //刷新列表过滤数据
                    $("#clientHistory_slist").SList("refresh",filterData_time);
                    g_data2 = filterData_time;
                }
                else
                {
                    filterData_time = Data;
                    g_data2 = filterData_time;
                    ++number;
                }

                if(filterData_time.length == 0){
                    return;
                }

                if(oFilter.MacAddress){
                    var reg_Mac = new RegExp(oFilter.MacAddress);

                    for( var i = 0, l = filterData_time.length ; i < l ; i++){
                        if( reg_Mac.test(filterData_time[i].MacAddress) == true){
                            filterData_Mac.push(filterData_time[i]);
                        }
                    }
                    //刷新列表过滤数据
                    $("#clientHistory_slist").SList("refresh",filterData_Mac);
                    g_data2 = filterData_Mac;
                }
                else
                {
                    filterData_Mac = filterData_time;
                    g_data2 = filterData_Mac;
                    ++number;
                }

                if( filterData_Mac.length == 0){
                    return;
                }

                if( oFilter.IpAddress){
                    var reg_Ip = new RegExp(oFilter.IpAddress);

                    for(var i = 0, l = filterData_Mac.length ; i < l ; i++){
                        if( reg_Ip.test(filterData_Mac[i].IpAddress) == true){
                            filterData_Ip.push(filterData_Mac[i]);
                        }
                    }
                    //刷新列表过滤数据
                    $("#clientHistory_slist").SList("refresh",filterData_Ip);
                    g_data2 = filterData_Ip;
                }else
                {
                    filterData_Ip = filterData_Mac;
                    g_data2 = filterData_Ip;
                    ++number;
                }

                if( filterData_Ip.length == 0){
                    return;
                }

                if( oFilter.Ssid){
                    var reg_Ssid = new RegExp(oFilter.Ssid);

                    for(var i = 0, l = filterData_Ip.length ; i < l ; i++){
                        if( reg_Ssid.test(filterData_Ip[i].Ssid) == true){
                            filterData_Ssid.push(filterData_Ip[i]);
                        }
                    }
                    //刷新列表过滤数据
                    $("#clientHistory_slist").SList("refresh",filterData_Ssid);
                    g_data2 = filterData_Ssid;
                }
                else
                {
                    filterData_Ssid = filterData_Ip;
                    g_data2 = filterData_Ssid;
                    ++number;
                }

                if( filterData_Ssid.length == 0){
                    return;
                }

                if( oFilter.ApName){
                    var reg_ApName = new RegExp(oFilter.ApName);

                    for(var i = 0, l = filterData_Ssid.length ; i < l ; i++){
                        if( reg_ApName.test(filterData_Ssid[i].ApName) == true){
                            filterData_ApName.push(filterData_Ssid[i]);
                        }
                    }
                    //刷新列表过滤数据
                    $("#clientHistory_slist").SList("refresh",filterData_ApName);
                    g_data2 = filterData_ApName;
                }
                else
                {
                    filterData_ApName = filterData_Ssid;
                    g_data2 = filterData_ApName;
                    ++number;
                }

                if( filterData_ApName.length == 0){
                    return;
                }

                if( oFilter.type){
                    var reg_Type = new RegExp(oFilter.type);

                    for(var i = 0, l = filterData_ApName.length ; i < l ; i++){
                        if( reg_Type.test(filterData_ApName[i].type) == true){
                            filterData_Type.push(filterData_ApName[i]);
                        }
                    }
                    //刷新列表过滤数据
                    $("#clientHistory_slist").SList("refresh",filterData_Type);
                    g_data2 = filterData_Type;
                }
                else
                {
                    filterData_Type = filterData_ApName;
                    g_data2 = filterData_Type;
                    ++number;
                }

                if( filterData_Type.length == 0){
                    return;
                }

                if( oFilter.reason){
                    var reg_reason = new RegExp(oFilter.reason);

                    for(var i = 0, l = filterData_Type.length ; i < l ; i++){
                        if( reg_reason.test(filterData_Type[i].reason) == true){
                            filterData_Reason.push(filterData_Type[i]);
                        }
                    }
                    //刷新列表过滤数据
                    $("#clientHistory_slist").SList("refresh",filterData_Reason);
                    g_data2 = filterData_Reason
                }
                else
                {
                   if( number == 6){
                       //刷新列表过滤数据
                       $("#clientHistory_slist").SList("refresh",g_data);
                       g_data2 = g_data;
                   }
                }
            },
            onSort:function(sName,isDesc){

                if( g_count == 0) //升序排序
                {
                    var data = g_data2;
                    data.sort(compare("time"));
                    $("#clientHistory_slist").SList("refresh",data);
                    g_count = 1;
                }
                else if( g_count == 1) //降序排序
                {
                    var data2 = g_data2;
                    data2.sort(compare2("time"));
                    $("#clientHistory_slist").SList("refresh",data2);
                    g_count = 0;
                }

                function compare(prob){
                    return function(obj1,obj2){
                        var val1 = obj1[prob];
                        var val2 = obj2[prob];

                        if(val1 > val2)
                        {
                            return 1;
                        }
                        else if( val1 < val2)
                        {
                            return -1;
                        }
                        else
                        {
                            return 0;
                        }
                    }
                }

                function compare2(prob){
                    return function(obj1,obj2){
                        var val1 = obj1[prob];
                        var val2 = obj2[prob];

                        if( val1 > val2)
                        {
                            return -1;
                        }
                        else if( val1 < val2)
                        {
                            return 1;
                        }
                        else
                        {
                            return 0;
                        }
                    }
                }

            },
            colModel:[
                {name:"time",datatype:"String",width:110},
                {name:"MacAddress",datatype:"String",width:80},
                {name:"IpAddress",datatype:"String",width:80},
                {name:"Ssid",datatype:"String",width:70},
                {name:"ApName",datatype:"String",width:80},
                {name:"type",datatype:"String",width:60},
                {name:"reason",datatype:"String",width:80}
            ]
        };
        $("#clientHistory_slist").SList("head",opt_clientHistoryHead);
    }


    /*获取终端上下线历史*/
    function getClientHistory(valueOfskipnum,valueOflimitnum,oFilter){

        var url = MyConfig.path +"/diagnosis_read/history/clienthistory?devSN="+FrameInfo.ACSN;
        var queryData = "&startNum=" + valueOfskipnum + "&skipNum=" + valueOflimitnum;
        url = url + queryData;

        var clientOpt = {
            url: url,
            type:'get',
            dataType:'json',
            onSuccess:getClientHistorySuc,
            onFailed:getClientHistoryFail
        };

        Utils.Request.sendRequest(clientOpt);

        /*获取数据成功的回调*/
        function getClientHistorySuc(data){

            initClientHistory(data,oFilter);
        }

        /*获取数据失败的回调*/
        function getClientHistoryFail(){

        }
    }

    /*将终端上下线历史显示到页面上*/
    function initClientHistory(data,oFilter){
        var totalCount = data.count || 0;
        data = data.arr || [];
        var clientHistoryData_UpLine = [];
        var clientHistoryData_offLine = [];
        var j = 0;
        var clientData = [];

        for( var i = 0; i< data.length;i++,++j){

            clientHistoryData_UpLine[i] = {};
            clientHistoryData_UpLine[i].time = data[i].upLineDate.split("T")[0]+" "+data[i].upLineDate.split("T")[1].split("Z")[0];
            clientHistoryData_UpLine[i].MacAddress = data[i].clientMAC;
            clientHistoryData_UpLine[i].IpAddress = data[i].clientIP;
            clientHistoryData_UpLine[i].Ssid = data[i].clientSSID;
            clientHistoryData_UpLine[i].ApName = data[i].ApName;
            clientHistoryData_UpLine[i].type = "上线";
            clientHistoryData_UpLine[i].reason = "";

            clientHistoryData_offLine[i] = {};
            clientHistoryData_offLine[i].time = data[i].offLineDate.split("T")[0]+" "+data[i].offLineDate.split("T")[1].split("Z")[0];
            clientHistoryData_offLine[i].MacAddress = data[i].clientMAC;
            clientHistoryData_offLine[i].IpAddress = data[i].clientIP;
            clientHistoryData_offLine[i].Ssid = data[i].clientSSID;
            clientHistoryData_offLine[i].ApName = data[i].ApName;
            clientHistoryData_offLine[i].type = "下线";
            clientHistoryData_offLine[i].reason = "";

            clientData[j] = clientHistoryData_UpLine[i];
            clientData[++j] = clientHistoryData_offLine[i];
        }
        //赋值给全局数组，为了以后模糊查询
        g_data = clientData;

        if( oFilter == null )
        {
            $("#clientHistory_slist").SList("refresh",{data:clientData,total:totalCount*2});
            g_data2 = clientData;
            return;
        }

        //如果有过滤条件的话进行过滤处理
        var clientData_time   = new Array();
        var clientData_mac    = new Array();
        var clientData_ip     = new Array();
        var clientData_ssid   = new Array();
        var clientData_apName = new Array();
        var clientData_type   = new Array();
        var clientData_reason = new Array();

        //过滤时间
        if(oFilter.time)
        {
            var reg_time = new RegExp(oFilter.time);

            for(var i = 0, l = clientData.length ; i < l ; i++){
                if( reg_time.test(clientData[i].time) == true){
                    clientData_time.push(clientData[i]);
                }
            }
            g_data2 = clientData_time;
        }
        else
        {
            clientData_time = clientData;
            g_data2 = clientData_time;
        }

        if( clientData_time.length == 0)
        {
            return;
        }

        //过滤mac地址
        if(oFilter.MacAddress)
        {
            var reg_mac = new RegExp(oFilter.MacAddress);

            for(var i = 0, l = clientData_time.length ; i < l ; i++){
                if( reg_mac.test(clientData_time[i].MacAddress) == true){
                    clientData_mac.push(clientData_time[i]);
                }
            }
            g_data2 = clientData_mac;
        }
        else
        {
            clientData_mac = clientData_time;
            g_data2 = clientData_mac;
        }

        if( clientData_mac.length == 0)
        {
            return;
        }

        //过滤ip地址
        if(oFilter.IpAddress)
        {
            var reg_ip = new RegExp(oFilter.IpAddress);

            for(var i = 0, l = clientData_mac.length ; i < l ; i++){
                if( reg_ip.test(clientData_mac[i].IpAddress) == true){
                    clientData_ip.push(clientData_mac[i]);
                }
            }
            g_data2 = clientData_ip;
        }
        else
        {
            clientData_ip = clientData_mac;
            g_data2 = clientData_ip;
        }

        if( clientData_ip.length == 0)
        {
            return;
        }

        //过滤Ssid
        if(oFilter.Ssid)
        {
            var reg_ssid = new RegExp(oFilter.Ssid);

            for(var i = 0, l = clientData_ip.length ; i < l ; i++){
                if( reg_ssid.test(clientData_ip[i].Ssid) == true){
                    clientData_ssid.push(clientData_ip[i]);
                }
            }
            g_data2 = clientData_ssid;
        }
        else
        {
            clientData_ssid = clientData_ip;
            g_data2 = clientData_ssid;
        }

        if( clientData_ssid.length == 0)
        {
            return;
        }


        //过滤ApName
        if(oFilter.ApName)
        {
            var reg_apName = new RegExp(oFilter.ApName);

            for(var i = 0, l = clientData_ssid.length ; i < l ; i++){
                if( reg_apName.test(clientData_ssid[i].ApName) == true){
                    clientData_apName.push(clientData_ssid[i]);
                }
            }
            g_data2 = clientData_apName;
        }
        else
        {
            clientData_apName = clientData_ssid;
            g_data2 = clientData_apName;
        }

        if( clientData_apName.length == 0)
        {
            return;
        }

        //过滤type
        if(oFilter.type)
        {
            var reg_type = new RegExp(oFilter.type);

            for(var i = 0, l = clientData_apName.length ; i < l ; i++){
                if( reg_type.test(clientData_apName[i].type) == true){
                    clientData_type.push(clientData_apName[i]);
                }
            }
            g_data2 = clientData_apName;
        }
        else
        {
            clientData_type = clientData_apName;
            g_data2 = clientData_apName;
        }

        if( clientData_type.length == 0)
        {
            return;
        }

        //过滤reason
        if(oFilter.reason)
        {
            var reg_reason = new RegExp(oFilter.reason);

            for(var i = 0, l = clientData_type.length ; i < l ; i++){
                if( reg_reason.test(clientData_type[i].reason) == true){
                    clientData_reason.push(clientData_type[i]);
                }
            }
            g_data2 = clientData_reason;
        }
        else
        {
            clientData_reason = clientData_type;
            g_data2 = clientData_reason;
        }

        if( clientData_reason.length == 0)
        {
            return;
        }

        //赋值给全局数组，为了排序
        g_data2 = clientData_reason;

        $("#clientHistory_slist").SList("refresh",{data:clientData_reason,total:totalCount*2});
    }

    function initData(){

        var skipnum = 0;
        var pagesize = 5;
        getClientHistory(skipnum,pagesize,{});
    }

    function _init(){

        initGrid();
        initData();
    }

    function _destroy()
    {
        Utils.Request.clearMoudleAjax(MODULE_NAME);
    }

    Utils.Pages.regModule (MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["SList","Echart","Form"],
        "utils": ["Base","Request"]
    });

})(jQuery);