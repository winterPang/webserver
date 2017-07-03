;(function ($) {
    var MODULE_BASE = "a_monitor";
    var MODULE_NAME = MODULE_BASE + ".device";
    var g_oTimer = false;
    var oInfor = {};
    var onlinedata= null;

    function getRcText (sRcName)
    {
        return Utils.Base.getRcString("device_rc",sRcName);
    }

    function initForm ()
    {

        $("#fliterId").on("click",function(){
            $(".top-box").toggle();
        });
        $(".selectArea[name=Score]").attr("style","display:inline-block");
        $("input[name=Type]").change(function(){
            $(".inputArea").val("");      
            $(".inputArea").css("border","1px solid #e7e7e9");
            $(".time-zone .form-actions").css("display","none");
            $("#deviceList").SList("refresh",onlinedata);

           if($("#Score").attr("checked")){
              $(".selectArea[name=Score]").attr("style","display:inline-block");
              $(".selectArea[name=APCount]").attr("style","display:none");
              $(".selectArea[name=UserCount]").attr("style","display:none");
               $("#ScoreEnd").on("focus",function(){
                   $(".inputArea[name=ScoreType]").css("border","1px solid #e7e7e9");                
               });
               $("#ScoreStart").on("focus",function(){
                  $(".inputArea[name=ScoreType]").css("border","1px solid #e7e7e9");   
               });
           }else if($("#APCount").attr("checked")){
              $(".selectArea[name=APCount]").attr("style","display:inline-block");
               $(".selectArea[name=Score]").attr("style","display:none");
               $(".selectArea[name=UserCount]").attr("style","display:none");
               $("#APCountEnd").on("focus",function(){
                  $(".inputArea[name=ScoreType]").css("border","1px solid #e7e7e9");  
               });
               $("#APCountStart").on("focus",function(){
                  $(".inputArea[name=ScoreType]").css("border","1px solid #e7e7e9");  
               });
           }else if($("#UserCount").attr("checked")){
               $(".selectArea[name=UserCount]").attr("style","display:inline-block");
               $(".selectArea[name=Score]").attr("style","display:none");
               $(".selectArea[name=APCount]").attr("style","display:none");
               $("#UserCountEnd").on("focus",function(){
                  $(".inputArea[name=ScoreType]").css("border","1px solid #e7e7e9");  
               });
               $("#UserCountStart").on("focus",function(){
                   $(".inputArea[name=ScoreType]").css("border","1px solid #e7e7e9");  
               });
           }
        });

        $(".inputArea").on("change",function(){
            $(".time-zone .form-actions").css("display","block");
        });

        function submitSelect(){
            var APCount = $("#APCount").MCheckbox("getState");
            var ScoreCount = $("#Score").MCheckbox("getState");
            var UserCount = $("#UserCount").MCheckbox("getState");
            var fliter = [];
            if(APCount) {
                var start = parseInt($("#APCountStart").val());
                var end = parseInt($("#APCountEnd").val());
                if (end < start) {
                    $("#APCountStart").css("border", "1px solid red");
                    $("#APCountEnd").css("border", "1px solid red");
                    return;
                }
                $.each(onlinedata, function (index, item) {
                    if (onlinedata[index].apcount >= start && onlinedata[index].apcount < end) {
                        fliter.push(item);
                    }
                });
            }else if(ScoreCount){
                var fliter = [];
                var start = parseInt($("#ScoreStart").val());
                var end = parseInt($("#ScoreEnd").val());
                if(end < start){
                    $("#ScoreStart").css("border","1px solid red");
                    $("#ScoreEnd").css("border","1px solid red");
                    return;
                }
                $.each(onlinedata,function(index,item){
                    if(onlinedata[index].score>=start && onlinedata[index].score<end){
                        fliter.push(item);
                    }
                });
            }else if(UserCount){
                var fliter = [];
                var start = parseInt($("#UserCountStart").val());
                var end = parseInt($("#UserCountEnd").val());
                if(end < start){
                    $("#APCountStart").css("border","1px solid red");
                    $("#APCountEnd").css("border","1px solid red");
                    return;
                }
                $.each(onlinedata,function(index,item){
                    if(onlinedata[index].usercount>=start && onlinedata[index].usercount<end){
                        fliter.push(item);
                    }
                });

            }
            $("#deviceList").SList("refresh", fliter);
        }

        $(".time-zone .form-actions .icon-ok").on("click", submitSelect);
        $(".time-zone .form-actions .btn-apply").on("click", submitSelect);

        function onCancel(){
            $(".top-box").toggle();
            $(".inputArea").val("");
        }
        $(".time-zone .form-actions .icon-remove").on("click", onCancel);
        $(".time-zone .form-actions .btn-cancel").on("click", onCancel);

        $("#ScoreEnd").on("change",function(){
            $(".time-zone .form-actions").css("display","block");
            $("#ScoreEnd").on("focus",function(){
                $(".inputArea[name=ScoreType]").css("border","1px solid #e7e7e9");  
            });
            $("#ScoreStart").on("focus",function(){
               $(".inputArea[name=ScoreType]").css("border","1px solid #e7e7e9");  
            });
        });
        $("#ScoreStart").on("change",function(){
            $(".time-zone .form-actions").css("display","block");
            $("#ScoreEnd").on("focus",function(){
                 $(".inputArea[name=ScoreType]").css("border","1px solid #e7e7e9");  
            });
            $("#ScoreStart").on("focus",function(){
                $(".inputArea[name=ScoreType]").css("border","1px solid #e7e7e9");  
            });
        });

        $("#APCountEnd").on("change",function(){
            $(".time-zone .form-actions").css("display","block");
            $("#APCountStart").on("focus",function(){
                $(".inputArea[name=ScoreType]").css("border","1px solid #e7e7e9");  
            });
            $("#APCountEnd").on("focus",function(){
               $(".inputArea[name=ScoreType]").css("border","1px solid #e7e7e9");  
            });
        });
        $("#APCountStart").on("change",function(){
            $("#APCountStart").on("focus",function(){
                $(".inputArea[name=ScoreType]").css("border","1px solid #e7e7e9");  
            });
            $("#APCountEnd").on("focus",function(){
               $(".inputArea[name=ScoreType]").css("border","1px solid #e7e7e9");  
            });
        });
        $("#UserCountStart").on("change",function(){
            $("#UserCountEnd").on("focus",function(){
                $(".inputArea[name=ScoreType]").css("border","1px solid #e7e7e9");  
            });
            $("#UserCountStart").on("focus",function(){
               $(".inputArea[name=ScoreType]").css("border","1px solid #e7e7e9");     
            });
        });
        $("#UserCountEnd").on("change",function(){
            $("#UserCountEnd").on("focus",function(){
               $(".inputArea[name=ScoreType]").css("border","1px solid #e7e7e9");  
            });
            $("#UserCountStart").on("focus",function(){
                $(".inputArea[name=ScoreType]").css("border","1px solid #e7e7e9");  
            });
        });

        $("#APCountStart").on("blur",function(){
            $("#APCountEnd").on("blur",function(){
                var start = parseInt($("#APCountStart").val());
                var end = parseInt($("#APCountEnd").val());
                if(end < start){
                    $("#APCountStart").css("border","1px solid red");
                    $("#APCountEnd").css("border","1px solid red");
                    return;
                }

            });

        });

        $("#APCountEnd").on("blur",function(){
            $("#APCountStart").on("blur",function(){
                var start = parseInt($("#APCountStart").val());
                var end = parseInt($("#APCountEnd").val());
                if(end < start){
                    $("#APCountStart").css("border","1px solid red");
                    $("#APCountEnd").css("border","1px solid red");
                    return;
                }
           });

        });

        $("#ScoreStart").on("blur",function(){
            $("#ScoreEnd").on("blur",function(){
                var start = parseInt($("#ScoreStart").val());
                var end = parseInt($("#ScoreEnd").val());
                if(end < start){
                    $("#ScoreStart").css("border","1px solid red");
                    $("#ScoreEnd").css("border","1px solid red");
                    return;
                }

            });
        });
        $("#ScoreEnd").on("blur",function(){
            $("#ScoreStart").on("blur",function(){
                var start = parseInt($("#ScoreStart").val());
                var end = parseInt($("#ScoreEnd").val());
                if(end < start){
                    $("#ScoreStart").css("border","1px solid red");
                    $("#ScoreEnd").css("border","1px solid red");
                    return;
                }
            });
        });


        $("#UserCountStart").on("blur",function(){
            $("#UserCountEnd").on("blur",function(){
                var start = parseInt($("#UserCountStart").val());
                var end = parseInt($("#UserCountEnd").val());
                if(end < start){
                    $("#APCountStart").css("border","1px solid red");
                    $("#APCountEnd").css("border","1px solid red");
                    return;
                }

            });
        });

        $("#UserCountEnd").on("blur",function(){
            $("#UserCountStart").on("blur",function(){
                var start = parseInt($("#UserCountStart").val());
                var end = parseInt($("#UserCountEnd").val());
                if(end < start){
                    $("#APCountStart").css("border","1px solid red");
                    $("#APCountEnd").css("border","1px solid red");
                    return;
                }

            });
        });
    }

    function ChangeDevInfo(row, cell, value, columnDef, dataContext, type)
    {
        value = value ||"";
        if("text" == type)
        {
            return value;
        }
        switch(cell) {
            case 1 :
            {
                var titletest = getRcText("DEV_STATUS").split(',')[0];
                if(dataContext["status"] =="0")
                {
                   titletest = getRcText("DEV_STATUS").split(',')[2];
                    return "<p class='float-left' type='0'>"+dataContext["devname"]+"</p><p title='"+titletest+"' class='index_icon_count index_icon_offline'></p>";
                    //return dataContext["Name"];
                }else if(dataContext["status"] =="1"){
                    titletest = getRcText("DEV_STATUS").split(',')[1];
                    return "<p class='float-left' type='0'>"+dataContext["devname"]+"</p><p title='' class='index_icon_count index_icon_online'></p>";
                }
                return "<p class='float-left' type='0'></p><p title='' class='index_icon_count'></p>";
                break;

            }
            case 8:
            {
                var color = (value > 80) ? "#4ec1b2" : (value > 60 ? "#fbceb1" : "#fe808b");

                return '<a style="color:' + color + ';" cell="' + cell + '">' + value + '</a>';
                break;
            }
            default:
                break;
        }
        return false;

    }


    function initGrid()
    {

        //初始化在线/离线设备列表
        function showDetail()
        {
            //Utils.Base.redirect({ np:"b_deviceinfo.summary"});
            //h_dashboard.summary
            Utils.Base.redirect({ np:"b_deviceinfo.summary"});
            return false;
        }
        var opt = {
            colNames: getRcText ("DEVICE_LIST"),
            showHeader: true,
            multiSelect: false,
            showOperation:true,
            //pageSize:5,
            colModel: [
                {name:'themename', datatype:"String",width:200},
                {name:'devname', datatype:"String",formatter:ChangeDevInfo,width:200}, //设备名
                {name:'devsn', datatype:"String",width:200},//SN
                {name:'devgroup',datatype:"String",width:200},//设备组
                {name:'devlocation',datatype:"String",width:200},//位置
                {name:'apcount',datatype:"String",width:200},//ap数
                {name:'usercount',datatype:"String",width:200},//用户数
                {name:'onlinetime', datatype:"String",width:200},//在线时长
                {name:'score', datatype:"String",formatter:ChangeDevInfo,width:200}//评分
            ],
            buttons:[
                {name: "detail", action:showDetail}
            ]
        };
        $("#deviceList").SList("head",opt);
    }

    function initData()
    {
        onlinedata =[
            {"themename":"theme1","devname":"abcs","devsn":"sn2324","devgroup":"2","devlocation":"beijing","apcount":"34","usercount":"12","onlinetime":"11:00-12:00","score":"79","status":"1"},
            {"themename":"theme2","devname":"abs","devsn":"sn2324","devgroup":"2","devlocation":"beijing","apcount":"4","usercount":"23","onlinetime":"11:00-12:00","score":"13","status":"0"},
            {"themename":"theme3","devname":"acs","devsn":"sn2324","devgroup":"2","devlocation":"beijing","apcount":"134","usercount":"123","onlinetime":"11:00-12:00","score":"69","status":"0"},
            {"themename":"theme4","devname":"as","devsn":"sn2324","devgroup":"2","devlocation":"beijing","apcount":"5","usercount":"230","onlinetime":"11:00-12:00","score":"90","status":"1"}

        ];
        $("#deviceList").SList("refresh",onlinedata);
    }

    function _init ()
    {
        initGrid();
        initForm();
        initData();

    }

    function _destroy ()
    {
    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init,
        "destroy": _destroy,
        "widgets": ["SList","Minput"],
        "utils":["Request","Base"]
    });
})( jQuery );

