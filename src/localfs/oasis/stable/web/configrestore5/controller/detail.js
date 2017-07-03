/**
 * Created by Administrator on 2016/10/9.
 */
define(['bootstrap-table-CN', 'utils', 'bootstrapValidator', 'fullcalendar', 'css!frame/libs/fullcalendar-3.0.1/css/fullcalendar',
    'css!configrestore5/css/style'], function ($, Utils) {
    return ['$scope', '$http', '$alertService', '$state', '$rootScope', '$stateParams', '$filter', '$timeout',
        function ($scope, $http, $alert, $state, $rootScope, $stateParams, $filter, $timeout) {
            //permission
            $scope.$watch('permission', function (p) {
                if (!p.write) {
                    $timeout(function () {
                        $scope.$broadcast('hideColumn#cfgOptions', 'modify_delete');
                    });
                }
            }, true);

            function getRcString(attrName) {
                return Utils.getRcString("configrestore_rc", attrName);
            }

            var modalData = getRcString('modal-data').split(',');
            var noticeData = getRcString('notice-data').split(',');
            var msgDialogData = getRcString('msgDialog-data').split(',');
            var tableData = getRcString('table-data').split(',');
            var calendarData = getRcString('calendar-data').split(',')

            var URL_POST_SAVE_CONFIG = '/v3/ant/rollback';
            $scope.row = {
                autoNum: 0,
                manualNum: 0
            };
            $scope.g_oAllEvents = {};
            $scope.configFile = {};
            /**
             * Restore point overview, and restore point data
             */
            function loadData() {
                $http.post(sprintf(URL_POST_SAVE_CONFIG), JSON.stringify({
                    method: "getCfg",
                    devSN: $stateParams.sn
                }), {headers: {"Content-Type": "application/json;charset=UTF-8"}}).success(function (data) {
                    $scope.$broadcast('load#cfgOptions', data.result);
                    $scope.row.totlefileNum = data.result.length;
                    //fileSize
                    $scope.row.fileSize = data.result.fileSize;
                    $scope.row.manualNum = 0;
                    $scope.row.autoNum = 0;
                    var aResult = data.result;
                    var aEvents = [];
                    var oResultdata = {};
                    if (aResult != "fail") {
                        $.each(aResult, function (index, oResult) {
                            if (isNaN(Number($scope.row.manualNum))) {
                                $scope.row.manualNum = 0;
                            }
                            if (isNaN(Number($scope.row.autoNum))) {
                                $scope.row.autoNum = 0;
                            }
                            oResult.opType == 1 ? $scope.row.manualNum++ : $scope.row.autoNum++;
                            var stime = $filter('date')(new Date((oResult.createTime) * 1000), 'yyyy-MM-ddTHH:mm:ss');
                            var sday = $filter('date')(new Date((oResult.createTime) * 1000), 'yyyy-MM-dd');
                            oResult.createTime = stime;
                            if (oResultdata[sday]) {
                                oResultdata[sday].nNum += 1;
                                oResultdata[sday].day = sday;
                                oResultdata[sday].aEvent.push(oResult);
                            }
                            else {
                                oResultdata[sday] = {};
                                oResultdata[sday].aEvent = [];
                                oResultdata[sday].day = sday;
                                oResultdata[sday].nNum = 1;
                                oResultdata[sday].aEvent.push(oResult);
                            }
                        });
                        $.each(oResultdata, function (day, oEvent) {
                            var oData = {};
                            oData.title = " ";
                            oData.start = oEvent.day;
                            oData.allDay = true;
                            oData.allDayDefault = true;
                            oData.aEvent = oEvent.aEvent;
                            // oData.rendering = 'background';
                            aEvents.push(oData);
                        });
                        $('#calendar').fullCalendar('destroy');
                        initCalendar(aEvents);
                    }
                });
            }

            loadData();
            /**
             * Get the last restore point
             */
            function getLastConfig() {
                $http.post(sprintf(URL_POST_SAVE_CONFIG), JSON.stringify({
                    method: "getLastCfg",
                    devSN: $stateParams.sn
                }), {headers: {"content-Type": "application/json;charset=UTF-8"}}).success(function (data) {
                        if (!data) {
                            return;
                        }
                        if (!data.result || data.result == 'fail') {
                            $scope.row.totlefileNum = getRcString('undefined');
                            $scope.row.manualNum = getRcString('undefined');
                            $scope.row.autoNum = getRcString('undefined');
                            $scope.row.restoretime = getRcString('undefined');
                            $scope.row.fileName = getRcString('undefined');
                            $scope.row.CreateReason = getRcString('undefined');
                            return;
                        }
                        $scope.row.fileName = data.result.fileName;
                        $scope.row.CreateReason = data.result.reason;
                        // filePath
                        $scope.row.filePath = data.result.filePath;
                        // createTime
                        $scope.row.restoretime = $filter('date')(data.result.createTime * 1000, 'yyyy-MM-dd HH:mm:ss');
                        var stime = $filter('date')(new Date((data.result.createTime) * 1000), 'yyyy-MM-ddTHH:mm:ss');
                        var sday = $filter('date')(new Date((data.result.createTime) * 1000), 'yyyy-MM-dd');
                        // var aLastCfgEvent = g_oAllEvents[sday] && g_oAllEvents[sday].aEvent || [];
                        // $("#detail_info_list").SList("refresh", aLastCfgEvent);
                    }
                );
            }

            getLastConfig();

            /**
             * Get last restore point
             */
            function getLastRollbackCfg() {
                $http.post(sprintf(URL_POST_SAVE_CONFIG), JSON.stringify({
                    method: "getLastRollbackCfg",
                    devSN: $stateParams.sn
                }), {headers: {"content-Type": "application/json;charset=UTF-8"}}).success(function (data) {
                    if (!data) {
                        return;
                    }
                    if (!data.result || data.result == "fail") {

                    } else {
                        $scope.row.rollbackTime = $filter('date')(data.result.rollbackTime * 1000, 'yyyy-MM-dd HH:mm:ss');
                        $scope.row.RestoreReason = data.result.reason;
                        $scope.row.fileName = data.result.fileName;
                    }
                });
            }


            getLastRollbackCfg();
            /**
             * History restore record
             */
            function restoreHistory() {
                $scope.restorehistory = function () {
                    $http.post(sprintf(URL_POST_SAVE_CONFIG), JSON.stringify({
                        method: "getRollbackCfg",
                        devSN: $stateParams.sn
                    }), {headers: {"content-Type": "application/json;charset=UTF-8"}}).success(function (data) {
                        $scope.$broadcast('load#restoreRec', data.result);
                    });
                    $scope.$broadcast('show#restoreRecord')
                };
            }

            restoreHistory();

            $scope.restoreRecord = {
                mId: "restoreRecord",
                title: modalData[0],
                showCancel: false,
                okText: modalData[1]
            };
            /**
             * Restore record table
             */
            $scope.restoreOptions = {
                tId: 'restoreRec',
                searchable: true,
                columns: [
                    {searcher: {}, sortable: true, field: 'fileName', title: tableData[0]},
                    {
                        sortable: true, field: 'rollbackTime', title: tableData[1],
                        formatter: function (v) {
                            if (v) {
                                return $filter('date')(v * 1000, 'yyyy-MM-dd HH:mm:ss');
                            }
                            return '';
                        }
                    }
                ]
            };

            initCalendar();
            function initCalendar(aEvents) {
                if (!$('#calendar').data('fullCalendar')) {
                    $('#calendar').fullCalendar({
                        firstDay: 1,
                        monthNames: [calendarData[0], calendarData[1], calendarData[2], calendarData[3], calendarData[4],
                            calendarData[5], calendarData[6], calendarData[7], calendarData[8], calendarData[9], calendarData[10],
                            calendarData[11]],
                        dayNamesShort: [calendarData[12], calendarData[13], calendarData[14], calendarData[15], calendarData[16],
                            calendarData[17], calendarData[18], calendarData[19]],
                        height: 420,
                        buttonText: {
                            showMonthAfterYear: true
                        },
                        header: {
                            left: 'title',
                            right: 'prev,next'
                        },

                        eventClick: function (m, e) {
                            console.log(arguments);
                            $(".fc-event").each(function (i, td) {
                                $(td).removeClass("eventClickedColor")
                            });
                            $(this).addClass("eventClickedColor");
                            $scope.$broadcast('load#cfgOptions', m.aEvent || []);
                        }/*,
                         events: aEvents || []*/
                    });
                }
                $('#calendar').fullCalendar('addEventSource', aEvents);
            }

            /**
             * Display configuration file details
             */
            $scope.showFileCfg = function (filePath) {
                console.debug(filePath);
                console.debug($scope.row.fileName);
                $http.post(sprintf(URL_POST_SAVE_CONFIG), JSON.stringify({
                    method: "getFileStream",
                    devSN: $stateParams.sn,
                    fileName: $scope.row.fileName
                }), {headers: {"content-Type": "application/json;charset=UTF-8"}}).success(function (data) {
                    $scope.configFile.detail = data;
                    $timeout(function () {
                        $(window).trigger('resize');
                    });
                });
                $scope.$broadcast('show#cfgFileDetails');
            };
            $scope.showFileDetails = {
                option: {
                    mId: 'cfgFileDetails',
                    title: modalData[2],
                    showCancel: false,
                    modalSize: 'lg',
                    bodyMaxHeight: 560,
                    okText: modalData[1]
                }
            };
            /**
             * bottom-right table
             */
            $scope.options = {
                tId: 'cfgOptions',
                pageSize: 7,
                showPageList: false,
                paginationSize: 'sm',
                singleSelect: true,
                height: 377,
                columns: [
                    {
                        field: 'fileName', title: tableData[0], formatter: function (v) {
                        if (v && v.length > 10) {
                            return '<span title="' + v + '">' + v.substring(0, 7) + '...</span>';
                        }
                        return v || '';
                    }
                    },
                    {
                        field: 'createTime', title: tableData[1], formatter: function (v) {
                        if (v) {
                            if (typeof v == 'number') {
                                return $filter('date')(v * 1000, 'yyyy-MM-dd HH:mm:ss');
                            } else {
                                return $filter('date')(v, 'yyyy-MM-dd HH:mm:ss');
                            }
                        }
                        return '';
                    }
                    },
                    {
                        field: 'reason', title: tableData[2], formatter: function (v) {
                        if (v && v.length > 10) {
                            return '<span title="' + v + '">' + v.substring(0, 7) + '...</span>';
                        }
                        return v || '';
                    }
                    },
                    {
                        field: 'opType', title: tableData[5]
                    }
                ],
                operateWidth: 80,
                operate: {
                    detail: function (e, row) {
                        $http.post(sprintf(URL_POST_SAVE_CONFIG), JSON.stringify({
                            method: "getFileStream",
                            devSN: $stateParams.sn,
                            fileName: row.fileName
                        }), {headers: {"content-Type": "application/json;charset=UTF-8"}}).success(function (data) {
                            $scope.configFile.detail = data;
                            $timeout(function () {
                                $(window).trigger('resize');
                            });
                        });
                        $scope.$broadcast('show#cfgFileDetails');
                    },
                    remove: function (e, row) {
                        $alert.confirm(getRcString('sure-delete'), function () {
                            $http.post(sprintf(URL_POST_SAVE_CONFIG), {
                                method: "deleteCfg",
                                fileName: row.fileName,
                                devSN: $stateParams.sn
                            }, {headers: {"content-Type": "application/json;charset=UTF-8"}}).success(function (data) {
                                if (data.result == 'success') {
                                    $scope.$broadcast('remove#cfgOptions', {field: 'fileName', values: [row.fileName]});
                                    $alert.noticeSuccess(noticeData[0] + " " + noticeData[1]);
                                } else {
                                    $alert.noticeDanger(data.result);
                                }
                                loadData();
                                getLastConfig();
                                getLastRollbackCfg();
                                restoreHistory();
                            }).error(function (msg) {
                                $alert.noticeDanger(msg || noticeData[2]);
                            });
                        });
                    }
                }
            };
            $scope.configRestoreDisabled = true;
            /**
             * Enable or disable the "configure restore" button
             */
            function btnConfigRestore() {
                $scope.$broadcast('getSelections#cfgOptions', function (data) {
                    $scope.$apply(function () {
                        $scope.configRestoreDisabled = data.length < 1;
                    });
                });
            }

            $scope.$on('check.bs.table#cfgOptions', btnConfigRestore);
            $scope.$on('uncheck.bs.table#cfgOptions', btnConfigRestore);
            /**
             * Add
             */
            $scope.addFile = function () {
                $scope.$broadcast('show#newRestorePoint');
            };
            $scope.$watch('addform.$invalid', function (v) {
                $scope.$broadcast((v ? 'disabled' : 'enable') + '.ok#newRestorePoint');
            });
            $scope.newPoint = {
                option: {
                    mId: 'newRestorePoint',
                    title: modalData[3],
                    okText: modalData[4],
                    autoClose: false,
                    okHandler: function (modal, $ele) {
                        $scope.$broadcast('disabled.ok#newRestorePoint');
                        setTimeout(function () {
                            $alert.msgDialogSuccess(msgDialogData[2])
                        }, 2000);
                        $http.post(sprintf(URL_POST_SAVE_CONFIG), {
                            deviceModule: "ROLLBACK",
                            method: "saveCfg",
                            devSN: $stateParams.sn,
                            cfgTimeout: "300",
                            createTime: +new Date(),
                            opType: 1,
                            reason: $scope.row.creatReason,
                            param: {
                                fileName: $stateParams.sn + '_' + new Date().getTime() + '.cfg',
                                curlTimeout: 60,
                                downloadUrl: "/v3/ant/rollback"
                            }
                        }, {headers: {"content-Type": "application/json;charset=UTF-8"}}).success(function (data) {
                            if (data.communicateResult == "fail") {
                                $alert.msgDialogError(msgDialogData[0]);
                            }
                            else {
                                $alert.msgDialogSuccess(msgDialogData[1]);
                            }
                            modal.hide();
                            loadData();
                            $scope.row.creatReason = "";
                            $scope.addform.$setPristine();
                            $scope.addform.$setUntouched();
                            $scope.$broadcast('enable.ok#newRestorePoint');
                        }).error(function () {
                            $scope.$broadcast('enable.ok#newRestorePoint');
                        })
                    },
                    cancelText: modalData[5]
                }
            };
            /**
             * Configuration restore
             */
            $scope.configrestore = function () {
                $scope.$broadcast('show#ConfigRestoreReason')
            };
            var date = new Date();
            var nNow = Math.round(date.getTime() / 1000);
            var restore_params = {
                deviceModule: "ROLLBACK",
                method: "rollbackCfg",
                devSN: $stateParams.sn,
                cfgTimeout: "300",
                reason: $scope.row.createRestoreReason,
                rollbackTime: nNow,
                param: {
                    fileName: '',
                    curlTimeOut: 60,
                    fileSize: '',
                    downloadUrl: '/download/fileName'
                }
            };
            $scope.$on('check.bs.table#cfgOptions', function (e, row, $td, $element) {
                restore_params.param.fileName = row.fileName;
                restore_params.param.fileSize = row.fileSize;
            });

            $scope.$watch('restoreReason.$invalid', function (v) {
                $scope.$broadcast((v ? 'disabled' : 'enable') + '.ok#newRestorePoint');
            });
            $scope.configreason = {
                option: {
                    mId: 'ConfigRestoreReason',
                    title: modalData[6],
                    okText: modalData[4],
                    autoClose: false,
                    okHandler: function (modal, $ele) {
                        $scope.$broadcast('disabled.ok#ConfigRestoreReason');
                        setTimeout(function () {
                            $alert.msgDialogSuccess(msgDialogData[3])
                        }, 2000);
                        restore_params.reason = $scope.row.createRestoreReason;
                        $http.post(sprintf(URL_POST_SAVE_CONFIG), JSON.stringify(restore_params), {headers: {"content-Type": "application/json;charset=UTF-8"}}).success(function (data) {
                            if (data.errCode == 0) {
                                $alert.msgDialogSuccess(msgDialogData[1]);
                            }
                            else {
                                $alert.msgDialogError(msgDialogData[0]);
                            }
                            modal.hide();
                            $scope.$broadcast('enable.ok#ConfigRestoreReason');
                        }).error(function () {
                            $scope.$broadcast('enable.ok#ConfigRestoreReason');
                        })
                    },
                    cancelText: modalData[5]
                }
            };
            $scope.$on('hidden.bs.modal#newRestorePoint', function () {
                $scope.row.creatReason = "";
                $scope.restoreReason.$setPristine();
                $scope.restoreReason.$setUntouched();
            });
            $scope.$on('hidden.bs.modal#ConfigRestoreReason', function () {
                $scope.row.createRestoreReason = "";
                $scope.restoreReason.$setPristine();
                $scope.restoreReason.$setUntouched();
            });
        }];
});
