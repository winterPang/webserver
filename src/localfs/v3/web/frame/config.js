var MyConfig = 
{
	name: "v7-web-config",
	ver: "7.54.2.08131800",
	root: "../../web/",  // 网管的静态URL的根目录，即web目录
	path: "/v3",  // Ajax请求一级路由
	v2path:"/v3/ace/oasis/auth-data/o2oportal", // Ajax请求一级路由 v2路由
	authError:"用户权限不足",
	httperror:"模块名:" ,//ajax error http请求错错误
	responseWidth: 800, // if the window width is less it, the layout of the page will be changed.
	Layout:
	{
		enable: false,
		width1: 768,
		width2: 980,
		width3: 1100
	},
	titleSeperator: " | ",
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
	}
}
