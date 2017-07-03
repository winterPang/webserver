;(function($)
{
    var UTILNAME = "Dashboard";
    
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

    var MAX_POINT = 100;

    var g_oSlotDataInfo = {};  
    
    function SlotDataInfo(nIndex, chassis, slot) 
    {
        this.nCurIndex = nIndex;
        this.oMapObject = {};
        this.oSeriesCpu = false;
        this.oSeriesMem = false;
        this.aHistoryData = [];       
        this.Chassis = chassis;
        this.Slot = slot;  
    }

    var NC = Utils.Pages["Frame.NC"].NC_Dashboard;

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
    function changeStyle(jObj,nUsage)
    {
        if(nUsage>80)
        {
            jObj.addClass("usage-warning-align");
        }
        else
        {
            jObj.addClass("usage-align");
        }
    }

    var UsageBar = {
        getCss: function(nVal)
        {
            return (nVal>80) ? "usage-warning-align" : "usage-align";
        },
        create: function (sType, nVal)
        {
            var aHtml = [];
            var w = (nVal*0.89);
            var css = this.getCss(nVal);

            aHtml.push ('<div id="'+sType+'" class="'+sType+'">');
            aHtml.push (    '<span class="usage-label"></span>');
            aHtml.push (    '<div class="usage-off-align" id="gauge_'+sType+'_slot" name="gauge_'+sType+'_slot">');
            aHtml.push (        '<span class="percent">'+nVal+'%'+'</span>');
            aHtml.push (        '<div class="on '+css+'" style="width:'+w+'px"></div>');
            aHtml.push (    '</div>');
            aHtml.push ('</div>');

            return aHtml.join('');
        },
        set: function (jParent, sType, nVal)
        {
            var jBar = $("#"+sType, jParent);
            $(".percent", jBar).html(nVal+"%");
            $(".on", jBar).width(nVal*0.89).removeClass("usage-warning-align usage-align").addClass(this.getCss(nVal));
        }
    }

    function parseRole(oSlot,aObj)
    {
        var aBoard = parseBoard(aObj);
	if(!aBoard[oSlot.PhysicalIndex])
	{
	    for(var i=0;i<aObj.length;i++)
	    {
	       if(aObj[i].Role == 2)
	       {
	           aBoard[oSlot.PhysicalIndex] = aObj[i];
		   aBoard[oSlot.PhysicalIndex].PhysicalIndex = oSlot.PhysicalIndex;
		   break;
	       }
	    }
	}

        return parseInt(aBoard[oSlot.PhysicalIndex].Role) || 0;
    }

    function createSlotBrief(oPanel,oSlot,aBoard)
    {
        var aHtml = [];
        var nRole = parseRole(oSlot,aBoard);

        var sId= "";
        var nType = 0;
        var sDisplay = "";

        /* 分布式 */
        if(!IS_CEN_SYS)
        {
            nType = 1;
            /* 堆叠 */
            if(IS_STACK_SYS)
            {
                // sId = $.MyLocale.panel.Chassis+" "+oSlot.Chassis+"#"+$.MyLocale.panel.Slot+" "+oSlot.Slot;
                sId = oSlot.Chassis+" "+$.MyLocale.panel.Chassis/*+"#"*/+oSlot.Slot+" "+$.MyLocale.panel.Slot;
            }
            else
            {
                // sId = $.MyLocale.panel.Slot+" "+oSlot.Slot;
                sId = oSlot.Slot+" "+$.MyLocale.panel.Slot;
            }
        }
        else/* 集中式 */
        {
            /* 堆叠 */
            if(IS_STACK_SYS)
            {
                sId = $.MyLocale.panel.Member+" "+oPanel.ParentRelPos;
            
            }
            else
            {
                sId = "Slot "+oSlot.Slot;
                sDisplay = "display:none;";
            }            
        }

        var aHtml = ["<div id='div_"+oSlot.PhysicalIndex+"'>"
                    ,    '<div class="tr" style="'+sDisplay+'" id="'+oSlot.PhysicalIndex+'">'
                    ,        '<div class="id-container">'+sId+'</div>'
                    ,        '<div class="status-container">'+getSlotOrDeviceType(nType,nRole)+'</div>'
                    ,        '<div class="cpu-container">'+UsageBar.create('cpu', oSlot.CpuUsage)+'</div>'
                    ,        '<div class="memory-container">'+UsageBar.create('mem', oSlot.MemUsage)+'</div>'
                    ,        '<div class="oper-container"><a class="btn" index='+oSlot.PhysicalIndex+'><i class="fa fa-caret-left"></i></a></div>'
                    ,    '</div>'
                    ,    '<div class="row detail" id="detail" style="display:none">'
                    ,        '<div class="col-md-8 left-group">'
                    ,            '<div class="table-responsive block-wrap">'
                    ,                '<div class="panel" id="panel-container" name="panel-container" style="display:none">'
                    ,                    '<div id="panel_container_subslot_0" class="panel-container-subslot"></div>'
                    ,                '</div>'
                    ,            '</div>'
                    ,        '</div>'
                    ,        '<div class="col-md-4 right-group"></div>'
                    ,     '</div>'
                    ,'</div>'
                    ];

        $("#chassis_contrainer .table").append(aHtml.join(''));
    }

    function getSlotOrDeviceType(nType,nRole)
    {
        var oRcPanel = $.MyLocale.panel;
        var aCen = ["", oRcPanel.Fault, oRcPanel.Cen_Master, oRcPanel.Cen_Standby, oRcPanel.Cen_Standby];
        var aMpu = ["", oRcPanel.Fault, oRcPanel.Master,     oRcPanel.Standby,     oRcPanel.Lpu        ];
        var aType = (0 == nType) ? aCen : aMpu;

        return aType[nRole] || "";
    }

    function createDeviceInfo(oInfo,sParentId)
    {
        if(!oInfo)
        {
            return;
        }
        var aHtml = ['<div class="device-information block-wrap">'
                    ,    '<div id="app_DevInfo">'
                    ,        '<div class="address">'
                    ,           '<span>'
                    ,               '<div class="device-table">'
                    ,                    '<div class="controls-row">'
                    ,                        '<div class="controls-label"><abbr title="'+$.MyLocale.panel.serial+'">'+$.MyLocale.panel.serial+'</abbr></div>'
                    ,                        '<div class="serial" title="'+oInfo.SerialNumber+'">'+oInfo.SerialNumber+'</div>'
                    ,                    '</div>'
                    ,                    '<div class="controls-row">'
                    ,                        '<div class="controls-label"><abbr title="'+$.MyLocale.panel.bootrom+'">'+$.MyLocale.panel.bootrom+'</abbr></div>'
                    ,                        '<div class="bootrom" title="'+oInfo.FirmwareRev+'">'+oInfo.FirmwareRev+'</div>'
                    ,                    '</div>'
                    ,               '</div>'
                    ,           '</span>'
                    ,           '<span>'
                    ,               '<div class="device-table">'
                    ,                    '<div class="controls-row">'
                    ,                        '<div class="controls-label"><abbr title="'+$.MyLocale.panel.hardware+'">'+$.MyLocale.panel.hardware+'</abbr></div>'
                    ,                        '<div class="hardware" title="'+oInfo.HardwareRev+'">'+oInfo.HardwareRev+'</div>'
                    ,                    '</div>'
                    ,                    '<div class="controls-row">'
                    ,                        '<div class="controls-label"><abbr title="'+$.MyLocale.panel.software+'">'+$.MyLocale.panel.software+'</abbr></div>'
                    ,                        '<div class="software" title="'+oInfo.SoftwareRev+'">'+oInfo.SoftwareRev+'</div>'
                    ,                    '</div>'
                    ,               '</div>'
                    ,           '</span>'
                    ,        '</div>'
                    ,    '</div>'
                    ,'</div>'
                    ];
        
        $(".detail .right-group",$("#"+sParentId)).append(aHtml.join(''));
    }
    function createCpuMemoryFlashCfa(oSlot,sParentId)
    {
        var sHtml = '<div class="bar clear"></div>'+
                    '<div class="col-xs-12 block-wrap detail-wrap">'+
                        '<div class="col-xs-7 stat-container">'+
                            '<div id="cpu_fieldset" class="cpu_fieldset">'+
                                '<div class="col-xs-12 stats table-noborder">'+
                                        /*'<div class="usage-container col-xs-4">'+
                                            '<div class="usage-border">'+
                                                '<div class="usage-container-left">'+
                                                    '<p class="cpu-title"></p><span class="usagevalue" id="size_cpu" name="size_cpu"></span>'+
                                                '</div>'+
                                                '<div class="usage-container-inner">'+
                                                    '<div class="usage-off" id="gauge_cpu" name="gauge_cpu">'+
                                                        '<div class="usage"></div>'+
                                                    '</div>'+
                                                '</div>'+
                                            '</div>'+
                                        '</div>'+*/
                                        '<div class="plot-container col-xs-12">'+
                                            '<div class="plot-border">'+
                                                '<div class="usage-container-left">'+
                                                    '<span class="usagevalue" id="size_cpu" name="size_cpu"></span><p class="cpu-title">CPU</p>'+
                                                '</div>'+
                                                '<div class="plot-container-inner">'+
                                                    '<div id="app_cpu_plot'+oSlot.PhysicalIndex+'" class="area"></div>'+
                                                '</div>'+
                                            '</div>'+
                                        '</div>'+
                                '</div>'+
                            '</div>'+
                            '<div id="mem_fieldset">'+
                                '<div class="col-xs-12 stats table-noborder">'+
                                        /*'<div class="usage-container col-xs-4">'+
                                            '<div class="usage-border">'+
                                                '<div class="usage-container-left">'+
                                                    '<p class="mem-title"></p><span class="usagevalue" id="size_mem" name="size_mem"></span>'+
                                                '</div>'+
                                                '<div class="usage-container-inner">'+
                                                    '<div class="usage-off" id="gauge_mem" name="gauge_mem">'+
                                                        '<div class="usage"></div>'+
                                                    '</div>'+
                                                '</div>'+
                                            '</div>'+
                                        '</div>'+*/
                                        '<div class="plot-container col-xs-12">'+
                                            '<div class="plot-border">'+
                                                '<div class="usage-container-left">'+
                                                    '<span class="usagevalue" id="size_mem" name="size_mem"></span><p class="mem-title">'+$.MyLocale.panel.Mem+'</p>'+
                                                '</div>'+
                                                '<div class="plot-container-inner">'+
                                                    '<div id="app_mem_plot'+oSlot.PhysicalIndex+'" class="area"></div>'+
                                                '</div>'+
                                               '</div>'+
                                        '</div>'+
                                '</div>'+
                            '</div>'+
                        '</div>'+
                        '<div class="col-xs-5 file-container " id="pie-span">'+
                            /*'<table class="app-title-container table-noborder" style="display:none"><tr>'+
                                '<td><a class="fa fa-caret-left prev-carousel" href="#pieCarousel" data-slide="prev"></a></td>'+
                                '<td><span id="app_title" class="app-title">flash</span></td>'+
                                '<td><a class="icon-caret-right next-carousel" href="#pieCarousel" data-slide="next"></a></td>'+
                            '</tr></table>'+*/
                            '<div id="pieCarousel" class="carousel slide" style="display:none">'+
                                // Carousel items
                                '<div class="carousel-inner">'+
                                '</div>'+
                                '<a class="fa fa-chevron-left prev-carousel carousel-control left" href="#pieCarousel" data-slide="prev"></a>'+
                                '<a class="icon-chevron-right next-carousel carousel-control right" href="#pieCarousel" data-slide="next"></a>'+
                            '</div>'+
                        '</div>'+
                    '</div>';
        $(".detail .left-group",$("#"+sParentId)).append(sHtml);
    }

    function displayVersionInfo(oSlot,sParentId)
    {
        function myCallback(oInfos)
        {
            var aInfo = Utils.Request.getTableRows(NC.DeviceVersionEntities, oInfos);
            var oInfor = {
                "HardwareRev" : false, 
                "FirmwareRev" : false, 
                "SoftwareRev" : false, 
                "SerialNumber" : false
            }, bFlag = false;

            for(var i=0;i<aInfo.length;i++)
            {
                bFlag = true;
                for(key in oInfor)
                {
                    oInfor[key] = oInfor[key] || aInfo[i][key];
                    if(!oInfor[key])
                    {
                        bFlag = false;
                    }
                }

                if(bFlag)
                {
                    break;
                }
            }
            createDeviceInfo(oInfor,sParentId);
        }
        var oEntityInfo = Utils.Request.getTableInstance(NC.DeviceVersionEntities);
        Utils.Request.getAll([oEntityInfo], {onSuccess:myCallback,showMsg:false,showErrMsg:false});
    }

    function getFileSystemData(PhysicalIndex)
    {
        function getFileSystemCallback(oInfos)
        {
            var oSlotDataInfo = g_oSlotDataInfo[PhysicalIndex];
            var aFileSystem = Utils.Request.getTableRows(NC.FileSystem, oInfos);
            $.each(aFileSystem, function(index, value) {
    //                var keyArray = value.Name.split("#");
    //                var key = keyArray[0].replace("chassis", "chassis_")+keyArray[1].replace("slot", "slot_");
                oSlotDataInfo.oMapObject[value.Name.toLowerCase()] = value;
            });
            
            var sChassis = oSlotDataInfo.Chassis;
            var sSlot = oSlotDataInfo.Slot;
            var sFileIndex = "";
            /* 分布式堆叠 */
            if((IS_STACK_SYS)&&(!IS_CEN_SYS))
            {
                sFileIndex = "Slot"+sSlot;
            }
            /* 集中式堆叠 分布式非堆叠 */
            else if(((IS_STACK_SYS)&&(IS_CEN_SYS))||((!IS_STACK_SYS)&&(!IS_CEN_SYS)))
            {
		sFileIndex = "Chassis"+sChassis+"#"+"Slot"+sSlot;
            }
            else
            {
                sFileIndex = "";
            }
            updateFileSystem(PhysicalIndex,sFileIndex);
        }
        var oFileSystemPartitions = Utils.Request.getTableInstance(NC.FileSystem);
        Utils.Request.getAll([oFileSystemPartitions],{onSuccess:getFileSystemCallback,showMsg:false,showErrMsg:false});
    }
    function createMainFrame(oPanel,oSlot,aBoard,sPanelId,aIfmgrInfo)
    {
        var nRole = parseRole(oSlot,aBoard);
        var sParentId = "div_"+oSlot.PhysicalIndex;
        /* 创建slot概要信息 */
        createSlotBrief(oPanel,oSlot,aBoard);
        createPanel(oPanel,oSlot,sParentId,"panel-container",aIfmgrInfo);   
        /* 在每个Slot里创Cpu Memory Flash Cfa控件 */
        createCpuMemoryFlashCfa(oSlot,sParentId);
        /* 在每个Slot里创建设备信息 */
        displayVersionInfo(oSlot,sParentId);
        
        if(2 == nRole) // master
        {
            $(".detail",$("#"+sParentId)).show();
            getFileSystemData(oSlot.PhysicalIndex);
            $(".tr",$("#"+sParentId)).addClass("select");
            $(".detail",$("#"+sParentId)).addClass("select");
            $(".btn",$("#"+sParentId)).html('<i class="fa fa-caret-down"></i>');
        }
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

        var jParent = $("#panel_container_subslot_"+nSubslotId, $("#"+sParentId));
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

        this.layout = "type-"+portinfo[0];
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
            $(jPortDiv).addClass("mulport custom-dropdown");
            $("#"+sId,$("#"+sParentId)).data('data',null)
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
    function setPortData (jPortDiv,aPorts,sParentId)
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
        $(".panel",$("#"+sParentId)).show();

        var nSubslotIdSkip;
        for(var i=0;i<oSlotInfo.subslot.length;i++)
        {
            if(oSlotInfo.subslot[i].skip)
            {
                nSubslotIdSkip = 0;
                continue;
            }

            var bAppendSubslot = (oSlotInfo.subslot[i].appendItem) ? true : false;

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

               setPortData(jPortDiv[j],aNewPorts,sParentId);
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
            var oIf = aIfmgrInfo[w];
            if(oPortData.Name == oIf.Name)
            {
                jPort.data('ifData',oIf); 
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

                var oPortInfo = new getPortInfo(oPortData.VendorType);
                if (  ((oIf.Combo == IF_COMBO_COPPER)&&("type-RJ45" != oPortInfo.layout))
                    ||((oIf.Combo == IF_COMBO_FIBER)&&("type-RJ45" == oPortInfo.layout)))
                {
                    jPort.addClass("disabled");
                }

                break;
            }
        }
    }
    function setPortStatus(jPortDiv,aIfmgrInfo,jParent)
    {
        for(var j=0;j<jPortDiv.length;j++)
        {
            var sId = jPortDiv[j].getAttribute("id");
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
    }
    
    function onDisplaySlotClick(jObj,PhysicalIndex)
    {
        var sIndex = jObj.attr("index");
        if(sIndex!=PhysicalIndex)
        {
            return;
        }
        var jParentTr = $("#div_"+sIndex);
        if($(".fa",jObj).hasClass("fa-caret-down"))
        {
            $(".detail",jParentTr).hide();
            $(".tr",jParentTr).removeClass("select");
            $(".detail",jParentTr).removeClass("select");
            $(".btn",jParentTr).html('<i class="fa fa-caret-left"></i>');
        }
        else
        {
            $(".detail").hide();
            $(".tr.select .btn").html('<i class="fa fa-caret-left"></i>');
            $(".tr").removeClass("select");
            $(".detail").removeClass("select");
            $(".detail",jParentTr).show();
            $(".tr",jParentTr).addClass("select");
            $(".detail",jParentTr).addClass("select");
            $(".tr.select .btn",jParentTr).html('<i class="fa fa-caret-down"></i>');

            /* 位置不能动 */
            var nWidth = $(".detail.select .highcharts-container").width();
            var nCurrentWidth = $(".detail.select .plot-container").width();
            /* 处理plot 宽度 */
            if((!nCurrentWidth)||(nCurrentWidth != nWidth))
            {
                $(".detail.select .highcharts-container").width(nWidth);
            }
            else
            {
                //setWidthUsage();
            }
        }
    }
    function eventBind(PhysicalIndex)
    {
        var jChassisTable = $(".chassis-contrainer .tr");
        $(".btn",jChassisTable)
            .bind("click",function(){
                onDisplaySlotClick($(this),PhysicalIndex);
            });
    }
    function setWidthPie()
    {
        jPieContainer = $("#pie-span");
        var nPieContainer = jPieContainer.width()-30;

        //$(".app-title-container").width(130);
        // $(".pie-container").width(170);
    }
    function createPie(sId, jParentId,nUsed,nTotal, sName)
    {
        var jPie = $("#"+sId),
            oRC = $.MyLocale.panel,
            opt;

        if (0 == nUsed)
        {
            nUsed = 1;
        }

        opt = {
            radius: 75,
            color: ThemeConfig.Sysinfo.Resource.Pie.Color, 
            backgroundColor: ThemeConfig.Sysinfo.Resource.Pie.backgroundColor,
            title: '<div class="text-container">'+
                '<div class="title">'+sName+'</div><hr class="divide"/>'+
                '<div class="used"><span class="used-label"></span><span class="label-txt">'+oRC.used+" "+'</span><span class="value"></span></div>'+
                '<div class="free"><span class="free-label"></span><span class="label-txt">'+oRC.free+" "+'</span><span class="value"></span></div>'+
                '</div>',
            series:{
                name:sName,
                data: nUsed
            }
        }
        jPie
            .attr('data-percent',nUsed)
            .echart().echart("pie", opt);

        $(".used .value", jPie).html(nUsed+"M");
        $(".free .value", jPie).html((nTotal-nUsed)+"M");
    }
    function createFileContainer(oData,PhysicalIndex)
    {
        var sParentId = "div_"+PhysicalIndex;
        var jParentId;
        var jInner = $(".carousel-inner",$("#"+sParentId));
        var bShowpieCarousel = false;
        var sActive = " active ";
        if(oData.FlashTotal)
        {
            if(!bShowpieCarousel)
            {
                $("#pieCarousel",$("#"+sParentId)).show();
                bShowpieCarousel = true;
            }
            if(0 == $("#flash_"+PhysicalIndex).length)
            {
                var s = '<div class="'+sActive+' item" next="cfcardA" prev="cfcardB" id="flash">'+
        					'<div id="flash_'+PhysicalIndex+'" class="pie-container"></div>'+
        				'</div>';
                $(s).appendTo(jInner);
                sActive = "";
            }
            var nUsed = Math.round(oData.FlashUsed/1024/1024);
            var nTotal = Math.round(oData.FlashTotal/1024/1024);
            setWidthPie();
            jParentId = $(".flash",$("#"+sParentId));
            createPie("flash_"+PhysicalIndex,jParentId,nUsed,nTotal,"Flash");
        }
        if(oData.CfaTotal)
        {  
            if(!bShowpieCarousel)
            {
                $("#pieCarousel",$("#"+sParentId)).show();
                bShowpieCarousel = true;
            }
            if(0 == $("#cfcardA_"+PhysicalIndex).length)
            {
                var s = '<div class="'+sActive+'item" next="cfcardB" prev="flash" id="cfcardA">'+
        					'<div id="cfcardA_'+PhysicalIndex+'" class="pie-container"></div>'+
        				'</div>';
                $(s).appendTo(jInner);
                sActive = "";
            }
            //var nUsed = Math.round(oData.CfaUsed/oData.CfaTotal*100);
            var nUsed = Math.round(oData.CfaUsed/1024/1024);
            var nTotal = Math.round(oData.CfaTotal/1024/1024);
            setWidthPie();
            jParentId = $(".cfcardA",$("#"+sParentId));
            createPie("cfcardA_"+PhysicalIndex,jParentId,nUsed,nTotal,"CfcardA");
        }
        if(oData.CfbTotal)
        {
            if(!bShowpieCarousel)
            {
                $("#pieCarousel",$("#"+sParentId)).show();
                bShowpieCarousel = true;
            }
            if(0 == $("#cfcardB_"+PhysicalIndex).length)
            {
                var s = '<div class="'+sActive+'item"  next="flash" prev="cfcardA" id="cfcardB">'+
        					'<div id="cfcardB_'+PhysicalIndex+'" class="pie-container"></div>'+
            			'</div>';
                $(s).appendTo(jInner);
                sActive = "";
            }
            var nUsed = Math.round(oData.CfbUsed/1024/1024);
            var nTotal = Math.round(oData.CfbTotal/1024/1024);
            setWidthPie();
            jParentId = $(".cfcardB",$("#"+sParentId));
            createPie("cfcardB_"+PhysicalIndex,jParentId,nUsed,nTotal,"CfcardB");
        }
        if(bShowpieCarousel)
        {
            //$(".app-title-container",$("#"+sParentId)).show();
            if(1==$("#pieCarousel .carousel-inner .item").length)
            {
                $("#pieCarousel .carousel-control").hide();
            }
        }
    }
    function updateFileSystem(PhysicalIndex,sFileSystem)
    {
        var oSlotDataInfo = g_oSlotDataInfo[PhysicalIndex];
        if(!sFileSystem.toLowerCase())
        {
            sFileSystem ="";
        }
        else
        {
            sFileSystem = sFileSystem+"#";
        }
        //sFileSystem = "";
        var sFlashkey = (sFileSystem + "Flash:").toLowerCase();
        var sCfakey = (sFileSystem + "Cfa0:").toLowerCase();
        var sCfbkey = (sFileSystem + "Cfb0:").toLowerCase();

        var oFlahFileSystem = oSlotDataInfo.oMapObject[sFlashkey] || {};
        var ocfaFileSystem = oSlotDataInfo.oMapObject[sCfakey] || {};
        var ocfbFileSystem = oSlotDataInfo.oMapObject[sCfbkey] || {};

        var updateHtmlData = {
            FlashUsed : oFlahFileSystem.Used || "",
            FlashTotal : oFlahFileSystem.Total || "",
            CfaUsed : ocfaFileSystem.Used || "",
            CfaTotal : ocfaFileSystem.Total || "",
            CfbUsed : ocfbFileSystem.Used || "",
            CfbTotal : ocfbFileSystem.Total || ""
        }
        createFileContainer(updateHtmlData,PhysicalIndex);
    }
    function getPlotData(PhysicalIndex,sKey)
    {
        var data = [];

        for (i = 0; i < MAX_POINT; i++) 
        {
            data.push(0);
        }

        return data;
    }

    function drawPlot(PhysicalIndex)
    {
        $("#app_cpu_plot"+PhysicalIndex).empty();
        $("#app_mem_plot"+PhysicalIndex).empty();
        
        var oSlotDataInfo = g_oSlotDataInfo[PhysicalIndex];

        // init cpu plot
        var option={
                width: 260,
                height: 61,
                XlineStyle_Color:ThemeConfig.Sysinfo.Resource.Area.XlineStyle_Color,
                YlineStyle_Color:ThemeConfig.Sysinfo.Resource.Area.YlineStyle_Color,
                series:[{
                            name: 'cpu',
                            data: getPlotData(PhysicalIndex,"CpuUsage")
                        }]
            };
        oSlotDataInfo.oSeriesCpu = $("#app_cpu_plot"+PhysicalIndex).echart().echart("area", option);

        // init memory plot
        var option={
                width: 260,
                height: 61,
                XlineStyle_Color:ThemeConfig.Sysinfo.Resource.Area.XlineStyle_Color,
                YlineStyle_Color:ThemeConfig.Sysinfo.Resource.Area.YlineStyle_Color,
                series:[{
                            name: 'Memory',
                            data: getPlotData(PhysicalIndex,"MemUsage")
                        }]
            };
        oSlotDataInfo.oSeriesMem = $("#app_mem_plot"+PhysicalIndex).echart().echart("area", option);
    }

    function drawUsage(sParentId,cpuUsage,memUsage,memSize)
    {
        function _changeBarColor(Usage)
        {
            return (Usage>=75)?'#DF5353':'#8BBC21';
        }
        //var jCpu = $("#gauge_cpu .usage",$("#"+sParentId));
        //var jMem = $("#gauge_mem .usage",$("#"+sParentId));
        var jCpuText = $("#size_cpu",$("#"+sParentId));
        var jMemText = $("#size_mem",$("#"+sParentId));

        //jCpu.height(cpuUsage*0.29);
        //jMem.height(memUsage*0.29);
        jCpuText.html(cpuUsage+"%");
        jMemText.html(memUsage+"%");
        $(".mem-total #size",$("#"+sParentId)).html(parseInt(memSize/(1024*1024)));

    }

    function drawData(PhysicalIndex)
    {
        var oSlotDataInfo = g_oSlotDataInfo[PhysicalIndex];
        oSlotDataInfo.nCurIndex = PhysicalIndex;
        if(oSlotDataInfo.oMapObject.length)
        {
            var sChassis = oSlotDataInfo.Chassis;
            var sSlot = oSlotDataInfo.Slot;
            var sFileIndex = "";
            /* 分布式堆叠 */
            if((IS_STACK_SYS)&&(!IS_CEN_SYS))
            {
                sFileIndex = "Chassis"+sChassis+"#"+"Slot"+sSlot;
            }
            /* 集中式堆叠 分布式非堆叠 */
            else if(((IS_STACK_SYS)&&(IS_CEN_SYS))||((!IS_STACK_SYS)&&(!IS_CEN_SYS)))
            {
                sFileIndex = "Slot"+sSlot;
            }
            else
            {
                sFileIndex = "";
            }
            updateFileSystem(PhysicalIndex,sFileIndex);
        }
        drawPlot(PhysicalIndex);
    }
    // Get data from the device
    function getData(Index,pfCallback)
    {
        function myCallback(oInfos)
        {
            var aEntityExtInfo = Utils.Request.getTableRows(NC.DeviceExtPhysicalEntities, oInfos); // the size of aEntityExtInfo and aEntityInfo is same

            var nStart = 0;
            var oEntInfo = {};
            var oCurEnt = false;
            var oInfo = {};
            var PhysicalIndex;

            if(0 == aEntityExtInfo.length)
            {
                return;
            }

            var oEntity = aEntityExtInfo[0];
            PhysicalIndex = oEntity.PhysicalIndex;
            oInfo.PhysicalIndex = oEntity.PhysicalIndex;
            oInfo.MemUsage = parseInt(oEntity.MemUsage)|| 0;
            oInfo.CpuUsage = parseInt(oEntity.CpuUsage)|| 0;
            oInfo.MemSize = parseInt(oEntity.MemSize);
            
            ////{{ local run start
            if (MyConfig.config.local)
            {
                PhysicalIndex = aEntityExtInfo[74].PhysicalIndex;
                $.extend(oInfo, aEntityExtInfo);
                oInfo.PhysicalIndex = aEntityExtInfo[74].PhysicalIndex;
                oInfo.MemUsage = getRandomNum(99);
                oInfo.CpuUsage = getRandomNum(99);
                oInfo.MemSize = getRandomNum(99);
            }
            ////}}
            
            var jParentId = $("#div_"+PhysicalIndex);
            UsageBar.set(jParentId, "cpu", oInfo.CpuUsage);
            UsageBar.set(jParentId, "mem", oInfo.MemUsage);

            oEntInfo["ent_"+PhysicalIndex] = oInfo;      
            oCurEnt = oInfo;

            var oSlotDataInfo = g_oSlotDataInfo[PhysicalIndex];
            
            /* update the plot */
            var x=(new Date()).getTime(), y;
            if(oSlotDataInfo.oSeriesCpu)
            {
                var sParentId = "div_"+PhysicalIndex;

                drawUsage(sParentId,oCurEnt.CpuUsage,oCurEnt.MemUsage,oInfo.MemSize);
                oSlotDataInfo.oSeriesCpu.addPoint([x,oCurEnt.CpuUsage],true,true);
                oSlotDataInfo.oSeriesMem.addPoint([x,oCurEnt.MemUsage],true,true);
            }

            pfCallback && pfCallback.apply(oInfos, [oCurEnt]);
        }

        var oExtPhysicalEntities = Utils.Request.getTableInstance(NC.DeviceExtPhysicalEntities);
        oExtPhysicalEntities.addFilter({"PhysicalIndex" : Index});
      
        Utils.Request.get([oExtPhysicalEntities], 1, {onSuccess:myCallback,showMsg:false,showErrMsg:false});
    }

    function getPortData(PhysicalIndex)
    {
        function myCallback(oInfos)
        {
            var jParentId = $("#div_"+PhysicalIndex);
            var sParentId = "div_"+PhysicalIndex;
            
            var aEntityExtInfo = Utils.Request.getTableRows(NC.ExtPhyEntRefresh, oInfos);
            var aEntityInfo = Utils.Request.getTableRows(NC.PhyEntRefresh, oInfos);
            var aIfmgrInfo = Utils.Request.getTableRows(NC.Ifmgr, oInfos);
            var aEthInterfaces = Utils.Request.getTableRows(NC.EthInterfaces, oInfos);
           
            var jPortDiv = $(".port-container .port",jParentId);
            
            for(var z=0;z<aIfmgrInfo.length;z++)
            {
                for(var k=0;k<aEthInterfaces.length;k++)
                {
                    if(aIfmgrInfo[z].IfIndex == aEthInterfaces[k].IfIndex)
                    {
                        $.extend(aIfmgrInfo[z], aEthInterfaces[k]);
                        break;
                    }
                }
            }
          
            for(var i=0;i<aEntityExtInfo.length;i++)
            {
                $.extend(aEntityExtInfo[i], aEntityInfo[i]);
                for(var j=0;j<jPortDiv.length;j++)
                {
                    if(aEntityExtInfo[i].PhysicalIndex == $(jPortDiv[j]).attr("index"))
                    {
                        $(jPortDiv[j]).data('data',aEntityExtInfo[i]);
                    }
                }
            }
            setPortStatus(jPortDiv,aIfmgrInfo,sParentId);
        }
        var minIndex = $(".panel",$("#div_"+PhysicalIndex)).attr("minIndex");
        var count = $(".panel",$("#div_"+PhysicalIndex)).attr("count");
        
        var oPhysicalEntities = Utils.Request.getTableInstance(NC.PhyEntRefresh);
        var oExtPhysicalEntities = Utils.Request.getTableInstance(NC.ExtPhyEntRefresh);
        oPhysicalEntities.addMatchFilter({"PhysicalIndex" : "notLess:"+minIndex});
        oExtPhysicalEntities.addMatchFilter({"PhysicalIndex" : "notLess:"+minIndex});
        var oIfmgr = Utils.Request.getTableInstance(NC.Ifmgr);
        var oEthInterfaces = Utils.Request.getTableInstance(NC.EthInterfaces);
     
        Utils.Request.getAll([oPhysicalEntities, oExtPhysicalEntities, oIfmgr, oEthInterfaces], {onSuccess:myCallback,showMsg:false,showErrMsg:false});
    }

    var PanelTimer = {
        _data: [],
        _hTimerFile: false,
        _hTimerPort: false,
        start: function()
        {
            this.reset();
            this._hTimerFile = Utils.Timer.createLoopTimer("Page.Frame.app.panel", 2000, function()
            {
                var aSlot = PanelTimer._data;
                for(var i=0; i<aSlot.length; i++)
                {
                    var oData = aSlot[i];
                    getData(oData.PhysicalIndex);
                }
                return true;
            });
            // return ;
            this._hTimerPort = Utils.Timer.createLoopTimer("Page.Frame.app.panel", 60000, function()
            {
                var aSlot = PanelTimer._data;
                for(var i=0; i<aSlot.length; i++)
                {
                    var oData = aSlot[i];
                    if($(".detail",$("#div_"+oData.PhysicalIndex)).hasClass("select"))
                    {
                        //getPortData(oData.PhysicalIndex);
                    }
                }
                return true;
            });
        },
        reset: function()
        {
            if(this._hTimerFile)
            {
                this._hTimerFile.destroy();
                this._hTimerFile = false;
            }
            if(this._hTimerPort)
            {
                this._hTimerPort.destroy();
                this._hTimerPort = false;
            }
            this._data.length = 0;
        },
        add: function(slot)
        {
            this._data.push(slot);
        }
    }

    function initSlotInfo(oSlot)
    {
        var PhysicalIndex = oSlot.PhysicalIndex;
        var oSlotInfo = new SlotDataInfo(PhysicalIndex, oSlot.Chassis, oSlot.Slot);
        
        g_oSlotDataInfo[PhysicalIndex] = oSlotInfo;
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
    function bindEvent()
    {
        $(".port").bind("mouseover",function(){
             _mouseOverPort(this);
        });
    }
    function getRequestTable(sPanelId)
    {
        function myCallback(oInfos)
        {
            var aBase= Utils.Request.getTableRows(NC.DeviceBase, oInfos);
            var aBoard = Utils.Request.getTableRows(NC.DeviceBoards, oInfos);
            var aEntityExtInfo = Utils.Request.getTableRows(NC.DeviceExtPhysicalEntities, oInfos); // the size of aEntityExtInfo and aEntityInfo is same
            var aEntityInfo = Utils.Request.getTableRows(NC.DevicePhysicalEntities, oInfos);
             var aIfmgrInfo = Utils.Request.getTableRows(NC.Ifmgr, oInfos);
            var aEthInterfaces = Utils.Request.getTableRows(NC.EthInterfaces, oInfos);
            var aEthInterfaceCapabilities = Utils.Request.getTableRows(NC.EthInterfaceCapabilities, oInfos);
            var aComboCapabilities = [];
            var oComboCapabilities = {
                "IfIndex": "",
                "ComboCapabilities": ""
                }
           
            aChassis = _transStackJson(oInfos);

            for(var w=0;w<aEthInterfaces.length;w++)
            {
                oComboCapabilities.IfIndex = aEthInterfaceCapabilities[w].IfIndex;
                oComboCapabilities.ComboCapabilities = aEthInterfaceCapabilities[w].Combo;
                aComboCapabilities.push(oComboCapabilities)
                $.extend(aEthInterfaces[w], aComboCapabilities[w]);
            }
            for(var z=0;z<aIfmgrInfo.length;z++)
            {
                for(var k=0;k<aEthInterfaces.length;k++)
                {
                    if(aIfmgrInfo[z].IfIndex == aEthInterfaces[k].IfIndex)
                    {
                        $.extend(aIfmgrInfo[z], aEthInterfaces[k]);
                        break;
                    }
                }
            }
            for(var i=0;i<aChassis.length;i++)
            {
                var aSlot = _transePanelJson(oInfos,aChassis[i].PhysicalIndex);
                for(var j=0;j<aSlot.length;j++)
                {
                    var oSlot = aSlot[j];
                    if(!oSlot)
                    {
                        continue;
                    }

                    checkCenDevice(oSlot,aBase);
                    createMainFrame(aChassis[i],oSlot,aBoard,sPanelId,aIfmgrInfo);
                    eventBind(oSlot.PhysicalIndex);
                    initSlotInfo(oSlot);
                    getData(oSlot.PhysicalIndex);
                    drawData(oSlot.PhysicalIndex);
                    $("#FlashUsed,#FlashTotal,#CfaUsed,#CfaTotal").empty();
                    PanelTimer.add(oSlot);
                }           
            }
            $(".chassis-contrainer .tr:last").addClass("last-child");
            $(".chassis-contrainer .detail:last").addClass("last-child");
            bindEvent();
            hideLoading();
        }
        showLoading(sPanelId);
        PanelTimer.start();

        var oBase = Utils.Request.getTableInstance(NC.DeviceBase);
        var oBoards = Utils.Request.getTableInstance(NC.DeviceBoards);
        var oPhysicalEntities = Utils.Request.getTableInstance(NC.DevicePhysicalEntities);
        var oExtPhysicalEntities = Utils.Request.getTableInstance(NC.DeviceExtPhysicalEntities);
         var oIfmgr = Utils.Request.getTableInstance(NC.Ifmgr);
        var oEthInterfaces = Utils.Request.getTableInstance(NC.EthInterfaces);
        var oEthInterfaceCapabilities = Utils.Request.getTableInstance(NC.EthInterfaceCapabilities);
     
        Utils.Request.getAll([oBase, oBoards, oPhysicalEntities, oExtPhysicalEntities, oIfmgr, oEthInterfaces, oEthInterfaceCapabilities],{onSuccess:myCallback,showMsg:false,showErrMsg:false});
    }
    
    function setWidthUsage()
    {
        jCpu = $(".col-xs-9 #cpu_fieldset");
        jMem = $(".col-xs-9 #mem_fieldset");

        var nCpu = jCpu.width();
        var nMem = jMem.width();

        var nUsage = $(".usage-container").width();

        $(".plot-container",jCpu).width(nCpu-nUsage);
        
        $(".plot-container",jMem).width(nMem-nUsage);
        
        setWidthPie();
    }    
    function _mouseOverPort(obj)
    {
        var customOpt = $(".dashboard:visible").data('custom'); 

        customOpt && customOpt.pfCallback && customOpt.pfCallback.apply();

    }
    function _init(oFrame)
    {
        $(".dashboard", oFrame).dashboard();
    }
    function _destroy()
    {
        PanelTimer.reset();
    }
    function _resize()
    {
    }    
    function _onChangeTheme()
    {
        var optPie = {
            color: ThemeConfig.Sysinfo.Resource.Pie.Color, 
            backgroundColor: ThemeConfig.Sysinfo.Resource.Pie.backgroundColor
        }
        
        $.each($(".pie-container",$("#chassis_contrainer")),function(i,item)
        {
            $(item).echart("setPieTheme",optPie); 
        })        
        var optArea = {
                color: ThemeConfig.Sysinfo.Resource.Area.color,
                XlineStyle_Color:ThemeConfig.Sysinfo.Resource.Area.XlineStyle_Color,
                YlineStyle_Color:ThemeConfig.Sysinfo.Resource.Area.YlineStyle_Color
        }
        $.each($(".area"),function(i,item)
        {
            $(item).echart("setLineTheme",optArea); 
        }) 
    }
    var oDashboard = {
        _create : function()
        {
            getRequestTable(this.element.attr("id"));
        },
        _destroy:function()
        {
            _destroy();
        },
	    getSelectPorts : function()
        {
            _getSelectPorts();
        },
        mouseOverPort : function(opt)
        {
            $(".dashboard:visible").data('custom',opt); 
        }
    };
    $.widget("ui.dashboard", oDashboard);
    Widgets.regWidget(UTILNAME, {
        "init": _init, "destroy": _destroy,"resize": _resize,
        "changeTheme": _onChangeTheme,
        "widgets": ["PieChart"], 
        "utils":["Request"],
        "libs": ["Libs.Panel.Define"]
    });
})(jQuery);
