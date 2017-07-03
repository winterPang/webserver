;(function($)
{
    var WIDGETNAME = "FileLoad";
    var g_oWait;
    var g_oTimer = false;
    var oFileLoad = {
        _create: function()
        {
            var oFileLoad = this._oFileLoad = this.element;          
            if("fileload" == oFileLoad.attr("ctrl"))
            {
                return false;
            }
            oFileLoad.attr("ctrl", "fileload");
            
            return;
        },
        uploadFile: function ( sDestFile, opt, pfSuccess)
        {
            if (!sDestFile)
            {
                return 1;
            }
            var sId = "_upload_iframe";

            function onShowMsg(sMsg)
            {
                if(opt.msgId)
                {
                    $("#"+opt.msgId).html(sMsg);
                }
                else
                {
                    Utils.Msg.alert(sMsg);
                }
            }

            if(!(opt instanceof Object))
            {
                opt = {flag: opt, onSuccess: pfSuccess};
            }
            opt = $.extend({}, {flag: "", msgId: false, onFailed: onShowMsg,onSuccess: onShowMsg}, opt);

            this.opt = opt;
            var aOpt = opt.flag.split("|");
            var jIframe = this.getIframe(sId, pfSuccess);

            var sHtml = "";
            var jForm = this.element;
            $("input[type=file]").attr("name","srcfile");
            sHtml += '<input type=hidden name="file" value="' + sDestFile + '">';
            $.each(aOpt, function(iIndex, sItem)
                {
                    sHtml += '<input type=hidden name="' + sItem + '" value="1">';
                    return;
                }
            );

            var sUrl = Frame.Util.getDynUrl("file/upload.j");
            jForm.attr({"action":sUrl, "target":sId, "method":"post", "enctype":"multipart/form-data"});
            jForm.bind("submit", function (){Frame.keepAlive.pause();return true;});
            jForm.append(sHtml);
            
            jForm.form({submit : "system"});
            if(window.FormData)   //  HTML5 upload file 
            {
                var oFile = $("input:[type='file']",jForm)[0].files[0];
                if (oFile) 
                {
                    var formData = new FormData();
                    formData.append(jForm.find("input:[type='file']").attr('name'), oFile);
                    formData.append("file", sDestFile);
                    formData.append(aOpt, "1");
                    $.ajax({
                        type: 'POST',
                        url: jForm.attr("action"),
                        data: formData,
                        contentType: false,
                        processData: false,
                        success:function(result){
                            if(result)
                            {
                                // result is a string as below:
                                // <script>parent.Frame.FileMnger.showResult(true, 'ok')</script>
                                // <script>parent.Frame.FileMnger.showResult(false, "error message")</script>
                                var sCmd = result.split(/\parent.|<\/script>/)[1];
                                eval(sCmd);
                            }
                        }
                    });
                }   
            }
            else
            {
                jForm.submit();
            }
            g_oWait = Utils.Msg.wait($.MyLocale.WAITING);
            this.makerTimer();
            jForm.form({submit : "self"});
            return 0;
        },
        getIframe: function (sId, pfSuccess)
        {
            var jIFrame = $("#"+sId);

            if(jIFrame.length == 0)
            {
                var sNameId = "name='" + sId + "' id='" + sId + "'";
                var sIFrame = "<iframe class='hidden-ele'" + sNameId + "></iframe>";
                $("body").append(sIFrame);
            }
            else
            {
                jIFrame.html("");
            }

            Frame.FileMnger = {};
            var opt = this.opt;
            Frame.FileMnger.showResult = function (bOk, sMsg)
            {
                g_oWait.close();
              	oFileLoad.killTimer();
                var pfCallback = bOk ? opt.onSuccess : opt.onFailed;
                pfCallback(sMsg);
                return;
            };

            return jIFrame;
        },
        getFilePath:function()
        {
            var aFilePath = [];
            var jElement = this.element;
            var aFlie = jElement.find('input:[type=file]');
            if(aFlie.length>0)
            {
                aFlie.each(function(index, el) {
                    var sValue = $(this).val();
                    if(sValue)
                    {
                        aFilePath.push(sValue);
                    }
                });
            }
            return aFilePath;
        },
        getFileName:function()
        {
            var aFileName = [];
            var jElement = this.element;
            var aFlie = jElement.find('input:[type=file]');
            if(aFlie.length>0)
            {
                aFlie.each(function(index, el) {
                    var sValue = $(this).val();
                    if(sValue)
                    {
                        var sName = sValue.split("\\").pop();
                        aFileName.push(sName);
                    }
                });
            }
            return aFileName;
        },
        makerTimer: function(){
        	if(g_oTimer){
        		this.killTimer();
        	}
        	var idleTime = (Frame.get("idletime", 10) * 60000)/2;
            g_oTimer = setInterval(function(){Frame.keepAlive.update()},idleTime);
        },
        killTimer: function(){
        	if(g_oTimer){
        		clearInterval(g_oTimer);
        	}
        	g_oTimer = false;
        },
        disable: function(element)
        { 
            var selector = element||"input[type='file']";
            this.element.find(selector).attr("disabled",true);
        },
        enable: function(element)
        {
            var selector = element||"input[type='file']";
            this.element.find(selector).attr("disabled",false);
        },
        _destroy:function()
        {
            g_oWait = null;
            this.killTimer();
        }    
    };

    function _init(oFrame)
    {
        $(".uploadFile", oFrame).fileload();
    }
    function _destroy() 
    {
        g_oWait = null;
    }

    $.widget("ui.fileload", oFileLoad);
    Widgets.regWidget(WIDGETNAME, {
        "init": _init, "destroy": _destroy, 
        "widgets": [], 
        "utils":["Widget"],
        "libs": ["Libs.Fileload.Multifile"]
    });
})(jQuery);
