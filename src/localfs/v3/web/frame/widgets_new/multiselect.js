;(function($)
{
    var WIDGETNAME = "MultiSelect";
    var oMultiSelect = {
        options:{
            displayField:"text",
            valueField:"value",
            searchInput: true,
            mselectGroup:false,
            customClass:"vlanlist",
            customField:""
        },
        _create: function()
        {
            var oMultiselect = this._oMultiselect = this.element; 
            var opt = this.options;
            
            if("mselect1" == oMultiselect.attr("ctrl"))
            {
                return false;
            }
            oMultiselect.attr("ctrl", "mselect1");
            this.options.displayField = oMultiselect.attr("displayField")||this.options.displayField;
            this.options.valueField = oMultiselect.attr("valueField")||this.options.valueField;
            this.options.customClass = oMultiselect.attr("customClass")||this.options.customClass;
            this.options.customField = oMultiselect.attr("customField")||this.options.customField;
            var sErrorId = (oMultiselect.attr("errid"))? "errid="+oMultiselect.attr("errid"):"";
            var sSelectTitle = oMultiselect.attr("select-title")? "<span>"+oMultiselect.attr("select-title")+"</span>":"<span>"+$.MyLocale.MultiSelect.Candidate+"</span>";
            var sDselectTitle = oMultiselect.attr("dselect-title")? "<span>"+oMultiselect.attr("dselect-title")+"</span>":"<span>"+$.MyLocale.MultiSelect.Selected+"</span>";
            var sSelectAll = "<div class='btn-group buttons'><button type='button' class='btn selectall' title='"+$.MyLocale.MultiSelect.MOVEALL+"'><i class='fa fa-arrow-right'></i><i class='fa fa-arrow-right'></i></button></div>";
            var sDeSelectAll = "<div class='btn-group buttons'><button type='button' class='btn deselect' title='"+$.MyLocale.MultiSelect.CANCELALL+"'><i class='fa fa-arrow-left'></i><i class='fa fa-arrow-left'></i></button></div>";

            var sSelectMax = oMultiselect.attr("max")? Utils.Base.sprintf("<label class='info-help'>&nbsp;"+$.MyLocale.MList.Edittable.info+"</label><label class='error' id='edittable_error'/>",oMultiselect.attr("max")):"";

            if(opt.searchInput == true)
            {
                var sMsInputInfo = (this.options.customField =="VlanList")?"Vlan":this.options.customField;
                var sInput = "<input type='text' class='search-input col-xs-5' nocheck='true' autocomplete='off' placeholder='"+$.MyLocale.MultiSelect.Filter+"'/>";
                var sInnerinput = "<div><span class='ms-input-info'>"+sMsInputInfo+"&nbsp;</span><input nocheck='true' class='ms-input check-value required  "+this.options.customClass+"' "+sErrorId+"></input></div>";

                oMultiselect.multiSelect({
                    max: parseInt(oMultiselect.attr("max")),
                    selectableOptgroup:opt.mselectGroup,
                    customField : this.options.customField,
                    selectInner:sInnerinput,
                    selectableHeader: sSelectTitle+sInput+sSelectAll,
                    selectionHeader: sDselectTitle+sSelectMax+sInput+sDeSelectAll,
                    afterInit: function(ms){
                    var that = this,
                        $selectableSearch = that.$selectableUl.prevAll("input"),
                        $selectionSearch = that.$selectionUl.prevAll("input"),
                        selectableSearchString = '#'+that.$container.attr('id')+' .ms-elem-selectable:not(.ms-selected)',
                        selectionSearchString = '#'+that.$container.attr('id')+' .ms-elem-selection.ms-selected';

                    that.qs1 = $selectableSearch.quicksearch(selectableSearchString)
                    .on('keydown', function(e){
                      if (e.which === 40){
                        that.$selectableUl.focus();
                        return false;
                      }
                    });

                    that.qs2 = $selectionSearch.quicksearch(selectionSearchString)
                    .on('keydown', function(e){
                      if (e.which == 40){
                        that.$selectionUl.focus();
                        return false;
                      }
                    });
                    },
                    afterSelect: function(){
                    this.qs1.cache();
                    this.qs2.cache();
                    },
                    afterDeselect: function(){
                    this.qs1.cache();
                    this.qs2.cache();
                    }
                });
            }
            else
            {
                oMultiselect.multiSelect({
                    max: parseInt(oMultiselect.attr("max")),
                    selectableHeader: sSelectTitle+sSelectAll,
                    selectionHeader: sDeSelectAll+sDeSelectAll,
                    selectInner:sInnerinput,
                    customField : this.options.customField,
                    selectableOptgroup:opt.mselectGroup,
                });
               
            }
        },
        InitData: function(Data,oOpt)
        {      
            var jElememt = this.element;
            this.options.displayField = (oOpt&&oOpt.displayField) || this.options.displayField;
            this.options.valueField =(oOpt&&oOpt.valueField) || this.options.valueField;
            this.options.mselectGroup = (oOpt&&oOpt.mselectGroup) || this.options.mselectGroup;
            jElememt.html('');
            this.appendData(Data);
        },
        appendData: function(Data)
        {
            var jElememt = this.element;
            var aValue = [];
            var aData = $.isArray(Data) ? Data:[Data];
            var bFlag = false;
            var displayField = this.options.displayField;
            var valueField = this.options.valueField;

            function filterValue(ele,aValue)
            {
                ele.find('option').each(function(index, el) {
                    if($.inArray(el.value, aValue) == -1){
                        aValue.push(el.value);
                    }
                });
                return aValue;
            }
            
            function GroupProcess()
            {
                for(var key in aData)
                {
                    var group_html = '<optgroup label="'+key+'">';
                    var aGroup=aData[key];

                    for(var j=0;j<aGroup.length;j++)
                    {
                        var sValue=aGroup[j][valueField];
                        var sText=aGroup[j][displayField];
                        if(sValue&&sText)
                        {
                            group_html += '<option value="'+sValue+'">'+sText+'</option>';
                        }
                        
                    }
                    group_html += '</optgroup>';
                    jElememt.prepend(group_html);
                }
            }

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

                            if($.inArray(sValue, aValue) == -1){
                                jElememt.append('<option value="'+sValue+'">'+sText+'</option>');
                            }
                            
                        }
                        filterValue(jElememt,aValue);
                    }
                    else if(typeof aData[i] == "string" && aData[i])
                    {
                         bFlag = true;
                         break;                        
                    }                    
                }
            }
            
            filterValue(jElememt,aValue);
            
            if(this.options.mselectGroup)
            {
                GroupProcess();
            }
            else
            {
                DataProcess();
            }        
            
            //if array 
            if(bFlag)
            {
                jElememt.prepend('<option>'+aData.join('</option><option>')+'</option>');
            }
            this.bindClick();
        },
        bindClick: function ()
        {
            var jElememt = this.element;
            jElememt.multiSelect("refresh");
            var allValue=[];
            jElememt.find('option').each(function(index, el) {            
                allValue.push(el.value);
                return allValue;
            });
           $("#ms-"+jElememt.attr('id')).find(".selectall").click(function(){
                var selectValue = [];
                $("#ms-"+jElememt.attr('id')).find(".ms-elem-selectable").each( function(index, el) {
                    if($(this).css("display") != "none")
                    {
                        var that=$(this);
                        var liID=(that.attr("id")).replace(/(-selectable)$/,"");
                        if($.inArray(liID, allValue)!=-1)
                        {
                            selectValue.push(liID);
                        }
                        else
                        {
                            selectValue.push(that.text());
                        }
                    }
                });
                jElememt.multiSelect("select",selectValue);
            });
            $("#ms-"+jElememt.attr('id')).find(".deselect").click(function(){
                var delValue = [];
                $("#ms-"+jElememt.attr('id')).find(".ms-elem-selection").each(function(index, el) {
                    if($(this).css("display") != "none")
                    {
                        var that=$(this);
                        var liID=(that.attr("id")).replace(/(-selection)$/,"");
                         if($.inArray(liID, allValue)!=-1)
                        {
                            delValue.push(liID);
                        }
                        else
                        {
                            delValue.push(that.text());
                        }
                    }    
                });
                jElememt.multiSelect("deselect",delValue);
            }); 
        },
        value: function(aValue)   
        {
            if("" != this.options.customField)
            {
                //has input
                var sValueFiled = this.options.valueField;
                var sItemFiled = this.options.customField;
                if(!aValue)
                {
                    //get
                    var aResult = [];
                    $("#ms-"+this.element.attr("id")).find(".ms-elem-selection.ms-selected").each(function(i){
                        var oData = {};
                        oData[sValueFiled] = this.id.replace(/(-selection)$/,"");
                        oData[sItemFiled] = $(this).find(".ms-input").val();
                        aResult.push(oData);
                    });
                    return aResult;
                }
                else
                {
                    //set
                    if(typeof aValue[0] == "object")
                    {
                        if(sValueFiled != "value")
                        {
                            $.each(aValue, function(i,odata){
                                odata.value = odata[sValueFiled];
                            })
                        }
                        this.element.multiSelect('select',aValue);
                    }
                    return;
                }               
            }
            else if(!aValue)
            {
                //get
                return this.element.val();
            }
            //set
            var result = [];
            if(("" != this.options.customField) || (typeof aValue[0] != "object"))
            {
                result = aValue;
            }
            else if(typeof aValue[0] == "object")
            {
                for(var i=0; i<aValue.length; i++)
                {
                    result.push(aValue[i][this.options.valueField]);
                }
            }
            return this.element.multiSelect('select',result);
        },
        removeData: function (aValue)
        {
            var jElememt = this.element;
            aValue = $.isArray(aValue) ? aValue :[aValue];
            for(var i=0;i<aValue.length;i++)
            {
                jElememt.find('option:[value='+aValue[i]+']').remove();
            }
            this.bindClick();
        },
        getSelectedData: function()
        {
            var displayField = this.options.displayField,
                valueField = this.options.valueField;
            var aData = [];

            this.element.find('option:selected').each(function(index, el) {
                var obj = {};
                obj[valueField] = el.value;
                obj[displayField] = el.text;
                aData.push(obj);
            });
            return aData;
        },
        disable: function()
        {   
            var sId = this.element.attr('id');
            var jContainer = $("#ms-"+sId);
            jContainer.find('li').addClass('disabled');
            jContainer.find('input').attr('disabled',"disabled");    
            jContainer.find('button').attr('disabled',"disabled");
            jContainer.find('ul').removeClass('ms-focus');          
        },
        enable: function()
        {
            var sId = this.element.attr('id');
            var jContainer = $("#ms-"+sId);
            jContainer.find('li').removeClass('disabled');
            jContainer.find('input').removeAttr('disabled');   
            jContainer.find('button').removeAttr('disabled');
            jContainer.find('.ms-selectable ul').addClass('ms-focus');     
        },
        check: function ()
        {
            var bOK = true;
            var jDiv = this.element.next();
            if (!jDiv.is(".ms-container"))
            {
                return true;
            }

            $("input.check-value", jDiv).each(function(i, input)
            {
                var jInput = $(input);
                jInput.removeAttr("nocheck");
                bOK = Utils.Widget.checkEle(jInput);
                jInput.attr("nocheck", "true");
                return bOK;
            })

            return bOK;
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
        $(".mselect1", oFrame).mselect1();
        $(".mselectGroup", oFrame).mselect1({mselectGroup:true});
        $(".mselectCustom", oFrame).mselect1({customField:"VlanList"});
    }
    function _destroy() 
    {

    }

    $.widget("ui.mselect1", oMultiSelect);
    Widgets.regWidget(WIDGETNAME, {
        "init": _init, "destroy": _destroy, 
        "widgets": [], 
        "utils":["Widget"],
        "libs": ["Libs.Multiselect.Multi-select"
                ,"Libs.Multiselect.Quicksearch"]
    });
})(jQuery);
