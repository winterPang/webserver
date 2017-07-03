;(function($)
{
    var UTILNAME = "Panel"
    var MyLocal = $.MyLocale.panel;
    var _oTimer ;

    function Topology(jPanel,opt)
    {
        var _options = $.extend(opt,{warnNum: 0, errNum : 0});
        var _jPanel = jPanel, _jMain, _jTipBox, _DataObj;
        var _HtmlMaker = {
            Cloud :function (){
                // if(_DataObj.isIconTip)
                // {
                //     return '<p class="infor-child">'+MyLocal.CloudOff+'</p>';
                // }
                return  '<p class="infor-child">'
                        +MyLocal.State+MyLocal.Status
                        +'</p><p class="infor-child">'
                        +MyLocal.Account+_DataObj.CloudName+'</p>';
            },
            Net : function (){
                if(_DataObj.isIconTip)
                {
                    // return '<p class="infor-child">'+MyLocal.NetOff+'</p>';
                }
            },
            AC : function (){
                if(_DataObj.CPU&&_DataObj.Memory){
                return '<p class="infor-child">CPU : '+_DataObj.CPU+'%</p><p class="infor-child">'+MyLocal.memory+" : "+_DataObj.Memory+'%</p>';
                }
                else{
                   return'<p class="infor-child">'+MyLocal.APNone+'</p>' 
                }
            },
            AP : function (){
                var aOffAP = _DataObj.OffAP, nNum = _DataObj.OffAPNum, aHtml = [];
                aHtml.push('<p class="infor-child">'+MyLocal.Warning+'</p>');
                aHtml.push('<p class="infor-child">'+nNum+MyLocal.APOff+'</p>');
                aHtml.push('<p class="infor-child">'+MyLocal.OffAP+'</p>'); 
                for(var i=0;i<nNum;i++)
                {
                    aHtml.push('<p class="infor-child">'+_DataObj.OffAPList[i]+'</p>');
                }

                // for(var i=0;i<nNum;i++)
                // {
                //     // var string = MyLocal.OffInfor.replace("%name",aOffAP[i].Name).replace("%time",aOffAP[i].Time);
                //     var string = MyLocal.OffInfor.replace("%name",aOffAP[i].Name);
                //     aHtml.push('<p class="infor-child">'+string+'</p>');
                // }

                if(nNum > 7)
                {
                    $(".tool-bar",_jTipBox).show();
                }

                return aHtml.join("");
            },
            Count : function (){
                // var nNum = _DataObj.APNum;
                // return '<p class="infor-child">'+MyLocal.APCount+_DataObj.APNum+'</p>';
                var aHtml=[];aKey =["Name","Addr","StaNum"];
                if(_DataObj.APNum ==0)
                {
                    return'<p class="infor-child">'+MyLocal.APNone+'</p>'
                }
                
                aHtml.push('<table style="color:#ffffff"><tr><td>');
                aHtml.push(MyLocal.APName);
                aHtml.push('</td><td>');
                aHtml.push(MyLocal.IPAddr);
                aHtml.push('</td><td>');
                aHtml.push(MyLocal.StaNum);
                aHtml.push('</td></tr>');

                for(var i=0;i<_DataObj.APNum;i++)
                {
                    aHtml.push('<tr>');
                    // map[i].StaNum = 0;
                    // for(var ii=0;ii<sta.length;ii++)
                    // {
                    //     if(map[i].Name == sta[ii].ApName) map[i].StaNum ++;
                    // }

                    // for(var ii=0;ii<rap.length;ii++)
                    // {
                    //     if(map[i].Name == rap[ii].ApName) map[i].Addr =  rap[ii].Ipv4Address;
                    // }

                    // map[i].Addr = map[i].Addr || MyLocal.APOff;

                    for(var y = 0; y < aKey.length; y++)
                    {
                        aHtml.push('<td align="center">'+_DataObj.Ap[i][aKey[y]]+'</td>');
                    }
                    
                    aHtml.push('</tr>');
                }
                aHtml.push('</table>');
                return aHtml.join("");
            }
        };

        function _create()
        {
           /* if(Frame.get("WorkMode") == "2")
            {
                _jPanel.addClass("brige");
            }*/
            _jPanel.addClass('topology-panel');


            //main
            _jMain = $('<div class="topology"></div>').appendTo(_jPanel);
            var oIconMode = [
                {className:"hide hover-trigger cloud", type:"Cloud"},
                {className:"hide hover-trigger network", type:"Net"},
                {className:"hide hover-trigger ac", type:"AC"},
                {className:"hide topo-icon cloud", type:"Cloud"},
                // {className:"hide topo-icon network", type:"Net"},
                {className:"hide topo-icon ac", type:"AC"},
                {className:"hide topo-icon ap", type:"AP"},
                {className:"hide topo-icon topo-count", type:"Count", inner:"count-text"}
            ];
            var aInnerHtml = [];
            for(var i=0;i<oIconMode.length;i++)
            {
                var oMode = oIconMode[i];
                aInnerHtml.push('<span class="' + oMode.className + '" type="' + oMode.type + '">');
                if(oMode.inner)
                {
                    aInnerHtml.push('<i class="'+oMode.inner+'"></i>');
                }
                aInnerHtml.push('</span>');
            }
            _jMain.html(aInnerHtml.join(" "));
            //show TipBOX
            $('.topo-icon,.hover-trigger', _jMain).mouseenter(showTipBox);

            //infor box
            var sBoxDiv =   '<div id="topo_tip_box" class="hide">'+
                                '<div class="bk-layer"></div>'+
                                '<div class="tip-body"></div>'+
                                '<div class="tool-bar hide"><span class="btn-detail"></span></div>'+
                            '</div>';
            _jTipBox = $(sBoxDiv).appendTo($('body'));

            //refresh
            _initData();
            _resize();
        }

        function _initData()
        {
            // $.ajax({
            //     url: "../../wnm/panel.json",
            //     type: "GET",
            //     dataType: "json",
            //     success: function(data){
            //         var oAccount= data.oAccount || {};

            //         var aDeviceInfo = data.aDeviceInfo;

            //         //Device information
            //         var oDeviceInfor = {
            //             "HardwareRev" : false,
            //             "FirmwareRev" : false,
            //             "SoftwareRev" : false,
            //             "SerialNumber" : false
            //         }, bFlag = false;

            //         for(var i=0;i<aDeviceInfo.length;i++)
            //         {
            //             bFlag = true;
            //             for(key in oDeviceInfor)
            //             {
            //                 oDeviceInfor[key] = oDeviceInfor[key] || aDeviceInfo[i][key];
            //                 if(!oDeviceInfor[key]) bFlag = false;
            //             }

            //             if(bFlag) break;
            //         }

            //         //Cloud information
            //         _DataObj = $.extend({
            //             CloudState : oAccount.CloudConnectionState,
            //             CloudName : oAccount.CloudAccountName,
            //         },oDeviceInfor);

            //         //Network information
            //         _DataObj["NetState"] = 1;

            //         getDynamicData();
            //     },
            //     error:function(err,status){
            //         // Frame.Msg.error(MyConfig.httperror);
            //     }
            // });
            var oDeviceInfor = {
                "HardwareRev" : false,
                "FirmwareRev" : false,
                "SoftwareRev" : false,
                "SerialNumber" : false
            }
            _DataObj = $.extend({
                CloudState : "",
                CloudName : "",
            },oDeviceInfor);

            //Network information
            _DataObj["NetState"] = 1;
            getDynamicData();
            _oTimer = setInterval(getDynamicData,10*60*1000);

        }

        function getDynamicData()
        {
            $.ajax({
                url:"/v3/apmonitor/web/aplist?devSN=" + FrameInfo.ACSN,
                dataType:"json",
                success:function(data){
                    _DataObj.APNum = data.apList.length;
                    _DataObj.Ap=[];
                    _DataObj.ApAddress=[];
                    _DataObj.OffAPNum = 0;
                    _DataObj.OffAPList =[];
                    for(var i =0;i<data.apList.length;i ++)
                    {

                        if(data.apList[i].status==2)
                        {
                            _DataObj.OffAPNum++;
                            _DataObj.OffAPList.push(data.apList[i].apName);

                        }
                        var tem = {
                            "Name":data.apList[i].apName,
                            "Addr":data.apList[i].ipv4Addr,
                            "StaNum":0
                        };
                        _DataObj.Ap.push(tem);
                    }
                    $.ajax({
                        url:"/v3/stamonitor/web/stationlist?devSN=" + FrameInfo.ACSN,
                        dataType:"json",
                        success:function(data){

                            for (var i=0;i<_DataObj.APNum;i++)
                            {
                                for(var j=0;j<data.clientList.length;j++)
                                {

                                    if(_DataObj.Ap[i].Name == data.clientList[j].ApName)
                                    {
                                        _DataObj.Ap[i].StaNum++;
                                    }
                                }
                            };

                            $.ajax({
                                //url: MyConfig.v2path+"/getDevStatus",
                                url:"/v3/ace/oasis/oasis-rest-shop/restshop/o2oportal/getDevStatus",
                                type: "POST",
                                dataType: "json",
                                contentType: "application/json",
                                username :MyConfig.username,
                                password : MyConfig.password,
                                data: JSON.stringify({
                                    tenant_name:FrameInfo.g_user.attributes.name,
                                    dev_snlist: [FrameInfo.ACSN],
                                }),
                                success: function(data) {
                                    var adev_statuslist=data.dev_statuslist;
                                    var Connect_Sta= ["已连接","断开连接"];
                                    if(adev_statuslist.length==1){
                                        if(adev_statuslist[0].dev_status==1)
                                        {
                                            MyLocal.Status = Connect_Sta[0];
                                        }
                                        else{
                                            MyLocal.Status = Connect_Sta[1];
                                        }
                                    }else{
                                        MyLocal.Status = Connect_Sta[1];
                                    }
                                    _DataObj.CloudName= FrameInfo.g_user.attributes.name;
                                   // $.get("/v3/web/cas_session",function(data){
                                    //    _DataObj.CloudName= FrameInfo.g_user.attributes.name;
                                        $.ajax({
                                            url: "/v3/devmonitor/web/system?devSN=" + FrameInfo.ACSN,
                                            dataType: "json",
                                            success: function(data){

                                                // var aEntityExtInfo = data.aEntityExtInfo;
                                                // var aManualAP= data.aManualAP || {};

                                                //CPU and Memory
                                                _DataObj["ACState"] = -1;
                                                _DataObj["CPU"] = data.cpuRatio;
                                                _DataObj["Memory"] = data.memoryRatio;

                                                //for test
                                                // _DataObj["CPU"] = parseInt(Math.random()*100);
                                                // _DataObj["Memory"] = parseInt(Math.random()*100);

                                                if(_DataObj["CPU"] > 80 || _DataObj["Memory"] > 80) _DataObj["ACState"] = 0;
                                                // if (!_DataObj["CPU"] || !_DataObj["Memory"])
                                                // {
                                                //     _DataObj["ACState"] = 1;
                                                // }
                                                // else if(_DataObj["CPU"] > 80 || _DataObj["Memory"] > 80)
                                                // {
                                                //     _DataObj["ACState"] = 0;
                                                // };
                                                //AP Online Statistic
                                                // _DataObj["APNum"] = aManualAP.length;
                                                // _DataObj["OffAPNum"] = 0;
                                                _DataObj["APState"] = -1;
                                                // _DataObj.OffAP = [];
                                                // for(var i=0;i<aManualAP.length;i++)
                                                // {
                                                //     if(aManualAP[i].Status != "1")
                                                //     {
                                                //         _DataObj["OffAPNum"]++;
                                                //         _DataObj.OffAP.push(aManualAP[i]);
                                                //     }
                                                // }

                                                //for test
                                                // _DataObj["APNum"] = parseInt(Math.random()*32);
                                                // _DataObj["OffAPNum"] = parseInt(Math.random()*32);

                                                if(_DataObj["OffAPNum"] > 0) _DataObj["APState"] = 0;
                                                // if(_DataObj["OffAPNum"] == _DataObj["APNum"]) _DataObj["APState"] = 1;


                                                _refresh(_DataObj);

                                                /* if(_oTimer)
                                                 {
                                                 clearTimeout(_oTimer);
                                                 }
                                                 _oTimer = setTimeout(function(){getDynamicData();},5000);*/
                                            },
                                            error:function(err,status){
                                                // Frame.Msg.error(MyConfig.httperror);
                                            }
                                        });
                                //    });
                                }
                            });
                        }
                    });


                },
                error: function(err,status){
                    // Frame.Msg.error(MyConfig.httperror);
                }
            });
        }

        function _refresh()
        {   
            var oMap = {CloudState : ".cloud", NetState : ".network", ACState : ".ac", APState : ".ap"};
            var aState = ['topo-warning','topo-error'];
            
            for(key in oMap)
            {
                if((typeof _oTimer == "number") && (key == "CloudState" || key == "NetState"))
                {
                    continue;
                }

                var sClass = oMap[key];
                var sState = aState[_DataObj[key]];
                if(sState && sState != "-1")
                {
                    $(".hover-trigger"+sClass, _jMain).hide();
                    $(".topo-icon"+sClass, _jMain).removeClass('topo-warning')
                                          .removeClass('topo-error')
                                          .addClass(sState)
                                          .show();
                }
                else
                {
                    $(".hover-trigger"+sClass, _jMain).show();
                    $(".topo-icon"+sClass, _jMain).hide();
                }
            }

            if(_DataObj.APNum > 1)
            {
                $('.topo-count', _jMain).removeClass('hide');
                $('.count-text', _jMain).html(_DataObj.APNum);
            }

            if(_jTipBox.is(":visible"))
            {
                refreshTip();
            }
        }

        function showTipBox(e)
        {
            var oTimer = false;
            _DataObj.TipType = $(this).attr("type");
            _DataObj.isIconTip = $(this).hasClass("topo-icon");
            refreshTip();
            _jTipBox.css({"left":e.pageX+20,"top":e.pageY+10}).fadeIn(200);
            $(document).on('mousemove.topology',function(e){
                if(oTimer)
                {
                    clearTimeout(oTimer);
                }
                oTimer = setTimeout(function(){
                    var jEle = $(e.srcElement);
                    if(jEle.is('.topology .topo-icon,.topology .hover-trigger,.topology i'))
                    {
                        _jTipBox.css({"left":e.pageX+20,"top":e.pageY+10}).show();
                    }
                    else if(jEle.parents("#topo_tip_box").length)
                    {
                        _jTipBox.show();
                    }
                    else
                    {
                        _jTipBox.fadeOut(200);
                        $(document).off('mousemove.topology');
                    }
                },50);
            });
        }

        function refreshTip()
        {
            var jBoxBody = $('.tip-body',_jTipBox),
                sType = _DataObj.TipType;
            $(".tool-bar",_jTipBox).hide();
            jBoxBody.empty().append(_HtmlMaker[sType]);
        }

        function _resize()
        {
            var nTotalWidth = _jPanel.width(),
                nMainWidth = _jMain.width(),
                nLeft = (nTotalWidth-nMainWidth)/2 + "px";
            _jMain.css({'left':nLeft});
        }

        function _destroy()
        {
            _jTipBox.remove();
            if(_oTimer)
            {          
                clearInterval(_oTimer)
               // clearTimeout(_oTimer);
            }
        }

        _create();
        this.resize = _resize;
        this.destroy = _destroy;
    }

    var oPanel = {
        pfMap:{
            "topology"  : Topology
        },
        _create : function()
        {
            this.panel = this.element;
        },
        _destroy:function()
        {
            // _destroy();
            this.oInstance.destroy();
            this.panel.remveData("opt");
            delete this.panel;
        },
        init: function (opt)
        {
            var oHandle = this;
            sType = opt.type;
            if(oHandle.pfMap[sType])
            {
                oHandle.oInstance = new oHandle.pfMap[sType](this.panel,opt);
            }
            Frame.regNotify(UTILNAME, "resize",  function(){
                oHandle.resize();
            });
        },
        resize: function(){
            this.oInstance.resize();
        },
        getPort : function(){
            return this.oInstance.getPort ? this.oInstance.getPort() : {};
        },
        setPort : function(ifIndex){
            this.oInstance.setPort && this.oInstance.setPort(ifIndex);
        },
        disabled : function(value)
        {
            this.oInstance.disabled && this.oInstance.disabled(value);
        }
    };

    function _init(oFrame)
    {
        $(".panel", oFrame).Panel();
    }

    function _destroy()
    {
    }

    $.widget("ui.Panel", oPanel);
    Widgets.regWidget(UTILNAME, {
        "init": _init, "destroy": _destroy,
        "widgets": [],
        "libs": ["Libs.Panel.Define"]
    });
})(jQuery);
