;(function($)
{
    var UTILNAME = "Panel";
    
	var ENTITY_OTHER        =    1;
	var ENTITY_UNKNOWN      =    2;
	var ENTITY_CHASSIS      =    3;
	var ENTITY_BACKPLANE    =    4;
	var ENTITY_CONTAINER    =    5; /* -- E.G., CHASSIS SLOT OR DAUGHTER-CARD HOLDER */
	var ENTITY_POWERSUPPLY  =    6;
	var ENTITY_FAN          =    7;
	var ENTITY_SENSOR       =    8;
	var ENTITY_MODULE       =    9; /* -- E.G., PLUG-IN CARD OR DAUGHTER-CARD */
	var ENTITY_PORT         =   10;
	var ENTITY_STACK        =   11; /* -- E.G., STACK OF MULTIPLE CHASSIS ENTITIES */
	var ENTITY_CPU          =   12;

	var ENT_OPER_NOTSUPPORTED = 1;
	var ENT_OPER_DISABLED     = 2;
	var ENT_OPER_ENABLED      = 3;
	var ENT_OPER_DANGEROUS    = 4;

	var ENT_ADMIN_NOTSUPPORT  = 1;
	var ENT_ADMIN_LOCKED      = 2;
	var ENT_ADMIN_UNLOCKED    = 4;


	var STATUS_OPER_UP        = ENT_OPER_ENABLED;     //3
	var STATUS_OPER_DOWN      = ENT_OPER_DISABLED;    //2
	var STATUS_OPER_COMBODOWN = ENT_ADMIN_NOTSUPPORT;  //1

	var STATUS_LOADING   = 0; // 目前必须是0.
	var STATUS_UP        = ENT_ADMIN_UNLOCKED; //4
	var STATUS_DOWN      = ENT_ADMIN_LOCKED;  //2
	var STATUS_COMBODOWN = ENT_ADMIN_NOTSUPPORT;  //1

	var IS_STACK_SYS        = false;
	var IS_CEN_SYS          = true;

    /*Combo State*/
    var IF_COMBO_FIBER = 1;     /* 光口使能 */
    var IF_COMBO_COPPER = 2;    /* 电口使能 */

    var MAX_POINT = 200;

    var g_aRole = ["","Fault","Master","Standby"];

    var g_oSlotDataInfo = {};
 
    function SlotDataInfo() 
    {
        this.g_nCurIndex = 0;     
        this.Chassis = "";
        this.Slot = "";  
    }

   // var NC = Utils.Pages["Frame.NC"].NC_Panel;
////{{ local run start
var _nPreVal=30;
function getRandomNum(nMax)
{
    var k = 5;
    _nPreVal = parseInt((_nPreVal*k+Math.floor(Math.random()*nMax)) / (k+1));
    return _nPreVal;
}
////}}

    /*****************************************************************************
    @FuncName: private, getSlotInfo
    @DateCreated: 2011-08-05。
    @Author: L06658。
    @Description: 获取config 中定义的slot 信息
    @Usage:
    		getSlotInfo(sVendorType);
    @ParaIn:
    * sVendorType- string, 去除"1.3.6.1.4.1. "后的VendorType
    @Return: config 中定义的slot 对象
    @Caution:
    @Reference:
    @Modification:
    * yyyy-mm-dd: Author, add or modify something
    *****************************************************************************/
    function getSlotInfo(type)
    {
    	var oSlot = null;
        if(!Frame.arrSlotInfo)
        {
            return null;
        }
    	$.each(Frame.arrSlotInfo,function(i,oSlotInfo)
    	{
    		$.each(oSlotInfo.sysoid.split("|"), function(j, sOid)
    		{
    			if(type == sOid)
    			{
    				oSlot = oSlotInfo;
    				return false;
    			}
    		});
    		if(null != oSlot)
    		{
    			return false;
    		}
    	});
    	return oSlot;
    }
    function getSubslotInfo(type)
    {
    	var oSubslot = null;
        if(!Frame.arrSubSlotInfo)
        {
            return null;
        }
    	$.each(Frame.arrSubSlotInfo,function(i,oSubslotInfo)
    	{
    		$.each(oSubslotInfo.sysoid.split("|"), function(j, sOid)
    		{
    			if(type == sOid)
    			{
    				oSubslot = oSubslotInfo;
    				return false;
    			}
    		});
    		if(null != oSubslot)
    		{
    			return false;
    		}
    	});
    	return oSubslot;
    }
    /*****************************************************************************
    @FuncName: private, getShortVendorType
    @DateCreated: 2011-08-05。
    @Author: L06658。
    @Description: 获取去除"1.3.6.1.4.1. "后的VendorType
    @Usage:
    		getShortVendorType(sVendorType);
    @ParaIn:
    * sVendorType- string, 完整的sysoid
    @Return: 去除"1.3.6.1.4.1. "后的VendorType
    @Caution:
    @Reference:
    @Modification:
    * yyyy-mm-dd: Author, add or modify something
    *****************************************************************************/
    function getShortVendorType(sVendorType)
    {
    	var vendortype = sVendorType;
    	var baseoid    = "1.3.6.1.4.1.";
    	if(vendortype.indexOf(baseoid) != 0)
    	{
    		return sVendorType;
    	}
    	 return vendortype.substring(baseoid.length, vendortype.length);
    }
    function getLastVerdorNo(sVendorType)
    {
    	var aNumber = sVendorType.split(".");
    	 return aNumber[aNumber.length-1];
    }
    /* 将json 数据转换为树形结构 */
    function _jsonToTree(json)
    {
    	var dataArr  = [];
    	var aEnt = [];

    	/* 将每个实体数据存档到dataArr 数组 */
    	for(var i=0;i<json.Device.PhysicalEntities.length;i++)
    	{
    		// save data from EntityMIB
    		aEnt[i] =  $.extend(json.Device.PhysicalEntities[i], {childrenArr: []});

    		// save data from EntityExtMIB
    		/* 正确情况实体表和扩展表中的数据个数相同 */
    		if( (undefined != json.Device.ExtPhysicalEntities[i])||(null != json.Entity.ExtPhysicalEntities[i]))
    		{
    			$.extend(aEnt[i], json.Device.ExtPhysicalEntities[i]);
    		}
    		dataArr[aEnt[i].PhysicalIndex] = aEnt[i];

    	}
    	
    	for(var i=0;i<aEnt.length;i++)
        {
    		/* 实体id只从1开始 */
    		if(( 0 != aEnt[i].ContainedIn) && dataArr[aEnt[i].ContainedIn]&& dataArr[aEnt[i].ContainedIn].childrenArr)
    		{
    			dataArr[aEnt[i].ContainedIn].childrenArr.push(aEnt[i]);
    		}
    	}

    	return dataArr;
    }
    function _transAttachment(oElement)
    {
	    var object = [];
	    
		$.extend(object, oElement);

    	return object
    }
    function _transSubslotData(oEntityRoot,aSubslot)
    {
    	var aPort = [];
	    var oSubslot = [];
	    
		$.extend(oSubslot, oEntityRoot,{port: aPort});

    	var children = oEntityRoot.childrenArr;
    	for(var i=0; i< children.length;i++)
    	{
    		switch(parseInt(children[i].Class))
    		{
    			case ENTITY_PORT:
    			{
    			    var oPort ={};
		            $.extend(oPort, children[i]);
    				aPort.push(oPort);
    				break;
    			}
    			default:
    				break;
    		}
    	}
    	aSubslot.push(oSubslot);
    }
    function _transSlotData(oEntityRoot,aSlot,aFan,aPower)
    {
    	var aSubslot = [];
	    var oSlot = [];
	    
		$.extend(oSlot, oEntityRoot,{subslot: aSubslot});

    	var bHasSubslot = false;

    	var children = oEntityRoot.childrenArr;
    	for(var i=0; i< children.length;i++)
    	{
    		/*只能包含container*/
    		var container = children[i];
    		if(container.childrenArr.length != 0)
    		{
    			var chelement = container.childrenArr[0]; /* container下面只能有一个元素 */
    			switch(parseInt(chelement.Class))
    			{
    				case ENTITY_MODULE: /*slot*/
    					if(chelement.childrenArr.length !=0) /*虚板不要*/
    					{
    						var subelements = chelement.childrenArr;
    						switch(parseInt(subelements[0].Class))
    						{
    							case ENTITY_OTHER:
    								break;
    							case ENTITY_PORT:
    							{
    								_transSubslotData(chelement,aSubslot);
    								bHasSubslot = true;
    								break;
    							}
    							default:
    								break;
    						}
    					}
    					else
    					{
    						var desc = container.Description.toLowerCase();
    						if(desc.indexOf("cf") != -1)
    						{
    							/* empty cf */
    							oSlot["cf"] = _transAttachment(container);
    						}
    						else if(desc.indexOf("usb") != -1)
    						{

    						}
    						else
    						{
    							/*no port subslot*/
    							aSubslot.push(null);
    							bHasSubslot = true;
    						}
    					}
    					break;
    				case ENTITY_POWERSUPPLY:
    				{
    					aPower.push(_transAttachment(chelement));
    					break;
    				}
    				case ENTITY_FAN:
    				{
    					aFan.push(_transAttachment(chelement));
    					break;
    				}
    				case ENTITY_SENSOR:
    				case ENTITY_OTHER:
    					break;
    				default:
    					break;
    			}
    		}
    		else
    		{
    			var desc = container.Description.toLowerCase();
    			if(desc.indexOf("cf") != -1)
    			{
    				/* empty cf */
    				oSlot["cf"] = _transAttachment(container);
    			}
    			else if(desc.indexOf("power") != -1)
    			{
    				aPower.push(_transAttachment(container));
    			}
    			else if(desc.indexOf("cpu") != -1)
    			{

    			}
    			else if(desc.indexOf("usb") != -1)
    			{

    			}
    			else if(desc.indexOf("memory") != -1)
    			{

    			}
    			else
    			{
    				/* default empty subslot */
    				aSubslot.push(null);
    				bHasSubslot = true;
    			}
    		}
    	} // end of for
    	if(true == bHasSubslot)
    	{
    		aSlot.push(oSlot);
    	}
    }

    function _transePanelJson(json, PhysicalIndex)
    {
    	var aSlot = [];
    	var aFan = [];
    	var aPower = [];
    	
    	var aPanelData =_jsonToTree(json);

    	/* 获取当前unit 所在树下孩子结点 */
    	var children = aPanelData[PhysicalIndex].childrenArr;
    	for(var i=0;i<children.length;i++)
    	{
    		var container = children[i];
    		if(container.childrenArr.length != 0)
    		{
    			var chelement = container.childrenArr[0];  /* container下面只能有一个元素 */
    			switch(parseInt(chelement.Class))
    			{
    				case ENTITY_MODULE: /*slot*/
    					_transSlotData(chelement,aSlot,aFan,aPower);
    					break;
    				case ENTITY_POWERSUPPLY:
    					aPower.push(_transAttachment(chelement));
    					break;
    				case ENTITY_FAN:
    					aFan.push(_transAttachment(chelement));
    					break;
    				case ENTITY_SENSOR:
    					break;
    				case ENTITY_BACKPLANE:
    					break;
    				default:
    					break;
    			}
    		}
    		else
    		{
    			var desc = container.Description.toLowerCase();
    			/*empty slot*/
    			if(desc.indexOf("board") != -1)
    			{
    				aSlot.push(null);
    			}
    			/*empty psu*/
    			else if(desc.indexOf("power") != -1)
    			{
    				aPower.push(null);
    			}
    			/* empty fan */
    			else if(desc.indexOf("fan") != -1)
    			{
    				aFan.push(null);
    			}
    		}
    	}

    	return aSlot;
    }
    
    /* 将获取到得json 数据转换stack 所需格式的json 数据 */
    function _transStackJson(json)
    {
    	function getPanelObj(oData)
    	{
    	    var oPanel = [];
    		$.extend(oPanel, oData);

    		return oPanel;
    	}

    	var aPanel = [];
    	var oRoot = json.Device.PhysicalEntities[0];

    	/* 判断是否为堆叠*/
    	if(ENTITY_STACK != oRoot.Class)
    	{
    		/* 非堆叠设备 */
    		aPanel.push(getPanelObj(oRoot));
    	}
    	else
    	{
    		/* 堆叠设备 */
    		IS_STACK_SYS = true;
    		for(var i=1;i<json.Device.PhysicalEntities.length;i++)
    		{
    			var oEntity = json.Device.PhysicalEntities[i];
    			if(oRoot.PhysicalIndex == oEntity.ContainedIn)
    			{
    				aPanel.push(getPanelObj(oEntity));
    			}
    		}
    	}

    	return aPanel;
    }
    function checkCenDevice(oSlot,cpuInfos)
    {
        if((cpuInfos[0].MinChassisNum == cpuInfos[0].MaxChassisNum)&&(cpuInfos[0].MinSlotNum == cpuInfos[0].MaxSlotNum))
        {
            IS_CEN_SYS = true;
            return;            
        }
        IS_CEN_SYS = false;
        if(IS_STACK_SYS)
        {
            var sDeviceOid = oSlot.VendorType;

            /* 区分分布式和集中式堆叠*/
        	var baseoid    = "1.3.6.1.4.1.";
        	if(sDeviceOid.indexOf(baseoid) != 0)
        	{
        		IS_CEN_SYS = true;
        	}
        }  
    }   
    function parseRole(oSlot,aObj)
    {
        var aBoard = parseBoard(aObj);
        var nStatus = 0;
        switch(aBoard[oSlot.PhysicalIndex].Role)
        {
            case '1':
            {
                nStatus = 1;
                break;
            }
            case '2':
            {
                nStatus = 2;
                break;
            }                    
            case '3':
            {
                nStatus = 3;
                break;
            }
            default:
                break;
        }
        return nStatus;
    }
    function createChassisSlot(oPanel,oSlot,aBoard,sPanelId)
    {
        var nRole = parseRole(oSlot,aBoard);

        /* 分布式 */
        if(!IS_CEN_SYS)
        {

            /* 堆叠 */
            if(IS_STACK_SYS)
            {
                if(0 == $("#chassis_select").length)
                {
                    var oDiv = document.createElement('div');
                    $(oDiv).attr("class","chassis_div");
                    $(oDiv).html($.MyLocale.panel.Chassis);
                    var chassis = document.createElement('select');
                    $(chassis).attr("id","chassis_select");
                    $(chassis).attr("class","chassis-select");
                    $(oDiv).append(chassis);
                    $("#"+sPanelId).append(oDiv);
                }
                var aOptions = [];
                aOptions.push($("#chassis_select").html());
                var bFind = false;
                for(var i=0;i<aOptions.length;i++)
                {
                    if(oSlot.Chassis == $(aOptions[i]).attr("value"))
                    {
                        bFind = true;
                        break;
                    }
                }
                if(!bFind)
                {
                    aOptions.push("<option value="+ oSlot.Chassis +">" + oSlot.Chassis + "</option>");
                    $("#chassis_select").html(aOptions.join(""));
                }
            }
            if(0 == $("#slot_select").length)
            {
                var oDiv = document.createElement('div');
                $(oDiv).attr("class","slot_div");
                $(oDiv).html($.MyLocale.panel.Slot);
                var slot = document.createElement('select');
                $(slot).attr("id","slot_select");                
                $(slot).attr("class","slot-select");
                $(oDiv).append(slot);
                $("#"+sPanelId).append(oDiv);
            }
            var aOptions = [];
            aOptions.push($("#slot_select").html());
            aOptions.push("<option chassis='"+ oSlot.Chassis +"' value='"+ oSlot.Slot +"'>" + oSlot.Slot + "</option>");
            $("#slot_select").html(aOptions.join(""));
        }
        else/* 集中式 */
        {
            /* 堆叠 */
            if(IS_STACK_SYS)
            {
                if(0 == $("#member_select").length)
                {
                    var oDiv = document.createElement('div');
                    $(oDiv).attr("class","member_div");
                    $(oDiv).html($.MyLocale.panel.Member);
                    var member = document.createElement('select');
                    $(member).attr("id","member_select");               
                    $(member).attr("class","member-select");
                    $(oDiv).append(member);
                    $("#"+sPanelId).append(oDiv);
                }
                var aOptions = [];
                aOptions.push($("#member_select").html());
                aOptions.push("<option value="+ oPanel.ParentRelPos +" chassis="+ oSlot.Chassis + " slot="+ oSlot.Slot +">" + oPanel.ParentRelPos + "</option>");
                var nMemberVal = $("#member_select").val();
                $("#member_select").html(aOptions.join(""));
                if(nMemberVal)
                {
                    $("#member_select").val(nMemberVal);
                }
            }          
        }

        var sDetailDiv = '<div class="detail" id='+"detail_"+oSlot.PhysicalIndex+' chassis=chassis_'+oSlot.Chassis+'_slot_'+oSlot.Slot+' member='+oPanel.ParentRelPos+' style="display:none">'+
                            '<div class="table-responsive block-wrap">'+
                            '<div class="panel-container" id="panel-container" name="panel-container"  style="display:none"><div id="panel_container_subslot_0" class="panel-container-subslot"></div></div>'+
                             '<div class="tool-container"></div>'+
                             '<a class="btn btn-primary selectAll hide" id="selectall_"'+oSlot.PhysicalIndex+'>'+$.MyLocale.panel.selectAll+'</a>'+
                             '<a class="btn selectNone hide" id="selectnone_"'+oSlot.PhysicalIndex+'>'+$.MyLocale.panel.selectNone+'</a>'+
                            '</div>'+
                         '</div>';
        $("#"+sPanelId).append(sDetailDiv);
    }

    function bindEvent(jPanel)
    {
        function showChassisSelectPanel(oDiv)
        {
            var nChassis = $("#chassis_select option:selected")[0].value;
            var nSlot = $("#slot_select option:selected")[0].value;
            var sChassis = "chassis_"+nChassis+"_slot_"+nSlot;
            if(sChassis == $(oDiv).attr("chassis"))
            {
                $(".detail").hide();
                $(oDiv).show()
            }          
        }
        function showMemberSelectPanel(oDiv)
        {
            var nMember = $("#member_select option:selected")[0].value;
            var sMember = nMember;
            if(sMember == $(oDiv).attr("member"))
            {
                $(".detail").hide();
                $(oDiv).show()
            }          
        }

        // chassis change
        function onChassisChange (e)
        {
            var jPanel = getPanel(this);
            var opt = getPanelOpt(jPanel);
            var sCurChassis = this.value;

            $.each($("#slot_select option", jPanel),function(i){
                   if($(this).attr("chassis") == sCurChassis)
                   {
                       $(this).show();
                       $(this).attr("selected","selected");
                   }
                   else
                   {
                       $(this).hide();
                   }
                });
            $.each($(".detail", jPanel),function(index,oDiv){
                    showChassisSelectPanel(oDiv);
                });

            opt.onChangeSlot.apply(obj);
        }

        // slot change
        function onSlotChange (e)
        {
            var obj = this;
            $.each($(".detail"),function(index,sItem){
                    showChassisSelectPanel(sItem);
                });            

            var opt = getPanelOpt (obj);
            opt.onChangeSlot.apply(obj);
        }

        // member change
        function onMemberChange (e)
        {
            var obj = this;
            $.each($(".detail"),function(index,oDiv){
                    showMemberSelectPanel(oDiv);
                });

            var opt = getPanelOpt (obj);
            opt.onChangeSlot.apply(obj);
        }

        function _clearSelect(physicalIndex)
        {
            $(".port.selected:not([index="+physicalIndex+"])", jPanel).removeClass ("selected");
            $(".subport.selected:not([index="+physicalIndex+"])", jPanel).removeClass ("selected");
        }

        function _onPortClick(e)
        {
            var obj = this;
            var oOpt = getPanelOpt(obj);

            if(oOpt.bClearSelect)
            {
                _clearSelect($(obj).attr("index"));
            }
            if(!($(obj).hasClass("disabled")))
            {
                $(obj).toggleClass("selected");
                if($(obj).hasClass("mulport"))
                {
                    if($(obj).hasClass("selected"))
                    {
                        $(".subport",$(obj)).addClass("selected");
                    }
                    else
                    {
                        $(".subport",$(obj)).removeClass("selected");
                    }
                }
            }

            oOpt.onPortClick.apply(obj, [$(obj).data("ifData")]);
        }
        function _onClickPortTip(e)
        {
            var obj = this;
            if(!$(obj).hasClass("subport"))
            {
                e.stopImmediatePropagation();
            }
            var oOpt = getPanelOpt(obj);

            if(oOpt.bClearSelect)
            {
                _clearSelect($(obj).attr("index"));
            }
            if(!($(obj).hasClass("disabled")))
            {
                $(obj).toggleClass("selected");
               
                var nSelectPortLength = 0;
                var nNoSelectPortLength = 0;
                var jobjParent = $(obj).parents(".mulport");
                $.each($(".subport",jobjParent),function(i)
                {
                       if($(this).hasClass("selected"))
                       {
                           nSelectPortLength = nSelectPortLength+1;
                       }
                       else
                       {
                           nNoSelectPortLength = nNoSelectPortLength+1;
                       }
                });
                if(4 == nSelectPortLength)
                {
                   $(jobjParent).addClass("selected"); 
                }
                else
                {
                   $(jobjParent).removeClass("selected");
                }
                e.stopImmediatePropagation();
                //e.stopPropagation();
            }
            oOpt.onPortClick.apply(obj, [$(obj).data("ifData")]);
        }   
        function _onSelectAllClick(e)
        {
            var obj = this;
            var aPort = $(".port",$(obj).parent());
            $.each($(aPort),function(index,oPort){
                if(!$(oPort).hasClass("disabled"))
                {
                    $(oPort).addClass("selected");
                }
            }); 

            var aSubPort = $(".subport",$(obj).parent());
            $.each($(aSubPort),function(index,sItem){
                if(!$(aSubPort[index]).hasClass("disabled"))
                {
                    $(aSubPort[index]).addClass("selected");
                }
            }); 
            var oOpt = getPanelOpt(obj);
            oOpt.onSelectAll.apply(obj);
        }

        function _onSelectNoneClick(e)
        {
            var obj = this;
            var jPorts = $(".port",$(obj).parent());
            $.each(jPorts,function(index,sItem){
                if((!$(jPorts[index]).hasClass("disabled"))&&($(jPorts[index]).hasClass("selected")))
                {
                    $(jPorts[index]).removeClass("selected");
                }
            }); 

            var aSubPort = $(".subport",$(obj).parent());
            $.each($(aSubPort),function(index,sItem){
                if((!$(aSubPort[index]).hasClass("disabled"))&&($(aSubPort[index]).hasClass("selected")))
                {
                    $(aSubPort[index]).removeClass("selected");
                }
            });
            var oOpt = getPanelOpt(obj);
            oOpt.onSelectNone.apply(obj);
        }

        // bind events
        $("#chassis_select").bind("change", onChassisChange);
        $("#slot_select")   .bind("change", onSlotChange);
        $("#member_select") .bind("change", onMemberChange);
        $(".port")      .bind("click", _onPortClick);
        $(".port li")      .bind("click", _onClickPortTip);
        //$(".subport")      .bind("click", _onClickPortTip);
        $(".selectAll") .bind("click", _onSelectAllClick);
        $(".selectNone").bind("click", _onSelectNoneClick);
    }

    function createMainFrame(oPanel,oSlot,aBoard,sPanelId,aIfmgrInfo)
    {
        var ChassisId = 0;
        var nRole = parseRole(oSlot,aBoard);
        var sParentId = "detail_"+oSlot.PhysicalIndex;
        /* 创建slot概要信息 */
        createChassisSlot(oPanel,oSlot,aBoard,sPanelId);
        createPanel(oPanel,oSlot,sParentId,"panel-container",aIfmgrInfo);   
        if(2 == nRole)
        {
            $("#"+sParentId).show();
            ChassisId = oSlot.Chassis;

            /* 分布式 */
            if(!IS_CEN_SYS)
            {
                /* 堆叠 */
                if(IS_STACK_SYS)
                {
                    $("#chassis_select").val(oSlot.Chassis);
                }
                $("#slot_select").val(oSlot.Slot);
            }
            else/* 集中式 */
            {
                /* 堆叠 */
                if(IS_STACK_SYS)
                {
                    $("#member_select").val(oPanel.ParentRelPos);
                }          
            }
        }

        return ChassisId;
    }
    function parseBoard(aObj)
    {
        var aBoard = {};
        $.each(aObj,function(i){
            aBoard[aObj[i].PhysicalIndex] = aObj[i];
        });
        return aBoard;
    }
    function drawEmptySubslot(sParentId,sPanelId,nSubslotId,bAppendSubslot)
    {
        var sAppendClass ="";
        var sBr ='<br/>';
        if(bAppendSubslot)
        {
            sAppendClass ="append-subslot";
            sBr ="";
        }
        var sSubslot = sBr+'<div id="panel_container_subslot_'+nSubslotId+'" class="panel-container-subslot empty-subslot '+sAppendClass+'"></div>';
        $("#panel-container",$("#"+sParentId)).append(sSubslot);
    }
    function drawPanel(aPortInfo,sParentId,sPanelId,nSubslotId,bAppendSubslot)
    {
        if(0 != nSubslotId)
        {
            var sAppendClass ="";
            var sBr ='<br/>';
            if(bAppendSubslot)
            {
                sAppendClass ="append-subslot";
                sBr ="";
            }
            var sSubslot = sBr+'<div id="panel_container_subslot_'+nSubslotId+'" class="panel-container-subslot '+sAppendClass+'"></div>';
            $("#panel-container",$("#"+sParentId)).append(sSubslot);
        }
        
        var aPortHtml = [];
        var createPort = function (oPortInfo, sType, bAddSpan)
        {
            if (!oPortInfo)
            {
                return;
            }

            aPortHtml.push ('<table class="table-group table-noborder">');
            aPortHtml.push ('<tr class="port-container-inner-'+sType+'">');

            var sNumberSpan = bAddSpan ? '<span class="number"></span>' : '';
            for(var j=0; j<oPortInfo.ifcount; j++)
            {
                var nNumber = oPortInfo.ifnum+(j*oPortInfo.step);
                aPortHtml.push ('<td class="port '+sType+'" id="port_'+nNumber+'">'+sNumberSpan+'</td>');
            }

            aPortHtml.push ('</tr>');
            aPortHtml.push ('</table>');
        };

        var jParent = $("#"+sPanelId+" #panel_container_subslot_"+nSubslotId,$("#"+sParentId));
        for(var i=0;i<aPortInfo.length;i++)
        {
            aPortHtml.push ('<td class="port-container">');

            var aPortDef = aPortInfo[i];
            if (aPortInfo[i].up || aPortInfo[i].down)
            {
                aPortDef = [];
                (aPortInfo[i].up) && aPortDef.push (aPortInfo[i].up);
                (aPortInfo[i].middle) && aPortDef.push (aPortInfo[i].middle);
                (aPortInfo[i].down) && aPortDef.push (aPortInfo[i].down);
            }

            var nTotle = aPortDef.length;
            for (var k=0; k<nTotle; k++)
            {
                var sType = (0 === k) ? "up" : "down";
                var bAddSpan = ((0 === k) || ((nTotle-1) === k));
                createPort (aPortDef[k], sType, bAddSpan);
            }

            aPortHtml.push ('</td>');
        }

        jParent.html (aPortHtml.join(''));
        // var nPanelWidth = 0;
        // $.each($(".port-container",$("#"+sParentId)),function(i){
        //     var nPortUpNum = $(".port-container-inner-up .port",$(this)).length;
        //     var nPortDownNum = $(".port-container-inner-down .port",$(this)).length;
        //     var nPortNum = (nPortUpNum > nPortDownNum)? nPortUpNum : nPortDownNum;
        //     nPanelWidth += nPortNum*22 + 12;
        // });
        
        //$(".panel",$("#"+sParentId)).width(nPanelWidth+(aPortInfo.length+1));
    }
    function getPortInfo(vendorType)
    {
		var sOid = getShortVendorType(vendorType);
        var nLast = getLastVerdorNo(sOid);
        var portinfo = Frame.arrPortInfo[nLast];
        if(null == portinfo)
        {
            return;
        }

        this.layout = portinfo[0];
        this.filter = portinfo[1];
        this.display = portinfo[2];
        this.maxspeed = portinfo[3];
    }
    function process40GPort(jParent,oPort)
    {
        var sId = jParent.getAttribute("id");
        var sName = oPort.Name;
        var sFullName = sName.replace(/^[a-z\-]+/i,"");
	    var mulPort = parseInt(sFullName.split(':')[1],10) || false;
        
        var s40GSubPort = '<li id="40Gsubport_'+mulPort+"_"+sId+'" class="subport">'+sName+'</li>';
        $(".mulport-container ul",jParent).append(s40GSubPort);
        
        $("#40Gsubport_"+mulPort+"_"+sId,jParent).attr("index",oPort.PhysicalIndex);
        $("#40Gsubport_"+mulPort+"_"+sId,jParent).attr("Name",oPort.Name);
        $("#40Gsubport_"+mulPort+"_"+sId,jParent).data('data',oPort); 
    }
    function mouseOverPort(obj)
    {   
        $(".mulport-container",$(obj)).show();
    }
    function mouseLeavePort(obj)
    {
        $(".mulport-container",$(obj)).hide();
    }
    function setPortAttr(sId,jPortDiv,oPort,sParentId,nPortNum,b40GPortParent)
    {
        if(!b40GPortParent)
        {
            $(jPortDiv).attr("index",oPort.PhysicalIndex);
            $(jPortDiv).attr("Name",oPort.Name);
            $("#"+sId,$("#"+sParentId)).data('data',oPort); 
            var aHtml = [
                        '<div class="mulport-container hide">',
                            '<div class="custom-dropdown-arrow"></div>',
                            '<ul id="tooltip_port_container" class="port-tooltip">',
                            '</ul>',
                        '</div>'
            ];
            $(aHtml.join('')).appendTo (jPortDiv);
            var sPortInfo = '<li id="tooltip_'+oPort.PhysicalIndex+'">'+oPort.Name+'</li>';
            $(".mulport-container ul",jPortDiv).append(sPortInfo);
        }
        else
        {
            $(jPortDiv).attr("Name",oPort.Name.split(':')[0]);
            $(jPortDiv).addClass("mulport");
            // create dropdown list
            var aHtml = [
                        '<div class="mulport-container hide">',
                            '<div class="custom-dropdown-arrow"></div>',
                            '<ul id="40G_subport_container" class="port-tooltip">',
                            '</ul>',
                        '</div>'
            ];
            $(aHtml.join('')).appendTo (jPortDiv);
        }
        var oPortInfo = new getPortInfo(oPort.VendorType);
        $(jPortDiv).addClass(oPortInfo.layout);
        $(".number",jPortDiv).html(nPortNum);
        
        $(jPortDiv).bind("mouseover",function(){
             mouseOverPort(this);
        });
        $(jPortDiv).bind("mouseout",function(){
             mouseLeavePort(this);
        });
    }
    function setPortDataInfo (jPortDiv,aPorts,sParentId)
    {
        var sId = jPortDiv.getAttribute("id");
        var nNum = parseInt(sId.split("_")[1]); 

        var i = nNum;
        var sName = aPorts[i].Name;

    	var ifnum = sName.split(/[.:]/)[0];        
        var aTemp = ifnum.split('/');
    	var k = aTemp.length - 1;
    	var portnum = parseInt(aTemp[k--],10);

        if(aPorts[i].b40G)
        {
            setPortAttr(sId,jPortDiv,aPorts[i],sParentId,portnum,true);
            for(var j=0;j<4;j++)
            {
                process40GPort(jPortDiv,aPorts[i].subPorts[j]);
            }
        }
        else
        {
            setPortAttr(sId,jPortDiv,aPorts[i],sParentId,portnum,false);
        }
    }
    function createPanel(oPanel,oSlot,sParentId,sPanelId,aIfmgrInfo)
    {
        aSubslot = oSlot.subslot;
        if(!aSubslot[0])
        {
            return;
        }
        /* 获取定制信息 */
        var sDeviceOid ;
        if(!IS_CEN_SYS) /* 分布式*/
        {
            sDeviceOid = oSlot.VendorType;

            /* 区分分布式和集中式*/
        	var baseoid    = "1.3.6.1.4.1.";
        	if(sDeviceOid.indexOf(baseoid) != 0)
        	{
        		sDeviceOid = oPanel.VendorType;
        	}
        }  
        else /* 集中式*/
        {
            sDeviceOid = oPanel.VendorType;
        }
		var sOid = getShortVendorType(sDeviceOid);
		var oSlotInfo = getSlotInfo(sOid);
        if(!oSlotInfo)
        {
            return;
        }
        $(".panel-container",$("#"+sParentId)).show();
        var nSubslotIdSkip;

        for(var i=0;i<oSlotInfo.subslot.length;i++)
        {
            if(oSlotInfo.subslot[i].skip)
            {
                nSubslotIdSkip = 0;
                continue;
            }
            var bAppendSubslot = false;
            if(oSlotInfo.subslot[i].appendItem)
            {
                bAppendSubslot = true;
            }
            if(!oSlotInfo.subslot[i].dynamicSlot)
            {
                /* 获取定制信息 */
               var aPortInfo = Frame.arrPortPos[oSlotInfo.subslot[i].port].port;
               drawPanel(aPortInfo,sParentId,sPanelId,i,bAppendSubslot);
            }
            else
            {
                if(!aSubslot[i]) /* 插卡为空 */
                {
                    drawEmptySubslot(sParentId,sPanelId,i,bAppendSubslot);
                }
                else
                {
                    var sSubslotOid = aSubslot[i].VendorType;
            		var sOid = getShortVendorType(sSubslotOid);
            		var oSubslotInfo = getSubslotInfo(sOid);
                    /* 获取定制信息 */
                   var aPortInfo = Frame.arrPortPos[oSubslotInfo.port].port;
                    
                   drawPanel(aPortInfo,sParentId,sPanelId,i,bAppendSubslot);
                }
            }
        }

        /* 将实体和扩展数据关联到端口上 */
        for(var i=0;i<aSubslot.length;i++)
        {
            if(!aSubslot[i])
            {
                continue;
            }
            if( i == nSubslotIdSkip)
            {
                var nTemp = i+1;
                var jEmptyRemove = $("#empty_container_"+nTemp);
                if(jEmptyRemove)
                {
                    jEmptyRemove.remove();
                }
                continue;
            }
            var aPorts = aSubslot[i].port;

            var aNewPorts = [];
            var n = 0;
            for(var m=0;m<aPorts.length;m++)
            {
                var sName = aPorts[m].Name;
                var sFullName = sName.replace(/^[a-z\-]+/i,"");

                var mulPort = parseInt(sFullName.split(':')[1],10) || false;
                if(1 == mulPort)
                {
                	var o40GPortData = {
                		Name:             "",
                        b40G:             true,
                		VendorType:       "",
                		subPorts:         []
                	}
                    o40GPortData.Name = sName.split(':')[0];
                    o40GPortData.b40G = true;
                    o40GPortData.VendorType = aPorts[m].VendorType;
                    o40GPortData.subPorts = [];
                    for(var w=m;w<m+4;w++)
                    {
                        o40GPortData.subPorts.push(aPorts[w]);
                    }
                    aNewPorts[n++]= o40GPortData;
                }
                else if(false == mulPort)
                {
                    aNewPorts[n++]= aPorts[m];
                }
            }
            
            var jPortDiv = $("#panel_container_subslot_"+i+" .port-container .port",$("#"+sParentId));
            for(var j=0;j<jPortDiv.length;j++)
            {
                if(0==j)
                {
                    $(".panel",$("#"+sParentId)).attr("minIndex",aNewPorts[0].PhysicalIndex);
                    $(".panel",$("#"+sParentId)).attr("count",jPortDiv.length);
                }
                setPortDataInfo(jPortDiv[j],aNewPorts,sParentId);
            }
            /* 设置端口状态 */
            var jPortParent = $("#panel_container_subslot_"+i,$("#"+sParentId));
            setPortStatus(jPortDiv,aIfmgrInfo,jPortParent);
        }
    }
    function joinIfStatus(jPort,oPortData,aIfmgrInfo)
    {
        jPort.addClass("disabled");
        jPort.removeClass("normal");
        for(var w=0;w<aIfmgrInfo.length;w++)
        {
            if(oPortData.Name == aIfmgrInfo[w].Name)
            {
                jPort.data('ifData',aIfmgrInfo[w]); 
                jPort.removeClass("disabled");
                if((!oPortData)||(!oPortData.AdminState)||(!oPortData.OperState))
                {
                    continue;
                }
                if((STATUS_UP == oPortData.AdminState)&&(STATUS_OPER_UP == oPortData.OperState))
        		{
        		    jPort.addClass("normal");
                    if((jPort.hasClass("subport"))&&(!jPort.parents(".port").hasClass("normal")))
                    {
                        jPort.parents(".port").addClass("normal");
                    }
    		    }
                if("true" == aIfmgrInfo[w].ComboCapabilities)
                {
                    var oPortInfo = new getPortInfo(oPortData.VendorType);
                    if(((aIfmgrInfo[w].Combo == IF_COMBO_COPPER)&&("RJ45" != oPortInfo.layout))||((aIfmgrInfo[w].Combo == IF_COMBO_FIBER)&&("RJ45" == oPortInfo.layout)))
                    {
                        jPort.addClass("disabled");
                    }
                }
                break;
            }
        }
    }
    function setPortData(jPortDiv,aIfmgrInfo,jParent)
    {
        var sId = jPortDiv.getAttribute("id");
        var nNum = sId.split("_")[1];
        var jPort = $("#"+sId,jParent);
        var oPortData = jPort.data('data');
        if(!oPortData)
        {
            jPort.removeClass("normal");
            var jSubPort = $(".subport",jPort);
            for(var n=0;n<jSubPort.length;n++)
            {
                var oSubPortData = $(jSubPort[n]).data('data');
                joinIfStatus($(jSubPort[n]),oSubPortData,aIfmgrInfo);
            }
        }
        else
        {
            joinIfStatus(jPort,oPortData,aIfmgrInfo); 
        }
    }

    function setPortStatus(jPortDiv,aIfmgrInfo,jParent)
    {
        for(var j=0;j<jPortDiv.length;j++)
        {
            var jSubPortDiv = $(".subport",$(jPortDiv[j]));
            if(0 != jSubPortDiv.length)
            {
                for(var i=0;i<jSubPortDiv.length;i++)
                {
                    setPortData(jSubPortDiv[i],aIfmgrInfo,jParent);
                }
            }
            else
            {
                setPortData(jPortDiv[j],aIfmgrInfo,jParent);
            }
        }
    }

	function showLoading(sId)
	{
		var h=500;

		$("#"+sId).append("<div id='panel_loading' style='border:1px solid #eee;height:"+h+"px;'>"
			+"<div class='loading' style='top:45%;left:50%'></div></div>");
	}

	function hideLoading()
	{
		$("#panel_loading").remove();
	}
    function initSlotInfo(oSlot)
    {
        var PhysicalIndex = oSlot.PhysicalIndex;
        var oSlotInfo = new SlotDataInfo();
        
        oSlotInfo.g_nCurIndex = PhysicalIndex;
        oSlotInfo.Chassis = oSlot.Chassis;
        oSlotInfo.Slot = oSlot.Slot;  

        g_oSlotDataInfo[PhysicalIndex] = oSlotInfo;
    }
    function currentSlot(nChassisId)
    {
        $.each($("#slot_select option"),function(i){
               if($(this).attr("chassis") != nChassisId)
               {
                   $(this).hide();
               }
               else
               {
                   $(this).show();
               }
            });
    }
    function getRequestTable(jPanel, opt)
    {
        var sPanelId = jPanel.attr("id");
        function myCallback(oInfos)
        {
            var ChassisId = 0;
            var aBase= Utils.Request.getTableRows(NC.DeviceBase, oInfos);
            var aBoard = Utils.Request.getTableRows(NC.DeviceBoards, oInfos);
            var aEntityExtInfo = Utils.Request.getTableRows(NC.DeviceExtPhysicalEntities, oInfos); // the size of aEntityExtInfo and aEntityInfo is same
            var aEntityInfo = Utils.Request.getTableRows(NC.DevicePhysicalEntities, oInfos);
            var aIfmgrInfo = Utils.Request.getTableRows(NC.Ifmgr, oInfos);
            var aEthInterfaces = Utils.Request.getTableRows(NC.EthInterfaces, oInfos);
            var aEthInterfaceCapabilities = Utils.Request.getTableRows(NC.EthInterfaceCapabilities, oInfos);
            var aEthInterfacesHash = {};

            jPanel.empty();
            aChassis = _transStackJson(oInfos);

            for(var w=0;w<aEthInterfaces.length;w++)
            {
                $.extend(aEthInterfaces[w], {
                    IfIndex: aEthInterfaceCapabilities[w].IfIndex,
                    ComboCapabilities: aEthInterfaceCapabilities[w].Combo
                });
                aEthInterfacesHash[aEthInterfaceCapabilities[w].IfIndex] = aEthInterfaces[w];
            }
            for(var z=0;z<aIfmgrInfo.length;z++)
            {
                if (aEthInterfacesHash[aIfmgrInfo[z].IfIndex])
                {
                    $.extend(aIfmgrInfo[z], aEthInterfacesHash[aIfmgrInfo[z].IfIndex]);
                }
            }
            for(var i=0;i<aChassis.length;i++)
            {
                var aSlot = _transePanelJson(oInfos,aChassis[i].PhysicalIndex);
                for(var j=0;j<aSlot.length;j++)
                {
                    if(!aSlot[j])
                    {
                        continue;
                    }

                    checkCenDevice (aSlot[j], aBase);

                    var curChassisId = createMainFrame(aChassis[i],aSlot[j],aBoard,sPanelId,aIfmgrInfo);
                    ChassisId = ChassisId || curChassisId;

                    initSlotInfo(aSlot[j]);
                }
            }
            bindEvent(jPanel);
            currentSlot(ChassisId);
            
            if (!opt.bClearSelect)
            {
                $(".btn", jPanel).removeClass("hide");
            }

            hideLoading();
            opt.onReady.apply(jPanel);
        }

        showLoading(sPanelId);

        var oBase = Utils.Request.getTableInstance(NC.DeviceBase);
        var oBoards = Utils.Request.getTableInstance(NC.DeviceBoards);
        var oPhysicalEntities = Utils.Request.getTableInstance(NC.DevicePhysicalEntities);
        var oExtPhysicalEntities = Utils.Request.getTableInstance(NC.DeviceExtPhysicalEntities);
        var oIfmgr = Utils.Request.getTableInstance(NC.Ifmgr);
        var oEthInterfaces = Utils.Request.getTableInstance(NC.EthInterfaces);
        var oEthInterfaceCapabilities = Utils.Request.getTableInstance(NC.EthInterfaceCapabilities);

        return Utils.Request.getAll([oBase, oBoards, oPhysicalEntities, oExtPhysicalEntities, oIfmgr, oEthInterfaces, oEthInterfaceCapabilities], myCallback);
    }

    function getPanel (obj)
    {
         return $(obj).closest(".panel:visible");
    }

    function getPanelOpt (obj)
    {
         return getPanel (obj).data("opt");
    }

    function _getSelectPorts(jPanel)
    {
        var aSelectPort = [];

        $(".selected.port", jPanel).each(function(i, port)
        {
            if(!$(port).hasClass("mulport"))
            {
                aSelectPort.push ($(port).data("ifData"));
            }
        });
        $(".selected.subport", jPanel).each(function(i, port)
        {
            aSelectPort.push ($(port).data("ifData"));
        });

        return aSelectPort;
	}       
 	function _getSelectChassisId(jPanel)
	{
        var jSelect = $("#member_select", jPanel);
        if (0 < jSelect.length)
        {
            return $("option:selected", jSelect).first().attr("chassis");
        }

        return $("#chassis_select", jPanel).val();
	} 
 	function _getSelectSlotId(jPanel)
	{
        var jSelect = $("#member_select", jPanel);
        if (0 < jSelect.length)
        {
            return $("option:selected", jSelect).first().attr("slot");
        }

        return $("#slot_select", jPanel).val();
    }
    function _traversalPort (jPanel, pfCallback)
    {
        function doCallback (oPort)
        {
            if(!$(oPort).hasClass("disabled"))
            {
                var oIfData = $(oPort).data("ifData");
                var oPort = {
                    _dom: oPort,
                    disable: function ()
                    {
                        //
                        $(this._dom).addClass ("disabled");
                    },
                    enable: function ()
                    {
                        // 
                        $(this._dom).removeClass ("disabled");
                    }
                }
                pfCallback && pfCallback.apply(oPort, [oIfData]);
            }
        }

        $.each($(".port, .subport", jPanel),function(index, oPort)
        {
            doCallback (oPort);
        });
    }
 	function _setLayout (jPanel, PhysicalIndex, sStatus)
	{
        $(".port[index="+PhysicalIndex, jPanel).addClass (sStatus);
	} 

    function _init(oFrame)
    {
        $(".panel", oFrame).panel();
    }
    function _destroy()
    {
    }

    var oPanel = {
        _create : function()
        {
            this.panel = this.element;
        },
        _destroy:function()
        {
            // _destroy();
            this.panel.remveData("opt");
            delete this.panel;
        },
        init: function (opt)
        {
            var option = $.extend({
                onSelectAll: function (){},
                onSelectNone: function (){},
                onPortClick: function (oIfData){},
                onChangeSlot:function (){},
                onReady: function (){},
                bClearSelect: false
            }, opt);
            this.panel.data("opt", option);
            getRequestTable(this.panel, option);
        },
	    getSelectPorts : function()
        {
            return _getSelectPorts(this.panel);
        },
	    getSelectChassisId : function()
        {
            return _getSelectChassisId(this.panel);
        },
	    getSelectSlotId : function()
        {
            return _getSelectSlotId(this.panel);
        },
        traversalPort : function(pfCallback)
        {
            _traversalPort (this.element, pfCallback);
        }
    };
    $.widget("ui.panel", oPanel);
    Widgets.regWidget(UTILNAME, {
        "init": _init, "destroy": _destroy,
        "widgets": [], 
        "utils":["Request"],
        "libs": ["Libs.Panel.Define"]
    });
})(jQuery);
