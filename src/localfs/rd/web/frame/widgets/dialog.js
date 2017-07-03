/*******************************************************************************
 Copyright (c) 2007, Hangzhou H3C Technologies Co., Ltd. All rights reserved.
--------------------------------------------------------------------------------
@FileName:libs/frame/dialog.js
@ProjectCode: Comware v7
@ModuleName: Frame.Dialog
@DateCreated: 2011-06-24
@Author: huangdongxiao 02807
@Description: 
    �Ի������ؽӿ�,����FORM, �򵼺���ʾ��Ϣ����ʾ, �Ͱ�ť��disable/enable.
    �ṩ������:
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
@Description: ��ʾ�Ի���ʱ�����ݸ��Ի���Ĳ���
@fields:
* title - string, �Ի�����⣬Ĭ�ϱ���Ϊ��MessageBox��
* width - integer,�Ի���Ŀ�ȣ�Ĭ�Ͽ��Ϊ400, ������MyConfig�н�������
* height - integer,�Ի���ĸ߶ȣ�Ĭ�ϸ߶�Ϊ300, ������MyConfig�н�������
* resizable - boolean, �Ƿ���Ըı�Ի���Ĵ�С��Ĭ��ֵΪfalse
* html - string, �Ի�������ʾ��HTML�ַ�����
* buttons - string, �Ի���ť, ȱʡû�а�ť��֧�ְ�ť�� 
    <a href="../../frame/cn/locale.js.html#JQuery.MyLocale.Buttons">MyLocale.Buttons</a>
    �ж���, �����ť��ʹ��"|"��������, ��"OK|CANCEL"
* beforeclose - Function, �رնԻ���ǰ�ļ�麯���������ڸú��������ر�ǰ�Ĵ���
    <li>����ԭ�ͣ�boolean function onBeforeClose(sButton)
    <li>������sButton, String, ��buttons������ָ���İ�ť���ƣ���OK, Cancel
    <li>����ֵ��true - ����رնԻ��򣻷�������رնԻ���;
* onClosed - Function, �رնԻ������á����beforeclose������true��������ú������رպ�Ĵ���
* closeOnEscape - boolean, �Ƿ�����ESC���رնԻ���Ĭ��ֵΪtrue;
@Modification:
    * yyyy-mm-dd: Author, add or modify something
    * 2011-07-27: �ƶ���, ����closeOnEscape����
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
@Description: ��ʾ�Ի���
@Usage: usage�п��������Ժ�����ʹ�õĴ������������û�п��Բ�д
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
    * sId - string, �Ի�����ҳ���е�ID��
    * option - DialogOption, �Ի����ѡ�
@Return: Dialog����,�ڻص������п��Ե���close�رնԻ���.
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
        // ���ȡ����ťʱ����ֱ�ӹر�
        if (("CANCEL"==_sClickedButton) || ("CLOSE"==_sClickedButton))
        {
            return true;
        }

        // �����߲����Ĺر�ǰ�Ĵ���
        if(!opt.beforeclose)
        {
            return true;
        }

        // ������ť�ɵ�����ȷ���Ƿ���Թر�
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
    disabled: false, /* ������Ϊtrueʱ���е���ʾ��Ϣ������ʾ */
    
