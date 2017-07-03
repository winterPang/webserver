//网络部署-无线配置-服务配置-绑定  by weixin
define(['jquery','utils'],function($scope,Utils) {
    return ['$scope', '$http','$state','$window','$stateParams','$alertService',function($scope,$http,$state,$window,$stateParams,$alert){
        
        //  =========================页面表格初始化开始============================== 
        	function getRcString(attrName){
                return Utils.getRcString("bindPage_rc",attrName);
            }

        	$scope.info={
        		area:"apBranch"
        	}

        	/*绑定、未绑定分支信息*/
        	$scope.bindApBranchTable={
                tId:'bindApBranchTable',
                /*url:apListUrl.url,
                method:apListUrl.method,
                dataField:'bindApList',
                totalField:'bindApLeftCnt',*/ 
                striped:true,
                pagniation:true,
                clickToSelect: true,
                showPageList:false,
                clickToSelect:true,
		        maintainSelected:true,
                showCheckBox:true,
                responseHandler:function(res){
                        $scope.$broadcast('load#unbindAp',res.unbindApList);
                        return res;
                    },
                columns:[                
                    {sortable:true,align:'center',field:'apName',title:getRcString('APBranch_HEADER').split(",")[0]}, /*                                   
                    {sortable:true,align:'center',field:'apSN',title:getRcString('AP_HEADER').split(",")[1]},                                     
                    {sortable:true,align:'center',field:'apModel',title:getRcString('AP_HEADER').split(",")[2]},                                     
                    {sortable:true,align:'center',field:'radioNum',title:getRcString('AP_HEADER').split(",")[3]},*/                                     
                    {sortable:true,align:'center',field:'apBranchName',title:getRcString('APBranch_HEADER').split(",")[1]},                                     
                ],               
            };

            $scope.unbindApBranchTable={
                tId:'unbindApBranchTable',
                /*url:apListUrl.url,
                method:apListUrl.method,
                dataField:'bindApList',
                totalField:'bindApLeftCnt',*/ 
                striped:true,
                pagniation:true,
                clickToSelect: true,
                showPageList:false,
                clickToSelect:true,
		        maintainSelected:true,
                showCheckBox:true,           
                columns:[                
                    {sortable:true,align:'center',field:'apName',title:getRcString('APBranch_HEADER').split(",")[0]}, /*                                   
                    {sortable:true,align:'center',field:'apSN',title:getRcString('AP_HEADER').split(",")[1]},                                     
                    {sortable:true,align:'center',field:'apModel',title:getRcString('AP_HEADER').split(",")[2]},                                     
                    {sortable:true,align:'center',field:'radioNum',title:getRcString('AP_HEADER').split(",")[3]},*/                                     
                    {sortable:true,align:'center',field:'branchName',title:getRcString('APBranch_HEADER').split(",")[1]},                                     
                ],               
            };
        	/*绑定、未绑定AP信息*/
        	$scope.bindApTable={
                tId:'bindApTable',
                /*url:apListUrl.url,
                method:apListUrl.method,
                dataField:'bindApList',
                totalField:'bindApLeftCnt',*/ 
                striped:true,
                pagniation:true,
                clickToSelect: true,
                showPageList:false,
                clickToSelect:true,
		        maintainSelected:true,
                showCheckBox:true,
                responseHandler:function(res){
                        $scope.$broadcast('load#unbindAp',res.unbindApList);
                        return res;
                    },
                columns:[                
                    {sortable:true,align:'center',field:'apName',title:getRcString('AP_HEADER').split(",")[0]}, /*                                   
                    {sortable:true,align:'center',field:'apSN',title:getRcString('AP_HEADER').split(",")[1]},                                     
                    {sortable:true,align:'center',field:'apModel',title:getRcString('AP_HEADER').split(",")[2]},                                     
                    {sortable:true,align:'center',field:'radioNum',title:getRcString('AP_HEADER').split(",")[3]},*/                                     
                    {sortable:true,align:'center',field:'apBranchName',title:getRcString('AP_HEADER').split(",")[1]},                                     
                ],               
            };

            $scope.unbindApTable={
                tId:'unbindApTable',
                /*url:apListUrl.url,
                method:apListUrl.method,
                dataField:'bindApList',
                totalField:'bindApLeftCnt',*/ 
                striped:true,
                pagniation:true,
                clickToSelect: true,
                showPageList:false,
                clickToSelect:true,
		        maintainSelected:true,
                showCheckBox:true,           
                columns:[                
                    {sortable:true,align:'center',field:'apName',title:getRcString('AP_HEADER').split(",")[0]}, /*                                   
                    {sortable:true,align:'center',field:'apSN',title:getRcString('AP_HEADER').split(",")[1]},                                     
                    {sortable:true,align:'center',field:'apModel',title:getRcString('AP_HEADER').split(",")[2]},                                     
                    {sortable:true,align:'center',field:'radioNum',title:getRcString('AP_HEADER').split(",")[3]},*/                                     
                    {sortable:true,align:'center',field:'branchName',title:getRcString('AP_HEADER').split(",")[1]},                                     
                ],               
            };

        //  =========================页面表格初始化结束==============================
        
        
        //  =========================监控表格选取状态开始==============================
        //  =========================监控表格选取状态结束==============================
        
       
        //  =========================点击事件开始==============================
        	$scope.apBranchArea=true;
        	$scope.apArea=false;

        	$scope.apBranch=function(){
        		$scope.info.area="apBranch";
        		$scope.apBranchArea=true;
        		$scope.apArea=false;
        	}
        	$scope.ap=function(){
        		$scope.info.area="ap";
        		$scope.apBranchArea=false;
        		$scope.apArea=true;
        	}

        	$scope.return = function(){
                $window.history.back();
            }
        	
        //  =========================点击事件结束==============================         
    }]
});