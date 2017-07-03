/*******************************************************************************
 Copyright (c) 2011, Hangzhou H3C Technologies Co., Ltd. All rights reserved.
--------------------------------------------------------------------------------
@FileName:libs/frame/plot.js
@ProjectCode: Comware v7
@ModuleName: Frame.Plot
@DateCreated: 2011-08-09
@Author: huangdongxiao 02807
@Description: 
    绘图控件封装。包括折线图、饼图、柱状图。本控件会自动装载需要JS文件，在装载完成后发送init完成的信号。
    因此在使用本控件的功能时，必须在等到控件的init信号后才能调用相关的绘图接口。
@Modification:
*******************************************************************************/
;(function($)
{
var WIDGETNAME = "Progressbar";

function _noop(){}
var _oDefOption = {
    min:0, 
    max:100, 
    step: 1,
    lock:true,

    onEnd: _noop
};

var oMyCtrl = {
    _create: function(){
        this.jProgress = $("<div class='proress-bar-container hide'><div class='progress-bar-value'></div><div class='progress-bar-text'></div></div>")
            .appendTo(this.element);
        this.jValue = $(".progress-bar-value", this.jProgress);
    },

    _destroy: function()
    {
        this.jProgress.remove();
        this.jProgress = false;
        this.jValue = false;
    },

/*****************************************************************************
@FuncName: public, JQuery.Progressbar.start
@DateCreated: 2011-08-08
@Author: huangdongxiao 02807
@Description:  画折线图。大小由容器div的大小决定
@Usage: 
    // HTML 代码
    <div id="container"></div>

    // 按容器大小画图表
    var oOption = [{
                name: 'CPU',
                data: [10,20,30,23,56]
            }, {
                name: 'Mem', 
                data: [20,33,21,89,54]
            }]；  //这是定义两个序列的数据
        Frame.Plot.Line("#container",oOption);
  
  
@ParaIn: 
    * sSelector, 画布容器
    * oOption, 数据序列
@Return: jObject, 折线图对象
@Caution: 
@Modification:
    * yyyy-mm-dd: Author, add or modify something
*****************************************************************************/
    start: function (oOption)
    {
        this.option = $.extend({}, _oDefOption, oOption);

        this.value = 0;
        this.jValue.width(0);
        this.jProgress.removeClass ("hide");

        this.option.lock && Frame.MyScreen.lock();
    },

/*****************************************************************************
@FuncName: public, JQuery.Progressbar.stop
@DateCreated: 2011-08-08
@Author: huangdongxiao 02807
@Description:  设置进度条的当前值。
@Usage: 
@ParaIn: 
    *nProgressVal:integer,进度条的值，如果不在设置的范围内，则设置为最近的值。
        即：如果大于最大值，则设置为最大值；如果小于最小值，则设置为最小值。
@Caution: 
@Modification:
    * yyyy-mm-dd: Author, add or modify something
*****************************************************************************/
    set: function (nProgressVal)
    {
        var nMin=this.option.min, nMax=this.option.max;
        var nWidth = this.jProgress.width();

        nProgressVal = nProgressVal || nMin;

        nProgressVal = Math.min(nProgressVal, nMax);
        nProgressVal = Math.max(nProgressVal, nMin);

        this.value = nProgressVal;
        this.jValue.width(nWidth*(nProgressVal-nMin)/(nMax-nMin));

        if (nProgressVal == nMax)
        {
            this._notify("end");

            if (this.option.autoClose)
            {
                this.jProgress.addClass ("hide");
            }

            this.option.lock && Frame.MyScreen.unlock ();
        }
    },

/*****************************************************************************
@FuncName: public, JQuery.Progressbar.increase
@DateCreated: 2011-08-08
@Author: huangdongxiao 02807
@Description:  设置进度条的当前值。
@Usage: 
@ParaIn: 
    *nProgressVal:integer,进度条的值，如果不在设置的范围内，则设置为最近的值。
        即：如果大于最大值，则设置为最大值；如果小于最小值，则设置为最小值。
@Caution: 
@Modification:
    * yyyy-mm-dd: Author, add or modify something
*****************************************************************************/
    increase: function (nStep)
    {
        this.set (nStep + this.value);
    },

    _notify: function(sEvent)
    {
        var sName = "on" + sEvent.charAt(0).toUpperCase() + sEvent.substring(1);
        var pfEvent = this.option[sName];
        if (pfEvent)
        {
            pfEvent.apply(this);
        }
    }
};

function _init(oFrame)
{
    $(".progress-bar", oFrame).progressbar();
}

function _destroy(oFrame)
{
    // $(".progress-bar", oFrame).progressbar();
}

$.widget("ui.progressbar", oMyCtrl);
Widgets.regWidget(WIDGETNAME, {
    "init": _init, "destroy": _destroy, 
    "widgets": [], 
    "utils":["Widget"],
    "libs": []
});


})(jQuery);
