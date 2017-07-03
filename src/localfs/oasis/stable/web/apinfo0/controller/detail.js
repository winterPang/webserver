define(['echarts','jquery','utils','angular-ui-router','bsTable'], function(ecahrts,$,Utils) {
    return ['$scope', '$http', '$alertService', '$state', function($scope, $http){

        // get url 
        var url_ApStatus = Utils.getUrl('GET','','/apmonitor/getApCountByStatus','/init/apinfo2/get_apstatus_count.json');
        var url_ApgroupList = Utils.getUrl('GET','','/apmonitor/getApCountAndDescByGroup','/init/apinfo2/get_apGroup.json');
        var url_ApModel = Utils.getUrl('GET','','/apmonitor/getApCountByModel','/init/apinfo2/get_apmodel.json');
        var url_ApClient = Utils.getUrl('GET','','/stamonitor/getapstaticbyclientnum','init/apinfo2/get_apclientnum.json');
        var url_ApType = Utils.getUrl('GET','','/apmonitor/getApCountByMethod','/init/apinfo2/get_aptype.json');
        var url_ApInfoByGroup = Utils.getUrl('POST','','/apmonitor/aplistbygroup','/init/apinfo2/get_aptype.json');
        var url_ApInfoByType = Utils.getUrl('POST','','/apmonitor/getApCountByMethodForApList','/init/apinfo2/get_aptype.json');
        var url_ApInfoByClient = Utils.getUrl('POST','','/apmonitor/getapstaticbyclientnumforaplist','/init/apinfo2/get_aptype.json');

        //tool Function
        function getRcString(attrName){
            return Utils.getRcString("apinfo_rc",attrName).split(',');
        }
        $scope.apInfoByGroupOption ={
            mId:'apInfoByGroup',
            title:getRcString('AP_LIST')[0],
            autoClose: true ,
            showCancel: false ,
            showOk:false,
            modalSize:'lg' ,
            showHeader:true   ,
            showFooter:false  ,
            showClose:true
        }

        $scope.apInfoByClientList ={
            tId:'apInfoByClientList',
            method:"post",
            contentType:'application/json',
            dataType:'json',
            pageSize:5,
            pageList:[5,10,15],
            apiVersion:'v3',
            searchable:true,
            sidePagination:'server',
            dataField:'apList',
            totalField:'totalCount',
            columns: [
                {searcher:{},sortable: true, field: 'apName', title: getRcString("ap_info_type")[0]},
                {searcher:{},sortable: true, field: 'apModel', title:  getRcString("ap_info_type")[1]},
                {searcher:{},sortable: true, field: 'clientCount', title: getRcString("ap_info_type")[2]}
            ]
        };

        $scope.apInfoByClientOption ={
            mId:'apInfoByClient',
            title:getRcString('AP_LIST')[0],
            autoClose: true ,
            showCancel: false ,
            showOk:false,
            modalSize:'lg' ,
            showHeader:true   ,
            showFooter:false  ,
            showClose:true
        };

        $scope.apInfoByTypeList ={
            tId:'apInfoByTypeList',
            method:"post",
            contentType:'application/json',
            dataType:'json',
            pageSize:5,
            pageList:[5,10,15],
            apiVersion:'v3',
            searchable:true,
            sidePagination:'server',
            dataField:'apList',
            totalField:'totalCount',
            columns: [
                {searcher:{},sortable: true, field: 'apName', title: getRcString("ap_info_client")[0]},
                {searcher:{},sortable: true, field: 'apModel', title:  getRcString("ap_info_client")[1]}
            ]
        };

        $scope.apInfoByTypeOption ={
            mId:'apInfoByType',
            title:getRcString('AP_LIST')[0],
            autoClose: true ,
            showCancel: false ,
            showOk:false,
            modalSize:'lg' ,
            showHeader:true   ,
            showFooter:false  ,
            showClose:true
        }

        function drawEmptyPie(jEle)
        {
            var oTheme={color : ["rgba(216, 216, 216, 0.75)"]};
            var piechart =echarts.init(document.getElementById(jEle),oTheme);
            var option = {
                height:245,
                calculable : false,
                series : [
                    {
                        type:'pie',
                        radius : '65%',
                        center: ['25%', '35%'],
                        itemStyle: {
                            normal: {
                                // borderColor:"#FFF",
                                // borderWidth:1,
                                labelLine:{
                                    show:false
                                },
                                label:
                                {
                                    position:"inner"
                                }
                            }
                        },
                        data: [{name:'N/A',value:1}]
                    }
                ]
            };

            piechart.setOption(option);
        }

        function terminal(aData)
        {
            var oTheme={
                color: ['#E7E7E9','#4fcff6','#78cec3','#4EC1B2','#fbceb1','#f9ab77','#ff9c9e','#fe808b']
            };
            var piechart =echarts.init(document.getElementById("According_client"),oTheme);

            function clickEvent(param){
                $scope.clientNum = param.data&&param.data.name;
                $scope.apNum = param.data&&param.data.value;
                $scope.$broadcast('show#apInfoByClient');
                //url_ApInfoByClient
                var clientNumLeft,clientNumRight;
                if(param.name == "0"){
                    clientNumLeft = 0;
                    clientNumRight = 0;
                }else if(param.name.split('~').length > 0){
                    clientNumLeft = param.name.split('~')[0];
                    clientNumRight = param.name.split('~')[1];
                }else{
                    clientNumLeft = 101;
                    clientNumRight = -1;
                }
                $scope.$broadcast('hideSearcher#apInfoByClientList',false);  //  实现了搜索表头的折叠
                $scope.$broadcast('refresh#apInfoByClientList',{
                    url:url_ApInfoByClient.url+"?devSN="+$scope.sceneInfo.sn+"&clientNumLeft="+
                    clientNumLeft+"&clientNumRight="+clientNumRight
                });
            }

            //define click EVENT
            piechart.on(echarts.config.EVENT.CLICK, clickEvent);

            var dataStyle = {
                normal: {
                    label : {
                        show: false,
                        position: 'inner',
                        formatter: '{d}%'
                    },
                    labelLine:{
                        show:false
                    },
                    borderColor:'#FFF',
                    borderWidth:1
                }
            };

            var option = {
                height:245,
                tooltip : {
                    trigger: 'item',
                    formatter: "{b} : {c} ({d}%)"
                },
                legend: {
                    orient : 'vertical',
                    x:'25%',
                    y:'18%',
                    data:['0','1~10','11~20','21~40',"",'41~60','61~80','81~100','101以上']
                },
                calculable : false,
                series : [
                    {
                        type:'pie',
                        radius : ['37%','55%'],
                        center: ['80%', '35%'],
                        itemStyle : dataStyle,
                        data:aData
                    }
                ]
            };

            piechart.setOption(option);
        }

        function ApType_pie(aInData)
        {
            var oTheme={
                color: ['#4EC1B2','#78CEC3','#D2D2D2','#E7E7E9','#ABD6F5','#86C5F2','#63B4EF','#3DA0EB','#1683D3','#136FB3']
            };

            var piechart =echarts.init(document.getElementById("ApType_pie"),oTheme);

            function clickEvent(param){
                $scope.apType = param.data&&param.data.name;
                $scope.aptTypeNum = param.data&&param.data.value;
                $scope.$broadcast('show#apInfoByType');
                //url_ApInfoByType
                $scope.$broadcast('hideSearcher#apInfoByTypeList',false);  //  实现了搜索表头的折叠
                $scope.$broadcast('refresh#apInfoByTypeList',{
                    url:url_ApInfoByType.url+"?devSN="+$scope.sceneInfo.sn+
                    "&CreateMethod="+param.data.CreateMethod

                });
            }

            //define click EVENT
            piechart.on(echarts.config.EVENT.CLICK, clickEvent);

            var dataStyle = {
                normal: {
                    label : {
                        show: false,
                        position: 'inner',
                        formatter: '{d}%'
                    },
                    labelLine:{
                        show:false
                    },
                    borderColor:'#FFF',
                    borderWidth:1
                }
            };

            var option = {
                height:245,
                width:'100%',
                tooltip : {
                    trigger: 'item',
                    formatter: "{b} :<br/> {c} ({d}%)"
                },
                legend: {
                    orient : 'vertical',
                    x :'25%',
                    y:'18%',
                    // padding: 260,
                    data:getRcString('apType')/*['在线的手工AP','自动AP','离线的手工AP','未认证的AP']*/
                },
                calculable : false,
                series : [
                    {
                        type:'pie',
                        radius : ['37%','55%'],
                        center: ['80%', '35%'],
                        itemStyle : dataStyle,
                        data:aInData
                    }
                ]

            };
            var oTheme={
                color: ['#4EC1B2','#78CEC3','#D2D2D2','#E7E7E9','#ABD6F5','#86C5F2','#63B4EF','#3DA0EB','#1683D3','#136FB3']
            };

            piechart.setOption(option);
        }

        function getApCount()
        {
            http_getApCountByStatus(function (data) {
                if (data != ""){
                    var tempdata = data.ap_statistic;
                    $scope.unhealth_ap = tempdata.other;
                    $scope.online_ap = tempdata.online;
                    $scope.offline_ap = tempdata.offline;
                }
            });
        }

        function getClientNum()
        {
            http_getClientNum(function (data) {
                if (data != ""){
                    var tempdata = data.statistics;
                    if(data.totalCount==0){
                        drawEmptyPie("According_client");
                        return;
                    }
                    else{
                        var datas = data.statistics;
                        var type = [
                            {name:getRcString('apClientType')[0],value : (datas[0].count==0)?undefined:datas[0].count},
                            {name:getRcString('apClientType')[1],value : (datas[1].count==0)?undefined:datas[1].count},
                            {name:getRcString('apClientType')[2],value : (datas[2].count==0)?undefined:datas[2].count},
                            {name:getRcString('apClientType')[3],value : (datas[3].count==0)?undefined:datas[3].count},
                            {name:getRcString('apClientType')[5],value : (datas[4].count==0)?undefined:datas[4].count},
                            {name:getRcString('apClientType')[6],value : (datas[5].count==0)?undefined:datas[5].count},
                            {name:getRcString('apClientType')[7],value : (datas[6].count==0)?undefined:datas[6].count},
                            {name:getRcString('apClientType')[8],value : (datas[7].count==0)?undefined:datas[7].count}
                        ];
                        terminal(type);
                    }
                }
            });
        }
        
        function getTypeNum()
        {
            http_getApType(function (data) {
                if (data != ""){
                    if(data.apList.length==0){
                        drawEmptyPie("ApType_pie");
                        return;
                    }
                    else{
                        var datas = data.apList;
                        var aType2 = [
                            {   name:getRcString('apType')[0],
                                value:(datas[0].ApCount==0)?undefined:datas[0].ApCount,
                                CreateMethod:datas[0].CreateMethod
                            },
                            {
                                name:getRcString('apType')[1],
                                value:(datas[1].ApCount==0)?undefined:datas[1].ApCount,
                                CreateMethod:datas[1].CreateMethod
                            },
                            {
                                name:getRcString('apType')[2],
                                value:(datas[2].ApCount==0)?undefined:datas[2].ApCount,
                                CreateMethod:datas[2].CreateMethod
                            },
                            {
                                name:getRcString('apType')[3],
                                value:(datas[3].ApCount==0)?undefined:datas[3].ApCount,
                                CreateMethod:datas[3].CreateMethod
                            }
                        ];
                        ApType_pie(aType2);
                    }
                }
            });
        }
        
        function http_getApCountByStatus(cBack)
        {
            $http({
                method:url_ApStatus.method,
                url:url_ApStatus.url,
                params:{'devSN':$scope.sceneInfo.sn}
            }).success(function(data){
                cBack(data);
            }).error(function(data){
                cBack("");
            });
        }

        function http_getClientNum(cBack)
        {
            $http({
                method:url_ApClient.method,
                url:url_ApClient.url,
                params:{'devSN':$scope.sceneInfo.sn}
            }).success(function(data){
                cBack(data);
            }).error(function(data){
                cBack("");
            });
        }
        
        function http_getApType(cBack)
        {
            $http({
                method:url_ApType.method,
                url: url_ApType.url,
                params:{'devSN':$scope.sceneInfo.sn}
            }).success(function(data){
                cBack(data);
            }).error(function(data){
                cBack("");
            });
        }
        //init
        function init(){
            getApCount();
            getClientNum();
            getTypeNum();
        };

        init();
         $http({
            method:"get",
            url:'/v3/apmonitor/aplist_page',
            params:{
                devSN:$scope.sceneInfo.sn,
                skipnum:0,
                limitnum:100
            }
        }).success(function (data){
            angular.forEach(data.apList,function (item,index,array){
                var radio_item =[];
                $.each(item.radioList,function(key,value){
                     radio_item.push(value.radioMode+"Hz("+value.radioId+")");
                     item.radioItem = radio_item;
                });
                
                item.onlineTime = item.onlineTime;
                switch(item.status){
                    case 1:
                        item.apStatus = getRcString('AP_LIST')[1];
                        break;
                    case 2:
                        item.apStatus = getRcString('AP_LIST')[2];
                        break;
                    case 3:
                        item.apStatus = getRcString('AP_LIST')[3];
                        break;
                    default:
                        item.apStatus = getRcString('AP_LIST')[4];
                        break;
                };
                item.transmit_receive_Traffic = parseInt(item.transmitTraffic) + " / " + parseInt(item.receiveTraffic);
            });
            $scope.$broadcast('load#base',data.apList||[]);
        });
        $scope.tableOptions = {
            tId: 'base',
            columns: [
                {title: getRcString('AP_NAME')[0],field:'apName',sortable:true,render: '<a class="list-link">{apName}</a>'},
                {title: getRcString('AP_NAME')[1],field:'apModel',sortable:true},
                {title: getRcString('AP_NAME')[2],field:'apSN',sortable:true},
                {title: getRcString('AP_NAME')[3],field:'apGroupName',sortable:true},
                {title: getRcString('AP_NAME')[4],field:'radioItem',sortable:true},
                {title: getRcString('AP_NAME')[5],field:'onlineTime',sortable:true},
                {title: getRcString('AP_NAME')[6],field:'clientCount',sortable:true}
            ],
            onClickCell:function(field,val,row,$td){
                $scope.modalData = row;
                $scope.showModal();
            }
        };
        $scope.modalOptions = {
            mId:'apDetail',
            title:getRcString('AP_LIST')[5],
            modalSize:'lg',
            showFooter:false
        };
        $scope.showModal = function (){
            $scope.$broadcast('show#apDetail');
        };
    }]
});

