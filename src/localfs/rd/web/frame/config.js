var MyConfig = 
{
	name: "v7-web-config",
	ver: "7.54.2.08131800",
	root: "../../web/",  // 网管的静态URL的根目录，即web目录
	path:"/rd",// rd配置
	responseWidth: 800, // if the window width is less it, the layout of the page will be changed.
	Layout:
	{
		enable: false,
		width1: 768,
		width2: 980,
		width3: 1100
	},
	titleSeperator: "|",
	config:
	{
		//debuger: false,
		keepAlive: 5000, // 心跳时间间隔, 毫秒
		checkTimeout: 1000, // 检查是否超时的时间间隔
		menuDelay: 200,     // 点击菜单、后退、前进、跳转超链接等后页面开始响应的时间间隔
		cachePage: true, // 是否缓存静态HTML和JS文件
		effect:true
	},
	helpPanel:
	{
		size: "75%"
	},
	Dialog:
	{
		DEFAULT:{height:"auto", width:400},
		INFO:    // 提示框配置
		{
			width: 500, 
			height: 40,
			visibleTime:2000,        //自动关闭的时间 ms
			position:"center-center" //位置: 可以支持 top|center|bottom - left|center|right 的任意组合
		},
		ALERT:{},
		CONFIRM:{},
		ERROR:{},
		PROMPT:{},
		FORM: {height:"auto", width:"auto"}
	},
	Plot:
	{
		maxPoint: 100,
		width: 250
	},
	Syslog:
	{
		severity: ["Emergency","Alert","Critical","Error","Warning","Notification","Informational","Debugging"], // 日志级别定义
		lastestCount: 5
	},
	MList:
	{
		errorVisible: 2000, // 行编辑时错误提示信息可见的时间
		smallWidth: 600,
		subRowHeight: 43
		,searchDelay: 500  // ms, delay for gloable search
		,selectMode: "pc"  // pc or mobile
		,rowHeight: 23
		,ROW_MARGIN: 20   // include margin top and bottom
		,pageBar: true
		,statusBar: true
		,EditList: "cell" // Display mode of EditList, the value is "block" or "cell"
	},
	jDate:
	{
		DEFAULT:
		{
			// Default regional settings
			numberOfMonths: 1,
			stepMonths: 2,
			showOtherMonths: true,
			selectOtherMonths: true,
			changeMonth: true,
			changeYear: true,
			yearRange: '2000:2035',
			dateFormat:	'yy-mm-dd',
			isRTL: false,
			showMonthAfterYear:	true,
			//showOptions:{direction:"up"},
			showButtonPanel: true
		},
		INLINE:
		{
			numberOfMonths: 1,
			stepMonths: 1,
			altFormat: 'yy-mm-dd',
			showButtonPanel: false
		}
	},
	PageRefresh:    // 单位: 秒
	{
		SysInfo: 1,
		IfStat: 1
	},
	MenuData:
	{
		M_System:[
			{id:"M_Device_Location",url:"wdashboard.device_location"},
			{id:"M_Device",url:"wdashboard.device"},
			{id:"M_Ap",url:"wdashboard.summary_ap"},
			{id:"M_Location",url:"maintain.location_ap"},
			{id:"M_Scene",url:"maintain.analyse_scene"},
			{id:"M_Runanalyse",url:'maintain.analyse_run'}
		],
		M_DPI:[
			// {id:"M_Dashboard",url:"maintain.maintain"},
			{id:"M_WANanalysis",url:"maintain.analyse_wan"},
			{id:"M_SSIDanalysis",url:"maintain.analyse_ssid"},
			{id:"M_Identianalysis",url:"maintain.analyse_auth"},
			{id:"M_Configanalysis",url:"maintain.analyse_config"},
			{id:"M_Securityanalysis",url:"maintain.wirelesssafe"},
			{id:"M_Testanalysis",url:"maintain.analyse_check"},
			{id:"M_Friendanalysis",url:"maintain.analyse_friend"},
			{id:"M_Characteranalysis",url:"maintain.analyse_character"}
			
		],
		M_MANAGE:[
			{id:"M_Station",url:"wdashboard.summary_station"},
			{id:"M_Modeanalysis",url:"maintain.analyse_type"},
			{id:"M_Applyanalysis",url:"maintain.analyse_application"},
			{id:"M_Roamanalysis",url:"soon.soon"},
			{id:"M_Securityanalysis",url:"soon.soon"},
		],
		M_YUNWEIHU:[
			{id:"M_VisitStatus",url:"networkanalysis.index"},
			// {id:"M_Jumpanalysis",url:"soon.soon"},
		],
		M_MAINTAIN:[
			{id:"M_Unnormal",url:"maintain.maintain"},
			{id:"M_Order",url:"maintain.commandline"},
			{id:"M_Version",url:"maintain.versionMaintain"},
			{id:"M_Wechat",url:"maintain.pubmessage"},
			{id:"M_uploadfile",url:"maintain.uploadfile"}
		]
	}
}
