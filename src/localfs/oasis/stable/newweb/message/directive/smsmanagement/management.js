define(['angularAMD',
        'bootstrap-table-CN',
        'bootstrapValidator'], function (app,$) {
    var sLang = (function(){
        var c = document.cookie;
        var idx = c.indexOf('lang');
        return idx === -1
                        ? 'cn'
                        : c.slice(idx + 5,idx + 7)
    })()
    var URL_TEMPLATE_FILE = sprintf('../message/directive/smsmanagement/views/%s/management.html', sLang);

    app.directive('smsManagement',[ '$http',
                                    '$alertService',
                                    '$state',
                                    '$rootScope',
                                    '$timeout',function ($http,
                                                         $alert,
                                                         $state,
                                                         $rootScope,
                                                         $timeout) {
        return {
            restrict:'E',
            templateUrl:URL_TEMPLATE_FILE,
            replace:false,
            scope:true,
            link:function (s, e, a, c) {
                function getRcString(attrName) {
                    return document.getElementById('smsmanagement_rc').getAttribute(attrName);
                }
                var modalData = getRcString('modal-data').split(',');
                var msgDialogData = getRcString('msgDialog-data').split(',');
                var tableData = getRcString('table-data').split(',');
                var URL_GET_SMS = '/v3/ace/oasis/oasis-rest-sms/restapp/sms/?orderby=userName&ascending=true&queryCondition=&user_name=' + $rootScope.userInfo.user;
                var URL_PUT_SMS_MODIFY = '/v3/ace/oasis/oasis-rest-sms/restapp/sms/update?user_name=' + $rootScope.userInfo.user;

                s.managementOptions = {
                    tId: 'SMSmanagement',
                    showPageList: false,
                    url: URL_GET_SMS,
                    sidePagination: 'server',
                    queryParams: function (params) {
                        params.start = params.offset + 1;
                        return params;
                    },
                    responseHandler: function (data) {
                        if (!data) {
                            return;
                        }
                        if (data.code == 0) {
                            return {
                                total: data.data.rowCount,
                                rows: data.data.data
                            };
                        } else {
                            return {
                                total: 0,
                                rows: []
                            };
                        }
                    },
                    columns: [
                        {sortable: true, field: 'userName', title: tableData[0]},
                        {sortable: true, field: 'sendCount', title: tableData[1]},
                        {sortable: true, field: 'notSendCount', title: tableData[2]},
                        {sortable: true, field: 'signature', title: tableData[3]},
                        {
                            field: 'modify', title: tableData[4], formatter: function (val, row, index) {
                            return '<a style="cursor:pointer;"><span class="glyphicon glyphicon-pencil"></span></a>';
                        }
                        }
                    ]
                };
                s.row = {};
                s.modify_management = {
                    mId: 'modify_signature',
                    title: modalData[0],
                    autoClose: false,
                    showCancel: true,
                    modalSize: 'normal',
                    showHeader: true,
                    showFooter: true,
                    okText: modalData[1],
                    cancelText: modalData[2],
                    okHandler: function (modal, $ele) {
                        var modify_data = {
                            id: $scope.clickRow.id,
                            signature: $scope.row.signature,
                        };
                        $http.put(URL_PUT_SMS_MODIFY, JSON.stringify(modify_data)).success(function (data) {
                            if (!data) {
                                return;
                            }
                            if (data.code == 0) {

                            } else {
                                $alert.noticeDanger(data.message);
                            }
                            modal.hide();
                        }).error(function (msg) {
                            $alert.msgDialogError(msg || msgDialogData[0]);
                        })
                    }
                };
                s.$on('hidden.bs.modal#modify_signature', function (e, field, value, row, $element) {
                    $scope.$apply(function () {
                        $scope.refresh();
                        $scope.row.signature = "";
                        $scope.signatureModify.$setPristine();
                        $scope.signatureModify.$setUntouched();
                        $scope.$broadcast('enable.ok#modify_signature');
                    })
                });
                s.$on('click-cell.bs.table#SMSmanagement', function (e, field, value, row, $element) {
                    if (field == "modify") {
                        $scope.$broadcast('show#modify_signature');
                    }
                    $scope.clickRow = row;
                });
                s.refresh = function () {
                    s.$broadcast('refresh#SMSmanagement', {
                        url: URL_GET_SMS
                    });
                }
            }
        }
    }])
});
