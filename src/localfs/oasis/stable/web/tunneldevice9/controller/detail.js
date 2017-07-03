
define(['jquery','utils', 'bootstrapValidator'], function ($,Utils) {
    return ['$scope', '$http', '$alertService', '$state', '$rootScope', '$stateParams','$interval',function ($scope, $http, $alert, $state, $rootScope, $stateParams,$interval) {
        var URL_POST_resetDev = "/v3/base/resetDev";
        var getApGroupNameList_URL = Utils.getUrl('POST','','/cloudapgroup','/init/branchOther5/upload_apgroup.json');
        var groupId;
        var paramId;
        var data_l;
        var snList=[];
        var statsList={};
        var checkEvt = [
                "check.bs.table#base","uncheck.bs.table#base",
                "check-all.bs.table#base","uncheck-all.bs.table#base",    
        ]; 
        $scope.branchLists=[];
        $scope.template = {
            filterBranch:"headquarters",
        }
        $scope.retry=true;
        $scope.retryData =[];                
        $http({
            url:getApGroupNameList_URL.url,
            method:getApGroupNameList_URL.method,
            data:{
                Method:"getCloudApgroupNameList",
                query:{
                    userName:$scope.userInfo.user,
                    nasId:$scope.sceneInfo.nasid,
                }
            }
        }).success(function(data){
            if(data.retCode==0){
                groupId=data.message.groupId;
                angular.forEach(data.message.subGroupList,function(datai,index,array){
                    $scope.branchLists.push({alias:datai.alias,groupId:datai.groupId});
                })
                init();
                $http({
                    url:getApGroupNameList_URL.url,
                    method:getApGroupNameList_URL.method,                    
                    data:{
                        Method:"getApgroupData",
                        query:{
                           groupId:groupId 
                        }                        
                    }
                }).success(function(data){
                    changeData();
                }).error(function(){

                })
            }
        }).error(function(){
            console.log('出错啦~');
        });
        $scope.initData=function(param){
            if(param=='headquarters'){
                //获取总部信息
                paramId="";
                       
            }else{
                $scope.branchone = $scope.branchLists[0];
                paramId=$scope.branchone.groupId;
               
                //获取分支信息
            }
            changeData();
        } 
        $scope.$watch('branchone',function(){
            if($scope.branchone&&(paramId!=$scope.branchone.groupId)){
                paramId=$scope.branchone.groupId;
                console.log($scope.branchone.groupId);
              //$('[bs-table="options"]').bootstrapTable('load',data_l);
                changeData();
            }            
        }); 
        $scope.$on('$destroy',function() {  
            $interval.cancel(timer);
        });   
        function dealTimeFun( nTmpDate ){
            var second_time=(new Date().getTime()-nTmpDate)/1000;
            var time = parseInt(second_time) + "秒";  
            if( parseInt(second_time )> 60){  
              
                var second = parseInt(second_time) % 60;  
                var min = parseInt(second_time / 60);  
                time = min + "分" + second + "秒";                    
                if( min > 60 ){  
                    min = parseInt(second_time / 60) % 60;  
                    var hour = parseInt( parseInt(second_time / 60) /60 );  
                    time = hour + "小时" + min + "分" + second + "秒";  
              
                    if( hour > 24 ){  
                        hour = parseInt( parseInt(second_time / 60) /60 ) % 24;  
                        var day = parseInt( parseInt( parseInt(second_time / 60) /60 ) / 24 );  
                        time = day + "天" + hour + "小时" + min + "分" + second + "秒";  
                    }  
                }                                  
            }                
            return time;          
        } 
        function getStatus(param,time){
            if(statsList[param]==0){
                return dealTimeFun(time);
            }else if(statsList[param]==1){
                return "不在线";
            }else{
                return "无设备";
            }
        } 
        function dealTime(nS){
            var timestamp4 = new Date(nS); 
            return timestamp4.toLocaleDateString().replace(/\//g, "-") + " " + timestamp4.toTimeString().substr(0, 8);    
        }     
        function init(param){//通过分支或总部获取数据
            var devData = null; //做缓存
            $scope.options = {
                tId: 'base',
                // url: "/base/getDevicesResetResults",
                clickToSelect: true,
                // sidePagination: 'server',
                showCheckBox: true,
                // refreshUnCheck:false,
                striped: true,
                searchable: true,
                pagination: true,
                showPageList: false,
                pageSize: 5,
                pageList: [5, 10],
                //apiVersion:'v3',
               // pageParamsType: 'path',
                // method: "post",
                // contenrType: "application/json",
                // dataType: "json",
                // startField: 'skipnum',
                // limitField: 'limitnum',
                // beforeAjax: function () {
                //     var defer = $.Deferred();
                //     if (devData){
                //         defer.resolve(devData);
                //     }else{
                //         $http.get('/v3/ace/oasis/oasis-rest-shop/restshop/shopModel/shopdevices2/'+$scope.sceneInfo.nasid).success(function(data){
                //             devData = data;
                //             $.each(data.data[0].devices,function(i,all){
                //                 snList.push(all.devSn);
                //             });
                //             $http.post('/v3/base/getDevs',{devSN: snList}).success(function(data){
                //                 $.each(data.detail,function(i,statu){
                //                     var devSn=statu.devSN;
                //                     var status=statu.status;
                //                     statusList[devSn]=status;
                //                 });
                //                 defer.resolve(devData);
                //             }).error(function(data){
                //                 defer.resolve(null);
                //             })                                          
                //         }).error(function(err){
                //             defer.resolve(null);
                //         });
                //     }

                //     //Promise.then(fn1,fn2);
                //     return defer;
                // },
                // queryParams: function (params) {
                //     return {midId:paramId?paramId:groupId,topId:groupId};
                // },
                // responseHandler: function (data,dev) {  
                //     if ((!data.message.length)||(data.retCode==-1)){
                //         return [];
                //     }
                //     //这里的data是表格刷数据传的url经过queryParams过来的，dev是beforeAjax过来的
                //     data_l =data.message; //定期轮询的结果
                //     var dev_l  = dev.data[0].devices;
                //     var data_k = [];
                //     $.each(data_l,function(a,da){
                //         $.each(dev_l,function(e,de){ 
                //             if(de.devSn==da.devSN){
                //                 da.devAlias=de.devAlias;
                //                 da.cnctTime=(da.status==1)?"正在重启":(getStatus(da.devSN,da.cnctTime));
                //                 // data_k.push(da);
                //             }
                //         });
                //     });

                //     console.log("data_l:",data_l);
                //     console.log("dev_l:",dev_l);
                //     console.log("dev_k:",data_k);
                //     return {
                //         total: data_l.length,
                //         rows: data_l
                //     };
                // },
                operateWidth:200,
                operate:{
                    reboot: function (ev,row,btn){
                        if(row.onOff!="在线"){

                        }else{
                            $alert.confirm('确认重启吗？',
                                function(){                                                             
                                    console.log(ev);
                                    console.log(row);
                                    console.log(btn);                                
                                    $http({
                                        url:"/base/resetDevs",
                                        method:"post",
                                        data:{devSN:[row.devSN]}
                                    })
                                    .success(function(data){
                                        if((data.retCode=="0")&&(data.message[0].status!=-1)){
                                            $alert.msgDialogSuccess("配置正在下发，请稍后~");
                                            changeData();
                                            //$('[bs-table="options"]').bootstrapTable('load',data_l);                                         
                                        }else{
                                            $alert.noticeDanger("重启失败，请重试");
                                        }      
                                    })
                                    .error(function(res){
                                        $alert.noticeDanger("重启失败，请重试");
                                    });                                 
                                },
                                function(){}
                            );     
                        }
                        
                    }
                },
                tips:{                                     
                                                                          
                }, 
                icons:{
                    reboot:"glyphicon glyphicon-off"
                },
                columns: [
                    // {checkbox: true}, //和showCheckBox: true,功能一样多写出两个           
                    {sortable: true, field: 'devAlias', title: "AP名称", searcher: {}},
                    {sortable: true, field: 'devSN', title: "序列号", searcher: {}},
                    {sortable: true, field: 'cnctTime', title: "上次重启时间", searcher: {}},                  
                    {sortable: true, field: 'onOff', title: "当前状态", searcher: {}}                    
                ]
            };
        }
        function changeData(timeInte){
            $http.post('/base/getDevicesResetResults',{midId:paramId?paramId:groupId,topId:groupId})
            .success(function(results){
                if(results.retCode==-1){
                    $scope.$broadcast('load#base',[]);
                    return;
                }
                var data_dev=results.message;
                if((results.retCode==0)&&(results.message)){
                    snList=[];
                    $.each(results.message,function(i,re){
                        snList.push(re.devSN);
                    });
                    var getUrl='/v3/apmonitor/getApBriefInfoByParentCloudGroup?midId='+(paramId?paramId:groupId)+'&topId='+groupId+'&skipnum=0&limitnum=10000';
                    $http.post(getUrl,{findoption:{},sortoption:{}})
                    .success(function(stat){
                        if(stat.apInfo.apList){
                            var aliasList={};
                            $.each(stat.apInfo.apList,function(j,st){
                                statsList[st.apSN]=st.status;
                            });
                            $http.get('/v3/ace/oasis/oasis-rest-shop/restshop/shopModel/shopdevices2/'+$scope.sceneInfo.nasid)    
                            .success(function(data){
                                if((data.code==0)&&(data.data[0].devices)){
                                    $.each(data.data[0].devices,function(i,devAll){
                                        aliasList[devAll.devSn]=devAll.devAlias;
                                    });
                                    $.each(data_dev,function(k,datakI){
                                        datakI.devAlias=aliasList[datakI.devSN];
                                        datakI.cnctTime=dealTime(datakI.cnctTime);
                                        datakI.onOff=statsList[datakI.devSN];
                                        if(datakI.status==1){
                                            datakI.onOff="正在重启";

                                        }else{
                                           datakI.onOff=(datakI.onOff==1)? "在线":"离线";
                                        }
                                    });
                                }
                                // console.debug($('[bs-table="options"]').bootstrapTable('getData'));
                                console.debug('test',data_dev);
                                // $('[bs-table="options"]').bootstrapTable('load',data_dev);
                                if(timeInte){
                                    $scope.$broadcast("getSelections#base", function (selectData) {
                                        var selectList=selectData;
                                        $scope.$broadcast('load#base',data_dev);
                                        angular.forEach(selectList,function(value,key,values){
                                            if(value.onOff=="在线"){
                                                $scope.$broadcast("checkBy#base",{field:"devSN",values:[value.devSN]}); 
                                            }                             
                                        }) 
                                    });
                                }else{
                                    $scope.$broadcast('load#base',data_dev);
                                    $scope.retry=true; 
                                }  
                            })
                            .error(function(res){});
                            }
                        })
                    .error(function(res){});
                }  
            })
            .error(function(res){});   
        }
        var timer = $interval(function(){
            var timeInte=true;
            changeData(timeInte);
        },10000);
        angular.forEach(checkEvt, function (value, key, values) {
            $scope.$on(value, function () {
                $scope.$broadcast("getSelections#base", function (data) {
                    console.log(data);
                    if ($rootScope.$$phase) {
                        $scope.retryData=data;    
                        $scope.retry = !$scope.retryData.length;    
                    } else {
                        $scope.$apply(function () {
                            $scope.retryData=data;    
                            $scope.retry = !$scope.retryData.length;                
                        });
                    }
                    angular.forEach(data,function(value,key,values){ 
                        if(value.onOff!="在线"){                           
                            $scope.$broadcast("uncheckBy#base",{field:"devSN",values:[value.devSN]});
                        }
                    })                    
                });
            });
        }); 
        $scope.retryFn=function(){
            $alert.confirm('确认重启吗？',
                function(){
                    // $alert.msgDialogSuccess("重启成功"); 
                    $scope.$broadcast("getSelections#base",function(data){
                        var resetDevsList=[];
                        angular.forEach(data,function(value, key, values){
                            resetDevsList.push(value.devSN);
                        });
                        $http({
                            url:"/base/resetDevs",
                            method:"post",
                            data:{devSN:resetDevsList}
                        })
                        .success(function(res){
                            if(res.retCode==0){
                                $alert.msgDialogSuccess("配置正在下发，请稍后~");
                                changeData();
                            }
                        })
                        .error(function(res){
                           $alert.noticeDanger("重启失败，请重试"); 
                        });
                    })
                },
                function(){}
            );              
        }
    }];
});
