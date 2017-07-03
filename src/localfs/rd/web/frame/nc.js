;(function ($) {
var MODULE_NAME = "Frame.NC";
var PageInfo = {
    NC_AP:{
    	ClientStatus: {
            nodes:["WLANClient","ServiceStatus"],
            row:"Status",
            index:["ServiceTemplateName"],
            column:["SSID", "ClientNumber","ClientNumber2G","ClientNumber5G","RadioNumber2G","RadioNumber5G"/*,"RxRate","TxRate"*/],
            menus:["FRAME"]
        },
        ManualAP : {
            nodes: ["AP", "ManualAP"],
            row: "AP",
            index: ["Name"],
            column: ["Description","Model", "CfgSerialID", "CfgMacAddress", "RadioNum", "Status" ,"GroupName", "RegionCode", "RegionLock", "Priority", "Preempt", "EchoInterval", "EchoCount", "RetransInterval", "RetransCount","TunnelEncryption","StatisInterval", "FirmwareUpgrade", "BackupACIPv4", "BackupACIPv6", "LocationName"],
	    	menus: ["FRAME"]
        },
        RunAP : {
            nodes: ["AP", "RunAP"],
            row: "AP",
            index: ["Name"],
            column: ["Model", "SerialID", "Type","MacAddress", "RadioNum", "Status", "Ipv4Address", "Ipv6Address", "PortNumber","GroupName", "OnlineTime", "HWVer", "SWVer", "BWVer", "TransCtrlPkt", "RecvCtrlPkt", "TransDataPkt", "RecvDataPkt", "EchoReqCnt", "EchoRespLossCnt", "DiscoveryType", "ConfigFailCnt", "LastFailReason", "LastRebootReason", "TunnelDownReason", "ConnectionType", "PeerACIPv4Address", "PeerACIPv6Address", "LocationName","AuthenticatedFlag"],
	    	menus: ["FRAME"]
        },
        RadioRunningCfg:{
            nodes: ["AP", "RadioRunningCfg"],
            row: "Radio",
            index: ["ApName","RadioID"],
            column: ["Mode","Bandwidth","SupportDot11B","SupportDot11A","SupportDot11G","SupportDot11GN","SupportDot11AN","SupportDot11AC","Spectrum","Status","RateMulticast"],
            menus:["M_APSettings", "M_AccessPoints","M_MonAPs","M_APGroups", "M_AddAp","M_APReports","M_Dashboard"]
        },
        APGroup : {
            nodes: ["AP", "APGroup"],
            row: "Group",
            index: ["Name"],
            column: ["RuleNum","Description", "ModelNum", "APNum", "RegionCode", "RegionLock", "Priority", "Preempt", "EchoInterval", "EchoCount", "RetransInterval", "RetransCount", "TunnelEncryption","StatisInterval", "FirmwareUpgrade", "BackupACIPv4", "BackupACIPv6", "LocationName"],
	    	menus: ["FRAME"]
        },
        Location : {
            nodes: ["AP", "Location"],
            row: "Location",
            index: ["LocationName"],
            column: [],
	    	menus: ["FRAME"]
        },
        APSummary:{
            nodes:["AP","APSummary"],
            row:"",
            index:[],
            column:["ManualApNum", "RunApNum", "OfflineApNum","UnhealthyApNum","ApGroupNum","LocationNum","NorthIfOutPkt","NorthIfOutByte","NorthIfInPkt","NorthIfInByte"],
            menus:["FRAME"]
        },
        RadioOfMAP : {
            nodes: ["AP", "RadioOfManualAP"],
            row: "Radio",
            index: ["ApName","RadioID"],
            column: ["Mode","SupportDot11B","SupportDot11A","SupportDot11G","SupportDot11GN","SupportDot11AN","SupportDot11AC","Bandwidth","Spectrum","Status","CfgChannel","CfgMaxPower"],
	    	menus: ["FRAME"]
        },
        APDB:{
            nodes: ["AP", "APDB"],
            row: "Model",
            index: ["ModelName"],
            column: ["RadioNum", "DefaultRegionCode"],
            menus:["FRAME"]
        },
        RegionDB:{
            nodes: ["AP", "RegionDB"],
            row: "Region",
            index: ["ModelName","RegionCode"],
            column: ["SupportedRadioList"],
            menus:["FRAME"]
        },
        Logs : {
            nodes:["Syslog","Logs"],
            row:"Log",
            index:["Index"],
            column:["Time","Group","Digest","Severity","Content"],
            menus: ["FRAME"]
        },
        LogBuffer: {
            nodes:["Syslog","LogBuffer"],
            row:"",
            index:[],
            column:["Clear"],
            menus: ["FRAME"]
        }
	},
    NC_Acl:{
		AclGroups: {
			nodes:["ACL","Groups"],
			row:"Group",
			index:["GroupID", "GroupType"],
			column:["Name","Description","RuleNum"], // "MatchOrder","Step",
			menus: ["FRAME"]
		}
	},
	NC_Device:{
		DeviceCap : {
	        nodes:["Device","Base"],
	        row:"",
	        index:[],
	        column:["MinChassisNum","MaxChassisNum","MinSlotNum", "MaxSlotNum", "MinCPUIDNum", "MaxCPUIDNum"],
	        menus: ["FRAME"]
    	},
	    BoardsTable : {
	        nodes:["Device","Boards"],
	        row:"Board",
	        index:["DeviceNode.Chassis","DeviceNode.Slot","DeviceNode.CPUID"],
	        column:["PhysicalIndex", "Role"],
	        menus: ["FRAME"]
    	}
	},
	NC_Intf:{
		IfMgrTable: {
			nodes:["Ifmgr","Interfaces"],
			row:"Interface",
			index:["IfIndex"],
			column:["Name","AbbreviatedName","PortIndex","ifTypeExt","ifType","Description",
					"AdminStatus","OperStatus","ConfigSpeed","ActualSpeed","ConfigDuplex",
					"LinkType","PVID","InetAddressIPV4","InetAddressIPV4Mask","ConfigAutoSpeed", 
					"ActualDuplex", "PhysicalIndex", "PortLayer", "Combo", "ForWardingAttribute", 
					"Loopback", "ConfigMDI", "ConfigMTU", "ActualMTU", "ConfigBandwidth", "ActualBandwidth",
					"SubPort"],
			menus: ["FRAME"]
		},
	    IfMgrCapabilities: {
	        nodes:["Ifmgr","InterfaceCapabilities"],
	        row:"Interface",
	        index:["IfIndex"],
	        column:["Configurable"],
	        menus: ["FRAME"]
	    }
	},
	NC_System:{
		DeviceBase : {
		    nodes:["Device","Base"],
		    row:"",
		    index:[],
		    column:["Uptime", "HostName", "LocalTime"],
		    menus: ["FRAME"]
		},
	    DeviceBoards : {
	        nodes:["Device","Boards"],
	        row:"Board",
	        index:["DeviceNode.Chassis","DeviceNode.Slot","DeviceNode.CPUID"],
	        column:["PhysicalIndex", "Role"],
	        menus: ["FRAME"]
	    },
		PhysicalEntities : {
			nodes:["Device","PhysicalEntities"],
			row:"Entity",
			index:["PhysicalIndex"],
			column:["Class","Name","VendorType","Model"],
			menus: ["FRAME"]
		}
	},
	NC_Timerange:{
		TrangeTable : {
	        nodes:["TimeRange","TimeRanges"],
	        row:"Range",
	        index:["Name"],
	        column:["Status"],
	        menus: ["FRAME"]
	    }
	},
	NC_VLAN:{
		VlanGroups : {
		    nodes:["VLAN","VLANs"],
		    row:"VLANID",
		    index:["ID"],
		    column:["Description","RouteIfIndex","UntaggedPortList","TaggedPortList"],
		    menus: ["FRAME"]
		}
	},
	NC_VRF:{
		VrfTable: {
			nodes:["L3vpn","L3vpnVRF"],
			row:"VRF",
			index:["VRF"],
			column:["VrfIndex","Description","AssociatedInterfaceCount"],
			menus: ["FRAME"]
		}
	},
	NC_Frame:{
		WebUI : {
            nodes:["Fundamentals","WebUI"],
            row:"",
            index:[],
            column:["SessionAgingTime"],
            menus: ["FRAME"]
        },
        UserManager : {
		    nodes:["UserAccounts","Management","Accounts"],
		    row:"Account",
		    index:["Name"],
		    column:["Password"],
            menus: ["FRAME"]
	    }
	},
	NC_Dashboard:{
		DeviceCpu : {
	        nodes:["Device","CPUs"],
	        row:"CPU",
	        index:["PhysicalIndex"],
	        column:["Chassis", "Slot", "CPUID", "CPUUsage"],
	        menus: ["FRAME"]
	    },    
	    
	    DeviceBase : {
	        nodes:["Device","Base"],
	        row:"",
	        index:[],
	        column:["MinChassisNum", "MaxChassisNum","MinSlotNum", "MaxSlotNum"],
	        menus: ["FRAME"]
	    },

	    DeviceBoards : {
	        nodes:["Device","Boards"],
	        row:"Board",
	        index:["DeviceNode.Chassis","DeviceNode.Slot","DeviceNode.CPUID"],
	        column:["PhysicalIndex", "Role"],
	        menus: ["FRAME"]
	    },
	    
	    DevicePhysicalEntities : {
	        nodes:["Device","PhysicalEntities"],
	        row:"Entity",
	        index:["PhysicalIndex"],
	        column:["Chassis", "Slot", "SubSlot", "Description", "VendorType", "ContainedIn", "Class", "ParentRelPos", "Name"],
	        menus: ["FRAME"]
	    },

	    DeviceExtPhysicalEntities : {
	        nodes:["Device","ExtPhysicalEntities"],
	        row:"Entity",
	        index:["PhysicalIndex"],
	        column:["AdminState", "OperState", "StandbyState", "CpuUsage","CpuUsageThreshold", "MemUsage", "MemAvgUsage", "MemSize", "PhyMemSize"],
	        menus: ["FRAME"]
	    },
    	PhyEntRefresh: {
	        nodes:["Device","PhysicalEntities"],
	        row:"Entity",
	        index:["PhysicalIndex"],
	        column:["Name"],
	        menus: ["FRAME"]
	    },
    	ExtPhyEntRefresh: {
	        nodes:["Device","ExtPhysicalEntities"],
	        row:"Entity",
	        index:["PhysicalIndex"],
	        column:["AdminState", "OperState"],
	        menus: ["FRAME"]
	    },
	    FileSystem : {
	        nodes:["FileSystem", "Partitions"],
	        row:"Partition",
	        index:["Name"],
	        column:["Total", "Used", "Free", "Bootable"],
	        menus: ["FRAME"]
	    },
	    
	    DeviceVersionEntities : {
	        nodes:["Device","PhysicalEntities"],
	        row:"Entity",
	        index:["PhysicalIndex"],
	        column:["HardwareRev", "FirmwareRev", "SoftwareRev", "SerialNumber"],
	        menus: ["FRAME"]
	    },

	    Ifmgr : {
	        nodes:["Ifmgr","Interfaces"],
	        row:"Interface",
	        index:["IfIndex"],
	        column:["Name","AbbreviatedName","PortIndex","PhysicalIndex","ifTypeExt"],
	        menus: ["FRAME"]
	    },

	    EthInterfaces : {
	        nodes:["Ifmgr","EthInterfaces"],
	        row:"Interface",
	        index:["IfIndex"],
	        column:["Combo"],
	        menus: ["FRAME"]
	    },
	    EthInterfaceCapabilities : {
	        nodes:["Ifmgr","EthInterfaceCapabilities"],
	        row:"Interface",
	        index:["IfIndex"],
	        column:["Combo"],
	        menus: ["FRAME"]
	    }  
	},
	NC_Panel:{
		DeviceCpu : {
	        nodes:["Device","CPUs"],
	        row:"CPU",
	        index:["PhysicalIndex"],
	        column:["Chassis", "Slot", "CPUID", "CPUUsage"],
            menus: ["FRAME"]
	    },    
		DeviceBase : {
	        nodes:["Device","Base"],
	        row:"",
	        index:[],
	        column:["MinChassisNum", "MaxChassisNum","MinSlotNum", "MaxSlotNum"],
	        menus: ["FRAME"]
	    },
		DeviceBoards : {
	        nodes:["Device","Boards"],
	        row:"Board",
	        index:["DeviceNode.Chassis","DeviceNode.Slot","DeviceNode.CPUID"],
	        column:["PhysicalIndex", "Role"],
	        menus: ["FRAME"]
	    },
		DevicePhysicalEntities : {
	        nodes:["Device","PhysicalEntities"],
	        row:"Entity",
	        index:["PhysicalIndex"],
	        column:["Chassis", "Slot", "SubSlot", "Description", "VendorType", "ContainedIn", "Class",
	            "ParentRelPos", "Name"],
	        menus: ["FRAME"]
	    },
		DeviceExtPhysicalEntities : {
	        nodes:["Device","ExtPhysicalEntities"],
	        row:"Entity",
	        index:["PhysicalIndex"],
	        column:["AdminState", "OperState", "StandbyState", "CpuUsage","CpuUsageThreshold", "MemUsage", "MemAvgUsage", "MemSize", "PhyMemSize"],
	        menus: ["FRAME"]
	    },
		FileSystem : {
	        nodes:["FileSystem", "Partitions"],
	        row:"Partition",
	        index:["Name"],
	        column:["Total", "Used", "Free", "Bootable"],
	        menus: ["FRAME"]
	    },
		Ifmgr : {
	        nodes:["Ifmgr","Interfaces"],
	        row:"Interface",
	        index:["IfIndex"],
	        column:["Name","AbbreviatedName","PortIndex","PhysicalIndex","ifTypeExt"],
	        menus: ["FRAME"]
	    },
		EthInterfaces : {
	        nodes:["Ifmgr","EthInterfaces"],
	        row:"Interface",
	        index:["IfIndex"],
	        column:["Combo"],
	        menus: ["FRAME"]
	    },
		EthInterfaceCapabilities : {
	        nodes:["Ifmgr","EthInterfaceCapabilities"],
	        row:"Interface",
	        index:["IfIndex"],
	        column:["Combo"],
	        menus: ["FRAME"]
	    }
	}
};

Utils.Pages[MODULE_NAME] = PageInfo;
})( jQuery );

