;
(function ($) {
    var _range;
    //初始化表情页面
    function initEmotionPage() {
        var a = '<a href="javascript:void(0);"></a>';
        var src = '<img src="../image/emotion/em';
        //var src = '<img src="http://ctc.qzonestyle.gtimg.cn/qzone/em/e';
        //for (var i = 100; i < 189; i++) {
        for (var i = 101; i < 125; i++) {
            var emotionImage = src + i + '.gif">';
            var emotionA = $(a).append(emotionImage);
            $(".emotionPrimary").append(emotionA);
        }
    };
    //初始化表情点击事件
    function initEmotionFunction() {
        $(".emotionPrimary a").bind('click', function () {
            insertContent($(this)[0].innerHTML);
        });
    }

    $("#chatInputTextarea").bind({
        mouseup:saveRange,
        keyup:saveRange
    });

    function saveRange() {
        var selection = window.getSelection ? window.getSelection() : document.selection;
        var range = selection.getRangeAt ? selection.getRangeAt(0) : selection.createRange();
        _range = range;
    }

    //锁定编辑器中鼠标光标位置
    function insertContent(str){
        $("#chatInputTextarea").focus();
        if(!_range){
            saveRange();
        }
        if (!window.getSelection){
            var range = _range;
            range.pasteHTML(str);
            range.collapse(false);
            range.select();
        }else{
            var selection = window.getSelection ? window.getSelection() : document.selection;
            var range = _range;
            range.deleteContents();
            var el = document.createElement("div");
            el.innerHTML = str;
            var frag = document.createDocumentFragment();
            var node, lastNode;
            while ( (node = el.firstChild) ) {
                lastNode = frag.appendChild(node);
            }
            range.insertNode(frag);
            if (lastNode) {
                range.setStartAfter(lastNode);
            }
            selection.removeAllRanges();
            selection.addRange(range)
        }
    }

    //监控粘贴(ctrl+v),如果是粘贴过来的东东，则替换多余的html代码，只保留表情和<br>
    function pasteHandler(event) {
        var content;
        if (event.clipboardData) {
            /* chrome等浏览器 */
            content = event.clipboardData.getData('text/html');
            if (content == "") {
                content = event.clipboardData.getData('Text');
            }
        } else{
            /* IE */
            content = window.clipboardData.getData('Text');
        }
        event.preventDefault();
        setTimeout(function(){
            content = content.replace(/(<[^>]*>)/g,function(tempcont){
                /*QQ表情*/
                //if(/<img src="http:\/\/ctc.qzonestyle.gtimg.cn\/qzone\/em\/e1[0-8][0-9].gif"[^>]*>/gi.test(tempcont)){
                //    return tempcont.replace(/(<img src="http:\/\/ctc.qzonestyle.gtimg.cn\/qzone\/em\/e1[0-8][0-9].gif")([^>]*>)/gi,"$1>");
                /*自己的表情*/
                var index = tempcont.lastIndexOf("image/emotion");
                tempcont = '<img src="../' + tempcont.substring(index);
                if(/<img src="\.\.\/image\/emotion\/em1[0-2][0-9].gif"[^>]*>/gi.test(tempcont)){
                    return tempcont.replace(/(<img src="\.\.\/image\/emotion\/em1[0-2][0-9].gif")([^>]*>)/gi,"$1>");
                /*不过滤网上url图片*/
                //if(/<img [^>]*>/gi.test(tempcont)){
                //    return tempcont.replace(/(<img )(?:[^r]*="[^"]*" )*src=("[^"]*")([^>]*>)/gi,"$1src=$2>");
                }else if(/<br[^>]*>/g.test(tempcont)){
                    return "<br>";
                }
                else {
                    return "";
                }
            });
            if(!/firefox/.test(navigator.userAgent.toLowerCase())){
                content=content.replace(/\r?\n/gi, "<br>");
            }
            content=content.replace(/^<br>(\s)*<br>/, "").replace(/<br>(\s)*<br>$/, "").replace(/(<br>(\s)*){2,}/g, "<br>");
            insertContent(content);
        },1)
    }

    $(document).ready(function () {
        initEmotionPage();
        initEmotionFunction();
        var edt = $("#chatInputTextarea")[0];
        if (edt.addEventListener) {
            edt.addEventListener("paste", pasteHandler, false);
        } else {
            edt.attachEvent("onpaste", pasteHandler);
        }
    });

})
(jQuery);