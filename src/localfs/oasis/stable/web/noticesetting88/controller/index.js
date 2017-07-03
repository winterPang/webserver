//中小企业-运营维护-通知设置  by weixin 16-12-16
//日期插件使用的是bootstrap-datetimepicker 详情请查询api
define(['jquery','utils','!noticesetting88/libs/bootstrap-datetimepicker.min','bsTable','css!noticesetting88/css/bootstrap-datetimepicker'],function($,Utils) {
    return ['$scope', '$http','$state','$compile','$window','$stateParams','$alertService','$rootScope',function($scope,$http,$state,$compile,$window,$stateParams,$alert,$rootScope){
        
        //  =========================页面初始化开始==============================   
            var g_phoneNum; 
        	var g_phoneNums=[]; 

            function getRcString(attrName){
                return Utils.getRcString("noticesetting_rc",attrName);
            }

        	function PrefixInteger(num, n) {
	            return (Array(n).join(0) + num).slice(-n);
	        }

            function setTime(val){
                return PrefixInteger(parseInt(val/60),2)+":"+PrefixInteger(val%60,2);
                
            }

            $('#datetimepicker3').datetimepicker({
                format:'HH:mm'
            });           
        	$('#datetimepicker4').datetimepicker({ 		
        		format: 'HH:mm'
        	});
        	$('#datetimepicker5').datetimepicker({ 		
        		format: 'HH:mm'
        	});
        	$('#datetimepicker6').datetimepicker({ 		
        		format: 'HH:mm'
        	});

            $scope.smsInfo={
                workday:true,
                saturday:false,
                sunday:false,
                AP:true,
                APOffline:true,
                equipment:true,
                memory:true,
                CPU:true,
                software:true,
                maxTimes:10,
                smsStart:"00:00",
                smsEnd:"24:00",
                interval:getRcString("captcha")
            }

            $scope.info={
                wechatMax:10,
                wechatWorkday:true,
                wechatSaturday:false,
                wechatSunday:false,
                wechatAP:true,
                wechatAPOffline:true,
                wechatEquipment:true,
                wechatCPU:true,
                wechatMemory:true,
                wechatSoftware:true,

                appWorkday:true,
                appSaturday:false,
                appSunday:false,
                appAP:true,
                appAPOffline:true,
                appEquipment:true,
                appCPU:true,
                appMemory:true,
                appSoftware:true
            } 


            //短信配置表格初始化
            $scope.smsTable={
                tId:'smsTable',  
                dataField:'message', 
                url:"/subscribemgr/getSmsNoticeOption",
                method:'post',  
                dataField:"message",  
                contentType:"application/x-www-form-urlencoded",          
                striped:false,
                pagniation:true,
                clickToSelect: true,
                searchable: true,  
                detailView: true,
                queryParams:function(params) {
                    params={
                        "start":1,
                        "size":10,
                        "order":'asc',
                        "limit":10,
                        "offset":0,
                        "nasID":$scope.sceneInfo.nasid,                
                        "devSN":$scope.sceneInfo.sn
                    }
                    return params;
                },         
                columns:[
                    {sortable:true,valign:"middle",searcher:{type:"text"},field:'phoneNum',title:getRcString('smsinfo').split(",")[0]},
                    {sortable:true,valign:"middle",field:'noticeTime',title:getRcString('smsinfo').split(",")[1],
                        formatter: function (val, row, index) {
                            return PrefixInteger(parseInt(row.allowedTime[0].start/60),2)+":"+PrefixInteger(row.allowedTime[0].start%60,2)+"~"+
                                PrefixInteger(parseInt(row.allowedTime[0].end/60),2)+":"+PrefixInteger(row.allowedTime[0].end%60,2); 
                            
                        }
                    },
                    {sortable:true,valign:"middle",field:'maxTimes',title:getRcString('smsinfo').split(",")[2]},
                    {sortable:true,valign:"middle",field:'status',title:getRcString('smsinfo').split(",")[3],
                        formatter: function (val, row, index) {
                            g_phoneNums.push(row.phoneNum);
                            if(row.enable==true){
                                return "<div class='xb-input'><div class='input-icon checkbox-icon switch checked'></div></div>";
                            }else if(row.enable==false){
                                return "<div class='xb-input'><div class='input-icon checkbox-icon switch'></div></div>";
                            }
                        }
                    },
                            
                ],
                operateWidth: 240,
                operateTitle: getRcString('OPERAT'), 
                operate:{                                                                                               
                    remove:function(e,row,$btn){
                        $alert.confirm(getRcString("DEL_CON"), 
                            function () { 
                                $http({
                                    url:"/subscribemgr/removeSmsNoticeOption",
                                    method:'POST', 
                                    data:{                                 
                                        nasID:$scope.sceneInfo.nasid,                
                                        devSN:$scope.sceneInfo.sn,
                                        phoneNum:row.phoneNum                       
                                    }         
                                }).success(function(response){  
                                    if(response.retCode==0){
                                        for (var i = 0; i < g_phoneNums.length; i++) {
                                            if (g_phoneNums[i] == row.phoneNum){
                                                g_phoneNums.splice(i, 1);
                                            }
                                        }
                                        $alert.msgDialogSuccess(getRcString("DEL_SUC"));
                                        $scope.$broadcast('refresh#smsTable');
                                    }
                                }).error(function(response){               
                                });
                            }, 
                            function () {                          
                            }
                        );
                        
                    },                                                                                                           
                }, 
                tips:{                
                    remove:getRcString("REMOVE"),                                                          
                }, 
                icons: {    
                    remove:'fa fa-trash',                                          
                },                                                 
            }; 

            $scope.$on('click-cell.bs.table#smsTable',function (e, field, value, row, $element){
                if(field=='status'){                                  
                   if(row.enable==true){ 
                        row.enable=false; 
                        $element.find('.switch ').removeClass('checked');

                        $http({
                            url:"/v3/subscribemgr/setSmsNoticeOption",
                            method:'POST', 
                            data:{                                 
                                nasID:$scope.sceneInfo.nasid,                
                                devSN:$scope.sceneInfo.sn,
                                phoneNum:row.phoneNum,
                                config:{
                                    enable:false                            
                                }
                            }         
                        }).success(function(response){ 
                            if(response.retCode==0){
                                $alert.msgDialogSuccess(getRcString("CLOSE_SUC"));                             
                            }else{
                                $alert.msgDialogError(getRcString("CLOSE_FAL"),'error');               
                            }
                        }).error(function(response){
                            $alert.msgDialogError(getRcString("CLOSE_FAL"),'error');               
                        });    

                   }else if(row.enable==false){
                        row.enable=true;
                        $element.find('.switch ').addClass('checked');

                        $http({
                            url:"/v3/subscribemgr/setSmsNoticeOption",
                            method:'POST', 
                            data:{                                 
                                nasID:$scope.sceneInfo.nasid,                
                                devSN:$scope.sceneInfo.sn,
                                phoneNum:row.phoneNum,
                                config:{
                                    enable:true                             
                                }
                            }         
                        }).success(function(response){ 
                            if(response.retCode==0){
                                $alert.msgDialogSuccess(getRcString("OPEN_SUC"));                             
                            }else{
                                $alert.msgDialogError(getRcString("OPEN_FAL"),'error');               
                            }
                        }).error(function(response){
                            $alert.msgDialogError(getRcString("OPEN_FAL"),'error');               
                        }); 
                   }            
                }
            })

            $http.get("../noticesetting88/views/cn/toggle.html").success(function (data) {             
                    $scope.html = data;
                    $scope.$on('expanded-row.bs.table#smsTable', function (e, data) {
                        g_phoneNum=data.row.phoneNum;            
                        var $ele = $compile($scope.html)($scope);
                        data.el.append($ele);

                        $scope.info.modifyWechatMax=data.row.maxTimes;
                        $("#modifyWechatStart").val(setTime(data.row.allowedTime[0].start));
                        $("#modifyWechatEnd").val(setTime(data.row.allowedTime[0].end));
                        $scope.info.modifyWechatEnd=PrefixInteger(parseInt(data.row.allowedTime[0].end/60),2)+":"+PrefixInteger(data.row.allowedTime[0].end%60,2);
                        $scope.info.modifyWorkday=(data.row.allowedDays.indexOf(1)==-1)?false:true;
                        $scope.info.modifySaturday=(data.row.allowedDays.indexOf(6)==-1)?false:true;
                        $scope.info.modifySunday=(data.row.allowedDays.indexOf(0)==-1)?false:true;
                        $scope.info.modifyAp=(data.row.noticeType.indexOf("W0010001")==-1)?false:true;
                        $scope.info.modifyApOffline=(data.row.noticeType.indexOf("W0010002")==-1)?false:true;
                        $scope.info.modifyEquipment=(data.row.noticeType.indexOf("W0010003")==-1)?false:true;
                        $scope.info.modifyMemory=(data.row.noticeType.indexOf("W0010006")==-1)?false:true;
                        $scope.info.modifyCPU=(data.row.noticeType.indexOf("W0010007")==-1)?false:true;
                        $scope.info.modifySoftware=(data.row.noticeType.indexOf("W0010008")==-1)?false:true;

                        $('#datetimepicker1').datetimepicker({         
                            format: 'HH:mm'
                        });
                        $('#datetimepicker2').datetimepicker({         
                            format: 'HH:mm'
                        });
                        $("#datetimepicker1,#datetimepicker2").bind("dp.change",function(){           
                            $("#modifySubmit").attr("disabled",false);                
                        });
                    });                   
            });

            //添加短信配置modal
            $scope.addSmsModal={
                options:{
                     mId:'addSmsModal',
                     title:getRcString('add_phoneNum'),                          
                     autoClose: true,                         
                     showCancel: false, 
                     modalSize:"lg",                        
                     buttonAlign: 'center',
                     showFooter:false,                      
                     okHandler: function(modal,$ele){
                     //点击确定按钮事件，默认什么都不做
                     },
                     cancelHandler: function(modal,$ele){
                     //点击取消按钮事件，默认什么都不做
                     },
                     beforeRender: function($ele){
                     //渲染弹窗之前执行的操作,$ele为传入的html片段
                        return $ele;
                     }
                }
            }

            //获取微信&app设置
            $http({
                url:"/v3/subscribemgr/getNoDisturb",
                method:'POST', 
                data:{                                 
                    nasID:$scope.sceneInfo.nasid,                
                    devSN:$scope.sceneInfo.sn
                }         
            }).success(function(response){
                if(response){
                    for(var i=0,len=response.length;i<len;i++){
                        if(response[i].type=="wechat"){
                            $scope.wechatNoticeEnable=response[i].enable;
                            if($scope.wechatNoticeEnable==false){
                                $scope.weixinTimer=false;

                                $("#wechatSwitch").removeClass("checked");
                            }else{
                                $scope.weixinTimer=true;
                                $("#wechatSwitch").addClass("checked");
                            }

                            $scope.info.wechatMax=response[i].times;
                            $("#wechatStart").val(setTime(response[i].allowedTime[0].start));
                            $("#wechatEnd").val(setTime(response[i].allowedTime[0].end));
                            $scope.info.wechatWorkday=(response[i].allowedDays.indexOf(1)==-1)?false:true;
                            $scope.info.wechatSaturday=(response[i].allowedDays.indexOf(6)==-1)?false:true;
                            $scope.info.wechatSunday=(response[i].allowedDays.indexOf(0)==-1)?false:true;
                        }else if(response[i].type=="lvzhouchat"){
                            $scope.appNoticeEnable=response[i].enable;
                            if($scope.appNoticeEnable==false){
                                $scope.appTimer=false;
                                $("#appSwitch").removeClass("checked");
                            }else{
                                $scope.appTimer=true;
                                $("#appSwitch").addClass("checked");
                            }


                            $("#appStart").val(setTime(response[i].allowedTime[0].start));
                            $("#appEnd").val(setTime(response[i].allowedTime[0].end)); $scope.info.appWorkday=(response[i].allowedDays.indexOf(1)==-1)?false:true;
                            $scope.info.appSaturday=(response[i].allowedDays.indexOf(6)==-1)?false:true;
                            $scope.info.appSunday=(response[i].allowedDays.indexOf(0)==-1)?false:true;                  
                        }
                    }
                }
            }).error(function(response){               
            });

            //获取通知类型
            $http({
                url:"/v3/subscribemgr/getNoticeOption",
                method:'POST', 
                data:{                                 
                    nasID:$scope.sceneInfo.nasid,                
                    devSN:$scope.sceneInfo.sn
                }         
            }).success(function(response){
                if(response){
                    for(var i=0;i<response.length;i++){
                        switch(response[i].type){
                            case "W0010001":
                                $scope.info.wechatAP=response[i].noticeType.wechat;
                                $scope.info.appAP=response[i].noticeType.lvzhouchat;
                                break;
                            case "W0010002":
                                $scope.info.wechatAPOffline=response[i].noticeType.wechat;
                                $scope.info.appAPOffline=response[i].noticeType.lvzhouchat;
                                break;
                            case "W0010003":
                                $scope.info.wechatEquipment=response[i].noticeType.wechat;
                                $scope.info.appEquipment=response[i].noticeType.lvzhouchat;
                                break;
                            case "W0010006":
                                $scope.info.wechatMemory=response[i].noticeType.wechat;
                                $scope.info.appMemory=response[i].noticeType.lvzhouchat;
                                break;
                            case "W0010007":
                                $scope.info.wechatCPU=response[i].noticeType.wechat;
                                $scope.info.appCPU=response[i].noticeType.lvzhouchat;
                                break;
                            case "W0010008":
                                $scope.info.wechatSoftware=response[i].noticeType.wechat;
                                $scope.info.appSoftware=response[i].noticeType.lvzhouchat;
                                break;                   
                        }
                    }
                 } 
            }).error(function(response){               
            });

            //绑定说明modal
            $scope.bindNoticeModal={
                options:{
                     mId:'bindNoticeModal',
                     title:getRcString('bind_notice'),                          
                     autoClose: true,                         
                     showCancel: false, 
                     modalSize:"normal",                        
                     buttonAlign: 'center',                    
                     okHandler: function(modal,$ele){
                     //点击确定按钮事件，默认什么都不做
                     },
                     cancelHandler: function(modal,$ele){
                     //点击取消按钮事件，默认什么都不做
                     },
                     beforeRender: function($ele){
                     //渲染弹窗之前执行的操作,$ele为传入的html片段
                        return $ele;
                     }
                }
            }         
        //  =========================页面初始化结束==============================
        
        	
        //  =========================修改开始==============================
            //添加短信配置
            $scope.smsSubmit=function(){
                var weekArr=[];
                var typeArr=[];

                $scope.smsInfo.workday==true?weekArr.push(1,2,3,4,5):"";
                $scope.smsInfo.saturday==true?weekArr.push(6):"";
                $scope.smsInfo.sunday==true?weekArr.push(0):"";
                $scope.smsInfo.AP==true?typeArr.push("W0010001"):"";
                $scope.smsInfo.APOffline==true?typeArr.push("W0010002"):"";
                $scope.smsInfo.equipment==true?typeArr.push("W0010003","W0010004","W0010005"):"";
                $scope.smsInfo.memory==true?typeArr.push("W0010006"):"";
                $scope.smsInfo.CPU==true?typeArr.push("W0010007"):"";
                $scope.smsInfo.software==true?typeArr.push("W0010008","W0010009"):"";

                if(getTime($("#smsStart").val())>getTime($("#smsEnd").val())&&getTime($("#smsEnd").val())!=0){
                    $alert.msgDialogError(getRcString("TIME_ERR"),'error');
                }else if(typeArr.length==0){
                    $alert.msgDialogError(getRcString("TYPE_ERR"),'error');
                }else{
                    if(g_phoneNums.indexOf($scope.smsInfo.phoneNum)==-1 ){
                        $http({
                           url:"/v3/ace/oasis/oasis-rest-sms/restapp/user/checkPhoneCode?user_name="+$scope.userInfo.user,
                           method:"POST",
                           data:{
                                phone:$scope.smsInfo.phoneNum,
                                checkCode:$scope.smsInfo.captcha
                           }
                        }).success(function(response){  
                            if(response.code==0){
                                setSmsNoticeOption();
                            }else{
                                if(response.message=="90秒内请勿重复发送"){
                                   $scope.captchaError3=true; 
                                }else if(response.message=="手机验证码已过期，请重新获取"){
                                    $scope.captchaError2=true;
                                }else{
                                    $scope.captchaError=true;
                                }
                            }
                        }).error(function(response){               
                        });

                        function setSmsNoticeOption(){
                            $http({
                                url:"/v3/subscribemgr/setSmsNoticeOption",
                                method:'POST', 
                                data:{                                 
                                    nasID:$scope.sceneInfo.nasid,                
                                    devSN:$scope.sceneInfo.sn,
                                    phoneNum:$scope.smsInfo.phoneNum,
                                    config:{
                                        enable:true,
                                        allowedTime:[{start:getTime($("#smsStart").val()),end:getTime($("#smsEnd").val())}],
                                        allowedDays:weekArr,
                                        noticeType:typeArr,
                                        maxTimes:$scope.smsInfo.maxTimes==""?10:$scope.smsInfo.maxTimes,
                                    }                            
                                }         
                            }).success(function(response){  
                                if(response.retCode==0){
                                    $alert.msgDialogSuccess(getRcString("ADD_SUC"));
                                    $scope.$broadcast('hide#addSmsModal',$scope); 
                                    $scope.$broadcast('refresh#smsTable');
                                    clearInterval(intervalCaoptcha);
                                    $scope.captchaEnable=false;
                                }
                            }).error(function(response){               
                            });  
                        }                    
                    }else{
                        $alert.msgDialogError(getRcString("repetition"),'error');
                    }
                    }               
            }

            //修改短信配置 
            $scope.modifySubmit=function(){

                var weekArr=[];
                var typeArr=[];

                $scope.info.modifyWorkday==true?weekArr.push(1,2,3,4,5):"";
                $scope.info.modifySaturday==true?weekArr.push(6):"";
                $scope.info.modifySunday==true?weekArr.push(0):"";
                $scope.info.modifyAp==true?typeArr.push("W0010001"):"";
                $scope.info.modifyApOffline==true?typeArr.push("W0010002"):"";
                $scope.info.modifyEquipment==true?typeArr.push("W0010003","W0010004","W0010005"):"";
                $scope.info.modifyMemory==true?typeArr.push("W0010006"):"";
                $scope.info.modifyCPU==true?typeArr.push("W0010007"):"";
                $scope.info.modifySoftware==true?typeArr.push("W0010008","W0010009"):"";

                if(getTime($("#modifyWechatStart").val())>getTime($("#modifyWechatEnd").val())&&getTime($("#modifyWechatEnd").val())!=0
                    ){
                    $alert.msgDialogError(getRcString("TIME_ERR"),'error');
                }else if(typeArr.length==0){
                    $alert.msgDialogError(getRcString("TYPE_ERR"),'error');
                }else{
                    $http({
                        url:"/v3/subscribemgr/setSmsNoticeOption",
                        method:'POST', 
                        data:{                                 
                            nasID:$scope.sceneInfo.nasid,                
                            devSN:$scope.sceneInfo.sn,
                            phoneNum:g_phoneNum,
                            config:{
                                allowedTime:[{start:getTime($("#modifyWechatStart").val()),end:getTime($("#modifyWechatEnd").val())}],
                                allowedDays:weekArr,
                                noticeType:typeArr,
                                maxTimes:$scope.info.modifyWechatMax==null?10:$scope.info.modifyWechatMax,
                            }
                            
                        }         
                    }).success(function(response){  
                        $alert.msgDialogSuccess(getRcString("MODIFY_SUC"));
                        $scope.$broadcast('refresh#smsTable');
                    }).error(function(response){               
                    });
                }
            }
                                
            //修改微信配置
            function modifyWechat(){
                var wechatWeekArr=[];
                var typeArr=[];

                $scope.info.wechatWorkday==true?wechatWeekArr.push(1,2,3,4,5):"";
                $scope.info.wechatSaturday==true?wechatWeekArr.push(6):"";
                $scope.info.wechatSunday==true?wechatWeekArr.push(0):"";
                $scope.info.wechatAP==true?typeArr.push("W0010001"):"";
                $scope.info.wechatAPOffline==true?typeArr.push("W0010002"):"";
                $scope.info.wechatEquipment==true?typeArr.push("W0010003","W0010004","W0010005"):"";
                $scope.info.wechatMemory==true?typeArr.push("W0010006"):"";
                $scope.info.wechatCPU==true?typeArr.push("W0010007"):"";
                $scope.info.wechatSoftware==true?typeArr.push("W0010008","W0010009"):"";

                if(getTime($("#wechatStart").val())>getTime($("#wechatEnd").val())&&getTime($("#wechatEnd").val())!=0){
                    $alert.msgDialogError(getRcString("TIME_ERR"),'error');
                }else if(typeArr.length==0){
                    $alert.msgDialogError(getRcString("TYPE_ERR"),'error');
                }else{
                    $http({
                        url:"/v3/subscribemgr/setNoDisturb",
                        method:'POST', 
                        data:{                                 
                            nasID:$scope.sceneInfo.nasid,                
                            devSN:$scope.sceneInfo.sn,
                            config:[{
                                type:"wechat",
                                enable:$scope.wechatNoticeEnable,
                                times:$scope.info.wechatMax==null?10:$scope.info.wechatMax,
                                allowedDays:wechatWeekArr,
                                allowedTime:[{start:getTime($("#wechatStart").val()),end:getTime($("#wechatEnd").val())}],       
                            }]
                        }         
                    }).success(function(response){  
                        wechatType()
                    }).error(function(response){               
                    }); 
                }

            }
            
            //修改APP配置
            function modifyApp(){
                var appWeekArr=[];
                var typeArr=[];

                $scope.info.appWorkday==true?appWeekArr.push(1,2,3,4,5):"";
                $scope.info.appSaturday==true?appWeekArr.push(6):"";
                $scope.info.appSunday==true?appWeekArr.push(0):"";
                $scope.info.appAP==true?typeArr.push("W0010001"):"";
                $scope.info.appAPOffline==true?typeArr.push("W0010002"):"";
                $scope.info.appEquipment==true?typeArr.push("W0010003","W0010004","W0010005"):"";
                $scope.info.appMemory==true?typeArr.push("W0010006"):"";
                $scope.info.appCPU==true?typeArr.push("W0010007"):"";
                $scope.info.appSoftware==true?typeArr.push("W0010008","W0010009"):"";

                if(getTime($("#appStart").val())>getTime($("#appEnd").val())&&getTime($("#appEnd").val())!=0){
                    $alert.msgDialogError(getRcString("TIME_ERR"),'error');
                }else if(typeArr.length==0){
                    $alert.msgDialogError(getRcString("TYPE_ERR"),'error');
                }else{               
                    $http({
                        url:"/v3/subscribemgr/setNoDisturb",
                        method:'POST', 
                        data:{                                 
                            nasID:$scope.sceneInfo.nasid,                
                            devSN:$scope.sceneInfo.sn,
                            config:[{
                                type:"lvzhouchat",
                                enable:$scope.appNoticeEnable,
                                allowedDays:appWeekArr,
                                allowedTime:[{start:getTime($("#appStart").val()),end:getTime($("#appEnd").val())}],       
                            }]
                        }         
                    }).success(function(response){  
                        appType();
                    }).error(function(response){               
                    });  
                }
            }
            
            //修改通知类型
            function wechatType(){
                $http({
                    url:"/v3/subscribemgr/getNoticeOption",
                    method:'POST', 
                    data:{                                 
                        nasID:$scope.sceneInfo.nasid,                
                        devSN:$scope.sceneInfo.sn
                    }         
                }).success(function(response){
                    if(response){
                        for(var i=0;i<response.length;i++){
                            switch(response[i].type){
                                case "W0010001":
                                    $scope.info.appAP2=response[i].noticeType.lvzhouchat;
                                    break;
                                case "W0010002":
                                    $scope.info.appAPOffline2=response[i].noticeType.lvzhouchat;
                                    break;
                                case "W0010003":
                                    $scope.info.appEquipment2=response[i].noticeType.lvzhouchat;
                                    break;
                                case "W0010006":
                                    $scope.info.appMemory2=response[i].noticeType.lvzhouchat;
                                    break;
                                case "W0010007":
                                    $scope.info.appCPU2=response[i].noticeType.lvzhouchat;
                                    break;
                                case "W0010008":
                                    $scope.info.appSoftware2=response[i].noticeType.lvzhouchat;
                                    break;                   
                            }
                        }

                        $http({
                            url:"/v3/subscribemgr/setNoticeOption",
                            method:'POST', 
                            data:{                                 
                                nasID:$scope.sceneInfo.nasid,                
                                devSN:$scope.sceneInfo.sn,
                                config:[
                                    {
                                        type:"W0010001",
                                        noticeType:{
                                            lvzhouchat:$scope.info.appAP2,
                                            wechat:$scope.info.wechatAP
                                        }
                                    },
                                    {
                                        type:"W0010002",
                                        noticeType:{
                                            wechat:$scope.info.wechatAPOffline,
                                            lvzhouchat:$scope.info.appAPOffline2,
                                        }
                                    },
                                    {
                                        type:"W0010003",
                                        noticeType:{
                                            wechat:$scope.info.wechatEquipment,
                                            lvzhouchat:$scope.info.appEquipment2,
                                        }
                                    },
                                    {
                                        type:"W0010004",
                                        noticeType:{
                                            wechat:$scope.info.wechatEquipment,
                                            lvzhouchat:$scope.info.appEquipment2,
                                        }
                                    },
                                    {
                                        type:"W0010005",
                                        noticeType:{
                                            wechat:$scope.info.wechatEquipment,
                                            lvzhouchat:$scope.info.appEquipment,
                                        }
                                    },
                                    {
                                        type:"W0010006",
                                        noticeType:{
                                            wechat:$scope.info.wechatMemory,
                                            lvzhouchat:$scope.info.appMemory2,
                                        }
                                    },
                                    {
                                        type:"W0010007",
                                        noticeType:{
                                            wechat:$scope.info.wechatCPU,
                                            lvzhouchat:$scope.info.appCPU2,
                                        }
                                    },
                                    {
                                        type:"W0010008",
                                        noticeType:{
                                            wechat:$scope.info.wechatSoftware,
                                            lvzhouchat:$scope.info.appSoftware2,
                                        }
                                    },
                                    {
                                        type:"W0010009",
                                        noticeType:{
                                            wechat:$scope.info.wechatSoftware,
                                            lvzhouchat:$scope.info.appSoftware2,
                                        }
                                    }
                                ]
                            }         
                        }).success(function(response){  
                           $alert.msgDialogSuccess(getRcString("MODIFY_SUC")); 
                        }).error(function(response){               
                        }); 
                     } 
                }).error(function(response){               
                });

                
            }       

            function appType(){
                $http({
                    url:"/v3/subscribemgr/getNoticeOption",
                    method:'POST', 
                    data:{                                 
                        nasID:$scope.sceneInfo.nasid,                
                        devSN:$scope.sceneInfo.sn
                    }         
                }).success(function(response){
                    if(response){
                        for(var i=0;i<response.length;i++){
                            switch(response[i].type){
                                case "W0010001":
                                    $scope.info.wechatAP2=response[i].noticeType.wechat;
                                    break;
                                case "W0010002":
                                    $scope.info.wechatAPOffline2=response[i].noticeType.wechat;
                                    break;
                                case "W0010003":
                                    $scope.info.wechatEquipment2=response[i].noticeType.wechat;
                                    break;
                                case "W0010006":
                                    $scope.info.wechatMemory2=response[i].noticeType.wechat;
                                    break;
                                case "W0010007":
                                    $scope.info.wechatCPU2=response[i].noticeType.wechat;
                                    break;
                                case "W0010008":
                                    $scope.info.wechatSoftware2=response[i].noticeType.wechat;
                                    break;                   
                            }
                        }

                        $http({
                            url:"/v3/subscribemgr/setNoticeOption",
                            method:'POST', 
                            data:{                                 
                                nasID:$scope.sceneInfo.nasid,                
                                devSN:$scope.sceneInfo.sn,
                                config:[
                                    {
                                        type:"W0010001",
                                        noticeType:{
                                            lvzhouchat:$scope.info.appAP,
                                            wechat:$scope.info.wechatAP2
                                        }
                                    },
                                    {
                                        type:"W0010002",
                                        noticeType:{
                                            lvzhouchat:$scope.info.appAPOffline,
                                            wechat:$scope.info.wechatAPOffline2
                                        }
                                    },
                                    {
                                        type:"W0010003",
                                        noticeType:{
                                            lvzhouchat:$scope.info.appEquipment,
                                            wechat:$scope.info.wechatEquipment2
                                        }
                                    },
                                    {
                                        type:"W0010004",
                                        noticeType:{
                                            lvzhouchat:$scope.info.appEquipment,
                                            wechat:$scope.info.wechatEquipment2
                                        }
                                    },
                                    {
                                        type:"W0010005",
                                        noticeType:{
                                            lvzhouchat:$scope.info.appEquipment,
                                            wechat:$scope.info.wechatEquipment2
                                        }
                                    },
                                    {
                                        type:"W0010006",
                                        noticeType:{
                                            lvzhouchat:$scope.info.appMemory,
                                            wechat:$scope.info.wechatMemory2
                                        }
                                    },
                                    {
                                        type:"W0010007",
                                        noticeType:{
                                            lvzhouchat:$scope.info.appCPU,
                                            wechat:$scope.info.wechatCPU2
                                        }
                                    },
                                    {
                                        type:"W0010008",
                                        noticeType:{
                                            lvzhouchat:$scope.info.appSoftware,
                                            wechat:$scope.info.wechatSoftware2
                                        }
                                    },
                                    {
                                        type:"W0010009",
                                        noticeType:{
                                            lvzhouchat:$scope.info.appSoftware,
                                            wechat:$scope.info.wechatSoftware2
                                        }
                                    }
                                ]
                            }         
                        }).success(function(response){  
                           $alert.msgDialogSuccess(getRcString("MODIFY_SUC")); 
                        }).error(function(response){               
                           $alert.msgDialogSuccess(getRcString("MODIFY_FAL")); 
                        }); 
                     } 
                }).error(function(response){               
                });              
            } 
        //  =========================修改结束==============================
        

        //  =========================事件开始==============================
            //修改APP&微信设置
            $scope.setSubmit=function(){
                modifyWechat();
            }

            $scope.appSubmit=function(){
                modifyApp();
            }
            

            function getTime(val){
                var timeVal=val.split(" ")[0];
                return parseInt(timeVal.split(":")[0]*60)+parseInt(timeVal.split(":")[1]);                        
                
            }


            $scope.$on('show.bs.modal#addSmsModal', function () {
               $('#datetimepicker01').datetimepicker({      
                    format: 'HH:mm' 
                });
                $('#datetimepicker02').datetimepicker({         
                    format: 'HH:mm'
                }); 
            })

            $scope.$on('hidden.bs.modal#addSmsModal', function () {
                $scope.smsInfo={
                    phoneNum:"",
                    maxTimes:10,
                    workday:true,
                    saturday:false,
                    sunday:false,
                    AP:true,
                    equipment:true,
                    memory:true,
                    CPU:true,
                    software:true,
                    interval:getRcString("captcha")
                }

                $scope.captchaError=false;
                $scope.smsForm.$setPristine();
                $scope.smsForm.$setUntouched(); 
            })

        	//勿扰设置
            $scope.captchaEnable=false;
            $scope.captchaError=false;

        	$scope.wechatNotice= function() {
	            $scope.weixinTimer = !$scope.weixinTimer;
	            $scope.wechatNoticeEnable=!$scope.wechatNoticeEnable;
                $scope.undistrupForm.$pristine=false;
	        }
	        $scope.smsNotice= function() {
	            $scope.smsTimer = !$scope.smsTimer;
	            $scope.smsNoticeEnable=!$scope.smsNoticeEnable;
                $scope.undistrupForm.$pristine=false;
	        }
	        $scope.appNotice= function() {
	            $scope.appTimer = !$scope.appTimer;
	            $scope.appNoticeEnable=!$scope.appNoticeEnable;
                $scope.appForm.$pristine=false;
	        }

	        //通知设置
	        $scope.equipmentOn=false;
	        $scope.equipmentOff=false;
	        $scope.APOn=false;
	        $scope.APOff=false;
	        $scope.equipmentReload=false;
	        $scope.memoryAlarm=false;
	        $scope.CPUAlarm=false;
	        $scope.updateSuc=false;
	        $scope.updateFal=false;

	        $scope.equipmentOnEnable=false;
	        $scope.equipmentOffEnable=false;
	        $scope.APOnEnable=false;
	        $scope.APOffEnable=false;
	        $scope.equipmentReloadEnable=false;
	        $scope.memoryAlarmEnable=false;
	        $scope.CPUAlarmEnable=false;
	        $scope.updateSucEnable=false;
	        $scope.updateFalEnable=false;
	        
	        $scope.equipmentOnChange= function() {
	            $scope.equipmentOn = !$scope.equipmentOn;
	            $scope.equipmentOnEnable = !$scope.equipmentOnEnable;
                $scope.noticeForm.$pristine=false;
            }
            $scope.equipmentOffChange= function() {
                $scope.equipmentOff = !$scope.equipmentOff;
                $scope.equipmentOffEnable = !$scope.equipmentOffEnable;
                $scope.noticeForm.$pristine=false;
            }
            $scope.APOnChange= function() {
                $scope.APOn = !$scope.APOn;
                $scope.APOnEnable = !$scope.APOnEnable;
                $scope.noticeForm.$pristine=false;
            }
            $scope.APOffChange= function() {
                $scope.APOff = !$scope.APOff;
                $scope.APOffEnable = !$scope.APOffEnable;
                $scope.noticeForm.$pristine=false;
            }
            $scope.equipmentReloadChange= function() {
                $scope.equipmentReload = !$scope.equipmentReload;
                $scope.equipmentReloadEnable = !$scope.equipmentReloadEnable;
                $scope.noticeForm.$pristine=false;
            }
            $scope.memoryAlarmChange= function() {
                $scope.memoryAlarm = !$scope.memoryAlarm;
                $scope.memoryAlarmEnable = !$scope.memoryAlarmEnable;
                $scope.noticeForm.$pristine=false;
            }
            $scope.CPUAlarmChange= function() {
                $scope.CPUAlarm = !$scope.CPUAlarm;
                $scope.CPUAlarmEnable = !$scope.CPUAlarmEnable;
                $scope.noticeForm.$pristine=false;
            }
            $scope.updateSucChange= function() {
                $scope.updateSuc = !$scope.updateSuc;
                $scope.updateSucEnable = !$scope.updateSucEnable;
                $scope.noticeForm.$pristine=false;
            }
            $scope.updateFalChange= function() {
                $scope.updateFal = !$scope.updateFal;
                $scope.updateFalEnable = !$scope.updateFalEnable;
                $scope.noticeForm.$pristine=false;
	        }
	        $scope.bindNotice=function(){
                $scope.$broadcast('show#bindNoticeModal',$scope); 
            }
            $scope.addSms=function(){
                $scope.$broadcast('show#addSmsModal',$scope);              
            }

            //短信认证
            var i=0;
            $scope.getCaptcha=function(){            
                
                    $scope.captchaEnable=true;
                    $scope.smsInfo.interval="("+90+")s";
                    intervalCaoptcha=setInterval(function(){                
                        i++;
                        var j=90-i; 

                        if(j>0){                     
                            $scope.$apply(function(){
                                $scope.captchaEnable=true;
                                $scope.smsInfo.interval="("+j+")s";  
                            })                                     
                        }else{
                            clearInterval(intervalCaoptcha);
                            intervalCaoptcha=null; 
                            $scope.$apply(function(){                    
                                $scope.captchaEnable=false; 
                                $scope.smsInfo.interval=getRcString("captcha"); 
                            }) 
                            i=0;
                        }
                    },1000)

                    $http({
                        url:"/v3/ace/oasis/oasis-rest-sms/restapp/user/getPhoneCode",
                        method:'POST', 
                        data:{
                            phone:$scope.smsInfo.phoneNum
                        }    
                    }).success(function(response){  
                        
                    }).error(function(response){               
                    }); 
                
            }

            
            $("#datetimepicker3,#datetimepicker4").bind("dp.change",function(){           
                $("#setSubmit").attr("disabled",false);                
            });

            $("#datetimepicker5,#datetimepicker6").bind("dp.change",function(){           
                $("#appSubmit").attr("disabled",false);                
            });

            $scope.$watch('smsForm.phoneNum.$invalid',function(v){      
                if(v==false){
                   $scope.captchaEnable=false; 
               }else{
                   $scope.captchaEnable=true; 
               }
            });

        //  =========================事件结束==============================                         
    }]
});