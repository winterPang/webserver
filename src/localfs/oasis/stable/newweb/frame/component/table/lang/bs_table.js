define(['exports', 'sprintf'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });


    var langObj = {
        cn: {
            table: {
                formatRecordsPerPage: '每页显示 %s 条记录',
                formatShowingRows: '显示第 %s 到第 %s 条记录，总共 %s 条记录',
                formatNoMatches: '<div>没有找到匹配的记录</div>',
                operateTitle: '操作',
                tips: {
                    reboot: '重启',
                    download: '下载',
                    detail: '详情',
                    remove: '删除',
                    edit: '编辑',
                    add: '添加',
                    search: '搜索',
                    upgrade: '升级',
                    imports: '导入',
                    custom: '自定义'
                }
            },
            daterangepicker: {
                format: 'YYYY/MM/DD',
                separator: ' - ',
                applyLabel: '应用',
                cancelLabel: '取消',
                fromLabel: '从',
                toLabel: '到',
                customRangeLabel: '自定义',
                weekLabel: '周',
                daysOfWeek: ['日', '一', '二', '三', '四', '五', '六'],
                monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
                firstDay: 1
            },
            rangepicker: {
                okText: '确定',
                cancelText: '取消',
                clearText: '清空',
                splitChar: ' ~ '
            }
        },
        en: {
            table: {
                formatRecordsPerPage: '%s  rows per page',
                formatShowingRows: 'Showing %s to %s of %s rows',
                formatNoMatches: '<div>No matching records</div>',
                operateTitle: 'Operation',
                tips: {
                    reboot: 'Reboot',
                    download: 'Download',
                    detail: 'Detail',
                    remove: 'Remove',
                    edit: 'Edit',
                    add: 'Add',
                    search: 'Search',
                    upgrade: 'Upgrade',
                    imports: 'Import',
                    custom: 'Custom'
                }
            },
            daterangepicker: {
                format: 'MM/DD/YYYY',
                separator: ' - ',
                applyLabel: 'Apply',
                cancelLabel: 'Cancel',
                fromLabel: 'From',
                toLabel: 'To',
                customRangeLabel: 'Custom',
                weekLabel: 'W',
                daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
                monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                firstDay: 1
            },
            rangepicker: {
                okText: 'Ok',
                cancelText: 'Cancel',
                clearText: 'Reset',
                splitChar: ' ~ '
            }
        }
    };

    function setLang(lang) {
        return {
            table: {
                formatRecordsPerPage: function formatRecordsPerPage(pageNumber) {
                    return sprintf(langObj[lang].table.formatRecordsPerPage, pageNumber);
                },
                formatShowingRows: function formatShowingRows(pageFrom, pageTo, totalRows) {
                    return sprintf(langObj[lang].table.formatShowingRows, pageFrom, pageTo, totalRows);
                },
                formatNoMatches: function formatNoMatches() {
                    return langObj[lang].table.formatNoMatches;
                }
            }
        };
    }

    exports.default = $.extend(true, {}, langObj, { en: setLang('en'), cn: setLang('cn') });
});
//# sourceMappingURL=bs_table.js.map
