;(function($)
{
    var WIDGETNAME = "SingleSelect";
    var oSingleSelect = {
        options:{
            displayField:"text",
            valueField:"value",
            selectGroup:false,
            allowClear:true,
            sort:false
        },
        _create: function()
        {
            var oSingleSelect = this._oSingleSelect = this.element;          
            
            if("singleSelect" == oSingleSelect.attr("ctrl"))
            {
                return false;
            }
            oSingleSelect.attr("ctrl", "singleSelect");
            
            this.options.displayField = oSingleSelect.attr("displayField")||this.options.displayField;
            this.options.valueField = oSingleSelect.attr("valueField")||this.options.valueField;
            if(oSingleSelect.attr("allowClear") === "true")
            {
                this.options.allowClear = true;
            }
            else if(oSingleSelect.attr("allowClear") === "false")
            {
                this.options.allowClear = false;
            }
            
            var oSelectOpt = {allowClear:this.options.allowClear};
            if(this.options.allowClear)
            {
                oSelectOpt.placeholder = $.MyLocale.SingleSelect.CHOOSE;
                oSelectOpt.placeholderOption = "first";
            }

            $.fn.select2.defaults.formatNoMatches = function ()   
            {
               return  $.MyLocale.SingleSelect.NoMatches;
            }
            oSingleSelect.select2(oSelectOpt);
            return;
        },
        InitData: function(aData,oOpt)
        {
            if(!aData)return;

            var $ele = this.element; 
            this.empty();
            $.extend (this.options, oOpt);
            if(this.options.allowClear == true)
            {
                $ele.append('<option ></option>'); 
            }
            var initDataOpt={
                displayField : (oOpt&&oOpt.displayField)||this.options.displayField,
                valueField : (oOpt&&oOpt.valueField)||this.options.valueField,
                selectGroup : (oOpt&&oOpt.selectGroup) || this.options.selectGroup,
                sort:(oOpt&&oOpt.sort) || this.options.sort
            };
            $ele.data('initDataOpt', initDataOpt);
            this.options = $.extend({},this.options, initDataOpt);
            this.appendData(aData);
            if(this.options.allowClear == false)
            {
                $ele.select2({allowClear:false});
            }     
        },
        appendData: function(Data)
        {
            var $ele = this.element;
            var oValue = {};
            var aData = $.isArray(Data) ? Data:[Data];
            var initDataOpt = $ele.data("initDataOpt");
            var displayField = initDataOpt.displayField;
            var valueField = initDataOpt.valueField;
            var selectGroup = initDataOpt.selectGroup;
            var sort = initDataOpt.sort;

            filterValue($ele,oValue);
            function filterValue(ele,oValue)    //  filter repeat value
            {
                ele.find('option').each(function(index, el) {
                    if(!oValue[el.value])
                    {
                        oValue[el.value] = el.text;
                    }
                });

                return oValue;
            }

            function sortData(aData,displayField)
            {
                aData.sort(      
                    function(a, b)
                    {
                        if(typeof a == "object")
                        {
                            if(a[displayField] < b[displayField]) return -1;
                            if(a[displayField]> b[displayField]) return 1;
                        }
                        else
                        {
                            if(a < b) return -1;
                            if(a > b) return 1;
                        }
                        return 0;
                    }
                );  
            }
            function GroupProcess()
            {
                for(var key in aData)
                {
                    var group_html = [];
                    group_html.push('<optgroup label="'+key+'">');
                    var aGroup=aData[key];

                    if(sort){
                        sortData(aGroup,displayField);
                    }
                    for(var j=0;j<aGroup.length;j++)
                    {
                        var sValue=aGroup[j][valueField];
                        var sText=aGroup[j][displayField];
                        if(sValue&&sText)
                        {
                            group_html.push('<option value="'+sValue+'">'+sText+'</option>');
                        }
                        
                    }
                    group_html.push('</optgroup>');
                    $ele.prepend(group_html.join(''));
                }
            }
           
            if(selectGroup)
            {
                GroupProcess();
            }
            else
            {
                if(sort)
                {
                    sortData(aData,displayField);
                }
                var sHtml = [];
                for(var i=0;i<aData.length;i++)
                {
                    var oCurData = aData[i];
                    if(oCurData && (typeof oCurData == "string"))
                    {
                        if(!oValue[oCurData])
                        {
                            oCurData = oCurData.replace(/\'/g,'&#39;').replace(/\"/g,'&quot;');
                            sHtml.push('<option value="'+oCurData+'">'+oCurData+'</option>');
                            oValue[oCurData] = true;
                        }
                    }
                    else
                    {
                        var sValue = oCurData[valueField];
                        var sText = oCurData[displayField];
                        if(!(oValue[sValue])&&(oValue[sValue] != sText))
                        {
                            sHtml.push('<option value="'+sValue+'">' + sText +'</option>');
                            oValue[sValue] = true;
                        }
                    }
                }
                if(sHtml.length > 0)
                {
                    $ele.append(sHtml.join(''));
                }
            } 
        },
        value: function(aValue)   
        {
            if(!aValue)
            {
                return this.element.select2("val");
            }
            return this.element.select2("val",aValue); 
        },
        getSelectedData: function()
        {
            var displayField = this.options.displayField;
            var valueField = this.options.valueField;
            var oData = {};
            this.element.find('option:selected').each(function(index, el) {
                oData[valueField] = el.value;
                oData[displayField] = el.text;
            });
            return oData;
        },
        disable: function()
        {   
            this.element.select2("enable", false); 
        },
        enable: function()
        {
            this.element.select2("enable", true);
        },
        empty: function()
        {
            var $ele = this.element;
            $ele.html('');
            $ele.data("select2").clear(false);
        }       
    };

    function _init(oFrame)
    {
        $(".singleSelect", oFrame).singleSelect();
        $(".singleSelectGroup", oFrame).singleSelect({selectGroup:true});
    }

    function _destroy() 
    {

    }

    $.widget("ui.singleSelect", oSingleSelect);
    Widgets.regWidget(WIDGETNAME, {
        "init": _init, "destroy": _destroy, 
        "widgets": [], 
        "utils":["Widget"],
        "libs": ["Libs.Select2.Select2"]
    });
})(jQuery);
