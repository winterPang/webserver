define(['echarts','utils','angular-ui-router','bsTable'], function (echarts, Utils){
    return ['$scope', '$http', '$window', '$alertService', '$state', function ($scope, $http, $window,$){

        function getRcString(attrName){
            return Utils.getRcString("clients_rc",attrName).split(',');
        }

        $scope.tableOptions = {
            tId: 'base',
            sidePagination: "server",
            contentType: "application/json",
            dataType: "json",
            apiVersion: "v3",
            method: "post",
            totalField: "count_total",
            dataField: "apList",
            //showPageList: false,
            url: "/v3/apmonitor/app/aplist_page?devSN=" + $scope.sceneInfo.sn,
            searchable: true,
            responseHandler: function (data) {
                angular.forEach(data.apList, function (value) {
                    value.clientCount = value.client5GNum + value.client24GNum;
                    var radioText = "";
                    angular.forEach(value.radioList, function (value) {
                        radioText += ( value.radioMode + "Hz(" + value.radioId + ")," );
                    });
                    value.radioText = radioText.slice(0, radioText.length - 1);;
                });
                return data;
            },
            columns: [
                {title: getRcString("LIST_HEADER")[0],field:'apName',sortable:true,render: '<a class="list-link">{apName}</a>', searcher: {}},
                //{title: getRcString("LIST_HEADER")[1],field:'apModel',sortable:true, searcher: {}},
                {title: getRcString("LIST_HEADER")[2],field:'apSN',sortable:true, searcher: {}},
                {title: getRcString("LIST_HEADER")[3],field:'apGroupName',sortable:true, searcher: {}},
                {title: getRcString("LIST_HEADER")[4],field:'radioText',sortable:false},
                {title: getRcString("LIST_HEADER")[5],field:'status',sortable:true, searcher: {
                    type: "select",
                    valueField: "value",
                    textField: "text",
                    data: [
                        {value: 1, text: getRcString("STATUS")[0]},
                        {value: 2, text: getRcString("STATUS")[1]},
                        {value: 3, text: getRcString("STATUS")[2]},
                        {value: 4, text: getRcString("STATUS")[3]}
                    ]},
                    formatter: function (value) {
                        if (value == 1) {
                            return getRcString("STATUS")[0];
                        } else if (value == 2) {
                            return getRcString("STATUS")[1];
                        } else if (value == 3) {
                            return getRcString("STATUS")[2];
                        } else {
                            return getRcString("STATUS")[3];
                        }
                    }
                },
                {title: getRcString("LIST_HEADER")[6],field:'onlineTime',sortable:true},
                {title: getRcString("LIST_HEADER")[7],field:'clientCount'}
            ],
            onClickCell:function(field,val,row,$td){
                if (field != "apName") {return;}
                $scope.modalData = row;
                $scope.modalData.transmitTraffic = parseInt($scope.modalData.transmitTraffic);
                $scope.modalData.receiveTraffic = parseInt($scope.modalData.receiveTraffic);
                switch($scope.modalData.status){
                    case 1:
                        $scope.modalData.apStatus = getRcString("STATUS")[0];
                        break;
                    case 2:
                        $scope.modalData.apStatus = getRcString("STATUS")[1];
                        break;
                    case 3:
                        $scope.modalData.apStatus = getRcString("STATUS")[2];
                        break;
                    default:
                        $scope.modalData.apStatus = getRcString("STATUS")[3];
                        break;
                }
                $scope.showModal();
            }
        };
        $scope.modalOptions = {
            mId:'apDetail',
            title:getRcString("MODAL_TITLE")[0],
            showCancel: true ,
            cancelText: getRcString("close")[0],
            showOk:false,
            modalSize:'lg' ,
            showHeader:true   ,
            showFooter:true  ,
            showClose:true
        };

        $scope.showModal = function (){
            $scope.$broadcast('show#apDetail');
        };
    }];
});