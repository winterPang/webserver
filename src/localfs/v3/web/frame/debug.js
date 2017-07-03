$(function() {
    var temp = [
        "<tr id='[name]'>",
        "<td class='name'>[name]", "</td>",
        "<td class='http'>[http]", "</td>",
        "<td class='body'>[body]", "</td>",
        "<td class='status'>", "</td>",
        "<td class='data'>", "</td>",
        "<td class='author'>[author]", "</td>",
        "</tr>"
    ].join("");

    function ajaxTest(obj, f) {
        
        obj.url = obj.url.replace("MyConfig.path", MyConfig.path).replace("FrameInfo.ACSN", FrameInfo.ACSN);
        initHtml(obj);
        var startTime = new Date();
        $.ajax({
            type: obj.type,
            url: obj.url,
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(obj.data) || "",
            complete: function(XMLHttpRequest, textStatus) {
                var endTime = new Date();
                f & f(obj, XMLHttpRequest, endTime.getSeconds() - startTime.getSeconds());
            }
        })
    }

    function initHtml(obj) {
        $("#apiTestResult")
            .append(temp.replace(/\[name\]/g, obj.name)
                .replace(/\[http\]/g, obj.type)
                .replace(/\[body\]/g, JSON.stringify(obj.data) || "-")
                .replace(/\[url\]/g, obj.url)
                .replace(/\[author\]/g, obj.author)
            );
    }
    function updateHtml(obj, XMLHttpRequest, time) {
        $("#" + obj.name + " .name").html(obj.name + "<hr>" + time + "(s)");
        $("#" + obj.name + " .status").text(XMLHttpRequest.status);
        if (XMLHttpRequest.status !== 200) {
            $("#" + obj.name).css('background-color', 'red');
        }
        $("#" + obj.name + " .data").html(obj.url + "<hr>" + XMLHttpRequest.responseText.substr(0, 352));
    }
    var oTemp = [
        '<form class="form-horizontal form hide" id="restApiTest">',
        '<div class="modal-header">',
        '<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>',
        '<h3 class="modal-title">接口测试</h3>',
        '</div>',
        '<div class="modal-body col-sm-12">',
        '<table border="1" id="apiTestResult">',
        '<tr class="title">',
        '<th>借口名称</th>',
        '<th>http</th>',
        '<th>body</th>',
        '<th>请求状态</th>',
        '<th>数据</th>',
        '<th>作者</th>',
        '</tr>',
        '</table>',
        '</div>',
        '<div class="modal-footer form-actions">',
        '<a class="btn btn-primary" dlgtype="Close" data-dismiss="modal">',
        '<i class="icon-remove"></i> 关闭',
        '</a>',
        '</div>',
        '</form>'
    ].join("");


    if ($("#restApiTest").length == 0) {
        $("body").append(oTemp);
    }

    var jsonFile = document.URL.split("frame/")[1].split(".html")[0] + ".json";
    $.getJSON(jsonFile, function(data) {//获取对应的 json文件


        $("div[debug]").live("dblclick", function() {
            $("#apiTestResult").empty().append('<tr id="title"><th>测试项目</th><th>http</th><th>body</th><th>请求状态</th><th>数据</th><th>作者</th></tr>');
            Utils.Base.openDlg(null, {}, { scope: $("#restApiTest"), className: "modal-super dashboard" });

            var item = $(".active")[0].getAttribute("data-value");//一级标题

            var menuHref = $(".active a").attr("href").split("#")[1];//二级标题

            var methodArr = $(this).attr("debug").split(" ");

            var testList = data[item][menuHref];
            methodArr.forEach(function(name) {
                ajaxTest(testList[name], updateHtml);
            }, this);
        });



    });
});
