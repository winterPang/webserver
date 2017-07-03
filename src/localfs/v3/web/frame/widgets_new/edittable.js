;(function($)
{
var _TypeMap = {};
var _EventMap = {"change": "onChange", "click": "onClick", "focus": "onFocus", "blur": "onBlur", "keyup":"onKeyup"};

function getEditor(oColDef)
{
    return _TypeMap[oColDef.datatype] || _TypeMap["Default"];
}

function createEditor(jTd, oColDef, sErrorId, oVal ,pfGetDom)
{
    var args = {
        trigger: Handler.trigger,
        container:jTd,
        column:oColDef,
        "errorId":sErrorId
    };

    if(oColDef.onChangeVal)
    {
        args.onChanged = function(e){
            oColDef.onChangeVal(e,pfGetDom());
        }
    }

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

    // save the editor and column defination
    jTd
        .data("editor", oEditor)
        .data("colDef", oColDef);

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
    $("td.edittable-cell", jTr).each(function()
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
    var oFocusEle = false;
    $("td.edittable-cell", jTr).each(function()
    {
        var oEditor = $(this).data("editor");
        if (!oEditor)
        {
            return;
        }

        oFocusEle = oFocusEle || oEditor.getDom();

        triggerColumn (oEditor.getDom(), $(this).data("colDef"), aParas);
    });

    if (oFocusEle)
    {
        oFocusEle.focus ();
    }
}

function changeRowCss (jTr)
{
    var jNextTr = jTr.next();
    var sClass = jTr.is(".odd") ? "odd" : "even";
    var oClassMap = {"odd":"even", "even": "odd"};
    while(jNextTr.length > 0)
    {
        jNextTr.removeClass(oClassMap[sClass]).addClass(sClass);
        sClass = oClassMap[sClass];
        jNextTr = jNextTr.next();
    }
}

function changeEmptyCss (jEle)
{
    var jTable = $(jEle).closest(".edittable-table");
    var jDataBlock = $(".data-rows", jTable);
    var jAddBlock = $(".new-row", jTable);
    var jTHead = $("thead", jTable);

    if (jDataBlock.children().length == 0)
    {
        jTable.addClass ("empty-body");
    }
    else
    {
        jTable.removeClass ("empty-body");
    }

    if (jAddBlock.children().length == 0)
    {
        jTable.addClass ("empty-editor");
    }
    else
    {
        jTable.removeClass ("empty-editor");
    }

    if (jTHead.children().length == 0)
    {
        jTable.addClass ("empty-head");
    }
    else
    {
        jTable.removeClass ("empty-head");
    }
}

var Handler = 
{
    _defaultProcData: function (oData, oPara)
    {
        oPara.onSuccess(oData.type);
    },
    trigger: function (sEvent, srcObj)
    {
        /*
        this = {
            trigger: function (){},
            container:jTd,
            column:oColDef,
            "errorId":jThis._options.errorId
        };
        */
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

        var jTr = this.container.closest("tr");
        var aParas = getParas (jTr);
        return pfMethod.apply (srcObj, aParas);
    },
    onEditRow: function (e)
    {
        var jThis = $(this);
        var jTr = jThis.closest("tr");

        jThis.unbind()
            .removeClass("fa fa-pencil")
            .addClass("icon-ok");

        jTr.find(".fa-trash-o").addClass("fa fa-ban");
        jTr.data("instance").addFormat(jTr);
    },
    onEditSubmit: function (e)
    {
        var jThis = $(this);

        if (jThis.hasClass("disabled"))
        {
            return;
        }

        var jTr = jThis.closest("tr");
        var oInstance = jTr.data("instance");
        var oRowData = oInstance._getCurRowValue("edit", jTr);

        jThis.addClass ("disabled");
        Handler.onFailed(oInstance, "");
        if (!oInstance.checkRows(jTr))
        {
            jThis.removeClass ("disabled");
            return;
        }
        jTr.find(".fa-trash-o").removeClass("fa-ban");
        var oPara = {
            onSuccess: function(sType){
                if(sType === "edit")
                {
                    jThis.unbind()
                        .removeClass("icon-ok")
                        .addClass("fa fa-pencil");                
                    oInstance.removeFormat(jTr);
                    jTr.data("sourceData",oRowData);
                    jThis.removeClass ("disabled");
                }
            },
            onFailed: function(sMsg,sType,aColNames){
                Handler.onFailed(oInstance, sMsg, sType, aColNames);
                jThis.removeClass ("disabled");
            }
        };

        var pfProc = oInstance._options.procData;
        var oData = {type:"edit",olddata:jTr.data("sourceData"),curdata:oInstance._getCurRowValue("edit",jTr)};
        pfProc.apply(this, [oData, oPara]);
    },
    onPlusRow: function (e)
    {
        var jTr = $(this).closest("tr");
        var oInstance = jTr.data ("instance");

        var oRowData;
        var oPara = {
            onSuccess: function(sType)
            {
                // oInstance.removeFormat(jTr);
                var jNewTr = oInstance.addOneRow (oRowData, oInstance._options.insertBefore);

                oInstance.notify("onRowChanged",[oInstance._rowCount]);
                if(!oInstance._options.editMode)
                {
                    jNewTr.addClass ((jNewTr.next().is(".odd")) ? "even" : "odd");
                }

                changeEmptyCss (jNewTr);
                if(oInstance._rowCount == oInstance._options.maxCount)
                {
                    // hide the empty row
                    oInstance.hideEmptyRow ();
                }
                else
                {
                    oInstance._resetEditor (jTr);
                    oInstance.focusFirst();
                }
            },
            onFailed: function(sMsg,sType,aColNames)
            {
                Handler.onFailed(oInstance, sMsg,sType,aColNames);
            }
        };

        Handler.onFailed(oInstance, "");
        if(oInstance.checkRows(jTr))
        {
            oRowData = oInstance._getCurRowValue("add", jTr);

            var pfProc = oInstance._options.procData;
            var oData = {type:"add",curdata:oRowData};
            pfProc.apply(this, [oData, oPara]);
        }
    },
    onMinusRow: function (e)
    {
        if($(this).hasClass("fa fa-ban"))
        {
            return false;
        }
        var jTr = $(this).closest("tr");
        var oInstance = jTr.data ("instance");
        var pfProc = oInstance._options.procData;
        var oPara = {
            onSuccess: function(sType){
                if(sType === "delete")
                {
                    var jTBody = jTr.parent();

                    // change the row class "odd" or "even" after the removed row
                    if(!oInstance._options.editMode)
                    {
                        changeRowCss (jTr);
                    }

                    // remove the selected row
                    jTr.remove();

                    var nCount = oInstance._rowCount--;
                    if(nCount == oInstance._options.maxCount)
                    {
                        oInstance.addEmptyRow();
                    }                
                    oInstance.notify("onRowChanged",[oInstance._rowCount]);

                    changeEmptyCss (jTBody);
                }
            },
            onFailed: function(sMsg){Handler.onFailed(oInstance, sMsg);}
        };

        function getTrIndex(jTr)
        {
            var k = 0;
            var jPre = jTr;
            for (; jPre[0]; k++)
            {
                jPre = jPre.prev();
            }
            return k;
        }

        var nIndex = getTrIndex(jTr);
        var oData = {type:"delete",row:nIndex,curdata:oInstance._getCurRowValue("delete",jTr)};

        Handler.onFailed(oInstance, "");
        pfProc.apply(this, [oData, oPara]);   

        oInstance.element.trigger("myRemove");//register remove event                
    },
    onFailed: function(oInstance, sMsg, sType, aColNames){
        if(sMsg)
        {
            var sErrMsg = ($.isArray(sMsg)) ? sMsg.join("") : sMsg;
            $("#"+oInstance._options.errorId).html(sErrMsg).show();
        }
        else
        {
            $("#"+oInstance._options.errorId).empty().hide();
        }

        sType = sType || "add";

        var jScope = sType == "add" ? oInstance._jEmptyBody : oInstance._jTbody.find(".row-edit");

        aColNames = aColNames || [];

        if (!$.isArray(aColNames))
        {
            aColNames = [aColNames];
        }

        if(aColNames.length > 0)
        {
            $(".edittable-element",jScope).each(function(){
                var sName = this.getAttribute("name") ;
                for(var i=0;i<aColNames.length;i++)
                {
                    if(sName == aColNames[i])
                    {
                        $(this).addClass("text-error");
                        break;
                    }
                }
            });
        }
    }
};

var _oDefOption = {
    procData: Handler._defaultProcData,
    rowEdit: true,
    rowMinus: true,
    rowAdd: true,
    editMode:false,
    insertBefore: false
};

function getColNames (jContainer, colNames)
{
    var aColName = colNames || jContainer.attr("cols");
    if("string"==typeof(aColName))
    {
        aColName = aColName.split(",");
    }
    return aColName;
}

var oMyCtrl = 
{
    VERSION: "1.0",
    NAME: "EditTable",

    _rowCount: 0,
    _options: {},
    _jTbody: false,
    _jDiv:false,
    _create: function()
    {
        var ele = this.element;          
        
        if(oMyCtrl.NAME == ele.attr("ctrl"))
        {
            return false;
        }

        this._jDiv = $("#"+ele.attr("id"));
        ele.attr("ctrl", oMyCtrl.NAME).addClass("edittable");
        return;
    },
    destroy: function()
    {
        this.element.removeAttr("ctrl");
        this._options = {};
        $.Widget.prototype.destroy.call(this);
    },
    _createHeader: function(jTable)
    {
        // create the table header line
        var opt = this._options;
        var aColMode = opt.colModel;

        // add data columns
        var nLen = aColMode.length;

        if (!aColMode[0].title)
        {
            // add "no-header" class on the element, if the caller can't specific the "colNames"
            this.element.addClass ("no-header");
            return;
        }

        this.element.addClass ("table-responsive");

        // create list header
        var sWidth=((this._options.rowEdit) && (!this._options.editMode)) ? "80" : "40";
        var aHtml = [];

        // create header HTML
        aHtml.push("<thead><tr class='edittable-header'>");

        for(var i=0; i<nLen; i++)
        {
            aHtml.push(Utils.Base.sprintf("<th>%s</th>", aColMode[i].title));
        }

        // add operation column
        if (opt.rowMinus || opt.rowEdit || opt.rowAdd)
        {
            aHtml.push("<th></th>");
        }

        // end tag
        aHtml.push("</tr></thead>");

        jTable.html(aHtml.join(''));
    },
    setOption: function(opt)
    {
        // set the options and init the table
        var aColName = getColNames (this.element, opt.colNames);
        var aColModel = opt.colModel;

        opt.colModel = [];
        for(var i=0; i<aColModel.length; i++)
        {
            var oColDef = aColModel[i];
            if (false === oColDef.support)
            {
                continue;
            }
            oColDef.field = oColDef.id = oColDef.name||"";
            aColName && (oColDef.title = aColName[i]);
            opt.colModel.push (oColDef);
        }

        if(this._jTbody)
        {
            this._jTbody.remove();
            this._jTbody = false;
        }
                  
        this._options = $.extend({}, _oDefOption, opt);

        if (!this._options.errorId)
        {
            var sErrorId = this.element.attr("id")+"_error";
            this._options.errorId = sErrorId;
        }

        /* add datas */
        var aDatas = this._options.data || [];
        this.addRows(aDatas);
    },
    addOneRow: function(oData, bInsert)
    {
        // add one line to ths table
        var aColMode = this._options.colModel;
        var jTr = $("<tr class='edittable-row'>")
            .data ("instance", this)
            .data("sourceData", oData)
            .addClass("row-active");

        function checkEnable (opt, oData)
        {
            var bEnable = opt;
            if ($.isFunction(opt))
            {
                bEnable = opt (oData);
            }
            else if ("string" == typeof(opt))
            {
                bEnable = ("true" == opt);
            }
            return bEnable;
        }

        // add data columns
        for(var i=0; i<aColMode.length; i++)
        {
            var oColDef = aColMode[i];
            $("<td class='edittable-cell'></td>")
                .attr("data-title", oColDef.title||"")
                .html (this.setTextCol(oData,oColDef))
                .appendTo (jTr);
        }
        if(this._options.editMode)
        {
            this.addFormat(jTr);
        }

        // add operator column
        if (this._options.rowMinus || this._options.rowEdit || this._options.rowAdd)
        {
            var jOptTd = $("<td class='edittable-operation'></td>");

            if (checkEnable (this._options.rowEdit, oData) && (!this._options.editMode))
            {
                var jIconEdit = $("<i class='fa fa-pencil'></i>");
                jOptTd.append (jIconEdit);
                jIconEdit.click(Handler.onEditRow);
            }

            if (checkEnable (this._options.rowMinus, oData) )
            {
                var jIconMinus = $("<i class='fa fa-trash-o'></i>");
                jOptTd.append (jIconMinus);
                jIconMinus.click(Handler.onMinusRow);
            }
            jOptTd.appendTo (jTr);
        }

        if (true === bInsert)
        {
            this._jTbody.prepend (jTr);
        }
        else
        {
            this._jTbody.append(jTr);
        }
        this._rowCount++;
        return jTr;
    },
    addEmptyRow: function(oData)
    {
        function getAllEditor()
        {
            var aDom = [];
            for(var i=0;i<aRowEditors.length;i++)
            {
                aDom.push(aRowEditors[i].getDom());
            }
            
            return aDom;
        }
        // add one line to ths table
        if(this._rowCount >= this._options.maxCount)
        {
            this.hideEmptyRow ();
            return false;
        }

        if ($("tr", this._jEmptyBody).length > 0)
        {
            this._jEmptyBody.show ();
            return true;
        }

        var aColMode = this._options.colModel;
        var jTr = $("<tr class='edittable-row'>").data ("instance", this);            
        var jOptTd = $("<td class='edittable-operation'></td>");
        var jIconPlus = $("<i class='icon-plus'></i>");
        var aRowEditors = [];

        for(var i=0; i<aColMode.length; i++)
        {
            var oColDef = aColMode[i];
            var jTd = $("<td class='edittable-cell' data-title='"+ oColDef.title +": '></td>");

            var oEditor = createEditor(jTd, oColDef, this._options.errorId, oData, getAllEditor);

            aRowEditors.push(oEditor);

            var oDom = oEditor.getDom();
            if (oDom)
            {
                oDom.setAttribute ("nocheck", "true");
            }

            jTd.appendTo (jTr);
        }

        // add operator column
        if (this._options.rowAdd)
        {
            jOptTd.append (jIconPlus);
            jIconPlus.click(Handler.onPlusRow);
            jOptTd.appendTo (jTr);
        }

        triggerFirst (jTr);

        this._jEmptyBody.prepend(jTr);
        return jTr;
    },
    hideEmptyRow: function ()
    {
        this._jEmptyBody.hide ();
    },
    getTextByValue: function (aData, value,oWidgetOpt)
    {
        var sText = (oWidgetOpt)?oWidgetOpt.displayField:"text";
        var sValue = (oWidgetOpt)?oWidgetOpt.valueField:"value";
        for(var i=0; i<aData.length; i++)
        {
            if(aData[i][sValue] == value)
            {
                return aData[i][sText];
            }
        }
        return "";
    },
    setTextCol: function (oData, oColMode)
    {
        var sTextNew = "";
        var sValue,sText;
        if(oColMode.widgetOpt)
        {
            var oWidgetOpt = oColMode.widgetOpt;
            sValue = oData[oWidgetOpt.valueField]; 
            sText = oData[oWidgetOpt.displayField];
            if(oColMode.data)
            {
                var aSelectData = Frame.ListString.format(oColMode.data);
                sTextNew = this.getTextByValue(aSelectData,sValue,oWidgetOpt);
            }
            else
            {
                sTextNew = sText||"";
            }
        }
        else
        {
            sValue = (oData[oColMode.name] == undefined) ? "" : oData[oColMode.name];
            if(oColMode.data)
            {
                var aSelectData = Frame.ListString.format(oColMode.data);
                sTextNew = this.getTextByValue(aSelectData,sValue);
            }
            else
            {
                sTextNew = sValue;
            }
        }
        if((oColMode.defVal) && (sTextNew === ""))
        {
            sValue = oColMode.defVal;
            sTextNew = sValue;
        }

        if ("Password" == oColMode.datatype)
        {
            sTextNew = "******";
        }
        else if("Checkbox" == oColMode.datatype)
        {
            sTextNew = (sValue == "true")? $.MyLocale.Yes :$.MyLocale.No;
        }

        if (oColMode.formatter)
        {
            sTextNew = oColMode.formatter (0, 0, sTextNew, oColMode, oData, "html");
        }
        sValue = sValue + "";
        sValue.replace(/\'/g,'&apos;').replace(/\'/g,'&quot;');
        return "<span class='edittable-element' id='"+oColMode.name+"' value='"+sValue+"'>"+sTextNew+"</span>";
    },
    addFormat:function(jTr)
    {
        var oData = {};
        var aColMode = this._options.colModel;
        var jThis = this;
        jTr.find("td .icon-ok").click(Handler.onEditSubmit);

        if(!this._options.editMode)
        {
            jTr.removeClass("row-active");
            jTr.addClass("row-edit");
        }
        jTr.find("td.edittable-cell").each(function(index,oCell)
        {            
            var jCell = $(this);
            var oColDef = aColMode[index];
            if(oColDef.readonly)
            {
                return true;
            }
            var jEle = jCell.find("span.edittable-element");
            if(jEle)
            {
                oData[jEle.attr("id")] = jEle.attr("value");
            }
            jCell.empty();

            createEditor(jCell, oColDef, jThis._options.errorId, oData);
        });

        triggerFirst (jTr);
    },
    removeFormat: function(jTr)
    {
        var jThis = this;
        var aColMode = jThis._options.colModel;
        var instance = jTr.data ("instance");
        var oRowData = instance._getCurRowValue("edit", jTr);

        var getText = function (oColDef)
        {
            return jThis.setTextCol (oRowData, oColDef);
        }
        
        // tr
        jTr.addClass("row-active changed").removeClass("row-edit");

        // icon plus
        jTr.find("td .icon-plus")
            .unbind()
            .removeClass("icon-plus ")
            .addClass("fa-trash-o")
            .click(Handler.onMinusRow);

        if(jThis._options.editMode)
        {
            return false;
        }
        // icon edit
        jTr.find("td .fa-pencil").click(Handler.onEditRow);

        // icon plus sign
        jTr.find("td.edittable-cell").each(function(index,oCell)
        {
            var jCell = $(this);
            var oEditor = jCell.data("editor");
            if(oEditor)
            {
                var oColDef = jCell.data("colDef");
                jCell.html (getText (oColDef)).removeData("editor");
            }
        });
    },
    checkRows: function(jTr)
    {
        var bRet = true;
        var aColMode = this._options.colModel;

        // get editors
        var aParas = getParas (jTr);
        jTr.find("td.edittable-cell").each(function(index,oCell)
        {
            var oResult;
            var oEditor = $(this).data("editor");
            if (!oEditor)
            {
                return true;
            }

            var oEle = oEditor.getDom();
            if (!oEle)
            {
                return ;
            }

            oEle.removeAttribute ("nocheck");
            oResult = oEditor.validate.apply(oEditor, aParas);
            oEle.setAttribute ("nocheck", "true");

            if(!oResult.valid)
            {
                bRet = false;
                return bRet;
            }
        });
        return bRet;
    },
    notify: function(sEvent,Para)
    {
        if(this._options[sEvent])
        {
            this._options[sEvent].apply(this,Para);
        }
    },
    addRows: function(aData)
    {
        var jTr = false;

        if(!this._jTbody)
        {
            var jTable = $('<table class="edittable-table table"></table>');
            this._createHeader(jTable);
            this.element.find("table.table").remove();
            jTable.appendTo(this.element);
            this._jTbody = $("<tbody class='data-rows'></tbody>").appendTo(jTable);
            this._jEmptyBody = $("<tbody class='new-row'></tbody>").appendTo(jTable);
        }

        for(var i=0; i<aData.length; i++)
        {
            jTr = this.addOneRow(aData[i]);
            if(!this._options.editMode)
            {
                var sClass = (i%2 == 0) ? "odd" : "even";
                jTr.addClass (sClass);
            }
        }

        this.addEmptyRow();

        changeEmptyCss (this._jTbody);

        return i;
    },
    updateSelect: function ()
    {
        var aColMode = this._options.colModel;
        var jTr = $("tr:last", this._jEmptyBody);
        jTr.find("td.edittable-cell").each(function(index,oCell)
        {
            var jSelect = $(oCell).find("select");
            if(jSelect.length > 0)
            {
                var aOptions = [];
                var column = aColMode[index];
                var d = column.data || [];
                var widgetOpt = column.widgetOpt || {};
                if((column.classname == "singleSelect") && (widgetOpt.allowClear))
                {
                    aOptions.push("<option>");
                }
                Frame.ListString.each(d, widgetOpt, function(val, text)
                {
                    aOptions.push("<option value='"+val+"'>" + text);
                });

                jSelect.html(aOptions.join('')).change();
            }
        });
    },
    focusFirst: function()
    {
        $("td.edittable-cell", this._jEmptyBody).each(function(index,oCell)
        {
            var editor = $(this).data("editor");
            if (editor)
            {
                editor.focus();
                return false;
            }
        });
    },
    _getCurRowValue: function(sType, jTr)
    {
        var oValues = {};
        var aColMode = this._options.colModel;
        jTr.find("td.edittable-cell").each(function(index,oCell)
        {
            if((sType === "delete")||((aColMode[index].readonly)&&(sType==="edit")))
            {
                var oEle = $(oCell).find("span.edittable-element")[0];
                if(oEle)
                {
                    oValues[oEle.id] = $(oEle).attr("value");
                }
            }
            else
            {
                var editor = $(this).data("editor");
                var oEle = editor ? editor.getDom() : false;
                if (oEle)
                {
                    oValues[oEle.name] = editor.serializeValue();
                }
            }
        });
        return oValues;
    },
    _resetEditor: function (jTr)
    {
        jTr.find("td.edittable-cell").each(function(index,oCell)
        {
            var editor = $(this).data("editor");
            editor && editor.reset ();
        });
        jTr.find(".edittable-element").removeClass("text-error");
    },
    getRowsCount: function()
    {
        return this._rowCount;
    },
    trigger: function (sEventName, oParaData)
    {
        var jTr = false;
        if (sEventName == "add")
        {
            jTr = this._jEmptyBody.find("tr");
        }
        else if (sEventName == "del")
        {
            jTr = $(this._jTbody.find("tr").get(oParaData.row));
        }

        var oEvent = {
            "add": Handler.onPlusRow,
            "del": Handler.onMinusRow
        };

        var pfProc = oEvent[sEventName];
        if (pfProc && jTr && jTr[0])
        {
            return pfProc.apply (jTr[0]);
        }
    },
    value: function(aValue)
    {
        //get
        if(!aValue)
        {
            var aValueData = [];
            var aRows = this._jDiv.find(".edittable-row.row-active");
            for(var i=0; i<aRows.length; i++)
            {
                var jTr = $(aRows[i]);
                if (!this.checkRows (jTr))
                {
                    return false;
                }

                var oValues = {};
                jTr.find("td.edittable-cell").each(function(index,oCell)
                {
                    var oEditor = $(this).data("editor");
                    var oEle;
                    if(oEditor)
                    {
                        oEle = oEditor.getDom();
                        if(oEle){oValues[oEle.name] = oEditor.serializeValue();}
                    }
                    else
                    {
                        oEle = $(oCell).find("span.edittable-element")[0];
                        if(oEle){oValues[oEle.id] = $(oEle).attr("value");}
                    }
                });
                aValueData.push(oValues);
            }
            return aValueData;
        }

        // set
        if((this._options.noOperFlag) && (aValue.length == 0))
        {
            return;
        }
        this._jTbody && this._jTbody.empty();
        this._rowCount = 0;
        this.addRows(aValue);
        this._resetEditor(this._jEmptyBody.find(".edittable-row"));
        return;            
    },
    disable: function()
    {   
        this._jDiv.addClass("ui-state-disabled");
        $("input, select", this._jDiv).attr("disabled", true);
    },
    enable: function()
    {
        this._jDiv.removeClass("ui-state-disabled");
        $("input, select", this._jDiv).attr("disabled", false);
    }
    ,setError: function(aColNames,sMsg,jScope)
    {
        sMsg = sMsg || "";
        jScope = jScope || this._jEmptyBody;
        aColNames = aColNames || [];

        if (!$.isArray(aColNames))
        {
            aColNames = [aColNames];
        }

        var sErrorId = this._options.errorId;

        if(sMsg)
        {
            $("#"+sErrorId).html(sMsg).show();
        }

        if(aColNames.length == 0)
        {
            $(".edittable-element",jScope).addClass("text-error");
        }

        $(".edittable-element",jScope).each(function(){
            var sName = this.getAttribute("name") ;
            for(var i=0;i<aColNames.length;i++)
            {
                if(sName == aColNames[i])
                {
                    $(this).addClass("text-error");
                    break;
                }
            }
        });
    }
    ,
    cleanError: function()
    {
        var sErrorId = this._options.errorId;
        $("#"+sErrorId).empty().hide();
        $(".edittable-row .edittable-element",this._jEmptyBody).removeClass("text-error");
    }
};

function _init(oFrame)
{
    $(".edittable", oFrame).EditTable();

    _TypeMap = {
        "Checkbox": Frame.Editors.Checkbox ,
        "Date":     Frame.Editors.Date     ,
        "DateRange":Frame.Editors.DateRange,
        "Time":     Frame.Editors.Time     ,
        "Default":  Frame.Editors.String   ,
        "EString":  Frame.Editors.Text     ,
        "IP":       Frame.Editors.Ip       ,
        "IString":  Frame.Editors.Text     ,
        "Integer":  Frame.Editors.Integer  ,
        "Ipv4":     Frame.Editors.Ipv4     ,
        "Ipv6":     Frame.Editors.Ipv6     ,
        "MValue":   Frame.Editors.Percent  ,
        "Mac":      Frame.Editors.Mac      ,
        "Mask":     Frame.Editors.Mask     ,
        "Mask6":    Frame.Editors.Mask6    ,
        "Operator": Frame.Editors.Percent  ,
        "Order":    Frame.Editors.Order    ,
        "Password": Frame.Editors.password ,
        "Percent":  Frame.Editors.Percent  ,
        "Port":     Frame.Editors.Text     ,
        "String":   Frame.Editors.String   ,
        "Text":     Frame.Editors.LongText ,
        "Vlanlist": Frame.Editors.Vlanlist ,
        "SText":    Frame.Editors.SimpleText,
        "Hexa":     Frame.Editors.Hexa
    };
}

function _destroy()
{
}

$.widget("ui.EditTable", oMyCtrl);

Widgets.regWidget(oMyCtrl.NAME, {
    "init": _init, "destroy": _destroy, 
    "widgets": [], 
    "utils":["Widget"],
    "libs": ["Libs.slickgrid.editors"
            ,"Widgets.MList"]
});
})(jQuery);
