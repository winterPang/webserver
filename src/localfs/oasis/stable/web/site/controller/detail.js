define(['jquery','utils','site/libs/jsAddress', 'frame/directive/bs_modal', 'css!site/css/sitecss'], function ($,Utils) {
    return ['$scope', '$http', '$alertService', '$state', '$rootScope', '$stateParams',
        function ($scope, $http, $alert, $state, $rootScope, $stateParams) {
            function getRcString(attrName){
                    return Utils.getRcString("site_detail_rc",attrName);
                }
            $scope.row={};
           
            var shopId = $stateParams.id;

            var prov = $('#cmbProvince'),
                city = $('#cmbCitys'),
                area = $('#cmbArea');

            var URL_GET_MODEL_LIST = '/v3/ace/oasis/oasis-rest-device/restdevice/devicemodel/getdevModels/?seceneId=%s&ascending=%s&queryCondition=%s';
            var URL_GET_SHOP_INFO = '/v3/ace/oasis/oasis-rest-shop/restshop/shopModel/get/%d';
            var URL_GET_REGION_LIST = '/v3/ace/oasis/oasis-rest-shop/restshop/regioninfo/regions';
            var URL_GET_ALL_SCENARIO_LIST = '/v3/ace/oasis/oasis-rest-device/restdevice/scenario/getAllScenario';

            $http.get(sprintf(URL_GET_SHOP_INFO, shopId)).success(function (data) {
                var datas=data.data;
                if(data.code==0){
                    $scope.row.name   = datas.shopName;
                    $scope.row.province   = datas.province.split(/[省市]/).join('');
                    $scope.row.city       = datas.city;
                    $scope.row.district   = datas.district;
                    $scope.row.address = datas.addrDetail;
                    $scope.row.phone      = datas.phone;
                    $scope.row.brief   = datas.shopDesc;
                    $scope.row.regionId   = datas.regionId;
                    $scope.row.scenarioId = datas.scenarioId;

                    initAddress(function () {
                        prov.val($scope.row.province).trigger('change');
                        city.val($scope.row.city).trigger('change');
                        area.val($scope.row.district);
                    },Utils.getLang());

                    //get scenarios list and init
                    $http.get(sprintf(URL_GET_ALL_SCENARIO_LIST)).success(function (data1) {
                        if(data1.code==0){
                            $scope.scens = data1.data.data;

                            $.map($scope.scens, function (v) {
                                v.namedesc = v.name + '(' + v.desc + ')';
                            });
                            $scope.row.scenario_category_name = $scope.row.scenarioId;
                        }
                    }).error(function (msg1) {
                        $alert.noticeDanger(msg1 || getRcString("error"));
                    });

                    //init region
                    $http.get(sprintf(URL_GET_REGION_LIST)).success(function (data2) {
                        if(data2.code==0){
                            $scope.areas = data2.data;
                            $scope.row.region = $scope.row.regionId;
                        }else {
                            $alert.noticeDanger(data.message);
                        }
                    }).error(function (msg2) {
                        $alert.noticeDanger(msg2 || getRcString("error"));
                    });
                }else {
                    $alert.noticeDanger(data.message);
                }
            }).error(function (msg) {
                $alert.noticeDanger(msg || getRcString("error"));
            });

            $scope.showmodel = function () {
                $scope.$broadcast('refresh',{
                    url:sprintf(URL_GET_MODEL_LIST, $scope.row.scenarioId,true,'')
                });
                $scope.$broadcast('show');
            };
            var page=getRcString("page").split(",");
            $scope.options = {
                totalField: 'data.rowCount', //总数field，多级用点，最深是两级  例如  data.total
                sortField: 'orderby', // 查询参数sort
                dataField:'data.data',
                sortName:'id',
                sortOrder:'asc',
                showPageList: false,
                columns: [
                    {sortable: true, field: 'dModel', title: getRcString("support")}
                ],
                sidePagination: 'server',
                formatShowingRows: function (pageFrom, pageTo, totalRows) {
                        return page[0] + pageFrom + page[1] + pageTo + page[2]+","+page[3] + totalRows + page[2];
                },
                onLoadSuccess: function () {
                    $(window).trigger('resize');
                }
            };
            $scope.devmodel = {
                title: getRcString("support-device"),
                cancelText: getRcString("off"),
                showOk: false
            };
        }];
});