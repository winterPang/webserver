/**
 * Created by Administrator on 2016/11/17.
 */
define(['utils','jquery','css!apbranch5/css/branch-table'], function (Utils,$) {
        return ['$scope','$compile','$http','$alertService','$timeout','$location',function ($scope,$compile,$http,$alert,$timeout,$location) {
            function getRcString(attrName){
                return Utils.getRcString("model_rc",attrName);
            }
            var setApGroupUrl=Utils.getUrl('POST','','/cloudapgroup','/init/branchOther5/upload_apgroup.json');
            var getApGroupUrl=Utils.getUrl('POST','','/cloudapgroup','/init/branchOther5/upload_apgroup.json');
            var delApGroupUrl=Utils.getUrl('POST','','/cloudapgroup','/init/branchOther5/upload_apgroup.json');
            var setUserUrl=Utils.getUrl('POST','','/cloudapgroup','/init/branchOther5/upload_apgroup.json');
            var getUserUrl=Utils.getUrl('POST','','/scenarioserver','/init/branchOther5/upload_apgroup.json');
            var getAPByParentCloudGroupUrl=Utils.getUrl('GET','','/apmonitor/getApBriefInfoByParentCloudGroup','/init/branchOther5/get_ap_brief_info.json');  
            var APsTitle=getRcString("APsBranchTitle").split(',');
            var userTableTitle=getRcString("userTableTitle").split(',');
            var status=getRcString("STATUS").split(',');
            var addBranch=getRcString("ADD_BRANCH").split(',');
            var reg=/^[a-zA-Z0-9\u4e00-\u9fa5]{1,11}$/;
            var data = {
                    alias :"总部",
                    branchDescription:'管理所以Ap数据',
                    apSNCount:666
            };

            function elementConnect(grade,treeItemId,parentExpandStrArr) {

                var firstTemplate = '<tr id="{{%(branch.id)s}}" ng-show="%(branch.expanderCurrentShow)s" ng-mouseenter="%(branch.tipsShow)s = !%(branch.tipsShow)s" '
                    +'ng-mouseleave="%(branch.tipsShow)s = !%(branch.tipsShow)s"><td>'
                    +'<i ng-click="%(branch.expanderNextShow)s = !%(branch.expanderNextShow)s; menuIcon($event,%(branch.obj)s);" '
                    + ' class="fa  table_tr_icon %(branch.tableIcon)s" ng-class ="%(branch.directionIcon)s"></i>'
                    +'<input placeholder="1-12个非特殊字符" ng-blur="foucusOutAddBranch(%(branch.obj)s);" ng-keydown="enterEvent($event,%(branch.obj)s)" ng-change="enterEvent($event,%(branch.obj)s)" type="text" style="width:200px;height: 28px;" ng-model="%(branch.branchName)s"/>'
                    +'<span ng-show="%(branch.tipsShow)s" ng-click="elementAdd($event,%(branch.obj)s);" class="glyphicon glyphicon-plus table_tr_add">'
                    +'<span>%(branch.tipsText)s</span></span></td>'
                    +'<td><span ng-click="addUsers(%(branch.obj)s)" style ="color:#3eb0a1;cursor: pointer ">{{%(branch.userNum)s}}</span></td>'
                    +'<td><sapn ng-click="addAPs(%(branch.obj)s);" style ="color:#3eb0a1;cursor: pointer ">{{%(branch.apNum)s}}</sapn></td>'
                    +'<td><i  ng-click="jump(%(branch.obj)s)" class="fa fa-align-justify" aria-hidden="true" style="cursor: pointer;"></i>'
                    +'</td></tr>';


                var template = '<tr id="{{%(branch.id)s}}" ng-show="%(branch.expanderCurrentShow)s" ng-mouseenter="%(branch.tipsShow)s = !%(branch.tipsShow)s" '
                    +'ng-mouseleave="%(branch.tipsShow)s = !%(branch.tipsShow)s"><td>'
                    +'<i ng-click="%(branch.expanderNextShow)s = !%(branch.expanderNextShow)s; menuIcon($event,%(branch.obj)s);" '
                    + ' class="fa  table_tr_icon %(branch.tableIcon)s" ng-class ="%(branch.directionIcon)s"></i>'
                    +'<input placeholder="1-12个非特殊字符" ng-blur="foucusOutAddBranch(%(branch.obj)s);" ng-keydown="enterEvent($event,%(branch.obj)s)" ng-change="enterEvent($event,%(branch.obj)s)"  type="text" style="width:200px;height: 28px;" ng-model="%(branch.branchName)s"/>'
                    +'<span ng-show="%(branch.tipsShow)s" ng-click="elementAdd($event,%(branch.obj)s);" class="glyphicon glyphicon-plus table_tr_add">'
                    +'<span>%(branch.tipsText)s</span></span></td>'
                    +'<td><span ng-click="addUsers(%(branch.obj)s)" style ="color:#3eb0a1;cursor: pointer ">{{%(branch.userNum)s}}</span></td>'
                    +'<td><sapn ng-click="addAPs(%(branch.obj)s);" style ="color:#3eb0a1;cursor: pointer ">{{%(branch.apNum)s}}</sapn></td>'
                    +'<td><i ng-click="jump(%(branch.obj)s)" class="fa fa-align-justify" aria-hidden="true" style="margin-right: 7px;cursor: pointer;"></i>'
                    +'<i ng-click="delBranch(%(branch.obj)s)" class="fa fa-trash" style="cursor: pointer"></i></td></tr>';

                var templateLast = '<tr id="{{%(branch.id)s}}" ng-show="%(branch.expanderCurrentShow)s">'
                    +'<td width="50%%"><i class="table_tr_icon fa fa-leaf %(branch.tableIcon)s"></i>'
                    +'<input placeholder="1-12个非特殊字符" ng-blur="foucusOutAddBranch(%(branch.obj)s);" ng-keydown="enterEvent($event,%(branch.obj)s)" ng-change="enterEvent($event,%(branch.obj)s)" type="text" style="width:200px;" ng-model="%(branch.branchName)s"/>'
                    +'<td><span ng-click="addUsers(%(branch.obj)s)" style ="color:#3eb0a1;cursor: pointer ">{{%(branch.userNum)s}}</span></td>'
                    +'<td><sapn ng-click="addAPs(%(branch.obj)s);" style ="color:#3eb0a1;cursor: pointer ">{{%(branch.apNum)s}}</sapn></td>'
                    +'<td><i  ng-click="jump(%(branch.obj)s)" class="fa fa-align-justify" aria-hidden="true" style="margin-right: 7px;cursor: pointer"></i>'
                    +'<i ng-click="delBranch(%(branch.obj)s)" class="fa fa-trash" style="cursor: pointer"></i></td></tr>';

                var branchKey = {};
                branchKey.obj = treeItemId; //branch
                branchKey.id =  branchKey.obj+'.id';
                branchKey.branchName =  branchKey.obj+'.branchName';
                branchKey.userNum = branchKey.obj+'.userNum';
                branchKey.apNum = branchKey.obj+'.apNum';
                branchKey.tipsShow = branchKey.obj+'.tipsShow';
                branchKey.directionIcon =branchKey.obj+'.directionIcon';
                switch (grade)
                {
                    case 1:
                        branchKey.expanderCurrentShow = branchKey.obj+'.expanderRootShow';
                        branchKey.tipsText =addBranch[0];// "添加二级";
                        branchKey.tableIcon ='table_tr_icon_first';
                        branchKey.expanderNextShow = parentExpandStrArr[0];
                        return sprintf(firstTemplate, {branch:branchKey});

                    case 2:
                        /*define next show key*/
                        branchKey.expanderNextShow = parentExpandStrArr[1];
                        branchKey.tipsText = addBranch[1];//'添加三级';
                        branchKey.expanderCurrentShow = parentExpandStrArr[0];//branch.expanderShowOne
                        branchKey.tableIcon = "table_tr_icon_second";
                        return   sprintf(template, {branch:branchKey});

                    case 3:
                        branchKey.expanderNextShow =  parentExpandStrArr[2];
                        branchKey.expanderCurrentShow = parentExpandStrArr[0]+'&&'+ parentExpandStrArr[1]; //
                        branchKey.tipsText = addBranch[2];//"添加四级";
                        branchKey.tableIcon = "table_tr_icon_three";
                        return sprintf(template, {branch:branchKey});
                        //break;
                    case 4:
                        branchKey.expanderNextShow = parentExpandStrArr[3]; //
                        branchKey.expanderCurrentShow = parentExpandStrArr[0]+'&&'+ parentExpandStrArr[1]+"&&"+ parentExpandStrArr[2]; //
                        branchKey.tableIcon = "table_tr_icon_four";
                        branchKey.tipsText =addBranch[3];// "添加五级";

                        return sprintf(template, {branch:branchKey});
                        //break;
                    case 5:
                        branchKey.expanderNextShow = parentExpandStrArr[4];
                        branchKey.expanderCurrentShow =  parentExpandStrArr[0]+'&&'+ parentExpandStrArr[1]+"&&"+
                            parentExpandStrArr[2]+"&&"+parentExpandStrArr[3]; //
                        branchKey.tableIcon = "table_tr_icon_five";
                        branchKey.tipsText = addBranch[4];//"添加六级";
                        return sprintf(template, {branch:branchKey});

                       // break;
                    case 6:
                        branchKey.expanderNextShow = parentExpandStrArr[5];
                        branchKey.expanderCurrentShow = parentExpandStrArr[0]+'&&'+ parentExpandStrArr[1]+"&&"+
                            parentExpandStrArr[2]+"&&"+parentExpandStrArr[3]+"&&"+parentExpandStrArr[4]; //
                        branchKey.tableIcon = "table_tr_icon_six";
                        branchKey.tipsText =addBranch[5];// "添加七级";

                        return sprintf(template, {branch:branchKey});
                    case 7:
                        branchKey.expanderNextShow = parentExpandStrArr[6];
                        branchKey.expanderCurrentShow = parentExpandStrArr[0]+'&&'+ parentExpandStrArr[1]+"&&"+
                            parentExpandStrArr[2]+"&&"+parentExpandStrArr[3]+"&&"+parentExpandStrArr[4]
                            +"&&"+parentExpandStrArr[5]; //
                        branchKey.tableIcon = "table_tr_icon_seven";
                        branchKey.tipsText = addBranch[6];//"添加八级";

                        return sprintf(template, {branch:branchKey});

                       // break;
                    case 8:
                        //定义下级切换
                        //branchKey.expanderNextShow = parentExpandStrArr[6];
                        branchKey.expanderCurrentShow = parentExpandStrArr[0]+'&&'+ parentExpandStrArr[1]+"&&"+
                            parentExpandStrArr[2]+"&&"+parentExpandStrArr[3]+"&&"+parentExpandStrArr[4]
                            +"&&"+parentExpandStrArr[5] +"&&"+parentExpandStrArr[6]; //
                        branchKey.tableIcon = "table_tr_icon_eight";
                        return sprintf(templateLast, {branch:branchKey});
                      //  break;
                }
            }
            /*fa-leaf fa-plus-square-o  fa-minus-square-o*/
            function createScope(key,option){
                $scope[option.currentObjStr] = {};
                if(option.childLen > 0){
                    $scope[option.currentObjStr].directionIcon = "fa-minus-square-o";
                }else{
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
                $scope[option.currentObjStr].branchUserList = option.data.branchUserList;
               // $scope[option.currentObjStr].delShow = true;
                $scope[option.currentObjStr].addFlag = option.addFlag;
                switch (key)
                {
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

            function drawTreeTable(branchData){
                //debugger
                /*var updateScopeArr=[];*/
                var userTotal;
                var branchTable = $("#branch_tbody");
                branchTable.empty();
                var itemOne = 'branch';
                var element = elementConnect(1,itemOne,[itemOne+'.expanderShowOne']);
               // treeNodeShowCache.setCache(itemOne,['.expanderShowOne']);
                var option ={
                    childLen:branchData.message.subGroupList?branchData.message.subGroupList.length:0,
                    superObjStr:"",
                    currentObjStr:itemOne,
                    addFlag:false,
                    nextTableShow:[itemOne+'.expanderShowOne','.expanderShowTwo'],
                    data:{
                        branchName:branchData.message.alias,
                        userNum:branchData.message.roleName.length!=0?branchData.message.roleName.length-1:0,//$scope.userInfo.attributes.name,
                        userList:branchData.message.roleName.length!=0?branchData.message.roleName:"",
                        apNum:branchData.message.apcount?branchData.message.apcount:0,
                        groupName:branchData.message.groupId,
                        parentName:branchData.message.parentId,
                        topName:branchData.message.topId,
                        branchUserList:[]
                    }
                }
                var childGroupIdArr1 = [];
                childGroupIdArr1.push(branchData.message.groupId);
                branchTable.append(element);
                angular.forEach(branchData.message.subGroupList.reverse(),function(v,k){
                    var itemTwoStr = itemOne +sprintf('_branchChild%d',k);
                    var element = elementConnect(2,itemTwoStr,[itemOne+'.expanderShowOne',itemTwoStr+'.expanderShowTwo']);
                    console.log(v);
                    var option ={
                        childLen:v.subGroupList?v.subGroupList.length:0,
                        superObjStr:itemOne,
                        currentObjStr:itemTwoStr,
                        addFlag:false,
                        nextTableShow:[itemOne+'.expanderShowOne',itemTwoStr+'.expanderShowTwo',
                        '.expanderShowThree'],
                        data:{
                            branchName:v.alias,
                            userNum:v.roleName.length!=0?v.roleName.length-1:0,
                            userList:v.roleName.length!=0?v.roleName:"",
                            apNum:v.apcount?v.apcount:0,
                            groupName:v.groupId,
                            parentName:v.parentId,
                            topName:v.topId,
                            branchUserList:[]
                        },
                    }
                    var childGroupIdArr2=[];
                    childGroupIdArr1.push(v.groupId);
                    childGroupIdArr2.push(v.groupId);
                    branchTable.append(element);
                    if(v.subGroupList){
                     angular.forEach(v.subGroupList.reverse(),function(v1,k1){
                         var itemThreeStr = itemTwoStr +sprintf('_branchChild%d',k1);
                         var element = elementConnect(3,itemThreeStr,[itemOne+'.expanderShowOne',
                             itemTwoStr+'.expanderShowTwo',itemThreeStr+'.expanderShowThree']);
                         var option ={
                             childLen:v1.subGroupList?v1.subGroupList.length:0,
                             superObjStr:itemTwoStr,
                             currentObjStr:itemThreeStr,
                             addFlag:false,
                             nextTableShow:[itemOne+'.expanderShowOne',itemTwoStr+'.expanderShowTwo',
                                 itemThreeStr+'.expanderShowThree', '.expanderShowFour'],
                             data:{
                                 branchName:v1.alias,
                                 userNum:v1.roleName.length!=0?v1.roleName.length-1:0,
                                 userList:v1.roleName.length!=0?v1.roleName:"",
                                 apNum:v1.apcount?v1.apcount:0,
                                 groupName:v1.groupId,
                                 parentName:v1.parentId,
                                 topName:v1.topId,
                                 branchUserList:[]
                             }
                         }
                         var childGroupIdArr3=[];
                         childGroupIdArr1.push(v1.groupId);
                         childGroupIdArr2.push(v1.groupId);
                         childGroupIdArr3.push(v1.groupId);
                         branchTable.append(element);
                        if(v1.subGroupList){
                            angular.forEach(v1.subGroupList.reverse(),function(v2,k2){
                                var itemFourStr = itemThreeStr +sprintf('_branchChild%d',k2);
                                var element = elementConnect(4,itemFourStr, [
                                    itemOne+'.expanderShowOne', itemTwoStr+'.expanderShowTwo',
                                    itemThreeStr+'.expanderShowThree', itemFourStr+'.expanderShowFour']);
                                var option ={
                                    childLen:v2.subGroupList?v2.subGroupList.length:0,
                                    superObjStr:itemThreeStr,
                                    currentObjStr:itemFourStr,
                                    addFlag:false,
                                    nextTableShow:[itemOne+'.expanderShowOne',itemTwoStr+'.expanderShowTwo',
                                        itemThreeStr+'.expanderShowThree', itemFourStr+'.expanderShowFour',
                                        '.expanderShowFive'],
                                    data:{
                                        branchName:v2.alias,
                                        userNum:v2.roleName.length!=0?v2.roleName.length-1:0,
                                        userList:v2.roleName.length!=0?v2.roleName:"",
                                        apNum:v2.apcount?v2.apcount:0,
                                        groupName:v2.groupId,
                                        parentName:v2.parentId,
                                        topName:v2.topId,
                                        branchUserList:[]
                                    }
                                }
                                var childGroupIdArr4=[];
                                childGroupIdArr1.push(v2.groupId);
                                childGroupIdArr2.push(v2.groupId);
                                childGroupIdArr3.push(v2.groupId);
                                childGroupIdArr4.push(v2.groupId);
                                branchTable.append(element);
                                     if(v2.subGroupList){
                                         angular.forEach(v2.subGroupList.reverse(),function(v3,k3){
                                             var itemFiveStr = itemFourStr +sprintf('_branchChild%d',k3);
                                             var element = elementConnect(5,itemFiveStr, [
                                                 itemOne+'.expanderShowOne',itemTwoStr+'.expanderShowTwo',
                                                 itemThreeStr+'.expanderShowThree',itemFourStr+'.expanderShowFour',
                                                 itemFiveStr+'.expanderShowFive']);
                                             var option ={
                                                 childLen:v3.subGroupList?v3.subGroupList.length:0,
                                                 superObjStr:itemFourStr,
                                                 currentObjStr:itemFiveStr,
                                                 addFlag:false,
                                                 nextTableShow:[
                                                     itemOne+'.expanderShowOne',itemTwoStr+'.expanderShowTwo',
                                                     itemThreeStr+'.expanderShowThree',itemFourStr+'.expanderShowFour',
                                                     itemFiveStr+'.expanderShowFive',
                                                     '.expanderShowSix'],
                                                 data:{
                                                     branchName:v3.alias,
                                                     userNum:v3.roleName.length!=0?v3.roleName.length-1:0,
                                                     userList:v3.roleName.length!=0?v3.roleName:"",
                                                     apNum:v3.apcount?v3.apcount:0,
                                                     groupName:v3.groupId,
                                                     parentName:v3.parentId,
                                                     topName:v3.topId,
                                                     branchUserList:[]
                                                 }
                                             }
                                             var childGroupIdArr5=[];
                                             childGroupIdArr1.push(v3.groupId);
                                             childGroupIdArr2.push(v3.groupId);
                                             childGroupIdArr3.push(v3.groupId);
                                             childGroupIdArr4.push(v3.groupId);
                                             childGroupIdArr5.push(v3.groupId);
                                             branchTable.append(element);
                                             if(v3.subGroupList){
                                                 angular.forEach(v3.subGroupList.reverse(),function(v4,k4){
                                                     var itemSixStr = itemFiveStr +sprintf('_branchChild%d',k4);
                                                     var element = elementConnect(6,itemSixStr, [
                                                         itemOne+'.expanderShowOne',itemTwoStr+'.expanderShowTwo',
                                                         itemThreeStr+'.expanderShowThree',itemFourStr+'.expanderShowFour',
                                                         itemFiveStr+'.expanderShowFive',itemSixStr+'.expanderShowSix']);
                                                     var option ={
                                                         childLen:v4.subGroupList?v4.subGroupList.length:0,
                                                         superObjStr:itemFiveStr,
                                                         currentObjStr:itemSixStr,
                                                         addFlag:false,
                                                         nextTableShow:[
                                                             itemOne+'.expanderShowOne', itemTwoStr+'.expanderShowTwo',
                                                             itemThreeStr+'.expanderShowThree',itemFourStr+'.expanderShowFour',
                                                             itemFiveStr+'.expanderShowFive',itemSixStr+'.expanderShowSix',
                                                             '.expanderShowSeven'],
                                                         data:{
                                                             branchName:v4.alias,
                                                             userNum:v4.roleName.length!=0?v4.roleName.length-1:0,
                                                             userList:v4.roleName.length!=0?v4.roleName:"",
                                                             apNum:v4.apcount?v4.apcount:0,
                                                             groupName:v4.groupId,
                                                             parentName:v4.parentId,
                                                             topName:v4.topId,
                                                             branchUserList:[]
                                                         }
                                                     }
                                                     var childGroupIdArr6=[];
                                                     childGroupIdArr1.push(v4.groupId);
                                                     childGroupIdArr2.push(v4.groupId);
                                                     childGroupIdArr3.push(v4.groupId);
                                                     childGroupIdArr4.push(v4.groupId);
                                                     childGroupIdArr5.push(v4.groupId);
                                                     childGroupIdArr6.push(v4.groupId);
                                                     branchTable.append(element);
                                                     if(v4.subGroupList){
                                                         angular.forEach(v4.subGroupList.reverse(),function(v5,k5){
                                                             var itemSevenStr = itemSixStr +sprintf('_branchChild%d',k5);
                                                             var element = elementConnect(7,itemSevenStr,[
                                                                 itemOne+'.expanderShowOne', itemTwoStr+'.expanderShowTwo',
                                                                 itemThreeStr+'.expanderShowThree',itemFourStr+'.expanderShowFour',
                                                                 itemFiveStr+'.expanderShowFive',itemSixStr+'.expanderShowSix',
                                                                 itemSevenStr+'.expanderShowSeven']);
                                                             var option ={
                                                                 childLen:v5.subGroupList?v5.subGroupList.length:0,
                                                                 superObjStr:itemSixStr,
                                                                 currentObjStr:itemSevenStr,
                                                                 addFlag:false,
                                                                 nextTableShow:[
                                                                     itemOne+'.expanderShowOne', itemTwoStr+'.expanderShowTwo',
                                                                     itemThreeStr+'.expanderShowThree', itemFourStr+'.expanderShowFour',
                                                                     itemFiveStr+'.expanderShowFive',itemSixStr+'.expanderShowSix',
                                                                     '.expanderShowSeven'
                                                                 ],
                                                                 data:{
                                                                     branchName:v5.alias,
                                                                     userNum:v5.roleName.length!=0?v5.roleName.length-1:0,
                                                                     userList:v5.roleName.length!=0?v5.roleName:"",
                                                                     apNum:v5.apcount?v5.apcount:0,
                                                                     groupName:v5.groupId,
                                                                     parentName:v5.parentId,
                                                                     topName:v5.topId,
                                                                     branchUserList:[]
                                                                 }
                                                             }
                                                             var childGroupIdArr7=[];
                                                             childGroupIdArr1.push(v5.groupId);
                                                             childGroupIdArr2.push(v5.groupId);
                                                             childGroupIdArr3.push(v5.groupId);
                                                             childGroupIdArr4.push(v5.groupId);
                                                             childGroupIdArr5.push(v5.groupId);
                                                             childGroupIdArr6.push(v5.groupId);
                                                             childGroupIdArr7.push(v5.groupId);
                                                             branchTable.append(element);
                                                             if(v5.subGroupList){
                                                                
                                                                 angular.forEach(v5.subGroupList.reverse(),function(v6,k6){
                                                                     var itemEightStr = itemSevenStr +sprintf('_branchChild%d',k6);
                                                                     var element = elementConnect(8,itemEightStr, [
                                                                         itemOne+'.expanderShowOne', itemTwoStr+'.expanderShowTwo',
                                                                         itemThreeStr+'.expanderShowThree', itemFourStr+'.expanderShowFour',
                                                                         itemFiveStr+'.expanderShowFive',itemSixStr+'.expanderShowSix',
                                                                         itemSevenStr+'.expanderShowSeven'
                                                                         ]);
                                                                     var option ={
                                                                         childLen:v6.subGroupList?v6.subGroupList.length:0,
                                                                         superObjStr:itemSevenStr,
                                                                         currentObjStr:itemEightStr,
                                                                         addFlag:false,
                                                                         nextTableShow:[],
                                                                         data:{
                                                                             branchName:v6.alias,
                                                                             userNum:v6.roleName.length!=0?v6.roleName.length-1:0,
                                                                             userList:v6.roleName.length!=0?v6.roleName:"",
                                                                             apNum:v6.apcount?v6.apcount:0,
                                                                             groupName:v6.groupId,
                                                                             parentName:v6.parentId,
                                                                             topName:v6.topId,
                                                                             branchUserList:[]
                                                                         }
                                                                     }
                                                                    var childGroupIdArr8=[];
                                                                     childGroupIdArr1.push(v6.groupId);
                                                                     childGroupIdArr2.push(v6.groupId);
                                                                     childGroupIdArr3.push(v6.groupId);
                                                                     childGroupIdArr4.push(v6.groupId);
                                                                     childGroupIdArr5.push(v6.groupId);
                                                                     childGroupIdArr6.push(v6.groupId);
                                                                     childGroupIdArr7.push(v6.groupId);
                                                                     childGroupIdArr8.push(v6.groupId);
                                                                     branchTable.append(element);
                                                                    option.data.branchUserList = childGroupIdArr8;
                                                                    createScope(8,option);
                                                                 });
                                                             }
                                                             option.data.branchUserList = childGroupIdArr7;
                                                             createScope(7,option);
                                                         });
                                                     }
                                                     option.data.branchUserList = childGroupIdArr6;
                                                     createScope(6,option);
                                                 });
                                             }
                                             option.data.branchUserList = childGroupIdArr5;
                                             createScope(5,option);
                                         });
                                     }
                                option.data.branchUserList = childGroupIdArr4;
                                createScope(4,option);
                            });
                        }
                        option.data.branchUserList = childGroupIdArr3;
                        createScope(3,option);  
                     });                       
                    }
                    // 
                    option.data.branchUserList = childGroupIdArr2;
                    createScope(2,option); 
                 });

                //编译
                option.data.branchUserList = childGroupIdArr1
                createScope(1,option);
                $compile($("#branch_tbody"))($scope);
            };

            //drawTreeTable(data);

            $scope.menuIcon = function(e,v){
                if(v.directionIcon == "fa-minus-square-o"){
                    $scope[v.id].directionIcon = 'fa-plus-square-o';
                }else if(v.directionIcon == "fa-plus-square-o"){
                    $scope[v.id].directionIcon = 'fa-minus-square-o';
                }
            }

            $scope.elementAdd = function(e,v){
                //debugger
                console.log(reg.test(v.branchName))
                if(!(reg.test(v.branchName))){
                    var input=$("#"+v.id).find("input");
                    input.addClass("error");
                    return
                }
                var _itemStr = v.id +sprintf('_branchChild%d',v.childLen);
                console.log(_itemStr);
                var newTableShoeArr = [];
                for(var i = 0;i < v.nextTableShow.length;i++){
                    if(v.grade!=7&&v.nextTableShow.length-1 == i){
                        newTableShoeArr.push(_itemStr+v.nextTableShow[i]);
                        break ;
                    }
                    newTableShoeArr.push(v.nextTableShow[i]);
                }

                var _element = elementConnect(v.grade+1,_itemStr,newTableShoeArr);
                var option ={
                    childLen:0,
                    addFlag:true,
                    superObjStr:v.id,
                    currentObjStr:_itemStr,
                    nextTableShow:[],
                    data:{
                        branchName:"",
                        userNum:0,
                        apNum:0
                    }
                }
                switch (v.grade+1){
                    case 2:
                        newTableShoeArr.push( '.expanderShowThree');
                        option.nextTableShow =newTableShoeArr;
                        $scope[v.id].expanderShowOne = true;
                        break;
                    case 3:
                        newTableShoeArr.push( '.expanderShowFour');
                        option.nextTableShow = newTableShoeArr;
                        $scope[v.id].expanderShowTwo = true;
                        break;
                    case 4:
                        newTableShoeArr.push( '.expanderShowFive');
                        option.nextTableShow = newTableShoeArr;
                        $scope[v.id].expanderShowThree = true;
                        break;
                    case 5:
                        newTableShoeArr.push( '.expanderShowSix');
                        option.nextTableShow = newTableShoeArr;
                        $scope[v.id].expanderShowFour = true;
                        break;
                    case 6:
                        newTableShoeArr.push( '.expanderShowSeven');
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
                createScope(v.grade+1,option);
                //修改父级
                $scope[v.id].childLen = v.childLen+1;
                $scope[v.id].directionIcon = 'fa-minus-square-o';
                $('#'+v.id).after($compile(_element)($scope));
            };


            //create AP group
            $scope.addGroupBranch = {
                mId: 'addGroupBranch',
                title: getRcString("apTitle"),
                autoClose: true,
                showCancel: false,
                buttonAlign: "center",
                modalSize: 'lg',
                showFooter: false,
                //okText:"getRcString("CANCEL")",
                okHandler: function (modal, $ele) {
                    },
                cancelHandler: function (modal, $ele) {

                },
                beforeRender: function ($ele) {
                    return $ele;
                }
            }

            refreshApData=function(v){
                $scope.isCheckAPIn=true;
                $scope.isCheckAPOut=true;
                var getApInCloudGroupUrl='/v3/apmonitor/getApBriefInfoByCloudGroup';
                $scope.addAPsInBranch_table = {
                    tId: 'addAPsInBranch',
                    url: getApInCloudGroupUrl+'?groupId='+encodeURI($scope[v.id].groupName),
                    clickToSelect: true,
                    sidePagination: 'server',
                    showCheckBox: true,
                    striped: true,
                    searchable: true,
                    pagination: true,
                    showPageList: false,
                    pageSize: 5,
                    pageList: [5, 10],
                    apiVersion:'v3',
                   // pageParamsType: 'path',
                    method: "post",
                    contenrType: "application/json",
                    dataType: "json",
                    startField: 'skipnum',
                    limitField: 'limitnum',
                    queryParams: function (params) {
                        var chouseBody = {
                            sortoption:{}
                        };
                        if(params.sort){
                            chouseBody.sortoption[params.sort] = (params.order == "apSN" ? 1 : -1);
                        }
                        params.start = undefined;
                        params.size = undefined;
                        params.order = undefined;
                        return $.extend(true,{},params,chouseBody);
                    },
                    responseHandler: function (data) {
                        return {
                            total: data.apInfo.count_total,
                            rows: data.apInfo.apList
                        };
                    },
                    onCheck: OnBindAPCheck,
                    onUncheck: OnBindAPUnCheck,
                    onCheckAll: OnBindAPCheck,
                    onUncheckAll: OnBindAPUnCheck,
                    columns: [
                        { sortable: true, field: 'apName', title: APsTitle[0], searcher: {type: "text"} },
                        { sortable: true, field: 'apModel', title: APsTitle[1], searcher: {type: "text"} },
                        { sortable: true, field: 'apSN', title: APsTitle[2], searcher: {type: "text"} },
                        { sortable: true, field: 'macAddr', title: APsTitle[3], searcher: {type: "text"} },
                        {   sortable: true, 
                            field: 'status', 
                            title: APsTitle[4], 
                            searcher: {
                                type: "select",
                                textField: "statusText",
                                valueField: "statusValue",
                                data: [
                                    {statusText:status[0] ,statusValue:1},
                                    {statusText: status[1],statusValue:2}
                                ]
                            },
                            formatter: function(value, row, index) {
                                var Status="";
                                if(value==1){
                                   return Status=status[0];
                                }else if(value==2){
                                   return Status=status[1];
                                }
                            }
                         },
                        { sortable: true, field: 'alias', title: APsTitle[5], searcher: {type: "text"} }
                    ]
                };
                var getApOutCloudGroupUrl='/v3/apmonitor/getApListOutOfCloudGroupByACSN'
                $scope.addAPsOutBranch_table = {
                    tId: 'addAPsOutBranch',
                    url: getApOutCloudGroupUrl+'?topId='+$scope["branch"].groupName+'&acSN='+$scope.sceneInfo.sn,
                    clickToSelect: true,
                    sidePagination: 'server',
                    showCheckBox: true,
                    striped: true,
                    searchable: true,
                    pagination: true,
                    showPageList: false,
                    pageSize: 5,
                    pageList: [5, 10],
                    apiVersion:'v3',
                    //pageParamsType: 'path',
                    method: "post",
                    contenrType: "application/json",
                    dataType: "json",
                    startField: 'skipnum',
                    limitField: 'limitnum',
                    queryParams: function (params) {
                        var chouseBody = {
                            sortoption:{}
                        };
                        if(params.sort){
                            chouseBody.sortoption[params.sort] = (params.order == "apSN" ? 1 : -1);
                        }
                        params.start = undefined;
                        params.size = undefined;
                        params.order = undefined;
                        return $.extend(true,{},params,chouseBody);
                    },
                    responseHandler: function (data) {
                        return {
                            total: data.apInfo.count_total,
                            rows: data.apInfo.apList
                        };
                    },
                    onCheck: $scope.onUnwrapAPCheck,
                    onUncheck: onUnwrapAPUnCheck,
                    onCheckAll: onUnwrapAPCheckAll,
                    onUncheckAll: onUnwrapAPUnCheck,
                    columns: [
                        { sortable: true, field: 'apName', title: APsTitle[0], searcher: {type: "text"} },
                        { sortable: true, field: 'apModel', title: APsTitle[1], searcher: {type: "text"} },
                        { sortable: true, field: 'apSN', title: APsTitle[2], searcher: {type: "text"} },
                        { sortable: true, field: 'macAddr', title: APsTitle[3], searcher: {type: "text"} },
                        {   sortable: true, 
                            field: 'status', 
                            title: APsTitle[4], 
                            searcher: {
                                type: "select",
                                textField: "statusText",
                                valueField: "statusValue",
                                data: [
                                    {statusText:status[0] ,statusValue:1},
                                    {statusText: status[1],statusValue:2}
                                ]
                            } ,
                            formatter: function(value, row, index) {
                                var Status="";
                                if(value==1){
                                   return Status=status[0];
                                }else if(value==2){
                                   return Status=status[1];
                                }
                            }
                        }
                    ]
                };
            }
            
            $scope.innerInfoShow = true;
            $scope.outInfoShow  = false;
            var g_innerData=[];
            var g_outData=[];
            $scope.switchoverTab =function (v){                        
                if(v == "inner"){//组内AP
                    g_innerData=[];
                    $scope.innerInfoShow = true;
                    $scope.outInfoShow  = false;
                }else{//未绑定AP
                    g_outData=[];
                    $scope.innerInfoShow = false;
                    $scope.outInfoShow  = true;
                }
            }

            var ApData={};
            $scope.isCheckAPIn=true;
            $scope.isCheckAPOut=true;
            $scope.addAPs =function(v){
                //debugger
                if(!($(".ap_list>:first").hasClass("active"))){
                    $(".ap_list>:first").addClass("active");
                    $(".ap_list>:last").removeClass("active");
                }
                $scope.innerInfoShow = true;
                $scope.outInfoShow  = false;
                g_innerData=[];
                g_outData=[];
                ApData=v;
                $scope.$broadcast('show#addGroupBranch');
                //updateApdata(ApData); 
                refreshApData(ApData);                             
            }
           
            $scope.onUnwrapAPCheck=function(){//checkOneAP
                //debugger				
                $scope.$broadcast("getSelections#addAPsOutBranch", function (data) {
					g_outData=[];
                    for(var i=0;i<data.length;i++){
                        var ApArray={};
                        ApArray.apSN=data[i].apSN;
                        ApArray.acSN=data[i].acSN;
						g_outData.push(ApArray);						
                    }                                                       
                    $scope.$apply(function () {
                        $scope.isCheckAPOut = data.length < 1;
                    });
                    console.log(g_outData);
                });
            }

            function onUnwrapAPCheckAll(){//checkAllAPs
                $scope.$broadcast("getSelections#addAPsOutBranch", function (data) {
                    g_outData=[];
                    for(var i=0;i<data.length;i++){
                        var ApArray={};
                        ApArray.apSN=data[i].apSN; 
                        ApArray.acSN=data[i].acSN;
                        g_outData.push(ApArray);                                                             
                    }                                   
                    $scope.$apply(function () {
                        $scope.isCheckAPOut = data.length < 1;
                    });
                    console.log(g_outData);
                });   
            }

            function onUnwrapAPUnCheck(){
                //debugger
                $scope.$broadcast("getSelections#addAPsOutBranch", function (data) {
                    g_outData=[];                   
                    for(var i=0;i<data.length;i++){
                        var ApArray={};
                        ApArray.apSN=data[i].apSN;
                        ApArray.acSN=data[i].acSN;                       
                        g_outData.push(ApArray);                     
                    }                                      
                    $scope.$apply(function () {
                        $scope.isCheckAPOut = data.length < 1;
                    });
                    console.log(g_outData);
                });
            }
            $scope.bindAP=function(){//入组
                $http({
                    url:setApGroupUrl.url,
                    method:setApGroupUrl.method,
                    data:{
                        Method:"setApsnData",
                        query:{
                            groupId:$scope[ApData.id].groupName
                        },
                        data:g_outData
                    }
                }).success(function(data){
                    if(data.retCode==0){                       
                        $alert.msgDialogSuccess(getRcString("BINDAP_SUC"));
                        var branchTable = $("#branch_tbody");
                        branchTable.empty();
                        $scope.refresh();
                        $timeout(function(){   
                            refreshApData(ApData); 
                        },3200);  
                    }else if(data.retCode==-1&&data.message.msg=="[addapSNData] Update apsncount failed!"){
                        //$alert.msgDialogError("该AP在"+data.message.alias+"分支已存在。。。");
                        $alert.msgDialogError(getRcString("BINDAP_MSG"));
                    }else if(data.retCode==-1&&data.message=="exist apSN or acSN is NULL,, not insert"){
                        if(g_outData.length==1){
                            $alert.msgDialogError(getRcString("BINDAP_FAILMSG1"));
                        }else{
                           $alert.msgDialogError(getRcString("BINDAP_FAILMSG2")); 
                        }                       
                    }else{
                        $alert.msgDialogError(getRcString("BINDAP_FAIL"));
                    }
                }).error(function(){});
            }

            function OnBindAPUnCheck(){
                $scope.$broadcast("getSelections#addAPsInBranch", function (data) {
                    //var ApArray=[];
                    g_innerData=[];
                    for(var i=0;i<data.length;i++){
                        g_innerData.push(data[i].apSN);
                    }  
                    $scope.$apply(function () {
                        $scope.isCheckAPIn = data.length < 1;
                    });
                    console.log(g_innerData);
                });
            }

            function OnBindAPCheck(){
                //debugger
                $scope.$broadcast("getSelections#addAPsInBranch", function (data) {
                    var ApArray=[];
                    for(var i=0;i<data.length;i++){
                        ApArray.push(data[i].apSN);
                    }                  
                    g_innerData=ApArray;
                    $scope.$apply(function () {
                        $scope.isCheckAPIn = data.length < 1;
                    });
                    console.log(g_innerData);
                });
            }

            $scope.unwrapAP=function(){
                $http({
                    url:setApGroupUrl.url,
                    method:setApGroupUrl.method,
                    data:{
                        Method:"delOneApGroupData",
                        query:{
                            groupId:$scope[ApData.id].groupName
                        },
                        data:g_innerData
                    }
                }).success(function(data){
                    if(data.retCode==0){
                        $alert.msgDialogSuccess(getRcString("UNBINDAP_SUC"));
                        var branchTable = $("#branch_tbody");
                        branchTable.empty();
                        $scope.refresh();
                        $timeout(function(){   
                            //updateApdata(ApData); 
                            refreshApData(ApData);
                        },3200);                        
                    }else if(data.retCode==-1){
                        $alert.msgDialogError(getRcString("UNBINDAP_FAIL"));
                    }
                }).error(function(){});
            }

            var bindUserData=[];
            var setUserData={};
            var delUserData=[];
            $scope.isCheckUserIn=true;
            $scope.isCheckUserOut=true;
            $scope.addUsers =function(v){//获取用户名列表
                if(!($(".user_list>:first").hasClass("active"))){
                    $(".user_list>:first").addClass("active");
                    $(".user_list>:last").removeClass("active");
                }
                $scope.$broadcast('show#addUserInfo');
                $scope.$broadcast('refreshOptions#addUserInBranch',{pageNumber:1});
                $scope.$broadcast('refreshOptions#addUserOutBranch',{pageNumber:1});
                $scope.innerInfoShow = true;
                $scope.outInfoShow  = false;
                setUserData=v;
                $scope.refreshUserData(setUserData);                                             
            }
 
            $scope.refreshUserData=function(v){
                $scope.isCheckUserIn=true;
                $scope.isCheckUserOut=true;
                $http({
                    url:getUserUrl.url,
                    method:getUserUrl.method, 
                    data:{  
                        Method:'getAllSubTenantoOperByScenarioId', 
                        param:{
                            userName:$scope.userInfo.user,
                            scenarioId:$scope.sceneInfo.nasid
                        }                    
                                          
                    }
                }).success(function(data){
                    if(data.retCode==0){
                        var inUserList=[];
                        var outUserList=[];
                        var bindUserList=[];
                        var unBindUserList=[];                    
                        console.log(data.message);
                        for(var i=0;i<data.message.length;i++){
                            var bindUser="";
                            for(var k=0;k<$scope[v.id].des.length;k++){
                                if($scope[v.id].des[k]==data.message[i].userName){
                                    bindUserList.push(data.message[i]);
                                    bindUser++;
                                }
                            }
                            if(bindUser==""){
                                unBindUserList.push(data.message[i]);
                            }
                        }
                        
                        angular.forEach(bindUserList,function(v,k){//管理用户列表
                            var userData={};
                            userData.userName=v.userName;
                            userData.userParent=v.userRoleName;
                            inUserList.push(userData);
                            console.log(inUserList);
                        });

                        angular.forEach(unBindUserList,function(v,k){//不是管理用户列表
                            var userData={};
                            userData.userName=v.userName;
                            userData.userParent=v.userRoleName
                            outUserList.push(userData);
                        });
                        $scope.$broadcast('load#addUserInBranch',inUserList);
                        $scope.$broadcast('load#addUserOutBranch',outUserList);
                    }
                }).error(function(){}); 
            }

            function OnUserListCheck(){
                //debugger
                $scope.$broadcast("getSelections#addUserInBranch", function (data) {
                    var userArray=[];
                    for(var i=0;i<data.length;i++){
                        userArray.push(data[i].userName);
                    }                  
                    delUserData=userArray;
                    $scope.$apply(function () {
                        $scope.isCheckUserIn= data.length < 1;
                    });
                    console.log(delUserData);
                });
            }

            function OnUserListUnCheck(){
                //debugger
                $scope.$broadcast("getSelections#addUserInBranch", function (data) {
                    delUserData=[];
                    for(var i=0;i<data.length;i++){
                        delUserData.push(data[i].userName);
                    }                  
                   $scope.$apply(function () {
                        $scope.isCheckUserIn= data.length < 1;
                    });
                    console.log(delUserData);
                });
            }

            $scope.setUser=function(){
                //debugger
                $http({//授权
                    url:getUserUrl.url,
                    method:getUserUrl.method,
                    data:{
                        Method:"setSubAccountApAccess",
                        param:bindUserData
                    }
                }).success(function(data){
                    if(data.retCode==0){
                        $http({
                            url:setUserUrl.url,
                            method:setUserUrl.method, 
                            data:{  
                                Method:'setRoleName', 
                                //query:{
                                    groupIdList:$scope[setUserData.id].branchUserList,
                                    //parentName:$scope[$scope[setUserData.id].superObjStr]?$scope[$scope[setUserData.id].superObjStr].groupName:"",
                                //},
                                roleName:bindUserData                                                        
                            }
                        }).success(function(data){
                            if(data.retCode==0){
                                $alert.msgDialogSuccess(getRcString("BINDUSER_SUC"));
                                var branchTable = $("#branch_tbody");
                                branchTable.empty();
                                $scope.refresh();
                                $timeout(function(){ 
                                    $scope.refreshUserData(setUserData);
                                },3100);
                            }else if(data.retCode==-1){
                                $alert.msgDialogError(getRcString("BINDUSER_FAIL")); 
                            }
                        }).error(function(){});
                    }
                }).error(function(){});
                
            }

            function outUserListCheck(){
                //debugger
                $scope.$broadcast("getSelections#addUserOutBranch", function (data) {
                    var userArray=[];
                    for(var i=0;i<data.length;i++){
                        userArray.push(data[i].userName);
                    }                  
                    bindUserData=userArray;
                    $scope.$apply(function () {
                        $scope.isCheckUserOut= data.length < 1;
                    });
                });
            }

            function outUserListUnCheck(){
                //debugger
                $scope.$broadcast("getSelections#addUserOutBranch", function (data) {
                    bindUserData=[];
                    for(var i=0;i<data.length;i++){
                        bindUserData.push(data[i].userName);
                    }                  
                    console.log(bindUserData);
                    $scope.$apply(function () {
                        $scope.isCheckUserOut= data.length < 1;
                    });
                });
            }

            $scope.unwrapUser=function(){
                //去权限
               /* $http({
                    url:getUserUrl.url,
                     method:getUserUrl.method,
                    data:{
                        Method:"clearSubAccountApAccess",
                        param:delUserData
                    }
                }).success(function(data){
                    if(data.retCode==0){*/
                        $http({
                            url:setUserUrl.url,
                            method:setUserUrl.method,
                            data:{
                                Method:'delRoleName', 
                                //query:{
                                    groupIdList:$scope[setUserData.id].branchUserList,
                                //},
                                roleName:delUserData
                            } 
                        }).success(function(data){
                            console.log(data);
                            if(data.retCode==0){
                                $alert.msgDialogSuccess(getRcString("UNBINDUSER_SUC"));
                                var branchTable = $("#branch_tbody");
                                branchTable.empty();
                                $scope.refresh();
                                $timeout(function(){
                                    $scope.refreshUserData(setUserData);
                                },3100);
                            }else if(data.retCode==-1&&data.message=="CheckRemoveRoleName the roleName exist in parentId"){
                                $alert.msgDialogError(getRcString("AUTHORIZATION")); 
                            }else{
                                $alert.msgDialogError(getRcString("UNBINDUSER_FAIL"));
                            }
                        }).error(function(){});
                    /*}
                }).error(function(){});*/                                            
            }

            $scope.addUserInfo = {
                mId: 'addUserInfo',
                title: getRcString("userTitle"),
                autoClose: true,
                showCancel: false,
                buttonAlign: "center",
                modalSize: 'lg',
                showFooter: false,
                //okText:getRcString("CANCEL"),
                okHandler: function (modal, $ele) {
                },
                cancelHandler: function (modal, $ele) {

                },
                beforeRender: function ($ele) {
                    return $ele;
                }
            }

            $scope.addUserInBranch_table={
                tId: 'addUserInBranch',
                // url: getApInGroupUrl.url,
                clickToSelect: true,
                // sidePagination: 'server',
                showCheckBox: true,
                striped: true,
                searchable: true,
                pagination: true,
                showPageList: false,
                pageSize: 5,
                pageList: [5, 10],
                silentSort:true,
                //  pageParamsType: 'path',
                //  method: "post",
                // contenrType: "application/json",
                //  dataType: "json",
                //  startField: 'skipnum',
                //  limitField: 'limitnum',
                /* queryParams: function (params) {
                 return $.extend(true, {}, params, oBody);
                 },*/
                /* responseHandler: function (data) {
                 return {
                 total: data.totalCntInGrp,
                 rows: data.apList
                 };
                 },*/
                onCheck: OnUserListCheck,
                onUncheck: OnUserListUnCheck,
                onCheckAll: OnUserListCheck,
                onUncheckAll: OnUserListUnCheck,
                columns: [
                    { sortable: true, field: 'userName', title: userTableTitle[0], searcher: {type: "text"} },
                    { sortable: true, field: 'userParent', title: userTableTitle[1], searcher: {type: "text"} }
                ]
            };

            $scope.addUserOutBranch_table={
                tId: 'addUserOutBranch',
                clickToSelect: true,
                // sidePagination: 'server',
                showCheckBox: true,
                striped: true,
                searchable: true,
                pagination: true,
                silentSort:true,
                showPageList: false,
                pageSize: 5,
                pageList: [5, 10],
                onCheck: outUserListCheck,
                onUncheck: outUserListUnCheck,
                onCheckAll: outUserListCheck,
                onUncheckAll: outUserListUnCheck,
                columns: [
                    { sortable: true, field: 'userName', title: userTableTitle[0], searcher: {type: "text"} },
                    { sortable: true, field: 'userParent', title: userTableTitle[1], searcher: {type: "text"} }
                ]
            };
            
            $scope.uploadOptions={
                mId:"uploadModal",
                title:getRcString("UPLOAD"),                            //弹出框标题自定义，默认标题为“提示”
                autoClose: true,                         //点击确定按钮是否关闭弹窗，默认关闭
                showCancel: true,                       //是否显示取消按钮，默认显示
                okHandler: function(modal,$ele){
                    $scope.uploadFile();
                },
                cancelHandler: function(modal,$ele){
                    //点击取消按钮事件，默认什么都不做
                    //$("#uploadFile").val("");
                },
                beforeRender: function($ele){
                    //渲染弹窗之前执行的操作,$ele为传入的html片段;
                    return $ele;
                }
            };

            $scope.showUploadModal=function(){
                $scope.$broadcast('show#uploadModal');
                console.log(getRcString("UPLOAD"));
            }

            $scope.delBranch =function(v){
                //console.log($scope[v.id].branchName);
                if(reg.test(v.branchName)){
                    $alert.confirm(getRcString("isDelBranch"),function(){
                        $timeout(function(){
                            $http({
                                url:getApGroupUrl.url,
                                method:getApGroupUrl.method,
                                data:{
                                    Method:'clearSubAccountApAccess',
                                    param:{     
                                        groupId:$scope[v.id].groupName                         
                                    }     
                                }
                            }).success(function(data){
                                if(data.retCode==0){
                                    $alert.msgDialogSuccess(getRcString("DELETE")+v.branchName+getRcString("BRANCH_SUC"));
                                    $timeout(function(){
                                        var branchTable = $("#branch_tbody");
                                        branchTable.empty();
                                        $scope.refresh();
                                    },1000);
                                }else if(data.retCode==-1&&data.message=="the groupId not the leaf node"){
                                    $alert.msgDialogError(getRcString("DELETE_BRANCH"));
                                }else if(data.retCode==-1){
                                    $alert.msgDialogError(getRcString("QITA")+v.branchName+getRcString("FAIL"));

                                }                
                            }).error(function(){}); 
                        },200);                       
                    });
                }else{
                    $("#"+v.id).empty();
                }
                               
            }
            var g_enterNum = 0;  
            $scope.enterEvent = function(e,v) {
                var reg=/^[a-zA-Z0-9\u4e00-\u9fa5]{1,11}$/;
                if(reg.test(v.branchName)){
                    var input=$("#"+v.id).find("input");
                    input.removeClass("error");
                    var keycode = window.event?e.keyCode:e.which;
                    if(keycode==13 && g_enterNum == 0){
                        g_enterNum = g_enterNum + 1;
                        $scope.addOrEditBranch(v);
                    } 
                }else{
                    var input=$("#"+v.id).find("input");
                    input.addClass("error");
                }                
            } 
            var g_focusoutNum = 0;   
            $scope.foucusOutAddBranch = function(v){
                 if(g_focusoutNum == 0){
                    g_focusoutNum = g_focusoutNum + 1;
                    $scope.addOrEditBranch(v);                  
                 }                         
            }
            $scope.addOrEditBranch = function(v){               
                //debugger 
                var changeApAliasUrl=Utils.getUrl('POST','','/cloudapgroup','/init/branchOther5/upload_apgroup.json');
                //console.log($scope[$scope[v.id].superObjStr]);
                var reg=/^[a-zA-Z0-9\u4e00-\u9fa5]{1,11}$/;

                if($scope[v.id].addFlag==false){
                    if(reg.test(v.branchName)){
                       $http({
                            url:changeApAliasUrl.url,
                            method:changeApAliasUrl.method,
                            data:{
                                Method:'updateAliasName',
                                query:{
                                    groupId:$scope[v.id].groupName,
                                    alias:v.branchName
                                }
                            }
                        }).success(function(data){
                            console.log(data);
                            if(data.retCode==0){
                                g_enterNum = g_enterNum > 0 && g_enterNum-1;
                                g_focusoutNum = g_focusoutNum > 0 && g_focusoutNum - 1;          
                                var branchTable = $("#branch_tbody");
                                branchTable.empty();
                                $scope.refresh();
                            }
                        }).error(function(){}); 
                    }else{
                        g_focusoutNum = g_focusoutNum > 0 && g_focusoutNum - 1;
                        var input=$("#"+v.id).find("input");
                        input.addClass("error"); 
                    }               
                }else if($scope[v.id].addFlag==true){
                    if(reg.test(v.branchName)){
                        $http({
                            url:setApGroupUrl.url,
                            method:setApGroupUrl.method,
                            data:{
                                Method:'setGroupName',
                                query:{
                                    userName:$scope.userInfo.user,
                                    nasId:$scope.sceneInfo.nasid,
                                    parentId:$scope[$scope[v.id].superObjStr]?$scope[$scope[v.id].superObjStr].groupName:"",
                                    alias:v.branchName
                                }                      
                            }
                        }).success(function(data){
                            if(data.retCode==0){
                                g_enterNum = g_enterNum > 0 && g_enterNum-1;
                                g_focusoutNum = g_focusoutNum > 0 && g_focusoutNum - 1; 
                                $scope[v.id].addFlag==false;
                                var branchTable = $("#branch_tbody");
                                branchTable.empty();
                                $scope.refresh();
                            }               
                        }).error(function(){}); 
                    }else{
                        g_focusoutNum = g_focusoutNum > 0 && g_focusoutNum - 1;
                        var input=$("#"+v.id).find("input");
                        input.addClass("error");            
                    }
                }
                //规则校验
            }

            $scope. downloadFile = function(){
                $("#downloadFile").get(0).src="/v3/fs/downloadcloudapgrouptemplate";
                /*var downloadApgroupTempalateUrl=Utils.getUrl('GET','','/fs/cloudapgroup/downloadcloudapgrouptempalte','/init/branchOther5/upload_apgroup.json');
                $http({
                    url:downloadApgroupTempalateUrl.url,
                    method:downloadApgroupTempalateUrl.method
                }).success(function(data){
                    console.log(data);
                }).error(function(){});*/
            }

            $scope.uploadFile = function(){
                //var upLoadApGroupUrl="v3/cloudapgroup/uploadCloudapgroupFile";
                var inputFile = $("#uploadFile")[0].files[0];
                //alert(inputFile);
                var form = $("#uploadForm")[0];
                //alert(form);
                console.log(form);
                var formData = new FormData(form);
                 console.log(formData);

                formData.append("Method","uploadCloudapgroup");
                //alert(formData);
                console.log(formData);
                var xhr = new XMLHttpRequest();
                xhr.open('POST', form.action+$scope.sceneInfo.sn);
                xhr.send(formData);
                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4 && xhr.status == 200) {
                        var data = JSON.parse(xhr.responseText);
                        if(data.retCode==0){
                            $alert.msgDialogSuccess(getRcString('SUCCESS'));
                            $scope.drawBranch();
                        }else if(data.retCode==-1){
                            if(data.message.msg=="[apSN already into group]"){
                                $alert.msgDialogSuccess("文件上传失败，表中有apSN已加入某分支中。");
                            }
                        }
                    }
                }
            }
            $scope.drawBranch=function(){                
                $http({
                    url:getApGroupUrl.url,
                    method:getApGroupUrl.method,
                    data:{
                        Method:'getCloudApgroupNameList',
                        query:{
                            userName:$scope.userInfo.user,
                            nasId:$scope.sceneInfo.nasid
                        }
                    }
                }).success(function(data){
                    console.log(data);
                    if(data.retCode==0&&data.message){
                        drawTreeTable(data);
                    } else{
                        $scope.addData();
                    }           
                }).error(function(){});
            }
            //获取AP信息无数据时执行的函数
            $scope.addData=function(){
                $http({
                    url:setApGroupUrl.url,
                    method:setApGroupUrl.method,                           
                    data:{
                        Method:'setGroupName',
                        query:{
                            userName:$scope.userInfo.user,
                            nasId:$scope.sceneInfo.nasid,
                            parentId:"",
                            alias:getRcString("ZONGBU")
                        }
                    }                           
                }).success(function(data){
                    $http({
                        url:getApGroupUrl.url,
                        method:getApGroupUrl.method,
                        data:{
                            Method:'getCloudApgroupNameList',
                            query:{
                                userName:$scope.userInfo.user,
                                nasId:$scope.sceneInfo.nasid
                            }
                        }
                    }).success(function(data){
                        console.log(data);
                        if(data.retCode==0&&data.message){
                            drawTreeTable(data);
                        }          
                    }).error(function(){}); 
                }).error(function(){}); 
            }
            $scope.drawBranch();
            $scope.refresh=function(){
                $http({
                    url:getApGroupUrl.url,
                    method:getApGroupUrl.method,
                    data:{
                        Method:'getCloudApgroupNameList',
                        query:{
                            userName:$scope.userInfo.user,
                            nasId:$scope.sceneInfo.nasid
                        }
                    }
                }).success(function(data){
                    console.log(data);
                    if(data.retCode==0){
                        drawTreeTable(data);
                    }           
                }).error(function(){});
            }

            $scope.jump=function(v){
                /*window.location.href="#/scene15/nasid"+$scope.sceneInfo.nasid+"/devsn"+$scope.sceneInfo.sn
                                    +"/content"+$scope[v.id].groupName+"topName"+$scope["branch"].groupName
                                    +"/monitor/dashboard15";*/
                $location.url("/scene15/nasid"+$scope.sceneInfo.nasid+"/devsn"+$scope.sceneInfo.sn
                                    +"/content"+$scope[v.id].groupName+"topName"+$scope["branch"].groupName
                                    +"/monitor/dashboard15");
            }
        }]
    }
)