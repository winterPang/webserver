/*
 Document   : Page Custom
 Created on : 2015-5-19
 Author     : kf2685
 Description: 页面定制功能的主要JS文件，为避免与其他脚本的命名冲突，函数命名请以Canvas开头。
 主要分为4个部分：CanvasControl(脚本入口，主函数)、CanvasUi(负责所有对Ui的操作)、CanvasWidget(负责对所有插件的操作)、CanvasLib(存放公共函数的对象)。
 */
(function (jq, undefined) {
    var canvasControl,parent;

    // 存放插件拓展功能菜单对象
    jq.canvasControl = {
        uiRoles: {},
        widgetRoles: {
            editMain: [],
            editRich: [],
            editMulti: []
        },
        ctrlRoles: {},
        ui: {}
    };

    /*
     * 主控制函数。
     * options {}类型的对象，对整体功能的参数设置。
     */
    function CanvasControl(options) {
        this.opts = jq.extend({
            // 画布语言，外部传入，默认为en
            lang: "zh",
            imageUploadPath: "",
            selectable: true,
            sortable: true,
            canvasSelector: "",
            // default edit tags
            editTags: ["div", "label", "span"],
            jsonCfg: {},
            tracker: ""
        }, options || {});
        // default panel style, can replace
        this.widgetStyle = {
            textPanelStyle: "",
            imagePanelStyle: ""
        };
        this.canvasContent;
        this.canvasForm;
        this.canvasUi;
        // 标识当前session是否过期1：未过期 0：过期
        this.session_expired = 1;
        // 绘制类型 PC/PHONE
        this.ctrlType;
    }

    /*
     * 初始化函数，负责页面所有UI的初始化
     */
    CanvasControl.prototype.init = function (jqContent) {
        this.canvasContent = jqContent;
        // 初始化画布UI
        if (!this.canvasUi) {
            this.canvasUi = new CanvasUi();
            this.canvasUi.init();
        }
        // 屏蔽掉超链接
        jq("div[class*='canvas-edited-text']").on("click", "a", function (event) {
            event.preventDefault();
        });
        // 屏蔽系统右键菜单
        jq(document).bind("contextmenu", function () {
            return false;
        });
    }

    // 获取画布内容
    CanvasControl.prototype.getFinalHtml = function () {
        // 移除修改toolbar
        if (jq(canvasControl.canvasContent).find('.canvas-toolbar-div')) {
            jq(canvasControl.canvasContent).find('.canvas-toolbar-div').remove();
        }
        // 移除删除toolbar
        if (jq(canvasControl.canvasContent).find('.canvas-toolbar-div-delete')) {
            jq(canvasControl.canvasContent).find('.canvas-toolbar-div-delete').remove();
        }
        // return jq(canvasControl.canvasContent).html();
        var dom = jq(canvasControl.canvasContent).clone();
        // 去掉英文
        var pageType = jq.getUrlParams('type');
        if (pageType == 1) {
            i18_init_index_skyl(dom);
        } else if (pageType == 2) {
            i18_init_login_skyl(dom);
        } else if (pageType == 3) {
            i18_init_loginSuc_skyl(dom);
        } else {
            i18_init_home_skyl(dom);
        }
        return dom.html();
    }

    // 获取画布配置
    CanvasControl.prototype.getFinalCfg = function () {
        return canvasControl.canvasUi.getCfg();
    }

    /*
     * 所有对所有UI的定义、创建、引用及销毁。
     * UI中类名中含有canvas-edited-text的对象为受画布的控制对象
     * UI中类名中含有canvas-edited-notsync的对象在整体修改样式的时候不同步
     * UI中类名中含有canvas-event-resizable的对象可缩放
     * UI中类名中含有canvas-event-draggable的对象可拖动
     * UI中类名中含有canvas-event-click的对象可点击
     * UI中类名中含有canvas-event-selectable的对象可选取
     */
    function CanvasUi() {
        this.curElm;
        this.selecting = false;
        // 富文本编辑器，为的是全局只保存一个实例
        this.ueEdit;
        // 文本内容，为的是全局只保存一个实例
        this.textPanel;
        // 上传图片，为的是全局只保存一个实例
        this.imgPanel;
        // 当前画布是否有改动
        this.isModify = false;
        // 图片是否自动保存过
        this.imageSaved = true;
        // 存放所有实例功能对象
        this.uis = {};
        // 左侧菜单的角色对象定义，不同的key对应不同的menuRole,menuRole在初始化canvasControl时传入，暂时不支持菜单
        this.uiRoles = {};
        // 画布拥有的所有菜单功能，目前暂时不支持，所以先不扩展
        this.uiRoles['phonedefault'] = {
            //drawMain : [ "canvas-ui-addText", "canvas-ui-addImage"]
            drawMain: []
        };
        this.imgPanelContent;
    }

    // 初始化画布控件，不同的手机，pc对应的左侧菜单也不一样，目前暂时不支持，所以先不扩展
    CanvasUi.prototype.init = function () {
        // 增加组件
        this.showCfg();
    }
    CanvasUi.prototype.showCfg = function () {
        this.imgPanel = jq('<div class="canvas-edit-box"></div>');
        var title = jq('<div class="canvas-widget-header"><i class="widget-icon fa fa-tasks fa-lg themeprimary"></i> <span class="widget-caption themeprimary">Edit Picture</span></div>');
        this.imgPanel.append(title);

        this.iContent = jq('<div class="canvas-widget-content"></div>');

        var addImg = jq('<a href="#" style="margin-left:10px;"><i class="fa fa-plus-circle fa-lg"></i>&nbsp;Add</a>');
        var typefgy = jq.getUrlParams("type");

        // console.log(typefgy);
        if (typefgy == 2 || typefgy == 4) {
            this.iContent.append(addImg);
            addImg.unbind("click").click(function (event) {
                var cfg1 = jq("div.canvas-eachItem");
                var cfg2 = {};
                var n = 0;
                jq.each(cfg1, function (index, element) {
                    cfg2[index] = jq(this).html();
                    n++;
                })
                cfg3 = JSON.stringify(cfg2)
                if (n == 3) {
                    alert('Maximum number of picture already reached.');
                    return;
                }
                console.log("/////////");
                var imgId = typefgy == 2 ? "header2" : "banner2";
                var v = cfg3.indexOf(imgId);
                if (v > 0) {
                    imgId = imgId.replace('2', '3');
                    console.log(imgId);
                }
                var item3 = jq('<div class="canvas-eachItem" style="margin-bottom: 20px">' +
                    '<div class="canvas-imgcontent-left">' +
                    '  <img title="Upload picture" id="' + imgId + 'edit' + '" onclick=uploadImg("' + imgId + '") class="getImg" src="../resources/images/add.gif" width="100px" height="100px" style="cursor:pointer" />' +
                    '</div><div class="canvas-imgcontent-right">' +
                    '<div style="height:50px;margin-left:5px;padding-top:20px;">' +
                    'Picture link：<input type="text"  maxlength="128" placeholder="Start with http or https" class="canvas-text-80 getTxt" value=""/>' +
                    '</div>' +
                    '</div>' + '<div class="canvas-imgdel-link"><a href="#" name="canvasFile"><i class="fa fa-trash-o fa-lg"></i></a></div>' +
                    '</div>');
                var item3l = jq('<div class="canvas-eachItem" style="margin-bottom: 20px">' +
                    '<div class="canvas-imgcontent-left">' +
                    '  <img title="上传图片" id="' + imgId + 'edit' + '" onclick=uploadImg("' + imgId + '") class="getImg" src="../resources/images/add.gif" width="100px" height="100px" style="cursor:pointer" />' +
                    '</div><div class="canvas-imgcontent-right">' +
                    '<div style="height:50px;margin-left:5px;padding-top:20px;display: none;">' +
                    '图片链接：<input type="text"  maxlength="128" placeholder="http 或 https开头" class="canvas-text-80 getTxt" value=""/>' +
                    '</div>' +
                    '</div>' + '<div class="canvas-imgdel-link"><a href="#" name="canvasFile"><i class="fa fa-trash-o fa-lg"></i></a></div>' +
                    '</div>');
                if (typefgy == 1 || typefgy == 2) {
                    jq('.canvas-widget-content').append(item3l);
                } else {
                    jq('.canvas-widget-content').append(item3);
                }
                jq('.canvas-widget-content').find("a[name=canvasFile]").unbind().bind({
                    click: function () {
                        if (!confirm('Are you sure want to delete the item?')) {
                            return false;
                        } else {
                            jq(this).parent().parent().remove();
                            // parent.refreshCanvasImg();
                            return false;
                        }
                    }
                });
            });
        }

        var imgTool = jq('<div id="imgTool" style="margin-top: 10px;"></div>');
        this.iContent.append(imgTool);
        // 增加画布的处理表单对象，方便后续扩展
        var value = JSON.parse(canvasControl.opts.jsonCfg);
        var tracker = canvasControl.opts.tracker;
        var value_n = 0;
        for (var id in value) {
            value_n++;
            console.log("id:" + id + "         value:" + tracker + "/" + value[id][0][0]);
            var item1 = jq('<div class="canvas-eachItem" style="margin-bottom: 20px">' +
                '<div class="canvas-imgcontent-left">' +
                '  <img title="Upload picture" id="' + id + 'edit' + '" onclick=uploadImg("' + id + '") class="getImg" src="' + tracker + '/' + value[id][0][0] + '" width="100px" height="100px" style="cursor:pointer" />' +
                '</div><div class="canvas-imgcontent-right">' +
                '<div style="height:50px;margin-left:5px;padding-top:20px;">' +
                'Picture link：<input type="text"  maxlength="128" placeholder="Start with http or https" class="canvas-text-80 getTxt" value="' + (undefined == value[id][0][3] || "-1" == value[id][0][3] ? "" : value[id][0][3]) + '"/>' +
                '</div>' +
                '</div>' +
                '</div>');
            var item1l = jq('<div class="canvas-eachItem" style="margin-bottom: 20px">' +
                '<div class="canvas-imgcontent-left">' +
                '  <img title="上传图片" id="' + id + 'edit' + '" onclick=uploadImg("' + id + '") class="getImg" src="' + tracker + '/' + value[id][0][0] + '" width="100px" height="100px" style="cursor:pointer" />' +
                '</div><div class="canvas-imgcontent-right">' +
                '<div style="height:50px;margin-left:5px;padding-top:20px;display: none;">' +
                '图片链接：<input type="text"  maxlength="128" placeholder="http 或 https开头" class="canvas-text-80 getTxt" value="' + (undefined == value[id][0][3] || "-1" == value[id][0][3] ? "" : value[id][0][3]) + '"/>' +
                '</div>' +
                '</div>' +
                '</div>');
            //圆型图片
            // var item2 = jq('<div class="canvas-eachItem">' +
            //     '<div class="canvas-imgcontent-left">' +
            //     '  <img title="Upload picture" id="' + id + 'edit' + '" onclick=uploadImg("' + id + '") class="getImg img-circle" src="' + tracker + '/' + value[id][0][0] + '" width="100px" height="100px" style="cursor:pointer"/>' +
            //     '</div><div class="canvas-imgcontent-right">' +
            //     '<div style="height:50px;margin-left:5px;padding-top:20px;">' +
            //     'Picture link：<input type="text" maxlength="128" placeholder="Start with http or https" class="canvas-text-80 getTxt" value="' + (undefined == value[id][0][3] || "-1" == value[id][0][3] ? "" : value[id][0][3]) + '"/>' +
            //     '</div>' +
            //     '</div>' +
            //     '</div>');
            // var item2l = jq('<div class="canvas-eachItem">' +
            //     '<div class="canvas-imgcontent-left">' +
            //     '  <img title="上传图片" id="' + id + 'edit' + '" onclick=uploadImg("' + id + '") class="getImg img-circle" src="' + tracker + '/' + value[id][0][0] + '" width="100px" height="100px" style="cursor:pointer"/>' +
            //     '</div><div class="canvas-imgcontent-right">' +
            //     '<div style="height:50px;margin-left:5px;padding-top:20px;display: none;">' +
            //     '图片链接：<input type="text" maxlength="128" placeholder="http 或 https开头" class="canvas-text-80 getTxt" value="' + (undefined == value[id][0][3] || "-1" == value[id][0][3] ? "" : value[id][0][3]) + '"/>' +
            //     '</div>' +
            //     '</div>' +
            //     '</div>');
            //item5是带删除按钮的
            var item5 = jq('<div class="canvas-eachItem" style="margin-bottom: 20px">' +
                '<div class="canvas-imgcontent-left">' +
                '  <img title="Upload picture" id="' + id + 'edit' + '" onclick=uploadImg("' + id + '") class="getImg" src="' + tracker + '/' + value[id][0][0] + '" width="100px" height="100px" style="cursor:pointer" />' +
                '</div><div class="canvas-imgcontent-right">' +
                '<div style="height:50px;margin-left:5px;padding-top:20px;">' +
                'Picture link：<input type="text"  maxlength="128" placeholder="Start with http or https" class="canvas-text-80 getTxt" value="' + (undefined == value[id][0][3] || "-1" == value[id][0][3] ? "" : value[id][0][3]) + '"/>' +
                '</div>' +
                '</div>' + '<div class="canvas-imgdel-link"><a href="#" name="canvasFile"><i class="fa fa-trash-o fa-lg"></i></a></div>' +
                '</div>');
            var item5l = jq('<div class="canvas-eachItem" style="margin-bottom: 20px">' +
                '<div class="canvas-imgcontent-left">' +
                '  <img title="上传图片" id="' + id + 'edit' + '" onclick=uploadImg("' + id + '") class="getImg" src="' + tracker + '/' + value[id][0][0] + '" width="100px" height="100px" style="cursor:pointer" />' +
                '</div><div class="canvas-imgcontent-right">' +
                '<div style="height:50px;margin-left:5px;padding-top:20px;display: none;">' +
                '图片链接：<input type="text"  maxlength="128" placeholder="http 或 https开头" class="canvas-text-80 getTxt" value="' + (undefined == value[id][0][3] || "-1" == value[id][0][3] ? "" : value[id][0][3]) + '"/>' +
                '</div>' +
                '</div>' + '<div class="canvas-imgdel-link"><a href="#" name="canvasFile"><i class="fa fa-trash-o fa-lg"></i></a></div>' +
                '</div>');

            var typefgy = jq.getUrlParams("type");
            if (typefgy == 2 || typefgy == 4) {
                if (value_n == 1) {
                    if (typefgy == 1 || typefgy == 2) {
                        this.iContent.append(item1l);
                    } else {
                        this.iContent.append(item1);
                    }
                } else {
                    if (typefgy == 1 || typefgy == 2) {
                        this.iContent.append(item5l);
                    } else {
                        this.iContent.append(item5);
                    }
                }
            } else {
                if (typefgy == 1 || typefgy == 2) {
                    this.iContent.append(item1l);
                } else {
                    this.iContent.append(item1);
                }
            }
            /*如果logo是圆的需要判断一下。
             * if(id == "logoImg"){
             this.iContent.append(item2);
             }else{
             this.iContent.append(item1);
             }*/
        }

        canvasControl.canvasForm = jq('<form id="canvasForm" class="form-horizontal" role="form" name="canvasForm"  method="post"></form>');
        this.imgPanel.append(this.iContent);
        canvasControl.canvasForm.append(this.imgPanel);
        canvasControl.canvasUi.imgPanelContent = this.iContent;
        jq('#tools').append(canvasControl.canvasForm);


        jq('.canvas-widget-content').find("a[name=canvasFile]").unbind().bind({
            click: function () {
                if (!confirm('Are you sure want to delete the item?')) {
                    return false;
                } else {
                    jq(this).parent().parent().remove();
                    // parent.refreshCanvasImg();
                    return false;
                }
            }
        });

    }


    // 获取图片配置信息
    CanvasUi.prototype.getCfg = function () {
        var jsonCfg = {};
        // if(null != canvasControl.opts.jsonCfg && '' != canvasControl.opts.jsonCfg){
        // 	jsonCfg = JSON.parse(canvasControl.opts.jsonCfg);
        // }
        var id;
        canvasControl.canvasUi.imgPanelContent.find("div.canvas-eachItem").each(function (i) {
            var aArray = new Array();
            // 必须上传图片，才认为是完整记录
            var flag = 0;
            jq(this).find('.getImg').each(function (i) {
                id = jq(this).attr("id");
                if (jq(this).attr("src").indexOf("add.gif") < 0) {
                    flag = 1;
                }
                if (null != jq(this).attr("src") && '' != jq(this).attr("src")) {
                    var bArray = new Array();
                    bArray.push(jq(this).attr("src"));
                    bArray.push("-1");//暂时第二第三个参数没有用，以后方便扩展
                    bArray.push("-1");
                    jq(this).parent().parent().find('.getTxt').each(function (i) {
                        if (null != jq(this).val() && '' != jq(this).val()) {
                            bArray.push(jq(this).val());
                        } else {
                            bArray.push("-1");
                        }
                    });
                    aArray.push(bArray);
                }
            });
            if (flag == 1) {
                id = id.slice(0, id.indexOf("edit"));
                jsonCfg[id] = aArray;
            }
        });

        canvasControl.opts.jsonCfg = JSON.stringify(jsonCfg);
        return JSON.stringify(jsonCfg);
    }
    /*
     * 定义jQuery扩展函数，供jQuery对象调用。
     * 请注意函数的返回值一定要是jQuery对象，使其能支持链式操作。
     */
    jq.fn.extend({
        // 创建适用于PHONE的画布插件对象
        phoneControl: function (options) {
            if (!canvasControl) {
                canvasControl = new CanvasControl(options);
                canvasControl.ctrlType = "PHONE";
            }
            var otherArgs = Array.prototype.slice.call(arguments, 1);
            if ("string" == typeof(options) && "function" == typeof(canvasControl[options])) {
                return canvasControl[options].apply(canvasControl, otherArgs)
            } else if ("option" == options && arguments.length == 2 && typeof arguments[1] == 'string') {
                return canvasControl.getOpts.apply(canvasControl, otherArgs);
            } else {
                canvasControl.init(this);
                canvasControl.canvasContent.attr("unselectable", "on");
                return canvasControl;
            }
        }
    });

    /*
     * 定义jQuery工具函数扩展
     */
    jq.extend({
        // 获取Url中传递的参数  by RegExp
        getUrlParams: function (paramName) {
            var re = new RegExp("(^|\\?|&)" + paramName + "=([^&]*)(&|$)", 'g');
            re.exec(window.location.href);
            return RegExp.$2;
        },
        getRandomDateBetween: function (a) {
            var date = new Date();
            a = a.getTime();
            // 1427082029916 2038-01-01
            date.setTime(Math.random(new Date(1427082029916).getTime() - a) + a);
            return date.getTime();
        },
        getJsonLength: function (jsonData) {
            var jsonLength = 0;
            for (var item in jsonData) {
                jsonLength++;
            }
            return jsonLength;
        }
    });
})(jQuery);
