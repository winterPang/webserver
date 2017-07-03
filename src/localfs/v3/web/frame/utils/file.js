;(function($)
{
    var UTILNAME = "File";

    function getIframe(pfCallBack)
    {
        var sId = "_file_iframe";
        var jIFrame = $("#"+sId);

        if(jIFrame.length == 0)
        {
            var sNameId = "name='" + sId + "' id='" + sId + "'";
            jIFrame = $("<iframe class='hidden-ele'" + sNameId + "></iframe>");
            $("body").append(jIFrame);
        }

        Frame.FileMnger = {
            showResult: function (bOk, sMsg)
            {
                if (pfCallBack)
                {
                    pfCallBack(bOk, sMsg);
                }
            }
        };

        return jIFrame;
    }

    function uploadFile(oSrcFileForm, sDestFile, sOpt, pfCallBack)
    {
        if (!oSrcFileForm || !sDestFile)
        {
            return 1;
        }

        getIframe(pfCallBack);
        var aOpt = sOpt.split("|");
        var sHtml = "";
        var jForm = oSrcFileForm;

        $("input[type=file]").attr("name","srcfile");
        sHtml += '<input type=hidden name="file" value="' + sDestFile + '">';
        $.each(aOpt, function(iIndex, sItem){sHtml += '<input type=hidden name="' + sItem + '" value="1">';return;});

        var sUrl = Frame.Util.getDynUrl("file/upload.j");
        jForm.attr({"action":sUrl, "target":sId, "method":"post", "enctype":"multipart/form-data"});
        jForm.bind("submit", function (){Frame.keepAlive.pause();return true;});
        jForm.append(sHtml);
        
        jForm.form({submit : "system"});
        jForm.submit();
        jForm.form({submit : "self"});
        return 0;
    }

    function downloadFile (sFileName)
    {
        var jIframe = getIframe();
        var sUrl = Frame.Util.getDynUrl("file/download.j?file="+sFileName);
        jIframe.attr("src", sUrl);
    }

    var oFile = {
    	uploadFile : uploadFile,
        downloadFile: downloadFile
    };

    Utils.regUtil(UTILNAME, oFile, {"widgets": [], "utils":[]});
})(jQuery);