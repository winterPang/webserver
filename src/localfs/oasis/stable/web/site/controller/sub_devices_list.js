define(['jquery','utils' ,'bootstrapValidator'], function ($scope,Utils) {
    return ['$scope', '$http', '$alertService', '$stateParams', '$rootScope', '$compile','$state',
        function ($scope, $http, $alert, $stateParams, $rootScope, $compile,$state) {
            $scope.siteId=$stateParams.siteid;
            $scope.siteUrl=$stateParams.siteurl;
            //devId
            var devId = $stateParams.devid;
            var URL_GET_SUB_DEV_LIST = '/v3/ace/oasis/oasis-rest-shop/restshop/shopModel/subdevices/%d/{start}/{size}/{orderby}/{order}/undefined';
            function getRcString(attrName){
                return Utils.getRcString("sub_device_rc",attrName);
            }
            function devstatus(devsn, statu) {
                //status==1 ? online : not online
                var status = (!devsn ? '' : statu == 1 ? getRcString('online') : !statu ? '' : getRcString('offline'));

                var clazz = (status == getRcString('online') ? 'dev_status_base' : status == getRcString('offline') ? 'dev_status_base dev_status_unmanaged' : '');
                return '<span ' + (clazz && 'class="' + clazz + '" ') + '></span><span>' + status + '</span>';
            }
            var tableData=getRcString('table-title').split(',');
            $scope.options = {
                url:sprintf(URL_GET_SUB_DEV_LIST,devId),
                totalField: 'data.rowCount', //总数field，多级用点，最深是两级  例如  data.total
                sortField: 'orderby', // 查询参数sort
                dataField:'data.data',
                sortName:'id',
                sortOrder:'asc',
                sidePagination:'server',
                queryParams:function(p){
                    p.order=(p.order=='asc');
                    return p;
                },
                columns: [
                    {field: 'devAlias', title: tableData[0]},
                    {field: 'devSn', title: tableData[1]},
                    {field: 'devModel', title: tableData[2]},
                    {field: 'softVer', title: tableData[3]},
                    {field: 'hardVer', title: tableData[4]},
                    {
                        field: 'status', title: tableData[5],
                        formatter: function (value, row) {
                            return devstatus(row.devSn, value);
                        }
                    }
                ]
            };

            $scope.refresh = function () {
                $scope.$broadcast('refresh');
            };
            $('a.devlistshow').click(function () {
                $state.go('global.content.system.dev_show',{id:$scope.siteId,siteUrl:$scope.siteUrl});
            })
        }];
});