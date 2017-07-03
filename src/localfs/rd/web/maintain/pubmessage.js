/**
 * Created by Administrator on 2016/5/23.
 */
(function($){

    var MODULE_BASE = "maintain";
    var MODULE_NAME = MODULE_BASE  + ".pubmessage";
    var g_title;
    var g_classs;

    function getRcText(sRcName){

       return Utils.Base.getRcString("ws_ssid_rc",sRcName);

    }

    function initGrid(){

        var opt_pubmessage = {
            colNames: getRcText ("pubmessage_header"),
            multiSelect: false,
            pageSize:5,
            colModel:[
                {name:'name', datatype:"String"},
                {name:'appId', datatype:"String"},
                {name:'appSecret', datatype:"String"},
                {name:'token', datatype:"String"}
            ]
        };

        $("#chatList").SList ("head", opt_pubmessage);

        var opt_bind = {
            colNames: getRcText ("bind"),
            multiSelect: false,
            columnChange:false,
            colModel:[
                {name:'name', datatype:"String"},
                {name:"account",datatype:"String"},
                {name:'time', datatype:"String"},
                {name:'push', datatype:"Integer"},
                {name:'pubmsg', datatype:"String"},
                {name:"action",datatype:"String",formatter:showSum}
            ],
            buttons:[
                {name:"edit",enable:false},
                {name:"delete",enable:false},
                {name:"add",enable:false},
                {name:"detail",enable:false},
                {name:"refresh",enable:false}
            ]
        };

        $("#bind_mlist").mlist('head',opt_bind);
    }

    function initData(){

        getBandData();
        //getPubMessage();

        var opt_data = [

        ];
        $("#chatList").SList("refresh",opt_data);
    }

    /*获取绑定关系mlist列表数据*/
    function getBandData(){

        $.ajax({
            url:MyConfig.path +'/wechatnotify/getallaccount',
            type:'POST',
            dataType:'json',
            Parameters:{

            },
            success:function(data){
                if( (data != null) && (data != undefined)){

                    drawBandMlsit(data);
                }
            },
            error:function(){

                Frame.Msg.error("数据获取异常，请联系客服");
            }
        })
    }

    /*解析绑定关系列表数据渲染到页面上*/
    function drawBandMlsit(data){

        var bandData = [];
        for( var i = 0; i < data.length; i++){
            bandData[i] = {};
            bandData[i].name = data[i].nickname;
            bandData[i].account = data[i].account;
            bandData[i].time = data[i].binding_time;
            bandData[i].push = data[i].send_count.toString();
            bandData[i].pubmsg = data[i].official_account;
            bandData[i].action = "去绑定";
        }
        $("#bind_mlist").mlist("refresh",bandData);
    }

    /*获取微信公众号列表数据*/
    function getPubMessage(){

        $.ajax({
            url:MyConfig.path +'/webchatnotify/',
            type:'POST',
            dataType:'json',
            Parameters:{

            },
            success:function(data){

            },
            error:function(){

            }
        })
    }

    /*解析微信公众号列表数据渲染到页面上*/
    function drawPubMessageSlist(){

    }


    function showSum(row,cell,value,columnDef,dataContext,type){

        if(!value)
        {
            return "";
        }
        if((value == "") || (type == "text"))
        {
            return value;
        }
        switch(cell)
        {
            case 5:
            {
                return "<a class='show-sum' type='0' nickname="+ dataContext["name"] +" account="+dataContext["account"]+" official_account="+dataContext["pubmsg"]+">" + dataContext["action"]  + "</a>";
                break;
            }
            default:
                break;
        }
    }

    function onShowSums(){
      var jThis = $(this);
      var nickname = jThis.attr("nickname");
      var account = jThis.attr("account");
      var official_account = jThis.attr("official_account");

      Frame.Msg.confirm("确定取消绑定关系？",function(){
          $.ajax({
              url:MyConfig.path + '/wechatnotify/setunbind',
              type:'POST',
              dataType:'json',
              data:{
                  official_account:official_account,
                  nickname:nickname,
                  account:account
              },
              success:function(data){

                  if(data[retCode] == 0){
                      Frame.Msg.info("设置成功");
                  }
              },
              error:function(){
                  Frame.Msg.error("操作失败,请联系客服");
              }
          })
      })
    }

    function initForm(){

        /*微信公众号列表操作*/
        $("#chatList").on("click",'.slist-cell',function(){
            var jThis = $(this);
            var title = jThis.attr('title');
            var classs = jThis.attr("class");
            /*
            TODO 后续优化处理，此方式不太靠谱，不能精确获取该字段的值
            */
            g_title = title;
            g_classs = classs;
        });

        /*绑定关系列表操作*/
        $("#bind_mlist").on('click','.show-sum',onShowSums);

        /*添加按钮操作*/
        $("#add").on("click",function(){
            var jDlg = $("#chatToggle");
            var jScope = {scope:jDlg,className:'modal-super'};

            Utils.Base.openDlg(null,{},jScope);

        });

        /*将添加的微信数据信息发送到后台进行存储*/
        $("#success").on("click",function(){

            /*获取form表单中填写的值*/
            //TODO 获取输入框中的各个字段，post请求发送到后台

            Frame.Msg.alert("正在开发中....");
            /*
            $.ajax({
                url:MyConfig.path + '/wechatnotify/addaccount',
                type:'POST',
                dataType:'json',
                Parameter:{

                },
                success:function(data){

                },
                error:function(){

                }
            })
            */
        });


        /*删除按钮操作*/
        $("#delete").on("click",function(){

            if( (g_classs == null) && ( g_title == null)){
                Frame.Msg.alert("请选择要删除的行");
                return;
            }

            var classs = g_classs.split(" ")[1];
            var value = g_title;
            var column;
            switch(classs)
            {
                case "sl0":
                {
                    column = "公众号名称";
                    break;
                }
                case "sl1":
                {
                    column = "AppID";
                    break;
                }
                case "sl2":
                {
                    column = "AppSECRET";
                    break;
                }
                case "sl3":
                {
                    column = "TOKEN";
                    break;
                }
                default:
                    break;
            }
            Frame.Msg.confirm("确定删除"+ column +"是"+ value +"的行吗？",function(){

                //TODO 将需要删除的值发送给后台
                $.ajax({
                    url:MyConfig.path + '/wechatnotify/',
                    type:'POST',
                    dataType:'json',
                    Parameter:{

                    },
                    success:function(data){

                    },
                    error:function(){

                    }
                })
            })
        });

        /*导出按钮操作*/
        $("#outport").on("click",function(){

            if( g_classs == null){
                Frame.Msg.alert("请选择需要导出的公众号");
                return;
            }
            var classs = g_classs.split(" ")[1];

            if( classs != "sl0"){
                Frame.Msg.alert("请选择需要导出的公众号");
                return;
            }

            var account = g_title;

            Frame.Msg.confirm("确定导出公众号是"+account+"所绑定的用户？",function(){
                $.ajax({
                    url:MyConfig.path +'/wechatnotify/getnicknamebyaccount',
                    type:'POST',
                    dataType:'json',
                    Parameters:{
                        account:account
                    },
                    success:function(data){
                        analyseNickName(data);
                    },
                    error:function(){
                        Frame.Msg.error("导出失败");
                    }
                })
            })
        });

        /*解析需要导出的微信用户*/
        function analyseNickName(data){

            var nickname = new Array();
            for(var i = 0; i < data.length ;i++){
                nickname.push(data[i].nickname);
            }
            Frame.Msg.alert(nickname);

            //TODO 后续如何显示导出的微信用户
        }
    }


    function _init(){

        initGrid();
        initData();
        initForm();

    }

    function _destroy(){

    }

    Utils.Pages.regModule(MODULE_NAME,{
        "init": _init,
        "destroy": _destroy,
        "widgets": ["SList","Mlist"],
        "utils": ["Base"]
    })

})(jQuery);