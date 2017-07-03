define(['jquery',"utils",'bootstrapValidator','css!applyset0/css/applycfg.css'],
	function($,Utils){
		return['$scope','$state','$rootScope','$http','$alertService',function($scope,$state,$rootScope,$http,$alert){
			//获取HTML变量
		    function getRcText (attrName) {
		        var sText = Utils.getRcString("RC", attrName);
		        return sText;
		    }
		    var oapConfig = {};
		    var boolCancel;
    		var drsCancel;
    		var appCancel;
		    //初始
		    //提示框标题
		    $scope.noticeType = getRcText("ERROR");
		    //开关StatusA
		    $scope.drsValueIsEnable = false;//无线定位on 或 off
		    //按钮是否显示StatusB
		    $scope.drsOperateBtnDisp = false;
		    $scope.drsValueChange=function(){
		    	$scope.drsValueIsEnable=(($scope.drsValueIsEnable==true)?false:true);
		    	$scope.drsOperateBtnDisp = true;
		    }
		    $scope.appValueIsEnable = false;
		    $scope.appOperateBtnDisp = false;
		    $scope.appValueChange=function(){
		    	$scope.appValueIsEnable=(($scope.appValueIsEnable==true)?false:true);
		    	$scope.appOperateBtnDisp = true;
		    }
		    initdata();
		    //获取开关状态
		   
		    // 
		    function initdata(){
		    	$http({
		            url:"/v3/ant/confmgr",
		            method:"post", 
		            data:{            
		                cloudModule:"wloc",
                		deviceModule:"wloc",
                		configType:1,
                		subMsgType: 0,
		                devSN: $scope.sceneInfo.sn,                
		                method:"globalStatusGet",
		                param:{
		                    devSN: $scope.sceneInfo.sn
		                },
		                result:["Status"]
		            	}         	            
			        })
		    	 	.success(function(data){    
			            if((data.result[0].Status!="")&&(data.reason=="")){ 
			                //对返回结果进行处理
			                console.log(data.result);
			                console.log(data.result[0]);

			                
			                if(data.result[0].Status=="on"){ 	
			                    data.result[0].Status=true;
			                }else if(data.result[0].Status=="off"){ 
			                    data.result[0].Status=false;    
			                }else{
			                    console.log("Try--Catch");
			                }

			                //给界面赋值
			                $scope.drsValueIsEnable = data.result[0].Status;
			                drsCancel=data.result[0].Status;
			            }else{
                		//提示用户
			                $alert.msgDialogError(getRcText("APP_GET"), 'error');
			                
			            }
			        })
			        .error(function(response){
			        	$alert.msgDialogError(getRcText("APP_GET"), 'error');
			    });
		    	$http({
		            url:"/v3/ant/confmgr",
		            method:"post", 
		            data:{            
		                cloudModule: "DRS",
		                deviceModule: "DRS",
		                configType:1,
		                subMsgType: 0,
		                devSN: $scope.sceneInfo.sn,                
		                method: "drsGet",
		                param:{
		                    devSN: $scope.sceneInfo.sn
		                },
		                result:["status"]
		            }         	            
			        }).success(function(data){     
			            if((data.result[0].status!="")&&(data.reason=="")){
			                //对返回结果进行处理
			                if(data.result[0].status=="on"){ 
			                    data.result[0].status=true;
			                }else if(data.result[0].status=="off"){ 
			                	
			                    data.result[0].status=false;
			                }else{
			                    console.log("Try--Catch");
			                }
			                //给界面赋值
			                $scope.appValueIsEnable = data.result[0].status;
			                appCancel=data.result[0].status; 
			            }else{
                		//提示用户
			                $alert.msgDialogError(getRcText("DRS_GET"), 'error');    
			            }
			        }).error(function(response){
			        	$alert.msgDialogError(getRcText("DRS_GET"), 'error');
			    });  
		    }
		    


		    //修改开关状态	    


		    //点击对勾触发
		  //   $scope.drsValueSET=function(){
		  //       var TipMsg = "";
		  //       if($scope.drsValueIsEnable)
		  //       {
		           
		  //           oapConfig.Status = "on";
		  //           TipMsg = "开启无线定位功能";
		  //       }else{
		            
		  //           oapConfig.Status = "off";
		  //           TipMsg = "关闭无线定位功能";
		  //       }
		  //       //TipMsg=($scope.drsValueIsEnable==true?"开启无线定位功能":"关闭无线定位功能");
		  //       // 
		  //       // 

				// 
				// $http.post(
		  //           "/v3/ant/confmgr",
		  //           JSON.stringify({
		  //               cloudModule: "wloc",
		  //               deviceModule: "wloc",
		  //               subMsgType:0,
		  //               configType: 0,
		  //               devSN: FrameInfo.ACSN,                
		  //               method: "globalStatusSet",
		  //               param:{
		  //                   oapConfig
		  //               }
		  //           })
		  //       )
		  //       .success(function(data){
		  //       	if("fail" == data.communicateResult)
	   //              {
	   //                  //Frame.Msg.info(TipMsg+"失败");
	   //                  $alert.msgDialogError(TipMsg+"失败", 'error');
	   //                  //$("#Cupid").MCheckbox("setState",boolCancel);
	   //                  //$(".form-actions").hide();
	   //                  $scope.drsOperateBtnDisp=false;
	   //                  return false;
	   //              }
	   //              for(i=0;i<data.deviceResult.length;i++) {
	   //                  if ("fail" == data.deviceResult[i].result) {
	   //                      //Frame.Msg.info(TipMsg+"失败");
	   //                      $alert.msgDialogError(TipMsg+"失败", 'error');
	   //                      //$("#Cupid").MCheckbox("setState",boolCancel);
	   //                      //$(".form-actions").hide();
	   //                      $scope.drsOperateBtnDisp=false;
	   //                      return false;
	   //                  }
	   //              }
	   //              if("fail"  == data.serviceResult){
	   //                  $alert.msgDialogError(TipMsg+"失败", 'error');
	   //                  //$("#Cupid").MCheckbox("setState",boolCancel);
	   //                  //$(".form-actions").hide();
	   //                  $scope.drsOperateBtnDisp=false;
	   //                  return false;
	   //              }
	   //              tipinit();
	   //              //$(".form-actions").hide();
	   //              $scope.drsOperateBtnDisp=false;
		  //       })
		  //       .error(function(){
		  //       	
		  //       });
		  //       // $.ajax({
		  //       //     url: '/v3/ant/confmgr',
		  //       //     dataType: "json",
		  //       //     type: "post",
		  //       //     data: {
		  //       //         cloudModule: "wloc",
		  //       //         deviceModule: "wloc",
		  //       //         subMsgType:0,
		  //       //         configType: 0,
		  //       //         devSN: FrameInfo.ACSN,
		  //       //         method: "globalStatusSet",
		  //       //         param: [oapConfig]
		  //       //     },
		  //       //     success:function(data){
		  //       //     	
		  //       //         if("fail" == data.communicateResult)
		  //       //         {
		  //       //              $alert.msgDialogError(TipMsg+"失败");
		  //       //             $("#Cupid").MCheckbox("setState",boolCancel);
		  //       //             $(".form-actions").hide();
		  //       //             return false;
		  //       //         }
		  //       //         for(i=0;i<data.deviceResult.length;i++) {
		  //       //             if ("fail" == data.deviceResult[i].result) {
		  //       //                 Frame.Msg.info(TipMsg+"失败");
		  //       //                 $("#Cupid").MCheckbox("setState",boolCancel);
		  //       //                 $(".form-actions").hide();
		  //       //                 return false;
		  //       //             }
		  //       //         }
		  //       //         if("fail"  == data.serviceResult){
		  //       //             Frame.Msg.info(TipMsg+"失败");
		  //       //             $("#Cupid").MCheckbox("setState",boolCancel);
		  //       //             $(".form-actions").hide();
		  //       //             return false;
		  //       //         }
		  //       //         //tipinit();
		  //       //         $(".form-actions").hide();
		  //       //     },
		  //       //     error:function(){
		  //       //         Frame.Msg.info(TipMsg+"失败");
		  //       //     }
		  //       // });
		  //   }
		  //无线定位
		    $scope.drsSetdata=function(){
		    	var statusTemp;
		    	var drs='drs';
		        if($scope.drsValueIsEnable==true){
		            statusTemp="on";
		        }else if($scope.drsValueIsEnable==false){
		            statusTemp="off";                
		        }else{
		            console.log("Try--Catch");
		        } 
		        
		        $http({
		            url:"/v3/ant/confmgr",
		            method:"post", 
		            data:{            
		                cloudModule: "wloc",
		                deviceModule: "wloc",
		                configType:0,
		                subMsgType: 0,
		                devSN: $scope.sceneInfo.sn,                
		                method: "globalStatusSet",
		                param:[{
		                    Status:statusTemp
		                }]
		               
		            }         	            
			        })
		    	 	.success(function(data){    
			            if((data.result=="success")&&(data.serviceResult=="success")&&(data.communicateResult=="success")&&(data.deviceResult[0].result=="success")&&(data.errCode==0)&&(data.reason=="")){
			                
			               SET_response(1,drs);
			            }else{
			                SET_response(0,drs);
			            }   
			        })
			        .error(function(response){
			        	SET_response(0,drs);
			    }); 
		    }
		    //应用分析
		    $scope.appSetdata=function(){
		    	var statusTemp;
		    	var app='app';
		        if($scope.appValueIsEnable==true){
		            statusTemp="on";
		        }else if($scope.appValueIsEnable==false){
		            statusTemp="off";                
		        }else{
		            console.log("Try--Catch");
		        } 
		        $http({
		            url:"/v3/ant/confmgr",
		            method:"post", 
		            data:{            
		                cloudModule: "DRS",
		                deviceModule: "DRS",
		                configType:0,
		                subMsgType: 0,
		                devSN: $scope.sceneInfo.sn,                
		                method: "drsEnable",
		                param:{
		                    devSN: $scope.sceneInfo.sn,
		                    status: statusTemp,
		                    family:"0"  
		                }
		               
		            }         	            
			        })
		    	 	.success(function(data){    
			            if((data.result=="success")&&(data.serviceResult=="success")&&(data.communicateResult=="success")&&(data.deviceResult.result=="success")&&(data.errCode==0)&&(data.reason=="")){
			                SET_response(1,app);
			            }else{
			                SET_response(0,app);
			            }   
			        })
			        .error(function(response){
			        	SET_response(0,app);
			    }); 
		    }
		    $scope.appValueBACK=function(){
		    	$alert.msgDialogError(getRcText("DRS_Cancel"), 'error');
		    	//$scope.drsValueIsEnable=(($scope.drsValueIsEnable==true)?false:true);
		    	$scope.appValueIsEnable=appCancel;
		    	$scope.appOperateBtnDisp = false;
		    }
		    $scope.drsValueBACK=function(){
		    	$alert.msgDialogError(getRcText("DRS_Cancel"), 'error');
		    	//$scope.drsValueIsEnable=(($scope.drsValueIsEnable==true)?false:true);
		    	$scope.drsValueIsEnable=drsCancel;
		    	$scope.drsOperateBtnDisp = false;
		    }
		    ////SET接口，返回值处理
		    function SET_response(cs,data){
        		if (data=="drs") {
	        		if(cs==1){
	        			if($scope.drsValueIsEnable==true){
			                $alert.msgDialogSuccess(getRcText("DRS_OPEN").split(",")[0]);
			            }else if($scope.drsValueIsEnable==false){
			                $alert.msgDialogSuccess(getRcText("DRS_CLOSE").split(",")[0]);              
			            }else{
			                $alert.msgDialogError("Try--Catch", 'error');
			            }    
			        }else if(cs==0){
			            if($scope.drsValueIsEnable==true){
			                $alert.msgDialogError(getRcText("DRS_OPEN").split(",")[1], 'error');
			                $scope.drsValueIsEnable=false;
			            }else if($scope.drsValueIsEnable==false){
			                $alert.msgDialogError(getRcText("DRS_CLOSE").split(",")[1], 'error');		
			            }else{
			                $alert.msgDialogError("Try--Catch", 'error');
			            }    
			        }else{
			                $alert.msgDialogError("Try--Catch", 'error');
			        }

			        //2-隐藏:StatusB
			        $scope.drsOperateBtnDisp = false;
        		}else{
        			if(cs==1){
	        			if($scope.appValueIsEnable==true){
			                $alert.msgDialogSuccess(getRcText("APP_OPEN").split(",")[0]);
			            }else if($scope.appValueIsEnable==false){
			                $alert.msgDialogSuccess(getRcText("APP_CLOSE").split(",")[0]);              
			            }else{
			                $alert.msgDialogError("Try--Catch", 'error');
			            }    
			        }else if(cs==0){
			            if($scope.appValueIsEnable==true){
			                $alert.msgDialogError(getRcText("APP_OPEN").split(",")[1], 'error');
			                $scope.appValueIsEnable=false;
			            }else if($scope.appValueIsEnable==false){
			                $alert.msgDialogError(getRcText("APP_CLOSE").split(",")[1], 'error');		
			            }else{
			                $alert.msgDialogError("Try--Catch", 'error');
			            }    
			        }else{
			                $alert.msgDialogError("Try--Catch", 'error');
			        }

			        //2-隐藏:StatusB
			        $scope.appOperateBtnDisp = false;
        		}
		        

		        //3-GET:StatusA 
		        setTimeout(initdata,2000);    
		    }
		}]
	}
);