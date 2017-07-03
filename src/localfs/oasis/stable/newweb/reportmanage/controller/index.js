define(['utils', 'jquery', 'moment','angular-ui-router', 'bsTable','bootstrap-daterangepicker','css!bootstrap_daterangepicker_css'], function (Utils, $,moment) {
    return ['$scope', '$http', '$rootScope', '$alertService', '$state', function ($scope, $http, $rootScope, $alert, $state) {

        function getRcString(attrName) {
            return Utils.getRcString("user_rc", attrName).split(',');
        }

        $scope.selected = {
            clientSelect:{
                baseInfo:[],
                offLineInfo:[]
            },
            dpiSelect:{
                GetApp:[],
                GetUrl:[],
                GetInterfaces:[],
                InterfacesStatis:[]
            },
            apSelect:{
                baseInfo:[]
            }
        };
        $scope.exportTimes = {};
        $scope.oSn = {};
        $scope.arrTime = getRcString('time');
        $scope.modelTime = $scope.arrTime[0];
        $http({
                url:"/v3/scenarioserver",
                method:'POST',
                data:{
                    "Method" :'getdevListByUser',
                    "param":{"userName":$scope.userInfo.user}
                }
            }).success(function(data){
                if(data.retCode == 0){
                    var arr = data.message;
                    $.each(arr,function(key,value){
                        if($scope.oSn.hasOwnProperty(value.shopName)){
                            $scope.oSn[value.shopName].push(value.devSN);
                        }else{
                            $scope.oSn[value.shopName]=[];
                            $scope.oSn[value.shopName].push(value.devSN);
                        }
                    });
                }
                
                return $scope.oSn;
            }).error(function(data,header,config,status){

            });


        $scope.getDevSn = function(id){
            $scope.arrSn = [];
            var shopName = $("#selectShop_"+id).find("option:selected").text();
            $scope[id+'ArrSn'] = $scope.oSn[shopName];
            $scope["modelDevSn"+id] = $scope[id+'ArrSn'][0]||'';
        }
        // function setCheckbox(id,name,aValue){
        //     $.each(aValue,function(i,v){
        //         $("#"+id+"input:checkbox"+"[name='"+name+"'][value='"+v+"']")[0].checked = true
        //     })
        // };
        // $http({
        //         url:"/v3/oasis-rest-report/restapp/report/chkStatus/"+$rootScope.userInfo.user+"/333333",
        //         method:'GET'
        //     }).success(function(data){
        //         if(data.code == 0){
        //             var oSelect = JSON.parse(data.data.chkSatus);
        //             $scope.selected = $.extend(true, {}, oSelect);
        //             for(var k in oSelect){
        //                 if(typeof oSelect[k] == "object"){
        //                     for(var n in oSelect[k]){
        //                         setCheckbox(k,n,oSelect[k][n]);
        //                     }
        //                 }
        //             }
        //         }   
        //     }).error(function(data,header,config,status){

        //     });
        function getArrSn(sn){
            var tempArr =[]; 
            $.each(sn,function(k,v){
                var tmp = $(v).text();
                tempArr.push(tmp);
            });
            return tempArr;
        }
        /**导出列名顺序始终与页面顺序一致 */
        function sortColumns(arrSource,arrCheck){
            var aResult = [];
            arrSource.forEach(function(v){
                if(arrCheck.indexOf(v.id) >= 0){
                    aResult.push(v.id);
                };
            });
            return aResult;
        }
        $scope.exportClient = function (sectionId,id) {
            var newChk=[];
            var shopNameClient = $("#selectShop_baseInfo").find("option:selected").text();
            var selectedClientSn = $("#clientSelectbaseInfo").find("option:selected").text();
            // var arrDevSn = getArrSn(selectedClientSn);
            var chkColumns = $scope.selected[sectionId][id];
            newChk = sortColumns($scope.stalistBasicInfo,chkColumns);
            var tabsJson ={
                tabName:id,
                columns:newChk.join(",")
            };
            if(tabsJson.columns.length == 0){
                $alert.msgDialogError(getRcString("tips")[0]);
                return;
            }
            if(shopNameClient == ""){
                $alert.msgDialogError(getRcString("tips")[1]);
                return;
            }
            // if(arrDevSn.length ==0){
            //     $alert.msgDialogError(getRcString('tips')[3]);
            //     return;
            // }
            $http({
                url:"/v3/oasis-rest-report/restapp/report/downloadClientReport",
                method:'POST',
                data:{
                    "storeId":'333333',
                    "userName":$rootScope.userInfo.user,
                    "devSN" :selectedClientSn,
                    "locale":Utils.getLang(),
                    "storeName":shopNameClient,
                    "chkStatus":JSON.stringify($scope.selected),
                    "export" :tabsJson
                }
            }).success(function(data){
                if(data.code ==0){
                    var fileArr = data.data.filePath;
                    var aDom = [];
                    aDom.push(
                        '<iframe style="display: none" src="',
                        fileArr,
                        '"></iframe>'
                    );
                    $(aDom.join("")).appendTo("body");
                }
            }).error(function(data,header,config,status){

            });

        }

        $scope.exportPortal = function () {
            var shopName = $("#selectShop_offLineInfo").find("option:selected").text();
            var portalSn = $("#clientSelectauthInfo").find("option:selected");
            var arrDevSn = getArrSn(portalSn);
            $scope.period = $("#selectTime").find("option:selected").text();
            var cycle;
            var aTime = getRcString('time');
            if($scope.period == aTime[0]){
                cycle = 24*3600;
            }else if($scope.period == aTime[1]){
                cycle = 7*24*3600;
            }else{
                cycle = 30*7*24*3600;
            }

            if(shopName == ""){
                $alert.msgDialogError(getRcString("tips")[1]);
                return;
            }
            if(arrDevSn.length ==0){
                $alert.msgDialogError(getRcString('tips')[3]);
                return;
            }

            $http({
                url:"/v3/arb/portalhistory/getfilepath",
                method:'POST',
                data:{
                    "diffTime":cycle,
                    "devSN" :arrDevSn,
                    "userName":$scope.userInfo.user,
                    "nasid":shopName
                }
            }).success(function(data){
                if(data.retCode == 0){
                    var fileArr = data.filePath;
                    var aDom = [];
                    aDom.push(
                        '<iframe style="display: none" src="/v3',
                        fileArr.split("..")[1],
                        '"></iframe>'
                    );
                    $(aDom.join("")).appendTo("body");
                }else{
                    $alert.msgDialogError(getRcString("tips")[2]);
                }
            }).error(function(data,header,config,status){

            });
        }

        $scope.exportAp = function (sectionId,id) {
            var newChk =[];
            var shopNameAp = $("#selectShop_apbaseInfo").find("option:selected").text();
            var selectedSn= $("#apSelectedSn").find("option:selected").text();
            // var arrDevSn = getArrSn(selectedSn);
            var chkColumns = $scope.selected[sectionId][id];
            newChk = sortColumns($scope.apBasicInfo,chkColumns);
            var tabsApJson ={
                tabName:id,
                columns:newChk.join(",")
            };
            if(tabsApJson.columns.length == 0){
                $alert.msgDialogError(getRcString("tips")[0]);
                return;
            }
            if(shopNameAp ==""){
                $alert.msgDialogError(getRcString("tips")[1]);
                return;
            }

            // if(arrDevSn.length ==0){
            //     $alert.msgDialogError(getRcString('tips')[3]);
            //     return;
            // }
            $http({
                url:"/v3/oasis-rest-report/restapp/report/downloadApReport",
                method:'POST',
                data:{
                    "storeId":'333333',
                    "userName":$rootScope.userInfo.user,
                    "devSN" :selectedSn,
                    "locale":Utils.getLang(),
                    "storeName":shopNameAp,
                    "chkStatus":JSON.stringify($scope.selected),
                    "export" :tabsApJson
                }
            }).success(function(data){
                if(data.code ==0){
                    var fileArr = data.data.filePath;
                    var aDom = [];
                    aDom.push(
                        '<iframe style="display: none" src="',
                        fileArr,
                        '"></iframe>'
                    );
                    $(aDom.join("")).appendTo("body");
                }
            }).error(function(data,header,config,status){

            });
        }

        $scope.exportDpi = function (sectionId,id) {
            var newChk=[];
            var dpiShopName = $("#selectShop_"+id).find("option:selected").text();
            var DpiSn = $("#"+sectionId+id).find("option:selected").text();
            // var arrDevSn = getArrSn(DpiSn);
            var time = $("#daterange_"+id).val().split('-');
            var chkColumns = $scope.selected[sectionId][id];
            newChk = sortColumns($scope['dpi_'+id],chkColumns);
            var tabsDpiJson ={
                tabName:id,
                columns:newChk.join(","),
                startTime:new Date(time[0]).getTime(),
                endTime:new Date(time[1]).getTime()
            };
            if(tabsDpiJson.columns.length == 0){
                $alert.msgDialogError(getRcString("tips")[0]);
                return;
            }
            if(dpiShopName == ""){
                $alert.msgDialogError(getRcString("tips")[1]);
                return;
            }
        //    if(arrDevSn.length ==0){
        //         $alert.msgDialogError(getRcString('tips')[3]);
        //         return;
        //     }
            $http({
                url:"/v3/oasis-rest-report/restapp/report/downloadDpiReport",
                method:'POST',
                data:{
                    "storeId":'333333',
                    "userName":$rootScope.userInfo.user,
                    "devSN" :DpiSn,
                    "locale":Utils.getLang(),
                    "storeName":dpiShopName,
                    "chkStatus":JSON.stringify($scope.selected),
                    "export" :tabsDpiJson
                }
            }).success(function(data){
                if(data.code ==0){
                    var fileArr = data.data.filePath;
                    var aDom = [];
                    aDom.push(
                        '<iframe style="display: none" src="',
                        fileArr,
                        '"></iframe>'
                    );
                    $(aDom.join("")).appendTo("body");
                }
            }).error(function(data,header,config,status){

            });
        }

        $('#daterange_GetApp').daterangepicker({
            timePicker: true,
            timePickerIncrement: 10,
            startDate: moment().startOf("day"),
            endDate: moment(),
            maxDate: moment(),
            timePicker24Hour:true,
            locale: {
                format: 'MM/DD/YYYY H:mm',
                applyLabel : getRcString("DRP_APPLYLABEL")[0],
                cancelLabel : getRcString("DRP_CANCELLABEL")[0]
            },
            dateLimit:{
                   days : 1
            }, 
            'opens':'center'
            // autoUpdateInput: false
            },function(start, end, label){
            $scope.exportTimes["GetAppStart"] = (new Date(start.format('YYYY-MM-DD H:mm'))).getTime();
            $scope.exportTimes["GetAppEnd"] = (new Date(end.format('YYYY-MM-DD H:mm'))).getTime();  
        });

        $('#daterange_GetUrl').daterangepicker({
            timePicker: true,
            timePickerIncrement: 10,
            startDate: moment().startOf("day"),
            endDate: moment(),
            maxDate: moment(),
            timePicker24Hour:true,
            locale: {
                format: 'MM/DD/YYYY H:mm',
                applyLabel : getRcString("DRP_APPLYLABEL")[0],
                cancelLabel : getRcString("DRP_CANCELLABEL")[0]
            },
            dateLimit:{
                   days : 1
            }, 
            'opens':'center'
            },function(start, end, label){
            $scope.exportTimes["GetUrlStart"] = (new Date(start.format('YYYY-MM-DD H:mm'))).getTime();
            $scope.exportTimes["GetUrlEnd"] = (new Date(end.format('YYYY-MM-DD H:mm'))).getTime();  
        });

        $('#daterange_GetInterfaces').daterangepicker({
            timePicker: true,
            timePickerIncrement: 10,
            startDate: moment().startOf("day"),
            endDate: moment(),
            maxDate: moment(),
            timePicker24Hour:true,
            locale: {
                format: 'MM/DD/YYYY H:mm',
                applyLabel : getRcString("DRP_APPLYLABEL")[0],
                cancelLabel : getRcString("DRP_CANCELLABEL")[0]
            },
            dateLimit:{
                   days : 1
            }, 
            'opens':'center'
            },function(start, end, label){
            $scope.exportTimes["GetInterfacesStart"] = (new Date(start.format('YYYY-MM-DD H:mm'))).getTime();
            $scope.exportTimes["GetInterfacesEnd"] = (new Date(end.format('YYYY-MM-DD H:mm'))).getTime();  
        });

        $('#daterange_InterfacesStatis').daterangepicker({
            timePicker: true,
            timePickerIncrement: 10,
            startDate: moment().startOf("day"),
            endDate: moment(),
            maxDate: moment(),
            timePicker24Hour:true,
            locale: {
                format: 'MM/DD/YYYY H:mm',
                applyLabel : getRcString("DRP_APPLYLABEL")[0],
                cancelLabel : getRcString("DRP_CANCELLABEL")[0]
            },
            dateLimit: {
                   days : 1
            }, 
            'opens':'center'
            },function(start, end, label){
            $scope.exportTimes["InterfacesStatisStart"] = (new Date(start.format('YYYY-MM-DD H:mm'))).getTime();
            $scope.exportTimes["InterfacesStatisEnd"] = (new Date(end.format('YYYY-MM-DD H:mm'))).getTime();  
        });
        $('input[name="datefilter"]').on('apply.daterangepicker', function(ev, picker) {
            $(this).val(picker.startDate.format('MM/DD/YYYY H:mm') + ' - ' + picker.endDate.format('MM/DD/YYYY H:mm'));
        });

        $('input[name="datefilter"]').on('cancel.daterangepicker', function(ev, picker) {
            $(this).val('');
        });
        
        $scope.clientTabs = getRcString("clientSelect");
        $scope.selectTab =  $scope.clientTabs[0];
        $scope.dpiTabs = getRcString("dpiSelect");
        $scope.selectTab1 = $scope.dpiTabs[0];
        $scope.apTabs = getRcString("apSelect");
        $scope.selectTab2 = $scope.apTabs[0];

        $scope.dpiOptions={
            multiple:true,
            placeholder:getRcString('tips')[3]
        }
        
        setTimeout(function(){
            $scope.$broadcast('val',[[]]);
        });
        var staInfo = getRcString("sta_info");
        var dpiInfo = getRcString("dpi_info");
        var apInfo = getRcString("ap_info");
        
        $scope.stalistBasicInfo = [
            {"id":"clientMAC","shortName":staInfo[0]},
            {"id":"clientIP","shortName":staInfo[1]},
            {"id":"clientVendor","shortName":staInfo[2]},
            {"id":"ApName","shortName":staInfo[3]},
            {"id":"clientSSID","shortName":staInfo[4]},
            {"id":"clientRadioMode","shortName":staInfo[5]},
            {"id":"clientMode","shortName":staInfo[6]},
            {"id":"clientChannel","shortName":staInfo[7]},
            {"id":"NegoMaxRate","shortName":staInfo[8]},
            {"id":"clientTxRate","shortName":staInfo[9]},
            {"id":"clientRxRate","shortName":staInfo[10]},
            {"id":"portalUserName","shortName":staInfo[11]},
            {"id":"portalAuthType","shortName":staInfo[12]},
            {"id":"portalOnlineTime","shortName":staInfo[13]}
        ];
        
        $scope.dpi_GetApp = [
            {"id":Utils.getLang()=='en'?"APPName":"APPNameCN","shortName":dpiInfo[0]},
            {"id":Utils.getLang()=='en'?"APPGroupName":"APPGroupNameCN","shortName":dpiInfo[1]},
            {"id":"UserMAC","shortName":dpiInfo[2]},
            {"id":"transmitTraffic","shortName":dpiInfo[3]},
            {"id":"receiveTraffic","shortName":dpiInfo[4]},
            {"id":"TotalTime","shortName":dpiInfo[5]},
            {"id":"LastTime","shortName":dpiInfo[6]}
        ];

        $scope.dpi_GetUrl= [
            {"id":"WebSiteName","shortName":dpiInfo[7]},
            {"id":Utils.getLang()=='en'?"CategoryName":"CategoryNameCN","shortName":dpiInfo[8]},
            {"id":"UserMAC","shortName":dpiInfo[2]},
            {"id":"TotalTime","shortName":dpiInfo[5]},
            {"id":"LastTime","shortName":dpiInfo[6]}
        ];

        $scope.dpi_GetInterfaces = [
            {"id":"UserMAC","shortName":dpiInfo[2]},
            {"id":"transmitTraffic","shortName":dpiInfo[3]},
            {"id":"receiveTraffic","shortName":dpiInfo[4]},
            {"id":"DropPktBytes","shortName":dpiInfo[9]}
        ];

        $scope.dpi_InterfacesStatis = [
            {"id":"InterfaceName","shortName":dpiInfo[10]},
            {"id":"PktCnts","shortName":dpiInfo[11]},
            {"id":"PktBytes","shortName":dpiInfo[12]},
            {"id":"Proportion","shortName":dpiInfo[13]}
        ];

        $scope.apBasicInfo = [
            {"id":"apName","shortName":apInfo[0]},
            {"id":"apSN","shortName":apInfo[1]},
            {"id":"apModel","shortName":apInfo[2]},
            {"id":"apGroupName","shortName":apInfo[3]},
            {"id":"macAddr","shortName":apInfo[4]},
            {"id":"ipv4Addr","shortName":apInfo[5]},
            {"id":"radioId","shortName":apInfo[6]},
            {"id":"radioChannel","shortName":apInfo[7]},
            {"id":"radioPower","shortName":apInfo[8]},
            {"id":"onlineTime","shortName":apInfo[9]},
            {"id":"client24GNum","shortName":apInfo[10]},
            {"id":"client5GNum","shortName":apInfo[11]}
        ];

        $("#moduel li").on('click',function(){
            $("#moduel li").removeClass('active');
            $('.tabbox').hide();
            $(this).addClass('active');
            $("#"+$(this).attr('tag')).show().addClass('active');
        });

        $("#clientTab li").on('click',function(){
            $("#clientTab li").removeClass('active');
            $('.clientSection').hide();
            $(this).addClass('active');
            $("#clientSelect "+"#"+$(this).attr('tag')).show().addClass('active');
        });

        $("#apreport li").on('click',function(){
            $("#apreport li").removeClass('active');
            $('.apSection').hide();
            $(this).addClass('active');
            $("#apSelect "+"#"+$(this).attr('tag')).show().addClass('active');
        });

        $("input[name='apinfo']").on('click',function(){
            $('.dn').hide();
            $('#'+$(this).attr('basic')).show();
        });

        $scope.isChecked = function(sectionId,tabId,id){
            return $scope.selected[sectionId][tabId].indexOf(id) >= 0 ;  
        } ;
        $scope.updateSelection = function(sectionId,tabId,$event,id){  
            var checkbox = $event.target ;  
            var checked = checkbox.checked ;  
            if(checked){  
                $scope.selected[sectionId][tabId].push(id);  
            }else{  
                var idx = $scope.selected[sectionId][tabId].indexOf(id) ;  
                $scope.selected[sectionId][tabId].splice(idx,1) ;  
            }  
        };
    }]
});

