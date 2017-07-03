(function ($) {
    var MODULE_NAME = "classroom.studenttrace";
    var g_mapScene;
    var g_bgLayer;
    var g_ClientLayer;
    var g_areaLayer;
    var g_areaArray;
    var g_StudentLayer;
    //存储学生信息
    var g_oStuList;
    var g_oStudent = {};
    var g_time;
    var g_oSwitch = {};

    var g_locationArea = [
        {
            areaName: "B1",
            areaType: 4,
            areaPoint: "68.0 70L218 90L255 90L100 60"
        }];
    function getTimeClientMac(locationName, macAddress, startTime, endTime) {
        var option = {
            type: 'POST',
            url: MyConfig.v2path + '/location/timeClientMac',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify({
                userId: FrameInfo.g_user.user,
                shopName: Utils.Device.deviceInfo.shop_name,
                locationName: locationName,
                macAddress: macAddress,
                startTime: startTime,
                endTime: endTime
            }),
            onFailed: function () {
                debugger;
            }
        }
        return Utils.Request.sendRequest(option);
    }


    function getAllLocationClient(locationName) {
        var option = {
            type: 'POST',
            url: MyConfig.v2path + '/location/allLocationClient',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify({
                userId: FrameInfo.g_user.user,
                shopName: Utils.Device.deviceInfo.shop_name,
                locationName: locationName
            }),
            onFailed: function () {
                debugger;
            }
        }
        return Utils.Request.sendRequest(option);
    }

    function getLocationArea(locationName) {
        var option = {
            type: 'POST',
            url: MyConfig.v2path + '/location/locationArea',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify({
                userId: FrameInfo.g_user.user,
                shopName: Utils.Device.deviceInfo.shop_name,
                locationName: locationName
            }),
            onFailed: function () {
                debugger;
            }
        }
        return Utils.Request.sendRequest(option);
    }

    function getLocationClientMac(locationName, macAddress) {
        var option = {
            type: 'POST',
            url: MyConfig.v2path + '/location/locationClientMac',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify({
                userId: FrameInfo.g_user.user,
                shopName: Utils.Device.deviceInfo.shop_name,
                locationName: locationName,
                macAddress: macAddress
            }),
            onFailed: function () {
                debugger;
            }
        }
        return Utils.Request.sendRequest(option);
    }

    function getMapList(suc) {
        var option = {
            type: 'POST',
            url: MyConfig.v2path + '/location/LocationImage',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify({
                userId: FrameInfo.g_user.user,
                shopName: Utils.Device.deviceInfo.shop_name
            }),
            onFailed: function () {
                debugger;
            }
        }
        return Utils.Request.sendRequest(option);
    }


    function getStudentTrackSwitch(suc) {
        var option = {
            type: 'POST',
            url: MyConfig.path + '/smartcampusread',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify({
                devSN: FrameInfo.ACSN,
                Method: 'getStudentTrackSwitch',
                Param: {
                    devSn: FrameInfo.ACSN
                }
            }),
            onFailed: function () {
                debugger;
            }
        }
        return Utils.Request.sendRequest(option);
    }

    function setStudentTrackSwitch(tarckSwitch, studentInfo, curPosOrTrace, locationName, imgPath) {
        var option = {
            type: 'POST',
            url: MyConfig.path + '/smartcampuswrite',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify({
                devSN: FrameInfo.ACSN,
                Method: 'setStudentTrackSwitch',
                Param: {
                    devSn: FrameInfo.ACSN,
                    trackSwitch: tarckSwitch,
                    studentInfo: studentInfo,
                    curPosOrTrace: curPosOrTrace,
                    locationName: locationName,
                    imgPath: imgPath
                }
            }),
            onFailed: function () {
                debugger;
            }
        }
        return Utils.Request.sendRequest(option);
    }

    function getGridConfig() {
        return Utils.Request.sendRequest({
            type: 'POST',
            url: MyConfig.path + '/smartcampusread',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify({
                devSN: FrameInfo.ACSN,
                Method: 'getGradeConfig',
                Param: {
                    devSn: FrameInfo.ACSN
                }
            })
        });
    }

    function getGradeConfigByGridType(gradeType) {
        return Utils.Request.sendRequest({
            type: 'POST',
            url: MyConfig.path + '/smartcampusread',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify({
                devSN: FrameInfo.ACSN,
                Method: 'getGradeConfigByGridType',
                Param: {
                    devSn: FrameInfo.ACSN,
                    gradeType: gradeType,
                }
            })
        });
    }

    function getStudent() {
        return Utils.Request.sendRequest({
            type: 'POST',
            url: MyConfig.path + '/smartcampusread',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify({
                devSN: FrameInfo.ACSN,
                Method: 'getStudent',
                Param: {
                    devSn: FrameInfo.ACSN,
                }
            })
        });
    }


    function getClass(gradeType) {
        return Utils.Request.sendRequest({
            type: 'POST',
            url: MyConfig.path + '/smartcampusread',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify({
                devSN: FrameInfo.ACSN,
                Method: 'getClass',
                Param: {
                    devSn: FrameInfo.ACSN,
                    gradeType: gradeType
                }
            })
        })
    }

    function isInsidePolygon(pt, poly) {
        for (var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
            ((poly[i].y <= pt.y && pt.y < poly[j].y) || (poly[j].y <= pt.y && pt.y < poly[i].y))
                && (pt.x < (poly[j].x - poly[i].x) * (pt.y - poly[i].y) / (poly[j].y - poly[i].y) + poly[i].x)
                && (c = !c);
        return c;
    }

    function changeFormatAnddrawTrace(data) {
        if (data.code === 0 && data.client.length !== 0) {
            //data.client.reduce()
            var i = 1;
            var clienttrace = data.client.reduce(function (res, cur) {
                res.push({ time: 10 * i, XCord: cur.posX, YCord: sessionStorage.height- cur.posY, clientMac: cur.clientMac });
                i ++;
                return res;
            }, []);
            g_StudentLayer.drawStudentTrace(clienttrace || [], sessionStorage.width, sessionStorage.height);
        }
        else if (data.code === 0 && data.client.length === 0) {
            /*假数据*/
            var clienttrace = [
                { time: 10, XCord: 200, YCord: 500, clientMac: "0-0-0-0" },
                { time: 20, XCord: 240, YCord: 310, clientMac: "0-0-0-0" },
                { time: 30, XCord: 230, YCord: 110, clientMac: "0-0-0-0" },
                { time: 40, XCord: 290, YCord: 200, clientMac: "0-0-0-0" },
                { time: 50, XCord: 270, YCord: 190, clientMac: "0-0-0-0" },
                { time: 60, XCord: 200, YCord: 500, clientMac: "0-0-0-0" },
                { time: 70, XCord: 240, YCord: 200, clientMac: "0-0-0-0" },
                { time: 80, XCord: 270, YCord: 210, clientMac: "0-0-0-0" },
                { time: 90, XCord: 250, YCord: 200, clientMac: "0-0-0-0" },
            ];
            g_StudentLayer.drawStudentTrace(clienttrace || [], sessionStorage.width, sessionStorage.height);
        }
    }

    function analysisAreaInfo(areadata, locationName) {
        var areaArray = [];
        for (var i = 0; i < areadata.locatinArea.length; i++) {
            var areaPoint = areadata.locatinArea[i].areaPoint.substring(1, areadata.locatinArea[i].areaPoint.length - 1);
            var areaA = areaPoint.split("L");
            var positionArea = [];
            for (var j = 0; j < areaA.length; j++) {
                var point = areaA[j].split(" ");
                var position = {
                    x: point[0] * 1,
                    y: point[1] * 1
                };
                positionArea.push(position);
            }
            var areaInfo = {
                positionArea: positionArea,
                areaName: areadata.locatinArea[i].areaName,
                areaLocation: locationName
            };
            areaArray.push(areaInfo);
        }
        return areaArray;
    };

    function timetoString(oTime) {
        var timestring = '';
        var year = oTime.getFullYear();
        var month = (oTime.getMonth() + 1).toString();
        var day = (oTime.getDate()).toString();
        var hours = (oTime.getHours()).toString();
        var minutes = (oTime.getMinutes()).toString();
        var seconds = (oTime.getSeconds()).toString();
        if (month.length == 1) {
            month = "0" + month;
        }
        if (day.length == 1) {
            day = "0" + day;
        }
        if (hours.length == 1) {
            hours = "0" + hours;
        }
        if (minutes.length == 1) {
            minutes = "0" + minutes;
        }
        if (seconds.length == 1) {
            seconds = "0" + seconds;
        }
        timestring = '' + year + '-' + month + '-' + day +
            ' ' + hours + ':' + minutes + ':' + seconds;

        return timestring;
    };

    function initTraceSwitch() {
        /* 获取追踪轨迹开关的状态 */
        g_StudentLayer.clean();
        g_StudentLayer.stopUpDate();
        g_areaLayer.clean();
        if (typeof g_oSwitch.result.studentInfo !== 'undefined') {
            g_oStudent = g_oSwitch.result.studentInfo;
        }

        if (typeof g_oStudent.studentName === 'undefined') {
            $('#selectStu').html("未指定");
        }
        else {
            $('#selectStu').html(g_oStudent.studentName);
        }

        //$('#selectStu').html(g_oStudent.studentName);
        if (g_oSwitch.result === "no date") {
            $('#trace').MCheckbox("setState", false);
        }
        if (g_oSwitch.retCode !== -1 && g_oSwitch.result.trackSwitch === 1) {
            $('#trace').MCheckbox("setState", true);
            var toggleBlock = $("#traceMode");
            toggleBlock.toggleClass('hide');
            $('#heat-map').toggleClass('hide');
            // 如果开启则 跟踪所有的人员

            //clientLayer.addClientNode();
            if (toggleBlock.hasClass('hide')) {
                // stop trace
                g_StudentLayer.clean();
                g_StudentLayer.stopUpDate();
                //g_areaLayer.setVisible(true);
                g_areaLayer.setAreaNode(g_areaArray);
                g_areaLayer.addAreaNode();
                //areaLayer.addAreaNode();
            }
            else {
                // start trace
                //g_areaLayer.setVisible(false);
                g_StudentLayer.clean();
                g_StudentLayer.stopUpDate();
                g_areaLayer.clean();
                /*判断radio 是实时位置还是轨迹*/
                //$($('#divcurPos').children()[0]).children('span').hasClass('checked')
                if ($($('#divcurPos').children()[0]).children('span').hasClass('checked')) {
                    $('#datetimerange').hide();
                    var count = 0;
                    var client = {
                        posX: 200,
                        posY: 200,
                        clientMac: "00:00:22:fe:aa:bc"
                    }
                    var locationName = $("#s2id_MapSelect span").html();
                    getLocationClientMac(locationName, g_oStudent.wristbandId.toLocaleUpperCase()).done(function (data) {
                        if (data.client.length !== 0) {
                            var clientArr = [
                                { time: 20, XCord: data.client[0].posX, YCord: sessionStorage.height-data.client[0].posY, clientMac: data.client[0].clientMac }
                            ];
                        }
                        else {
                            var clientArr = [
                                { time: 20, XCord: 400, YCord: 400, clientMac: "0-0-0-0" }
                            ];
                        }
                        g_StudentLayer.drawStudentTrace(clientArr || [], sessionStorage.width, sessionStorage.height);
                        g_StudentLayer.startUpDate(function () {
                            var clientMac = "0-0-0-0";
                            var time = 0;
                            getLocationClientMac(locationName, g_oStudent.wristbandId.toLocaleUpperCase()).done(function (data) {
                                if (data.client.length !== 0) {
                                    g_StudentLayer.updateCallback({ time: 10, XCord: data.client[0].posX, YCord: sessionStorage.height-data.client[0].posY, clientMac: data.client[0].clientMac });
                                }
                                // else {
                                //     var curPos = g_StudentLayer.actionClientNode.getPosition();
                                //     var maxLen = 30;//px
                                //     //curPos.x += Math.random()*maxLen;
                                //     curPos.x += Math.random() * maxLen * (Math.random() > 0.5 ? 1 : -1);
                                //     curPos.y += Math.random() * maxLen * (Math.random() > 0.5 ? 1 : -1);
                                //     g_StudentLayer.updateCallback({ time: 10, XCord: curPos.x, YCord: curPos.y, clientMac: clientMac });
                                // }
                            });

                        }, 5);

                    });

                }

                if ($($('#divtracePos').children()[0]).children('span').hasClass('checked')) {
                    $('#datetimerange').show();
                    var datetimerange = $('#datetimerange').attr('value');
                    var locationName = $("#s2id_MapSelect span").html();
                    var macAddress = g_oStudent.wristbandId;
                    var startTimestring = '';
                    var endTimestring = '';
                    if (datetimerange === "") {
                        /*默认获取当前时间往前推一天的轨迹*/
                        endTimestring = timetoString((new Date()));
                        startTimestring = timetoString((new Date((new Date()).getTime() - 86400000)));
                        getTimeClientMac(locationName, macAddress.toLocaleUpperCase(), startTimestring, endTimestring).done(function (data) {
                            changeFormatAnddrawTrace(data);
                        });
                    }
                    else {
                        startTimestring = timetoString(new Date(datetimerange.split("-")[0]));
                        endTimestring = timetoString(new Date(datetimerange.split("-")[1]));
                        getTimeClientMac(locationName, macAddress.toLocaleUpperCase(), startTimestring, endTimestring).done(function (data) {
                            changeFormatAnddrawTrace(data);
                        });
                    }
                }
            }

        }
        else {
            g_areaLayer.addAreaNode();
        }
        //bindEvent();

        // getStudentTrackSwitch().done(function (data) {
        //     g_StudentLayer.clean();
        //     g_StudentLayer.stopUpDate();
        //     g_areaLayer.clean();
        //     if (typeof g_oSwitch.result.studentInfo !== 'undefined') {
        //         g_oStudent = g_oSwitch.result.studentInfo;
        //     }

        //     if (typeof g_oStudent.studentName === 'undefined') {
        //         $('#selectStu').html("未指定");
        //     }
        //     else {
        //         $('#selectStu').html(g_oStudent.studentName);
        //     }

        //     //$('#selectStu').html(g_oStudent.studentName);
        //     if (g_oSwitch.result === "no date") {
        //         $('#trace').MCheckbox("setState", false);
        //     }
        //     if (g_oSwitch.retCode !== -1 && g_oSwitch.result.trackSwitch === 1) {
        //         $('#trace').MCheckbox("setState", true);
        //         var toggleBlock = $("#traceMode");
        //         toggleBlock.toggleClass('hide');
        //         $('#heat-map').toggleClass('hide');
        //         // 如果开启则 跟踪所有的人员

        //         //clientLayer.addClientNode();
        //         if (toggleBlock.hasClass('hide')) {
        //             // stop trace
        //             g_StudentLayer.clean();
        //             g_StudentLayer.stopUpDate();
        //             //g_areaLayer.setVisible(true);
        //             g_areaLayer.setAreaNode(g_areaArray);
        //             g_areaLayer.addAreaNode();
        //             //areaLayer.addAreaNode();
        //         }
        //         else {
        //             // start trace
        //             //g_areaLayer.setVisible(false);
        //             g_areaLayer.clean();
        //             /*判断radio 是实时位置还是轨迹*/
        //             //$($('#divcurPos').children()[0]).children('span').hasClass('checked')
        //             if ($($('#divcurPos').children()[0]).children('span').hasClass('checked')) {
        //                 g_StudentLayer.clean();
        //                 g_StudentLayer.stopUpDate();
        //                 $('#datetimerange').hide();
        //                 var count = 0;
        //                 var client = {
        //                     posX: 200,
        //                     posY: 200,
        //                     clientMac: "00:00:22:fe:aa:bc"
        //                 }
        //                 var locationName = $("#s2id_MapSelect span").html();
        //                 getLocationClientMac(locationName, g_oStudent.wristbandId).done(function (data) {
        //                     if (data.client.length !== 0) {
        //                         var clientArr = [
        //                             { time: 20, XCord: data.client.posX, YCord: data.client.posY, clientMac: data.client.clientMac }
        //                         ];
        //                     }
        //                     else {
        //                         var clientArr = [
        //                             { time: 20, XCord: 190, YCord: 400, clientMac: "0-0-0-0" }
        //                         ];
        //                     }
        //                     g_StudentLayer.drawStudentTrace(clientArr || [], cc.director.getWinSize().width, cc.director.getWinSize().height);
        //                     g_StudentLayer.startUpDate(function () {
        //                         var clientMac = "0-0-0-0";
        //                         var time = 0;
        //                         getLocationClientMac(locationName, g_oStudent.wristbandId).done(function (data) {
        //                             if (data.client.length !== 0) {
        //                                 g_StudentLayer.updateCallback({ time: 10, XCord: data.client.posX, YCord: data.client.posY, clientMac: data.client.clientMac });
        //                             }
        //                             else {
        //                                 var curPos = g_StudentLayer.actionClientNode.getPosition();
        //                                 var maxLen = 30;//px
        //                                 //curPos.x += Math.random()*maxLen;
        //                                 curPos.x += Math.random() * maxLen * (Math.random() > 0.5 ? 1 : -1);
        //                                 curPos.y += Math.random() * maxLen * (Math.random() > 0.5 ? 1 : -1);
        //                                 g_StudentLayer.updateCallback({ time: 10, XCord: curPos.x, YCord: curPos.y, clientMac: clientMac });
        //                             }
        //                         });

        //                     }, 5);

        //                 });

        //             }

        //             if ($($('#divtracePos').children()[0]).children('span').hasClass('checked')) {
        //                 $('#datetimerange').show();
        //                 var datetimerange = $('#datetimerange').attr('value');
        //                 var locationName = $("#s2id_MapSelect span").html();
        //                 var macAddress = g_oStudent.wristbandId;
        //                 var startTime = 0;
        //                 var endTime = 0;
        //                 if (datetimerange === "") {
        //                     /*默认获取当前时间往前推一天的轨迹*/
        //                     endTime = (new Date()).getTime();
        //                     startTime = endTime - 86400000;
        //                     getTimeClientMac(locationName, macAddress, startTime, endTime).done(function (data) {
        //                         changeFormatAnddrawTrace(data);
        //                     });
        //                 }
        //                 else {
        //                     startTime = new Date(datetimerange.split("-")[0]) - 0;
        //                     endTime = new Date(datetimerange.split("-")[1]) - 0;
        //                     getTimeClientMac(locationName, macAddress, startTime, endTime).done(function (data) {
        //                         changeFormatAnddrawTrace(data);
        //                     });
        //                 }
        //             }
        //         }

        //     }
        //     else {
        //         g_areaLayer.addAreaNode();
        //     }
        //     //bindEvent();
        // })
    }

    function initMapList() {

        getMapList().done(function (data) {
            var aData = data.locationImage;
            getLocationArea(aData[0].locationName).done(function (areadata) {
                var areaArray = analysisAreaInfo(areadata, aData[0].locationName);
                g_areaArray = areaArray;
                initCocos(MyConfig.path + '/wloc/map' + aData[0].imagePath, areaArray, data);
            });

        });
        var data = {
            locationImage: [
                {
                    locationName: '拨号室',
                    imagePath: '/img/1.png'
                }
            ]
        };



    }

    function initMapListNew(inittraceswitch) {
        g_StudentLayer.clean();
        g_StudentLayer.stopUpDate();
        g_areaLayer.clean();
        getMapList().done(function (data) {
            var aData = data.locationImage;
            var locationNametem = aData[0].locationName;
            var imagePathtem = aData[0].imagePath;
            for (var i = 0; i < aData.length; i++) {
                if (aData[i].locationName === g_oSwitch.result.locationName) {
                    locationNametem = aData[i].locationName;
                    imagePathtem = aData[i].imagePath;
                }
            }
            getLocationArea(locationNametem).done(function (areadata) {
                var img = new Image();
                img.onload = function () {
                    var img = this,
                        imgW = img.width,
                        imgH = img.height;
                    var canvas = document.getElementById('myCanvas'),
                        canvasW = imgW,
                        canvasH = imgH;
                    var canvasCocos = document.getElementById('Cocos2dGameContainer');
                    canvasCocos.style.width = canvasW + "px";
                    canvasCocos.style.height = canvasH + "px";
                    cc.director._winSizeInPoints.width = canvasW;
                    cc.director._winSizeInPoints.height = canvasH;
                    canvas.width = canvasW;
                    canvas.height = canvasH;
                    var canv = document.createElement('canvas');
                    canv.width = canvasW;
                    canv.height = canvasH;
                    sessionStorage.width = imgW;
                    sessionStorage.height = imgH;
                    var cxt = canv.getContext('2d');
                    cxt.drawImage(img, 0, 0, imgW, imgH, 0, 0, canvasW, canvasH);
                    var imagebase64 = canv.toDataURL();
                    cc.loader.loadImg(imagebase64, { isCrossOrigin: false }, function (err, img) {
                        g_bgLayer.setBackgroundImage(img);
                        inittraceswitch();
                        var areaArray = analysisAreaInfo(areadata, aData[0].locationName);
                        if (g_oSwitch.result.trackSwitch === 0) {
                            g_areaArray = areaArray;
                            g_areaLayer.setAreaNode(g_areaArray);
                            g_areaLayer.addAreaNode();
                        }
                    });
                }

                img.src = MyConfig.path + '/wloc/map' + imagePathtem;
            });
            /*初始化地图列表 */
            var aData = data.locationImage;
            var oOpt = {
                displayField: 'locationName',
                valueField: 'imagePath'
            };
            $('#MapSelect').singleSelect('InitData', aData, oOpt);
            $("#s2id_MapSelect span.select2-chosen").html(locationNametem)
            $('#MapSelect').on('change', function (e) {
                var trackSwitch = 0;
                var curPosOrTrace = 0;
                var studentInfo = g_oStudent;
                var locationName = $("#s2id_MapSelect span").html();
                if ($('#trace').is(':checked')) {
                    trackSwitch = 1
                }

                if ($($('#divcurPos').children()[0]).children('span').hasClass('checked')) {
                    curPosOrTrace = 1;
                }
                var imgPath = $('#MapSelect').singleSelect('value');
                g_oSwitch.result.trackSwitch = trackSwitch;
                g_oSwitch.result.studentInfo = studentInfo;
                g_oSwitch.result.curPosOrTrace = curPosOrTrace;
                g_oSwitch.result.locationName = locationName;
                g_oSwitch.result.imgPath = imgPath;
                setStudentTrackSwitch(trackSwitch, studentInfo, curPosOrTrace, locationName, imgPath).done(function (data) {
                    if (data.retCode === -1) {
                        console.log("setStudentTrackSwitch faile");
                        console.log(data.result.errormsg);
                    }
                });
                changeLoadImg(MyConfig.path + '/wloc/map' + imgPath);
            });

        });
    }

    // function updateEchart(heatData) {
    //     // create some point for show
    //     var locationName = $("#s2id_MapSelect span").html();
    //     getAllLocationClient(locationName).done(function (data) {
    //         //data.client = [{posX:100,posY:200},{posX:400,posY:300},{posX:200,posY:400}]
    //         heatData = data.client.reduce(function (res, cur) {
    //             res.push([cur.posX, cur.posY, 0.1]);
    //             return res;
    //         }, []);
    //         /*假数据*/
    //         if (!heatData || heatData.length === 0) {
    //             heatData = [];
    //             for (var i = 0; i < 20; ++i) {
    //                 heatData.push([
    //                     500 + Math.random() * 1000,
    //                     100 + Math.random() * 800,
    //                     0.8
    //                 ]);
    //             }
    //         }

    //         var option = {
    //             title: {
    //                 text: ''
    //             },
    //             series: [
    //                 {
    //                     type: 'heatmap',
    //                     data: heatData,
    //                     hoverable: false,
    //                     gradientColors: [{
    //                         offset: 0.4,
    //                         color: 'green'
    //                     }, {
    //                             offset: 0.5,
    //                             color: 'yellow'
    //                         }, {
    //                             offset: 0.8,
    //                             color: 'orange'
    //                         }, {
    //                             offset: 1,
    //                             color: 'red'
    //                         }],
    //                     minAlpha: 0.3,
    //                     valueScale: 2,
    //                     opacity: 0.6
    //                 }
    //             ]
    //         };
    //         $("#heat-map").echart("init", option, {});
    //     })

    // }

    function changeLoadImg(imagePath) {
        var img = new Image();
        img.onload = function () {
            var img = this,
                imgW = img.width,
                imgH = img.height;
            var canvas = document.getElementById('myCanvas'),
                canvasW = imgW,
                canvasH = imgH;
            var canvasCocos = document.getElementById('Cocos2dGameContainer');
            canvasCocos.style.width = canvasW + "px";
            canvasCocos.style.height = canvasH + "px";
            cc.director._winSizeInPoints.width = canvasW;
            cc.director._winSizeInPoints.height = canvasH;
            canvas.width = canvasW;
            canvas.height = canvasH;
            sessionStorage.width = canvasW;
            sessionStorage.height = canvasH;
            var canv = document.createElement('canvas');
            canv.width = canvasW;
            canv.height = canvasH;
            var cxt = canv.getContext('2d');
            //cxt.drawImage(img, 0, 0, canvasW, canvasH);
            cxt.drawImage(img, 0, 0, imgW, imgH, 0, 0, canvasW, canvasH);
            //var imagebase64 = canv.toDataURL("image/jpeg");
            var imagebase64 = canv.toDataURL();
            // canvas.width = canvasW;
            // canvas.height = canvasH;
            // var cxt = canvas.getContext('2d');
            // cxt.drawImage(img, 0, 0, canvasW, canvasH);
            // var imagebase64 = canvas.toDataURL("image/jpeg");
            cc.loader.loadImg(imagebase64, { isCrossOrigin: false }, function (err, img) {
                g_bgLayer.setBackgroundImage(img);
                g_StudentLayer.clean();
                g_areaLayer.clean();
                g_StudentLayer.stopUpDate();

                /* 默认选择 */
                if (g_oSwitch.result === "no date") {
                    $('#trace').MCheckbox("setState", false);
                }
                /* 更新全局变量 */
                if (typeof g_oSwitch.result.studentInfo !== 'undefined') {
                    g_oStudent = g_oSwitch.result.studentInfo;
                }
                if (typeof g_oStudent.studentName === 'undefined') {
                    $('#selectStu').html("未指定");
                }
                else {
                    $('#selectStu').html(g_oStudent.studentName);
                }

                if (g_oSwitch.retCode !== -1 && g_oSwitch.result.trackSwitch === 1) {
                    /* 轨迹页面 */
                    g_StudentLayer.clean();
                    g_StudentLayer.stopUpDate();
                    g_areaLayer.clean();
                    //areaLayer.clean();
                    /*判断radio 是实时位置还是轨迹*/
                    //$($('#divcurPos').children()[0]).children('span').hasClass('checked')
                    if ($($('#divcurPos').children()[0]).children('span').hasClass('checked')) {
                        $('#datetimerange').hide();
                        var count = 0;
                        var client = {
                            posX: 200,
                            posY: 200,
                            clientMac: "00:00:22:fe:aa:bc"
                        }
                        var locationName = $("#s2id_MapSelect span").html();
                        getLocationClientMac(locationName, g_oStudent.wristbandId.toLocaleUpperCase()).done(function (data) {
                            if (data.client.length !== 0) {
                                var clientArr = [
                                    { time: 20, XCord: data.client[0].posX, YCord: sessionStorage.height-data.client[0].posY, clientMac: data.client[0].clientMac }
                                ];
                            }
                            else {
                                var clientArr = [
                                    { time: 20, XCord: 190, YCord: 400, clientMac: "0-0-0-0" }
                                ];
                            }
                            g_StudentLayer.drawStudentTrace(clientArr || [], sessionStorage.width, sessionStorage.height);
                            g_StudentLayer.startUpDate(function () {
                                var clientMac = "0-0-0-0";
                                var time = 0;
                                getLocationClientMac(locationName, g_oStudent.wristbandId.toLocaleUpperCase()).done(function (data) {
                                    if (data.client.length !== 0) {
                                        g_StudentLayer.updateCallback({ time: 10, XCord: data.client[0].posX, YCord: sessionStorage.height-data.client[0].posY, clientMac: data.client[0].clientMac });
                                    }
                                    // else {
                                    //     var curPos = g_StudentLayer.actionClientNode.getPosition();
                                    //     var maxLen = 30;//px
                                    //     //curPos.x += Math.random()*maxLen;
                                    //     curPos.x += Math.random() * maxLen * (Math.random() > 0.5 ? 1 : -1);
                                    //     curPos.y += Math.random() * maxLen * (Math.random() > 0.5 ? 1 : -1);
                                    //     g_StudentLayer.updateCallback({ time: 10, XCord: curPos.x, YCord: curPos.y, clientMac: clientMac });
                                    // }
                                });

                            }, 5);

                        });

                    }

                    if ($($('#divtracePos').children()[0]).children('span').hasClass('checked')) {
                        $('#datetimerange').show();
                        var datetimerange = $('#datetimerange').attr('value');
                        var locationName = $("#s2id_MapSelect span").html();
                        var macAddress = g_oStudent.wristbandId;
                        var startTimestring = '';
                        var endTimestring = '';
                        if (datetimerange === "") {
                            /*默认获取当前时间往前推一天的轨迹*/
                            endTimestring = timetoString((new Date()));
                            startTimestring = timetoString((new Date((new Date()).getTime() - 86400000)));
                            getTimeClientMac(locationName, macAddress.toLocaleUpperCase(), startTimestring, endTimestring).done(function (data) {
                                changeFormatAnddrawTrace(data);
                            });
                        }
                        else {
                            startTimestring = timetoString(new Date(datetimerange.split("-")[0]));
                            endTimestring = timetoString(new Date(datetimerange.split("-")[1]));
                            getTimeClientMac(locationName, macAddress.toLocaleUpperCase(), startTimestring, endTimestring).done(function (data) {
                                changeFormatAnddrawTrace(data);
                            });
                        }
                    }

                }
                else {
                    /* 区块页面 */
                    var locationName = $("#s2id_MapSelect span").html();
                    getLocationArea(locationName).done(function (data) {
                        /* 先清除原来的轨迹 */
                        //g_areaLayer.clean();
                        var areaArray = analysisAreaInfo(data, locationName);
                        // for (var i = 0; i < areaArray.length; i++) {
                        //     for (var j = 0; j < areaArray[i].positionArea.length; j++) {
                        //         areaArray[i].positionArea[j].x = areaArray[i].positionArea[j].x * (canvasW / imgW);
                        //         areaArray[i].positionArea[j].y = areaArray[i].positionArea[j].y * (canvasW / imgW);
                        //     }
                        // }
                        g_areaArray = areaArray;
                        /* 画区块 */
                        g_areaLayer.setAreaNode(g_areaArray);
                        g_areaLayer.addAreaNode();
                    })
                }
            });
        }
        img.src = imagePath;
    }

    function initCocosNew() {
        // begin cocos
        var BackgroundLayer = $("canvas").cocos("BackgroundLayer");
        var ClientLayerNew = $("canvas").cocos("ClientLayer");
        var TimeLayer = $("canvas").cocos("TimeLayer");
        var StudentLayer = $("canvas").cocos("StudentLayer");

        var DrawNode = cc.Node.extend({
            ctor: function (position, areaName, locationName) {

                this._super();
                var winSize = cc.director.getWinSize();
                this.areaName = areaName;
                this.locationName = locationName;
                //node.drawRect(cc.p(0,0), cc.p(100, 100), cc.color(255, 0, 0), 1, cc.color(0, 0, 0, 0));
                var points = [];
                this.points = points;
                for (var i = 0; i < position.length; i++) {
                    points.push(cc.p(position[i].x, winSize.height - position[i].y));
                }
                var node = new cc.DrawNode();
                this.areaLayer = node;

                node.drawPoly(points, cc.color(255, 0, 0, 0), 2, cc.color(0, 0, 255, 255));
                node.drawDots(points, 6, cc.color(255, 0, 0));
                this.addChild(node);

                cc.eventManager.addListener({
                    event: cc.EventListener.MOUSE,
                    swallowTouches: true,
                    onMouseMove: this.onMouseMove.bind(this),
                    //onMouseDown: this.onMouseDown.bind(this)
                }, this);

            },
            onMouseDown: function (e) {
                console.log("1111");
                console.log(this.areaName);
                var positon = e.getLocation();
                if (isInsidePolygon(positon, this.points)) {
                    var areaName = this.areaName;
                    if (typeof this.fullLayer === "undefined") {
                        var node = new cc.DrawNode();
                        this.fullLayer = node;
                        node.drawPoly(this.points, cc.color(0, 255, 0, 255), 2, cc.color(0, 0, 255, 255));
                        this.addChild(node);
                        this.count = 1;
                    }
                    console.log(areaName);
                }
                else {
                    this.removeChild(this.fullLayer);
                    delete this.fullLayer;
                    this.count = 0;
                }
                console.log(positon);
            },
            onMouseMove: function (e) {
                var node = new cc.DrawNode();
                var positon = e.getLocation();
                if (isInsidePolygon(positon, this.points)) {
                    var areaName = this.areaName;

                    function addClassHandle() {
                        Utils.Base.openDlg(null, {}, { scope: $("#EditClassDlg"), className: "modal-super" });
                        var oData = [{ areaName: areaName, mac: "aa-bb-cc-ee-ff-11" },
                            { areaName: areaName, mac: "aa-bb-cc-ee-ff-13" }];
                        // $("#arealist").SList('refresh', { data: oData, total:1 });
                        $("#arealist").SList('refresh', oData);

                    }
                    addClassHandle();
                }
            },
            getareaLayer: function () {
                return this.areaLayer;
            },
            drawarea: function (position, areaName, locationName) {
                var winSize = cc.director.getWinSize();
                this.areaName = areaName;
                this.locationName = locationName;
                //node.drawRect(cc.p(0,0), cc.p(100, 100), cc.color(255, 0, 0), 1, cc.color(0, 0, 0, 0));
                var points = [];
                this.points = points;
                for (var i = 0; i < position.length; i++) {
                    points.push(cc.p(position[i].x, winSize.height - position[i].y));
                }
                var node = new cc.DrawNode();
                this.areaLayer = node;
                node.drawDots(points, 6, cc.color(255, 0, 0));

                node.drawPoly(points, cc.color(255, 0, 0, 0), 2, cc.color(0, 0, 255, 255));
                this.addChild(node);
            }
        });

        var ClientNode = cc.Sprite.extend({
            ctor: function () {
                this._super('../classroom/image/client.png'); // 添加图片
                var size = cc.winSize;
                this.attr({
                    x: size.width / 2,
                    y: size.height / 2,
                    scaleX: 0.3,
                    scaleY: 0.3,
                    color: cc.color(255, 255, 255, 255)
                })
            }
        });

        var AreaLayer = cc.Layer.extend({
            areaNodeList: [],
            ctor: function (areaNodeList) {
                this._super();
                this.areaNodeList = areaNodeList;
            },
            clean: function () {
                this.areaNodeList = [];
                this.removeAllChildrenWithCleanup(false);
            },
            addAreaNode: function () {
                for (var i = 0; i < this.areaNodeList.length; i++) {
                    var areaNode = new DrawNode(this.areaNodeList[i].positionArea, this.areaNodeList[i].areaName, this.areaNodeList[i].areaLocation);
                    //g_areaLayer.clean();
                    //areaNode.drawarea(this.areaNodeList[i].positionArea, this.areaNodeList[i].areaName, this.areaNodeList[i].areaLocation);
                    this.addChild(areaNode);
                }
            },
            setAreaNode: function (areaNodeList) {
                this.areaNodeList = areaNodeList;
            }
        });

        var ClientLayer = cc.Layer.extend({
            clientNodeList: [],
            ctor: function () {
                this._super();
            },
            onExist: function () {
                this.stopUpDate();
            },
            clean: function () {
                this.clientNodeList = [];
                this.removeAllChildrenWithCleanup(false);
            },
            addClientNode: function (stuList) {
                // node list
                stuList.forEach(function (stu) {
                    //create node 
                    var node = new ClientNode();
                    this.addChild(node);
                }, this);

            },
            addChild: function (child, zOrder, tag) {
                var clientNodeList = this.clientNodeList;
                if (clientNodeList.find(function (node, index, array) {
                    return node.name === child.name;
                })) {
                    debugger;
                    return;
                }
                this._super(child, zOrder, tag);
            },
            removeChild: function (sprite, cleanup) {
                var clientNodeList = this.clientNodeList,
                    index = clientNodeList.findIndex(function (node, index, array) {
                        return node.name === sprite.name;
                    });

                if (index !== -1) {
                    clientNodeList.splice(index, 1);
                    this._super(sprite, cleanup);
                }
                this._super(sprite, cleanup);
                return;
            },
            startUpDate: function (callback) {
                this.getClientNode = callback;
                this._scheduler.scheduleCallbackForTarget(this, this.getClientNode, 2, cc.REPEAT_FOREVER, 0);
            },
            stopUpDate: function () {
                this._scheduler.unscheduleCallbackForTarget(this, this.getClientNode);
            }
        });

        var MapScene = cc.Scene.extend({
            onEnter: function () {
                this._super();
                cc.director.setDisplayStats(false);
                /*添加背景层*/
                var bgLayer = new BackgroundLayer(false);
                this.bgLayer = bgLayer;
                this.addChild(bgLayer);
                g_bgLayer = bgLayer;

                var clientLayerNew = new ClientLayerNew();
                this.addChild(clientLayerNew);
                g_ClientLayer = clientLayerNew;

                var timeLayer = new TimeLayer();
                this.addChild(timeLayer);
                g_StudentLayer = timeLayer;

                var studentLayer = new StudentLayer();
                this.addChild(studentLayer);
                g_StudentLayer = studentLayer;

                /*添加client层*/
                var clientLayer = new ClientLayer();
                this.addChild(clientLayer);
                this.clientLayer = clientLayer;
                /*添加区块层*/
                var areaLayer = new AreaLayer([]);
                //areaLayer.addAreaNode();
                this.areaLayer = areaLayer;
                g_areaLayer = areaLayer;
                this.addChild(areaLayer);
                initMapListNew(initTraceSwitch);
                //initTraceSwitch();
            }
        });

        cc.game.onStart = function () {
            cc.LoaderScene.preload([], function () {
                g_mapScene = new MapScene();
                cc.director.runScene(g_mapScene);
                /*因为有一层echar盖住了背景图，所以背景图的鼠标移动事件不会被触发，所以通过echar响应鼠标移动事件
                * 来触发画布的鼠标移动事件*/
                // $("#heat-map").mousemove(function (e) {
                //     //$('#MyCanvas').trigger('mousemove', );
                //     console.log('echart mouse move');
                //     $('#myCanvas').trigger('mousemove', e);
                // });
            }, this);
        }

        cc.game.run("myCanvas");
    }

    function drawnaode() {
        var g_clientList = [
            {
                clientMac: '1111-2222-3333',
                XCord: Math.random() * 200 + 100,
                YCord: Math.random() * 200 + 100,
                clientStatus: 1
            },
            {
                clientMac: '1111-2222-3334',
                XCord: Math.random() * 200 + 100,
                YCord: Math.random() * 200 + 100,
                clientStatus: 1
            }
        ];
        g_ClientLayer.clean();
        g_ClientLayer.drawClientNodes(g_clientList);
    }

    // function realTimePosition() {
    //     g_ClientLayer.startUpDate(function () {
    //         var layer = this;
    //         var date = new Date();
    //         var locationName = $("#s2id_MapSelect span").html();
    //         //var curTime = date.getTime()/1000;
    //         var curTime = 0;

    //         getAllLocationClient(locationName).done(function (date) {

    //             drawnaode();
    //             //window.setInterval(drawnaode(), 1000);
    //         });

    //     });
    // }

    function bindEvent() {
        // 是否开启学生追踪 
        // 如果开启 隐藏热图，显示追踪轨迹
        $('#trace').on('change', function (event) {
            g_StudentLayer.clean();
            g_StudentLayer.stopUpDate();
            g_areaLayer.clean();
            var toggleBlock = $("#traceMode");
            toggleBlock.toggleClass('hide');
            var trackSwitch = 0;
            var curPosOrTrace = 0;
            var studentInfo = g_oStudent;
            var locationName = $("#s2id_MapSelect span").html();
            if ($('#trace').is(':checked')) {
                trackSwitch = 1
            }

            if ($($('#divcurPos').children()[0]).children('span').hasClass('checked')) {
                curPosOrTrace = 1;
            }
            var imgPath = $('#MapSelect').singleSelect('value');
            g_oSwitch.result.trackSwitch = trackSwitch;
            g_oSwitch.result.studentInfo = studentInfo;
            g_oSwitch.result.curPosOrTrace = curPosOrTrace;
            g_oSwitch.result.locationName = locationName;
            g_oSwitch.result.imgPath = imgPath
            setStudentTrackSwitch(trackSwitch, studentInfo, curPosOrTrace, locationName, imgPath).done(function (data) {
                if (data.retCode === -1) {
                    console.log("setStudentTrackSwitch faile");
                    console.log(data.result.errormsg);
                }
            });

            // 如果开启则 跟踪所有的人员

            //clientLayer.addClientNode();
            if (toggleBlock.hasClass('hide')) {
                // stop trace
                g_StudentLayer.clean();
                g_StudentLayer.stopUpDate();
                g_areaLayer.clean();
                //g_areaLayer.setVisible(true);
                getLocationArea(locationName).done(function (data) {
                    /* 先清除原来的轨迹 */
                    //g_areaLayer.clean();
                    var areaArray = analysisAreaInfo(data, locationName);
                    g_areaArray = areaArray;
                    /* 画区块 */
                    g_areaLayer.setAreaNode(g_areaArray);
                    g_areaLayer.addAreaNode();
                });
                //areaLayer.addAreaNode();
            }
            else {
                // start trace
                //g_areaLayer.setVisible(false);
                //areaLayer.clean();
                g_areaLayer.clean();
                g_StudentLayer.clean();
                g_StudentLayer.stopUpDate();
                /*判断radio 是实时位置还是轨迹*/
                if ($($('#divcurPos').children()[0]).children('span').hasClass('checked')) {
                    $('#datetimerange').hide();
                    var count = 0;
                    var client = {
                        posX: 200,
                        posY: 200,
                        clientMac: "00:00:22:fe:aa:bc"
                    }
                    var locationName = $("#s2id_MapSelect span").html();
                    getLocationClientMac(locationName, g_oStudent.wristbandId.toLocaleUpperCase()).done(function (data) {
                        g_areaLayer.clean();
                        g_StudentLayer.clean();
                        g_StudentLayer.stopUpDate();
                        if (data.client.length !== 0) {
                            var clientArr = [
                                { time: 20, XCord: data.client[0].posX, YCord: sessionStorage.height-data.client[0].posY, clientMac: data.client[0].clientMac }
                            ];
                        }
                        else {
                            var clientArr = [
                                { time: 20, XCord: 190, YCord: 400, clientMac: "0-0-0-0" }
                            ];
                        }
                        g_StudentLayer.drawStudentTrace(clientArr || [], sessionStorage.width, sessionStorage.height);
                        g_StudentLayer.startUpDate(function () {
                            var clientMac = "0-0-0-0";
                            var time = 0;
                            getLocationClientMac(locationName, g_oStudent.wristbandId.toLocaleUpperCase()).done(function (data) {
                                if (data.client.length !== 0) {
                                    g_StudentLayer.updateCallback({ time: 10, XCord: data.client[0].posX, YCord: sessionStorage.height-data.client[0].posY, clientMac: data.client[0].clientMac });
                                }
                                // else {
                                //     var curPos = g_StudentLayer.actionClientNode.getPosition();
                                //     var maxLen = 30;//px
                                //     //curPos.x += Math.random()*maxLen;
                                //     curPos.x += Math.random() * maxLen * (Math.random() > 0.5 ? 1 : -1);
                                //     curPos.y += Math.random() * maxLen * (Math.random() > 0.5 ? 1 : -1);
                                //     g_StudentLayer.updateCallback({ time: 10, XCord: curPos.x, YCord: curPos.y, clientMac: clientMac });
                                // }
                            });

                        }, 5);

                    });

                }

                if ($($('#divtracePos').children()[0]).children('span').hasClass('checked')) {
                    $('#datetimerange').show();
                    var datetimerange = $('#datetimerange').attr('value');
                    var locationName = $("#s2id_MapSelect span").html();
                    var macAddress = g_oStudent.wristbandId;
                    var startTimestring = '';
                    var endTimestring = '';
                    if (datetimerange === "") {
                        /*默认获取当前时间往前推一天的轨迹*/
                        endTimestring = timetoString((new Date()));
                        startTimestring = timetoString((new Date((new Date()).getTime() - 86400000)));
                        getTimeClientMac(locationName, macAddress.toLocaleUpperCase(), startTimestring, endTimestring).done(function (data) {
                            changeFormatAnddrawTrace(data);
                        });
                    }
                    else {
                        startTimestring = timetoString(new Date(datetimerange.split("-")[0]));
                        endTimestring = timetoString(new Date(datetimerange.split("-")[1]));
                        getTimeClientMac(locationName, macAddress.toLocaleUpperCase(), startTimestring, endTimestring).done(function (data) {
                            changeFormatAnddrawTrace(data);
                        });
                    }
                }
            }
        });

        // openDlg
        $("#selectStu").on('click', function (event) {
            // clean form
            $("#stu_name_error").css("display","none");
            $("#class_name_error").css("display","none");
            $("#grad-select_error").css("display","none");
            Utils.Base.openDlg(null, {}, { scope: $("#SelectDlg"), className: "modal-large" });
        });

        $('#datetimerange').on("inputchange.datarange", function (e) {
            //forbiddenClick();
            var orange = $(this).daterange("getRangeData");
            var startTimestring = timetoString(new Date(orange.startData));
            var endTimestring = timetoString(new Date(orange.endData));
            var locationName = $("#s2id_MapSelect span").html();
            var macAddress = g_oStudent.wristbandId;
            getTimeClientMac(locationName, macAddress.toLocaleUpperCase(), startTimestring, endTimestring).done(function (data) {
                changeFormatAnddrawTrace(data);
            });

        })

        // init form
        $("#addStudent_form").form("init", "edit", {
            "title": '选择学生',
            "btn_apply": function () {
                // start trace
                // 如果选择 则跟踪某个人员
                // use some layer
                var gradeName = $("#grad-select").singleSelect("value");
                var className = $("#class_name").singleSelect("value");
                var stuName = $("#stu_name").singleSelect("value");

                //学生全部信息：studentName  years  wristbandId  studentId   classId  gradeType  baseGrade
                g_oStudent = {};
                $.extend(g_oStudent, g_oStuList[gradeName][className][stuName]);
                var regExp = /\-/g
                g_oStudent.wristbandId = g_oStudent.wristbandId.replace(regExp, ":");

                $("#selectStudent").empty();
                $("#selectStudent").html(stuName);
                $("#selectStudent").attr("years", g_oStudent.years);
                $("#selectStudent").attr("wristbandId", g_oStudent.wristbandId);
                $("#selectStudent").attr("studentId", g_oStudent.studentId);
                $("#selectStudent").attr("classId", g_oStudent.classId);
                $("#selectStudent").attr("studentName", g_oStudent.stundentName);
                $("#selectStudent").attr("baseGrade", g_oStudent.baseGrade);
                $('#selectStu').html(stuName);
                Utils.Pages.closeWindow(Utils.Pages.getWindow($("#addStudent_form")));
                var trackSwitch = 0;
                var curPosOrTrace = 0;
                var studentInfo = g_oStudent;
                var locationName = $("#s2id_MapSelect span").html();
                if ($('#trace').is(':checked')) {
                    trackSwitch = 1
                }

                if ($($('#divcurPos').children()[0]).children('span').hasClass('checked')) {
                    curPosOrTrace = 1;
                }
                var imgPath = $('#MapSelect').singleSelect('value');
                g_oSwitch.result.trackSwitch = trackSwitch;
                g_oSwitch.result.studentInfo = studentInfo;
                g_oSwitch.result.curPosOrTrace = curPosOrTrace;
                g_oSwitch.result.locationName = locationName;
                g_oSwitch.result.imgPath = imgPath;
                setStudentTrackSwitch(trackSwitch, studentInfo, curPosOrTrace, locationName, imgPath).done(function (data) {
                    if (data.retCode === -1) {
                        console.log("setStudentTrackSwitch faile");
                        console.log(data.result.errormsg);
                    }
                });
            }, "btn_cancel": function () {
                // stop select
                Utils.Pages.closeWindow(Utils.Pages.getWindow($("#addStudent_form")));
            }
        });
    }



    function initForm() {

        $('#tracePos').click(function () {
            g_ClientLayer.stopUpDate();
            g_ClientLayer.clean();
            g_StudentLayer.clean();
            g_StudentLayer.stopUpDate();
            $('#datetimerange').show();
            var datetimerange = $('#datetimerange').attr('value');
            var locationName = $("#s2id_MapSelect span").html();
            var macAddress = g_oStudent.wristbandId;
            var startTime = 0;
            var endTime = 0;
            if (datetimerange === "") {
                /*默认获取当前时间往前推一天的轨迹*/
                // endTime = (new Date()).getTime();
                // startTime = endTime - 86400000;
                // getTimeClientMac(locationName, macAddress, startTime, endTime).done(function (data) {
                //     changeFormatAnddrawTrace(data);
                // });
            }
            else {
                var startTimestring = timetoString(new Date(datetimerange.split("-")[0]));
                var endTimestring = timetoString(new Date(datetimerange.split("-")[1]));
                getTimeClientMac(locationName, macAddress.toLocaleUpperCase(), startTimestring, endTimestring).done(function (data) {
                    changeFormatAnddrawTrace(data);
                });
            }
        })

        $('#curPos').click(function () {
            $('#datetimerange').hide();
            var count = 0;
            var locationName = $("#s2id_MapSelect span").html();
            getLocationClientMac(locationName, g_oStudent.wristbandId.toLocaleUpperCase()).done(function (data) {
                g_StudentLayer.clean();
                g_StudentLayer.stopUpDate();
                if (data.client.length !== 0) {
                    var clientArr = [
                        { time: 20, XCord: data.client[0].posX, YCord: sessionStorage.height-data.client[0].posY, clientMac: data.client[0].clientMac }
                    ];
                }
                else {
                    var clientArr = [
                        { time: 20, XCord: 400, YCord: 400, clientMac: "0-0-0-0" }
                    ];
                }
                g_StudentLayer.drawStudentTrace(clientArr || [], sessionStorage.width, sessionStorage.height);
                g_StudentLayer.startUpDate(function () {
                    var clientMac = "0-0-0-0";
                    var time = 0;
                    getLocationClientMac(locationName, g_oStudent.wristbandId.toLocaleUpperCase()).done(function (data) {
                        if (data.client.length !== 0) {
                            g_StudentLayer.updateCallback({ time: 10, XCord: data.client[0].posX, YCord: sessionStorage.height-data.client[0].posY, clientMac: data.client[0].clientMac });
                        }
                        // else {
                        //     var curPos = g_StudentLayer.actionClientNode.getPosition();
                        //     var maxLen = 30;//px
                        //     //curPos.x += Math.random()*maxLen;
                        //     curPos.x += Math.random() * maxLen * (Math.random() > 0.5 ? 1 : -1);
                        //     curPos.y += Math.random() * maxLen * (Math.random() > 0.5 ? 1 : -1);
                        //     g_StudentLayer.updateCallback({ time: 10, XCord: curPos.x, YCord: curPos.y, clientMac: clientMac });
                        // }
                    });

                }, 5);

            });
        })

    }


    function initDlog() {
        var closeWindow = function () {
            Utils.Pages.closeWindow(Utils.Pages.getWindow($("#addClass_form")));
        }

        $("#addClass_form").form("init", "edit", {
            "title": "区块学生信息",
            btn_apply: false,
            btn_cancel: false,
            // "btn_cancel": closeWindow
        });
    }

    function initSlist() {
        var option = {
            colNames: '区块名,手环Mac'.split(','),
            showHeader: true,
            multiSelect: true,
            //showOperation: true,
            onSearch: function (oFilter, oSorter) {
                getClassData(0, 10, oFilter);
            },
            colModel: [
                { name: 'areaName', datatype: 'String' },
                { name: 'mac', datatype: 'String' }
            ]
        };
        $("#arealist").SList("head", option);
    }
    function _init() {
        
        function setBreadContent(paraArr){
            
            if(paraArr[0].text != ""){
                $("#bread_1").css("display",'inline');
                $("#bread_1 a").attr("href",paraArr[0].href);
                $("#bread_1 a").text(paraArr[0].text);
            }else{
                $("#bread_1").css("display",'none');
            }
            
            if(paraArr[1].text != ""){
                $("#bread_2").css("display",'inline');
                $("#bread_2 a").attr("href",paraArr[1].href);
                $("#bread_2 a").text(paraArr[1].text);
            }else{
                $("#bread_2").css("display",'none');
            }
            
            if(paraArr[2].text != ""){
                $("#bread_active").css("display",'inline');
                $("#bread_active").text(paraArr[2].text);
            }else{
                $("#bread_active").css("display",'none');
            }
        }
        setBreadContent([{text:'',href:''},
                        {text:'',href:''},
                        {text:'学生追踪',href:''}]);
                        
        getStudent().done(function (data) {
            var stuList = data.result.data;

            //保存学生信息
            g_oStuList = {};
            g_oStudent = {};
            // 这里 分类处理班级和 学生信息
            var oStuList = {},
                aGradeList = [],
                aClassList = [];

            data.result.data.forEach(function (stu, index) {
                oStuList[stu.grade] = oStuList[stu.grade] || {};
                oStuList[stu.grade][stu.classId] = oStuList[stu.grade][stu.classId] || [];
                //oStuList[stu.grade][stu.classId] = stu.studentName;
                oStuList[stu.grade][stu.classId].push(stu.studentName);
                //保存学生信息
                g_oStuList[stu.grade] = g_oStuList[stu.grade] || {};
                g_oStuList[stu.grade][stu.classId] = g_oStuList[stu.grade][stu.classId] || {};
                g_oStuList[stu.grade][stu.classId][stu.studentName] = g_oStuList[stu.grade][stu.classId][stu.studentName] || {};
                g_oStuList[stu.grade][stu.classId][stu.studentName] = g_oStuList[stu.studentName] || {};
                g_oStuList[stu.grade][stu.classId][stu.studentName].years = stu.years;
                g_oStuList[stu.grade][stu.classId][stu.studentName].studentId = stu.studentId;
                g_oStuList[stu.grade][stu.classId][stu.studentName].wristbandId = stu.wristbandId;
                g_oStuList[stu.grade][stu.classId][stu.studentName].gradeType = stu.gradeType;
                g_oStuList[stu.grade][stu.classId][stu.studentName].baseGrade = stu.baseGrade;
                g_oStuList[stu.grade][stu.classId][stu.studentName].classId = stu.classId;
                g_oStuList[stu.grade][stu.classId][stu.studentName].grade = stu.grade;
                g_oStuList[stu.grade][stu.classId][stu.studentName].studentName = stu.studentName;
                g_oStudent = g_oStuList[stu.grade][stu.classId][stu.studentName];
                var regExp = /\-/g;
                g_oStudent.wristbandId = g_oStudent.wristbandId.replace(regExp, ":");
                //initMapList();
            })

            for (var grade in oStuList) {
                aGradeList.push(grade + '');
            }

            // init singleSelect

            $('#grad-select').singleSelect('InitData', aGradeList);

            $('#grad-select').change(function (e) {
                var aClassList = [];
                for (var classId in oStuList[this.value]) {
                    aClassList.push(classId);
                }
                $('#class_name').singleSelect('InitData', aClassList);
            });

            $('#class_name').change(function (e) {
                var grade = $('#grad-select')[0].value,
                    classId = this.value;
                $('#stu_name').singleSelect('InitData', oStuList[grade][classId]);
            })
        })
        bindEvent();
        initForm();
        initDlog();
        initSlist();
        getStudentTrackSwitch().done(function (data) {
            g_oSwitch = data;
            initCocosNew();
        });
    }

    function _destroy() {
        clearInterval(g_time);
        g_oStudent = null;
    }


    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["SList", "Form", "SingleSelect", "DateTime", "DateRange", "Echart", "Minput", "Switch", 'Cocos'],
        "utils": ["Base", "Timer", 'Device', 'Request']
    });


})(jQuery);