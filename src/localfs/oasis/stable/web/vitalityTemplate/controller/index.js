/**
 * Created by wangweifang on 2017/3/30.
 */
var URL_POST_UPLOAD = "/v3/ace/oasis/auth-data/o2oportal/pagetemplate/upload";
var URL_POST_DELETE = "/v3/ace/oasis/auth-data/o2oportal/pagetemplate/deleteFiles";
var URL_POST_PUBLISH = "/v3/ace/oasis/auth-data/o2oportal/pagetemplate/publish";

//get url params
function getUrlParam(name) {
    var reg = new RegExp(name + '=.[^&]*');
    return location.href.match(reg)[0].split('=')[1];
}
var templateId = getUrlParam('templateId');
var pageType = getUrlParam('pageType');
var URL_EDIT_GET = '/v3/ace/oasis/auth-data/o2oportal/pagetemplate/edit?templateId=' + templateId + '&pageType=' + pageType;

function loadDrag() {
    if ($(".sortable").length) {
        $(".sortable").sortable();
        $(".sortable").disableSelection();
    }
}
function show_single_edit(e, me) {
    e.stopPropagation();
    single_flag = false;
    single_sref = me;
    $(".active").find('.show_edit_area').hide();
    $(".edit_single", $(".active")).show();
    $(".edit_single .preview", $(".active")).attr("src", $('img', $(me)).attr('src'));
    $(".double_text", $(".active")).val($('[class*=single_map_text]', $(me)).text());
}
function show_double_edit(e, me) {
    e.stopPropagation();
    double_flag = false;
    double_sref = me;
    $(".active").find('.show_edit_area').hide();
    $(".edit_double", $(".active")).show();
    $(".edit_double .preview", $(".active")).attr("src", $('img', $(me)).attr('src'));
    $(".double_left_text", $(".active")).val($('[class*=edit_left_text]', $(me)).text());
    $(".double_right_text", $(".active")).val($('[class*=edit_right_text]', $(me)).text());
}
function show_logo_edit(e, me) {
    e.stopPropagation();
    logo_flag = false;
    $(".active").find('.show_edit_area').hide();
    $("div.logo_area .logo_map", $(".active")).css("border", "1px dashed #4ec1b2");
    $("div.logo_area", $(".active")).css("border", "1px dashed #4ec1b2");
    $("div.edit_logo", $(".active")).show();
    $("div.edit_logo .preview", $(".active")).attr("src", $("img", $(me)).attr("src"));
    $(".logo_text", $(".active")).val($(".logo_map_text", $(me)).text());
}
function show_video_edit(e, me) {
    e.stopPropagation();
    video_flag = false;
    video_sref = me;
    $(".active").find('.show_edit_area').hide();
    $("div.edit_video", $(".active")).show();
    $("div.edit_video .preview", $(".active")).attr("src", $("source", $(me)).attr("src"));
    $("div.edit_video video", $(".active")).load();
}
function show_background_edit(e, me) {
    var reg = /url\((['"]{0,1})(.*)\1\)/ig;
    var str = me.style.backgroundImage;
    var r = reg.exec(str);
    if (r && r[2]) {
        e.stopPropagation();
        background_flag = false;
        $(".draw_demo", $(".active")).css("border", "1px dashed #4ec1b2");
        $(".active").find('.show_edit_area').hide();
        $("div.edit_background", $(".active")).show();
        $("div.edit_background .preview", $(".active")).attr("src", r[2]);
    }
}
function click_event_delegate() {
    $('.tab-content').delegate('.ui-sortable-handle, .draw_demo', 'click', function (e) {
        e.stopPropagation();
        var claName = $(this).attr('class');
        if (claName.indexOf('video_area') != -1) {
            show_video_edit(e, this);
        } else if (claName.indexOf('single_map_area') != -1) {
            show_single_edit(e, this);
        } else if (claName.indexOf('logo_area') != -1) {
            show_logo_edit(e, this);
        } else if (claName.indexOf('draw_demo') != -1) {
            show_background_edit(e, this);
        } else if (claName.indexOf('double_maps_area') != -1) {
            show_double_edit(e, this);
        }
    });
}
$('.navleft').delegate('li', 'click', function () {
    if (this.className != 'logo_control') {
        $('.draw_demo', $('.active'))[0].scrollTop = $('.draw_demo', $('.active'))[0].scrollHeight;
    }
});
var counts;

$.ajax({
    type: "GET",
    url: URL_EDIT_GET,
    processData: false,//告诉jquery不要去处理发送的数据
    success: function (data) {
        if (!data.errorcode) {
            var home_data = utf8to16(decode64(data.data));
            $("#home .content_draw").html("");
            $("#home .content_draw").html(home_data);
            loadDrag();
            $.ajax({
                type: "GET",
                url: '/v3/ace/oasis/auth-data/o2oportal/pagetemplate/edit?templateId=' + templateId + '&pageType=2',
                processData: false,
                success: function (data) {
                    if (data.errorcode == 0) {
                        var page_data = utf8to16(decode64(data.data));
                        $("#login .content_draw").html("");
                        $("#login .content_draw").html(page_data);
                        loadDrag();
                        var tabs = ['wechat', 'phone', 'user'];
                        $.each(tabs, function () {
                            $('.' + this + '-link').show();
                        });
                        $('.form-tab li.' + tabs[0] + '-link').addClass('.form-box .form-tabs .form-tab-items > div.active');
                        $('.form-tab-items > div.' + tabs[0]).show();
                        $('.form-tab li').each(
                            function (i, tab) {
                                $(tab).unbind('click').bind('click', function () {
                                    $(this).addClass('active').siblings().removeClass('active');
                                    $('.form-tab-items > div').eq(i).show().siblings().hide();
                                });
                            });
                        $.ajax({
                            type: "GET",
                            url: '/v3/ace/oasis/auth-data/o2oportal/pagetemplate/edit?templateId=' + templateId + '&pageType=3',
                            processData: false,
                            success: function (data) {
                                if (data.errorcode == 0) {
                                    var page_data = utf8to16(decode64(data.data));
                                    $("#login_success .content_draw").html("");
                                    $("#login_success .content_draw").html(page_data);
                                    loadDrag();
                                    $.ajax({
                                        type: "GET",
                                        url: '/v3/ace/oasis/auth-data/o2oportal/pagetemplate/edit?templateId=' + templateId + '&pageType=4',
                                        processData: false,
                                        success: function (data) {
                                            if (data.errorcode == 0) {
                                                var page_data = utf8to16(decode64(data.data));
                                                $("#main .content_draw").html("");
                                                $("#main .content_draw").html(page_data);
                                                loadDrag();
                                                counts = {
                                                    "carousel_control": 0,
                                                    "single_control": $('.tab-content').find('[class*=single_map_area]').length,
                                                    "double_control": $('.tab-content').find('[class*=double_maps_area]').length,
                                                    "double_control": 0,
                                                    "video_control": $('.tab-content').find('[class*=video_area]').length
                                                };
                                                click_event_delegate();
                                            } else {
                                                // alert("请求失败了，请刷新页面");
                                            }
                                        },
                                        error: function () {
                                            // alert("请求失败了，请刷新页面");
                                        }
                                    });
                                } else {
                                    // alert("请求失败了，请刷新页面");
                                }
                            },
                            error: function () {
                                // alert("请求失败了，请刷新页面");
                            }
                        });
                    } else {
                        // alert("请求失败了，请刷新页面");
                    }
                },
                error: function () {
                    // alert("请求失败了，请刷新页面");
                }
            });
        } else {
            alert("'页面模板'请求失败了，请刷新页面");
        }
    },
    error: function () {
        alert("'页面模板'请求失败了，请刷新页面");
    }
});
function edit_logo_hide() {
    $(".edit_logo", $(".active")).hide();
    $("div.logo_area .logo_map", $(".active")).css("border", "0 dashed #4ec1b2");
    $("div.logo_area", $(".active")).css("border", "0 dashed #4ec1b2");
    $("div.edit_logo input.upload-url", $(".active")).val("");
    $("div.edit_logo .file_upload", $(".active")).val("");
    $(".logo_img_check", $(".active")).text("* 图片大小不超过1M");
    $(".logo_img_check", $(".active")).css("color", "#666666");
    $(".logo_txt_check", $(".active")).css("color", "#666666");
    $("div.edit_logo div.logo_container  img", $(".active")).attr("src", "../../images/logo_bg.jpg");
    $("div.edit_logo input.logo_text", $(".active")).val("");
}
function edit_single_hide() {
    $("div.edit_single", $(".active")).hide();
    $(".single_img_check", $(".active")).text("* 图片大小不超过1M");
    $(".single_img_check", $(".active")).css("color", "#666666");
    $(".single_txt_check", $(".active")).css("color", "#666666");
    $("div.edit_single input.upload-url", $(".active")).val("");
    $("div.edit_single .file_upload", $(".active")).val("");
    $("div.edit_single div.image_container img", $(".active")).attr("src", "../../images/wave.png");
    $("div.edit_single input.single_text", $(".active")).val("");
}
function edit_background_hide() {
    $(".draw_demo", $(".active")).css("border", "0 dashed #4ec1b2");
    $("div.edit_background", $(".active")).hide();
    $(".background_img_check", $(".active")).text("* 图片大小不超过1M");
    $(".background_img_check", $(".active")).css("color", "#666666");
    $("div.edit_background input.upload-url", $(".active")).val("");
    $("div.edit_background .file_upload", $(".active")).val("");
    $("div.edit_background div.image_container img", $(".active")).attr("src", "../../images/wave.png");
}
function edit_video_hide() {
    $(".edit_video", $(".active")).hide();
    $(".video_check", $(".active")).text("* 图片大小不超过1M");
    $(".video_check", $(".active")).css("color", "#666666");
    $("div.edit_video input.upload-url", $(".active")).val("");
    $("div.edit_video .file_upload", $(".active")).val("");
    $("div.edit_video video.preview source", $(".active")).attr("src", "");
}
//左侧组件点击事件
$(".single_control,.double_control,.background_control,.video_control,.logo_control,.audio_control").click(function () {
    $(this).toggleClass("right-bg");
    if ($(this).hasClass('li-bg')) {
        $(this).removeClass('li-bg').addClass('right-bg');
    } else {
        $(this).removeClass('right-bg').addClass('li-bg');
    }
    $(this).siblings("li").addClass('li-bg').removeClass('right-bg');

});
//追加单图demo

//左侧音频组件点击事件
$(".audio_control").click(function () {
    $(".audio_area", $(".active")).css("border", "1px dashed #4ec1b2");
    $("div.audio_area", $(".active")).show();
    $("div.edit_audio", $(".active")).show();
    $("div.audio_area audio source").attr("src", "");

});
//组件编辑框“浏览文件”按钮
$("div.edit_single,div.edit_background,div.edit_logo,div.edit_audio,div.edit_video,div.edit_double .upload .upload-input-file", $(".active")).change(function () {
    if ($(this).parent().html().indexOf("class=\"upload-url\"") != -1) {
        var fileUrl = $(this).val();
        $(this).parent().children(".upload-url").val(fileUrl);
    }
    else {
        var fileUrl = $(this).val();
        var urlArr = fileUrl.split("\\");
        var getName = urlArr[urlArr.length - 1];//截取路径并获取文件的名字
        $(this).parent().children(".upload-tip").text(getName).fadeIn("slow");
        //$(this).parent().children(".upload-btn").val(getName);//按钮上变成文件名称
        timeout = setTimeout(function () {
            $(".upload-tip").fadeOut("slow");
        }, 5000);
    }
});

//左侧logo组件点击事件
var logo_flag;
$(".logo_control").click(function () {
    logo_flag = true;
    $("div.logo_area", $(".active")).show();
    $("div.logo_area .logo_map", $(".active")).css("border", "1px dashed #4ec1b2");
    $("div.logo_area", $(".active")).css("border", "1px dashed #4ec1b2");
    $(".active").find('.show_edit_area').hide();
    $("div.edit_logo", $(".active")).show();
    $('div.edit_logo .complete-upload-btn', $(".active")).attr('disabled', "disabled");
//手机框内logo点击事件
    $("div.logo_area").click(function (e) {
        show_logo_edit(e, this);
    });
});
//首页 logo组件编辑框 绑定在div中预览
var dataURL_logo;
var fsURL_logo = [];
var logo_oldValue;
$("div.edit_logo .file_upload").change(function () {
    if (this.value) {
        // var oldValue = this.value;
        logo_oldValue = this.value;
        $('div.edit_logo .upload-url', $(".active")).val(logo_oldValue);
    }
    var $file = $(this);
    var fileObj = $file[0];
    var windowURL = window.URL || window.webkitURL;
    var $img = $("div.edit_logo .preview", $(".active"));

    if (fileObj && fileObj.files && fileObj.files[0]) {
        fileSize = fileObj.files[0].size;
        var size = fileSize / 1024;
        var name = fileObj.value;
        var fileName = name.substring(name.lastIndexOf(".") + 1).toLowerCase();
        if (fileName != "jpg" && fileName != "jpeg" && fileName != "pdf" && fileName != "png" && fileName != "dwg" && fileName != "gif") {
            $('div.edit_logo .complete-upload-btn', $(".active")).attr('disabled', 'disabled');
            $(".logo_img_check", $(".active")).text("请上传图片格式jpg, png等");
            $(".logo_img_check", $(".active")).css("color", "red");
            $('div.edit_logo .upload-url', $(".active")).val("");
            $img.attr('src', '../../images/logo_bg.jpg');
            return;
        } else if (size > 1000) {
            $('div.edit_logo .complete-upload-btn', $(".active")).attr('disabled', "disabled");
            $(".logo_img_check", $(".active")).css("color", "red");
            $('div.edit_logo .upload-url', $(".active")).val("");
            $img.attr('src', '../../images/logo_bg.jpg');
            return;
        }
        $(".logo_img_check", $(".active")).text("* 图片大小不超过1M");
        $(".logo_img_check", $(".active")).css("color", "#666666");
        dataURL_logo = windowURL.createObjectURL(fileObj.files[0]);
        $img.attr('src', dataURL_logo);
        $('div.edit_logo .complete-upload-btn', $(".active")).removeAttr("disabled");
    }
});
//监听 logo_text 框输入改变事件
$(".logo_text").on("input propertychange", function () {
    if (dataURL_logo == undefined) {
        alert("请先上传图片!");
        $(".logo_text", $(".active")).val("");
    }
    if (dataURL_logo.length > 0 && $(this).val().length > 16) {
        $(".logo_txt_check", $(".active")).css("color", "red");
        $('div.edit_logo .complete-upload-btn', $(".active")).attr('disabled', "disabled");
    } else {
        $(".logo_txt_check", $(".active")).css("color", "#666666");
        $('div.edit_logo .complete-upload-btn', $(".active")).removeAttr("disabled");
    }
});
//logo组件编辑框"完成上传"按钮
$("div.edit_logo .complete-upload-btn").click(function () {
    $(this, $(".active")).attr("disabled", "disabled");
    if (logo_flag || $("div.edit_logo input.upload-url", $(".active")).val()) {
        $.ajax({
            type: "POST",
            url: URL_POST_UPLOAD,
            cache: false,
            processData: false,
            contentType: false,
            enctype: 'multipart/form-data',
            data: new FormData($(".logoForm", $(".active"))[0]),
            success: function (data) {
                if (data.errorcode == 0) {
                    fsURL_logo.push(data.data.substring(21));
                    $("img.mobile_logo_map", $(".active")).attr("src", data.data);
                    // $("img.mobile_logo_map", $(".active")).show();
                    $("div.logo_area .logo_map", $(".active")).css("border", "0 dashed #4ec1b2");
                    $("div.logo_area", $(".active")).css("border", "0 dashed #4ec1b2");
                    $("div.edit_logo", $(".active")).hide();
                    $("div.edit_logo input.upload-url", $(".active")).val("");
                    $("div.edit_logo .file_upload", $(".active")).val("");
                    $("div.edit_logo div.logo_container  img", $(".active")).attr("src", "../../images/logo_bg.jpg");
                    $("div.edit_logo input.logo_text", $(".active")).val("");
                } else {
                    alert("上传logo失败啦，请重新上传");
                    $("div.edit_logo input.upload-url", $(".active")).val("");
                    $("div.edit_logo .file_upload", $(".active")).val("");
                }
                $("div.edit_logo .complete-upload-btn", $(".active")).removeAttr("disabled");
            },
            error: function () {
                alert("上传logo失败啦，请重新上传");
                $("div.logo_area .logo_map", $(".active")).css("border", "0 dashed #4ec1b2");
                $("div.logo_area", $(".active")).css("border", "0 dashed #4ec1b2");
                $("div.edit_logo", $(".active")).hide();
                $("div.edit_logo input.upload-url", $(".active")).val("");
                $("div.edit_logo .file_upload", $(".active")).val("");
                $("div.edit_logo div.logo_container img", $(".active")).attr("src", "../../images/logo_bg.jpg");
                $("div.edit_logo input.logo_text", $(".active")).val("");
                $("div.edit_logo .complete-upload-btn", $(".active")).removeAttr("disabled");
            }
        });
    } else {
        $("div.edit_logo .complete-upload-btn", $(".active")).removeAttr("disabled", "disabled");
    }
    $(".logo_map_text", $(".active")).text($(".logo_text", $(".active")).val());
    $("div.edit_logo", $(".active")).hide();
    $("div.logo_area .logo_map", $(".active")).css("border", "0 dashed #4ec1b2");
    $("div.logo_area", $(".active")).css("border", "0 dashed #4ec1b2");
});

//logo组件编辑框“删除元件”按钮
$("div.edit_logo button.del_btn_logo").click(function () {
    $.ajax({
        type: "POST",
        url: URL_POST_DELETE,
        cache: false,
        processData: false,
        contentType: "application/json",
        data: JSON.stringify({"metas": fsURL_logo}),
        success: function (data) {
            if (data.errorcode == 0) {
                $("img.mobile_logo_map", $(".active")).attr("src", "../../images/logo_bg.jpg");
                $(".logo_map_text", $(".active")).text("");
                $("div.logo_area", $(".active")).hide();
                $("div.logo_area .logo_map", $(".active")).css("border", "0 dashed #4ec1b2");
                $("div.logo_area", $(".active")).css("border", "0 dashed #4ec1b2");
                edit_logo_hide();

                // $("div.edit_logo", $(".active")).hide();
                // $("div.edit_logo input.upload-url", $(".active")).val("");
                // $("div.edit_logo .file_upload", $(".active")).val("");
                // $("div.edit_logo div.image_container img", $(".active")).attr("src", "../../images/wave.png");
                // $("div.edit_logo input.logo_text", $(".active")).val("");
                // $(".logo_img_check", $(".active")).text("* 图片大小不超过1M");
                // $(".logo_img_check", $(".active")).css("color", "#666666");
                // $(".logo_txt_check", $(".active")).css("color", "#666666");
            } else if (data.errorcode == 1006) {
                alert("抱歉，文件系统错误，请再次点击“删除logo”");
            } else {
                alert("抱歉，删除文件失败，请再次点击“删除logo”");
            }
        },
        error: function () {
            alert("抱歉，删除文件失败，请再次点击“删除logo”");
        }
    })
});


//以下是“音频”组件点击，编辑事件
//音频浏览的音乐绑定在div中预览
var dataURL_audio;
$("div.home_page .edit_audio .file_upload").change(function () {
    var $file = $(this);
    var fileObj = $file[0];
    var windowURL = window.URL || window.webkitURL;
    // var dataURL;
    var $img = $("div.home_page .edit_audio audio.preview source");

    if (fileObj && fileObj.files && fileObj.files[0]) {
        dataURL_audio = windowURL.createObjectURL(fileObj.files[0]);
        $img.attr('src', dataURL_audio);
        $("div.home_page .edit_audio audio.preview").load();
    } else {
        dataURL_audio = $file.val();
        var imgObj = $("div.home_page .edit_audio audio.preview source");
        imgObj.filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src = dataURL_audio;
    }
});
//音频组件编辑框"完成上传"按钮
$("div.home_page .edit_audio .complete-upload-btn").click(function () {
    $("div.home_page .audio_area audio source").attr("src", dataURL_audio);
    $("div.home_page .audio_area audio").load();
    //发请求，请求success后执行下面
    $("div.edit_audio").hide();
    $("div.edit_audio audio.preview source").attr("src", "");
    $("div.edit_logo .file_upload", $(".active")).val("")
    $(".audio_area").css("border", "0");
});
//音频组件编辑框“删除元件”按钮
$("div.home_page .edit_audio button.del_btn_audio").click(function () {
    $("div.edit_audio").hide();
    $("div.edit_audio audio.preview source").attr("src", " ");
    // $(".audio_area").css("border", "0");
    $("#home div.audio_area").hide();

});


var single_sref;
var single_flag;
//单图组件点击，追加单图demo事件
$(".single_control").click(function () {
    counts.single_control++;
    single_flag = true;
    $(".mobile_area", $(".active")).append(
        '<div class="single_map_area' + counts.single_control + ' ui-sortable-handle">' +
        '<div class="single_map">' +
        '<img class="mobile_single_map' + counts.single_control + '" src="../../images/wave.png" style="width:100%;">' +
        '</div>' +
        '<div class="single_map_text' + counts.single_control + '">' +
        '</div>' +
        '</div>'
    );

    $(".active").find('.show_edit_area').hide();
    $("div.edit_single", $(".active")).show();
    $('div.edit_single .complete-upload-btn', $(".active")).attr('disabled', "disabled");
    //手机框内单图点击事件
    $(".single_map_area" + counts.single_control).click(function (e) {
        show_single_edit(e, this);
    });
});
//单图绑定在div中预览
var dataURL_single;
var fsURL_single = [];
var single_oldValue;
$("div.edit_single .file_upload").change(function () {
    if (this.value) {
        single_oldValue = this.value;
        $('div.edit_single .upload-url', $(".active")).val(single_oldValue);
    }
    var fileSize = 0;
    var $file = $(this);
    var fileObj = $file[0];
    var windowURL = window.URL || window.webkitURL;
    var $img = $("div.edit_single .preview", $(".active"));

    if (fileObj && fileObj.files && fileObj.files[0]) {
        fileSize = fileObj.files[0].size;
        var size = fileSize / 1024;
        var name = fileObj.value;
        var fileName = name.substring(name.lastIndexOf(".") + 1).toLowerCase();
        if (fileName != "jpg" && fileName != "jpeg" && fileName != "pdf" && fileName != "png" && fileName != "dwg" && fileName != "gif") {
            $('div.edit_single .complete-upload-btn', $(".active")).attr('disabled', "disabled");
            $(".single_img_check", $(".active")).text("请上传图片格式jpg, png等");
            $(".single_img_check", $(".active")).css("color", "red");
            $('div.edit_single .upload-url', $(".active")).val("");
            $img.attr('src', '../../images/wave.png');
            return;
        } else if (size > 1000) {
            $('div.edit_single .complete-upload-btn', $(".active")).attr('disabled', "disabled");
            $(".single_img_check", $(".active")).css("color", "red");
            $('div.edit_single .upload-url', $(".active")).val("");
            $img.attr('src', '../../images/wave.png');
            return;
        }
        $(".single_img_check", $(".active")).text("* 图片大小不超过1M");
        $(".single_img_check", $(".active")).css("color", "#666666");
        dataURL_single = windowURL.createObjectURL(fileObj.files[0]);
        $img.attr('src', dataURL_single);
        $('div.edit_single .complete-upload-btn', $(".active")).removeAttr("disabled");
    }
});
//监听 single_text 框输入改变事件
$(".single_text").on("input propertychange", function () {
    if (dataURL_single == undefined) {
        alert("请先上传图片!");
        $(".single_text", $(".active")).val("");
    }
    if (dataURL_single.length > 0 && $(this).val().length > 48) {
        $(".single_txt_check", $(".active")).css("color", "red");
        $('div.edit_single .complete-upload-btn', $(".active")).attr('disabled', "disabled");
    } else {
        $('div.edit_single .complete-upload-btn', $(".active")).removeAttr("disabled");
        $(".single_txt_check", $(".active")).css("color", "#666666");
    }
});
//单图组件编辑框"完成上传"按钮
$("div.edit_single .complete-upload-btn").click(function () {
    $(this, $(".active")).attr('disabled', "disabled");
    if (single_flag || $("div.edit_single input.upload-url", $(".active")).val()) {
        $.ajax({
            type: "POST",
            url: URL_POST_UPLOAD,
            cache: false,
            processData: false,
            contentType: false,
            enctype: 'multipart/form-data',
            data: new FormData($(".singleForm", $(".active"))[0]),
            success: function (data) {
                if (data.errorcode == 0) {
                    fsURL_single.push(data.data.substring(21));
                    if (single_flag) {
                        $("img.mobile_single_map" + counts.single_control, $(".active")).attr("src", data.data);
                    } else {
                        $('[class="' + single_sref.className + '"]' + ' img', $(".active")).attr("src", data.data);
                    }
                    $("div.edit_single", $(".active")).hide();
                    $("div.edit_single input.upload-url", $(".active")).val("");
                    $("div.edit_single .file_upload", $(".active")).val("");
                    $("div.edit_single div.image_container img", $(".active")).attr("src", "../../images/wave.png");
                    $("div.edit_single input.single_text", $(".active")).val("");

                } else {
                    alert("上传单图失败啦，请重新上传");
                    $("div.edit_single input.upload-url", $(".active")).val("");
                    $("div.edit_single .file_upload", $(".active")).val("");
                }
                $('div.edit_single .complete-upload-btn', $('.active')).removeAttr("disabled");
            },
            error: function () {
                alert("上传单图失败啦，请重新上传");
                $("div.edit_single input.upload-url", $(".active")).val("");
                $("div.edit_single .file_upload", $(".active")).val("");
                $('div.edit_single .complete-upload-btn', $('.active')).removeAttr("disabled");
            }
        });
    } else {
        $("div.edit_single .complete-upload-btn").removeAttr("disabled", "disabled");
    }
    if (single_flag) {
        $(".single_map_text" + counts.single_control, $(".active")).text($(".single_text", $(".active")).val());
    } else {
        $("[class='" + single_sref.className + "'] [class*=single_map_text]", $(".active")).text($(".single_text", $(".active")).val());
    }
    $("div.edit_single", $(".active")).hide();
});
//单图组件编辑框“删除元件”按钮
$("div.edit_single button.del_btn_single").click(function () {
    $.ajax({
        type: "POST",
        url: URL_POST_DELETE,
        cache: false,
        processData: false,
        contentType: "application/json",
        data: JSON.stringify({"metas": fsURL_single}),
        success: function (data) {
            if (data.errorcode == 0) {
                if (single_flag) {
                    $(".single_map_area" + counts.single_control, $(".active")).remove();
                } else {
                    $(single_sref, $(".active")).remove();
                }
                edit_single_hide();
            } else if (data.errorcode == 1006) {
                alert("抱歉，文件系统错误，请再次点击“删除单图”");
            } else {
                alert("抱歉，删除文件失败，请再次点击“删除单图”");
            }
        },
        error: function () {
            alert("抱歉，删除文件失败，请再次点击“删除单图”");
        }
    });
});

//以下是“双图”组件点击，编辑事件
var double_sref;
var double_flag;
//双图组件点击，追加双图demo事件
$(".double_control").click(function () {
    counts.double_control++;
    double_flag = true;
    $(".mobile_area", $(".active")).append(
        '<div class="double_maps_area' + counts.double_control + ' ui-sortable-handle">' +
        '<div class="double_left_area">' +
        '<div class="double_left">' +
        '<img class="double_left_img"+counts.double_control src="../../images/wave.png">' +
        '</div>' +
        '<div class="double_left_text' + counts.double_control + '">' +
        '</div>' +
        '</div>' +
        '<div  class="double_right_area">' +
        '<div class="double_right">' +
        '<img class="double_right_img"+counts.double_control src="../../images/wave.png">' +
        '</div>' +
        '<div class="double_right_text' + counts.double_control + '">' +
        '</div>' +
        '</div>'
    );
    $(".active").find('.show_edit_area').hide();
    $("div.edit_double", $(".active")).show();
    $('div.edit_double .complete-upload-btn', $(".active")).attr('disabled', "disabled");
    //手机框内双图点击事件
    $(".double_maps_area" + counts.double_control).click(function (e) {
        show_double_edit(e, me)
    });

});
//双图绑定在div中预览
var dataURL_double1;
var dataURL_double2;
var double_oldValue;
$("div.edit_double .file_upload").change(function () {
    if (this.value) {
        double_oldValue = this.value;
        $('div.edit_double .upload-url', $(".active")).val(double_oldValue);
    }
    var $file = $(this);
    var fileObj = $file[0];
    var windowURL = window.URL || window.webkitURL;
    // var dataURL;
    var $img = $("div.edit_double .preview", $(".active"));

    if (fileObj && fileObj.files && fileObj.files[0]) {

        dataURL_double1 = windowURL.createObjectURL(fileObj.files[0]);
        dataURL_double2 = windowURL.createObjectURL(fileObj.files[1]);
        console.info(dataURL_double1);
        console.info(dataURL_double2);
        $img.attr('src', dataURL_double1);
        $(".edit_double .double_left_preview", $(".active")).attr('src', dataURL_double1);
        $(".edit_double .double_right_preview", $(".active")).attr('src', dataURL_double2);
    }
});
//双图组件编辑框"完成上传"按钮
$("div.edit_double .complete-upload-btn").click(function () {
    $("double_left_img" + counts.double_control, $(".active")).attr("src", dataURL_double1);
    $("double_right_img" + counts.double_control, $(".active")).attr("src", dataURL_double2);
    var value_left = "";
    value_left = value_left + $(".double_left_text", $(".active")).val();
    $(".single_map_text" + counts.single_control, $(".active")).text(value_left);
    //发请求，请求success后执行下面
    // $("div.edit_single", $(".active")).hide();
    // $("div.edit_single input.upload-url", $(".active")).val(" ");
    // $("div.edit_single div.image_container img", $(".active")).attr("src", "../../images/wave.png");
    // $("div.edit_single input.single_text", $(".active")).val(" ");
});


//以下是“背景”组件点击，编辑事件
//左侧背景点击事件
var background_flag;
$(".background_control").click(function () {
    background_flag = true;
    $(".draw_demo", $(".active")).css("border", "1px dashed #4ec1b2");
    $(".active").find('.show_edit_area').hide();
    $("div.edit_background", $(".active")).show();
    $('div.edit_background .complete-upload-btn', $(".active")).attr('disabled', "disabled");
    //手机框内背景点击事件
    $("div.draw_demo").click(function (e) {
        show_background_edit(e, this);
    });
});

//浏览的图片绑定在div中预览
var dataURL_background;
var fsURL_background = [];
// var fsURL_background_src;
var background_oldValue;
$(".edit_background .file_upload").change(function () {
    if (this.value) {
        background_oldValue = this.value;
        $('div.edit_background .upload-url', $(".active")).val(background_oldValue);
    }
    var $file = $(this);
    var fileObj = $file[0];
    var windowURL = window.URL || window.webkitURL;
    var $img = $(".edit_background .preview", $(".active"));

    if (fileObj && fileObj.files && fileObj.files[0]) {
        fileSize = fileObj.files[0].size;
        var size = fileSize / 1024;
        var name = fileObj.value;
        var fileName = name.substring(name.lastIndexOf(".") + 1).toLowerCase();
        if (fileName != "jpg" && fileName != "jpeg" && fileName != "pdf" && fileName != "png" && fileName != "dwg" && fileName != "gif") {
            $('div.edit_background .complete-upload-btn', $(".active")).attr('disabled', 'disabled');
            $(".background_img_check", $(".active")).text("请上传图片格式jpg, png等");
            $(".background_img_check", $(".active")).css("color", "red");
            $('div.edit_background .upload-url', $(".active")).val("");
            $img.attr('src', '../../images/wave.png');
            return;
        } else if (size > 1000) {
            $('div.edit_background .complete-upload-btn', $(".active")).attr('disabled', "disabled");
            $(".background_img_check", $(".active")).css("color", "red");
            $('div.edit_background .upload-url', $(".active")).val("");
            $img.attr('src', '../../images/wave.png');
            return;
        }
        $(".background_img_check", $(".active")).text("* 图片大小不超过1M");
        $(".background_img_check", $(".active")).css("color", "#666666");
        dataURL_background = windowURL.createObjectURL(fileObj.files[0]);
        $img.attr('src', dataURL_background);
        $('div.edit_background .complete-upload-btn', $(".active")).removeAttr("disabled");
    }
});
//背景组件编辑框"完成上传"按钮
$(".edit_background .complete-upload-btn").click(function () {
    $(this, $(".active")).attr("disabled", "disabled");
    if (background_flag || $("div.edit_background input.upload-url", $(".active")).val()) {
        $.ajax({
            type: "POST",
            url: URL_POST_UPLOAD,
            cache: false,
            processData: false,
            contentType: false,
            enctype: 'multipart/form-data',
            data: new FormData($(".backgroundForm", $(".active"))[0]),
            success: function (data) {
                if (!data.errorcode) {
                    fsURL_background.push(data.data.substring(21));
                    // fsURL_background_src = data.data;
                    $(".draw_demo", $(".active")).css({
                        "background-image": "url(" + data.data + ")",
                        "background-repeat": "no-repeat"
                    });
                    $("div.edit_background", $(".active")).hide();
                    $("div.edit_background input.upload-url", $(".active")).val("");
                    $("div.edit_background .file_upload", $(".active")).val("");
                    $("div.edit_background div.image_container img", $(".active")).attr("src", "../../images/wave.png");
                    $(".draw_demo", $(".active")).css("border", "0");
                } else {
                    alert("上传背景失败啦，请重新上传");
                    $("div.edit_background input.upload-url", $(".active")).val("");
                    $("div.edit_background .file_upload", $(".active")).val("");
                }
                $('div.edit_background .complete-upload-btn', $(".active")).removeAttr("disabled");
            },
            error: function () {
                alert("上传背景失败啦，请重新上传");
                $("div.edit_background input.upload-url", $(".active")).val("");
                $("div.edit_background .file_upload", $(".active")).val("");
                $('div.edit_background .complete-upload-btn', $(".active")).removeAttr("disabled");
            }
        });
    } else {
        $(".edit_background .complete-upload-btn").removeAttr("disabled", "disabled");
    }
    $("div.edit_background", $(".active")).hide();
});
//背景组件编辑框“删除元件”按钮
$(".edit_background button.del_btn_background").click(function () {
    $.ajax({
        type: "POST",
        url: URL_POST_DELETE,
        cache: false,
        processData: false,
        contentType: "application/json",
        data: JSON.stringify({"metas": fsURL_background}),
        success: function (data) {
            if (data.errorcode == 0) {
                $(".draw_demo", $(".active")).css({
                    "background-image": "none",
                    "background-repeat": "no-repeat"
                });
                edit_background_hide();
            } else if (data.errorcode == 1006) {
                alert("抱歉，文件系统错误，请再次点击“删除背景”");
            } else {
                alert("抱歉，删除文件失败，请再次点击“删除背景”");
            }
        },
        error: function () {
            alert("抱歉，删除文件失败，请再次点击“删除背景”");
        }
    });
});

//左侧视频点击组件,追加视频
var video_sref;
var video_flag;
$(".video_control").click(function () {
    counts.video_control++;
    video_flag = true;
    $(".mobile_area", $(".active")).append(
        '<div class="video_area' + counts.video_control + ' ui-sortable-handle">' +
        '<video controls="controls">' +
        '<source src="" type="video/mp4">' +
        '<source src="" type="video/wmv">' +
        '<source src="" type="video/ogg">' +
        'Your browser does not support HTML5 video.' +
        '</video>' +
        '</div>'
    );
    $(".active").find('.show_edit_area').hide();
    $("div.edit_video", $(".active")).show();
    $('div.edit_video .complete-upload-btn', $(".active")).attr('disabled', "disabled");
    //手机框内 视频点击事件
    $(".video_area" + counts.video_control).click(function (e) {
        show_video_edit(e, this);
    });
});
//首页  视频绑定在div中预览
var dataURL_video;
var fsURL_video = [];
var video_oldValue;
$("div.edit_video .file_upload").change(function () {
    if (this.value) {
        video_oldValue = this.value;
        $('div.edit_video .upload-url', $(".active")).val(video_oldValue);
    }
    var $file = $(this);
    var fileObj = $file[0];
    var windowURL = window.URL || window.webkitURL;
    var $img = $("div.edit_video video.preview source");

    if (fileObj && fileObj.files && fileObj.files[0]) {
        fileSize = fileObj.files[0].size;
        var size = fileSize / 1024;
        var name = fileObj.value;
        var fileName = name.substring(name.lastIndexOf(".") + 1).toLowerCase();

        if (fileName != "mp4" && fileName != "wmv" && fileName != "ogg") {
            $('div.edit_video .complete-upload-btn', $(".active")).attr('disabled', 'disabled');
            $(".video_check", $(".active")).text(" * 视频支持MP4、WMV、ogg格式");
            $(".video_check", $(".active")).css("color", "red");
            $('div.edit_video .upload-url', $(".active")).val("");
            $img.attr('src', '../../images/wave.png');
            return;
        } else if (size > 1000) {
            $('div.edit_video .complete-upload-btn', $(".active")).attr('disabled', "disabled");
            $(".video_check", $(".active")).css("color", "red");
            $('div.edit_video .upload-url', $(".active")).val("");
            $img.attr('src', '../../images/wave.png');
            return;
        }
        $(".video_check", $(".active")).text("* 图片大小不超过1M");
        $(".video_check", $(".active")).css("color", "#666666");
        dataURL_video = windowURL.createObjectURL(fileObj.files[0]);
        $img.attr('src', dataURL_video);
        $(".edit_video video.preview", $(".active")).load();
        $('div.edit_video .complete-upload-btn', $(".active")).removeAttr("disabled");
    }
});

//首页  视频组件编辑框"完成上传"按钮
$("div.edit_video .complete-upload-btn").click(function () {
    $(this, $(".active")).attr('disabled', "disabled");
    if (video_flag || $("div.edit_video input.upload-url", $(".active")).val()) {
        $.ajax({
            type: "POST",
            url: URL_POST_UPLOAD,
            cache: false,
            processData: false,
            contentType: false,
            enctype: 'multipart/form-data',
            data: new FormData($(".videoForm", $(".active"))[0]),
            success: function (data) {
                if (data.errorcode == 0) {
                    fsURL_video.push(data.data.substring(21));
                    if (video_flag) {
                        $(".video_area" + counts.video_control + ' source', $(".active")).attr("src", data.data);
                        $(".video_area" + counts.video_control + ' video', $(".active")).load();
                    } else {
                        $("[class='" + video_sref.className + "'] source", $(".active")).attr("src", data.data);
                        $("[class='" + video_sref.className + "'] video", $(".active")).load();
                    }
                    // $(".video_area" + counts.video_control + ' source', $(".active")).attr("src", data.data);
                    // $(".video_area" + counts.video_control + ' video', $(".active")).load();
                    $("div.edit_video", $(".active")).hide();
                    $("div.edit_video input.upload-url", $(".active")).val("");
                    $("div.edit_video .file_upload", $(".active")).val("");
                    $("div.edit_video video.preview", $(".active")).attr("src", "");
                    $("div.edit_video video.preview source", $(".active")).attr("src", "");
                    $("div.edit_video video", $(".active")).load();
                } else {
                    alert("上传视频失败啦，请重新上传");
                    $("div.edit_video input.upload-url", $(".active")).val("");
                    $("div.edit_video .file_upload", $(".active")).val("");
                }
                $('div.edit_video .complete-upload-btn', $(".active")).removeAttr("disabled");
            },
            error: function () {
                alert("上传视频失败啦，请重新上传");
                $("div.edit_video input.upload-url", $(".active")).val("");
                $("div.edit_video .file_upload", $(".active")).val("");
                $('div.edit_video .complete-upload-btn', $(".active")).removeAttr("disabled");
            }
        });
    } else {
        $("div.edit_video .file_upload").removeAttr("disabled", "disabled");
    }
    $("div.edit_video", $(".active")).hide();
});

//首页 视频组件编辑框“删除元件”按钮
$("div.edit_video button.del_btn_video").click(function () {
    $.ajax({
        type: "POST",
        url: URL_POST_DELETE,
        cache: false,
        processData: false,
        contentType: "application/json",
        data: JSON.stringify({"metas": fsURL_video}),
        success: function (data) {
            if (!data.errorcode) {
                if (video_flag) {
                    $(".video_area" + counts.video_control, $(".active")).remove();
                } else {
                    $(video_sref, $(".active")).remove();
                }
                edit_video_hide();
            } else if (data.errorcode == 1006) {
                alert("抱歉，文件系统错误，请再次点击“删除视频”");
            } else {
                alert("抱歉，删除文件失败，请再次点击“删除视频”");
            }
        },
        error: function () {
            alert("抱歉，删除文件失败，请再次点击“删除视频”");
        }
    });
});
//发布
var v_encode = function (selector) {
    return encode64(utf16to8($(selector).html()));
};
$(".navbar-right .release").click(function () {
    var data_release = {
        templateId: templateId,
        contentHome: v_encode("#home .content_draw"),
        contentLogin: v_encode("#login .content_draw"),
        contentLoginSuccess: v_encode("#login_success .content_draw"),
        contentMain: v_encode("#main .content_draw")
    };
    $("div.logo_area .logo_map", $(".active")).css("border", "0 dashed #4ec1b2");
    $("div.logo_area", $(".active")).css("border", "0 dashed #4ec1b2");
    $(".draw_demo", $(".active")).css("border", "0 dashed #4ec1b2");
    $.ajax({
        type: "POST",
        url: URL_POST_PUBLISH,
        cache: false,
        processData: false,
        contentType: "application/json",
        data: JSON.stringify(data_release),
        success: function (data) {
            if (!data.errorcode) {
                alert("恭喜你,模板发布成功!")
            } else {
                alert("抱歉,发布配置失败，请再次点击“发布”");
            }
        },
        error: function () {
            alert("抱歉,发布配置失败，请再次点击“发布”");
        }
    });
});
//关闭编辑框
$(".edit_logo .edit_close").click(function () {
    edit_logo_hide();
});
$(".edit_single .edit_close").click(function () {
    edit_single_hide();
});
$(".edit_background .edit_close").click(function () {
    edit_background_hide();
});
$(".edit_video .edit_close").click(function () {
    edit_video_hide();
});


//免责声明
// $(".disclaimer", $(".active")).click(function () {
//     alert("免责声明");
// }




