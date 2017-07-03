define(['jquery', 'utils', 'moment', 'bootstrap-daterangepicker', 'css!bootstrap_daterangepicker_css'], function ($, Utils, moment) {
    return ['$scope', '$http', '$rootScope', '$alertService', function ($scope, $http, $rootScope, $alert) {
        function getRcString(attrName) {
            return Utils.getRcString("operate_rc", attrName);
        }

        var tableData = getRcString('table-data').split(',');
        var URL_GET_detail = '/v3/ace/oasis/oasis-rest-user/restapp/users/detail';
        var EndValue,StartValue;
        // var operationList;
        $scope.btnStatus = true;
        $http({
            method: 'get',
            url: URL_GET_detail,
            params: {'user_name': $rootScope.userInfo.user}
        }).success(
            function(data){
                var tableUrl = '/v3/ace/oasis/oasis-log/operation_logs/getAllSubLog?userName='+$rootScope.userInfo.user+'&userId='+data.data.id;
                $scope.options = {
                    tId: "theTable",
                    url: tableUrl,
                    columns: [
                        {field: 'operator_name', title: tableData[0]},
                        {field: 'datetime', title: tableData[1]},
                        {field: 'ip', title: tableData[2]},
                        // {field: 'module_name', title: tableData[3]},
                        {
                            field: 'operation', title: tableData[4], formatter: function (val, row, index) {
                            return val && val.replace(/\s/g, '&nbsp;');
                        }
                        },
                        {field: 'result', title: tableData[5]},
                        {field: 'failure_reason', title: tableData[6]}
                    ],
                    sidePagination: 'server',
                    responseHandler: function (res) {

                        //operationList=res.rows;
                        if ((res.rows.length != "0") && (res.code == "0")) {
                            $scope.$apply(function () {
                                $scope.btnStatus = false;
                            })
                        } else {
                            $scope.$apply(function () {
                                $scope.btnStatus = true;
                            })
                        }
                        return res;
                    }
                };
            }
        ).error(function (res) {
            console.log('error');
        });



        $scope.refresh = function () {
            $scope.$broadcast('refresh#theTable');
        };
        $scope.$on('shown.bs.modal#modalDate', function () {
            $('#Bydate').daterangepicker(
                {
                    // singleDatePicker: true,
                    //showDropdowns: true,
                    startDate: moment().startOf("day"),
                    endDate: moment(),
                    maxDate: moment(),
                    dateLimit: {year: 2},
                    timePicker: true,
                    timePicker24Hour: true,
                    timePickerSeconds: true,
                    opens: "center",
                    locale: {
                        format: "YYYY/MM/DD HH:mm:ss",
                        applyLabel: getRcString("DRP_APPLYLABEL"),
                        cancelLabel: getRcString("DRP_CANCELLABEL"),
                        fromLabel: getRcString("DRP_FROMLABEL"),
                        toLabel: getRcString("DRP_TOLABEL"),
                        customRangeLabel: getRcString("DRP_CUSTOMRANGELABEL"),
                        daysOfWeek: getRcString("DRP_DAYSOFWEEK").split(","),
                        monthNames: getRcString("DRP_MONTHNAMES").split(","),
                    }
                },
                function (start, end, label) {
                }
            );
            // https://oasisrd.h3c.com/v3/ace/oasis/oasis-rest-user/restapp/users/getIdByName?user_name=xxx
            $('.applyBtn').click(function () {
                StartValue = $("input[name='daterangepicker_start']").val().replace("/", "-").replace("/", "-");
                EndValue = $("input[name='daterangepicker_end']").val();
                //EndValue =$('#Bydate').val();
                EndValue = EndValue.replace("/", "-");
                EndValue = EndValue.replace("/", "-");
            });

        });
        $scope.option = {
            mId: 'modalDate',
            title: getRcString("DRP_Title"),
            //autoClose: true
            //showCancel: true
            modalSize: 'normal',
            showHeader: true,
            showFooter: true,
            showClose: true,
            okText: getRcString("DRP_APPLYLABEL"),
            cancelText: getRcString("DRP_CANCELLABEL"),
            okHandler: function (modal, $ele) {
                $http({
                    url: "/v3/ace/oasis/oasis-rest-user/restapp/users/getIdByName?user_name=" + $scope.userInfo.user,
                    method: "GET"
                }).success(function (data) {
                    $http({
                        url: "/v3/ace/oasis/oasis-log/operation_logs/deleteLog",
                        method: "post",
                        data: {
                            beginTime:StartValue,
                            "datetime": EndValue,
                            "operator_id": data.data,
                            "operator_name": $scope.userInfo.user

                        }
                    }).success(function(data){
                        if(data.code==0){
                            $alert.noticeSuccess(getRcString("delete-success"));
                        }else{
                            $alert.noticeDanger(data.message);
                        }
                        $scope.$broadcast('refresh#theTable');
                    }).error(function(response){
                      $alert.noticeDanger(getRcString("delete-fail"));
                    });
                })
            },
            cancelHandler: function (modal, $ele) {

            },
            beforeRender: function ($ele) {

                return $ele;
            }
        }
        $scope.delete = function () {
            $scope.$broadcast('show#modalDate');

        }


    }];
});