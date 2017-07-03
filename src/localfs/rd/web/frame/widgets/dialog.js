/*******************************************************************************
 Copyright (c) 2007, Hangzhou H3C Technologies Co., Ltd. All rights reserved.
--------------------------------------------------------------------------------
@FileName:libs/frame/dialog.js
@ProjectCode: Comware v7
@ModuleName: Frame.Dialog
@DateCreated: 2011-06-24
@Author: huangdongxiao 02807
@Description: 
    对话框的相关接口,包括FORM, 向导和提示信息的显示, 和按钮的disable/enable.
    提供的类有:
    Frame.Dialog
    Frame.Msg
    Frame.Button
@Modification:
*******************************************************************************/

;(function($F)
{

/*****************************************************************************
@typedef: DialogOption
@DateCreated: 2011-06-24
@Author: huangdongxiao 02807
@Description: 显示对话框时，传递给对话框的参数
@fields:
* title - string, 对话框标题，默认标题为“MessageBox”
* width - integer,对话框的宽度，默认宽度为400, 可以在MyConfig中进行配置
* height - integer,对话框的高度，默认高度为300, 可以在MyConfig中进行配置
* resizable - boolean, 是否可以改变对话框的大小，默认值为false
* html - string, 对话框中显示的HTML字符串。
* buttons - string, 对话框按钮, 缺省没有按钮。支持按钮在 
    <a href="../../frame/cn/locale.js.html#JQuery.MyLocale.Buttons">MyLocale.Buttons</a>
    中定义, 多个按钮请使用"|"连接起来, 如"OK|CANCEL"
* beforeclose - Function, 关闭对话框前的检查函数，可以在该函数中做关闭前的处理
    <li>函数原型：boolean function onBeforeClose(sButton)
    <li>参数：sButton, String, 在buttons参数中指定的按钮名称，如OK, Cancel
    <li>返回值：true - 允许关闭对话框；否则不允许关闭对话框;
* onClosed - Function, 关闭对话框后调用。如果beforeclose返回了true，则会进入该函数做关闭后的处理
* closeOnEscape - boolean, 是否允许ESC键关闭对话框，默认值为true;
@Modification:
    * yyyy-mm-dd: Author, add or modify something
    * 2011-07-27: 黄东晓, 增加closeOnEscape属性
*******************************************************************************/
var DialogOption =
{
    title: "Dialog",
    //width: MyConfig.Dialog.DEFAULT.width,
    height: MyConfig.Dialog.DEFAULT.height,
    resizable: false,
    html: "",
    buttons: "",
    closeOnEscape: true,
    modal: true,

    onClosed: $.noop,
    beforeclose: $.noop
};

var ButtonIcon = {
    ADD:    "add",
    DEL:    "del",
    MDF:    "jmdf",
    SEARCH: "search",
    INSERT: "insert",
    STOP:   "stop",
    UP:     "up",
    DOWN:   "down",
    OK:     "apply",
    CANCEL: "cancel",
    CLOSE:  "close",
    RESET:  "reset",
    PRE:    "prev",
    NEXT:   "next",
    FINISH: "finish",
    SELECTALL:"selall",
    SELECTNONE:"selnone"
}

/*****************************************************************************
@FuncName: private, _dialog
@DateCreated: 2011-06-24
@Author: huangdongxiao 02807
@Description: 显示对话框
@Usage: usage中可以描述对函数的使用的代码样例。如果没有可以不写
    var sId = "mydlg";
    oDlg = _dialog(sId, {
        title: "Form",
        resizable: true,
        width: 600,
        height: 480,
        buttons: "OK|CANCEL",
        html: "<form>Your name:<input id='yourname'></form>",
        beforeclose: function(){return true;}
    });
@ParaIn: 
    * sId - string, 对话框在页面中的ID。
    * option - DialogOption, 对话框的选项。
@Return: Dialog对象,在回调函数中可以调用close关闭对话框.
@Caution: 
@Modification:
    * yyyy-mm-dd: Author, add or modify something
*****************************************************************************/
function _dialog(sId, opt)
{
    var _sClickedButton = null;
    var _bClosed = false;

    if(Msg.disabled)
    {
        return "";
    }
    
    var optDlg = $.extend({}, DialogOption, opt, {
            beforeclose: function(evt, ui)
            {
                _bClosed = _onBeforeClose();
                return _bClosed;
            }
        });

    function _onBeforeClose()
    {
        // 点击取消按钮时可以直接关闭
        if (("CANCEL"==_sClickedButton) || ("CLOSE"==_sClickedButton))
        {
            return true;
        }

        // 调用者不关心关闭前的处理
        if(!opt.beforeclose)
        {
            return true;
        }

        // 其它按钮由调用者确定是否可以关闭
        return (false!=opt.beforeclose(_sClickedButton));
    }

    function _click_Button(oBtn, sClick)
    {
        _sClickedButton = sClick;
        var $modalId = $(oBtn).parents(".modal");
        $F.Debuger.info("dialog button click: " + _sClickedButton);

        if(sClick == "OK")
        {
            optDlg.beforeclose && optDlg.beforeclose();
            $modalId.modal("hide");
        }
        else if((sClick == "Cancel") || (sClick == "Close"))
        {
            $modalId.modal("hide");
            optDlg.afterclose && optDlg.afterclose();
        }
        return;
    }
    function _create_Modal()
    {
        var sBtn = (opt.closeHeaderBtn)?"":"<button type='button' class='close' aria-hidden='true'></button>";
        $("body").append("<div id="+sId+" class='modal hide fade modal-default'>"+
                "<div class='modal-header'>"+sBtn+
                    "<h3></h3>"+
    	        "</div>"+
    	        "<div class='modal-body row-fluid'>"+
                     "<div class='modal-wordbreak'></div>"+	        
    	        "</div>"+
            	"<div class='modal-footer form-actions'></div>"+
	        "</div>");
    }
    function _set_ModalData(jMsgContainer,optDlg)
    {
        //jMsgContainer.attr('data-width',optDlg.width);

        switch(optDlg.modal)
        {
            case 1:
            case "middle":
                jMsgContainer.addClass("modal-large");
                break;
            case 3:
            case "big":
                jMsgContainer.addClass("modal-super");
                break;
            case 2:
            case "small":
                jMsgContainer.addClass("modal-small");
                break;
            default:
                break;
        }
        var sHtml = optDlg.html.replace(/portlet(-body)?/g,"");
        jMsgContainer.find("h3").html(optDlg.title);
        jMsgContainer.find(".modal-body").find(".modal-wordbreak").html(sHtml);
        var jButtonContainer = jMsgContainer.find(".modal-footer");
        jButtonContainer.empty();
        var aButton = optDlg.buttons.split("|");
    
    	for(var i=0;i<aButton.length;i++)
        {
            if(-1 != aButton[i].indexOf("OK"))
            {
    	        jButtonContainer.append("<a id="+sId+"_dialog_"+"OK class='btn btn-primary' dlgtype='OK' data-dismiss='modal'>" +$.MyLocale.Buttons.YES+"</a>");
            }
            else if(-1 != aButton[i].indexOf("CANCEL"))
            {
    	        jButtonContainer.append("<a href='#' id="+sId+"_dialog_"+"Cancel class='btn' dlgtype='Cancel' data-dismiss='modal'>" +$.MyLocale.Buttons.NO+"</a>");
            }
            else if(-1 != aButton[i].indexOf("CLOSE"))
            {
    	        jButtonContainer.append("<a href='#' id="+sId+"_dialog_"+"Close class='btn btn-primary' dlgtype='Close' data-dismiss='modal'>" +$.MyLocale.Buttons.CLOSE+"</a>");
            }
        }
        $("a", jButtonContainer).on("click", function(){
            _click_Button(this, $(this).attr("dlgtype"));
            return false;
        });
        
        $(".modal-header button").on("click", function(){
            _click_Button(this, "Close");
            return false;
        });
    }
    
    var jMsgContainer = $("#"+sId);
    if(0 == jMsgContainer.length)
    {
       _create_Modal();  
    }
    jMsgContainer = $("#"+sId);
    _set_ModalData(jMsgContainer,optDlg);
    
    var oDlg = jMsgContainer.modal();
    return oDlg;
}

var Msg = 
{
    NAME: "MSG",
    disabled: false, /* 当设置为true时所有的提示信息都不显示 */
    
/*****************************************************************************
@FuncName: public, Frame.Msg.info
@DateCreated: 2011-06-24
@Author: huangdongxiao 02807
@Description: 在页面中适当的位置显示一个提示信息, 并且在2秒钟后自动消失. 一般用于下发成功后显示成功的提示信息
    失败的提示信息由于需要保证用户肯定可以看到, 因此不用该函数显示
<div><img src="../../images/msg.info.jpg"></div>
一般情况下，下发成功后框架会自动显示该提示信息，不用各页面自己调用
@Usage: 
    function onMySubmit(oForm)
    {
        // check ...
        
        // submit ...
        
        Frame.Msg.wait("正在设置 ...");
    }
    
    function submitSuccess()
    {
        // todo: processing after submit
        // ......
        
        // show success information
        Frame.Msg.info("设置成功");
    }
@ParaIn: 
    * sMsg, string, 提示信息字符串。
    * sType, String, 提示框的类型. 可以是"ok", "info", "error". default is "ok"
@Return: 无.
@Caution: 
@Modification:
    * yyyy-mm-dd: Author, add or modify something
*****************************************************************************/
    info: function(sMsg, sType)
    {
        var sId="frame_msg_info";

        if(MyConfig.Dialog.INFO.useDlg)
        {
            var oDlg = _dialog(sId, {
                    height: 100,
                    html:sMsg
                });
            oDlg.siblings(".ui-dialog-titlebar").children(".ui-dialog-titlebar-close").hide();

            Frame.Timer.create("Frame.Msg.info",function()
            {
               oDlg.close();
            }, MyConfig.Dialog.INFO.visibleTime);
            return sId;
        }

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
        
        Frame.Timer.create("Frame.Msg.info",function()
        {
            $("#"+sId).fadeOut();
        },MyConfig.Dialog.INFO.visibleTime);
    },

/*****************************************************************************
@FuncName: public, Frame.Msg.wait
@DateCreated: 2011-06-24
@Author: huangdongxiao 02807
@Description: 在页面中显示一个等待对话框等待页面执行某一任务, 在任务完成后由页面
主动发送"close"事件关闭该对话框. 对话框中没有关闭图标,没有确定和取消等按钮, 
用户不能手动关闭对话框.
<div><img src="../../images/msg.wait.jpg"></div>
<div class=notice>支持的事件列表</div>
<li>close - 关闭对话框
<li>change - 改变对话框中的提示消息, 参数为{msg: "your message in dialog"}
@Usage: 
    var hWait = false;
    function onMySubmit(oForm)
    {
        // todo: check your input
        
        // do submit
        
        // show wait information
        hWait = Frame.Msg.wait("正在软件升级...");
    }
    
    function onSubmitEnd()
    {
        // close the wait window
        Frame.notify(hWait, "close");
    }

    // 等待窗口中进度变化演示.
    function changeMsg()
    {
        var k = 1;
        var hTimer = setInterval(function()
        {
            Frame.notify(hWait, "change", {msg:k+" seconds passed."});
            k++;
            if(k>=10)
            {
                clearInterval(hTimer);
            }
        }, 1000);
    }
    changeMsg();
@ParaIn: 
    * sMsg - string, 等待信息字符串。
@Return: 对话框ID, 当任务完成后页面必须向该ID发送close事件以关闭对话框.
@Caution: 
@Modification:
    * yyyy-mm-dd: Auth, add or modify something
*****************************************************************************/
    wait: function(para)
    {
        var oPara = $.isPlainObject(para) ? para : {msg: para};

        // 生成一个唯一的ID
        var sDlgId = "frame_msg_wait";
        var sString = '<span><div class="wait loading-small"></div><span>'+oPara.msg+'</span></span>';
        var oDlg = _dialog(sDlgId, {
                height: 130,
                title: oPara.title || $.MyLocale.WAITING, 
                html:sString, 
                closeHeaderBtn:true,
                closeOnEscape: false
            });
        oDlg.siblings(".ui-dialog-titlebar").children(".ui-dialog-titlebar-close").hide();

        return {
            hWait: sDlgId, 
            close: function(){$("#"+sDlgId).modal("hide");},
            change: function(){$("#"+sDlgId+" .msg").html(oPara.msg);}
        };
    },

/*****************************************************************************
@FuncName: public, Frame.Msg.alert
@DateCreated: 2011-06-24
@Author: huangdongxiao 02807
@Description: 显示提示信息对话框, 是window.alert的一种扩展. 以弹出对话框的形式显示一个提示信息. 
    该接口不阻塞代码, 因此点击确定后才能执行的代码需要封装到一个函数中, 做为cb参数传入.
<div><img src="../../images/msg.alert.jpg"></div>
@Usage: 
    Frame.Msg.alert("文件已经上传完成", function()
    {
        Frame.Debuger.log("对话框已关闭");
    });
@ParaIn: 
    * sMsg - string, 提示信息字符串。
    * cb - function, 点击确定后的回调函数, 可以没有。
@Return: 无.
@Caution: 提示信息对话框不阻塞JS代码执行.
@Modification:
    * yyyy-mm-dd: Auth, add or modify something
*****************************************************************************/
    alert: function(sMsg, cb)
    {
        var oPara = $.isPlainObject(sMsg) ? sMsg : {msg: sMsg, cb: cb};

        var opt = $.extend({
            title: oPara.title || $.MyLocale.ALERT_TITLE, 
            html:oPara.msg, 
            buttons:"CLOSE", 
            beforeclose:oPara.cb
        }, MyConfig.Dialog.ALERT);
        _dialog("frame_msg_alert", opt);
    },

/*****************************************************************************
@FuncName: public, Frame.Msg.error
@DateCreated: 2011-06-24
@Author: huangdongxiao 02807
@Description: 显示错误提示对话框, 是window.alert的一种扩展
<div><img src="../../images/msg.error.jpg"></div>
@Usage: 
    Frame.Msg.error("出错了");
@ParaIn: 
    * sMsg - string, 错误信息字符串。
    * cb - function, 点击确定后的回调函数, 可以没有。
@Return: 无.
@Caution: 错误提示对话框不阻塞JS代码执行.
@Modification:
    * yyyy-mm-dd: Auth, add or modify something
*****************************************************************************/
    error:function(sMsg, cb)
    {
        var opt = $.extend({
            title:$.MyLocale.ERROR_TITLE, 
            html:sMsg, 
            buttons:"CLOSE", 
            afterclose:cb
        }, MyConfig.Dialog.ERROR);

        _dialog("frame_msg_error", opt);
    },

/*****************************************************************************
@FuncName: public, Frame.Msg.merror
@DateCreated: 2011-06-24
@Author: huangdongxiao 02807
@Description: 显示多个错误的提示对话框. 当配置项超过一个, 
    且设置了<a href="srequest.js.html#Frame.SRequest.SRequestRoot.errorContinue">errorContinue</a>选项后,
    如果出现了多个错误, 则会使用该接口显示错误信息. 当错误信息较多时, 会出现垂直滚动条.
    该接口一般由框架在显示错误时根据错误信息自动调用, 各页面一般不需要调用.
<div><img src="../../images/msg.merror.jpg"></div>
@Usage: 
    // 拼错误字符串, 下面是框架使用字符串格式.
    var sMErr = "<div class='row'>配置接口Eth0/1/1的Duplex错误 <span class='error-reason'>不支持此操作</span></div>" 
        +"<div class='row'>配置接口Eth0/1/2的Duplex错误 <span class='error-reason'>不支持此操作</span></div>"
        +"<div class='row'>配置接口Eth0/2/1的Duplex错误 <span class='error-reason'>不支持此操作</span></div>"
        +"<div class='row'>配置接口Eth0/2/2的Duplex错误 <span class='error-reason'>不支持此操作</span></div>"
    Frame.Msg.error(sMErr);
@ParaIn: 
    * sMsg - string, 错误信息字符串。可以是纯文本字符串, 也可以是HTML字符串. 使用HTML字符串时需要保证HTML的有效性和正确性.
    * cb - function, 点击确定后的回调函数, 可以没有。
@Return: 无.
@Caution: 错误提示对话框不阻塞JS代码执行.
@Modification:
    * yyyy-mm-dd: Auth, add or modify something
*****************************************************************************/
    merror:function(aMsg, cb)
    {
        var sMsg = '<div class="row">' + aMsg.join('</div><div class="row">') + '</div>';
        
        var opt = $.extend({
            title:$.MyLocale.ERROR_TITLE, 
            html:sMsg, 
            buttons:"CLOSE", 
            beforeclose:cb
        }, MyConfig.Dialog.ERROR);

        _dialog("frame_msg_merror", opt);
    },
    
/*****************************************************************************
@FuncName: public, Frame.Msg.confirm
@DateCreated: 2011-06-24
@Author: huangdongxiao 02807
@Description: 显示确认对话框, 替代window.confirm
<div><img src="../../images/msg.confirm.jpg"></div>
@Usage: 
    Frame.Msg.confirm("确实要删除选中的所有的项吗?", function()
    {
        // 用户选择了OK按钮
        // ...
    });
@ParaIn: 
    * sMsg - string, 提示信息字符串。
    * cb - function, 点击确定后的回调函数, 可以没有。如果用户点击取消按钮, 则不会调用该回调.
@Return: 无.
@Caution: 确认对话框不阻塞JS代码执行.
@Modification:
    * yyyy-mm-dd: Auth, add or modify something
*****************************************************************************/
    confirm: function(sMsg, para)
    {
        var pfNoop = function(){}
        var pfOK = para;
        var pfCancel = pfNoop;
        var oPara = para;

        if(!$.isPlainObject(oPara))
        {
            oPara = {
                onOK: para||pfNoop,
                onCancel: pfNoop
            }
        }

        var opt = $.extend({
            title:$.MyLocale.CONFIRM_TITLE, 
            html:sMsg, 
            buttons:"OK|CANCEL", 
            beforeclose:oPara.onOK,
            afterclose:oPara.onCancel
        }, MyConfig.Dialog.CONFIRM);
        return _dialog("frame_msg_confirm", opt);
    },
    warning: function(sMsg, cb)
    {
        var opt = $.extend({
            title:$.MyLocale.CONFIRM_TITLE, 
            html:sMsg, 
            buttons:"OK|CANCEL", 
            beforeclose:function(sClick){("OK"==sClick) && cb && cb();}
        }, MyConfig.Dialog.CONFIRM);
        return _dialog("frame_msg_warning", opt);
    },
    
/*****************************************************************************
@FuncName: public, Frame.Msg.prompt
@DateCreated: 2011-06-24
@Author: huangdongxiao 02807
@Description: 显示一个简单输入的对话框, 替代window.prompt。支持框架的数据类型的合法性检查。对复杂的检查，可以在cb函数中自己完成。
<div><img src="../../images/msg.prompt.jpg"></div>
@Usage: 
    Frame.Msg.prompt("请输入你的姓名", function(sVal)
    {
        // 用户点击了OK按钮
        Frame.Msg.alert("你叫"+sVal);
    },{def:"tester", type:"text"});
@ParaIn: 
    * sMsg - string, 提示信息字符串。
    * cb - function, 点击确定后的回调函数, 可以没有。如果用户点击取消按钮, 则不会调用该回调.
    * opt, Object, 用户选项，支持以下选项：
        <li>defaultVal, 缺省值。即在对话框显示的初始值，可以是字符串，也可以是数字
        <li>ctype, 输入框类型，可以是password、file或者<a href="form.js.html#input_check_type">FORM支持的检查类型</a>
        <li>requred, boolean, 是否必须输入
@Return: 无.
@Caution: 确认对话框不阻塞JS代码执行.
@Modification:
    * yyyy-mm-dd: Auth, add or modify something
*****************************************************************************/
    prompt: function(sMsg, cb, opt)
    {
        var settings = {
            defaultVal: "",
            ctype: "text",
            required: false,
            cls: "width_small"
        };
        opt && $.extend(settings, opt);
        
        var dlgOpt = $.extend({
            title: opt.title||$.MyLocale.PROMPT_TITLE, 
            html: '<div class="description"></div>'+Frame.Form.createEle(settings),
            buttons:"OK|CANCEL", 
            beforeclose: function(sClick){return ("OK"==sClick) ? onOK() : true;}
        }, MyConfig.Dialog.PROMPT);

        var oDlg = _dialog("frame_msg_prompt", dlgOpt);
        oDlg.find(".description").html(sMsg)
            .next().keyup(function(e){(13==e.keyCode) && (true===onOK()) && oDlg.close()});
        return oDlg;
        
        function onOK()
        {
            // 没有指定CB函数，返回成功
            if(!cb) return true;
            
            var jInput = oDlg.find("input");
            if(!Frame.Form.checkEle(jInput))
            {
                // 框架检查不通过
                return false;
            }
            
            return cb(jInput);
        }
    }
} //// end of Frame.Msg
$F.Msg = Msg;

function _parseTitle(sHtml)
{
    return sHtml.replace(/[\w\W]*<title>([\w\s\W]*)<\/title>[\w\W]*/,"$1");
}

function _checkChange()
{
    //return "Changed, do you continue?";
    return null;
}

var Button = {
    NAME: "Frame.Button",
    
/*****************************************************************************
@FuncName: public, Frame.Button.Mode
@DateCreated: 2011-06-24
@Author: huangdongxiao 02807
@Description: 按钮模式. 在创建按钮时可以使用该模式内定义好的类型以简化代码和保证保页面的统一.
    支持的按钮模式如下：
    <table class="para_list">
    <tr><td>INFO</td><td>提示信息按钮模式</td></tr>
    <tr><td>ALERT</td><td>alert框的提示信息模式</td></tr>
    <tr><td>CONFIRM</td><td>确认对话框按钮模式</td></tr>
    <tr><td>CLOSE</td><td>关闭对话框按钮模式</td></tr>
    <tr><td>CREATE</td><td>弹出创建对话框的按钮模式</td></tr>
    <tr><td>MODIFY</td><td>弹出修改对话框的按钮模式</td></tr>
    <tr><td>DELETE</td><td>弹出删除确认对话框的按钮模式</td></tr>
    <tr><td>WIZARD</td><td>弹出向导对话框的按钮模式</td></tr>
    </table>
@Usage: 
    // 生成一个创建按钮
    $( "#addr_create" ).button(Frame.Button.Mode.CREATE);
    
    // 生成一个修改按钮
    $( "#addr_modify" ).button(Frame.Button.Mode.MODIFY);
@Modification:
    * yyyy-mm-dd: Auth, add or modify something
*****************************************************************************/
    Mode:
    {
        INFO:
        {
            icons: {
                primary: "fa"
            }
        },
        OPEN:
        {
            icons: {
                primary: "fa fa-columns"
            }
        },
        COPY:
        {
            icons: {
                primary: "fa fa-copy"
            }
        }, 
        FILTER:
        {
            icons: {
                primary: "fa fa-filter"
            }
        },
        ALERT:
        {
            icons: {
                primary: "fa fa-alert"
            }
        },
        WARNING:
        {
            icons: {
                primary: "fa fa-close"
            }
        },
        CONFIRM:
        {
            icons: {
                primary: "fa fa-help"
            }
        },
        CLOSE:
        {
            icons: {
                primary: "fa fa-close"
            }
        },
        EXPAND:
        {
            icons: {
                secondary: "fa fa-default"
            }
        },
        COLLASE:
        {
            icons: {
                secondary: "fa fa-default"
            }
        },
        MENU:
        {
            icons: {
                secondary: "fa fa-default"
            }
        },
        CREATE:
        {
            icons: {
                primary: "fa fa-plus"
                //,secondary: "icon-triangle-1-s"
            }
        },
        MODIFY:
        {
            icons: {
                primary: "fa fa-pencil"
                //,secondary: "icon-triangle-1-s"
            }
        },
        DELETE:
        {
            icons: {
                primary: "fa fa-trash-o"
                //,secondary: "icon-closethick"
            }
        },
        SEARCH:
        {
            icons: {
                primary: "fa fa-search"
            }
        },
        RESET:
        {
            icons: {
                primary: "fa fa-default"
            }
        },
        FIX:
        {
            icons: {
                primary: "fa fa-thumb-tack"
            }
        },
        CHART:
        {
            icons: {
                primary: "fa fa-bar-chart-o"
            }
        }, 
        SCAN:
        {
            icons: {
                primary: "fa fa-default"
            }
        }, 
        CLEAR:
        {
            icons: {
                primary: "fa fa-remove"
            }
        }, 
        UPDATE:
        {
            icons: {
                primary: "fa fa-refresh"
            }
        },
        MOVE:
        {
            icons: {
                primary: "fa fa-arrows"
            }
        },
        WIZARD:
        {
            icons: {
                primary: "fa fa-wrench"
            }
        },
        UPLOAD:
        {
            icons: {
                primary: "fa fa-arrow-circle-o-up"
            }
        },
        DOWNLOAD:
        {
            icons: {
                primary: "fa fa-arrow-circle-o-down"
            }
        },
        FLAG:
        {
            icons: {
                primary: "fa fa-flag"
            }
        },
        START:
        {
            icons: {
                primary: "fa fa-play"
            }
        },
        STOP:
        {
            icons: {
                primary: "fa fa-stop"
            }
        },
        DISABLE:
        {
            icons: {
                primary: "fa fa-ban"
            }
        },
        ENABLE:
        {
            icons: {
                primary: "fa fa-check"
            }
        },
        REFRESH:
        {
            icons: {
                primary: "fa fa-refresh"
            }
        },
        PANEL:
        {
            icons: {
                primary: "fa fa-tasks"
            }
        },
        DEFAULT:
        {
            icons: {
                primary: "fa fa-default"
            }
        }
    },

/*****************************************************************************
@FuncName: public, Frame.Button.create
@DateCreated: 2012-06-24
@Author: huangdongxiao 02807
@Description: 创建按钮。在页面内使用input@type=button，或者button标签时浏览器会使用默认的按钮外观。
    该接口可以为按钮增加统一的CSS，超到统一美化按钮的作用。注：该接口不处理按钮的任何事件
    <p>页面中常用的按钮，框架都会在初始化前统一处理，因此页面只需要处理页面内特殊的按钮即可。
    如：配置文件备份和导出按钮
@Usage: 
    // 对my_form下所有的BUTTON按钮统一美化
    Frame.Button.create("#my_form button");
@ParaIn: 
    * sSelector - string, jquery选择器字符串。
    * mode, #Frame.Button.Mode, 按钮模式，可以不指定
@Return: 无.
@Modification:
    * yyyy-mm-dd: Auth, add or modify something
*****************************************************************************/
    create: function(sSelector, mode)
    {
        $( sSelector).button(mode);
    },

    onApply: function()
    {
        var sFormId = $(this).attr("form");
        if(!sFormId)
        {
            return false;
        }
    
        $("#"+sFormId).submit();
        return false;
    },

    onCancel: function()
    {
        Frame.getHelpPanel().close();
        return false;
    },

/*****************************************************************************
@FuncName: public, Frame.Button.disable
@DateCreated: 2011-06-24
@Author: huangdongxiao 02807
@Description: 批量禁止按钮
@Usage: 
    // 禁止my_form下所有的INPUT
    Frame.Button.disable("#my_form input");
@ParaIn: 
    * selector - string, jquery选择器字符串，或者是jButton对象。
@Return: 无.
@Modification:
    * yyyy-mm-dd: Auth, add or modify something
*****************************************************************************/
    disable: function(selector)
    {
        var jButton = (typeof(selector)=="string") ? $(selector) : selector;
        jButton.button("disable").removeClass("ui-state-hover");
    },

/*****************************************************************************
@FuncName: public, Frame.Button.enable
@DateCreated: 2011-06-24
@Author: huangdongxiao 02807
@Description: 批量使能按钮
@Usage: 
    // 使能my_form下所有的INPUT
    Frame.Button.enable("#my_form input");
@ParaIn: 
    * selector - string, jquery选择器字符串，或者是jButton对象。
@Return: 无.
@Modification:
    * yyyy-mm-dd: Auth, add or modify something
*****************************************************************************/
    enable: function(selector)
    {
        var jButton = (typeof(selector)=="string") ? $(selector) : selector;

        jButton.button("enable");
    }
};
$F.Button = Button;

/*****************************************************************************
@typedef: FormDlgOption
@DateCreated: 2011-06-24
@Author: huangdongxiao 02807
@Description: 显示一个FORM表单时，传递给Frame.Dialog.form的参数
@fields:
* title - string, 对话框标题，如果不指定，则使用页面中的TITLE标签作为对话框的标题。如果指定了该参数，则以本参数为准。
* width - integer,对话框的宽度，不指定时使用默认宽度
* height - integer,对话框的高度，不包括下面一排按钮的高度。不指定时使用默认高度
* src - selector, 弹出该对话框的点击按钮等HTML元素。即该对话框是由src指定的元素发起的
* html - string, 对话框中显示的HTML字符串。
* url - string, 对话框显示的URL。当对话框显示时会从指定的URL中获取页面，然后显示在对话框中。
    如果指定了html属性，则忽略url属性。URL的路径是从模块名开始，不需要调用
    <a href="util.js.html#Frame.Util.getPathUrl">Frame.Util.getPathUrl</a> 进行转换。如："syslog/cn/setup.html"
* init - Function, 页面的初始化函数。当页面load完成后，框架会调用init函数由页面自己进行初始化处理。
    页面不允许使用BODY的onload事件进行初始化。
* onSubmit - Function, 点击确定后的提交处理。一般在该函数内进行XCMP下发动作。
    也可以做一些综合性的检查。返回值班为boolean类型，返回false不关闭对话框; true, 关闭对话框

@Modification:
    * yyyy-mm-dd: Author, add or modify something
*******************************************************************************/
var FormDlgOption = 
{
    buttons: "OK|CANCEL",

    onInit: $.noop,
    onSubmit: $.noop,
    onClosed: $.noop
}

var Dialog = {
    
/*****************************************************************************
@FuncName: public, Frame.Dialog.dialog
@DateCreated: 2011-06-24
@Author: huangdongxiao 02807
@Description: 显示一个对话框
<div><img src="../../images/dialog.dialog.jpg"></div>
@Usage: 
    // 显示一个输入对话框
    Frame.Dialog.dialog({title: "test", html: "Dialog test"});
@ParaIn: 
    * opt - FormDlgOption, 参数对象，其中html和url必须有一个。
@Return: 无.
@ Modification:
    * yyyy-mm-dd: Auth, add or modify something
*****************************************************************************/
    dialog: function(option)
    {
        var sId = "frame_dialog";

        var opt = {};
        if(typeof option == "string")
        {
            opt = {html: option};
        }
        $.extend(opt, FormDlgOption, {buttons:"CLOSE", onClosed:opt.onClosed}, option);
        
        function showPage(sHtml)
        {
            // show dialog
            var dlg = _dialog(sId, opt);
            
            opt.onInit();
            return dlg;
        }

        if(opt.html)
        {
            return showPage(opt.html);
        }

        if(opt.url)
        {
            var sUrl = Frame.Util.getPathUrl(opt.url);
            Frame.Debuger.info("Dialog load from "+sUrl);
            $("<div></div>").load(sUrl, false, showPage);
            return true;
        }

        return false;
    }//// end of dialog
} //// end of Dialog
$F.Dialog = Dialog;

var _alert = window.alert;
var _confirm = window.confirm;
window.alert = function(sMsg){_alert("Please use Frame.Msg.info/error/wait/alert\r\n\r\n"+sMsg);}
window.confirm = function(sMsg){return _confirm("Please use Frame.Msg.confirm\r\n\r\n"+sMsg);}
})(Frame);
