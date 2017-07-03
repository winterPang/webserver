$.MyLocale_cn = {
    Lang: "cn",

    // global text
    Yes: "是",
    No: "否",
    ON: "开启",
    OFF: "关闭",
    START: "启动",
    STOP: "停止",
    ACTIVE: "生效",
    INACTIVE: "不生效",
    EMPTY:"",
    PERMIT: "允许",
    DENY: "拒绝",
    SUCCESS: "成功",
    FAIL: "失败",
    STATIC: "静态",
    DYNAMIC: "动态",
    Incoming: "入方向",
    Outgoing: "出方向",
    WAITING: "请稍候...",
    NO_PRIVILEGE: "权限不足，不能执行当前的操作。",
    SET_SUCCESS: "设置成功",
    SAVING: "正在保存配置...", 
    SAVE_SUCCESS: "保存配置成功。",
    SAVE_CONFIRM: "确定要保存设备的当前配置吗？",
    LOGOUT_CONFIRM: "确定要退出登录吗？",
    SKIP_CONFIRM: "仍有修改未保存，可点击<span class='dlg-save'></span>保存或点击<span class='dlg-cancel'></span>取消。是否放弃修改并离开本页面？",
    DELETE_CONFIRM: "确定要删除选中的数据吗？",
    CLEAR_CONFIRM: "确定要清除%s吗？",
    CLEARALL_CONFIRM: "确定要清除所有数据吗？",
    TIMEOUT: "已超时，请重新登录。",
    DISCONNECT: "与设备的连接已断开，请检查网络是否连通，HTTP或HTTPS服务是否正在运行。",
    JSON_ERR: "获取的数据错误",
    ALERT_TITLE: "提示",
    ERROR_TITLE: "错误",
    CONFIRM_TITLE: "确认提示",
    WARNING_TITLE: "警告",
    CUR_DATETIME: "%d 天 <span class='devices-line'>|</span> %s : %s : %s",
    MENU_NONE: "Sorry. You have no right to do any operation.Redirecting to the login page...",
    NOUSE:"未引用",
    INUSE:"引用",
    VRF_PUBLIC:"公网",
    USER_DEFINED:"用户自定义",
    PRE_DEFINED:"系统预定义",
    AUTO:"自动",
    DAY: "天",
    DATAINFO:"共<em class='data-count'>0</em>条数据，已选中<em class='selected-count'>0</em>",

    ErrCode_WeiXin:{
        9002001:"不合法的请求方式",
        9002002:"系统异常",
        9002003:"网络异常，后台服务超时，请稍后再试",
        9002004:"后台服务调用异常",
        9002005:"签权失败",
        9002006:"未开通微信连Wi-Fi连插件",
        9002007:"缺少参数",
        9002008:"不合法的参数",
        9002009:"门店ID不存在",
        9002010:"ssid和密码均未以大写字母“WX”开头，两者中至少有一个以“WX”开头才可添加设备成功",
        9002011:"ssid不能包含中文字符",
        9002012:"password不能包含中文字符",
        9002013:"password必需大于8个字符",
        9002014:"门店下设备的密码不一样",
        9002015:"门店下设备不属于同一SSID",
        9002016:"设备已添加过",
        9002017:"设备不存在,无法删除",
        9002018:"门店下有专业设备，不能设置顶部常驻入口",
        9002019:"门店下没有设备",
        9002020:"未认证的账号不能设置商家主页",
        9002022:"门店下已添加非密码型设备，无法再添加密码型设备",
        9002023:"未认证公众账号不能获取",
        9002024:"该账号下没有密码型设备",
        9002025:"该账号下的所有设备，只有全为密码型设备才能获取",
        9002026:"查询列表超过最大限制",
        9002027:"门店下是非密码型设备，不能下载二维码",
        9002028:"门店下已添加非portal改造型设备",
        9002029:"非第三方授权不能获取",
        9002030:"未开通注册portal型设备",
        9002031:"保留现有连网方式的门店，不支持扫二维码方式连网，无法下载二维码",
        9002032:"必需全部设备均为使用微信方式连网才可以获取",
        9002033:"该账号下无设备，至少有一台设备才能获取",
        9002034:"该账号下有专业设备，无法获取",
        9002035:"保留现有连网方式的门店，无法清除门店网络及设备",
        9002037:"portal型设备只能修改ssid",
        9002038:"ssid必须以大写字母“WX”开头",
        9002039:"门店下无网络信息，无法进行修改",
        9002040:"专业型设备的门店，不支持修改网络信息",
        9002041:"未认证的账号不能设置",
        9002042:"保留现有连网方式的门店，不支持设置连网完成页",
        9007001:"门店下的ssid重复",
        9007003:"与门店下的设备类型不一致",
        9007004:"找不到门店ssid信息",
        9007005:"门店下不同的ssid门店信息数量已超过最大限制",
        9007006:"无协议设备的门店，不支持下载二维码",
        9007007:"专业型设备的门店，不支持下载二维码",
        9008001:"找不到卡券",
        9008002:"投放时间超过卡券有效期"
    },
    mainFrame:
    {
        lougout_label: "注销",
        system_manage:"系统管理",
        password_label: "修改密码",
        online_service: "在线客服",
        lvzhou_forum:"绿洲论坛",
        back_home:"返回首页",
        username_label: "用户：",
        language_label: "语言",
        save_label:    "保存",
        runing_label: "系统已运行：",
        running_time: "0 天 4 小时 24 分钟 31 秒"
    },
    shotcutTip:
    {
        tbarUser: "用户信息",
        tbarSave: "保存",
        tbarLogout: "退出"
    },
    Buttons:
    {
        ADD:    "添加",     OK:     "确定",
        DEL:    "删除",     CANCEL: "取消",
        BATCHDEL: "删除",DETAIL:"详情",
        REBOOT: "重启" ,DOWNLOAD:"下载",
        MDF:    "修改",     YES:    "是",
        FILTER: "高级查询", NO:     "否",
        COPY:   "复制",     CLOSE:  "关闭",
        OPEN:   "新窗口",   RESET:  "重置",
        CLEAR:  "清除",     PRE:    "上一步",
        SEARCH: "查询",     NEXT:   "下一步",
        INSERT: "插入",     FINISH: "完成",
        STOP:   "停止",     SELECTALL:"全部选中",
        UP:     "Up",       SELECTNONE:"全部取消",
        DOWN:   "Down",     REFRESH: "刷新",
        ACTION: "操作",     SAVE:    "确定并保存",
        UPGRADE: "升级",    IMPORT: "导入门店"
    },
    panel:
    {
        Warning:            "告警信息"
        ,Error:             "错误信息"
        ,APCount:           "AP数量："
        ,APOff:             "AP离线"
        ,OffAP:             "离线AP："
        ,OffInfor:          "%name（离线时间：%time）"
        ,State:             "状态："
        ,Account:           "用户："
        ,Connected:         "已连接"
        ,CloudOff:          "云用户未登录"
        ,NetOff:            "无 Internet 访问"
    	,view: 			    "查看"
    	,close: 			"关闭"
    	,serial: 		    "序列号："
    	,bootrom: 		    "Bootrom版本："
    	,hardware: 		    "硬件版本："
    	,software: 		    "软件版本："
    	,used: 			    "使用"
    	,free: 			    "剩余"
        ,memory:            "内存"
        ,APName:            "AP名称"
        ,IPAddr:            "IP地址"
        ,StaNum:            "在线终端"
        ,APNone:            "连接中断"
    },
    Upload:
    {
        EMPTY: "请选择一个文件",
        FILETYPE: "请选择扩展名为%s的文件"
    },
    Toggle:
    {
        show: "隐藏高级设置...",
        hide: "显示高级设置..."
    },
    SingleSelect:
    {
        CHOOSE: "请选择...",
        NoMatches:"未找到匹配结果"
    },
    MultiSelect:
    {
        MOVEALL: "选择所有",
        CANCELALL: "取消所有",
        Filter: "筛选",
        Candidate:"待选项",
        Selected:"已选项"
    },
    Wizard:
    {
	    Previous:"上一步",
	    Next:"下一步",
	    Finish:"完成"
    },
    MList:
    {
        emptyrecords: "没有数据",
        operation: "操作",
        selectAll: "全选切换",
        icons:
        {
            search:"查询",
            advsch:"高级查询",
            add:"添加",
            mdf:"修改",
            del:"删除",
            insert:"插入",
            voice:"语音",
            reboot:"重启",
            move:"移动",
            upload:"上传文件",
            download:"下载文件",
            start:"开始",
            stop:"停止",
            lock:"锁定",
            adv:"高级配置",
            disconnect:"断开连接",
            up:"已连接",
            down:"已断开",
            fax:"传真",
            bind:"绑定"
        },
        search : 
        {
            SEARCH: "查询",
            RESET: "重置",
            KEY:"",
            VALUE:"",
            QUERY_ADVANCE : "高级查询",
            QUERY_EQUAL : "等于",
            QUERY_NOTEQUAL : "不等于",
            QUERY_MORETHAN : "大于",
            QUERY_LESSEQUAL : "不大于",
            QUERY_LESSTHAN : "小于",
            QUERY_MOREEQUAL : "不小于",
            QUERY_BEGINWITH : "始于",
            QUERY_NOTBEGINWITH : "不始于",
            QUERY_ENDWITH : "止于",
            QUERY_NOTENDWITH : "不止于",
            QUERY_INCLUDE : "包含",
            QUERY_EXCLUDE : "不包含",
            QUERY_INRANGE : "介于",
            QUERY_OUTOFRANGE : "不介于",
            QUERY_AND : "与",
            QUERY_OR : "或",
            QUERY_MATCHCASE : "区分大小写",
            QUERY_RESULT : "在结果中查询"
        },
        Page:
        {
            desc: "当前：%d~%d条，共%d条，每页显示%s条",
            FIRST : "首页",
            PREV : "上一页",
            NEXT : "下一页",
            LAST : "尾页",
            GO : "跳转"
        },
	    Edittable:
	    {
            info: "（最多%s个）"
	    }
    },
    TimeZoon:
    {
        AbuDhabi:"阿布扎比，马斯喀特",
        Adelaide:"阿德莱德",
        Alaska:"阿拉斯加",
        Almaty:"阿拉木图，新西伯利亚",
        Amman:"安曼",
        Amsterdam:"阿姆斯特丹，柏林，伯尔尼，罗马，斯特哥尔摩，维也纳",
        Arizona:"亚利桑那",
        Asuncion:"亚松森",
        Athens:"雅典，贝鲁特，伊斯坦布尔，明斯克",
        AtlanticTime:"大西洋时间(加拿大)",
        Astana:"阿斯塔纳，达卡",
        Auckland:"奥克兰，惠灵顿",
        Baghdad:"巴格达",
        Baku:"巴库，第比利亚，埃里温",
        Bangkok:"曼谷，河内，雅加达",
        Beijing:"北京，重庆，香港特别行政区，乌鲁木齐",
        Belgrade:"贝尔格莱德，布拉迪斯拉发，布达佩斯，卢布尔雅那，布拉格",
        Bogota:"波哥大，利马，基多",
        Brasilia:"巴西利亚",
        Brisbane:"布里斯班",
        Brussels:"布鲁塞尔，哥本哈根，马德里，巴黎",
        BuenosAires:"布宜诺斯艾利斯",
        Bucharest:"布加勒斯特",
        Cairo:"开罗",
        Canada:"中部时间(美国和加拿大)",
        CapeVerde:"佛得角群岛",        
        Caracas:"加拉加斯",
        Casablanca:"卡萨布兰卡，蒙罗维亚，雷克雅未克",
        Cayenne:"卡宴",
        Chennai:"钦奈，马德拉斯，加尔各答，孟买，新德里",
        Chihuahua:"奇瓦瓦，拉巴斯，马萨特兰",
        Darwin:"达尔文",
        EasternTime:"东部时间(美国和加拿大)",
        Ekaterinburg:" 叶卡捷琳堡",
        Fiji:"斐济，堪察加半岛，马绍尔群岛",
        Georgetown:"乔治敦，拉巴斯，圣胡安",
        Greenland:"格陵兰",
        Guadalajara:"瓜达拉哈拉，墨西哥城，蒙特雷",
        Guam:"关岛，莫尔兹比港",
        Harare:"哈拉雷，比勒陀利亚",
        Hawaii:"夏威夷",
        Helsinki:"赫尔辛基，基辅，里加，索菲亚，塔林，维尔纽斯",
        Hobart:"霍巴特",
        Indiana:"印第安那州(东部)",
        International:"国际日期变更线西",
        Irkutsk:"伊尔库茨克，乌兰巴托",
        Jerusalem:"耶路撒冷",
        Jayawardenepura:"斯里加亚渥登普拉",
        Kabul:"喀布尔",
        Kathmandu:"加德满都",
        Kuwait:"科威特，利雅得",
        Krasnoyarsk:"克拉斯诺亚尔斯克",
        LaPaz:"拉巴斯",
        Lisbon:"格林威治标准时间:都柏林，爱丁堡，伦敦，里斯本",
        Magadan:"马加丹，索罗门群岛，新喀里多尼亚",
        Manaus:"玛瑙斯",
        Melbourne:"堪培拉，莫尔本，悉尼",
        MidAtlantic:"中大西洋",
        MidwayIsland:"中途岛，萨摩亚群岛",
        Montevideo:"蒙得维的亚",
        Moscow:"莫斯科，圣彼得堡，伏尔加格勒",
        Nairobi:"内罗华",
        Newfoundland:"纽芬兰",
        Nuku:"努库阿洛法",
        PacificTime:"太平洋时间",
        PortLouis:"路易港",
        Perth:"珀斯",
        Petropavlovsk:"彼得罗巴甫洛夫斯克-勘察加",
        Rangoon:"仰光",
        Santiago:"圣地亚哥",
        Sarajevo:"萨拉热窝，斯科普里，华沙，萨格勒布",
        Saskatchewan:"萨斯喀彻温",       
        Seoul:"首尔",
        Singapore:"吉隆坡，新加坡",
        Taipei:"台北",
        Tashkent:"伊斯兰堡，卡拉奇，塔什干",
        Tbilisi:"第比利斯",
        Tehran:"德黑兰",
        Tijuana:"蒂华纳，下加利福尼亚州",
        Tokyo:"大坂，札幌，东京",
        US:"中美洲",       
        UsCanada:"山地时间(美国和加拿大)",
        Vladivostok:"符拉迪沃斯托克",
        WestCentralAfrica:"中非西部",
        Windhoek:"温德和克",
        Yakutsk:"雅库茨克"
    },
    Validator:
    {
        required: "该参数必须配置。",
        url: "参数输入错误。",
        date: "参数输入错误。",
        number: "参数输入错误。",
        ip:"请输入正确的IPv4或者IPv6地址。",
        ipv4:"IPv4地址输入错误。",
        ipv6:"IPv6地址输入错误。",
        mask:"IPv4地址掩码输入错误。",
        text: "不能以空格或制表符开头，且不能包含“？”。",
        string: "不能包含“?”。",
        nulls: "参数不能为空或空格",
        astring: "输入参数必须以字母开头。",
        mac: "MAC地址输入错误。",
        digits: "请输入整数。",
        vlanlist: "参数输入错误。",
        equalTo: "参数输入错误。",
        maxlength: "参数输入错误。",
        minlength: "参数输入错误。",
        rangelength: "参数输入错误。",
        range: "参数输入错误。",
        max: "参数输入错误。",
        min: "参数输入错误。",
        except: "输入参数不能包含%s。",
        defmsg: "参数输入错误。",
        chinesexist: "参数长度错误，1个汉字或中文符号需要占用2个字符空间，请确认输入字符是否超出长度限制。",
        Tip:
        {
            strRange:"%s－%s个字符",
            intRange:"%s－%s"
        }
    },
    Datepicker:
    {
        closeText: '关闭',
        prevText: '&#x3c;上月',
        nextText: '下月&#x3e;',
        currentText: '今天',
        monthNames: ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
        monthNamesShort: ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
        dayNames: ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'],
        dayNamesShort: ['周日','周一','周二','周三','周四','周五','周六'],
        dayNamesMin: ['日','一','二','三','四','五','六'],
        weekHeader: '周',
        yearSuffix: '',
        applyLabel: '应用',
        cancelLabel: '取消',
        fromLabel: '开始',
        toLabel: '结束',
    },
    datetimepicker:
    {
        days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
        daysShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六", "周日"],
        daysMin:  ["日", "一", "二", "三", "四", "五", "六", "日"],
        months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        monthsShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        today: "今日"
    },
    Menu:{
        HELP: "帮助"
        ,Device_Name : "H3C绿洲云平台"
        ,M_System:"概览"
        ,M_Dashboard:"设备概览"
        ,M_ClientInfor:"终端信息"
        ,M_RateAnalyse:"流量分析"
        ,M_DeviceInfor:"设备信息"
        ,M_NetworkInfor:"网络信息"
        ,M_LogWaring:"告警日志"
        ,M_FrameTest:"框架测试"
        ,M_QuickNav:"数据分析"
        ,M_MonProbe:"访客数据"
        
	,M_Probe:"概览"
        ,M_Detail:"访客分析"
        ,M_MonDPI:"应用分析"
		,M_DPI:"概览"
        ,M_Url:"网站统计"
        ,M_App:"应用统计"
        ,M_MonNatDetect:"私接代理"
        ,M_MonConfig:"安全策略"
       // ,M_Cooperation:"合作应用"
        ,M_WirelessConf:"无线配置"
        ,M_USERMANAGE:"用户管理"
        ,M_WeixinPublicmessage:"公众号"
        ,M_AUTH:"认证配置"
        ,M_Place:"场所管理"
        ,M_APPLYCONFIG:"无线定位"
        ,M_APPLYMANAGE:"网络地图"
    	,M_YinYunPeiZhi:"定位配置"
        ,M_YinYunGuanLi:"应用管理"
        ,M_Map:"地图管理"
		,M_PDingWei:"无线定位"
		,M_GDingWei:"无线定位"
        ,M_MANAGE:"应用管理"
        ,M_AUTHTEMPLATE:"认证模板"
        ,M_PAGETEMPLATE:"页面模板"
        ,M_MANAGE:"发布管理"
        ,M_TOTAL:"命令助手"
        ,M_ADTOTAl:"广告统计"
        ,M_AppStatistics:"数据维护"
        ,M_LOGWARNING:"维护日志"
        ,M_CHATSTORE:"微信门店"
        ,M_WEIXINWARNING:"微信告警"
        ,M_FAULTLOG:"认证故障日志"
        ,M_HealthHistory:"网络体检"
        ,M_NetMap:"网络地图"
        ,M_WipsConfig:"无线安全"
        ,M_TerminalTrial:"终端轨迹"
        ,M_UpdateVersion:"软件升级"
        ,M_UpdateVersionV3:"软件升级三期"
        ,M_Reboot:"设备重启"
        ,M_DeepCheck:"深度体检"
        ,M_RadioMeasure:"终端测量"
        ,M_FileSystem:"文件系统"
        ,M_ConfigRestore:"配置还原"
        ,M_RemoteConnection:"远程连接"
        ,M_APPConfig:"应用配置"
        ,M_NetHotImg:"网络热图"



        ,W_DDetail:"认证管理"
        ,W_WeiXinPublic:"微信公众号"
        ,W_WeiXinMessage:"微信消息"
        ,W_WeixinHome:"微信商家主页"
        ,W_WeiXinShop:"微信门店"        
        ,W_SystemInfo:"行业ACSystem"
        ,W_EquipmentManage:"设备管理"
        ,W_NetConfigure:"网络配置"
        ,W_FragConfigure:"片段配置"
        ,W_AlarmEvents:"告警事件"
        ,W_Total:"用户概览"
        ,W_OnlineUser:"在线用户"
        ,W_HisUser:"历史明细"
        ,W_GuestList:"访客列表"
        ,W_Summary:"设备概览"
        ,W_FastPublish:"快速发布"
        ,W_AuthCfg:"认证设置"
        ,W_PageModel:"页面模板"
        ,W_ReleaseManage:"发布管理"
        ,W_PublishManage:"发布管理"
        ,W_SiteManage:"场所管理"
        ,W_SMSConfigure:"短信设置"
        ,W_OperationLog:"操作日志"
        ,W_ChangePassword:"修改密码"
        ,W_SysSetUP:"系统设置"
        ,W_APs:"AP信息"
        ,W_ServiceTemplate:"无线服务"
        ,W_WlanClients:"无线终端"
        
        
        ,X_xSystem:"网络概览"
        ,X_xDeviceInfo: "设备信息"
        ,X_xDeviceManage:"设备管理"
        ,X_xNetworkCfg:"无线配置"
        ,X_xDataStatics:"数据统计"
        ,X_xAlermEvent:"告警记录"
        ,X_xFastPublish:"快速发布"
        ,X_xAuthCfg:"认证设置"
        ,X_xPageModel:"页面模板"
        ,X_xPublishManage:"发布管理"
        ,X_xWeiXinPublic:"微信公众号"
        ,X_xWeiXinMessage:"微信消息"
        ,X_xWeixinHome:"微信商家主页"
        ,X_xWeiXinShop:"微信门店"
        ,X_xUserFlowStat:"客流统计"
        ,X_xCustomerStat:"宾客统计"
        ,X_xProbe:"概览"
        ,X_xDetail:"访客分析"
        ,X_xAdAnalysis:"广告分析"
        ,X_xMonDPI: "网站统计"
        ,X_xDPI: "概览"
        ,X_xUrl: "网站统计"
        ,X_xApp: "应用统计"
        ,X_xNetSummary:"网络概览"
        ,X_xClientInfo:"终端信息"
        ,X_xAlert:"告警事件"
        ,X_xAuthMolde:"认证模板"
        ,X_xmaintainLog:"维护日记"
        ,X_xTrusteeship:"微信托管"
        ,X_xRelateId:"微信公众号"
        ,X_xBackUp: "云备份"
        ,X_xAdvertManage: "广告编辑"
        ,X_xRateLimit:"宾客限速"
        ,X_xAPPConfig:"应用配置"

        /*跨场所*/
        ,A_aIndex: "数据分析"
        ,A_mIndex: "运维监控"
        ,A_dIndex: "连锁部署"


        ,F_Dashboard:"概览"
        ,F_DeviceInfo:"设备信息"
        ,F_ApInfo:"AP信息"
        ,F_TerminalInfo:"终端信息"
        ,F_WlanSerInfo:"无线服务"
        ,F_ApSet:"服务绑定"
        ,F_WlanSer:"服务配置"
        ,F_DevMan:"设备管理"
        ,F_DeviceManage:"设备管理"
        ,F_SerAnalysis:"安全分析"
        ,F_HealthAnalysis:"体检分析"
        ,F_TerminAnalysis:"终端分析"
        ,F_AppAnalysis:"应用分析"
        ,F_WireSet:"无线配置"
        ,F_AppSet:"应用配置"
        ,F_SoftUp:"软件升级"
        ,F_Terminmeter:"终端测量"
        ,F_Order:"命令助手"
        ,F_MainLog:"维护日志"
        ,F_UpdateVersion:"软件升级"

        ,C_Summary:"课堂统计"
        ,C_Classroom:"电子课堂"
        ,C_Bracelet:"手环监控"
        ,C_ClassInfor:"手环管理"
        ,C_NetInfor:"手环管理"
        ,C_CampusDashboard:"校园概览"
        ,C_CampusParents:"个人概览"
	,C_ClassDashboard:"班级概览"
        ,C_StudentManage:"学生管理"
        ,C_ClassManage:"班级管理"
        ,C_TypicalBuild:"典型建筑"
        ,C_StudentHealth:"健康管理"
        ,C_StudentTrace:"学生追踪"
        ,C_ClassLive:"课堂管理"
        ,C_ClassStatics:"课堂管理"
        ,C_ClassHour: "课堂情景"
        ,C_StuAnalysis:"学生分析"
        ,C_Message:"消息订阅"
        ,C_IOTInfo:"IOT信息"
        ,C_ModuleManage:"模块管理"
	,C_camera:"摄像头管理"
	,C_Sensor:"传感器配置"
 ,C_SchoolSafe:"校园安全"
        ,C_NetInfor:"网络信息"
    },
		PhoneVender:{
		"apple":{name:"苹果"},
		"mx":{name:"魅族"},
		"meizu":{name:"魅族"},
		"samsung":{name:"三星"},
		"mi":{name:"小米"},
		"htc":{name:"HTC"},
		"zte":{name:"中兴"},
		"motorola":{name:"摩托罗拉"},
		"sony":{name:"索尼"},
		"nokia":{name:"诺基亚"},
		"lenovo":{name:"联想"},
		"t-touch":{name:"天语"},
		"lg":{name:"LG"},
		"huawei":{name:"华为"},
		"haier":{name:"海尔"},
		"hisense":{name:"海信"},
		"asus":{name:"华硕"},
		"blackberry":{name:"黑莓"},
		"bird":{name:"波导"},
		"alcatel":{name:"阿尔卡特"},
		"oppo":{name:"OPPO"},
		"koobee":{name:"酷比魔方"},
		"tcl":{name:"TCL"},
		"hp":{name:"惠普"},
		"coolpad":{name:"酷派"},
		"vivo":{name:"VIVO"},
		"lumia":{name:"Lumia"},
		"honor":{name:"荣耀"},
		"letv":{name:"乐视"},
		"nubia":{name:"努比亚"},
		"oneplus":{name:"一加"},
		"iuni":{name:"IUNI"},
		"philips":{name:"飞利浦"},
		"google":{name:"谷歌"},
		"changhong ":{name:"长虹"},
		"microsoft":{name:"微软"},
		"doov":{name:"朵唯"},
		"teclast":{name:"台电"},
		"onda":{name:"昂达"},
		"dell":{name:"戴尔"},
		"ramos":{name:"蓝魔"},
		"chuwi":{name:"驰为"},
		"hasee":{name:"神舟"},
		"pipo":{name:"品铂"},
		"vido":{name:"原道"},
		"voyo":{name:"VOYO"},
		"toshiba":{name:"东芝"},
		"acer":{name:"宏碁"},
		"viewsonic":{name:"优派"},
		"remix":{name:"REMIX"},
		"pioneer":{name:"先锋"},
		"amazon":{name:"亚马逊"},
		"kupa":{name:"KUPA"},
		"others":{name:"其他"}
	}
}