/*****************************************************************************
@FuncName: public, Frame.Msg.info
@DateCreated: 2011-06-24
@Author: huangdongxiao 02807
@Description: ��ҳ�����ʵ���λ����ʾһ����ʾ��Ϣ, ������2���Ӻ��Զ���ʧ. һ�������·��ɹ�����ʾ�ɹ�����ʾ��Ϣ
    ʧ�ܵ���ʾ��Ϣ������Ҫ��֤�û��϶����Կ���, ��˲��øú�����ʾ
<div><img src="../../images/msg.info.jpg"></div>
һ������£��·��ɹ����ܻ��Զ���ʾ����ʾ��Ϣ�����ø�ҳ���Լ�����
@Usage: 
    function onMySubmit(oForm)
    {
        // check ...
        
        // submit ...
        
        Frame.Msg.wait("�������� ...");
    }
    
    function submitSuccess()
    {
        // todo: processing after submit
        // ......
        
        // show success information
        Frame.Msg.info("���óɹ�");
    }
@ParaIn: 
    * sMsg, string, ��ʾ��Ϣ�ַ�����
    * sType, String, ��ʾ�������. ������"ok", "info", "error". default is "ok"
@Return: ��.
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
@Description: ��ҳ������ʾһ���ȴ��Ի���ȴ�ҳ��ִ��ĳһ����, ��������ɺ���ҳ��
��������"close"�¼��رոöԻ���. �Ի�����û�йر�ͼ��,û��ȷ����ȡ���Ȱ�ť, 
�û������ֶ��رնԻ���.
<div><img src="../../images/msg.wait.jpg"></div>
<div class=notice>֧�ֵ��¼��б�</div>
<li>close - �رնԻ���
<li>change - �ı�Ի����е���ʾ��Ϣ, ����Ϊ{msg: "your message in dialog"}
@Usage: 
    var hWait = false;
    function onMySubmit(oForm)
    {
        // todo: check your input
        
        // do submit
        
        // show wait information
        hWait = Frame.Msg.wait("�����������...");
    }
    
    function onSubmitEnd()
    {
        // close the wait window
        Frame.notify(hWait, "close");
    }

    // �ȴ������н��ȱ仯��ʾ.
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
    * sMsg - string, �ȴ���Ϣ�ַ�����
@Return: �Ի���ID, ��������ɺ�ҳ��������ID����close�¼��ԹرնԻ���.
@Caution: 
@Modification:
    * yyyy-mm-dd: Auth, add or modify something
*****************************************************************************/
    wait: function(para)
    {
        var oPara = $.isPlainObject(para) ? para : {msg: para};

        // ����һ��Ψһ��ID
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
@Description: ��ʾ��ʾ��Ϣ�Ի���, ��window.alert��һ����չ. �Ե����Ի������ʽ��ʾһ����ʾ��Ϣ. 
    �ýӿڲ���������, ��˵��ȷ�������ִ�еĴ�����Ҫ��װ��һ��������, ��Ϊcb��������.
<div><img src="../../images/msg.alert.jpg"></div>
@Usage: 
    Frame.Msg.alert("�ļ��Ѿ��ϴ����", function()
    {
        Frame.Debuger.log("�Ի����ѹر�");
    });
@ParaIn: 
    * sMsg - string, ��ʾ��Ϣ�ַ�����
    * cb - function, ���ȷ����Ļص�����, ����û�С�
@Return: ��.
@Caution: ��ʾ��Ϣ�Ի�������JS����ִ��.
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
@Description: ��ʾ������ʾ�Ի���, ��window.alert��һ����չ
<div><img src="../../images/msg.error.jpg"></div>
@Usage: 
    Frame.Msg.error("������");
@ParaIn: 
    * sMsg - string, ������Ϣ�ַ�����
    * cb - function, ���ȷ����Ļص�����, ����û�С�
@Return: ��.
@Caution: ������ʾ�Ի�������JS����ִ��.
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
@Description: ��ʾ����������ʾ�Ի���. ���������һ��, 
    ��������<a href="srequest.js.html#Frame.SRequest.SRequestRoot.errorContinue">errorContinue</a>ѡ���,
    ��������˶������, ���ʹ�øýӿ���ʾ������Ϣ. ��������Ϣ�϶�ʱ, ����ִ�ֱ������.
    �ýӿ�һ���ɿ������ʾ����ʱ���ݴ�����Ϣ�Զ�����, ��ҳ��һ�㲻��Ҫ����.
<div><img src="../../images/msg.merror.jpg"></div>
@Usage: 
    // ƴ�����ַ���, �����ǿ��ʹ���ַ�����ʽ.
    var sMErr = "<div class='row'>���ýӿ�Eth0/1/1��Duplex���� <span class='error-reason'>��֧�ִ˲���</span></div>" 
        +"<div class='row'>���ýӿ�Eth0/1/2��Duplex���� <span class='error-reason'>��֧�ִ˲���</span></div>"
        +"<div class='row'>���ýӿ�Eth0/2/1��Duplex���� <span class='error-reason'>��֧�ִ˲���</span></div>"
        +"<div class='row'>���ýӿ�Eth0/2/2��Duplex���� <span class='error-reason'>��֧�ִ˲���</span></div>"
    Frame.Msg.error(sMErr);
@ParaIn: 
    * sMsg - string, ������Ϣ�ַ����������Ǵ��ı��ַ���, Ҳ������HTML�ַ���. ʹ��HTML�ַ���ʱ��Ҫ��֤HTML����Ч�Ժ���ȷ��.
    * cb - function, ���ȷ����Ļص�����, ����û�С�
@Return: ��.
@Caution: ������ʾ�Ի�������JS����ִ��.
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
@Description: ��ʾȷ�϶Ի���, ���window.confirm
<div><img src="../../images/msg.confirm.jpg"></div>
@Usage: 
    Frame.Msg.confirm("ȷʵҪɾ��ѡ�е����е�����?", function()
    {
        // �û�ѡ����OK��ť
        // ...
    });
@ParaIn: 
    * sMsg - string, ��ʾ��Ϣ�ַ�����
    * cb - function, ���ȷ����Ļص�����, ����û�С�����û����ȡ����ť, �򲻻���øûص�.
@Return: ��.
@Caution: ȷ�϶Ի�������JS����ִ��.
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
@Description: ��ʾһ��������ĶԻ���, ���window.prompt��֧�ֿ�ܵ��������͵ĺϷ��Լ�顣�Ը��ӵļ�飬������cb�������Լ���ɡ�
<div><img src="../../images/msg.prompt.jpg"></div>
@Usage: 
    Frame.Msg.prompt("�������������", function(sVal)
    {
        // �û������OK��ť
        Frame.Msg.alert("���"+sVal);
    },{def:"tester", type:"text"});
@ParaIn: 
    * sMsg - string, ��ʾ��Ϣ�ַ�����
    * cb - function, ���ȷ����Ļص�����, ����û�С�����û����ȡ����ť, �򲻻���øûص�.
    * opt, Object, �û�ѡ�֧������ѡ�
        <li>defaultVal, ȱʡֵ�����ڶԻ�����ʾ�ĳ�ʼֵ���������ַ�����Ҳ����������
        <li>ctype, ��������ͣ�������password��file����<a href="form.js.html#input_check_type">FORM֧�ֵļ������</a>
        <li>requred, boolean, �Ƿ��������
@Return: ��.
@Caution: ȷ�϶Ի�������JS����ִ��.
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
            // û��ָ��CB���������سɹ�
            if(!cb) return true;
            
            var jInput = oDlg.find("input");
            if(!Frame.Form.checkEle(jInput))
            {
                // ��ܼ�鲻ͨ��
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
@Description: ��ťģʽ. �ڴ�����ťʱ����ʹ�ø�ģʽ�ڶ���õ������Լ򻯴���ͱ�֤��ҳ���ͳһ.
    ֧�ֵİ�ťģʽ���£�
    <table class="para_list">
    <tr><td>INFO</td><td>��ʾ��Ϣ��ťģʽ</td></tr>
    <tr><td>ALERT</td><td>alert�����ʾ��Ϣģʽ</td></tr>
    <tr><td>CONFIRM</td><td>ȷ�϶Ի���ťģʽ</td></tr>
    <tr><td>CLOSE</td><td>�رնԻ���ťģʽ</td></tr>
    <tr><td>CREATE</td><td>���������Ի���İ�ťģʽ</td></tr>
    <tr><td>MODIFY</td><td>�����޸ĶԻ���İ�ťģʽ</td></tr>
    <tr><td>DELETE</td><td>����ɾ��ȷ�϶Ի���İ�ťģʽ</td></tr>
    <tr><td>WIZARD</td><td>�����򵼶Ի���İ�ťģʽ</td></tr>
    </table>
@Usage: 
    // ����һ��������ť
    $( "#addr_create" ).button(Frame.Button.Mode.CREATE);
    
    // ����һ���޸İ�ť
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
@Description: ������ť����ҳ����ʹ��input@type=button������button��ǩʱ�������ʹ��Ĭ�ϵİ�ť��ۡ�
    �ýӿڿ���Ϊ��ť����ͳһ��CSS������ͳһ������ť�����á�ע���ýӿڲ�����ť���κ��¼�
    <p>ҳ���г��õİ�ť����ܶ����ڳ�ʼ��ǰͳһ�������ҳ��ֻ��Ҫ����ҳ��������İ�ť���ɡ�
    �磺�����ļ����ݺ͵�����ť
@Usage: 
    // ��my_form�����е�BUTTON��ťͳһ����
    Frame.Button.create("#my_form button");
@ParaIn: 
    * sSelector - string, jqueryѡ�����ַ�����
    * mode, #Frame.Button.Mode, ��ťģʽ�����Բ�ָ��
@Return: ��.
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
@Description: ������ֹ��ť
@Usage: 
    // ��ֹmy_form�����е�INPUT
    Frame.Button.disable("#my_form input");
@ParaIn: 
    * selector - string, jqueryѡ�����ַ�����������jButton����
@Return: ��.
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
@Description: ����ʹ�ܰ�ť
@Usage: 
    // ʹ��my_form�����е�INPUT
    Frame.Button.enable("#my_form input");
@ParaIn: 
    * selector - string, jqueryѡ�����ַ�����������jButton����
@Return: ��.
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
@Description: ��ʾһ��FORM��ʱ�����ݸ�Frame.Dialog.form�Ĳ���
@fields:
* title - string, �Ի�����⣬�����ָ������ʹ��ҳ���е�TITLE��ǩ��Ϊ�Ի���ı��⡣���ָ���˸ò��������Ա�����Ϊ׼��
* width - integer,�Ի���Ŀ�ȣ���ָ��ʱʹ��Ĭ�Ͽ��
* height - integer,�Ի���ĸ߶ȣ�����������һ�Ű�ť�ĸ߶ȡ���ָ��ʱʹ��Ĭ�ϸ߶�
* src - selector, �����öԻ���ĵ����ť��HTMLԪ�ء����öԻ�������srcָ����Ԫ�ط����
* html - string, �Ի�������ʾ��HTML�ַ�����
* url - string, �Ի�����ʾ��URL�����Ի�����ʾʱ���ָ����URL�л�ȡҳ�棬Ȼ����ʾ�ڶԻ����С�
    ���ָ����html���ԣ������url���ԡ�URL��·���Ǵ�ģ������ʼ������Ҫ����
    <a href="util.js.html#Frame.Util.getPathUrl">Frame.Util.getPathUrl</a> ����ת�����磺"syslog/cn/setup.html"
* init - Function, ҳ��ĳ�ʼ����������ҳ��load��ɺ󣬿�ܻ����init������ҳ���Լ����г�ʼ������
    ҳ�治����ʹ��BODY��onload�¼����г�ʼ����
* onSubmit - Function, ���ȷ������ύ����һ���ڸú����ڽ���XCMP�·�������
    Ҳ������һЩ�ۺ��Եļ�顣����ֵ��Ϊboolean���ͣ�����false���رնԻ���; true, �رնԻ���

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
@Description: ��ʾһ���Ի���
<div><img src="../../images/dialog.dialog.jpg"></div>
@Usage: 
    // ��ʾһ������Ի���
    Frame.Dialog.dialog({title: "test", html: "Dialog test"});
@ParaIn: 
    * opt - FormDlgOption, ������������html��url������һ����
@Return: ��.
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
