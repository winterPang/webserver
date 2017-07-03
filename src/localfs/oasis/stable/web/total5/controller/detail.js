define(['utils', 'bootstrapDatepicker', 'echarts', 'css!../css/bootstrap-datepicker3.css'], function (Utils) {
    return ['$scope', '$http', '$rootScope', '$state', function ($scope, $http, $rootScope, $state) {

        function getRcString(attrName) {
            return Utils.getRcString("total_rc", attrName);
        }


        $scope.clickTime = function (e) {
            $('#daterPicker').datepicker('clearDates');
            $('#total a.time-link').removeClass('active');
            var value = e.target.getAttribute('value');
            $('#total a[value = ' + value + ']').addClass('active');
        };

        $('#daterPicker').datepicker({
            minViewMode: 1,
            autoclose: true
        }).on('changeDate', function (e) {
            if(e.date !== undefined){
                var getDate = e.date.getTime();
            }
            $('#total a.time-link').removeClass('active');
        });

        $scope.clickRadio = function (e) {
            var value = e.target.getAttribute('id');
            if (value === 'g_pv') {
                $scope.showChart($scope.timeline, $scope.g_pv);
            }
            else if (value === 'g_pu') {
                $scope.showChart($scope.timeline, $scope.g_pu);
            }
            else if (value === 'g_clickCount') {
                $scope.showChart($scope.timeline, $scope.g_clickCount);
            }
            else if (value === 'g_ctr') {
                $scope.showChart($scope.timeline, $scope.g_ctr);
            }
        };




        $scope.showChart = function (timeLine, data) {
            var totalChart = echarts.init(document.getElementById('ShowChart'));
            var option = {
                tooltip: {
                    show: false,
                    trigger: 'axis'
                },
                grid: {
                    show: "false"
                },
                xAxis: [
                    {
                        boundaryGap: false,
                        type: 'category',
                        splitLine: false,
                        axisLine: {
                            show: true,
                            lineStyle: {color: '#9da9b8', width: 1}
                        },
                        axisTick: {show: false},
                        data: [1,2,3,4,5,6,7,8]
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        axisTick: {show: false},
                        splitLine: {
                            show: true,
                            textStyle: {color: '#c9c4c5', fontSize: "1px", width: 4},
                            lineStyle: {
                                color: ['#e7e7e9']
                            }
                        },
                        axisLabel: {
                            show: true,
                            textStyle: {color: '#9da9b8', fontSize: "12px", width: 2}
                        },
                        axisLine: {
                            show: true,
                            lineStyle: {color: '#9da9b8', width: 1}
                        }
                    }
                ],
                series: [
                    {
                        name: getRcString('people'),
                        type: 'line',
                        barCategoryGap: '40%',
                        data: [12,33,22,21,15,8,18,25]
                    }
                ]
            };
            totalChart.setOption(option);
            window.addEventListener('resize', function () {
                totalChart.resize()
            })
        };

        $scope.showChart();

        $scope.overView = {
            tId: 'option',
            pageSize: 5,
            showPageList: false,
            searchable: true,
            columns: [
                {sortable: true, field: 'pv', title: getRcString('overViewName').split(',')[0], searcher: {}},
                {sortable: true, field: 'pu', title: getRcString('overViewName').split(',')[1], searcher: {}},
                {sortable: true, field: 'clickCount', title: getRcString('overViewName').split(',')[2], searcher: {}},
                {sortable: true, field: 'ctr', title: getRcString('overViewName').split(',')[3], searcher: {}}
            ],
            data : [{'pv' : 1, 'pu' : 2, 'clickCount' : 3, 'ctr' : 4}]
        };

        $scope.advertView = {
            tId: 'option',
            pageSize: 5,
            showPageList: false,
            searchable: true,
            columns: [
                {sortable: true, field: 'pv', title: getRcString('advertViewName').split(',')[0], searcher: {}},
                {sortable: true, field: 'url', title: getRcString('advertViewName').split(',')[1], searcher: {}},
                {sortable: true, field: 'pu', title: getRcString('advertViewName').split(',')[2], searcher: {}},
                {sortable: true, field: 'clickCount', title: getRcString('advertViewName').split(',')[3], searcher: {}},
                {sortable: true, field: 'ctr', title: getRcString('advertViewName').split(',')[4], searcher: {}}
            ],
            data : [{'pv' : 1, 'url' : 88, 'pu' : 2, 'clickCount' : 3, 'ctr' : 4}]
        }

    }]
});