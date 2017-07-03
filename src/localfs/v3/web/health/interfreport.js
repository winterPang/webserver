(function($){

    var MODULE_BASE = "health";
    var MODULE_NAME = MODULE_BASE + ".interfreport";


    function getRcText(sRcId){
        return Utils.Base.getRcString("interfreport_rc",sRcId);
    }

    function getRcString(sRcId,sRcName){
        return  $("#" + sRcId).attr(sRcName);
    }


    /*获取干扰设备报告的数据*/
    function getInterfReportData(date){

        var interfReportFlowOpt = {
            url:MyConfig.path +"/diagnosis_read/web/interfReport?devSN="+FrameInfo.ACSN,
            type:'post',
            dataType:'json',
            data:{
                date:date
            },
            onSuccess:getInterfReportFlowSuc,
            onFailed:getInterfReportFlowFail
        };

        Utils.Request.sendRequest(interfReportFlowOpt);

        /*获取干扰设备报告成功的回调*/
        function getInterfReportFlowSuc(data){

            analyseInterfereReport_Data(data,date);

        }

        /*获取干扰设备报告失败的回调*/
        function getInterfReportFlowFail(){

        }
    }

    /*解析当前日期干扰设备报告返回的数据*/
    function analyseInterfereReport_Data(data,date){
        var deviceReportData;
        var RdIntfDevInfo;
        var f = 0;
        var h = 0;
        var interfereReportData = [];
        var Chls = [];
        try {
            for (var i = 0; i < data.length; i++) {
                interfereReportData[f] = {};
                interfereReportData[f].ApName = data[i].ApName;
                interfereReportData[f].RadioType = data[i].RadioType;
                deviceReportData = data[i].deviceReportData;
                for (var j = 0; j < deviceReportData.length; j++) {
                    RdIntfDevInfo = deviceReportData[j].RdIntfDevInfo;
                    interfereReportData[f].DbID = RdIntfDevInfo.DbID;
                    interfereReportData[f].SignalStr = RdIntfDevInfo.SignalStr;
                    for (var k = 0; k < RdIntfDevInfo.Chls.length; k++) {
                        if(RdIntfDevInfo.Chls[k].Chl != 0) {
                            Chls[h] = RdIntfDevInfo.Chls[k].Chl;
                            h++;
                        }
                    }
                    interfereReportData[f].Chls = JSON.stringify(Chls);
                    f++;
                }
            }
        }catch(exception){

        }

        if( interfereReportData.length != 0) {

            /*有干扰设备的情况下，显示AC、AP和干扰设备之间的关系拓扑图*/

            drawTopo(interfereReportData);
        }
        else
        {

            /*无干扰设备的情况下，只显示AC、AP之间的关系拓扑图*/

            getQualityReportData(date);
        }
    }

    /*有干扰设备情况下的拓扑图*/
    function drawTopo(data){

        var canvas = document.getElementById('canvas');
        var stage = new JTopo.Stage(canvas);
        var scene = new JTopo.Scene(stage);

        var AC = createNode(300,80,'ac.png',FrameInfo.ACSN);
        AC.dragable = false;
        var AP = createNode(150, 300, 'ap.jpg',data[0].ApName);
        AP.dragable = false;
        linkNode(AC, AP);

        var x = 110;
        var y = 80;
        var num_ap = 1;
        var num_interf = 0;
        for(var i = 0; i< data.length; i++) {
            if( (num_ap < 6) && (num_interf < 8)) {
                if (i == 0) {
                    var interfDevice = data[i].DbID;
                    var infos = {};
                    infos.Chls = data[i].Chls;
                    infos.RadioType = data[i].RadioType;
                    infos.SignalStr = data[i].SignalStr;

                    if (interfDevice == "Bluetooth devices") {
                        var Bluetooth = createNode(150, 500, 'blue.png', getRcText("find"));
                        num_interf++;
                        Bluetooth.dragable = false;
                        linkDotNode(AP, Bluetooth);

                        Bluetooth.click(function () {
                            var text = analyseInterfInfos(infos);
                            Frame.Msg.alert(text);
                        });
                    }
                    else if (interfDevice == "Microwave ovens") {
                        var wave = createNode(150, 500, 'microwave.jpg', getRcText("find"));
                        num_interf++;
                        wave.dragable = false;
                        linkDotNode(AP, wave);

                        wave.click(function () {
                            var text2 = analyseInterfInfos(infos);
                            Frame.Msg.alert(text2);
                        })
                    }
                }
                else {
                    if (data[i].ApName == data[i - 1].ApName) {
                        var interfdevice = data[i].DbID;
                        var infoss = {};
                        infoss.Chls = data[i].Chls;
                        infoss.RadioType = data[i].RadioType;
                        infoss.SignalStr = data[i].SignalStr;

                        if (interfdevice == "Bluetooth devices") {
                            var Blue = createNode(150 + y, 500, 'blue.png', getRcText("find"));
                            num_interf++;
                            y = y + 80;
                            Blue.dragable = false;
                            linkDotNode(AP, Blue);

                            Blue.click(function () {
                                var text3 = analyseInterfInfos(infoss);
                                Frame.Msg.alert(text3);
                            })
                        }
                        else if (interfdevice == "Microwave ovens") {
                            var wave2 = createNode(150 + y, 500, 'microwave.jpg', getRcText("find"));
                            num_interf++;
                            y = y + 80;
                            wave2.dragable = false;
                            linkDotNode(AP, wave2);

                            wave2.click(function () {
                                var text4 = analyseInterfInfos(infoss);
                                Frame.Msg.alert(text4);
                            })
                        }
                    }
                    else {
                        AP = createNode(150 + x, 300, 'ap.jpg', data[i].ApName);
                        x = x + 110;
                        num_ap++;
                        AP.dragable = false;
                        linkNode(AC, AP);

                        var device = data[i].DbID;
                        var infosss = {};
                        infosss.Chls = data[i].Chls;
                        infosss.RadioType = data[i].RadioType;
                        infosss.SignalStr = data[i].SignalStr;

                        if (device == "Bluetooth devices") {
                            var Blue2 = createNode(150 + y, 500, 'blue.png', getRcText("find"));
                            num_interf++;
                            y = y + 80;
                            Blue2.dragable = false;
                            linkDotNode(AP, Blue2);

                            Blue2.click(function () {
                                var text5 = analyseInterfInfos(infosss);
                                Frame.Msg.alert(text5);
                            })
                        }
                        else if (device == "Microwave ovens") {
                            var wave3 = createNode(150 + y, 500, 'microwave.jpg', getRcText("find"));
                            num_interf++;
                            y = y + 80;
                            wave3.dragable = false;
                            linkDotNode(AP, wave3);

                            wave3.click(function () {
                                var text6 = analyseInterfInfos(infosss);
                                Frame.Msg.alert(text6);
                            })
                        }
                    }
                }
            }
            else
            {
                var more = createNode(150 + x,320,'more.jpg');
                more.dragable = false;
                var more2 = createNode(150+y,520,'more.jpg');
                more2.dragable = false;
                break;
            }
        }

        /*创建节点*/
        function createNode(x,y,img,text){
            var node  = new JTopo.Node(text);
            node.fontColor = "0,0,0";
            if( text == getRcText("find")){
                node.textPosition = "Bottom_Center";
                node.font="10px Consolas";
            }
            else
            {
                node.textPosition = "Top_Center";
                node.font = "16px Consolas";
            }
            node.setImage('../health/css/'+img, true);
            node.setLocation(x,y);
            scene.add(node);
            return node;
        }

        /*节点连线,实线*/
        function linkNode(nodeA,nodeB,f){
            var link;
            if(f){
                link = new JTopo.FoldLink(nodeA, nodeB);
            }else{
                link = new JTopo.Link(nodeA, nodeB);
            }
            link.direction = 'vertical';
            scene.add(link);
            return link;
        }

        /*节点连线，虚线*/
        function linkDotNode(nodeA,nodeB,f){
            var link;
            if(f){
                link = new JTopo.FoldLink(nodeA, nodeB);
            }else{
                link = new JTopo.Link(nodeA, nodeB);
            }
            link.direction = 'vertical';
            link.dashedPattern = 5;
            link.strokeColor = '0,200,255';
            scene.add(link);
            return link;
        }

        /*解析干扰设备弹出框的相关信息*/
        function analyseInterfInfos(data){

            var chls = data.Chls;

            chls = unique(JSON.parse(chls));

            var text = getRcText("chanel") + chls +" ，" + getRcText("rssi") + data.SignalStr + "dB" +" ， "+ getRcText("radioType") + data.RadioType;
            return text;
        }
    }

    /*获取空口质量报告数据，显示AP,AC之间的关系*/
    function getQualityReportData(date){

        var reportFlowOpt = {
            url:MyConfig.path + '/diagnosis_read/web/report?devSN='+FrameInfo.ACSN,
            type:'post',
            dataType:'json',
            data:{
                date:date
            },
            onSuccess:getReportFlowSuc,
            onFailed:getReportFlowFail
        };

        Utils.Request.sendRequest(reportFlowOpt);
    }

    /*获取空口质量报告数据成功的回调*/
    function getReportFlowSuc(data){

        analyseQualityReport_Data(data);
    }

    /*获取空口质量报告数据失败的回调*/
    function getReportFlowFail(){

    }

    /*解析后台返回的当前日期的空口质量报告数据*/
    function analyseQualityReport_Data(data) {
        var apName = [];
        var apreport = data.apreport;

        if (apreport.length != 0) {
            for (var i = 0; i < apreport.length; i++) {
                apName[i] = apreport[i].ApName;
            }
        }

        apName = unique(apName);

        drawtopo(apName);
    }

    /*无干扰设备的情况下，只显示AC、AP之间的关系拓扑图*/
    function drawtopo(data){

        var canvas = document.getElementById('canvas');
        var stage = new JTopo.Stage(canvas);
        var scene = new JTopo.Scene(stage);

        var AC = createnode(300,80,'ac.png',FrameInfo.ACSN);
        AC.dragable = false;
        var x = 0;
        var number = 0;

        for(var i =0 ;i< data.length ;i++){
            if( number < 6) {
                var AP = createnode(150 + x, 300, 'ap.jpg', data[i]);
                x = x + 100;
                number++;
                AP.dragable = false;
                linknode(AC, AP);
            }
            else
            {
                var more = createnode(150+x,320,'more.jpg');
                more.dragable = false;
                break;
            }
        }

        /*创建节点*/
        function createnode(x,y,img,text){

            var node  = new JTopo.Node(text);
            node.fontColor = "0,0,0";
            node.textPosition = "Top_Center";
            node.font = "16px Consolas";
            node.setImage('../health/css/'+img, true);
            node.setLocation(x,y);
            scene.add(node);
            return node;
        }

        /*节点连线,实线*/
        function linknode(nodeA,nodeB,f){
            var link;
            if(f){
                link = new JTopo.FoldLink(nodeA, nodeB);
            }else{
                link = new JTopo.Link(nodeA, nodeB);
            }
            link.direction = 'vertical';
            scene.add(link);
            return link;
        }
    }

    /*去掉数组中相同的元素*/
    function unique(arr) {
        var result = [], hash = {};
        for (var i = 0, elem; (elem = arr[i]) != null; i++) {
            if (!hash[elem]) {
                result.push(elem);
                hash[elem] = true;
            }
        }
        return result;
    }


    function _init(oPara){

        getInterfReportData(oPara);

    }

    function _destroy(){

        Utils.Request.clearMoudleAjax(MODULE_NAME);

    }

    Utils.Pages.regModule(MODULE_NAME,{
        "init":_init,
        "destroy": _destroy,
        "widgets": ["Echart"],
        "utils":["Base","Request"]
    });

})(jQuery);