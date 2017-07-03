define(['jquery', 'utils'], function ($, utils) {
    return ['$scope', '$http', '$alertService', '$timeout', '$state', '$stateParams', function ($scope, $http, $alert, $timeout, $state, $stateParams) {

        $scope.app = {
            intemplet: {},
            outtemplet: {},
            intype: {},
            outtype: {}
        };
        var rcCache = {};
        $scope.isclick = true;
        $scope.webpage = {
            prompt : "创建失败",
            httpmethod : "post",
            success : "创建成功"
        }
        $scope.templetpager = {};
        $scope.local = {
            origin: []
        };

        $scope.htps = {
            alltemplet: [],
            templet: [],
            type: []
        };

        $scope.title = "增加定制应用";

        $scope.applabel = {
            applabelall : [],
            applabelinput : "",
            addlabel : function () {
                if($scope.applabel.applabelinput != "" && $scope.applabel.applabelall.indexOf($scope.applabel.applabelinput) === -1){
                    $scope.applabel.applabelall = $scope.applabel.applabelall.concat($scope.applabel.applabelinput);
                }
            },
            dellabel : function (item) {
                $scope.applabel.applabelall.splice($scope.applabel.applabelall.indexOf(item), 1);
            }
        };

        var httpdata = {
            users: []
        };

        if ($stateParams.appId) {
            $scope.title = "修改定制应用";
            $scope.webpage.httpmethod = "put";
            $scope.webpage.prompt = "修改失败";
            $scope.webpage.success = "修改成功";
            $http({
                method: 'GET',
                url: '/v3/ace/oasis/oasis-rest-application/restapp/tempApp/app/' + $stateParams.appId
            }).then(function success(response) {
                if (response.data.code == 0) {
                    $scope.app.Name = response.data.data.name;
                    $scope.app.breif = response.data.data.desc;
                    $scope.app.path = response.data.data.logo;
                    $scope.app.outtemplet.id = response.data.data.app;
                    $scope.app.outtemplet.name = response.data.data.appName;
                    $scope.app.outtype.id = response.data.data.typeId;
                    $scope.app.outtype.name = response.data.data.typeName;
                    $scope.local.origin = response.data.data.shops;
                    httpdata.users = response.data.data.users;
                } else {
                    $alert.alert("获取数据失败", "错误");
                }
            }, function error(response) {
                $alert.alert("获取数据失败", "错误");
            });
        }

        function getRcString(key) {
            if (!rcCache[key]) {
                rcCache[key] = $('#appmanageAddRc').attr(key);
            }
            return rcCache[key];
        }

        //获取购买过的模板
        $http({
            method: 'GET',
            url: '/v3/ace/oasis/oasis-rest-application/restapp/appStore/mines/tempApp'
        }).then(function success(response) {
            if (response.data.code == 0) {
                $scope.htps.alltemplet = [].concat(response.data.data);
                $scope.htps.templet = [].concat($scope.htps.alltemplet);
                $scope.totalpage();
            } else {
                $alert.alert("获取模板应用失败", "错误");
            }
        }, function error(response) {
            $alert.alert("获取模板应用失败", "错误");
        });

        //获取应用类型
        $http({
            method: 'GET',
            url: '/v3/ace/oasis/oasis-rest-application/restapp/tempApp/appTypes'
        }).then(function success(response) {
            if (response.data.code == 0) {
                $scope.htps.type = response.data.data;
            } else {
                $alert.alert("获取应用类型失败", "错误");
            }
        }, function error(response) {
            $alert.alert("获取应用类型失败", "错误");
        });

        //获取userID,用于获取权限
        var userId;

        function getuserid() {
            $http({
                method: 'GET',
                url: '/v3/ace/oasis/oasis-rest-user/restapp/users/detail'
            }).then(function success(response) {
                if (response.data.code == 0) {
                    userId = response.data.data.id;
                    authority();
                } else {
                    $alert.alert("获取用户ID失败", "错误");
                }
            }, function error(response) {
                $alert.alert("获取用户ID失败", "错误");
            });
        }

        getuserid();

        //获取应用权限
        function authority() {
            $http({
                method: 'GET',
                url: '/v3/ace/oasis/oasis-rest-user/restapp/users/getAllSubUsers?user_id=' + userId
            }).then(function success(response) {
                if (response.data.code == 0) {
                    $.each(response.data.data, function (i, v) {
                        httpdata.users.push({
                            userId: v,
                            userName: i
                        })
                    })
                } else {
                    $alert.alert("获取应用权限失败", "错误");
                    // $alert.noticeDanger("获取应用权限失败");
                }
            }, function error(response) {
                $alert.alert("获取应用权限失败", "错误");
            });
        }

        //上传图片
        $('#btnUpload').on('click', function () {
            $('#file').trigger('click');
        });
        $('#falfile').on('click', function () {
            $('#file').trigger('click');
        });
        $('#file').on('change', function (e) {
                var filepath = $('#file').val();
                var extStart = filepath.lastIndexOf(".");
                var ext = filepath.substring(extStart, filepath.length).toUpperCase();
                if (ext != ".BMP" && ext != ".PNG" && ext != ".GIF" && ext != ".JPG" && ext != ".JPEG" && ext != ".DWG") {
                    $alert.noticeDanger(getRcString('picture-format'));
                } else {
                    var file_size = $('#file')[0].files[0].size;
                    var size = file_size / 1024;
                    if (size > 2048) {
                        $alert.noticeDanger(getRcString('picture-size'));
                    } else {
                        $scope.$apply(function () {
                            $scope.fileName = e.target.value.substr(e.target.value.lastIndexOf('\\') + 1);
                            $http({
                                url: "/v3/ace/oasis/oasis-rest-map/restapp/uploadfile/imageUpload",
                                method: 'POST',
                                headers: {
                                    'Content-Type': undefined
                                },
                                transformRequest: function () {
                                    var formData = new FormData();
                                    formData.append('file', $('#file')[0].files[0]);
                                    return formData;
                                }
                            }).success(function (data) {
                                if (data) {
                                    if (data.code == 0) {
                                        $scope.app.path = data.path;
                                    }
                                }
                            });
                        });
                    }
                }
            }
        );

        //弹框
        $scope.box = {
            //模板应用
            templetOption: {
                mId: "templetbox",
                title: getRcString('templet-choice'),
                modalSize: "lg",
                autoClose: false,
                okHandler: function () {
                    if (!$scope.app.intemplet.name) {
                        $alert.noticeDanger(getRcString('please-templet-choice'));
                    } else {
                        $scope.app.outtemplet = $scope.app.intemplet;
                        $scope.$broadcast("hide#templetbox");
                    }
                }
            },
            searchfortem: "",
            templetOpen: function () {
                $scope.box.searchfortem = "";
                $scope.app.intemplet = $scope.app.outtemplet;
                $scope.searchfortemplet();
                $scope.$broadcast("show#templetbox");
            },
            //应用类型
            typeOption: {
                mId: "typebox",
                title: getRcString('type-choice'),
                modalSize: "lg",
                autoClose: false,
                okHandler: function () {
                    if (!$scope.app.intype.id) {
                        $alert.noticeDanger(getRcString('please-type-choice'));
                    } else {
                        $scope.app.outtype = $scope.app.intype;
                        $scope.$broadcast("hide#typebox");
                    }
                }
            },
            typeOpen: function () {
                $.each($scope.htps.type,function (i,v) {
                    if($scope.app.outtype.id == v.id){
                        $scope.app.intype = v;
                    }
                })
                // $scope.app.intype = $scope.app.outtype;
                $scope.$broadcast("show#typebox");
            },
            //数据来源
            originOption: {
                mId: "originbox",
                title: getRcString('origin-choice'),
                modalSize: "lg",
                autoClose: false,
                okHandler: function () {
                    $scope.$broadcast('getSelections#origintab', function (data) {
                        if (data.length == 0) {
                            $alert.noticeDanger(getRcString('please-origin-choice'));
                        } else {
                            $scope.$broadcast("hide#originbox");
                            var usedata = {};
                            $.each($scope.local.origin, function (index, item) {
                                usedata[item.shopId] = item.shopName;
                            })
                            $.each(data, function (index, item) {
                                if (!usedata[item.id]) {
                                    usedata[item.id] = item.shopName;
                                }
                            })
                            $scope.local.origin = [];
                            $.each(usedata, function (index, item) {
                                $scope.local.origin = $scope.local.origin.concat({shopId: index, shopName: item});
                            })
                        }
                    });
                }
            },
            originOpen: function () {
                $scope.$broadcast("show#originbox");
                $scope.$broadcast('refresh#origintab', {
                    url: '/v3/ace/oasis/oasis-rest-shop/restshop/shopModel/shops?ascending=false&queryCondition='
                });
            },
            //预览
            previewOption: {
                mId: "previewbox",
                title: getRcString('preview-choice'),
                modalSize: "lg",
                showOk: false,
                autoClose: false
            },
            previewOpen: function () {
                $scope.$broadcast("show#previewbox");
            }
        };

        //表格
        var originTableHeader = getRcString('origin-table-header').split(',');
        $scope.tables = {
            origintable: {
                tId: "origintab",
                //url: '/v3/ace/oasis/oasis-rest-shop/restshop/shopModel/shops?ascending=false&queryCondition=',
                totalField: 'data.rowCount',
                sortField: 'orderby',
                dataField: 'data.data',
                showCheckBox: true,
                singleSelect: false,
                sortName: 'id',
                sortOrder: 'asc',
                pageList: [8, 10, 25, 50, 100],
                pageSize: 8,
                columns: [
                    {
                        field: 'shopName', title: originTableHeader[0], formatter: function (val, row, index) {
                        return row.shopName.replace(/\s/g, '&nbsp;');
                    }
                    },
                    {field: 'addrShow', title: originTableHeader[1]},
                    {
                        field: 'shopDesc', title: originTableHeader[2], formatter: function (val, row, index) {
                        if (row.shopDesc) {
                            return row.shopDesc.replace(/\s/g, '&nbsp;');
                        }
                    }
                    },
                    {field: 'regionName', title: originTableHeader[3]}
                ],
                sidePagination: 'server'
            }
        };

        $scope.templetclick = function (item) {
            $scope.app.intemplet = item;
        };

        $scope.delorigin = function (item) {
            $scope.local.origin.splice($scope.local.origin.indexOf(item), 1);
        };

        $scope.submitData = function () {
            $scope.isclick = false;
            if (!httpdata.users.length) {
                getuserid();
            }
            if ($stateParams.appId) {
                httpdata.id = parseInt($stateParams.appId);
            }
            httpdata.name = $scope.app.Name;
            httpdata.desc = $scope.app.breif;
            httpdata.logo = $scope.app.path;
            httpdata.app = $scope.app.outtemplet.id;
            httpdata.appName = $scope.app.outtemplet.name;
            httpdata.typeId = $scope.app.outtype.id;
            httpdata.shops = $scope.local.origin;
            $http({
                method: $scope.webpage.httpmethod,
                url: '/v3/ace/oasis/oasis-rest-application/restapp/tempApp/app',
                data: httpdata
            }).then(function success(response) {
                $scope.isclick = true;
                if (response.data.code == 0) {
                    $alert.msgDialogSuccess($scope.webpage.success);
                    $state.go("global.content.application.appdiy");
                } else {
                    $alert.msgDialogError($scope.webpage.prompt);
                }
            }, function error(response) {
                $scope.isclick = true;
                $alert.msgDialogError($scope.webpage.prompt);
            });
        };

        $scope.cancelAdd = function () {
            $state.go("global.content.application.appdiy");
        };

        $scope.searchfortemplet = function () {
            if ($scope.box.searchfortem) {
                $scope.htps.templet = [];
                $.each($scope.htps.alltemplet, function (i, v) {
                    if (v.name.indexOf($scope.box.searchfortem) != -1) {
                        $scope.htps.templet = $scope.htps.templet.concat(v);
                    }
                    $scope.totalpage();
                })
            } else {
                $scope.htps.templet = [].concat($scope.htps.alltemplet);
                $scope.totalpage();
            }
        }

        $scope.totalpage = function() {
            $scope.pager.totalPages = Math.ceil($scope.htps.templet.length / 8);
            if($scope.pager.totalPages == 0){
                $scope.pager.totalPages = 1;
            }
            $scope.templetpager.data = $scope.htps.templet.slice(0, 8);
        }

        //分页
        $scope.pager = {
            totalPages: 0,
            visiblePages: 2,
            onChange: function (page) {
                $scope.templetpager.data = $scope.htps.templet.slice(page * 8 - 8, page * 8);
                try {
                    $scope.$digest();
                } catch (e) {
                    console.log(e);
                }
            }
        }
    }];
});