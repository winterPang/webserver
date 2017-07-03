;(function($)
{
var WIDGETNAME = "EditList";

var _TypeMap = {};
var _EventMap = {"change": "onChange", "click": "onClick", "focus": "onFocus", "blur": "onBlur", "keyup":"onKeyup"};

function getEditor(oColDef)
{
    return (_TypeMap[oColDef.datatype] || _TypeMap["Default"]).editor;
}
function getFormatter(oColDef)
{
    return oColDef.formatter || (_TypeMap[oColDef.datatype] || _TypeMap["Default"]).formatter;
}
function getFilter(oColDef)
{
    return oColDef.filter || (_TypeMap[oColDef.datatype] || _TypeMap["Default"]).filter;
}

function createEditor(jTd, oColDef, sErrorId, oVal)
{
    var args = {
        trigger: Handler.trigger,
        container:jTd,
        column:oColDef,
        "errorId":sErrorId
    };

    var Editor = getEditor(oColDef);
    var oEditor = new Editor(args);

    if (oColDef.editor)
    {
        var oCustomEditor = oColDef.editor;
        if ($.isFunction(oColDef.editor))
        {
            oCustomEditor = oColDef.editor ();
        }
        $.extend (oEditor, oCustomEditor);
    }

    // set default value
    var oDefVal = oVal;
    if (!oDefVal)
    {
        if (undefined !== oColDef.defVal)
        {
            oDefVal = {};
            oDefVal[oColDef.name] = oColDef.defVal;
        }
    }
    if (oDefVal)
    {
        oEditor.loadValue(oDefVal);
    }

    // return the editor instance
    return oEditor;
}

function triggerColumn (oSrc, oColDef, aParas)
{
    for (var key in _EventMap)
    {
        var sEvtName = _EventMap[key];
        var pfEvt = oColDef[sEvtName];
        pfEvt && pfEvt.apply (oSrc, aParas);
    }
}

function getParas (jTr)
{
    var aParas = [];
    $("td.cell", jTr).each(function()
    {
        aParas.push ($(this).data("editor"))
    });
    aParas.push (jTr.data("sourceData"));
    return aParas;
}

function triggerFirst (jTr)
{
    // get editors
    var aParas = getParas (jTr);

    // trigger each column
    $("td.cell", jTr).each(function()
    {
        var oEditor = $(this).data("editor");
        if (!oEditor)
        {
            return;
        }

        triggerColumn (oEditor.getDom(), $(this).data("column"), aParas);
    });
}

var Handler = 
{
    trigger:function (sEvent, srcObj)
    {
        /*
        this = {
            trigger: function (){},
            container:jTd,
            column:oColDef,
            "errorId":jThis._options.errorId
        };
        */
        function onCheckRowState () 
        {
            var jRowEle = $(this);
            if(jRowEle.find(".cell-text").children().hasClass("changed"))
            {
                jRowEle.addClass("edited");
            }
            else
            {
                jRowEle.removeClass("edited");
            }
        }

        var jTr = this.container.closest("tr");
        onCheckRowState.apply(jTr);

        var sMethod = _EventMap[sEvent];
        if (!sMethod)
        {
            return;
        }

        var pfMethod = this.column[sMethod]; // defined in user page
        if (!pfMethod)
        {
            return;
        }

        var aParas = getParas (jTr);
        return pfMethod.apply (srcObj, aParas);
    }
}

var FilterType = {
    "string": function (oData, oFilter)
    {
        var sKey = this.name;
        var sValue = oData[sKey];
        var sFilter = ("" + oFilter[sKey]).toLowerCase();
        return (("" + sValue).toLowerCase().indexOf(sFilter) != -1);
    },
    "integer": function (oData, oFilter)
    {
        var sKey = this.name;
        var sValue = oData[sKey];
        var sFilter = oFilter[sKey];
        return (sValue == sFilter);
    },
    "ip": function (oData, oFilter)
    {
        var sKey = this.name;
        var sValue = oData[sKey];
        var sFilter = oFilter[sKey];
        return (sValue.indexOf(sFilter) == 0);
    },
    "ipv4": function (oData, oFilter)
    {
        var sKey = this.name;
        var sValue = oData[sKey];
        var sFilter = oFilter[sKey];
        return (sValue.indexOf(sFilter) == 0);
    },
    "ipv6": function (oData, oFilter)
    {
        var sKey = this.name;
        var sValue = oData[sKey];
        var sFilter = oFilter[sKey];
        return (sValue.indexOf(sFilter) == 0);
    },
    "port": function (oData, oFilter)
    {
        var sKey = this.name;
        var sValue = oData[sKey];
        var sFilter = oFilter[sKey];
        return (sValue.indexOf(sFilter) == 0);
    },
    "order": function (oData, oFilter)
    {
        var sKey = this.name;

        if (!this._formatterData)
        {
            this._formatterData = Frame.ListString.format(this.data);
        }
        var aList = this._formatterData;
        var sValue = Frame.ListString.getTextByValue(aList, oData[sKey]);
        var sFilter = oFilter[sKey];
        return (("" + sValue).toLowerCase().indexOf(sFilter) != -1);
    },
    "vlanlist": function (oData, oFilter)
    {
        var sKey = this.name;
        var sValue = oData[sKey];
        var sFilter = oFilter[sKey];
        return (sValue.indexOf(sFilter) != -1);
    }
};

function DataManger(aColOpt)
{
    var _aData = [];
    var _oFilter = false;
    var _aColOpt = aColOpt;

    function checkData (oData)
    {
        for (var i=0; i<_aColOpt.length; i++)
        {
            var pfFilter = getFilter (_aColOpt[i]);
            if (pfFilter&&pfFilter.apply(_aColOpt[i], [oData, _oFilter]))
            {
                return true;
            }
        }
        return false;
    }

    function getData()
    {
        if (!_oFilter)
        {
            return _aData;
        }

        var aData = [];
        for (var i=0; i<_aData.length; i++)
        {
            if (checkData(_aData[i]))
            {
                aData.push (_aData[i]);
            }
        }
        return aData;
    }

    function setData(aData)
    {
        _aData = aData;
    }

    function setFilter(filter)
    {
        if (!filter)
        {
            _oFilter = false;
            return ;
        }

        if ("string" == typeof(filter))
        {
            _oFilter = {};
            for (var i=0; i<_aColOpt.length; i++)
            {
                _oFilter[_aColOpt[i].id] = filter;
            }
            return;
        }

        // object
        _oFilter = filter;
    }

    this.getData = getData;
    this.setData = setData;
    this.setFilter = setFilter;
}

var Searcher = {
    create: function (jContainer, bSearch, pfSearch)
    {
        if (false === bSearch)
        {
            return;
        }

        // search input
        var jFilterDiv = $("<div class='filter-div'></div>");
        var jInput = $("<input type='text' class='search form-control'>")
            .attr("placeholder", $.MyLocale.MList.search.SEARCH)
            .appendTo (jFilterDiv)
            .keydown (function (e)
            {
                if (e.which == 13)
                {
                    return false;
                }
            })
            .keyup (function (e)
            {
                if (e.which == 27) {
                    this.value = "";
                }
                pfSearch && pfSearch (this.value)
            });
            jFilterDiv.appendTo (jContainer);
    }
}

var ToolbarButtons = {
    create: function (jContainer, buttons)
    {
        if(!buttons) return;

        // default buttons
        var BtnMode = Frame.Button.Mode;
        var MyLocale = $.MyLocale;
        var oSupportBtn = {"apply": true};
        var aDefBtn = [
            {id:"editlist_apply",   name:"apply",   value:MyLocale.Buttons.OK,  enable:true, className:"btn-primary"}
        ];

        // get user buttons
        var aUserBtn = [];    // buttons;
        var aOptBtn = buttons;
        for (var i = 0; i < aOptBtn.length; i++) 
        {
            var oBtnDef = aOptBtn[i];
            if (oSupportBtn[oBtnDef.name])
            {
                aUserBtn.push(oBtnDef);
            }
        }

        var aButton = Frame.MList.Tools.mergeButton (aDefBtn, aUserBtn, false);
        // buttons in toolbar
        var jBtnGroup = $("<div class='btn-group'></div>");
        if (Frame.MList.Buttons._makeHtml(jBtnGroup, aButton, false) > 0)
        {
            jBtnGroup.appendTo (jContainer);
        }
    }
}

var ToolBar = {
    create: function (opt, jContainer, pfSearch)
    {
        var jToolBar = $("<div class='tool-bar'></div>").appendTo(jContainer);
        Searcher.create (jToolBar, opt.search, pfSearch);
    }
};

var HelpIcon = {
    create: function (jContainer, buttons)
    {
        if(!buttons) return;

        var oHelpBtn = false;    // buttons;
        for (var i = 0; i < buttons.length; i++) 
        {
            var oBtnDef = buttons[i];
            if ("help" == oBtnDef.name)
            {
                oHelpBtn = oBtnDef;
                break;
            }
        }

        if (!oHelpBtn)
        {
            return;
        }

        if (oHelpBtn.action)
        {
            $("<i class='icon-question-sign'></i>")
                .prependTo (jContainer)
                .click (function (e)
                {
                    oHelpBtn.action.apply (this);
                });
            return ;
        }

        if (oHelpBtn.dlg)
        {
            // create dropdown list
            var aHtml = [
                '<div class="help-container dropdown-contrainer custom-dropdown">',
                    '<ul class="nav"><li class="dropdown">',
                        '<a class="dropdown-toggle custom-toggle" data-toggle="dropdown"><i class="icon-question-sign"></i></a>',
                        '<ul class="dropdown-menu pull-right">',
                            '<div class="custom-dropdown-arrow"></div>',
                        '</ul>',
                    '</li></ul>',
                '</div>'
            ];
            var jDiv = $(aHtml.join('')).prependTo (jContainer);

            $("#"+oHelpBtn.dlg).remove().appendTo ($(".dropdown-menu", jDiv)).removeClass("hide");
        }
    }
};

Frame.EditList = function (jContainer)
{
    var options = {
        type: MyConfig.MList.EditList || "cell",
        errorId: jContainer.attr("id")+"_error"
    };

    var jTable, jHeader, jBody;
    var _oDataManger = false;

    function getColNames (colNames)
    {
        var aColName = colNames || jContainer.attr("cols");
        if("string"==typeof(aColName))
        {
            aColName = aColName.split(",");
        }
        return aColName;
    }

    function createHeader (jHeader) 
    {
        var aColumns = options.colModel;
        var jTr = $('<tr class="header-columns"></tr>');

        var nCol = aColumns.length;
        for (var i = 0; i < nCol; i++) 
        {
            var m = aColumns[i].title;
            var jTd = $("<th class='ui-state-default header-column'></th>").appendTo (jTr);
            
            $('<div class="column-name"></div>')
                .html (m)
                .appendTo (jTd);
        }

        jTr.appendTo (jHeader);
    }

    function parseOpt (opt) 
    {
        var aColMod;
        var aColName = getColNames (opt.colNames);

        $.extend (options, opt);

        aColMod = options.colModel;
        options.colModel = [];
        for (var i = 0; i<aColMod.length; i++) 
        {
            var oColDef = aColMod[i];
            if (false === oColDef.support)
            {
                continue;
            }

            oColDef.field = oColDef.id = oColDef.name;
            oColDef.title = aColName[i];
            options.colModel.push (oColDef);
        };
    }

    function create (opt)
    {
        jContainer.empty();
        parseOpt (opt);
        options.type = "block";

        _oDataManger = new DataManger(opt.colModel);

        jContainer.addClass(("block"==options.type) ? "block-list" : "cell-list");

        function _doSearch (val)
        {
            _oDataManger.setFilter (val);
            refreshList ();
        }
        ToolBar.create (opt, jContainer, _doSearch);

        jTable = $("<table width='100%'></table>").appendTo(jContainer);

        var jBtnBar = $("<div class='btn-bar'></div>").appendTo(jContainer);
        ToolbarButtons.create (jBtnBar, opt.buttons);

        // if ("cell" == options.type)
        {
            jHeader = $("<thead></thead>").appendTo (jTable);
            createHeader (jHeader);
            HelpIcon.create (jHeader.find("th:last-child"), opt.buttons);
        }

        jBody = $("<tbody></tbody>").appendTo (jTable);
    }

    function destroy ()
    {
        delete _oDataManger;
    }

    function reset ()
    {
        jTable = jHeader = jBody = null;
        jContainer.empty ();
    }

    function refresh (aData) 
    {
        _oDataManger.setFilter ();
        _oDataManger.setData (aData);
        refreshList ();
    }

    function refreshList () 
    {
        var aData = _oDataManger.getData();
        var RowEditor = ("block" == options.type) ? BlockRow : CellRow;
        jBody.empty ();
        for (var i=0; i<aData.length; i++)
        {
            var jTr = RowEditor.addRow.apply (this, [options, i, aData[i]]);
            jTr.data("sourceData", aData[i]).appendTo(jBody);
            triggerFirst (jTr);
        }

        $('input[type=Checkbox]',jBody).MCheckbox();
    }

    function resize (argument) 
    {
        // body...
    }

    function getRowData (oRow, aData)
    {
        var bRet = true;
        var jRow = $(oRow);
        var oData = $.extend({}, jRow.data("sourceData"));
        $(".cell", jRow).each (function(i, oCell)
        {
            bRet = getCellData (oCell, oData);
            return bRet;
        });

        aData.push (oData);
        return bRet;
    }

    function getCellData (oCell, oData)
    {
        var jCell = $(oCell);
        var oEditor = jCell.data("editor");

        if (!oEditor)
        {
            // not editable cell
            return true;
        }

        var oCheck = oEditor.validate();
        if (oCheck.valid)
        {
            var oColDef = jCell.data("column");
            var sVal = oEditor.serializeValue();
            var sKey = oColDef.name;
            oData[sKey] = sVal;
            return true;
        }

        return false;
    }

    function getData (aData) 
    {
        var bRet = true;

        $(".mlist-row", jContainer).each(function(i, oRow)
        {
            bRet = getRowData (oRow, aData);
            return bRet;
        });

        return bRet;
    }

    function getChangedData ()
    {

    }

    function enable (argument) 
    {
        // body...
    }

    this._create = create;
    this._destroy = destroy;
    this.reset = reset;
    this.refresh = refresh;
    this.resize = resize;
    this.getData = getData;
    this.getChangedData = getChangedData;
    this.enable = enable;
};

var CellRow = {
    addCell: function (jRow, row, cell, oData, oColDef, sErrorId) 
    {
        var jCell = $('<td class="cell"></td>');
        var sVal = oData[oColDef.name];

        if (false === oColDef.editor)
        {
            jCell.html (sVal);
        }
        else
        {
            var oEditor = createEditor(jCell, oColDef, sErrorId, oData);

            jCell
                .data("editor", oEditor)
                .data("column", oColDef);
        }

        jCell.appendTo (jRow);
        return jCell;
    }

    ,addRow: function (options, row, oData) 
    {
        var aColumns = options.colModel;
        var sClass = (row%2 == 0) ? "odd" : "even";
        var jRow = $('<tr class="mlist-row"></tr>');
        for (var i=0; i<aColumns.length; i++)
        {
            var oColDef = aColumns[i];
            CellRow.addCell (jRow, row, i, oData, oColDef, options.errorId);
        }

        jRow.data("sourceData", oData).addClass(sClass);
        return jRow;
    }
}

var BlockRow = {
    addCell: function (jRow, row, cell, oData, oColDef, sErrorId,aParas) 
    {
        var sTdTitle = cell ? oColDef.title : "";
        var sVal = oData[oColDef.name];
        var sTdWrapCss = cell ? "cell cell-small" : "cell cell-index";
        var jCellWrap = $('<td class="'+ sTdWrapCss +'" title="'+ oColDef.title +'" data-title="'+ sTdTitle +'" data-init="' + sVal + '"></td>').appendTo(jRow);
        var sCellCss = cell ? "cell-text": "cell-index-text";
        var jCell = $('<div class="'+ sCellCss +'"></div>').appendTo(jCellWrap);
        var jRowBtn = $('<div class="list-row-btn"><i class="fa fa-angle-double-down"></i></div>')
        var oEditor;

        if (false === oColDef.editor)
        {
            jCell.html (sVal);
        }
        else
        {
            oEditor = createEditor(jCell, oColDef, sErrorId, oData);
        }
        aParas.push(oEditor);
        jCellWrap.data("initValue",sVal)
                 .data("editor",oEditor)
                 .data("column", oColDef);

        if(cell == 0)
        {
            jRowBtn.appendTo(jCellWrap)
                .click(handleBtnClick);
        }

        oColDef.checkData && oColDef.checkData(oData, oEditor);

        
        var pfFormater = getFormatter (oColDef);
        if(pfFormater != null){
            var sHtml = pfFormater(row, cell, sVal, oColDef, oData, "html");
            jCell.html (sHtml)
                 .appendTo(jRow.find("tr"));
        }

        return jCellWrap;
        
        function handleBtnClick (e) 
        {
            var jCell = $(this).parent('.cell').siblings();
            var jIconEle = $(this).find("i");
            if(jCell.is(":visible"))
            {
                jIconEle.removeClass("fa fa-angle-double-up").addClass("fa fa-angle-double-down");
                jCell.addClass("cell-small");
            }
            else
            {
                jIconEle.removeClass("fa fa-angle-double-down").addClass("fa fa-angle-double-up");
                jCell.removeClass("cell-small");
            }
        }
    }

    ,addRow: function (options, row, oData) 
    {
        var aColumns = options.colModel;
        var sClass = (row%2 == 0) ? "odd" : "even";
        var jRow = $('<tr class="mlist-row"></tr>');
        var aParas = [], aCellEle = [];
        
        for (var i=0; i<aColumns.length; i++)
        {
            var oColDef = aColumns[i];
            var jCell = BlockRow.addCell (jRow, row, i, oData, oColDef, options.errorId,aParas);
            aCellEle.push(jCell);
        }

        jRow.data("sourceData", oData).addClass(sClass);
        return jRow;
    }
}

var Instance = {
    _create: function()
    {
        this.oInstance = new Frame.EditList(this.element);
    },
    destroy:function()
    {
        this.reset();
        this.oInstance._destroy();
        delete this.oInstance;

        $.Widget.prototype.destroy.call(this);
    },
    head: function(oOption)
    {
        return this.oInstance._create(oOption);
    },
    refresh: function(aData)
    {
        this.oInstance.refresh(aData);
    },
    value: function (val)
    {
        if (val)
        {
            this.oInstance.refresh (val);
            return this;
        }
        else
        {
            return this.getData ();
        }
    },
    resize: function()
    {
        this.oInstance.resize();
    },
    getData: function()
    {
        var aData = [];
        if (this.oInstance.getData(aData))
        {
            return aData;
        }

        return false;
    },
    getChangedData: function ()
    {
        return this.oInstance.getChangedData();
    },
    enable: function(bEable)
    {
        this.oInstance.enable(bEable);
    },
    reset: function()
    {
        this.oInstance.reset();
    }
};

function _init(oFrame)
{
    $(".edit-list", oFrame).EditList();

    _TypeMap = {
        "Checkbox": {editor: Frame.Editors.Checkbox , filter: FilterType["boolean"]},
        "Date":     {editor: Frame.Editors.Date     , filter: FilterType["string"]},
        "DateRange":{editor: Frame.Editors.DateRange, filter: FilterType["string"]},
        "Time":     {editor: Frame.Editors.Time     , filter: FilterType["vlanlist"]},
        "Default":  {editor: Frame.Editors.String   , filter: FilterType["string"]},
        "EString":  {editor: Frame.Editors.Text     , filter: FilterType["string"]},
        "IP":       {editor: Frame.Editors.Ip       , filter: FilterType["string"]},
        "IString":  {editor: Frame.Editors.Text     , filter: FilterType["string"]},
        "Integer":  {editor: Frame.Editors.Integer  , filter: FilterType["integer"]},
        "Ipv4":     {editor: Frame.Editors.Ipv4     , filter: FilterType["string"]},
        "Ipv6":     {editor: Frame.Editors.Ipv6     , filter: FilterType["string"]},
        "MValue":   {editor: Frame.Editors.Percent  , filter: FilterType["string"]},
        "Mac":      {editor: Frame.Editors.Mac      , filter: FilterType["string"]},
        "Mask":     {editor: Frame.Editors.Mask     , filter: FilterType["string"]},
        "Mask6":    {editor: Frame.Editors.Mask6    , filter: FilterType["integer"]},
        "Operator": {editor: Frame.Editors.Percent  , filter: FilterType["string"]},
        "Order":    {editor: Frame.Editors.Order    , filter: FilterType["order"]},
        "Password": {editor: Frame.Editors.password , filter: FilterType["string"]},
        "Percent":  {editor: Frame.Editors.Percent  , filter: FilterType["string"]},
        "Port":     {editor: Frame.Editors.Text     , filter: FilterType["string"]},
        "String":   {editor: Frame.Editors.String   , filter: FilterType["string"]},
        "Text":     {editor: Frame.Editors.String   , filter: FilterType["string"]},
        "ToggleText":{editor: Frame.Editors.ToggleText, filter: FilterType["string"]},
        "Vlanlist": {editor: Frame.Editors.Vlanlist , filter: FilterType["string"]},
        "SText":    {editor: Frame.Editors.SimpleText, filter: FilterType["string"]}
    };
}

function _destroy()
{
}

$.widget("ui.EditList", Instance);

Widgets.regWidget(WIDGETNAME, {
    "init": _init, "destroy": _destroy, 
    "widgets": [], 
    "utils":[],
    "libs": ["Libs.slickgrid.editors"]
});

})(jQuery);