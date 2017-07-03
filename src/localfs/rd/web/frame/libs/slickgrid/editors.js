/***
 * Contains basic SlickGrid editors.
 * @module Editors
 * @namespace Slick
 */

(function ($F) {

var WidgetFactor = {
    "typehead": _initTypehead,
    "singleSelect": _initSingleSelect
};

function _initTypehead(jInput, oParas)
{
    if(!jInput.typehead)
    {
        // not support typehead
        return false;
    }

    jInput.typehead();

    var data = oParas["data"];
    if(data)
    {
        jInput.typehead("setData", data, oParas);
    }
    return true;
}

function _initSingleSelect(jSelect, oParas)
{
    if(!jSelect.singleSelect)
    {
        // not support singleSelect
        return false;
    }

    jSelect.singleSelect();
    return true;
}

function initColumWidget(jEle, args)
{
    var widget = (args.column.classname) ? {name:args.column.classname} : args.column.widget;
    if (!widget)
    {
        return true;
    }

    var pfWidget = WidgetFactor[widget.name];
    if (pfWidget)
    {
        return pfWidget(jEle, widget);
    }

    return true;
}

function buildInput(args, oAttr1, oAttr2)
{
    var $input;
    var defaultValue;
    var scope = this;
    var _remark = false;

    this.column = args.column;

    this.init = function () 
    {
        var _this = this;
        $input = $(makeHtml(args))
            .appendTo(args.container)
            .bind("keydown.nav", function (e) 
            {
                if (e.keyCode === $.ui.keyCode.LEFT || e.keyCode === $.ui.keyCode.RIGHT) 
                {
                    e.stopImmediatePropagation();
                }
            })
            .bind("focus", function(e){$(this).addClass("focus")})
            .bind("keyup", function(e){scope.validate();args.trigger ("keyup", this);})
            .bind("blur", function (e)
            {
                $input.removeClass("focus");
                if (!scope.validate().valid);
                {
                    return false;
                }

                if (_this.isValueChanged())
                {
                    $input.addClass("changed");
                }
                else
                {
                    $input.removeClass("changed");
                }
                return false !== args.trigger ("blur", this);
             })
            .focus()
            .select();

        if (this.errMsg)
        {
            $input.attr("errMsg", this.errMsg);
        }
        initColumWidget($input, args);
    };

    this.destroy = function () {
        $input.remove();
    };

    this.focus = function () {
        $input.focus();
    };

    this.getValue = function () {
        return $input.val();
    };

    this.setValue = function (val) {
        $input.val(val);
    };

    this.enable = function (bEnable)
    {
        if (bEnable)
        {
            _remark && $input.attr("placeholder", _remark);
        }
        else
        {
            _remark = $input.attr("placeholder")
            $input.removeAttr("placeholder");
        }

        $input.attr("disabled", !bEnable);
    }

    this.getDom = function ()
    {
        return $input[0];
    }

    this.loadValue = function (item) {
        defaultValue = item[args.column.field] || "";
        $input.val(defaultValue);
        $input[0].defaultValue = defaultValue;
        $input.select();
    };

    this.serializeValue = function () {
        return $input.val();
    };

    this.applyValue = function (item, state) {
      item[args.column.field] = state;
    };

    this.isValueChanged = function ()
    {
        var curVal = $input.val();
        return (!(curVal == "" && defaultValue == null)) && (curVal != defaultValue);
    };

    this.validate = function ()
    {
        var bOK = Utils.Widget.checkEle($input);
        return {valid: bOK, msg: null};
    };

    this.reset = function ()
    {
        $input.val("");
    };

    function makeHtml(args)
    {
        var oAttr = {type:"text"};
        $.extend(oAttr, oAttr1, oAttr2);

        var sAttr = "";
        var attrName = {
            "tip": "title",     // 鼠标移上去的提示信息
            "pattern": "pattern",
            "min": "min",   // 整数类型的最小值， 或者字符串的最小长度
            "max": "max",   // 整数类型的最大值
            "etype": "etype",   // 错误的显示类型,  mlist行编辑中使用弹出方式显示, 普通FORM使用在输入框的后面显示
            "maxLen": "maxlength",  // 字符串类型的最大长度
            "defaultVal": "value",  // 默认值,即初始值
            "remark": "placeholder", // 输入框为空时在输入框中显示的提示信息(HTML5支持)
            "dateFmt": "dateFmt" // 传入输入格式，用于time，date格式传入
        };

        var sClass = "edittable-element " + oAttr["type"];
        if(oAttr["required"]) sClass += " required";
        if(args.column.classname) sClass += " " + args.column.classname;

        for(var name in attrName)
        {
            if (oAttr[name])
            {
                sAttr += Utils.Base.sprintf(' %s="%s"', attrName[name], oAttr[name]);
            }
        }

        var sId = args.column.id;
        var sValue = (undefined===args.value) ? "" : args.value;
        var sType = ("password" == oAttr.type) ? "password" : "text";
        return Utils.Base.sprintf(
            '<input type=%s etype=noerror id=%s name=%s %s class="%s" value="%s" errid="%s">', 
            sType, sId, sId, sAttr,  sClass, sValue, args.errorId);
    }

    this.init();
}

/*****************************************************************************
@FuncName, public, Frame.Editors
@DateCreated: 2013-06-08
@Author: huangdongxiao 02807
@Description: 列表的行编辑对象
@Usage:
var opt = {
    colNames:"Time,Group,Severity,Digest,Content",
    colModel:[
        {name:'Time', width:100, datatype:"String"},
        {name:'Module', width:80, datatype:"Order", data:"ACL,WEB,SHELL"},
        {name:'Severity', width:80, datatype:"String", formatter: <b>onSeveiryFormatter</b>},
        {name:'Digest', width:60, datatype:"Order", data:aDigest}
    ]
};

function onSeveiryFormatter(row, col, value, columnDef, context, type)
{
    //opt.srcEle
    if("text" == type)
    {
        // returen a simple string for search
        return value;
    }

    return "&lt;span class='icon-ok'>&lt;/span>" + value;
}
@ParaIn:
    * sMListId, String, MLIST ID字符串
    * newArgs.container, JObject, 单元格的JQuery对象
    * newArgs.column, Integer, col;
    * newArgs.value, void, 控件的初始化值;
    * newArgs.commitChanges, Function, 提交函数
    * newArgs.cancelChanges, Function, 取消函数
@Return: Object, 做了一个class定义，使用时需要new一个对象
@Caution:
@Modification:
    * yyyy-mm-dd: Auth, add or modify something
*****************************************************************************/

function editor_file (args)
{
    buildInput.apply(this, [args, {type:"file"}]);
}

function editor_password (args)
{
    var oAttr = $.extend({type:"password"}, args.column);
    buildInput.apply(this, [args, oAttr]);
}

function editor_String(args)
{
    var oAttr = $.extend({type:"string"}, args.column);
    if(!oAttr.remark && !isNaN(oAttr.maxLen))
    {
        oAttr.remark = Utils.Base.sprintf($.MyLocale.Validator.Tip.strRange, 1, oAttr.maxLen);
    }
    buildInput.apply(this, [args, oAttr]);
}
//Added By wkf4808
function editor_Astring(args)
{
    var oAttr = $.extend({type:"astring"}, args.column);
    if(!oAttr.remark && !isNaN(oAttr.maxLen))
    {
        oAttr.remark = Utils.Base.sprintf($.MyLocale.Validator.Tip.strRange, 1, oAttr.maxLen);
    }
    buildInput.apply(this, [args, oAttr]);
}

function editor_Ip(args)
{
    var oAttr = $.extend({type:"ip"}, args.column);
    oAttr.maxLen = "FFFF:FFFF:FFFF:FFFF:FFFF:FFFF:255.255.255.255".length;
    buildInput.apply(this, [args, oAttr]);
}

function editor_Ipv4(args)
{
    var oAttr = $.extend({type:"ipv4"}, args.column);
    oAttr.maxLen = "255.255.255.255".length;
    buildInput.apply(this, [args, oAttr]);
}

function editor_Mask(args)
{
    var oAttr = $.extend({type:"mask"}, args.column);
    oAttr.maxLen = "255.255.255.255".length;
    buildInput.apply(this, [args, oAttr]);
}

function editor_Mask6(args)
{
    var oAttr = $.extend({type:"mask6", min:1, max:128}, args.column);

    var nMax = oAttr.max;
    oAttr.maxLen = (""+nMax).length;

    // 如果没有remark, 则使用最小值到最大值的范围做为提示信息
    if(!oAttr.remark && !isNaN(oAttr.min) && !isNaN(oAttr.max))
    {
        oAttr.remark = Utils.Base.sprintf($.MyLocale.Validator.Tip.intRange, oAttr.min, oAttr.max);
    }

    buildInput.apply(this, [args, oAttr]);
}

function editor_Ipv6(args)
{
    var oAttr = $.extend({type:"ipv6"}, args.column);
    oAttr.maxLen = "FFFF:FFFF:FFFF:FFFF:FFFF:FFFF:255.255.255.255".length;
    buildInput.apply(this, [args, oAttr]);
}

function editor_Vlanlist(args)
{
    var oAttr = $.extend({type:"vlanlist"}, args.column);
    buildInput.apply(this, [args, oAttr]);
}

function editor_Mac(args)
{
    var oAttr = $.extend({type:"mac"}, args.column);
    oAttr.maxLen = "11-22-33-44-55-66".length;
    buildInput.apply(this, [args, oAttr]);
}

function editor_Hexa(args)
{
    var oAttr = $.extend({type:"hexa"}, args.column);
    buildInput.apply(this, [args, oAttr]);
}

function editor_Integer(args)
{
    var oAttr = $.extend({type:"digits"}, args.column);

    var nMax = oAttr.max || 0xffffffff;
    oAttr.maxLen = (""+nMax).length;

    // 如果没有remark, 则使用最小值到最大值的范围做为提示信息
    if(!oAttr.remark && !isNaN(oAttr.min) && !isNaN(oAttr.max))
    {
        oAttr.remark = Utils.Base.sprintf($.MyLocale.Validator.Tip.intRange, oAttr.min, oAttr.max);
    }

    buildInput.apply(this, [args, oAttr]);
}

function editor_Text (args)
{
    var oAttr = $.extend({type:"text"}, args.column);
    buildInput.apply(this, [args, oAttr]);
}

function editor_Contextmenu (args)
{
    var $menu;
    var defaultValue;
    var scope = this;
    var sValue;

    this.column = args.column;

    function onInit(jElement)
    {
        var aOptions = [];
        var d = args.column.data || [];

        Frame.ListString.each(d, args.column.widgetOpt, function(val, text)
        {
            sDefault = (val==args.value) ? " selected" : "";
            aOptions.push("<li" + sDefault + " data='"+val+"'>" + text+"&nbsp;</li>");
        });

        jElement.html(aOptions.join(''));

        initColumWidget(jElement, args);
    }

    function onBodyClick(e)
    {
        if(e.target !=args.container)
        {
            $menu.hide();
            $(args.container).removeClass("focus");
        }
        e.stopPropagation();
    }

    this.init = function ()
    {
        var _this = this;
        var sClassName = args.column.classname||"";
        $menu = $("<ul tabIndex='0' name='"+args.column.name+"' class='contextMenu mlist-editor edittable-element "+sClassName+"'></ul>");
        $menu.appendTo($("body"));
        $(args.container).addClass("focus");
        var pfInit = (args.column.onInit) || onInit;
        pfInit($menu);
        scope.position(args.position);

        $("body").bind("click", onBodyClick);
        $(args.container).bind('click', function(e) {
            $menu.show();
            $(args.container).addClass("focus");
            e.stopPropagation();
        });
        $menu.click(function (e) {
            if (!$(e.target).is("li")) {
              return;
            }
            sValue = $(e.target).attr("data");
            args.commitChanges();

            if (_this.isValueChanged())
            {
                $menu.addClass("changed");
            }
            else
            {
                $menu.removeClass("changed");
            }
        });
    };

    this.destroy = function () {
       $menu.remove();
       $("body").unbind("click", onBodyClick);
       $(args.container).unbind("click");
       $menu.unbind("click");
    };
    this.position = function (position) {
       $menu.css({"top":position.bottom,"left":position.left,"width":position.width-2});
    };
    this.focus = function () {
      $menu.focus();
    };

    this.loadValue = function (item) {
       sValue = defaultValue= item[args.column.field];
       var aData = Frame.ListString.format(args.column.data);
       var sText = Frame.ListString.getTextByValue(aData,sValue);
       $(args.container).html(sText);
       $menu.select();
    };

    this.serializeValue = function () {
      return sValue;
    };

    this.applyValue = function (item, state) {
      item[args.column.field] = state;
    };

    this.isValueChanged = function () {
      return (sValue != defaultValue);
    };

    this.validate = function () {
      return {valid: true, msg: null};
    };

    this.reset = function ()
    {
        ;
    };

    this.init();
}
function editor_Order (args)
{
    var $select;
    var defaultValue;
    var scope = this;

    this.column = args.column;

    function onInit(jSelect)
    {
        var aOptions = [];
        var d = args.column.data || [];
        var widgetOpt = args.column.widgetOpt || {};

        if((args.column.classname == "singleSelect") && (widgetOpt.allowClear))
        {
            aOptions.push("<option>");
        }

        Frame.ListString.each(d, widgetOpt, function(val, text)
        {
            sDefault = (val==args.value) ? " selected" : "";
            aOptions.push("<option" + sDefault + " value='"+val+"'>" + text);
        });

        jSelect.html(aOptions.join(''))
            .on("change", function (e)
            {
                args.trigger ("change", this);
            });

        initColumWidget(jSelect, args);
    }

    this.init = function ()
    {
        var sClassName = args.column.classname||"";
        var widgetOpt = args.column.widgetOpt || {};
        var sAllowClear = (widgetOpt.allowClear)?" ":" allowClear ='false'";
        $select = $("<SELECT tabIndex='0' "+sAllowClear+" name='"+args.column.name+"' class='mlist-editor edittable-element "+sClassName+"'><optin>Loading ...</option></SELECT>");
        if(args.column.placeholder) $select.attr("placeholder", args.column.placeholder);
        $select.appendTo(args.container);
        var pfInit = (args.column.onInit) || onInit;
        pfInit($select);

        var _this = this;
        if (_this.isValueChanged())
        {
            $select.addClass("changed");
        }
        else
        {
            $select.removeClass("changed");
        }

        if(args.onChanged)
        {
            var pfCallback = this.column.onChangeVal
            $select.change(function(e){
                args.onChanged($(this).val());
            });
        }
    };

    this.destroy = function () {
      $select.remove();
    };

    this.focus = function () {
      $select.focus();
    };

    this.loadValue = function (item) {
        if(args.column.classname=="singleSelect")
        {
            $select.singleSelect("value",item[args.column.field]);
        }
        else
        {
            $select.val(item[args.column.field]);
        }
      
    };

    this.enable = function (bEnable)
    {
        $select.attr("disabled", !bEnable);
    }

    this.getDom = function ()
    {
        return $select[0];
    }

    this.serializeValue = function () {
      return $select.val();
    };

    this.reset = function ()
    {
        $select.val("");
        $select.change();
        args.trigger ("change", this.getDom());
    };

    this.applyValue = function (item, state) {
      item[args.column.field] = state;
    };

    this.isValueChanged = function () {
      return ($select.val() != defaultValue);
    };

    this.validate = function () {
      return {valid: true, msg: null};
    };

    this.init();
}

function editor_ToggleText (args)
{
    var defaultValue;
    var scope = this;
    var sValue;

    this.column = args.column;

    this.init = function () {
        var sCurrentValue = args.item[args.column.id];

        var d = args.column.data || [];
        var aData = Frame.ListString.format(d);
        $.each(aData, function(i, oData) {
            var v, t;
            if($.isPlainObject(oData))
            {
                v = oData.value;
                t = oData.text;
            }
            else
            {
                v=i, t=oData;
            }
            if(v == sCurrentValue)
            {
               $(args.container).html(t); 
            }
        });
        
        $(args.container).bind('click', function(event) {
            sValue = changeCurrentNodeText($(this),aData);
            event.stopPropagation;
        });

        sValue = changeCurrentNodeText($(args.container),aData)
        function changeCurrentNodeText(jElemet,aData)
        {
            var sValue;
            var sText = jElemet.html();
           for(var i=0;i<aData.length;i++)
           {
                var v, t;
                if($.isPlainObject(aData[i]))
                {
                    v = aData[i].value;
                    t = aData[i].text;
                }
                else
                {
                    v=i, t=aData[i];
                }
                
                if(sText==t)
                {
                    if(i==aData.length-1)
                    {
                        sValue = aData[0].value||aData[0];
                        jElemet.html(aData[0].text)||aData[0];
                    }
                    else
                    {
                        sValue = aData[i+1].value||aData[i+1];
                        jElemet.html(aData[i+1].text)||aData[i+1];
                    }
                }
           }
            return sValue;
        }
    };

    this.destroy = function () {
        $(args.container).unbind("click");
    };

    this.focus = function () {
        $(args.container).focus();
    };

    this.loadValue = function (item) {
        sValue = sValue;
    };

    this.serializeValue = function () {
        return sValue;
    };

    this.applyValue = function (item, state) {
        item[args.column.field] = state;
    };

    this.isValueChanged = function () {
        return (this.serializeValue() !== defaultValue);
    };

    this.validate = function () {
        return {valid: true, msg: null};
    };

    this.reset = function ()
    {
        $select.val("");
    };

    this.init();
}

function editor_Checkbox (args)
{
    var _jCheckbox;
    var defaultValue;
    var scope = this;

    this.column = args.column;

    this.init = function () {
      var check = (args.value=="true") ? " checked" : "";
      _jCheckbox = $("<INPUT type=checkbox "+check+" name='"+args.column.id+"' value='true' class='edittable-element editor-checkbox' hideFocus>")
        .appendTo(args.container)
        .on("change", function (e)
        {
            args.trigger ("change", this);
        })
        .focus();

        var _this = this;
        if (_this.isValueChanged())
        {
            _jCheckbox.addClass("changed");
        }
        else
        {
            _jCheckbox.removeClass("changed");
        }
    };

    this.destroy = function () {
      _jCheckbox.remove();
    };

    this.focus = function () {
      _jCheckbox.focus();
    };

    this.loadValue = function (item) {
      defaultValue = ("true" == item[args.column.field]);
      if (defaultValue) {
        _jCheckbox.attr("checked", "checked");
      } else {
        _jCheckbox.removeAttr("checked");
      }
    };

    this.clickActiveCell = function(e) {
      if("checkbox" == e.target.type)
        return;
      if (!(this.serializeValue() == "true")) {
        _jCheckbox.attr("checked", "checked");
      } else {
        _jCheckbox.removeAttr("checked");
      }
    };

    this.serializeValue = function () {
      return !!_jCheckbox.attr("checked") ? "true":"false";
    };

    this.applyValue = function (item, state) {
      item[args.column.field] = state;
    };

    this.enable = function (bEnable)
    {
        _jCheckbox.attr("disabled", !bEnable);
    }

    this.getDom = function ()
    {
        return _jCheckbox[0];
    }

    this.isValueChanged = function () {
      return (this.serializeValue() !== defaultValue) ? "true":"false";
    };

    this.validate = function () {
      return {valid: true, msg: null};
    };

    this.reset = function ()
    {
        args.trigger ("change", this.getDom());
    };

    this.init();
}

function editor_SimpleText (args)
{
    var scope = this;

    this.column = args.column;

    this.init = function () 
    {
    };

    this.destroy = function () {
    };

    this.focus = function () {
    };

    this.loadValue = function (item) 
    {
        var sHtml = item[args.column.field];
        if (args.column.formatter)
        {
            // row, cell, value, colDef, dataContext, type
            sHtml = args.column.formatter (0, 0, sHtml, args.column, item, "html");
        }
        args.container.html (sHtml);
    };

    this.clickActiveCell = function(e) {
    };

    this.serializeValue = function () {
      return args.value;
    };

    this.applyValue = function (item, val) {
    };

    this.enable = function (bEnable)
    {
        if (bEnable)
        {
            args.container.removeClass ("disabled");
        }
        else
        {
            args.container.addClass ("disabled");
        }
    }

    this.getDom = function ()
    {
        return args.container[0];
    }

    this.isValueChanged = function () {
      return "false";
    };

    this.validate = function () {
      return {valid: true, msg: null};
    };

    this.reset = function ()
    {
    };

    this.init();
}

function editor_Date (args)
{
    var oAttr = $.extend({type:"date"}, args.column);
    buildInput.apply(this, [args, oAttr]);
}

function editor_Time (args)
{
    var oAttr = $.extend({type:"time"}, args.column);
    buildInput.apply(this, [args, oAttr]);
}

function editor_DateRange (args)
{
    var $input;
    var colModel=args.column;

    this.column = args.column;

    this.init = function () {
        var widgetOpt = colModel.widgetOpt || {};
        $input = $('<input type="text" id="'+colModel.name+'" name="'+colModel.name+'" class="edittable-element '+colModel.classname+'"/>')
          .appendTo(args.container);

        if(colModel.classname == "datetimerange")
        {
            var optData = {
                timePicker : true,
                format : (widgetOpt.format)||'YYYY-MM-DD hh:mm',
                pickSeconds :  (widgetOpt.pickSeconds)||false,
                separator : (widgetOpt.separator)|| ' ~ '
            }
            if(args.value)
            {
                optData["value"] = args.value;
            }
            $input.data(colModel.name,optData );
        }
        else if(colModel.classname == "daterange")
        {
            var optData = {
                format : (widgetOpt.format)||'YYYY-MM-DD',
                separator : (widgetOpt.separator)|| ' ~ '
            }
            if(args.value)
            {
                optData["value"] = args.value;
            }
            $input.data(colModel.name,optData );
        }
    };
    this.init();
}

function editor_MValue(args)
{
    var $input, $picker;
    var defaultValue;
    var scope = this;

    this.column = args.column;

    this.init = function () 
    {
      $input = $("<INPUT type=text class='editor-percentcomplete' />");
      $input.width($(args.container).innerWidth() - 25);
      $input.appendTo(args.container);

      $picker = $("<div class='editor-percentcomplete-picker' />").appendTo(args.container);
      $picker.append("<div class='editor-percentcomplete-helper'><div class='editor-percentcomplete-wrapper'><div class='editor-percentcomplete-slider' /><div class='editor-percentcomplete-buttons' /></div></div>");

      $picker.find(".editor-percentcomplete-buttons").append("<button val=0>Not started</button><br/><button val=50>In Progress</button><br/><button val=100>Complete</button>");

      $input.focus().select();

      $picker.find(".editor-percentcomplete-slider").slider({
        orientation: "vertical",
        range: "min",
        value: defaultValue,
        slide: function (event, ui) {
          $input.val(ui.value)
        }
      });

      $picker.find(".editor-percentcomplete-buttons button").bind("click", function (e) {
        $input.val($(this).attr("val"));
        $picker.find(".editor-percentcomplete-slider").slider("value", $(this).attr("val"));
      })
    };

    this.destroy = function () {
      $input.remove();
      $picker.remove();
    };

    this.focus = function () {
      $input.focus();
    };

    this.loadValue = function (item) {
      $input.val(defaultValue = item[args.column.field]);
      $input.select();
    };

    this.serializeValue = function () {
      return parseInt($input.val(), 10) || 0;
    };

    this.applyValue = function (item, state) {
      item[args.column.field] = state;
    };

    this.isValueChanged = function () {
      return (!($input.val() == "" && defaultValue == null)) && ((parseInt($input.val(), 10) || 0) != defaultValue);
    };

    this.validate = function () {
      if (isNaN(parseInt($input.val(), 10))) {
        return {
          valid: false,
          msg: "Please enter a valid positive number"
        };
      }

      return {
        valid: true,
        msg: null
      };
    };

    this.init();
}

/*
* An example of a "detached" editor.
* The UI is added onto document BODY and .position(), .show() and .hide() are implemented.
* KeyDown events are also handled to provide handling for Tab, Shift-Tab, Esc and Ctrl-Enter.
*/
function editor_LongText (args)
{
    var $input, $wrapper;
    var defaultValue;
    var scope = this;

    this.column = args.column;

    this.init = function () {
      var $container = $("body");

      $wrapper = $("<DIV style='z-index:10000;position:absolute;background:white;padding:5px;border:2px solid gray; -moz-border-radius:10px; border-radius:10px;'/>")
          .appendTo($container);

      $input = $("<TEXTAREA hidefocus rows=5 style='backround:white;width:250px;height:80px;border:0;outline:0'>")
          .appendTo($wrapper);

      if(args.column.validateMsg)
      {
          $('<DIV class="description">'+args.column.validateMsg+'</DIV>').appendTo($wrapper);
      }

      $("<DIV style='text-align:right'><BUTTON>Save</BUTTON><BUTTON>Cancel</BUTTON></DIV>")
          .appendTo($wrapper);

      $wrapper.find("button:first").bind("click", this.save);
      $wrapper.find("button:last").bind("click", this.cancel);
      $input.bind("keydown", this.handleKeyDown);

      scope.position(args.position);
      $input.focus().select();
    };

    this.handleKeyDown = function (e) {
      if (e.which == $.ui.keyCode.ENTER && e.ctrlKey) {
        scope.save();
      } else if (e.which == $.ui.keyCode.ESCAPE) {
        e.preventDefault();
        scope.cancel();
      } else if (e.which == $.ui.keyCode.TAB && e.shiftKey) {
        e.preventDefault();
        args.grid.navigatePrev();
      } else if (e.which == $.ui.keyCode.TAB) {
        e.preventDefault();
        args.grid.navigateNext();
      }
    };

    this.save = function () {
      args.commitChanges();
    };

    this.cancel = function () {
      $input.val(defaultValue);
      args.cancelChanges();
    };

    this.hide = function () {
      $wrapper.hide();
    };

    this.show = function () {
      $wrapper.show();
    };

    this.position = function (position) {
      $wrapper
          .css("top", position.top)
          .css("left", position.left)
    };

    this.destroy = function () {
      $wrapper.remove();
    };

    this.focus = function () {
      $input.focus();
    };

    this.loadValue = function (item) {
      $input.val(defaultValue = item[args.column.field]);
      $input.select();
    };

    this.serializeValue = function () {
      return $input.val();
    };

    this.applyValue = function (item, state) {
      item[args.column.field] = state;
    };

    this.isValueChanged = function () {
      return (!($input.val() == "" && defaultValue == null)) && ($input.val() != defaultValue);
    };

    this.validate = function () {
        var sMsg = (args.column.validate) ? args.column.validate($input.val()) : null;
        return {valid: (null==sMsg), msg: sMsg};
    };

    this.reset = function ()
    {
    };

    this.init();
}

// register namespace
$.extend($F, {
    "Editors": 
    {
        "file"       : editor_file,
        "password"   : editor_password,
        "String"     : editor_String,
        "Ip"         : editor_Ip,
        "Ipv4"       : editor_Ipv4,
        "Mask"       : editor_Mask,
        "Mask6"      : editor_Mask6,
        "Ipv6"       : editor_Ipv6,
        "Mac"        : editor_Mac,
        "Integer"    : editor_Integer,
        "Text"       : editor_Text,
        "Context"    : editor_Contextmenu,
        "ToggleText" : editor_ToggleText,
        "Order"      : editor_Order,
        "Checkbox"   : editor_Checkbox,
        "Date"       : editor_Date,
        "Time"       : editor_Time,
        "DateRange"  : editor_DateRange,
        "Vlanlist"   : editor_Vlanlist,
        "LongText"   : editor_LongText,
        "SimpleText" : editor_SimpleText,  // readonly text
        "Astring"    : editor_Astring,
        "Hexa"       : editor_Hexa
    }
});

})(Frame);
