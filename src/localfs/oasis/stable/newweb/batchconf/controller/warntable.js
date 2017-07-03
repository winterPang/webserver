define(['jquery', 'css!../css/warntable'], function ($) {
    return ['$scope', function ($scope) {
        $scope.warnTable = {
            url: '../batchconf/init/warntable.json',
            tId: 'warnTable',
            showCheckBox: true,
            extraCls: 'new_style_170413_table',
            columns: [
                {field: 'alias', showTooltip: true, title: '设备别名'},
                {field: 'sn', showTooltip: true, title: '设备序列号'},
                {field: 'warnCate', showTooltip: true, title: '告警类别'},
                {field: 'warnDetail', showTooltip: true, title: '详细信息'},
                {field: 'warnRank', showTooltip: true, title: '严重级别'},
                {field: 'warnTime', showTooltip: true, title: '告警时间'},
                {field: 'status', showTooltip: true, title: '状态'}
            ]
        }
    }];
});