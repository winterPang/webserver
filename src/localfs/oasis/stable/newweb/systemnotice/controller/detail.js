define(["utils",'!frame/libs/jquery/jqPaginator.min'], function (Utils) {
    return ['$scope', '$http', '$q', '$rootScope', '$state', function ($scope, $http, $q, $rootScope, $state) {
    	function getRcString(attrName) {
            return Utils.getRcString("sysNotice_detail_rc", attrName);
        }

        $http({
            url:"../../init/frame/content.json",
            method:"GET",                   
        }).success(function(response){ 
            $scope.messages2=response;
        }).error(function(response){         
        });

        $scope.detailModal={
            options:{
                 mId:'detailModal',
                 title:getRcString('detail'),                          
                 autoClose: true,                         
                 showCancel: false, 
                 modalSize:"normal",                        
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

        $scope.openModal=function(itemTitle,itemMessage,$event){         
                $(event.target).parents("table.table2").find("span.span1").removeClass('span1').addClass('span3');
                $scope.$broadcast('show#detailModal',$scope);
                $scope.itemTitle=itemTitle;  
                $scope.itemMessage=itemMessage;           
            }

        $scope.changeState=function($event,itemTitle){
            var checkbox = $event.target;
            var action = (checkbox.checked?'add':'remove');
            saveState(action,itemTitle);
        }

        $scope.selected=[];

        function saveState(action,itemTitle){
            if(action == 'add' && $scope.selected.indexOf(itemTitle) == -1){
                $scope.selected.push(itemTitle);
            }
            if(action == 'remove' && $scope.selected.indexOf(itemTitle)!=-1){
                $scope.selected.splice(itemTitle,1);
            }
        }

        $scope.setRead=function(){
            for(var i=0,len=$scope.selected.length;i<len;i++){
                if($("#"+$scope.selected[i]).parents('table').find("span.span1").length>0){
                    $("#"+$scope.selected[i]).parents('table').find("span.span1").removeClass('span1').addClass('span3');
                    
                }
            }
            
        }

       
            $('#pagenation').jqPaginator({
                totalPages: 10,
                currentPage: 3,
                visiblePages:5,

                first: '<li class="first"><a href="javascript:void(0);"><<</a></li>',
                prev: '<li class="prev"><a href="javascript:void(0);"><</a></li>',
                next: '<li class="next"><a href="javascript:void(0);">></a></li>',
                last: '<li class="last"><a href="javascript:void(0);">>></a></li>',
                page: '<li class="page"><a href="javascript:void(0);">{{page}}</a></li>',
                onPageChange: function (num) {
                    $('#text').html('当前第' + num + '页');
                }
            });
        


    }];
});

		