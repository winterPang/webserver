define(['jquery','utils','echarts','bootstrap-daterangepicker','css!bootstrap_daterangepicker_css'],function($,Utils,echarts) {
    return ['$scope', '$http','$state',function($scope,$http,$state){

        var terminalFirm = echarts.init(document.getElementById("showpie"));
        $scope.mypieEchart = function(){
            var terFirmOption = {
                tooltip: {
                trigger: 'item',
                formatter: "{a} {b}: <br/>{c} ({d}%)"
                },
                series: [
                    {
                        type:'pie',
                        radius :['55','65%'],
                        center: ['15%', '45%'],
                        avoidLabelOverlap: false,
                        itemStyle: {
                            normal: {
                                labelLine:{
                                    show:false
                                },
                                label:
                                {
                                    position:"inner",
                                    show:false
                                }
                            }
                        },
                        data:
                        // aData
                        [
                            { name: '苹果', value: 13},
                            { name: '小米', value: 17},
                            { name: '三星', value: 25},
                            { name: '华为', value: 39}
                        ]              
                    }
                ],
                color:['#D52B4D', '#FF9900', '#44BB74', '#D56F2B', '#C48D3C', '#55AA66', '#44A3BB', '#2BD5D5', '#91B2D2', '#D7DDE4']
            };
            terminalFirm.setOption(terFirmOption);
        }
       
        //wu shu ju hui tu
        var grayLastOption = {
            height:200,
            calculable : false,
            series : [
                {
                    type:'pie',
                    radius : ['55%', '65%'],
                    center: ['15%', '45%'],
                    itemStyle: {
                        normal: {
                            labelLine:{
                                show:false
                            },
                            label:
                            {
                                position:"inner"
                            }
                        }
                    },
                    data: [{name:'N/A',value:1}]
                }
            ],
            color : ["rgba(216, 216, 216, 0.75)"]
        };
        $http({
            url:"/v3/ant/read_dpi_url",
            method:"post",
            data:{
                 family: "0",
                direct: "0",
                // ACSN: g_sn,
                StartTime: 1476892800,
                EndTime: 1479484800,
                devSN:$scope.sceneInfo.sn,
            }
        }).success(function(data){

        })

        if(!aData.length) {
            aData.push({name:'', value:1});
            aColor = ['#ccc'];
            setPieLegend([], aColor, "probe_Ssid");
        }
        else {
            aColor = ['#53B9E7','#31ADB4','#69C4C5','#FFBB33','#FF8800','#CC324B','#E64C65','#D7DDE4'];
            setPieLegend(aData, aColor, "probe_Ssid");
        }

        function setPieLegend(aData, aColor, strId) {
            var strHtml = "";
            var sum = 0;
            var startDiv = "<div class='leg-row'>"
            var endDiv = "</div>"
            var oTmp = $("#" + strId);
            
            if(!aData.length) {
                oTmp.html(strHtml);
                return;
            }

            for(var i = 0; i < aData.length; i++) {
                aData[i].value = Number(aData[i].value);
                sum += aData[i].value;
            }

            for(var i = 0; i < aData.length; i++) {
                strHtml += startDiv +  "<span class='leg-icon' style=" + "'"+ "background:" + aColor[i] + "'" + ">" + "</span>";
                strHtml += "<span class='leg-title' title=" + "'" + aData[i].name + "'" + ">" + aData[i].name + "</span>";
                strHtml += "<span class='leg-percent'>" + (aData[i].value / sum * 100).toFixed(0) + "%" + "</span>" + endDiv; 
            }

            oTmp.css("top", topChange(170, 31, aData.length, 50));
            oTmp.html(strHtml);
        }

        $('#daterange').daterangepicker();




        /*ceshi  Start*/

        /*有输入框的下拉框的事件处理*/
        var dealEvent   = {
            nowState : {},
            nowRadio : 0,
            scope    : "",
            currentid:"",
            init: function(){
                    var jscope = $(".probe-choice");
                    for(var i = 0; i < jscope.length; i++)
                    {
                        dealEvent.nowState[jscope[i].getAttribute("id")] = 1;
                    }
                },
                liOnClick: function(e){
                    var scope = $(this);
                    if(scope.val() == dealEvent.nowState[dealEvent.currentid])
                    {
                        $(".choice-show", dealEvent.scope).removeClass("height-change");
                        return false;
                    }
                    else
                    {
                        dealEvent.nowState[dealEvent.currentid] = scope.val();
                        $(".current-state", dealEvent.scope).text(scope.text());
                        $(".choice-show", dealEvent.scope).removeClass("height-change");
                    }
                    $("#body_over").addClass("hide");

                    $(dealEvent.scope).trigger({type:"probechange.probe"}, {value:dealEvent.nowState[dealEvent.currentid]});
                },
                inputClick:function(e){
                    dealEvent.currentid = $(this).closest(".probe-choice").attr("id");
                    dealEvent.scope = "#" + dealEvent.currentid;
                    $("#body_over").removeClass("hide");
                    $(".choice-show", dealEvent.scope).addClass("height-change");

                    return false;
                },
            blackClick:function(e){
                $("#body_over").addClass("hide");
                $(".choice-show", dealEvent.scope).hasClass("height-change") && $(".choice-show", dealEvent.scope).removeClass("height-change");
            },
            searchClick:function(e){
                dealEvent.nowState[dealEvent.currentid] = 0;
                $("#body_over").addClass("hide");
                $(".choice-show", dealEvent.scope).removeClass("height-change");
                $(".current-state", dealEvent.scope).text($(".probe-input").val());

                $(dealEvent.scope).trigger({type:"probechange.probe"}, {value:dealEvent.nowState[dealEvent.currentid]});

            },
            searchClickAll:function(e){
                dealEvent.nowState[dealEvent.currentid] = 0;
                $("#body_over").addClass("hide");
                $(".choice-show", dealEvent.scope).removeClass("height-change");
                $(".current-state", dealEvent.scope).text(getRcText("ALL"));
                $(dealEvent.scope).trigger({type:"probechange.probe"}, {value:dealEvent.nowState[dealEvent.currentid]});

                /*显示全部的Url类型*/
                $("#AllSelecttype").removeClass("hide");
                $("#OneSelecttype").addClass("hide");
                /*选择了全部，不是输入MAC  如果当前选中的是饼图 则选择方式都显示  如果当前选中的是折线图 则只能选择人次*/
                if(g_Legend == 0)
                {
                    $("#PersonSelectWay").addClass("hide");
                    $("#TimeSelectWay").addClass("hide");
                    $("#AllSelectWay").removeClass("hide");
                }
                if(g_Legend == 1)
                {
                    $("#PersonSelectWay").removeClass("hide");
                    $("#TimeSelectWay").addClass("hide");
                    $("#AllSelectWay").addClass("hide");
                }
               
                /*清除url和MAC*/
                document.getElementById("MACinput").value=getRcText("USERMAC");//"用户MAC";
                document.getElementById("URLinput").value=getRcText("ACCWEB");//"访问网址";
                /*显示饼图  折线图两个按钮*/
                $("#AllShowType").removeClass("hide");
                $("#OneShowType").addClass("hide");
                /*取消URL和MAC显示的红框*/
                $("#MACinput").removeClass("border-red");
                $("#URLinput").removeClass("border-red");
                var value = 0;
                InputMacOrUrl(value);
            },
            searchClickMAC:function(e){
                /*取消URL显示的红框*/
                $("#URLinput").removeClass("border-red");
                /*清除输入的url*/
                document.getElementById("URLinput").value=getRcText("ACCWEB");//"访问网址";
                /*判断MAC地址的合法性 如果不合法则不收回下拉框*/
                var MacValue = $("#MACinput").val();
                if((!macFormCheck(MacValue)))
                {
                    $("#MACinput").addClass("border-red");
                    return;
                }
                else
                {
                    $("#MACinput").removeClass("border-red");
                }

                dealEvent.nowState[dealEvent.currentid] = 0;
                $("#body_over").addClass("hide");
                $(".choice-show", dealEvent.scope).removeClass("height-change");
                $(".current-state", dealEvent.scope).text($("#MACinput").val());
                $(dealEvent.scope).trigger({type:"probechange.probe"}, {value:dealEvent.nowState[dealEvent.currentid]});

                /*显示全部的Url类型*/
                $("#AllSelecttype").removeClass("hide");
                $("#OneSelecttype").addClass("hide");
                /*选择了输入MAC则不用统计人次，只统计时长*/
                $("#PersonSelectWay").addClass("hide");
                $("#TimeSelectWay").removeClass("hide");
                $("#AllSelectWay").addClass("hide");
                /*由于只统计时长 所以选择折线图不显示*/
                $("#AllShowType").addClass("hide");
                $("#OneShowType").removeClass("hide");


                var value = 1;
                InputMacOrUrl(value);
            },
            searchClickURL:function(e){
                /*取消MAC地址显示的红框*/
                $("#MACinput").removeClass("border-red");
                /*清除输入的MAC*/
                document.getElementById("MACinput").value=getRcText("USERMAC");//"用户MAC";
                /*如果输入的网址是空，则提示 并不收回下拉框*/
                var UrlValue = $("#URLinput").val();
                if(UrlValue == ""||UrlValue == getRcText("ACCWEB"))///"访问网址")
                {
                    $("#URLinput").addClass("border-red");
                    return;
                }
                else
                {
                    $("#URLinput").removeClass("border-red");
                }

                dealEvent.nowState[dealEvent.currentid] = 0;
                $("#body_over").addClass("hide");
                $(".choice-show", dealEvent.scope).removeClass("height-change");
                $(".current-state", dealEvent.scope).text($("#URLinput").val());
                $(dealEvent.scope).trigger({type:"probechange.probe"}, {value:dealEvent.nowState[dealEvent.currentid]});

                /*选择了url则不用再选择类型*/
                $("#AllSelecttype").addClass("hide");
                $("#OneSelecttype").removeClass("hide");
                /*选择了输入Url，不是输入MAC则统计人次*/
                $("#PersonSelectWay").removeClass("hide");
                $("#TimeSelectWay").addClass("hide");
                $("#AllSelectWay").addClass("hide");
                /*显示饼图  折线图两个按钮*/
                $("#AllShowType").removeClass("hide");
                $("#OneShowType").addClass("hide");

                var value = 2;
                InputMacOrUrl(value);

            },
            timeClick: function (e) {
                $("#probe_timechoice").addClass("hide");
                //
                //$(dealEvent.scope).trigger({type:"probechange.probe", data:dealEvent.nowState});
                //
            },
            dateChange: function (e) {
                 dealEvent.nowState[dealEvent.currentid] = 4;///

                var orange = $(this,dealEvent.scope).daterange("getRangeData");
                $(".current-state", dealEvent.scope).text(orange.startData + '-' +orange.endData);
                var  sinputTime = orange.startData + '-' +orange.endData
                document.getElementById("daterange").value=sinputTime;
                $(".choice-show", dealEvent.scope).removeClass("height-change");

                StartTime = new Date(orange.startData)-0;////
                EndTime = new Date(orange.endData)-0;/////
                $(dealEvent.scope).trigger({type:"probechange.probe"}, {value:dealEvent.nowState[dealEvent.currentid],startTime:StartTime,endTime:EndTime});////

               // otherTime();
                //$(dealEvent.scope).trigger({type:"probechange.probe"}, {value:dealEvent.nowState[dealEvent.currentid]});
            }
        };

        /*ce shi  end*/

        initFrom();
        function initFrom()
        {
            /*有输入框的下拉框事件*/
            $(".choice-head").click(dealEvent.inputClick);
            $(".choice-show li").click(dealEvent.liOnClick);
            $("#body_over").click(dealEvent.blackClick);
            /*$(".search-icon").click(dealEvent.searchClick);
            $(".search-icon1").click(dealEvent.searchClick);*/
            $("#daterange").on("inputchange",dealEvent.dateChange);

            /*选择 输入MAC  Url*/
            $("#UserMAC").click(dealEvent.searchClickMAC);
            $("#Url").click(dealEvent.searchClickURL);
        }

    }];
});