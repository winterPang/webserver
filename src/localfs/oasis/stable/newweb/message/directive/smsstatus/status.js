define(['angularAMD',
    'bootstrap-table-CN',
    'bootstrapValidator',
    './service/addressFormatter',], function (app, $) {
    var sLang = (function(){
        var c = document.cookie;
        var idx = c.indexOf('lang');
        return idx === -1
            ? 'cn'
            : c.slice(idx + 5,idx + 7)
    })();
    var URL_TEMPLATE_FILE = sprintf('../message/directive/smsstatus/views/%s/sms_status.html', sLang);

    app.directive('smsStatus',[ '$http',
        '$alertService',
        '$state',
        '$rootScope',
        'adService',function ($http,
                               $alert,
                               $state,
                               $rootScope,
                               adService) {
            return {
                restrict:'E',
                templateUrl:URL_TEMPLATE_FILE,
                replace:false,
                scope:true,
                link:function (s, e, a, c) {

                    window.adService = adService

                    function getRcString(attr) {
                        return document.getElementById('smsstatus_rc').getAttribute(attr)
                    }
                    var sureDelete = getRcString('sure-delete').split(',');
                    var msgDialogData = getRcString('msgDialog-data').split(',');
                    var tableData = getRcString('table-data').split(',');
                    var URL_GET_SMSSTATE = '/v3/ace/oasis/oasis-rest-sms/restapp/smsstate/?queryCondition=%s&user_name=' + $rootScope.userInfo.user;
                    var URL_DELETE_SMSSTATE = '/v3/ace/oasis/oasis-rest-sms/restapp/smsstate/%s?user_name=' + $rootScope.userInfo.user;

                    s.statusOptions = {
                        tId: 'SMSstatus',
                        url: sprintf(URL_GET_SMSSTATE, ''),
                        sidePagination: 'server',
			            showPageList: true,
                        sortName: 'sendTimeStr',
                        sortOrder: 'desc',
                        queryParams: function (params) {
                            params.start = params.offset + 1;
                            params.ascending = params.order === 'asc';
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
                            {sortable: true, field: 'phone', title: tableData[1]},
                            {sortable: true, field: 'phoneAddress', title: tableData[3], formatter:function (v){
                                return sLang === 'cn' ? v : adService.toEn(v)
                            }
                            },
                            {sortable: true, field: 'phoneType', title: tableData[2]},
                            {
                                sortable: true, field: 'smsContent', title: tableData[4], formatter: function (v) {
                                if (v && v.length > 10) {
                                    return '<span title="' + v + '">' + v.substring(0, 7) + '...</span>';
                                }
                                return v || '';
                            }
                            },
                            {sortable: true, field: 'smsStateStr', title: tableData[5]},
                            {sortable: true, field: 'sendTimeStr', title: tableData[6]},
                            {
                                field: 'del', title: tableData[7], formatter: function (val, row, index) {
                                return '<a style="cursor:pointer;"><span class="glyphicon glyphicon-trash"></span></a>';
                            }
                            }
                        ]
                    };
                    s.$on('click-cell.bs.table#SMSstatus', function (e, field, value, row, $element) {
                        s.clickRow = row;
                        if (field == "del") {
                            $alert.confirm(sureDelete[0], function () {
                                $http.delete(sprintf(URL_DELETE_SMSSTATE, row.id)).success(function (data) {
                                    if (data.code == 0) {
                                        $alert.noticeSuccess(data.message);
                                        s.search();
                                    } else {
                                        $alert.noticeDanger(data.message);
                                    }
                                }).error(function (msg) {
                                    $alert.msgDialogError(msg || msgDialogData[0]);
                                })
                            })
                        }
                    });

                    s.refresh = function () {
                        s.phone_number = '';
                        s.search();
                    };
                    s.keysearch = function (e) {
                        if(e.target.value === '' || e.keyCode === 13){
                            s.search()
                        }
                    };
                    s.search = function () {
                        s.$broadcast('refresh#SMSstatus', {
                            url: sprintf(URL_GET_SMSSTATE, s.phone_number)
                        });
                    };
                }
            }
        }])
});
