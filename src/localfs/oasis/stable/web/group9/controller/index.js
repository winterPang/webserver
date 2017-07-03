/**
 * Created by Administrator on 2016/11/17.
 */
define(['utils', 'jquery','common9/devices', 'css!group9/css/branch-table', 'css!group9/css/index'], function (Utils, $, Dev) {
        return ['$scope', '$compile', '$http', '$alertService', '$timeout', '$state','$stateParams', function ($scope, $compile, $http, $alert, $timeout, $state, $stateParams) {
            function getRcString(attrName) {
                return Utils.getRcString("model_rc", attrName);
            }

            var apTableTitle = getRcString("APsBranchTitle").split(",");

            var devSNPromise = Dev.getAlias($stateParams.nasid);

            var setApGroupUrl = Utils.getUrl('POST', '', '/cloudapgroup', '/init/branchOther5/upload_apgroup.json');
            var getApGroupUrl = Utils.getUrl('POST', '', '/cloudapgroup', '/init/branchOther5/upload_apgroup.json');
            var getModalframeUrl = Utils.getUrl('GET', '', '/ace/oasis/oasis-rest-shop/restshop/shopModel/shopdevices2/' + $scope.sceneInfo.nasid, '/init/branchOther5/get_ap_brief_info.json');
            //
            // var getAPByCloudGroupUrl=Utils.getUrl('GET','','/apmonitor/getApBriefInfoByCloudGroup','/init/branchOther5/upload_apgroup.json');
            // var APsTitle=getRcString("APsBranchTitle").split(',');
            // var data = {
            //         alias :"总部",
            //         branchDescription:'管理所有Ap数据',
            //         apcount:666
            // };

            function elementConnect(grade, treeItemId, parentExpandStrArr) {

                var firstTemplate = '<tr id="{{%(branch.id)s}}" ng-show="%(branch.expanderCurrentShow)s" ng-mouseenter="%(branch.tipsShow)s = !%(branch.tipsShow)s" '
                    + 'ng-mouseleave="%(branch.tipsShow)s = !%(branch.tipsShow)s"><td>'
                    + '<i ng-click="%(branch.expanderNextShow)s = !%(branch.expanderNextShow)s; menuIcon($event,%(branch.obj)s);" '
                    + ' class="fa  table_tr_icon %(branch.tableIcon)s" ng-class ="%(branch.directionIcon)s"></i>'
                    + '<input placeholder="长度不超过12个的非空字符" ng-blur="addOrEditBranch(%(branch.obj)s);" ng-keyup="enterEvent($event,%(branch.obj)s)" ng-focus="etos($event)" type="text" style="width:200px;height: 28px" ng-model="%(branch.branchName)s"/>'
                    + '<span class="addson"><span ng-show="%(branch.tipsShow)s" ng-click="elementAdd($event,%(branch.obj)s);" class="glyphicon glyphicon-plus table_tr_add">'
                    + '<span>%(branch.tipsText)s</span></span></span></td>'
                    // +'<td><span ng-click="addUsers(%(branch.obj)s)" style ="color:#3eb0a1;cursor: pointer ">{{%(branch.userNum)s}}</span></td>'
                    + '<td><sapn ng-click="modalframe(%(branch.obj)s);" style ="color:#3eb0a1;cursor: pointer " ng-bind="%(branch.apNum)s"></sapn></td>'
                    + '<td><i  ng-click="" class="" aria-hidden="true" style="cursor: pointer;"></i>'//空的
                    + '</td></tr>';


                var template = '<tr id="{{%(branch.id)s}}" ng-show="%(branch.expanderCurrentShow)s" ng-mouseenter="%(branch.tipsShow)s = !%(branch.tipsShow)s" '
                    + 'ng-mouseleave="%(branch.tipsShow)s = !%(branch.tipsShow)s"><td>'
                    + '<i ng-click="%(branch.expanderNextShow)s = !%(branch.expanderNextShow)s; menuIcon($event,%(branch.obj)s);" '
                    + ' class="fa  table_tr_icon %(branch.tableIcon)s" ng-class ="%(branch.directionIcon)s"></i>'
                    + '<input placeholder="长度不超过12个的非空字符" ng-blur="addOrEditBranch(%(branch.obj)s);" ng-keyup="enterEvent($event,%(branch.obj)s)" ng-focus="etos($event)" type="text" style="width:200px;height: 28px" ng-model="%(branch.branchName)s"/>'
                    + '<span class="addson"><span ng-show="%(branch.tipsShow)s" ng-click="elementAdd($event,%(branch.obj)s);" class="glyphicon glyphicon-plus table_tr_add">'
                    + '<span>%(branch.tipsText)s</span></span></span></td>'
                    // +'<td><span ng-click="addUsers(%(branch.obj)s)" style ="color:#3eb0a1;cursor: pointer ">{{%(branch.userNum)s}}</span></td>'
                    + '<td><sapn ng-click="modalframe(%(branch.obj)s);" style ="color:#3eb0a1;cursor: pointer " ng-bind="%(branch.apNum)s"></sapn></td>'
                    + '<td><i ng-click="detail_s($event,%(branch.obj)s)" class="fa fa-link" aria-hidden="true" style="margin-right: 7px;cursor: pointer;"></i>'
                    + '<i ng-click="delBranch(%(branch.obj)s)" class="fa fa-trash" style="cursor: pointer"></i></td></tr>';

                var templateLast = '<tr ng-show="%(branch.expanderCurrentShow)s">'
                    + '<td width="50%%"><i class="table_tr_icon fa fa-leaf %(branch.tableIcon)s"></i>'
                    + '<input placeholder="长度不超过12个的非空字符" ng-blur="addOrEditBranch(%(branch.obj)s);" ng-keyup="enterEvent($event,%(branch.obj)s)" ng-focus="etos($event)" type="text" style="width:200px;" ng-model="%(branch.branchName)s"/>'
                    // +'<td><span ng-click="addUsers(%(branch.obj)s)" style ="color:#3eb0a1;cursor: pointer ">{{%(branch.userNum)s}}</span></td>'
                    + '<td><sapn ng-click="modalframe(%(branch.obj)s);" style ="color:#3eb0a1;cursor: pointer " ng-bind="%(branch.apNum)s"></sapn></td>'
                    + '<td><i  ng-click="detail_s($event,%(branch.obj)s)" class="fa fa-link" aria-hidden="true" style="margin-right: 7px;cursor: pointer"></i>'
                    + '<i ng-click="delBranch(%(branch.obj)s)" class="fa fa-trash" style="cursor: pointer"></i></td></tr>';

                var branchKey = {};
                branchKey.obj = treeItemId; //branch
                branchKey.id = branchKey.obj + '.id';
                branchKey.branchName = branchKey.obj + '.branchName';
                branchKey.userNum = branchKey.obj + '.userNum';
                branchKey.apNum = branchKey.obj + '.apNum';
                branchKey.tipsShow = branchKey.obj + '.tipsShow';
                branchKey.directionIcon = branchKey.obj + '.directionIcon';
                switch (grade) {
                    case 1:
                        branchKey.expanderCurrentShow = branchKey.obj + '.expanderRootShow';
                        branchKey.tipsText = "添加二级";
                        branchKey.tableIcon = 'table_tr_icon_first';
                        branchKey.expanderNextShow = parentExpandStrArr[0];
                        return sprintf(firstTemplate, {branch: branchKey});

                    case 2:
                        /*define next show key*/
                        branchKey.expanderNextShow = parentExpandStrArr[1];
                        branchKey.tipsText = '添加三级';
                        branchKey.expanderCurrentShow = parentExpandStrArr[0];//branch.expanderShowOne
                        branchKey.tableIcon = "table_tr_icon_second";
                        return sprintf(template, {branch: branchKey});

                    case 3:
                        branchKey.expanderNextShow = parentExpandStrArr[2];
                        branchKey.expanderCurrentShow = parentExpandStrArr[0] + '&&' + parentExpandStrArr[1]; //
                        branchKey.tipsText = "添加四级";
                        branchKey.tableIcon = "table_tr_icon_three";
                        return sprintf(template, {branch: branchKey});
                    //break;
                    case 4:
                        branchKey.expanderNextShow = parentExpandStrArr[3]; //
                        branchKey.expanderCurrentShow = parentExpandStrArr[0] + '&&' + parentExpandStrArr[1] + "&&" + parentExpandStrArr[2]; //
                        branchKey.tableIcon = "table_tr_icon_four";
                        branchKey.tipsText = "添加五级";

                        return sprintf(template, {branch: branchKey});
                    //break;
                    case 5:
                        branchKey.expanderNextShow = parentExpandStrArr[4];
                        branchKey.expanderCurrentShow = parentExpandStrArr[0] + '&&' + parentExpandStrArr[1] + "&&" +
                            parentExpandStrArr[2] + "&&" + parentExpandStrArr[3]; //
                        branchKey.tableIcon = "table_tr_icon_five";
                        branchKey.tipsText = "添加六级";
                        return sprintf(template, {branch: branchKey});

                    // break;
                    case 6:
                        branchKey.expanderNextShow = parentExpandStrArr[5];
                        branchKey.expanderCurrentShow = parentExpandStrArr[0] + '&&' + parentExpandStrArr[1] + "&&" +
                            parentExpandStrArr[2] + "&&" + parentExpandStrArr[3] + "&&" + parentExpandStrArr[4]; //
                        branchKey.tableIcon = "table_tr_icon_six";
                        branchKey.tipsText = "添加七级";

                        return sprintf(template, {branch: branchKey});
                    case 7:
                        branchKey.expanderNextShow = parentExpandStrArr[6];
                        branchKey.expanderCurrentShow = parentExpandStrArr[0] + '&&' + parentExpandStrArr[1] + "&&" +
                            parentExpandStrArr[2] + "&&" + parentExpandStrArr[3] + "&&" + parentExpandStrArr[4]
                            + "&&" + parentExpandStrArr[5]; //
                        branchKey.tableIcon = "table_tr_icon_seven";
                        branchKey.tipsText = "添加八级";

                        return sprintf(template, {branch: branchKey});

                    // break;
                    case 8:
                        //定义下级切换
                        //branchKey.expanderNextShow = parentExpandStrArr[6];
                        branchKey.expanderCurrentShow = parentExpandStrArr[0] + '&&' + parentExpandStrArr[1] + "&&" +
                            parentExpandStrArr[2] + "&&" + parentExpandStrArr[3] + "&&" + parentExpandStrArr[4]
                            + "&&" + parentExpandStrArr[5] + "&&" + parentExpandStrArr[6]; //
                        branchKey.tableIcon = "table_tr_icon_eight";
                        return sprintf(templateLast, {branch: branchKey});
                    //  break;
                }
            }

            /*fa-leaf fa-plus-square-o  fa-minus-square-o*/
            function createScope(key, option) {
                $scope[option.currentObjStr] = {};
                if (option.childLen > 0) {
                    $scope[option.currentObjStr].directionIcon = "fa-minus-square-o";
                } else {
                    $scope[option.currentObjStr].directionIcon = "fa-leaf";
                }
                $scope[option.currentObjStr].superObjStr = option.superObjStr;
                $scope[option.currentObjStr].childLen = option.childLen;
                $scope[option.currentObjStr].branchName = option.data.branchName;
                $scope[option.currentObjStr].userNum = option.data.userNum;
                $scope[option.currentObjStr].des = option.data.userList;
                $scope[option.currentObjStr].apNum = option.data.apNum;
                $scope[option.currentObjStr].tipsShow = false;
                $scope[option.currentObjStr].expanderRootShow = true;
                $scope[option.currentObjStr].id = option.currentObjStr;
                $scope[option.currentObjStr].nextTableShow = option.nextTableShow;
                $scope[option.currentObjStr].groupName = option.data.groupName;
                $scope[option.currentObjStr].parentName = option.data.parentName;
                $scope[option.currentObjStr].topName = option.data.topName;
                // $scope[option.currentObjStr].delShow = true;
                $scope[option.currentObjStr].addFlag = option.addFlag;
                switch (key) {
                    case 1:
                        $scope[option.currentObjStr].expanderShowOne = true;
                        $scope[option.currentObjStr].grade = 1;
                        //$scope[option.currentObjStr].delShow = false;
                        break;
                    case 2:
                        $scope[option.currentObjStr].expanderShowTwo = true;
                        $scope[option.currentObjStr].grade = 2;
                        break;
                    case 3:
                        $scope[option.currentObjStr].expanderShowThree = true;
                        $scope[option.currentObjStr].grade = 3;
                        break;
                    case 4:
                        $scope[option.currentObjStr].expanderShowFour = true;
                        $scope[option.currentObjStr].grade = 4;
                        break;
                    case 5:
                        $scope[option.currentObjStr].expanderShowFive = true;
                        $scope[option.currentObjStr].grade = 5;
                        break;
                    case 6:
                        $scope[option.currentObjStr].expanderShowSix = true;
                        $scope[option.currentObjStr].grade = 6;
                        break;
                    case 7:
                        $scope[option.currentObjStr].expanderShowSeven = true;
                        $scope[option.currentObjStr].grade = 7;
                        break;
                    case 8:
                        delete  $scope[option.currentObjStr].directionIcon;
                        $scope[option.currentObjStr].grade = 8;
                        break;
                }
            }

            function drawTreeTable(branchData) {
                //debugger
                //draw frist
                var userTotal;
                var branchTable = $("#branch_tbody");
                var itemOne = 'branch'
                var element = elementConnect(1, itemOne, [itemOne + '.expanderShowOne']);
                // treeNodeShowCache.setCache(itemOne,['.expanderShowOne']);
                var option = {
                    childLen: branchData.message.subGroupList ? branchData.message.subGroupList.length : 0,
                    superObjStr: "",
                    currentObjStr: itemOne,
                    addFlag: false,
                    nextTableShow: [itemOne + '.expanderShowOne', '.expanderShowTwo'],
                    data: {
                        branchName: branchData.message.alias,
                        userNum: branchData.message.roleName.length != 0 ? branchData.message.roleName.length : 0,//$scope.userInfo.attributes.name,
                        userList: branchData.message.roleName.length != 0 ? branchData.message.roleName : "",
                        apNum: branchData.message.apcount ? branchData.message.apcount : 0,
                        groupName: branchData.message.groupId,
                        parentName: branchData.message.parentId,
                        topName: branchData.message.topId
                    }
                }
                createScope(1, option);
                branchTable.append(element);

                angular.forEach(branchData.message.subGroupList, function (v, k) {
                    var itemTwoStr = itemOne + sprintf('_branchChild%d', k);
                    var element = elementConnect(2, itemTwoStr, [itemOne + '.expanderShowOne', itemTwoStr + '.expanderShowTwo']);
                    console.log(v);
                    var option = {
                        childLen: v.subGroupList ? v.subGroupList.length : 0,
                        superObjStr: itemOne,
                        currentObjStr: itemTwoStr,
                        addFlag: false,
                        nextTableShow: [itemOne + '.expanderShowOne', itemTwoStr + '.expanderShowTwo',
                            '.expanderShowThree'],
                        data: {
                            branchName: v.alias,
                            userNum: v.roleName.length != 0 ? v.roleName.length : 0,
                            userList: v.roleName.length != 0 ? v.roleName : "",
                            apNum: v.apcount ? v.apcount : 0,
                            groupName: v.groupId,
                            parentName: v.parentId,
                            topName: v.topId
                        }
                    }
                    createScope(2, option);
                    branchTable.append(element);
                    if (v.subGroupList) {
                        angular.forEach(v.subGroupList, function (v1, k1) {
                            var itemThreeStr = itemTwoStr + sprintf('_branchChild%d', k1);
                            var element = elementConnect(3, itemThreeStr, [itemOne + '.expanderShowOne',
                                itemTwoStr + '.expanderShowTwo', itemThreeStr + '.expanderShowThree']);
                            var option = {
                                childLen: v1.subGroupList ? v1.subGroupList.length : 0,
                                superObjStr: itemTwoStr,
                                currentObjStr: itemThreeStr,
                                addFlag: false,
                                nextTableShow: [itemOne + '.expanderShowOne', itemTwoStr + '.expanderShowTwo',
                                    itemThreeStr + '.expanderShowThree', '.expanderShowFour'],
                                data: {
                                    branchName: v1.alias,
                                    userNum: v1.roleName.length != 0 ? v1.roleName.length : 0,
                                    userList: v1.roleName.length != 0 ? v1.roleName : "",
                                    apNum: v1.apcount ? v1.apcount : 0,
                                    groupName: v1.groupId,
                                    parentName: v1.parentId,
                                    topName: v1.topId
                                }
                            }
                            createScope(3, option);
                            branchTable.append(element);
                            if (v1.subGroupList) {
                                angular.forEach(v1.subGroupList, function (v2, k2) {
                                    var itemFourStr = itemThreeStr + sprintf('_branchChild%d', k2);
                                    var element = elementConnect(4, itemFourStr, [
                                        itemOne + '.expanderShowOne', itemTwoStr + '.expanderShowTwo',
                                        itemThreeStr + '.expanderShowThree', itemFourStr + '.expanderShowFour']);
                                    var option = {
                                        childLen: v2.subGroupList ? v2.subGroupList.length : 0,
                                        superObjStr: itemThreeStr,
                                        currentObjStr: itemFourStr,
                                        addFlag: false,
                                        nextTableShow: [itemOne + '.expanderShowOne', itemTwoStr + '.expanderShowTwo',
                                            itemThreeStr + '.expanderShowThree', itemFourStr + '.expanderShowFour',
                                            '.expanderShowFive'],
                                        data: {
                                            branchName: v2.alias,
                                            userNum: v2.roleName.length != 0 ? v2.roleName.length : 0,
                                            userList: v2.roleName.length != 0 ? v2.roleName : "",
                                            apNum: v2.apcount ? v2.apcount : 0,
                                            groupName: v2.groupId,
                                            parentName: v2.parentId,
                                            topName: v2.topId
                                        }
                                    }
                                    createScope(4, option);
                                    branchTable.append(element);
                                    if (v2.subGroupList) {
                                        angular.forEach(v2.subGroupList, function (v3, k3) {
                                            var itemFiveStr = itemFourStr + sprintf('_branchChild%d', k3);
                                            var element = elementConnect(5, itemFiveStr, [
                                                itemOne + '.expanderShowOne', itemTwoStr + '.expanderShowTwo',
                                                itemThreeStr + '.expanderShowThree', itemFourStr + '.expanderShowFour',
                                                itemFiveStr + '.expanderShowFive']);
                                            var option = {
                                                childLen: v3.subGroupList ? v3.subGroupList.length : 0,
                                                superObjStr: itemFourStr,
                                                currentObjStr: itemFiveStr,
                                                addFlag: false,
                                                nextTableShow: [
                                                    itemOne + '.expanderShowOne', itemTwoStr + '.expanderShowTwo',
                                                    itemThreeStr + '.expanderShowThree', itemFourStr + '.expanderShowFour',
                                                    itemFiveStr + '.expanderShowFive',
                                                    '.expanderShowSix'],
                                                data: {
                                                    branchName: v3.alias,
                                                    userNum: v3.roleName.length != 0 ? v3.roleName.length : 0,
                                                    userList: v3.roleName.length != 0 ? v3.roleName : "",
                                                    apNum: v3.apcount ? v3.apcount : 0,
                                                    groupName: v3.groupId,
                                                    parentName: v3.parentId,
                                                    topName: v3.topId
                                                }
                                            }
                                            createScope(5, option);
                                            branchTable.append(element);
                                            if (v3.subGroupList) {
                                                angular.forEach(v3.subGroupList, function (v4, k4) {
                                                    var itemSixStr = itemFiveStr + sprintf('_branchChild%d', k4);
                                                    var element = elementConnect(6, itemSixStr, [
                                                        itemOne + '.expanderShowOne', itemTwoStr + '.expanderShowTwo',
                                                        itemThreeStr + '.expanderShowThree', itemFourStr + '.expanderShowFour',
                                                        itemFiveStr + '.expanderShowFive', itemSixStr + '.expanderShowSix']);
                                                    var option = {
                                                        childLen: v4.subGroupList ? v4.subGroupList.length : 0,
                                                        superObjStr: itemFiveStr,
                                                        currentObjStr: itemSixStr,
                                                        addFlag: false,
                                                        nextTableShow: [
                                                            itemOne + '.expanderShowOne', itemTwoStr + '.expanderShowTwo',
                                                            itemThreeStr + '.expanderShowThree', itemFourStr + '.expanderShowFour',
                                                            itemFiveStr + '.expanderShowFive', itemSixStr + '.expanderShowSix',
                                                            '.expanderShowSeven'],
                                                        data: {
                                                            branchName: v4.alias,
                                                            userNum: v4.roleName.length != 0 ? v4.roleName.length : 0,
                                                            userList: v4.roleName.length != 0 ? v4.roleName : "",
                                                            apNum: v4.apcount ? v4.apcount : 0,
                                                            groupName: v4.groupId,
                                                            parentName: v4.parentId,
                                                            topName: v4.topId
                                                        }
                                                    }
                                                    createScope(6, option);
                                                    branchTable.append(element);
                                                    if (v4.subGroupList) {
                                                        angular.forEach(v4.subGroupList, function (v5, k5) {
                                                            var itemSevenStr = itemSixStr + sprintf('_branchChild%d', k5);
                                                            var element = elementConnect(7, itemSevenStr, [
                                                                itemOne + '.expanderShowOne', itemTwoStr + '.expanderShowTwo',
                                                                itemThreeStr + '.expanderShowThree', itemFourStr + '.expanderShowFour',
                                                                itemFiveStr + '.expanderShowFive', itemSixStr + '.expanderShowSix',
                                                                itemSevenStr + '.expanderShowSeven']);
                                                            var option = {
                                                                childLen: v5.subGroupList ? v5.subGroupList.length : 0,
                                                                superObjStr: itemSixStr,
                                                                currentObjStr: itemSevenStr,
                                                                addFlag: false,
                                                                nextTableShow: [
                                                                    itemOne + '.expanderShowOne', itemTwoStr + '.expanderShowTwo',
                                                                    itemThreeStr + '.expanderShowThree', itemFourStr + '.expanderShowFour',
                                                                    itemFiveStr + '.expanderShowFive', itemSixStr + '.expanderShowSix',
                                                                    '.expanderShowSeven'
                                                                ],
                                                                data: {
                                                                    branchName: v5.alias,
                                                                    userNum: v5.roleName.length != 0 ? v5.roleName.length : 0,
                                                                    userList: v5.roleName.length != 0 ? v5.roleName : "",
                                                                    apNum: v5.apcount ? v5.apcount : 0,
                                                                    groupName: v5.groupId,
                                                                    parentName: v5.parentId,
                                                                    topName: v5.topId
                                                                }
                                                            }
                                                            createScope(7, option);
                                                            branchTable.append(element);
                                                            if (v5.subGroupList) {
                                                                angular.forEach(v5.subGroupList, function (v6, k6) {
                                                                    var itemEightStr = itemSevenStr + sprintf('_branchChild%d', k6);
                                                                    var element = elementConnect(8, itemEightStr, [
                                                                        itemOne + '.expanderShowOne', itemTwoStr + '.expanderShowTwo',
                                                                        itemThreeStr + '.expanderShowThree', itemFourStr + '.expanderShowFour',
                                                                        itemFiveStr + '.expanderShowFive', itemSixStr + '.expanderShowSix',
                                                                        itemSevenStr + '.expanderShowSeven'
                                                                    ]);
                                                                    var option = {
                                                                        childLen: v6.subGroupList ? v6.subGroupList.length : 0,
                                                                        superObjStr: itemSevenStr,
                                                                        currentObjStr: itemEightStr,
                                                                        addFlag: false,
                                                                        nextTableShow: [],
                                                                        data: {
                                                                            branchName: v6.alias,
                                                                            userNum: v6.roleName.length != 0 ? v6.roleName.length : 0,
                                                                            userList: v6.roleName.length != 0 ? v6.roleName : "",
                                                                            apNum: v6.apcount ? v6.apcount : 0,
                                                                            groupName: v6.groupId,
                                                                            parentName: v6.parentId,
                                                                            topName: v6.topId
                                                                        }
                                                                    }
                                                                    createScope(8, option);
                                                                    branchTable.append(element);
                                                                });
                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });

                //编译
                $compile($("#branch_tbody"))($scope);
            };

            //drawTreeTable(data);

            $scope.menuIcon = function (e, v) {
                if (v.directionIcon == "fa-minus-square-o") {
                    $scope[v.id].directionIcon = 'fa-plus-square-o';
                } else if (v.directionIcon == "fa-plus-square-o") {
                    $scope[v.id].directionIcon = 'fa-minus-square-o';
                }
            }

            $scope.elementAdd = function (e, v) {
                //debugger
                if (!v.branchName) {
                    var input = $("#" + v.id).find("input");
                    input.addClass("error");
                    return
                }
                var _itemStr = v.id + sprintf('_branchChild%d', v.childLen);
                console.log(_itemStr);
                var newTableShoeArr = [];
                for (var i = 0; i < v.nextTableShow.length; i++) {
                    if (v.grade != 7 && v.nextTableShow.length - 1 == i) {
                        newTableShoeArr.push(_itemStr + v.nextTableShow[i]);
                        break;
                    }
                    newTableShoeArr.push(v.nextTableShow[i]);
                }
                var _element = elementConnect(v.grade + 1, _itemStr, newTableShoeArr);
                var option = {
                    childLen: 0,
                    addFlag: true,
                    superObjStr: v.id,
                    currentObjStr: _itemStr,
                    nextTableShow: [],
                    data: {
                        branchName: "",
                        userNum: 0,
                        apNum: 0
                    }
                }
                switch (v.grade + 1) {
                    case 2:
                        newTableShoeArr.push('.expanderShowThree');
                        option.nextTableShow = newTableShoeArr;
                        $scope[v.id].expanderShowOne = true;
                        break;
                    case 3:
                        newTableShoeArr.push('.expanderShowFour');
                        option.nextTableShow = newTableShoeArr;
                        $scope[v.id].expanderShowTwo = true;
                        break;
                    case 4:
                        newTableShoeArr.push('.expanderShowFive');
                        option.nextTableShow = newTableShoeArr;
                        $scope[v.id].expanderShowThree = true;
                        break;
                    case 5:
                        newTableShoeArr.push('.expanderShowSix');
                        option.nextTableShow = newTableShoeArr;
                        $scope[v.id].expanderShowFour = true;
                        break;
                    case 6:
                        newTableShoeArr.push('.expanderShowSeven');
                        option.nextTableShow = newTableShoeArr;
                        $scope[v.id].expanderShowFive = true;
                        break;
                    case 7:
                        option.nextTableShow = newTableShoeArr;
                        $scope[v.id].expanderShowSix = true;
                        break;
                    case 8:
                        option.nextTableShow = [];
                        $scope[v.id].expanderShowSeven = true;
                        break;
                }
                createScope(v.grade + 1, option);
                //修改父级
                $scope[v.id].childLen = v.childLen + 1;
                $scope[v.id].directionIcon = 'fa-minus-square-o';
                $('#' + v.id).after($compile(_element)($scope));
            };


            //create AP group
            $scope.addGroupBranch = {
                mId: 'addGroupBranch',
                title: getRcString("apTitle"),
                autoClose: true,
                showCancel: false,
                buttonAlign: "center",
                modalSize: 'lg',
                showFooter: true,
                okText: getRcString("CLOSE")
            }

            $scope.enterEvent = function (e, v) {
                var keycode = window.event ? e.keyCode : e.which;
                if (keycode == 13) {
                    $scope.addOrEditBranch(v);
                }
            }

            $scope.innerInfoShow = true;
            $scope.outInfoShow = false;
            var g_innerData = [];
            var g_outData = [];


            var ApData = {};
            $scope.isCheckAPIn = true;
            $scope.isCheckAPOut = true;


            var bindUserData = [];
            // var setUserData={};
            var delUserData = [];
            $scope.isCheckUserIn = true;
            $scope.isCheckUserOut = true;


            $scope.delBranch = function (v) {
                //console.log($scope[v.id].groupName);
                $alert.confirm(getRcString("isDelBranch"), function () {
                    if (!v.des) {
                        $("#" + v.id).empty();
                        $alert.msgDialogSuccess(getRcString("DELETE") + v.branchName + getRcString("BRANCH_SUC"));
                        $timeout(function () {
                            var branchTable = $("#branch_tbody");
                            branchTable.empty();
                            $scope.refresh();
                        }, 1000);
                        return;
                    }
                    if (v.apNum) {
                        $alert.msgDialogError(getRcString("DELETE_BRANCH_AP"));
                        return;
                    }
                    $http({
                        url: getApGroupUrl.url,
                        method: getApGroupUrl.method,
                        data: {
                            Method: 'clearSubAccountApAccess',
                            param: {
                                groupId: $scope[v.id].groupName
                            }
                        }
                    }).success(function (data) {
                        if (data.retCode == 0) {
                            $alert.msgDialogSuccess(getRcString("DELETE") + v.branchName + getRcString("BRANCH_SUC"));
                            $timeout(function () {
                                var branchTable = $("#branch_tbody");
                                branchTable.empty();
                                $scope.refresh();
                            }, 1000);
                        } else if (data.retCode == -1 && data.message == "the groupId not the leaf node") {
                            $alert.msgDialogError(getRcString("DELETE_BRANCH"));
                        } else if (data.retCode == -1) {
                            $alert.msgDialogError(getRcString("QITA") + v.branchName + getRcString("FAIL"));
                        }
                    }).error(function () {
                    });
                });
            }

            $scope.addOrEditBranch = function (v) {
                //debugger
                // console.log(v.branchName);           
                var changeApAliasUrl = Utils.getUrl('POST', '', '/cloudapgroup', '/init/branchOther5/upload_apgroup.json');
                //console.log($scope[$scope[v.id].superObjStr]);
                // var reg = /^[^\s*][\s\S]{0,10}[^\s*]$/;
                var reg = /^\S{1,12}$/;
                // console.log(reg.test(v.branchName));
                if ($scope[v.id].addFlag == false) {
                    if (reg.test(v.branchName)) {
                        $http({
                            url: changeApAliasUrl.url,
                            method: changeApAliasUrl.method,
                            data: {
                                Method: 'updateAliasName',
                                query: {
                                    groupId: $scope[v.id].groupName,
                                    alias: v.branchName
                                }
                            }
                        }).success(function (data) {
                            console.log(data);
                            if (data.retCode == 0) {
                                var branchTable = $("#branch_tbody");
                                branchTable.empty();
                                $scope.refresh();
                            }
                        }).error(function () {
                        });
                    } else {
                        var input = $("#" + v.id).find("input");
                        input.addClass("error");
                    }
                } else if ($scope[v.id].addFlag == true) {
                    if (reg.test(v.branchName)) {
                        $http({
                            url: setApGroupUrl.url,
                            method: setApGroupUrl.method,
                            data: {
                                Method: 'setGroupName',
                                query: {
                                    userName: $scope.userInfo.user,
                                    nasId: $scope.sceneInfo.nasid,
                                    parentId: $scope[$scope[v.id].superObjStr] ? $scope[$scope[v.id].superObjStr].groupName : "",
                                    alias: v.branchName
                                }
                            }
                        }).success(function (data) {
                            if (data.retCode == 0) {
                                $scope[v.id].addFlag == false;
                                var branchTable = $("#branch_tbody");
                                branchTable.empty();
                                $scope.refresh();
                            }
                        }).error(function () {
                        });
                    } else {
                        var input = $("#" + v.id).find("input");
                        input.removeClass("error");
                    }
                }
                //规则校验

            }

            $scope.etos = function (v) {
                $(v.target).removeClass("error");
            }


            $scope.drawBranch = function () {
                $http({
                    url: getApGroupUrl.url,
                    method: getApGroupUrl.method,
                    data: {
                        Method: 'getCloudApgroupNameList',
                        query: {
                            userName: $scope.userInfo.user,
                            nasId: $scope.sceneInfo.nasid
                        }
                    }
                }).success(function (data) {
                    // console.log("llllllllllll",data);
                    if (data.retCode == 0 && data.message) {
                        drawTreeTable(data);
                    } else {
                        // $scope.addData();
                    }
                }).error(function () {
                });
            }
            // 获取AP信息无数据时执行的函数
            // $scope.addData=function(){
            //     $http({
            //         url:setApGroupUrl.url,
            //         method:setApGroupUrl.method,                           
            //         data:{
            //             Method:'setGroupName',
            //             query:{
            //                 userName:$scope.userInfo.user,
            //                 nasId:$scope.sceneInfo.nasid,
            //                 groupId:getRcString("ZONGBU"),
            //                 parentId:"",
            //                 topId:getRcString("ZONGBU")
            //             }
            //         }                           
            //     }).success(function(data){
            //         $http({
            //             url:getApGroupUrl.url,
            //             method:getApGroupUrl.method,
            //             data:{
            //                 Method:'getCloudApgroupNameList',
            //                 query:{
            //                     userName:$scope.userInfo.user,
            //                     nasId:$scope.sceneInfo.nasid
            //                 }
            //             }
            //         }).success(function(data){
            //             console.log(data);
            //             if(data.retCode==0&&data.message){
            //                 drawTreeTable(data);
            //             }          
            //         }).error(function(){}); 
            //     }).error(function(){}); 
            // }
            $scope.drawBranch();
            $scope.refresh = function () {
                $http({
                    url: getApGroupUrl.url,
                    method: getApGroupUrl.method,
                    data: {
                        Method: 'getCloudApgroupNameList',
                        query: {
                            userName: $scope.userInfo.user,
                            nasId: $scope.sceneInfo.nasid
                        }
                    }
                }).success(function (data) {
                    console.log(data);
                    if (data.retCode == 0) {
                        drawTreeTable(data);
                    }
                }).error(function () {
                });
            }

            // wuchengcheng
            $http({
                url: getModalframeUrl.url,
                method: getModalframeUrl.method
            }).success(function (dat) {
                console.log("////", dat);
                var dataAP = dat.data;
                var modalAP = [];
                if (dat && dat.code == 0) {
                    $scope.total_h = dat.data[0].devices.length;
                }
            }).error(function () {
            });


            // 接口---获取设备状态
            // Request:
            // Url:   /base/getDevs
            // Type:  POST
            // Data:
            // {
            //     devSN:  [string, string, string, …]//序列号
            // } 

            // Response:
            // Data
            // {
            //     status:  0//状态 0—成功；-1，参数错误， 其他失败
            //     detail:[{devSN:”XXXXXX”, status:0}, {devSN:”XXXXXX”, status:0} ….]   0成功，1失败， -1 devSN缺失
            // }


            $scope.addAPsInBranch_table = {
                tId: 'addAPsInBranch',
                // url: getApInCloudGroupUrl+'?groupId='+$scope[v],
                clickToSelect: true,
                // sidePagination: 'client',//前端（客户端）分页
                sidePagination: 'server',//后端（服务器端）分页
                // showCheckBox: true,
                striped: true,
                // searchable: true,
                pagination: true,
                showPageList: false,
                pageSize: 5,
                pageList: [5, 10],
                apiVersion: 'v3',
                // pageParamsType: 'path',
                method: "post",
                contenrType: "application/json",
                dataType: "json",
                // startField: 'skipnum',
                // limitField: 'limitnum',
                beforeAjax: function () {
                    return devSNPromise;
                },
                queryParams: function (params) {
                    // var chouseBody = {
                    //     sortoption: {}
                    // };
                    // if (params.sort) {
                    //     chouseBody.sortoption[params.sort] = (params.order == "macAddr" ? 1 : -1);
                    // }
                    // params.start = undefined;
                    // params.size = undefined;
                    // params.order = undefined;
                    // return $.extend(true, {}, params, chouseBody);
                    //
                    return $.extend(true, {"findoption": {}, "sortoption": {}}, params);
                },
                responseHandler: function (data,devSNObj) {
                    $.each(data.apInfo.apList, function (e, de) {
                        de.apName = devSNObj[de.apSN] || de.apName;
                        if (de.status == 1) {
                            de.statusStr = "在线"
                        } else {
                            de.statusStr = "离线"
                        }
                    })
                    return {
                        total: data.apInfo.count_total,
                        rows: data.apInfo.apList
                    };
                },
                // onCheck: OnBindAPCheck,
                // onUncheck: OnBindAPUnCheck,
                // onCheckAll: OnBindAPCheck,
                // onUncheckAll: OnBindAPUnCheck,
                columns: [
                    // {checkbox: true}, //和showCheckBox: true,功能一样多写出两个           
                    // {sortable: true,field: 'devAlias', title: apTableTitle[0], searcher: {}},
                    //sortable: true,排序选项，如果是后端分页那就是后端排序那要和后端商量好，否则配置无效若是前端分页则直接配置即可
                    {field: 'apName', title: apTableTitle[0]},
                    {field: 'apModel', title: apTableTitle[1]},
                    {field: 'apSN', title: apTableTitle[2]},
                    {field: 'statusStr', title: apTableTitle[3]}
                ]
            };

            $scope.modalframe = function (v) {
                $scope.$broadcast('show#addGroupBranch');
                // var v = data.groupName;
                var getApInCloudGroupUrl = '/v3/apmonitor/getApBriefInfoByParentCloudGroup';
                $scope.$broadcast('refresh#addAPsInBranch', {
                    url: getApInCloudGroupUrl + '?topId=' + v.topName + '&midId=' + v.groupName
                });
            }

            $scope.detail_s = function (ev, v) {
                var name = $(ev.target).parents('tr').find('input').val();
                if (!name) {
                    $alert.msgDialogError(getRcString("DELETE_BRANCH_GROUP"));
                    return;
                }
                var record = {};
                record.groupName = v.groupName;
                record.topName = v.topName;
                v = JSON.stringify(record);
                $state.go('^.group9_details', {detailData: v});
            }
        }
        ]
    }
)