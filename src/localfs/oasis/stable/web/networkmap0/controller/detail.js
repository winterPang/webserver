/**
 * Created by Administrator on 2017/3/20.
 */
define(['jquery','utils','angular-ui-router','bsTable',
    'networkmap0/lib/jtopo-min','networkmap0/directive/index_page','css!networkmap0/css/map.css','css!networkmap0/css/page.css'],function($,Utils) {
    return ['$scope','$http','$state','$stateParams','$alertService',
        '$compile',function($scope,$http,$state,$stateParams,$alert,$compile){
        var g_AP = [];
        $scope.region = "region";
        function getRcString(attrName){
            return Utils.getRcString("page_rc",attrName).split(',');
        }
        function getImage(mapName){
            return $http({
                method:"POST",
                url:"/v3/wloc/image/getMap",
                data:{
                    'devSN':$scope.sceneInfo.sn,
                    'mapName': mapName
                }
            }).success(function(data){
                cBack(data);
            }).error(function(data){
                cBack("");
            });
        }
        function updatebgImageNew() {
            var image = $("#picture").attr("src");
            var data = new Date();
            var imageName = data.getTime();
            var formData = new FormData();
            var mapName = $("#mapName").val();

            formData.append("devSN", $scope.sceneInfo.sn);
            formData.append("mapName", mapName);
            formData.append("imgData", image);
            formData.append("imageName", imageName);

            var xhr = new XMLHttpRequest();
            xhr.open('POST', "/v3/wloc/backgroundnew");
            xhr.send(formData);
            //console.log("111111111111状态"+xhr.status);
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    console.log("create bg short cut success");
                    $scope.$broadcast('hide#map_add');
                    $scope.refresh();
                }
            }

        }
        function getMapInfo(pageNum) {
            return $http({
                method:"POST",
                url:"/v3/wloc",
                data:{
                    Method: "getMapInfo",
                    Param: {
                               devSN: $scope.sceneInfo.sn,
                               startRowIndex: 4 * (pageNum - 1),
                               maxItem: 4
                    }
                }
            }).success(function(data){
                cBack(data);
            }).error(function(data){
                cBack("");
            });

        }
        $scope.refresh=function(){
            //initData(1);
            //$state.reload();
            $scope.$broadcast('regionRefresh');
        }
        /**
         * 重置表单
         */
        $scope.$on('hidden.bs.modal#map_add', function () {
            // debugger
          
            // 重置表单
            $scope.addForm.mapName.$setPristine();
            $scope.addForm.mapName.$setUntouched();
            $scope.addForm.scaleValue.$setPristine();
            $scope.addForm.scaleValue.$setUntouched();
        });
        $scope.addmap = function(){
            $("#mapName,#scaleValue").val("");
            $("#upload_file").val("");
            $("#picture").attr("src","");
            $("#file_error,#mapScale_error,#mapName_error").css("display","none");
            $scope.addForm.$setPristine();
            $scope.addForm.$setUntouched();
            $scope.$broadcast('show#map_add');
        }
        
        $scope.mapAdd={
            options:{
                mId:'map_add',
                title:getRcString("ADDMAP_TITLE")[0],
                autoClose: false,
                 /*showCancel: true,
                 showFooter:false,
                 buttonAlign: "center",*/
                modalSize:'lg',
                okHandler: function(modal,$ele){
                    var mapName = $("#mapName").val();
                    var image = $("#picture").attr("src");
                    var areaList = [];
                    var apList = [];
                    var scale = Number($("#scaleValue").val());
                    //var scale = Number($scope.add.scaleValue);
                    var type = "add";
                    var re = /[^\x00-\xff]/ig;
                    var re1 = /\s/ig;
                    var special=/^(([^\^\.<>%&',;=?$\:#@!~\]\[{}\\/`\|])*)$/ig;
                    var regEx = new RegExp(/^(([^\^\.<>%&',;=?$"':#@!~\]\[{}\\/`\|])*)$/);
                    ///^(([^\^\.<>%&',;=?$"':#@!~\]\[{}\\/`\|])*)$/
                    /*var bgInfo = {
                     posX: 0,
                     posY: 0,
                     scale: 1
                     };*/
                    var time = new Date();
                    var oDom = $("[name = addForm]").next().children().eq(0);

                    if(mapName==""){
                        $("#mapName_error").html(getRcString("PARAMMUST_INFO")[0]);
                        $("#mapName_error").css("display","inline-block");
                        return;
                    }
                    if(mapName.match(special)==null){
                        $("#mapName_error").html(getRcString("PARAMSPECIAL_INFO")[0]);
                        $("#mapName_error").css("display","inline-block");
                        return;
                    }
                    if(mapName.match(re1) !==null){
                        $("#mapName_error").html(getRcString("PARAMSKONG_INFO")[0]);
                        $("#mapName_error").css("display","inline-block");
                        return;
                    }
                    //if(Number(scale) <= 0){
                    //    $("#mapScale_error").html(getRcString("SCALE_INFO")[0]);
                    //    $("#mapScale_error").css("display","inline-block");
                    //    return;
                    //}
                    if(Number(scale) < 0.001){
                        $("#mapScale_error").html(getRcString("SCALE_INFO")[0]);
                        $("#mapScale_error").css("display","inline-block");
                        return;
                    }
                    if(Number(scale) > 1000){
                        $("#mapScale_error").html(getRcString("SCALE_INFO")[0]);
                        $("#mapScale_error").css("display","inline-block");
                        return;
                    }

                    //if(mapName.match(re) && mapName.match(re).length >10){
                    //    $("#mapName_error").html("参数输入错误");
                    //    $("#mapName_error").css("display","inline-block");
                    //    return;
                    //}


                    if(image == undefined||image == ""){
                        $("#file_error").html(getRcString("UPLOADPIC_INFO")[0]);
                        $("#file_error").css("display","inline-block");
                        return;
                    }
                    $(oDom[0]).attr("disabled",true);

                    $http({
                        method:"POST",
                        url:"/v3/wloc",
                        data:
                        {
                            Method:"addOrModifyMap",
                            Param:{
                                devSN: $scope.sceneInfo.sn,
                                mapName: mapName,
                                scale: scale,
                                areaList: areaList,
                                apList: apList,
                                type: type
                            }

                        }

                    }).success(function(data){
                        if($(oDom[0]).attr("disabled")){
                            $(oDom[0]).removeAttr("disabled");
                        }
                        if (data.retCode !== 0) {
                            if(data.retCode == -2){
                                $("#mapName_error").css("display","inline-block");
                                $("#mapName_error").html(getRcString("MAPEXIT_INFO")[0]);
                                $("#mapName").focus();
                                //$alert.msgDialogSuccess(getRcString("MAPEXIT_INFO")[0]);
                                //$alert.msgDialogError(getRcString("ADD_FAILED")[0],'error');
                                return;
                            }
                            $alert.msgDialogError(getRcString("ADD_FAILED")[0],'error');
                            //Frame.Msg.info("添加地图失败");
                            //console.log("addMapInfo error errormessage: " + data.errorMessage);

                            return;//粗错
                        }
                        updatebgImageNew();
                        //$state.go('^.edit_apply',{editData:mapName});
                        //$scope.$broadcast('hide#map_add');
                        //$scope.refresh();
                    }).error(function(data){
                        cBack("");
                    });
                },
                cancelHandler: function(modal,$ele){
                    //$("#vertices").val(''),$("#areaName").val(''),$("#areaType").val(6);
                    //$scope.addForm.$setPristine();
                    //$scope.addForm.$setUntouched();
                    //Utils.Pages.closeWindow(Utils.Pages.getWindow($("#verlist")));//关闭窗口
                },
                beforeRender: function($ele){
                    return $ele;
                }
            }
        }

        $scope.uploadfile = function(e){
            //console.log(getObjectURL(e));
            var file = document.getElementById("upload_file");
            var pic = document.getElementById("picture");
            if(window.FileReader){//chrome,firefox7+,opera,IE10+
                var fileSize =file.files[0].size;
                var fileName=file.files[0].name.toLowerCase();
                if(/\.(gif|jpg|jpeg|JPEG|png|GIF|JPG|PNG|bmp|BMP)$/.test(fileName)){
                    //if(fileStyle=="jpg"||fileStyle=="jpeg"||fileStyle=="gif"||fileStyle=="png"||fileStyle=="bmp"){
                    if(fileSize/1048576 > 2){
                        $("#file_error").html(getRcString("PICBIG_INFO")[0]);
                        $("#file_error").css("display","inline-block");
                        $("#picture").attr("src","");
                    }else{
                        $("#file_error").css("display","none");
                        var oFReader = new FileReader();
                        oFReader.readAsDataURL(file.files[0]);
                        oFReader.onload = function (oFREvent) {
                            //console.log(oFREvent.target.result);
                            /*pic.src = oFREvent.target.result;*/
                            pic.src = oFREvent.target.result
                        };
                    }

                }else{
                    $("#file_error").html(getRcString("PICTYPE_ERROR")[0]);
                    $("#file_error").css("display","inline-block");
                    $("#picture").attr("src","");
                }
            }
            else if (document.all) {//IE9-//IE使用滤镜，实际测试IE6设置src为物理路径发布网站通过http协议访问时还是没有办法加载图片
                file.select();
                file.blur();//要添加这句，要不会报拒绝访问错误（IE9或者用ie9+默认ie8-都会报错，实际的IE8-不会报错）
                var reallocalpath = document.selection.createRange().text//IE下获取实际的本地文件路径
                //if (window.ie6) pic.src = reallocalpath; //IE6浏览器设置img的src为本地路径可以直接显示图片
                //else { //非IE6版本的IE由于安全问题直接设置img的src无法显示本地图片，但是可以通过滤镜来实现，IE10浏览器不支持滤镜，需要用FileReader来实现，所以注意判断FileReader先
                pic.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod='image',src=\"" + reallocalpath + "\")";
                pic.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';//设置img的src为base64编码的透明图片，要不会显示红xx
                // }
            }
            else if (file.files) {//firefox6-
                if (file.files.item(0)) {
                    var url = file.files.item(0).getAsDataURL();
                    pic.src = url;
                }
            }
            //$('#upload_img').attr("src", e.name);
        }
        //callBackData(1);
        //initData(1);

        /*$scope.deletemap=function($event){
            var $canvas = $(".img-responsive");
            var $img = $($event.target).parents("div.slist-body").find($canvas);
            var mapName = $img.attr("mapName");
            $alert.confirm(getRcString("DELETE_OR_CANCEL")[0], function () {
                $http({
                    method:'POST',
                    url:'/v3/wloc/delMapAndDirNew',
                    data:{
                        Method: "deleteMap",
                        Param: {
                            mapName: mapName,
                            devSN:  $scope.sceneInfo.sn
                        }
                    }
                }).success(function(data){
                    if (data.retCode !== 0) {
                        //Frame.Msg.info("删除地图失败")
                        $alert.msgDialogError(getRcString("DELETE_FAILED")[0],'error');
                        return;//粗错
                    }
                    console.log("delete map success");
                    //Utils.Base.refreshCurPage();
                    $scope.refresh();
                    $alert.msgDialogSuccess(getRcString("DELETE_SUCCESS")[0]);
                }).error(function(){
                    $alert.msgDialogError(getRcString("FAILURE_RETRY")[0],'error');
                });
            });
        }
        $scope.editmap=function($event){
            var img=$($($($($event.target).parent()).parent()).parent()).parent();
            //var $canvas = $(".img-responsive")[0];
            var img1=$(img).find("canvas");
            var mapName = img1.attr('mapName');
            //Utils.Base.redirect({np: 'position.edit_apply',mapName:mapName});
            //$state.go("^.edit_apply");
            $state.go('^.edit_apply',{editData:mapName});
        }*/
        $('.paging-contain').show();
        }]
});
