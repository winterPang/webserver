define(['utils','jquery','angular-ui-router','bsTable'],function(Utils,$) {
    return ['$scope', '$http', '$rootScope','$alertService','$timeout','$state',function($scope, $http, $rootScope, $alert,$timeout,$state){
        var g_oTableData={};
        function getRcString(attrName){
            return Utils.getRcString("user_rc",attrName).split(',');
        }
        $scope.option={
                tId:'wireless',
                striped:true,
                pagniation:true,
                clickToSelect: true,
                columns:[
                            {sortable:true,field:'stName',title:getRcString('HEADER')[0]},
                            {sortable:true,field:'ssidName',title:getRcString('HEADER')[1],
                            formatter: function(value,row,index){
                                            return '<a class="list-link">'+value+'</a>';
                                            } 
                            },
                            {sortable:true,field:'status',title:getRcString('HEADER')[2]},
                            {sortable:true,field:'securityIE',title:getRcString('HEADER')[3]},
                            {sortable:true,field:'cipherSuite',title:getRcString('HEADER')[4]},
                            {sortable:true,field:'authLocation',title:getRcString('HEADER')[5]},
                            {sortable:true,field:'clinetCount',title:getRcString('HEADER')[6]}                                     
                        ]
        };

        var adata=[];
        var aAuthLocation = getRcString("AUTHLOCATION");//MAC,NAC,AP,Other
        var aCiphersuite = getRcString("CIPHERSUITE");//Not configured,WEP40,TKIP,CCMP,TKIP/CCMP,WEP104,WEP128
        var aSecurityIe = getRcString("SECURITYIE");//Not configured,WPA,RSN,OSEN"
        var aStatus= getRcString("STATUS");//,使能,去使能
        var aFwdlocation=getRcString("FWDLOCATION");//1-MAC,2-NAC,4-AP,8-Other
        var aHidessid=getRcString("HIDE_SSID");//不隐藏,隐藏
        var aMaxreceiveradio=getRcString("MAXRECEIVERADIO");//0-Not configured
        var aAkmmode=getRcString("AKMMODE");
        function switcCipherSuite(iDate){
            switch (iDate.cipherSuite) {
                case 128:
                    iDate.cipherSuite=aCiphersuite[6];
                    break;
                case 32:
                    iDate.cipherSuite=aCiphersuite[5];
                    break;
                case 24:
                    iDate.cipherSuite=aCiphersuite[4];
                    break;
                case 16:
                    iDate.cipherSuite=aCiphersuite[3];
                    break;
                case 4:
                    iDate.cipherSuite=aCiphersuite[2];
                    break;
                case 2:
                    iDate.cipherSuite=aCiphersuite[1];
                    break;
                case 0:
                    iDate.cipherSuite=aCiphersuite[0];
                    break;
                default:
                    iDate.cipherSuite=iDate.cipherSuiteStr;
                    break;
            }
            return iDate.cipherSuite;
        }
        function switchAkmmode(iDate){
            switch (iDate.akmMode) {
                case 128:
                    iDate.akmMode=aAkmmode[8]
                    break;
                case 64:
                    iDate.akmMode=aAkmmode[7]
                    break;
                case 32:
                    iDate.akmMode=aAkmmode[6]
                    break;
                case 16:
                    iDate.akmMode=aAkmmode[5]
                    break;
                case 8:
                    iDate.akmMode=aAkmmode[4]
                    break;
                case 4:
                    iDate.akmMode=aAkmmode[3]
                    break;
                case 2:
                    iDate.akmMode=aAkmmode[2]
                    break;
                case 1:
                    iDate.akmMode=aAkmmode[1]
                    break;
                case 0:
                    iDate.akmMode=aAkmmode[0]
                    break;
                default:
                    iDate.akmMode=iDate.akmModeStr;
                    break;
            }
        }
        $timeout(function() {$scope.$broadcast('showLoading#wireless');});
         
         $http({
                url:'/v3/ssidmonitor/getssidlist',
                method:'GET',
                params:{
                    devSN:$scope.sceneInfo.sn
                }
                }).success(function(data){
                    if('{"errcode":"Invalid request"}' == data){
                    // alert("没有权限");
                    }
                    else{
                        $.each(data.ssidList,function(index,iDate){
                            iDate.authLocation=aAuthLocation[iDate.authLocation];
                            //0-Not configured, 2-WEP40, 4-TKIP, 16-CCMP, 20-TKIP/CCMP,32-WEP104,128-WEP128
                            
                            if(iDate.securityIEStr){
                                if(iDate.securityIEStr =="Not configured"){
                                    iDate.securityIE=(Utils.getLang() =='cn')?getRcString("SECURITYIE")[0]:iDate.securityIEStr;
                                }else{
                                    iDate.securityIE=iDate.securityIEStr;
                                }  
                            }else{
                                iDate.securityIE =aSecurityIe[iDate.securityIE]; 
                            } 
                            iDate.status=aStatus[iDate.status];
                            // iDate.FwdLocation=aFWDLOCATION[iDate.FwdLocation];
                            if(iDate.FwdLocation==4){
                                iDate.FwdLocation=aFwdlocation[1];
                            }else{
                                iDate.FwdLocation=aFwdlocation[0];
                            }
                            if(iDate.cipherSuiteStr){
                                if(iDate.cipherSuiteStr =="Not configured"){
                                    iDate.cipherSuite = (Utils.getLang() =='cn')?getRcString("SECURITYIE")[0]:iDate.cipherSuiteStr;
                                }else{
                                    iDate.cipherSuite =iDate.cipherSuiteStr;
                                }  
                            }else{
                                iDate.cipherSuite = switcCipherSuite(iDate);
                            }
                            iDate.hideSSID=aHidessid[iDate.hideSSID];
                            if(iDate.maxClients ==0){
                                iDate.maxClients = (Utils.getLang() =='cn')?getRcString("SECURITYIE")[0]:"Not configured";
                            }    
                            // iDate.maxClients=(iDate.maxClients==0)?"Not configured":iDate.maxClients;
                            if(iDate.maxSendRatio==0){
                                iDate.maxSendRatio = (Utils.getLang() =='cn')?getRcString("SECURITYIE")[0]:"Not configured";
                            }
                            // iDate.maxSendRatio=(iDate.maxSendRatio==0)?"Not configured":iDate.maxSendRatio;
                            if(iDate.maxReceiveRatio==0){
                                iDate.maxReceiveRatio = (Utils.getLang() =='cn')?getRcString("SECURITYIE")[0]:"Not configured"; 
                            }
                            // iDate.maxReceiveRatio=(iDate.maxReceiveRatio==0)?"Not configured":iDate.maxReceiveRatio;
                            if(iDate.akmModeStr){
                                if(iDate.akmModeStr =="Not configured"){
                                    iDate.akmMode = (Utils.getLang() =='cn')?getRcString("AKMMODE")[0]:"Not configured"; 
                                }else{
                                    iDate.akmMode =iDate.akmModeStr;
                                }     
                            }else{
                                iDate.akmMode =switchAkmmode(iDate); 
                            }
                            
                            adata.push(iDate);   
                        });
                    }
                    
                    $scope.$broadcast('load#wireless',adata);
                    $scope.$broadcast('hideLoading#wireless');
                    for(var i =0;i<adata.length;i++){
                        g_oTableData[adata[i].stName]=adata[i]
                    }
                }).error(function(data,header,config,status){

                });
         $scope.refresh=function (){
             $scope.$broadcast('refresh#wireless',{url:'/v3/ssidmonitor/getssidlist?devSN='+$scope.sceneInfo.sn});
         }
         $scope.ssid={
            options:{
                 mId:'ssid',
                 title:getRcString("DETAIL"),
                 modalSize:'normal',                        
                 autoClose: true,  
                 showCancel: true,     
                 buttonAlign: "center",                  
                 okHandler: function(modal,$ele){  
                 },
                 cancelHandler: function(modal,$ele){
                    
                 },
                 beforeRender: function($ele){
                     return $ele;
                 }
            }
         }
         function updateHtml(jScope, oData)
         {
            $.each(oData, function (sKey, sValue)
                {
                    sKey = sKey.replace(/\./g, "\\.");
                    sValue = (null == sValue) ? "" : sValue+"";
                    $("#"+sKey, jScope).removeClass("loading-small").html(sValue);
                });
            return;
        }
          $scope.$on('click-cell.bs.table#wireless',function (e, field, value, row, $element){
            if(field=='ssidName'){
                $scope.$broadcast('show#ssid');
                var oData = g_oTableData[row.stName];
                updateHtml($("#view_client_form"), oData);
            }
        })
    }]
});

