define(['utils','moment','echarts','jquery','bootstrap-daterangepicker','css!bootstrap_daterangepicker_css'],function(Utils,moment,echarts,$) {
    return ['$scope', '$http','$rootScope','$state', function($scope,$http,$rootScope,$state){
        
       function getRcString(attrName){
            return Utils.getRcString("total_rc",attrName);
        }      

        $scope.whatfaka = "g_pv";
        $scope.predate = "";          
        $scope.tenmin = 10 * 60 * 1000;
        $scope.oneHour = $scope.tenmin * 6;
        $scope.oneDay = $scope.oneHour * 24;
        $scope.oneWeek = $scope.oneDay * 7;
        $scope.oneMonth = $scope.oneDay * 30;
        $scope.ongYear = $scope.oneDay * 365;
        $scope.curdate = new Date(new Date().toLocaleDateString());           
        $scope.fundate = "";
        $scope.enddate = "";
        $scope.startdate = "";
        $scope.span = "";

        $('#daterange').daterangepicker(
            {
                startDate: moment().startOf("day"),
                endDate: moment(),
                // maxDate: moment(),
                dateLimit: {year: 2},
                timePicker: true,
                timePicker24Hour: true,
                timePickerSeconds: true,
                opens: "left",
                locale: {
                    format: "YYYY/MM/DD HH:mm:ss",
                    applyLabel : getRcString("DRP_APPLYLABEL"),
                    cancelLabel : getRcString("DRP_CANCELLABEL"),
                    fromLabel : getRcString("DRP_FROMLABEL"),
                    toLabel : getRcString("DRP_TOLABEL"),
                    customRangeLabel : getRcString("DRP_CUSTOMRANGELABEL"),
                    daysOfWeek : getRcString("DRP_DAYSOFWEEK").split(","),
                    monthNames : getRcString("DRP_MONTHNAMES").split(","),
                }
            },
            function(start, end, label) {
                
            }
        );
        
        $scope.chouseUrl = function(mode){           
            if(mode == 1){
                predate = "oneday";
                $scope.fundate = new Date ($scope.curdate - $scope.oneDay);
                $scope.startdate = $scope.fundate.getTime();
                $scope.enddate = $scope.curdate.getTime();
                $scope.span = 3600000;               
                var aUrl = Utils.getUrl('GET','o2o','/oasis/auth-data/o2oportal/advertisement/queryBySpan','/init/total_ad/'+predate+'.json');
            }
            else if(mode == 2){
                predate = "oneweek";
                $scope.fundate = new Date ($scope.curdate - $scope.oneWeek);
                $scope.startdate = $scope.fundate.getTime() - 1000;
                $scope.enddate = $scope.curdate.getTime() - 1000;
                $scope.span = 86400000;
                var aUrl = Utils.getUrl('GET','o2o','/oasis/auth-data/o2oportal/advertisement/queryBySpan','/init/total_ad/'+predate+'.json');
            }
            else if(mode == 3){
                predate = "onemonth";
                $scope.fundate = new Date ($scope.curdate - $scope.oneMonth);
                $scope.startdate = $scope.fundate.getTime() - 1000;
                $scope.enddate = $scope.curdate.getTime() - 1000;
                $scope.span = 86400000;
                var aUrl = Utils.getUrl('GET','o2o','/oasis/auth-data/o2oportal/advertisement/queryBySpan','/init/total_ad/'+predate+'.json');
            }
            else if(mode == 4){
                predate = "oneyear";
                $scope.nextdate = new Date (new Date().getFullYear(),new Date().getMonth(),1);
                $scope.fundate = new Date ($scope.nextdate - $scope.ongYear);
                $scope.fundateNow = new Date ($scope.fundate.getFullYear(),$scope.fundate.getMonth(),1);
                $scope.startdate = $scope.fundateNow.getTime() - 1000;
                $scope.enddate = $scope.nextdate.getTime() - 1000;
                $scope.span = 2592000000;
                var aUrl = Utils.getUrl('GET','o2o','/oasis/auth-data/o2oportal/advertisement/queryByMonthSpan','/init/total_ad/'+predate+'.json');
            } 
            else if(mode == ""){
                $scope.StartValue = $("input[name='daterangepicker_start']").val();
                $scope.EndValue = $("input[name='daterangepicker_end']").val();
                $scope.startdate = new Date($scope.StartValue).getTime();
                $scope.enddate = new Date($scope.EndValue).getTime();
                $scope.span = 2592000000;
                var aUrl = Utils.getUrl('GET','o2o','/oasis/auth-data/o2oportal/advertisement/queryByMonthSpan','/init/total_ad/'+predate+'.json');
            }                  

            $http({
                url:aUrl.url,
                method:aUrl.method,
                params:{
                    startTime:$scope.startdate,
                    endTime:$scope.enddate,
                    span:$scope.span,
                    'devSN':$scope.sceneInfo.sn,
                    ownerName:$rootScope.userInfo.user,
                    storeId:834
                }
            }).success(function(data){   
                $scope.g_timeline = [];           
                $scope.g_pv = [];
                $scope.g_pu = [];
                $scope.g_ctr = [];
                $scope.g_clickCount = [];
                $scope.timeline = [];
                $scope.count = data.data.length;
                for (var i = 0; i < $scope.count; i++){
                    $scope.g_pv.push(data.data[i].pv);
                    $scope.g_pu.push(data.data[i].pu);
                    $scope.g_ctr.push(data.data[i].ctr);
                    $scope.g_clickCount.push(data.data[i].clickCount);
                    $scope.g_timeline.push(data.data[i].endTime);
                }
                for (var j = 0; j < $scope.count; j++){
                    if(mode == 1){
                        $scope.timeline.push(new Date($scope.g_timeline[j]).getHours()+":"+"00");
                    }
                    else if(mode == 2 || mode == 3){
                        $scope.timeline.push(new Date($scope.g_timeline[j]).getMonth()+1+"-"+new Date($scope.g_timeline[j]).getDate());
                    }
                    else {
                        $scope.timeline.push(new Date($scope.g_timeline[j]).getFullYear()+"-"+(new Date($scope.g_timeline[j]).getMonth()+1));
                    }
                } 
                if($scope.whatfaka == "g_pu"){
                    $scope.myechart($scope.timeline,$scope.g_pu);
                } 
                else if($scope.whatfaka == "g_clickCount"){
                    $scope.myechart($scope.timeline,$scope.g_clickCount);
                }
                else if($scope.whatfaka == "g_ctr"){
                    $scope.myechart($scope.timeline,$scope.g_ctr);
                }
                else {
                    $scope.myechart($scope.timeline,$scope.g_pv);
                }                
            }).error(function(){

            }); 

            var allcount = Utils.getUrl('GET','o2o','/oasis/auth-data/o2oportal/advertisement/querySpanTotal','/init/total_ad/allslist.json');
            $http({
                url:allcount.url,
                method:allcount.method,
                params:{
                    startTime:$scope.startdate,
                    endTime:$scope.enddate,
                    'devSN':$scope.sceneInfo.sn,
                    ownerName:$rootScope.userInfo.user,
                    storeId:834
                }
            }).success(function(data){
                $scope.basicListTempData = [];
                $scope.basicData = {
                    "pv":data.data.pv,
                    "pu":data.data.pu,
                    "clickCount":data.data.clickCount,
                    "ctr":data.data.ctr, 
                };
                $scope.basicListTempData.push($scope.basicData);
                $scope.$broadcast('load#allslist',$scope.basicListTempData);
            }).error(function(){

            });
            $scope.alloptions = {
                tId:'allslist',
                pageSize:5,
                showPageList:false, 
                searchable:true,     
                columns: [
                    {sortable: true, field: 'pv', title: getRcString('pv'),searcher:{}},
                    {sortable: true, field: 'pu', title: getRcString('pu'),searcher:{}},
                    {sortable: true, field: 'clickCount', title: getRcString('clickCount'),searcher:{}},
                    {sortable: true, field: 'ctr', title: getRcString('ctr'),searcher:{}}
                ],                      
            };

            var nextcount = Utils.getUrl('GET','o2o','/oasis/auth-data/o2oportal/advertisement/query','/init/total_ad/nextslist.json');
            $http({
                url:nextcount.url,
                method:nextcount.method,
                params:{
                    startTime:$scope.startdate,
                    endTime:$scope.enddate,
                    'devSN':$scope.sceneInfo.sn,
                    ownerName:$rootScope.userInfo.user,
                    storeId:834
                }
            }).success(function(data){
                $scope.detailListTempData = [];
                    $.each(data.data,function(i,item){
                        $scope.dataList = {
                            "url":data.data[i].url,
                            "pv":data.data[i].pv,
                            "pu":data.data[i].pu,
                            "clickCount":data.data[i].clickCount,
                            "ctr":data.data[i].ctr,
                        }
                        $scope.detailListTempData.push($scope.dataList);
                    });
                $scope.$broadcast('load#nextslist',$scope.detailListTempData);
            }).error(function(){

            });
            $scope.singleoptions = {
                tId:'nextslist',
                pageSize:5,
                showPageList:false,
                searchable:true,
                columns: [
                    {sortable: true, field: 'url', title: getRcString('url'),searcher:{}},
                    {sortable: true, field: 'pv', title: getRcString('pv'),searcher:{}},
                    {sortable: true, field: 'pu', title: getRcString('pu'),searcher:{}},
                    {sortable: true, field: 'clickCount', title: getRcString('clickCount'),searcher:{}},
                    {sortable: true, field: 'ctr', title: getRcString('ctr'),searcher:{}}
                ],
            };
        }
                       
        $scope.myechart = function(timeline,type){
            var totalchart =echarts.init(document.getElementById('adShowCount'));           
            var option = {                
                tooltip : {
                    show:false,
                    trigger: 'axis'
                },
                grid: {
                    show: "false"
                },                               
                xAxis : [
                    {                                   
                        boundaryGap : false,
                        type: 'category',
                        splitLine: false,
                        axisLine  : {
                            show:true ,
                            lineStyle :{color: '#9da9b8', width: 1}
                        },
                        axisTick:{show:false},
                        data : timeline
                    }
                ],
                yAxis : [
                    {
                        type : 'value',  
                        axisTick:{show:false},
                        splitLine: {
                            show: true,
                            textStyle: { color: '#c9c4c5', fontSize: "1px", width: 4 },
                            lineStyle: {
                                color: ['#e7e7e9']
                            }
                        },
                        axisLabel: {
                            show: true,
                            textStyle: { color: '#9da9b8', fontSize: "12px", width: 2 }
                        },
                        axisLine: {
                            show: true,
                            lineStyle: { color: '#9da9b8', width: 1 }
                        }                 
                    }
                ],
                series : [
                    {
                        name:getRcString('people'),
                        type:'line',
                        barCategoryGap: '40%',
                        
                        data:type,                
                    },               
                ]
            };                
            totalchart.setOption(option); 
        }

        $scope.clickTest = function(e){
            $('#total a.time-link').removeClass('active');
            var value = e.target.getAttribute('value');
            $('#total a[value = '+value+']').addClass('active');
            $scope.chouseUrl(value);
        }
        $(".applyBtn").click(function(){
            $("#total a.time-link").removeClass("active");
            $scope.chouseUrl("");
        });
        $scope.chouseUrl(1);
                
        $scope.tableTest = false;
        $scope.bindGroup = function (e) {
            var value = e.target.getAttribute('id');
            $scope.tableTest = value ==1?false:true;
                if(value == 'g_pv'){
                    $scope.myechart($scope.timeline, $scope.g_pv);
                } 
                else if(value == 'g_pu'){
                    $scope.myechart($scope.timeline, $scope.g_pu);
                }    
                else if(value == 'g_clickCount'){
                    $scope.myechart($scope.timeline, $scope.g_clickCount);
                }   
                else if(value == 'g_ctr'){
                    $scope.myechart($scope.timeline, $scope.g_ctr);
                } 
                $scope.whatfaka = value;                              
        }       
    }]
});