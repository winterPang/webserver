/* global $ */
$(function(){
    var Tips = {
        info: function(sMsg, sType)
        {
            var sId="frame_msg_info";
            var iFadetime=400;
            var jInfo = $("#" + sId);
            if (0 == jInfo.length)
            {
                jInfo = $("<div id="+sId+" style='display:none;'></div>");
                $("body").append(jInfo);
            }

            sType = sType||"ok";
            sMsg = "<div class='msg-"+sType+"'></div>"+sMsg;
            jInfo
                .attr ("class", "msg-box msg-"+sType)
                .html (sMsg)
                .fadeIn (iFadetime);

            this.create("Frame.Msg.info",function()
            {
                $("#"+sId).fadeOut();
            },2000);
        },
        create: function(sModule, pfAction, nTime, bLoop, para)
        {
            function _do()
            {
                oTimer.timer = false;

                var bContinue = pfAction(para);
                if ((true === bContinue) && (true === bLoop) )
                {
                    oTimer.timer = setTimeout(_do, nTime);
                }
            }

            var oTimer =
            {
                name: sModule,
                action: _do,
                time: nTime,
                loop: bLoop,
                timer: setTimeout(_do, nTime)
            };
            return oTimer;
        }
    };
    var DataFormat = {
        /*
         * @params data new Data()
         * @params value计算几天前的数据
         * @params operate true false true表示为+ false表示需要-
         * @return 2015-11-11类型字符串
        */
        toYearString:function(data,value,operate){
            var nYear = data.getFullYear();
            var nMonth = data.getMonth()+1;
            var endDay = "";
            if(operate){
                endDay = value?data.getDate()+value:data.getDate();
            }else{
                endDay = value?data.getDate()-value:data.getDate();
            }
            return nYear+"-"+nMonth+"-"+endDay;
        },
        /*
         * @params data new Data()
         * @params value计算几天前的数据
         * @params operate true false true表示为+ false表示需要-
         * @return 2015-11-11类型字符串
         */
        formatOtherYearString:function(data){
            var nYear = data.getFullYear();
            var nMonth = data.getMonth()+1;
            if(nMonth<10){
                nMonth="0"+nMonth;
            }
            var endDay = data.getDate();
            if(endDay<10){
                endDay="0"+endDay;
            }
            return nYear+"/"+nMonth+"/"+endDay;
        },
        /*
         * @params data new Data()
         * @params value计算几天前的数据
         * @params operate true false true表示为+ false表示需要-
         * @return 2015-11-11类型字符串
         */
        formatOtherHoursString:function(data){
            var currHours= data.getHours();
            if(currHours<10){
                currHours="0"+currHours;
            }
            var min = data.getMinutes();
            if(min<10){
                min="0"+min;
            }
            var seconds = data.getSeconds()
            if(seconds<10){
                seconds="0"+seconds;
            }
            return currHours+":"+min+":"+seconds;
        },
        /*
        *return 2015-11-11 hh:mm:ss类型字符串
        * */
        toSecondsString:function(data,value){
            var nYear = data.getFullYear();
            var nMonth = data.getMonth()+1;
            var endDay = data.getDate();
            var currHours= data.getHours();
            if(value){
                if(currHours>value){
                    currHours =data.getHours()-value;
                }else{
                    currHours =23+data.getHours()-value;
                    endDay=endDay-1;
                }
            }
            var min = data.getMinutes();
            var seconds = data.getSeconds()
            return nYear+"-"+nMonth+"-"+endDay+" "+currHours+":"+min+":"+seconds;
        },
        /*
         *@paramsdata 2015-11-11 hh:mm:ss类型字符串
         * */
        getNineMiloSeconds:function(data){
            return new Date(data).getTime();
        },
        getHourSeconds:function(data,value){
            var formatDate= new Date(data);
            var nYear = formatDate.getFullYear();
            var nMonth = formatDate.getMonth();
            var endDay = formatDate.getDate();
            var currHours= formatDate.getHours();
            if(value){
                if(currHours>value){
                    currHours =currHours-value;
                }else{
                    currHours =23+currHours-value;
                    endDay=endDay-1;
                }
            }
            var hoursStr =nYear+"-"+nMonth+"-"+endDay+" "+currHours+":00:00";
            return new Date(hoursStr).getTime();
        },
        getHour:function(data,value){
            var formatDate= new Date(data);
            var nYear = formatDate.getFullYear();
            var nMonth = formatDate.getMonth();
            var endDay = formatDate.getDate();
            var currHours= formatDate.getHours();
            if(value){
                if(currHours>value){
                    currHours =data.getHours()-value;
                }else{
                    currHours =23+currHours-value;
                    endDay=endDay-1;
                }
            }

            return nYear+"-"+nMonth+"-"+endDay+" "+currHours;;
        }
    };
    var provinceList = {};
    var v2path = "/v3/ace/o2oportal";
    $("#switch").click(function(){
        if($(this).hasClass('show_word'))
        {
            $(this).removeClass('show_word');
            $("#text").hide();
            $("#oldpassword").show();
            $("#oldpassword").val($("#text").val());
        }
        else{
            $(this).addClass('show_word');
            $("#text").show();
            $("#oldpassword").hide();
            $("#text").val($("#oldpassword").val());
        }
    });

    $("#switch_new").click(function(){
        if($(this).hasClass('show_word'))
        {
            $(this).removeClass('show_word');
            $("#text_new").hide();
            $("#password").show();
            $("#password").val($("#text_new").val());
        }
        else{
            $(this).addClass('show_word');
            $("#text_new").show();
            $("#password").hide();
            $("#text_new").val($("#password").val());
        }
    });

    $("#switch_renew").click(function(){
        if($(this).hasClass('show_word'))
        {
            $(this).removeClass('show_word');
            $("#text_renew").hide();
            $("#repeat").show();
            $("#repeat").val($("#text_renew").val());
        }
        else{
            $(this).addClass('show_word');
            $("#text_renew").show();
            $("#repeat").hide();
            $("#text_renew").val($("#repeat").val());
        }
    });

    $("#text").keyup(function(){        
        $("#oldpassword").val($("#text").val());                   
    });

    $("#text_new").keyup(function(){
        $("#password").val($("#text_new").val());    
    });

    $("#text_renew").keyup(function(){
        $("#repeat").val($("#text_renew").val());    
    });

    $("#password,#text_new").change(function(){
        $(this).val().length >= 8 ? $("#password_error").hide() : $("#password_error").show(); 
    });
    $("#repeat,#text_renew").change(function(){
        $(this).val() == $("#password").val() ? $("#repeat_error").hide() : $("#repeat_error").show();
    });
    $("#changePassword").bind("click", function(){
        if($(".text-error","#changepassword_form")&&$(".text-error","#changepassword_form").length>0){
            return false;
        }
        if($("#password").val()!=$("#repeat").val()){
            Frame.oWidget.setError($("#password"),"新密码与确认密码不一致");
            return false;
        }
        if($("#oldpassword").val().trim()==""){
            Frame.oWidget.setError($("#oldpassword"),"当前密码不能为空");
            return false;
        }
        if($("#password").val().trim()==""){
            Frame.oWidget.setError($("#password"),"密码不能为空");
            return false;
        }
        if($("#repeat").val().trim()==""){
            Frame.oWidget.setError($("#repeat"),"确认密码不能为空");
            return false;
        }
        $.get("/v3/web/cas_session", function(data){
                $.ajax({
                    type: "POST",
                    url: v2path+"/sso/modifyPwd",
                    dataType: "json",
                    contentType: "application/json",
                    data: JSON.stringify({
                        "user_name":data.attributes.name,
                        "old_password":$("#oldpassword").val(),
                        "new_password":$("#password").val(),
                    }),
                    success: function(data){
                        if(data.error_code){
                            Tips.info(data.error_message);
                        }else{
                            Tips.info("修改成功");
                        }
                    },
                    error:  function(err){
                        // Tips.info("服务器内部错误");
                    }
                });
            });
    });

   /* function onblur()
    {
        var snumber = $.trim($(this).val());
        if(snumber == "" || !(/1\d{10}/.test(snumber)))
        {
            $("#buttonForAddIcon").addClass("disabled");
            Tips.info("电话号码错误");
           // alert("电话号码错误");
        }
        else
        {
            $("#buttonForAddIcon").removeClass("disabled");
        }
    }*/
    $(".add_icon").click(function(){
        //$("#phone",$("#Adddevice")).on("blur",onblur);
        addressInit($("#cmbProvince"),$("#cmbCity"),$("#cmbArea"));
        function addDevice()
        {
            Frame.oWidget.autoCheckForm($("#Adddevice"));
            if($(".text-error","#Adddevice")&&$(".text-error","#Adddevice").length>0){
                $(".text-error","#Adddevice").removeClass("text-error");
                $(".error","#Adddevice").hide();
            }
            $("input","#Adddevice").val("");
            $(".add_icon").attr("data-target","#foraddicon");
        };

        addDevice();
    });
     $("#add_device").click(function(){
        //$("#phone",$("#Adddevice")).on("blur",onblur);
        addressInit($("#cmbProvince"),$("#cmbCity"),$("#cmbArea"));
    });
    $("#buttonForAddIcon").bind("click", function(){
        if($(".text-error","#Adddevice")&&$(".text-error","#Adddevice").length>0){
            return false;
        }
        if($("#dev_sn").val().trim()==""){
            Frame.oWidget.setError($("#dev_sn"),"设备名称不能为空");
            return false;
        }else if($("#dev_sn").val().trim().indexOf(" ")!=-1){
            Frame.oWidget.setError($("#dev_sn"),"设备名称含有非法字符");
            return false;
        }else if(!(/(?!^\d+$)(?!^[a-zA-Z]+$)[0-9a-zA-Z]{4,32}/.test($("#dev_sn").val().trim()))){
            Frame.oWidget.setError($("#dev_sn"),"设备名称含有非法字符");
            return false;
        }
        if($("#homename").val().trim()==""){
            Frame.oWidget.setError($("#homename"),"场所名称不能为空");
            return false;
        }
        if($("#adddress").val().trim()==""){
            Frame.oWidget.setError($("#adddress"),"街道不能为空");
            return false;
        }
        if($("#dev_sn").val().trim()==""){
            Frame.oWidget.setError($("#phone"),"设备名称能为空");
            return false;
        }
        $.get("/v3/web/cas_session?refresh="+Math.random(), function(data){
            $.ajax({
                type: "POST",
                url: v2path+"/addDev",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify({
                    "user_name":data.attributes.name,
                    "dev_sn":$("#dev_sn").val().toLocaleUpperCase()
                }),
                success: function(data){
                    if((data.error_code == 0 && (data.error_message != null)) || data.error_code == 1)
                    {
                        Tips.info(data.error_message);
                    }
                    else{
                        addPlace();
                    }
                },
                error:  function(err){
                    // Tips.info("服务器内部错误");
                   // alert(JSON.stringify(err));
                }
            });
            function addPlace(){
                $.ajax({
                    type: "POST",
                    url: v2path+"/addPlace",
                   /* username: "security_super",
                    password: "lvzhou1-super",*/
                    dataType: "json",
                    contentType: "application/json",
                    data: JSON.stringify({
                        "user_name":data.attributes.name,
                        "dev_sn":$("#dev_sn").val(),
                        "province":$("#cmbProvince").val(),
                        "city":$("#cmbCity").val(),
                        "area":$("#cmbArea").val(),
                        "address":$("#adddress").val(),
                        "name":$("#homename").val(),
                        "phone":$("#phone").val()
                    }),
                    success: function(data){
                        if((data.error_code == 0 && (data.error_message != null)) || data.error_code == 1)
                        {
                            Tips.info(data.error_message);
                        }
                        else{
                            addregistuser();
                        }
                    },
                    error:  function(err){
                       //  Tips.info("服务器内部错误");
                    }
                });
            }
            function addregistuser(){
                $.ajax({
                    type: "POST",
                    url: v2path+"/registuser/add",
                    dataType: "json",
                    contentType: "application/json",
                    data: JSON.stringify({
                        "ownerName":data.attributes.name,
                        "userName":$("#dev_sn").val(),
                        "userPassword":$("#dev_sn").val(),
                        "passwordConform":$("#dev_sn").val(),
                        "storeName":$("#homename").val()
                    }),
                    success: function(data){
                        if((data.errorcode == 0 && (data.errormsg != "")) || data.error_code == 1)
                        {
                            Tips.info(data.error_message);
                        }
                        else{
                            $("#buttonForAddIconCancel").click();
                            Tips.info("配置成功");
                            cos.getUserName();
                            window.location ="/v3/web/frame/home";
                        }
                    },
                    error:  function(err){
                        // Tips.info("服务器内部错误");
                        //alert(JSON.stringify(err));
                    }
                });
            }
        });
    });

    var sTemplateAc = [
        '<div class="col-xs-6 app-colum [sn]" sn="[sn]">',
            '<div class="app-box no-bk-color">',
                '<div class="home-box-footer">',
                    '<span class="title [name1]">[shopname] [status]</span>',
                    '<div class="text-right link-container">',
                        '<a type="button" class="link-send active" href="[href]">',
                            '<span class="nav_manage">管理</span>',
                        '</a>',
                        // '<a type="button" class="link-send active">',
                        //     '<span class="nav_manage" id="modify">修改</span>',
                        // '</a>',
                    '</div>',
                '</div>',
                '<div class="box-body">',
                    '<div id="[sn]pie" class="home-left-pie"></div>',
                    '<div class="panel">',
                        '<div id=[sn]bar class="home-left-bar"></div>',
                        '<div class="home-right-nobar">',
                            '<span class="online_terminal">在线终端</span>',
                            '<span class="clientnum">loading</span>',
                        '</div>',
                    '</div>',
                    '<div class="panel_bottom">',
                        '<div class="speed">',
                            '<span class="up_speed">上行速率</span>',
                             '<span class="speedunit">Mbps</span>',
                            '<span class="speedup">loading</span>',  
                        '</div>',
                        '<div class="speed">',
                            '<span class="up_speed">下载速率</span>',
                            '<span class="speedunit">Mbps</span>',
                            '<span class="speeddown">loading</span>',
                        '</div>',
                        '<div class="oline">',
                            '<span class="up_speed">在线AP</span>',
                            '<span class="online">loading</span>',
                        '</div>',
                        '<div class="oline" style="border:none">',
                            '<span class="up_speed">离线AP</span>',
                            '<span class="offline">loading</span>',
                        '</div>',
                    '</div>',
                '</div>',
            '</div>',
        '</div>'
    ].join('');

    $.ajaxSetup({type: "GET", dataType: "json", timeout:3000})

    var cos = {
        username : '',
        getUserName : function(){
            $.get("/v3/web/cas_session?refresh="+Math.random(), function(data){
                cos.username = data.attributes.name;
                $("#username").empty().text(data.user);
                function onLogout()
                {
                    $.cookie("current_menu","")
                    window.location ="/v3/logout";
                    return false;
                }


            function onItemClick(e)
            {
                var sIndex = $(this).attr("index");
                var pfMap = [onLogout,updatePassword,addDevice];
                pfMap[sIndex]();

            };
            function updatePassword(e)
            {
                Frame.oWidget.autoCheckForm($("#changepassword_form"));
                if($(".text-error","#changepassword_form")&&$(".text-error","#changepassword_form").length>0){
                    $(".text-error","#changepassword_form").removeClass("text-error");
                    $(".error","#changepassword_form").hide();
                }
                $("input","#changepassword_form").val("");
                $("input[type=text]","#changepassword_form").hide();
                $("input[type=password]","#changepassword_form").show();
                $(".icon_eye","#changepassword_form").removeClass("show_word");
                $("#password_label").attr("data-target","#myModal");
            };
           function addDevice(e)
           {
               Frame.oWidget.autoCheckForm($("#Adddevice"));
               if($(".text-error","#Adddevice")&&$(".text-error","#Adddevice").length>0){
                   $(".text-error","#Adddevice").removeClass("text-error");
                   $(".error","#Adddevice").hide();
               }
               $("input","#Adddevice").val("");
               $("#add_device").attr("data-target","#foraddicon");
           };
           function onCalcel(e)
           {
               $(this).attr("data-dismiss","modal");
           };

            function toggleUserMenu(e)
            {
                function show()
                {
                    jMenu.slideDown(200);
                    $('body').on('click.usermenu',hide);
                }
                function hide()
                {
                    jMenu.slideUp(200);
                    jMenu.prev().removeClass("active");
                    $('body').off('click.usermenu');
                }

                var jMenu = $("#drop_list");
                $(this).toggleClass('active');
                jMenu.is(':visible') ? hide() : show();

                e.stopPropagation();
            }

            function initUser()
            {
                $("#user_menu").unbind('click').bind('click',toggleUserMenu);

             /*   if(!$.cookie("JSESSIONID")||$.cookie("JSESSIONID")==""){
                    alert("测试中cookie的Value,不要提单"+$.cookie("JSESSIONID"));
                    console.log(new Date()+$.cookie("JSESSIONID"));
                }*/
                var chat = $("#chat_html").xiaoBeiChat({xiaobeiPath:"../chat/cn/chat.html",sessionId:$.cookie("JSESSIONID")})
                chat.bind("newMsg",function(e, data){
                    if(data){
                       $("#chat_html").removeClass();
                       $("#chat_html").addClass("message_icon_get");
                   }else{
                        $("#chat_html").removeClass();
                       $("#chat_html").addClass("message_icon");
                   }
                })
                chat.bind("chatHeadImg",function(e, data){
                    if(data){
                        //  设置自己的头像
                        $("#headerimg").attr("src", data);
                   }
                })


                $("#drop_list").off('click').on('click','li',onItemClick);
               /* $("#add_device").off('click').on('click',addDevice);*/
                $("#close,#buttonForAddIconCancel").off('click').on('click',onCalcel);
                $("#add_forum").on('click',function(){
                    window.open("http://bbswlan.h3c.com/forum.php?mod=forumdisplay&fid=58");
                })
            }
            initUser();
            cos.getAcList();
            });
            getPolice();
        },
        getAcList : function(){
            $.ajax({
                url: v2path+"/getDevStatus",
                type: "POST",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify({"tenant_name": cos.username, "dev_snlist":[]}),
                success: function(data){
                    if(cos.username=="demouser"){
                        var a = data.dev_statuslist;
                        var xxBei ={
                            dev_name:"H3C WAC360",
                            dev_sn:"SSSSSS777777777DDEE",
                            dev_status:"0"
                        }
                        a.push(xxBei);
                        var HAc ={
                            dev_name:"H3C WAC360",
                            dev_sn:"SSSSSS6666666DDEE",
                            dev_status:"0"
                        }
                        a.push(HAc);
                        var  n = a.length - 1;
                    }else{
                        var a = data.dev_statuslist, n = a.length - 1;
                    }
                    var XbeiACModel = ["H3C WAC350","H3C WAC360","H3C WAC360V2","H3C WAC361V2","H3C WAC365"];
                    var XXbeiACModel = ["WAP422","WAP422S"];
                    $.ajax({
                        url: v2path+"/getDeviceInfo",
                        type: "post",
                        contentType: "application/json",
                        data: JSON.stringify({
                            tenant_name: cos.username,
                            dev_snlist: []
                        }),
                        success: function(data){
                            var dev_list = data.dev_list;
                            if(cos.username=="demouser"){
                                var xxBei ={
                                    shop_name:"小小贝设备",
                                    dev_sn:"SSSSSS777777777DDEE",
                                    dev_model:"WAP422",
                                    type:"1"
                                }
                                dev_list.push(xxBei);
                                var HAc ={
                                    shop_name:"行业AC设备",
                                    dev_sn:"SSSSSS6666666DDEE",
                                    dev_model:"H3C WX5510E",
                                    type:"2"
                                }
                                dev_list.push(HAc);
                            }
                            var list = {};
                            var indexList = {};
                            var new_AcList = [];
                            a.forEach(function(aDev){
                                dev_list.forEach(function(acDev){
                                    if(acDev.dev_sn ==  aDev.dev_sn){
                                        $.extend(acDev,aDev);
                                        if(acDev.shop_name){
                                            new_AcList.push(acDev);
                                        }
                                    }
                                })
                            });
                            new_AcList.forEach(function(dev){
                                    list[dev.dev_sn] = dev.shop_name;
                                    if(!dev.dev_model||dev.dev_model==""||dev.dev_model=="--"){
                                        indexList[dev.dev_sn]="#";
                                    }else{
                                        if(cos.username=="demouser"){
                                            if(dev.type&&dev.type=="1"){
                                                indexList[dev.dev_sn] = "miniBeiIndex.html?model=1&sn="+dev.dev_sn;
                                            }else if(dev.type&&dev.type=="2"){
                                                indexList[dev.dev_sn] = "businessAcIndex.html?model=2&sn="+dev.dev_sn;
                                            }else{
                                                indexList[dev.dev_sn] = "index.html?model=0&sn="+dev.dev_sn;
                                            }
                                        }else{
                                            if(dev.dev_model&&$.inArray(dev.dev_model.toUpperCase(),XbeiACModel)!= -1){
                                                indexList[dev.dev_sn] = "index.html?model=0&sn="+dev.dev_sn;
                                            }else if(dev.dev_model&&$.inArray(dev.dev_model.toUpperCase(),XXbeiACModel)!= -1){
                                                indexList[dev.dev_sn] = "miniBeiIndex.html?model=1&sn="+dev.dev_sn;
                                            }else{
                                                indexList[dev.dev_sn] = "businessAcIndex.html?model=2&sn="+dev.dev_sn;
                                            }
                                        }
                                    }
                            })
                            $('#aclist').html($.map(new_AcList, function(v, i){
                                var name = v.dev_name,sn = v.dev_sn;
                                if(indexList[sn]=="#"){
                                    var status = "（未知设备）";
                                }else{
                                    var status = v.dev_status == 1?"":"(离线)";
                                }
                                s = sTemplateAc
                                        .replace(/\[name\]/g, name)
                                        .replace(/\[href\]/g, indexList[sn])
                                        .replace(/\[sn\]/g, sn)
                                        .replace(/\[shopname\]/, (list[sn] == null ? sn:list[sn]))
                                        .replace(/\[status\]/g, status),
                                sHtml = [
                                            !(i%2)?'<div class="home-page-row">':'', s,  
                                            ((i%2)||(i == n))?'</div>':''
                                        ].join('');
                            $("#station").append('<option value="[sn]">场所[i]</option>'.replace(/\[sn\]/g, sn).replace(/\[i\]/g, i+1));
                              // if(v.dev_status == 1){
                                   $.ajax({
                                       url: "/v3/health/home/health?acSN=" + sn,
                                       type: "get",
                                       contentType: "application/json",
                                       dataType: "json",
                                       success: function(data){
                                           addEchars1(sn+"pie",JSON.parse(data).finalscore,v.dev_status);
                                       }
                                   })
                                   //历史终端信息列表
                                   var endTime = DataFormat.toYearString(new Date(),1,true);
                                   var startTime = DataFormat.toYearString(new Date(),4,false);
                                   $.ajax({
                                       url: "/v3/stamonitor/web/histolclient",
                                       type: "get",
                                       contentType: "application/json",
                                       dataType: "json",
                                       data:{
                                           devSN:sn,
                                           startTime:startTime,
                                           endTime:endTime
                                       },
                                       success: function(data){
                                           if(data.OnLineClientList) {
                                               var newHoursData=getHoursStationList(data.OnLineClientList);
                                               var nineOnLineClientData = newHoursData.sort(function (a, b) {
                                                   return new Date(b.updateTime).getTime() - new Date(a.updateTime).getTime()
                                               }).slice(0, 12);
                                               var stationNum = [];
                                               var stationTime = [];

                                               nineOnLineClientData.sort(function(a,b){
                                                   return new Date(a.updateTime).getTime() - new Date(b.updateTime).getTime()
                                               })
                                               $.each(nineOnLineClientData, function (key, value) {
                                                   stationNum.push(value.clientcount);
                                                   stationTime.push(value.updateTime);
                                               })
                                               addEchars2(sn + "bar",stationNum,stationTime);
                                           }else{
                                               addEchars2(sn + "bar",null,[]);
                                           }

                                       },
                                       error:function(err){

                                       }
                                   })
                                   //addEchars2((sn+"bar"));
                                   cos.getAcInfo(sn);
                                   return sHtml;
                              /* }
                               else{
                                   //健康度
                                   addEchars1(sn+"pie",0);
                                   //历史终端数柱状
                                   addEchars2(sn + "bar");
                                   //更新速率
                                   $("." + sn + " .speeddown").html("0.00");
                                   $("." + sn + " .speedup").html("0.00");
                                   //ap数
                                   $("." + sn + " .online").html("0");
                                   $("." + sn + " .offline").html("0");
                                   //更新终端数
                                   $("." + sn + " .clientnum").html("0");
                                //   cos.getAcInfo(sn);
                                   return sHtml;
                               }*/

                            }).join(''));
                        },
                        error: function(){
                            $('#aclist').html($.map(a, function(v, i){
                            var name = v.dev_name,
                                sn = v.dev_sn,
                                status = v.dev_status == 1?"":"(离线)",
                                s = sTemplateAc
                                        .replace(/\[name\]/g, name)
                                        .replace(/\[sn\]/g, sn)
                                        .replace(/\[shopname\]/, sn)
                                        .replace(/\[status\]/g, status),
                                sHtml = [
                                            !(i%2)?'<div class="home-page-row">':'', s,  
                                            ((i%2)||(i == n))?'</div>':''
                                        ].join('');
                            $("#station").append('<option value="[sn]">场所[i]</option>'.replace(/\[sn\]/g, sn).replace(/\[i\]/g, i+1));
                            //健康度饼图
                                $.ajax({
                                    url: "/v3/health/home/health?acSN=" + sn,
                                    type: "get",
                                    contentType: "application/json",
                                    dataType: "json",
                                    success: function(data){
                                        addEchars1(sn+"pie",JSON.parse(data).finalscore,2);
                                    }
                                });
                                //历史终端信息列表
                                //历史终端信息列表
                                var endTime = DataFormat.toYearString(new Date(),1,true);
                                var startTime = DataFormat.toYearString(new Date(),4,false);
                                $.ajax({
                                    url: "/v3/stamonitor/web/histolclient",
                                    type: "get",
                                    contentType: "application/json",
                                    dataType: "json",
                                    data:{
                                        devSN:sn,
                                        startTime:startTime,
                                        endTime:endTime
                                    },
                                    success: function(data){
                                        if(data.OnLineClientList) {
                                            var nineOnLineClientData = data.OnLineClientList.sort(function (a, b) {
                                                return new Date(b.updateTime).getTime() - new Date(a.updateTime).getTime()
                                            }).slice(0, 9);
                                            var stationNum = [];
                                            nineOnLineClientData.sort(function(a,b){
                                                return new Date(a.updateTime).getTime() - new Date(b.updateTime).getTime()
                                            })
                                            $.each(nineOnLineClientData, function (key, value) {
                                                stationNum.push(value.clientcount);
                                            })
                                            addEchars2(sn + "bar",stationNum);
                                        }else{
                                            addEchars2(sn + "bar");
                                        }

                                    },
                                    error:function(err){

                                    }
                                })
                              //  addEchars2((sn+"bar"));
                            cos.getAcInfo(sn);
                            return sHtml;
                            }).join(''));
                        }
                    })
                    
                    setTimeout(function(){
                        $("#station").bind("change",function(){
                            var sn= $("#station option:selected").attr("value");
                            window.location="/v3/web/frame/index.html?sn=" + sn;
                        });
                    }, 0);
                }
            });
        },
        getAcInfo : function(sn){
            $.ajax({
                url: "/v3/devmonitor/web/wanspeed?devSN=" + sn,
                success: function(data){
                    var speed_down = 0;
                    var speed_up = 0;
                    data["wan_speed"].forEach(function(wan){
                        speed_down += wan["speed_down"]/1024;
                        speed_up += wan["speed_up"]/1024;
                    });
                    $("." + sn + " .speeddown").html( speed_down.toFixed(2));
                    $("." + sn + " .speedup").html(speed_up.toFixed(2));
                },
                error: function(xhr,status,statusText){
                    $("." + sn + " .speeddown").html("0.00");
                    $("." + sn + " .speedup").html("0.00");
                }
            });
            $.ajax({
                url: "/v3/apmonitor/web/apstatistic?devSN=" + sn,
                success: function(data){
                    var ap_statistic = data.ap_statistic;
                    $("." + sn + " .online").html(ap_statistic.online);
                    $("." + sn + " .offline").html(ap_statistic.offline);
                },
                error: function(xhr,status,statusText){
                    $("." + sn + " .online").html("0");
                    $("." + sn + " .offline").html("0");
                }
            });
            $.ajax({
                url: "/v3/stamonitor/web/clientcount?devSN=" + sn,
                success: function(data){
                    $("." + sn + " .clientnum").html(data.clientnum);
                },
                error: function(xhr,status,statusText){
                    $("." + sn + " .clientnum").html("0");
                }
            });
        },
        getClientCount:function(sn){
            
        }
    };
    cos.getUserName();
    return;

    var oAcList = [];
    function getHoursStationList(data){
        var newClientList=[];
        for(var i=0 ;i <data.length;i++){
            if(i%6==0) newClientList.push(data[i])
        }
        return newClientList;
    }
  /*  var stationList = [];
    function getStationNum(param){
        var currentTime ="";
        var beforeTime =""
        for(i = 0;i<9;i++){
            if(i == 0){
                var currentTimeStr = DataFormat.toSecondsString(new Date());
                 currentTime = DataFormat.getHourSeconds(currentTimeStr);
                 beforeTime=DataFormat.getHourSeconds(currentTimeStr,1);
            }else{
                currentTime = beforeTime;
                var beforeTimeStr = DataFormat.toSecondsString(new Date(beforeTime));
                beforeTime = DataFormat.getHourSeconds(beforeTimeStr,1);
            }
            if(beforeTime<DataFormat.getNineMiloSeconds(param.updateTime)&&DataFormat.getNineMiloSeconds(param.updateTime)<currentTime){
                stationList.push(param);
            }
        }
    }*/
    function addEchars2(id,data,dataTime){
        require.config({
            paths: {
                echarts: 'build/dist'
            }
        });
        var newData = [];
        var maxData = 5;
        var otherData = [];

        if(data.length>0){
            $.each(data,function(key,value){
                newData.push(value);
            });
            if(data.length>0){
                data.sort(function(a,b){
                    return b-a;
                })
                maxData = maxData+data[0];
            }
        }else{
            newData = [0,0,0,0,0,0,0,0,0,0,0,0];
        }
        if(dataTime.length<=0){
            dataTime = [" "," "," "," "," "," "," "," "," "," "," "," "]
        }
        $.each(newData,function(key,value){
            var otherNum = maxData-value;
            otherData.push(otherNum);
        })
        // 使用
        require(
            [
                'echarts',
                'echarts/chart/bar' // 使用柱状图就加载bar模块，按需加载
            ],
            function (ec) {
                var myChart = ec.init(document.getElementById(id));
                var option = {
                     tooltip: {
                        show:true,
                        trigger: 'axis',
                        axisPointer:{
                            type:'none'
                        },
                        formatter:function(params){
                            console.log(params);
                            var time="";
                            if(params[1].name == " "){
                                time= "0000/00/00</br>00:00:00";
                            }else{
                                var time1=DataFormat.formatOtherYearString(new Date(params[1].name));
                                var time2=DataFormat.formatOtherHoursString(new Date(params[1].name));
                                time = time1+"</br>"+time2;
                            }

                            return time+"</br>在线终端：</br>"+params[1].value;
                        }
                    },
                    grid: {borderWidth:0,x:50,y:30,y2:20,x2:10},
                    xAxis: [
                        {
                            type: 'category',
                            show: false,
                            data: dataTime//['Line', 'Bar', 'Scatter', 'K', 'Pie', 'Radar', 'Chord', 'Force','map']
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            show:false,
                            axisLine:{show:false}
                        }
                    ],
                    series: [
                        {
                            type: 'bar',
                            barWidth:7,
                            barCategoryGap:12,
                            stack:'sum',
                            itemStyle: {
                                normal: {
                                    color: "#4ec1b2",
                                    label: {show:false},
                                }
                            },
                            data: newData,//[12,21,10,4,12,5,6,5,9]
                        },
                        {
                            type: 'bar',
                            barWidth:7,
                            barCategoryGap:12,
                            stack:'sum',
                            itemStyle: {
                                normal: {
                                    color: "#f5f5f5",
                                    label: {show:false},
                                }
                            },
                            data:otherData,//[30-12,30-21,30-10,30-4,30-12,30-5,30-6,30-5,30-9]
                        }
                    ]
                };
                myChart.setOption(option);
            }
        );
    }
    
    function addEchars1(id, score,status){
        if(status == 1){
            score = score||0;
        }else{
            score = 100;
        }
        var myChart = echarts.init(document.getElementById(id));
    		var centerPieStyle = {
    			normal : {
    				color: '#343e4e',
    				label : {show : true,position : 'center'},
    				labelLine : {show : false}
    			},
                emphasis: {
                            label:{
                                show:true,
                                formatter:function(params){
                                    if(status == 1){
                                        return params.data.score;
                                    }else{
                                        return "离线";
                                    }
                                },
                                textStyle: (status == 1?{
                                    baseline: "middle",
                                    fontSize: "30",
                                    color: "#fff",
                                }:{
                                    baseline: "middle",
                                    fontSize: "20",
                                    color: "#fff",
                                })
                            }
                        }
    		};
    		var otherStyle = {
    			normal: {
    				color: "white",
    				labelLine: {show: false,}
    			}
    		}
    		var scoreStyle = {
    			normal: {
    				color: (status == 1?((score>=80?"#4ec1b2":(score>=60?"#fbceb1":"#fe808b"))):"#f5f5f5"),//"#fe808b",
    				labelLine: {show: false,}
    			}
    		}
    		var option = {
    			series : [
    				{
    					type: "pie",
    					radius: [0, 50],
    					max: 100,
    					itemStyle: {
    						normal: {
    							label: {
    								formatter: function(params){
                                        if(status == 1){
                                            return params.data.score;
                                        }else{
                                            return "离线";
                                        }
    								},
    								textStyle:(status == 1?{
    									baseline: "middle",
    									fontSize: "30",
    									color: "#fff",
    								}:{
                                        baseline: "middle",
                                        fontSize: "20",
                                        color: "#fff",
                                    })
    							}
    						}
    					},
    					data: [
    						{value: 100, score:score, itemStyle:centerPieStyle}
    					]
    				},
    				{
    					type: "pie",
    					radius: [50, 65],
    					max: 100,
    					clockWise: false,
    					data: [
    						{value: 100-score, itemStyle: otherStyle},
    						{value: score, itemStyle: scoreStyle}
    					]
    				}
    			]
    		}
    		myChart.setOption(option);
        }
    function getPolice()
    {
       $.ajax({
            url: "cn/place.json",
            type: "GET",
            dataType: "json",
            success: function(data){
                provinceList = data;
            },
            error:function(err,status){
                // Tips.info("服务器内部错误");
                //alert(err);
            }
       });
    }
    function addressInit(_cmbProvince, _cmbCity, _cmbArea, defaultProvince, defaultCity, defaultArea)
    {
        var cmbProvince = _cmbProvince;
        var cmbCity = _cmbCity;
        var cmbArea = _cmbArea;
        var Provincename = "";
        cmbProvince.find("option").remove();
        cmbCity.find("option").remove();
        cmbArea.find("option").remove();

        function cmbAddOption(cmb, str)
        {
            var option = document.createElement("OPTION");
            option.innerText = str;
            option.value = str;
            cmb.append(option);
        }

        function changeCity()
        {
            cmbArea.find("option").remove();
            var sProvince = $("#cmbProvince option",$("#Adddevice"))[0].value;
            var scity = this.value || $("#cmbCity option",$("#Adddevice"))[0].value;
            var item = provinceList[Provincename] || provinceList[sProvince];
            var oData = item.cityList[scity];
            for(var ele in oData)
            {
                cmbAddOption(cmbArea, oData[ele]);
            }
        }
        function changeProvince()
        {
            cmbCity.find("option").remove();
            cmbArea.find("option").remove();
            cmbCity.onchange = null;
            var item = provinceList[this.value] || provinceList[$("#cmbProvince option",$("#Adddevice"))[0].value];
            for(var ele in item.cityList){
                cmbAddOption(cmbCity, ele);
            }
            Provincename = this.value;
            changeCity();
            $("#cmbCity",$("#Adddevice")).on("change",changeCity);
        }

        for(var name in provinceList)
        {
            cmbAddOption(cmbProvince, name);
        }
        changeProvince();
        $("#cmbProvince",$("#Adddevice")).on("change",changeProvince);
    }


})

