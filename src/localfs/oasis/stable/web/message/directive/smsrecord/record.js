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
    var URL_TEMPLATE_FILE = sprintf('../message/directive/smsrecord/views/%s/record.html', sLang);

    app.directive('smsRecord',[ '$http',
                                '$alertService',
                                '$state',
                                '$rootScope',function ($http,
                                                       $alert,
                                                       $state,
                                                       $rootScope) {
            return {
                restrict:'E',
                templateUrl:URL_TEMPLATE_FILE,
                replace:false,
                scope:true,
                link:function (s, e, a, c) {
                    function getRcString(attrName) {
                        return document.getElementById('smsmanagement_rc').getAttribute(attrName);
                    }

                    var tableData = getRcString('table-data').split(',');
                    var URL_GET_SMSRECORD = '/v3/ace/oasis/oasis-rest-sms/restapp/smsrecord/?orderby=userName&ascending=true&queryCondition=&user_name=' + $rootScope.userInfo.user;

                    s.recordOptions = {
                        tId: 'SMSrecord',
                        showPageList: false,
                        url: URL_GET_SMSRECORD,
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
                            {sortable: true, field: 'buyCount', title: tableData[1]},
                            {sortable: true, field: 'buyTimeStr', title: tableData[2]}
                        ]
                    };
                    s.refresh = function () {
                        s.$broadcast('refresh#SMSrecord', {
                            url: URL_GET_SMSRECORD
                        });
                    }
                }
            }
        }])
});


