;(function($)
{
    var WIDGETNAME = "MSelect";


function getEditor(oColDef)
{
    return (_TypeMap[oColDef.datatype] || _TypeMap["Default"]);
}

function createEditor(jContainer, oColDef, sErrorId, oVal)
{
    var args = {
        trigger: function(){},
        container:jContainer,
        column:oColDef,
        "errorId":sErrorId
    };

    if(oColDef.label)
    {
        $("<label>"+oColDef.label+"&nbsp;</label>").appendTo(jContainer);
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

    if(oVal)
    {
        oEditor.loadValue(oVal.objvalue);
    }

    jContainer.data("editor", oEditor);
    return oEditor;
}

    var oMultiSelect = {
        options:{
            displayField:"text",
            valueField:"value",
            mode:"1",
            maxCount : null,
            customOpt: {}
        },
        _rowCount: 0,
        _create: function()
        {
            var oMultiselect = this._oMultiselect = this.element; 
            var opt = this.options;
            var jThis = this;
            
            if("mselect" == oMultiselect.attr("ctrl"))
            {
                return false;
            }
            oMultiselect.attr("ctrl", "mselect");
            this.options.displayField = oMultiselect.attr("displayField")||this.options.displayField;
            this.options.valueField = oMultiselect.attr("valueField")||this.options.valueField;
            var jSelected = $("#"+this.element.attr("selectedId"));
            this.options.maxCount = parseInt(jSelected.attr("maxCount"))||null;
            this.options.mode = (jSelected.attr("customMode")==="true")?"2":"1";

            $.fn.select2.defaults.formatNoMatches = function ()   
            {
               return  $.MyLocale.SingleSelect.NoMatches;
            }
            oMultiselect.select2({allowClear:true,placeholder:$.MyLocale.SingleSelect.CHOOSE,placeholderOption:"first"});
            oMultiselect.change(function(){
                var sDisValue = this.options[this.selectedIndex].innerHTML;                
                if(jThis.selectOne({display:sDisValue,value:this.value}))
                {
                    (opt.onChange) && opt.onChange.apply(jThis.element[0]);
                }
            });
        },
        selectOne: function(oValue)
        {
            var opt = this.options;
            if((""==oValue.display)||((this.options.maxCount) && (this._rowCount >= this.options.maxCount)))
            {
                return;
            }
            if(this._rowCount == 0)
            {
                var jSelected = $("#"+this.element.attr("selectedId"));
                jSelected.addClass("ms-selected-table");
            }
            var jSelected = $("#"+this.element.attr("selectedId"));
            if(this.checkSelect(oValue))
            {
                var jRow = $("<div class='ms-selected-row row'>").appendTo(jSelected);
                var jDiv = $("<div class='col-xs-10'><div class='ms-selected-element'><span value='"+oValue.value+"'>"+oValue.display+"</span></div></div>").appendTo(jRow);
                if(this.options.mode === "2")
                {
                    this.appendCustomItem(this.options.customOpt, jDiv,oValue);
                }
                var jThis = this;
                jThis._rowCount++;
                $("<div class='col-xs-2 operator-colum' width='40'><i class='fa fa-trash-o'></i></div>").appendTo(jRow);
                jRow.find(".fa-trash-o").click(function()
                {
                    var nCount = --jThis._rowCount;
                    if(nCount == 0)
                    {
                        jRow.parent(".ms-selected-table").removeClass("ms-selected-table");
                    }
                    $(this).closest(".ms-selected-row").remove();
                    //recover no selected state
                    jThis.element.data("select2").clear(false);
                    
                    (opt.onDelete) && opt.onDelete.apply({id:jThis.element[0].id, value:oValue.value});

                    jThis.element.trigger("change");//register remove event
                });
                return true;
            }
            return;            
        },
        checkSelect: function(oValue)
        {
            var sValue = oValue.display;
            if(sValue === "")
            {
                return false;
            }
            var bflag = true;
            var jSelected = $("#"+this.element.attr("selectedId"));
            jSelected.find(".ms-selected-row .ms-selected-element").each(function(index,oCell)
            {
                if($(oCell).find("span")[0].innerHTML === sValue)
                {
                    bflag = false;
                    return true;
                }
            });
            return bflag;
        },
        appendCustomItem: function(oOpt, jParentDiv, oValue)
        {
            var aColMode = oOpt.colModel;
            for(var i=0; i<aColMode.length; i++)
            {
                var oColDef = aColMode[i];
                var jDiv = $("<div class='custom-selected-element'></div>");
                var sErrorId = oValue.value+"_error";
                createEditor (jDiv, oColDef, sErrorId, oValue);
                $("<span class='error' id='"+sErrorId+"'></span>").appendTo(jDiv);
                jDiv.appendTo(jParentDiv);
            }
            return;
        },
        InitData: function(Data,oOpt)
        {      
            var jElememt = this.element;
            this.options.displayField = (oOpt&&oOpt.displayField) || this.options.displayField;
            this.options.valueField =(oOpt&&oOpt.valueField) || this.options.valueField;
            jElememt.html('<option></option>');
            this.appendData(Data,"false");
        },
        InitCustomFormat: function(opt)
        {
            var colModels = opt.colModel;
            for(var i=0; i<colModels.length; i++)
            {
                 colModels[i].field = colModels[i].id = colModels[i].name||"";
            }            
            this.options.customOpt = $.extend({},this.options.customOpt, opt);
        },
        appendData: function(Data,bSelected)
        {
            var jElememt = this.element;
            var aData = $.isArray(Data) ? Data:[Data];
            var bFlag = false;
            var displayField = this.options.displayField;
            var valueField = this.options.valueField;
            var oValue;
            var oFilterValue = {};
            function filterValue(ele,oFilterValue)
            {
                ele.find('option').each(function(index, el) {
                    if(!oFilterValue[el.value])
                    {
                        oFilterValue[el.value] = true;
                    }
                });
                return oFilterValue;
            }
            var sHtml =[];
            var sArraryHtml = [];
            function DataProcess()
            {
                for(var i=0;i<aData.length;i++)
                {
                    if(typeof aData[i] == "object")
                    {
                        var sText = aData[i][displayField];
                        var sValue = aData[i][valueField];
                        if(sValue||sText)
                        {
                            if(!sValue)sValue = sText;
                            if(!sText)sText = sValue;

                            if(!oFilterValue[sValue]){

                                sHtml.push('<option value="'+sValue+'">'+sText+'</option>');
                                oFilterValue[sValue] = true;
                            }
                            oValue = {"value":sValue, "display":sText};
                        }
                    }
                    else if(typeof aData[i] == "string" && aData[i])
                    {
                        oValue = {"value":aData[i], "display":aData[i]};
                        if(!oFilterValue[aData[i]]){
                            bFlag = true;
                        }
                        sArraryHtml.push('<option value="'+aData[i]+'">'+aData[i]+'</option>')
                    }                    
                }
            }

            filterValue(jElememt,oFilterValue);
            DataProcess();
            if(sHtml.length>0)
            {
                jElememt.append(sHtml.join(''));
            }
            //if array
            if(bFlag)
            {
                jElememt.append(sArraryHtml.join(''));
            }

            if("false" != bSelected)
            {
                this.selectOne(oValue);
            }
        },
        value: function(aValue)   
        {
            var jSelected = $("#"+this.element.attr("selectedId"));
            var sId = this.element.attr("id");
            var jThis = this;
            if(!aValue)
            {
                //get
                var aResultValue = [];
                jSelected.find(".ms-selected-row").each(function(index,oCell){
                    var oEle = $(oCell).find(".ms-selected-element span")[0];
                    var data;
                    if(jThis.options.mode === "2")
                    {
                        data = {};
                        data[jThis.options.valueField] = $(oEle).attr("value");
                        $(oCell).find(".custom-selected-element").each(function(i,oData)
                        {
                            var oEleCustom = $(oCell).find("input.edittable-element")[0];
                            if(oEleCustom){data[oEleCustom.id] = $(oEleCustom).attr("value");}
                        });
                    }
                    else
                    {
                        data = $(oEle).attr("value");
                    }
                    aResultValue.push(data);
                });          
                return aResultValue;
            }               
           
            //set
            jSelected.empty();
            if(typeof aValue[0] != "object")
            {
                var jselected = this.element;
                aValue = $.isArray(aValue) ? aValue : [aValue];
                $.each(aValue,function(index,oData)
                {
                    var sText = jselected.find('option:[value="'+oData+'"]').text();
                    jThis.selectOne({display:sText,value:oData});
                });  
            }
            else if(typeof aValue[0] == "object")
            {
                var jselected = this.element;
                for(var i=0; i<aValue.length; i++)
                {
                    var sValue = aValue[i][this.options.valueField];
                    var sDisplay = aValue[i][this.options.displayField] || jselected.find('option:[value="'+sValue+'"]').text();
                    this.selectOne({display:sDisplay,value:sValue,objvalue:aValue[i]});
                }
            }
            return;
        },
        destroy: function()
        {
            this.element.removeAttr("ctrl");
            this._oMultiselect = null;
            $.Widget.prototype.destroy.call(this);
        }       
    };

    function _init(oFrame)
    {
        $(".mselect", oFrame).mselect();
        _TypeMap = {
            "Checkbox": Frame.Editors.Checkbox ,
            "Date":     Frame.Editors.Date     ,
            "DateRange":Frame.Editors.DateRange,
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
            "Operator": Frame.Editors.Percent  ,
            "Order":    Frame.Editors.Order    ,
            "Percent":  Frame.Editors.Percent  ,
            "Port":     Frame.Editors.Text     ,
            "String":   Frame.Editors.String   ,
            "Text":     Frame.Editors.LongText ,
            "Vlanlist": Frame.Editors.Vlanlist ,
            "Time":     Frame.Editors.Time
        };
    }
    function _destroy() 
    {

    }

    $.widget("ui.mselect", oMultiSelect);
    Widgets.regWidget(WIDGETNAME, {
        "init": _init, "destroy": _destroy, 
        "widgets": [], 
        "utils":["Widget"],
        "libs": ["Libs.slickgrid.editors"
                ,"Widgets.MList","Libs.Select2.Select2"]
                
    });
})(jQuery);
