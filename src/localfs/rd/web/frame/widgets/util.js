/*******************************************************************************
 Copyright (c) 2007, Hangzhou H3C Technologies Co., Ltd. All rights reserved.
--------------------------------------------------------------------------------
@FileName:libs/frame/util.js
@ProjectCode: Comware v7
@ModuleName: Frame.Util
@DateCreated: 2011-07-27
@Author: lixiulan 06658
@Description:
    定义公用接口
@Modification:
*******************************************************************************/

;(function($F)
{

var Util = {

/*****************************************************************************
@FuncName: public,Frame.Util.generateID
@DateCreated: 2011-08-15
@Author: huangdongxiao 02807
@Description: 生成一个唯一ID字符串。部分控件在生成HTML时需要指定一个ID，但该ID不需要向页面公开，
    此时可以使用该接口生成一个ID在内部使用。
@Usage:
        var sId = Frame.Util.generateID("mydiv");
        var sHtml = "<div id="+sId+">my div</div>";
@ParaIn:
    * sPrefix - string, ID前缀，建议使用控件名称。
@Return: 无
@Caution:
@Modification:
    * yyyy-mm-dd: Author, add or modify something
*****************************************************************************/
generateID:function(sPrefix)
{
    sPrefix = sPrefix||"webid";

    return sPrefix+"_"+(""+Math.random()).substring(2);
},


/*****************************************************************************
@FuncName: public,Frame.Util.toText
@DateCreated: 2012-05-04
@Author: huangdongxiao 02807
@Description: 转换HTML格式的字符为文本字符, 可以在页面中正确显示HTML的标签和空格等特殊字符。
    <p>不支持换行显示，文本中的回车换行将被视为空格处理。即\r\n会被转换为空格。
@Usage:
    var sText = "abc<b>b</b>, space:       -            end";

    // 显示结果有标签和多个空格："abc<b>b</b>, space:       -           end"
    $("#myid").html(Frame.Util.toText(sText));

    // 显示结果没有标签且多个空格的地方只显示一个："abcb, space: -  end"
    $("#myid").html(sText);
@ParaIn:
    * sHtml - String, 需要转换的HTML字符串。
@Return: 无
@Caution:
@Modification:
    * yyyy-mm-dd: Author, add or modify something
*****************************************************************************/
toText: function(sHtml)
{
    return sHtml.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/[\t\r\n]/g," ").replace(/  /g,"&nbsp; ");
},

/*****************************************************************************
@FuncName: public,Frame.Util.toSpeedStr
@DateCreated: 2012-05-04
@Author: huangdongxiao 02807
@Description: 转换端口的速率为显示的字符串: 0-Auto, <1000, xxx K, <1000000 - xxx M, else xxx G
@Usage:
@ParaIn:
    * sHtml - String, 需要转换的HTML字符串。
@Return: 无
@Caution:
@Modification:
    * yyyy-mm-dd: Author, add or modify something
*****************************************************************************/
toSpeedStr: function(nSpeed)
{
    var k = nSpeed;
    var s = "";

    if(undefined == k)
    {
        return "";
    }

    else if(k>1000000)
    {
        s = (k/1000000) + "G";
    }
    else if(k>1000)
    {
        s = (k/1000) + "M";
    }
    else if(k>0)
    {
        s = k + "K";
    }
    else // k == 0
    {
        s = "Auto";
    }

    return s;
},

/*****************************************************************************
@FuncName: public,Frame.Util.getPortList
@DateCreated: 2012-11-12
@Author: huangdongxiao 02807
@Description: 根据Netconf返回的PortList串，获取有具体意义的端口字符串。如端口名串、ifindex串等
@Usage:
    var sPortName = "Eth0/1/2.2";
    var sSortName = Frame.Util.toPortStr(sPortName);
    // 先获取数据
    Frame.SRequest.getInstance("get", "all")
        .appendNode("MAC")
            .appendNode("MacUnicastTable").parent()
            .appendNode("MacGroupTable").root()
        .appendNode("Ifmgr").appendNode("Ports").appendNode("Port").appendColumn("IfIndex,PortIndex,AbbreviatedName").root()
    .get(myCallback,"I_MAC_Summary");

    // 回调函数中拼装数据，这里是使用接口的缩写。
    function myCallback()
    {
        var i;
        var oPortList = {};
        if(this.MAC)
        {
            var oMac = this.MAC || {};
            var aMAC = oMac.MacUnicastTable || [];
            var aGroupMac = oMac.MacGroupTable || [];
            var aPort = this.Ifmgr.Interfaces;

            for(i=0;i<aPort.length;i++)
            { 
                oPortList[aPort[i].IfIndex] = aPort[i].Name;
            }
            for(i=0;i<aMAC.length;i++)
            {
                aMAC[i].id = "mac_"+i;
                aMAC[i].PortName = aMAC[i].PortIndex ? oPortList[aMAC[i].PortIndex] : aMAC[i].NickName;
            }
            for(i=0; i<aGroupMac.length; i++)
            {
                aGroupMac[i].id = "gmac_"+i;
                aGroupMac[i].PortName = Frame.Util.getPortList(aPort, "AbbreviatedName", aGroupMac[i].PortList);
                aMAC.push(aGroupMac[i]);
            }

            Frame.MList.refresh(LIST_NAME, aMAC);
        }
    }
    
@ParaIn:
    *aPort, Array,  从接口管理表中取的接口数组。由于不同模块用到的数据不同，因此由各模块获取端口列表数据
    *sKey, String, 接口的属性名。接口数据是一个对象，本参数指定要返回哪一个属性拼成的串。
    *sPortList, String, NetConf的PortList类型的十六进制字符串，格式为"ABCDEF123456"
@Return: String
@Caution:
@Modification:
    * yyyy-mm-dd: Author, add or modify something
*****************************************************************************/
getPortList: function(aPort, sKey, sPortList)
{
    function getNameByChar(nFrom, ch, aName)
    {
        var nVal = parseInt(ch, 16);
        var aLog = [];
        for(var i=0; i<4; i++)
        {
            if(nVal&0x8)
            {
                aLog.push(nFrom*4+i);
                aName.push(aPort[nFrom*4 + i][sKey]);
            }
            nVal = 0xF&(nVal<<1);
        }
    }

    var aName = [];
    var nCount = sPortList.length; 
    for(var i=0; i<nCount; i++)
    {
        getNameByChar(i, sPortList.charAt(i), aName);
    }
    return aName.join(',');
},

/*****************************************************************************
@FuncName: public,Frame.Util.toPortStr
@DateCreated: 2012-11-12
@Author: huangdongxiao 02807
@Description: 转换端口名为一个定长的字符串, 用于比较大小。
@Usage:
    var sPortName = "Eth0/1/2.2";
    var sSortName = Frame.Util.toPortStr(sPortName);
@ParaIn:
    * sPortName - PortString, 需要转换的端口名，可以是全名，也可以是简名。如：Ethernet1/0/1, Eth1/0/1, Ten-GibitEthernet2/0/51:1
@Return: String
@Caution:
@Modification:
    * yyyy-mm-dd: Author, add or modify something
*****************************************************************************/
toPortStr: function(sPortName)
{
    var iftype = sPortName.replace(/([a-zA-Z\-]*)[0-9\/:.]*/,"$1");
    var ifnumber = sPortName.substring(iftype.length);
    var a=ifnumber.split(/[:./]/);
    for(var i=0; i<a.length; i++)
    {
        a[i] = ("0000"+a[i]).substring(a[i].length);
    }
    return iftype+a.join('');
},

/*****************************************************************************
@FuncName: public,Frame.Util.IpStr2Integer
@DateCreated: 2012-11-12
@Author: huangdongxiao 02807
@Description: 转换IP地址字符串为一个整数。
@Usage:
    var sIp = "192.168.1.10";
    var nIp = Frame.Util.IpStr2Integer(sIp);

    // 几种转换结果
    Frame.Util.IpStr2Integer("255.255.255.255")==0xFFFFFFFF
    Frame.Util.IpStr2Integer("169.254.77.15")==0xa9fe4d0f
    Frame.Util.IpStr2Integer("1.1.1.1")==0x1010101
    Frame.Util.IpStr2Integer("0.0.0.1")==1
    Frame.Util.IpStr2Integer("0.0.0.0")==0
    Frame.Util.IpStr2Integer("255")==0
    Frame.Util.IpStr2Integer("2.3.3.62.54")==0
    Frame.Util.IpStr2Integer("269.354.77.15")==0
@ParaIn:
    * sIp - IpString, 点分十进制的IP地址字符串
@Return: String
@Caution:
@Modification:
    * yyyy-mm-dd: Author, add or modify something
*****************************************************************************/
IpStr2Integer: function(sIp)
{
    var arr = (sIp||"").split(".");
    var nIp = 0;
    var nTemp;

    if(4 != arr.length)
    {
        // 非法的IP地址
        return 0;
    }
    
    for(var i=0; i<4; i++)
    {
        nTemp = parseInt(arr[i], 10);
        if(nTemp > 255 || nTemp < 0)
        {
            return 0;
        }
        nIp = nIp*0x100 + nTemp;
    }
    return nIp;
},

/*****************************************************************************
@FuncName: public, Frame.Util.getLastVerdorNo
@DateCreated: 2011-8-5。
@Author: L06658。
@Description: 获取VendorType 的最后一位。更通用一点说就是获取以点分隔的字符串中的最后一段
@Usage:
    Frame.Util.getLastVerdorNo(sVendorType);
@ParaIn:
    * sVendorType- String, 完整的sysoid
@ParaOut:
@Return: String, VendorType 的最后一位
@Caution:
@Reference:
@Modification:
* 2011-08-05: 李秀兰, 提供 获取VendorType 的最后一位
*****************************************************************************/
getLastVerdorNo: function (sVendorType)
{
    var arr = sVendorType.split(".");
    return arr[arr.length-1];
},

getProtocalStr: function(nProtocalType)
{
    var aPrtl = {
        "0": "HOPOPT", // IPv6 逐跳选项
        "1": "ICMP", // Internet 控制消息
        "2": "IGMP", // Internet 组管理
        "3": "GGP", // 网关对网关
        "4": "IP", // IP 中的 IP（封装）
        "5": "ST", // 流
        "6": "TCP", // 传输控制
        "7": "CBT", // CBT
        "8": "EGP", // 外部网关协议
        "9": "IGP", // 任何专用内部网关（Cisco 将其用于 IGRP）
        "10": "BBN-RCC-MON", // BBN RCC 监视
        "11": "NVP-II", // 网络语音协议
        "12": "PUP", // PUP
        "13": "ARGUS", // ARGUS
        "14": "EMCON", // EMCON
        "15": "XNET", // 跨网调试器
        "16": "CHAOS", // Chaos
        "17": "UDP", // 用户数据报
        "18": "MUX", // 多路复用
        "19": "DCN-MEAS", // DCN 测量子系统
        "20": "HMP", // 主机监视
        "21": "PRM", // 数据包无线测量
        "22": "XNS-IDP", // XEROX NS IDP
        "23": "TRUNK-1", // 第 1 主干
        "24": "TRUNK-2", // 第 2 主干
        "25": "LEAF-1", // 第 1 叶
        "26": "LEAF-2", // 第 2 叶
        "27": "RDP", // 可靠数据协议
        "28": "IRTP", // Internet 可靠事务
        "29": "ISO-TP4", // ISO 传输协议第 4 类
        "30": "NETBLT", // 批量数据传输协议
        "31": "MFE-NSP", // MFE 网络服务协议
        "32": "MERIT-INP", // MERIT 节点间协议
        "33": "SEP", // 顺序交换协议
        "34": "3PC", // 第三方连接协议
        "35": "IDPR", // 域间策略路由协议
        "36": "XTP", // XTP
        "37": "DDP", // 数据报传送协议
        "38": "IDPR-CMTP", // IDPR 控制消息传输协议
        "39": "TP++", // TP++ 传输协议
        "40": "IL", // IL 传输协议
        "41": "IPv6", // Ipv6
        "42": "SDRP", // 源要求路由协议
        "43": "IPv6-Route", // IPv6 的路由标头
        "44": "IPv6-Frag", // IPv6 的片断标头
        "45": "IDRP", // 域间路由协议
        "46": "RSVP", // 保留协议
        "47": "GRE", // 通用路由封装
        "48": "MHRP", // 移动主机路由协议
        "49": "BNA", // BNA
        "50": "ESP", // IPv6 的封装安全负载
        "51": "AH", // IPv6 的身份验证标头
        "52": "I-NLSP", // 集成网络层安全性 TUBA
        "53": "SWIPE", // 采用加密的 IP
        "54": "NARP", // NBMA 地址解析协议
        "55": "MOBILE", // IP 移动性
        "56": "TLSP", // 传输层安全协议使用 Kryptonet 密钥管理
        "57": "SKIP", // SKIP
        "58": "IPv6-ICMP", // 用于 IPv6 的 ICMP
        "59": "IPv6-NoNxt", // 用于 IPv6 的无下一个标头
        "60": "IPv6-Opts", // IPv6 的目标选项
        //"61": "", //任意主机内部协议
        "62": "CFTP", // CFTP
        //"63": "", //任意本地网络
        "64": "SAT-EXPAK", // SATNET 与后台 EXPAK
        "65": "KRYPTOLAN", // Kryptolan
        "66": "RVD", // MIT 远程虚拟磁盘协议
        "67": "IPPC", // Internet Pluribus 数据包核心
        //"68": "", //任意分布式文件系统
        "69": "SAT-MON", // SATNET 监视
        "70": "VISA", // VISA 协议
        "71": "IPCV", // Internet 数据包核心工具
        "72": "CPNX", // 计算机协议网络管理
        "73": "CPHB", // 计算机协议检测信号
        "74": "WSN", // 王安电脑网络
        "75": "PVP", // 数据包视频协议
        "76": "BR-SAT-MON", // 后台 SATNET 监视
        "77": "SUN-ND", // SUN ND PROTOCOL-Temporary
        "78": "WB-MON", // WIDEBAND 监视
        "79": "WB-EXPAK", // WIDEBAND EXPAK
        "80": "ISO-IP", // ISO Internet 协议
        "81": "VMTP", // VMTP
        "82": "SECURE-VMTP", // SECURE-VMTP
        "83": "VINES", // VINES
        "84": "TTP", // TTP
        "85": "NSFNET-IGP", // NSFNET-IGP
        "86": "DGP", // 异类网关协议
        "87": "TCF", // TCF
        "88": "EIGRP", // EIGRP
        "89": "OSPFIGP", // OSPFIGP
        "90": "Sprite-RPC", // Sprite RPC 协议
        "91": "LARP", // 轨迹地址解析协议
        "92": "MTP", // 多播传输协议
        "93": "AX.25", // AX.25 帧
        "94": "IPIP", // IP 中的 IP 封装协议
        "95": "MICP", // 移动互联控制协议
        "96": "SCC-SP", // 信号通讯安全协议
        "97": "ETHERIP", // IP 中的以太网封装
        "98": "ENCAP", // 封装
        //"99": "", //任意专用加密方案 
        "100": "GMTP", // GMTP 
        "101": "IFMP", // Ipsilon 流量管理协议 
        "102": "PNNI", // IP 上的 PNNI 
        "103": "PIM", // 独立于协议的多播 
        "104": "ARIS", // ARIS 
        "105": "SCPS", // SCPS 
        "106": "QNX", // QNX 
        "107": "A/N", // 活动网络 
        "108": "IPComp", // IP 负载压缩协议 
        "109": "SNP", // Sitara 网络协议 
        "110": "Compaq-Peer", // Compaq 对等协议 
        "111": "IPX-in-IP", // IP 中的 IPX 
        "112": "VRRP", // 虚拟路由器冗余协议 
        "113": "PGM", // PGM 可靠传输协议 
        //"114": "", //任意 0 跳协议 
        "115": "L2TP", // 第二层隧道协议 
        "116": "DDX", // D-II 数据交换 (DDX) 
        "117": "IATP", // 交互式代理传输协议 
        "118": "STP", // 计划传输协议 
        "119": "SRP", // SpectraLink 无线协议 
        "120": "UTI", // UTI 
        "121": "SMP", // 简单邮件协议 
        "122": "SM", // SM 
        "123": "PTP", // 性能透明协议 
        "124": "ISIS", // over IPv4 
        "125": "FIRE", // 
        "126": "CRTP", // Combat 无线传输协议 
        "127": "CRUDP", // Combat 无线用户数据报 
        "128": "SSCOPMCE", // 
        "129": "IPLT", // 
        "130": "SPS", // 安全数据包防护 
        "131": "PIPE", // IP 中的专用 IP 封装 
        "132": "SCTP", // 流控制传输协议 
        "133": "FC" // 光纤通道 
    };
    return aPrtl[nProtocalType] || nProtocalType;
},

/*****************************************************************************
@FuncName: public, Utils.Base.sprintf
@DateCreated: 2011-07-27
@Author: lixiulan 06658
@Description: Format string, support%s, %d, %x
@Usage:
Utils.Base.sprintf("Sub slot%d is empty",31);  // Sub slot31 is empty
Utils.Base.sprintf("Sub slot %d abc","31abc");   // Sub slot 31 is empty
Utils.Base.sprintf("Sub slot %x is empty",31);   // Sub slot 1f is empty
Utils.Base.sprintf("Sub slot %X is empty","31abc");   // Sub slot 1F is empty
Utils.Base.sprintf("Sub slot %s is empty","31abc");   // Sub slot 31abc is empty
@ParaIn:
    * sFormat - string, String formater。
    * valuelist - void, formater value list。
@Return: Formattered string
@Caution:
@Modification:
    * yyyy-mm-dd: Author, add or modify something
*****************************************************************************/
sprintf: function (sFormat, valuelist)
{
    var sTemp;
    if (arguments.length == 1)
        return sFormat;

    var arrTmp = new Array();
    /**
     * 参数为一个字符串数组的形式
     */
    if ($.isArray(valuelist))
    {
        arrTmp = valuelist;
    }
    /**
     * 参数为多个字符串或数字的形式
     */
    else
    {
        for (var j=1; j<arguments.length; j++)
        {
            arrTmp[j-1] = arguments[j];
        }
    }

    var sRet = "";
    for ( var i=0; i<arrTmp.length; i++ )
    {
        var n = sFormat.indexOf("%");
        if ( n==-1 )
        {
            break;
        }
        sRet += sFormat.substring(0,n);
        var ch = sFormat.charAt(n+1);
        var sNewChar;
        switch ( ch )
        {
        case '%':
            sNewChar = "%";
            break;
        case 's':
            sNewChar = arrTmp[i];
            break;
        case 'x':
            sTemp = parseInt(arrTmp[i], 16).toString(16);
            sNewChar = sTemp.toLowerCase();
            break;
        case 'X':
            sTemp = parseInt(arrTmp[i], 16).toString(16);
            sNewChar = sTemp.toUpperCase();
            break;
        case 'd':
            sNewChar = parseInt(arrTmp[i], 10);
            break;
        default:
            sNewChar = "%"+ch;
            break;
        }

        sRet += sNewChar;
        sFormat = sFormat.substring(n+2);
    }
    sRet += sFormat;
    return sRet;
},

/*****************************************************************************
@FuncName: public,Frame.Util.osprintf
@DateCreated: 2011-07-27
@Author: h02807
@Description: 按照顺序格式化字符串, 需要格式化的部分使用{index}标记,index从0开始。
    sprintf只能按照变参的顺序依次填充，本函数可以按照格式化串中指定的顺序填充参数。
    <p>本函数不支持数据类型，所有的参数都按照字符串处理。
@Usage:
    Frame.Util.osprintf("Error for {1} of {0}", "PVID", "Eth0/1/1");
    // return "Error for PVID of Eth0/1/1"
@ParaIn:
    * sFormat - string, 格式信息字符串。
    * valuelist - void, 格式化的参数列表。
@Return: 无
@Caution:
@Modification:
    * yyyy-mm-dd: Author, add or modify something
*****************************************************************************/
osprintf:function(sFormat, valuelist)
{
    if (arguments.length == 1)
        return sFormat;

    var arrTmp;
    /**
     * 参数为一个字符串数组的形式
     */
    if ($.isArray(valuelist))
    {
        arrTmp = valuelist;
    }
    /**
     * 参数为多个字符串或数字的形式
     */
    else
    {
        arrTmp = [];
        for (var j=1; j<arguments.length; j++)
        {
            arrTmp[j-1] = arguments[j];
        }
    }

    var sRet = sFormat;
    for(var i=0; i<arrTmp.length; i++)
    {
        sRet = sRet.replace("{"+i+"}", arrTmp[i]);
    }
    return sRet;
},

/*****************************************************************************
@FuncName: public, Frame.Util.getHexColor
@DateCreated: 2014-09-29
@Author: Huangdongxiao 02807
@Description: Translate the color string to Hex-color-string
@Usage:
    Frame.Util.getHexColor("#abcdef"); // return "#abcdef"
    Frame.Util.getHexColor("rgb(171, 205, 239)");   // return "#abcdef"
@ParaIn:
    * sColor, string, RGB color string, or Hex color string
@Return: String, Hex color string, like "#abcdef"
@Caution:
@Modification:
    * yyyy-mm-dd: Auth, add or modify something
*****************************************************************************/
getHexColor: function (sColor)
{
    /*if ('#' == sColor.charAt(0))
    {
        return sColor;
    }*/

    // RGB string, like: rgb(171,252,123)
    if (! /^rgb\([0-9]{1,3},[ ]*[0-9]{1,3},[ ]*[0-9]{1,3}\)$/.test(sColor))
    {
        return false;
    }

    var aTemp = sColor.split(/[(,)]/);
    var r = parseInt(aTemp[1]).toString(16),
        g = parseInt(aTemp[2]).toString(16),
        b = parseInt(aTemp[3]).toString(16);
    return "#" + r + g + b;
},

/*****************************************************************************
@FuncName: public, Frame.Util.getPathUrl
@DateCreated: 2011-06-30
@Author: Huangdongxiao 02807
@Description: 获取绝对路径的URL串。在V7中由于使用ajax，因此在load页面时使用相对路径是从index.html开始计算的。
    但页面本身的路径和index.html并不在一起，让页面自己用 ../ 的方式去计算相对路径不容易理解，且不易维护。
    所以提供本接口统一处理路径。
    <p>本函数支持动态指定语言，可以使用[lang]代替URL中的语言部分
@Usage:
    var sUrl = "syslog/summary.js";
    var sAbsUrl = Frame.Util.getPathUrl(sUrl);

    // 带有语言的URL
    var sUrl = "syslog/[lang]/summary.html";
    var sAbsUrl = Frame.Util.getPathUrl(sUrl);

    // 错误的调用
    var sAbsUrl = Frame.Util.getPathUrl("syslog/[lang]/") + "summary.html";
    var sAbsUrl = Frame.Util.getPathUrl("syslog/[lang]") + "/summary.html";
@ParaIn:
    * sAction, string, URL信息字符串。URL规则:
    <LI>如果是以http(s)://或者/开头的绝对路径的URL则直接返回
    <LI>其它的URL则添加上根路径后返回
    <LI>必须是完整的URL串,不能是半截
@Return: String, 绝对路径的URL字符串
@Caution:
@Modification:
    * yyyy-mm-dd: Auth, add or modify something
*****************************************************************************/
getPathUrl: function(sAction)
{
    /*
    <LI>自定义的URL前缀(url::),此时获取url::后面的串为真实的URL
    <LI>自定义的JS前缀(js::), 此时获取js::后面的串为一个JS函数. 暂时不支持
    */
    var aUrl = sAction.split("::");
    var sUrl = sAction;
    if(aUrl.length>1)
    {
        switch(aUrl[0])
        {
        case "js":
            sUrl = null;    // 不支持
            break;
        case "url":
        default:
            sUrl = aUrl[1];
            break;
        }
    }
    else
    {
        sUrl = sAction;
    }

    if(null != sUrl)
    {
        // 如果设置了表态文件不缓存时需要在URL后增加一个随机数
        if(/\[lang\]/.test(sUrl))
        {
            sUrl = sUrl.replace("[lang]", Frame.get("lang"));
        }
        if(true!==MyConfig.config.cachePage)
        {
            sUrl += "?u="+Frame.get("rid");
        }

        // 如果是HTTP或者HTTPS开头的, 不需要处理
        if(/^https?:/.test(sUrl)) return sUrl;

        // 如果是绝对路径开头的(即以/开头), 不需要处理
        if("/"==sUrl.charAt(0)) return sUrl;

        var sRoot = MyConfig.root || "/";
        return sRoot+sUrl;
    }
},

/*****************************************************************************
@FuncName: public, Frame.Util.getDynUrl
@DateCreated: 2011-06-30
@Author: Huangdongxiao 02807
@Description: 获取动态URL的绝对路径串。动态URL和静态URL不是在一个根目录，可以通过该函数获取到一个相关动态URL的绝对路径。
<p>在V7中各页面全部使用XCMP下发，且XCMP已经封装了URL的下发，因此不需要也不应该关心动态URL。
只有在框架中或者特殊的页面中会用到。V7上支持的动态URL包括：
<ul>
    <LI>get.j, XCMP获取数据URL，已经封装在SRequest中
    <LI>set.j, XCMP下发数据URL，已经封装在SRequest中
    <LI>logout.j, 退出登录，框架使用
    <LI>menu.j, 显示菜单，框架使用
    <LI>reboot.j, 重启设备， 重启页面使用
    <LI>check.j, 检查设备能力，登录页面使用
    <LI>vcode.bmp, 显示验证码，登录页面使用
    <LI>login.j, 执行登录动作，登录页面使用
    <LI>file/upload.j, 文件上传URL，已经封装在Frame.FileMnger中
    <LI>file/download.j, 下载文件
    <LI>file/delete.j, 删除文件
    <LI>config/backup.j, 备份配置文件，配置管理页面使用
    <LI>config/restore.j, 恢复配置文件，配置管理页面使用
    <LI>config/export.j, 导出配置文件，配置管理页面使用
    <LI>keepalive.j, 超时检测，框架使用
</ul>
@Usage:
    var sDynUrl = Frame.Util.getDynUrl("login.j");
@ParaIn:
    * sUrl, String, 动态URL的相关对路径，即上面列出来的几种URL之一。如login.j, file/upload.j
@Return: String, 绝对路径的URL字符串
@Caution:
@Modification:
    * yyyy-mm-dd: Auth, add or modify something
*****************************************************************************/
getDynUrl: function (sUrl)
{
    var sDynUrl = MyConfig.root + "../wnm/" + sUrl;
    ////{{Demo start
    if(true === MyConfig.config.local) 
    {
        // 本地demo时使用php后缀
        sDynUrl = sDynUrl.replace(/\.j/, ".php");
    }
    ////}}Demo end

    var s = (-1==sDynUrl.indexOf('?')) ? '?' : '&';
    sDynUrl += s + "sessionid="+Frame.get("sessionid");

    return sDynUrl;
}

/*****************************************************************************
@FuncName: public, Frame.Util.extendAll
@DateCreated: 2013-10-12
@Author: Huangdongxiao 02807
@Description: Extend a JSON Data, which is a nesting object, to a simple object. 
    If exist the same proterty name, it will be recovered
@Usage:
    var oData = {
        p1: 1,
        p2: 2,
        p3: {a1: "aa", a2:"bb"}
    };

    var oNewData = {};
    Frame.Util.extendAll(oNewData, oData);
    // oNewData = {p1:1,p2:2,a1:"aa",a2:"bb"};
@ParaIn:
    * oNewData, Object, The resule object which is include all the proterty, It always is a empty object, eg: {}
    * oData, Object, a nesting object.
    * properties, String/Array, the extend properties, if not exist, extend all.
@Return: Object, the new Data, same as the first parameter.
@Caution:
@Modification:
    * yyyy-mm-dd: Auth, add or modify something
*****************************************************************************/
,extendAll: function(oNewData, oData, properties)
{
    if(undefined === properties)
    {
        for(var key in oData)
        {
            var sVarType = typeof(oData[key]);
            if(("string" == sVarType) || ("number" == sVarType) || ($.isArray(oData[key])))
            {
                oNewData[key] = oData[key];
            }
            if("object" == sVarType)
            {
                arguments.callee(oNewData, oData[key])
            }
        }
    }
    else
    {
        var aFields = ("string"==typeof(properties)) ? properties.split(",") : properties;
        for(var i=0; i<aFields.length; i++)
        {
            var key = aFields[i];
            if(undefined === oData[key])
            {
                continue;
            }

            var sVarType = typeof(oData[key]);
            if(("string" == sVarType) || ("number" == sVarType))
            {
                oNewData[key] = oData[key];
            }
            if("object" == sVarType)
            {
                arguments.callee(oNewData, oData[key], aFields);
            }
        }
    }
    return oNewData;
}

,parseStyle: function(sStyle)
{
    var oStyle = {};
    var aStyle = (sStyle||"").split(';');
    for(var i=0,k=aStyle.length; i<k; i++)
    {
        var s = $.trim(aStyle[i]);
        if(s)
        {
            var aTemp = aStyle[i].split(':');
            var sKey = $.trim(aTemp[0]).toLowerCase();
            var sVal = $.trim(aTemp[1]).toLowerCase();
            oStyle[sKey] = sVal;
        }
    }
    return oStyle;
}

/*****************************************************************************
@FuncName: public, Frame.Util.updateHtml
@DateCreated: 2013-10-12
@Author: Huangdongxiao 02807
@Description: Update the HTML page whith the new value, which is the properties in the object "oData".
    <b>Notice:</b> The HTML elements must have proterty "id", and the "id" is equal one of the property 
    in "oData". if no property is matched, skip it.
@Usage:
    // HTML
    <div id="MyDiv">
        <span id="p1"></span>
        <span id="p2"></span>
        <span id="a1"></span>
        <span id="a2"></span>
    </div>

    // JS
    var oData = {p1:1,p2:2,a1:"aa",a2:"bb"};
    Frame.Util.updateHtml($("#MyDiv"), oData);

    // only update "p1", "p2"
    Frame.Util.updateHtml($("#MyDiv"), oData, "p1,p2");
@ParaIn:
    * jScope, JObject, A JQuery object. eg: $("#MyEle");
    * oData, Object, a simple object. all the properties are simple type.
    * properties, String/Array, Optional. The properties for updating, it must be in oData.
@Return: None
@Caution:
@Modification:
    * yyyy-mm-dd: Auth, add or modify something
*****************************************************************************/
,updateHtml: function(jScope, oData, properties)
{
    if(properties)
    {
        var aFields = ("string"==typeof(properties)) ? properties.split(",") : properties;
        for(var i=0,k=aFields.length; i<k; i++)
        {
            var key = aFields[i];
            if(undefined === oData[key])
            {
                continue;
            }
            $("#"+key, jScope).html(oData[key]);
        }
        return;
    }

    for(var key in oData)
    {
        $("#"+key, jScope).html(oData[key]);
    }
}

/*****************************************************************************
@FuncName: public, Frame.Util.updateSelect
@DateCreated: 2013-07-04
@Author: Huangdongxiao 02807
@Description: 根据数组填充select下拉框
@Usage:
@ParaIn:
    * sSelectId, String, select下拉框的id
    * aData, Array, 数据数组，其元素为字符串类型.
@Return: void
@Caution:
@Modification:
    * yyyy-mm-dd: Auth, add or modify something
*****************************************************************************/
,updateSelect: function(sSelectId, aData)
{
    var aOptions = [];
    var aData = (this.VPN || {VPN:[]}).VPN;
    for(var i=0; i<aData.length; i++)
    {
        aOptions.push(aData.Name);
    }
    $("#"+sSelectId).html("<option>"+aOptions.join("</option><option>")+"</option>");
}

/*****************************************************************************
@FuncName: public, Frame.Util.checkReboot
@DateCreated: 2014-09-17
@Author: Huangdongxiao 02807
@Description: 设备重启后检查是否重启完成。在调用本函数前建议先调用 Frame.keepAlive.pause()
    暂停框架的自动探测，重启完成后再调用 Frame.keepAlive.start() 恢复框架的自动探测。
    注意：自动探测的方法是定时向设备发送请求，如果能收到回应就说明重启完成。
    因此在调用本函数前必须保证设备已经开始重启了
@Usage:
    Frame.keepAlive.pause();
    Frame.Util.checkReboot(function(){
        alert("The device is ready, relogin please.");
        Utils.Base.redirect("/");
    })
@ParaIn:
    * opt, void, 可以是一个函数或者一个Object参数。
        当是Object时，可以有onRebootEnd, interval两个属性；
        当是函数时，与opt.onRebootEnd相同。
    * opt.onRebootEnd, Function, 重启完成后的处理函数
    * opt.interval, Integer, 探测时间间隔，单位：秒。默认时间为20秒
@Return: void
@Caution:
@Modification:
    * yyyy-mm-dd: Auth, add or modify something
*****************************************************************************/
,checkReboot: function (opt)
{
    var k = 0;

    if ($.isFunction(opt))
    {
        opt = {onRebootEnd: opt};
    }
    opt = $.extend({interval: 20}, opt);

    function _sendRequest()
    {
        k++;
        $.ajax({
            url: "/",
            data: {sn: k},
            success: function (oInfo)
            {
                opt.onRebootEnd && opt.onRebootEnd();
            },
            error: function ()
            {
                setTimeout(_sendRequest, opt.interval * 1000);
            }
        });
    }

    _sendRequest();
}

} //// end of Util
$F.Util = Util;

function coord(el,prop)
{
    var c = el[prop], b = document.body;

    while ((el = el.offsetParent) && (el != b))
    {
        c += el[prop];
    }

    return c;
}

var UI = {

/*Frame.UI.coord*/
coord: function (el)
{
    var x = el["offsetLeft"]+$(el).outerWidth(), 
        y = el["offsetTop"] + el.offsetHeight, 
        b = document.body;

    while ((el = el.offsetParent) && (el != b))
    {
        x += el["offsetLeft"];
        y += el["offsetTop"];
    }

    return {x:x, y:y};
},

/*Frame.UI.popBox*/
popBox: function(jEle, sMsg)
{
    var jBox = $("#_popbox_div");
    if(jBox.length == 0)
    {
        $("body").append("<div id='_popbox_div'></div>");
        jBox = $("#_popbox_div");
        //$("body").click(function(){jBox.hide()});
    }

    var el = jEle.get()[0];
    var cx=coord(el,'offsetLeft');
    var cy=coord(el,'offsetTop') + el.offsetHeight;
    jBox.removeClass().addClass("pop-box").removeAttr("style").css({position:"absolute", left:cx, top:cy}).html(sMsg);
    return jBox;
}

}
$F.UI = UI;

// Defination of IP Protocol
var IpProtocol = 
{
    getStr: function(nProtocalType)
    {
        var aPrtl = {"6":"TCP", "17":"UDP"};
        return aPrtl[nProtocalType] || nProtocalType;
    },
    ICMP: 1,    TCP: 7,     UDP: 16, ICMP6: 58
}
$F.IpProtocol = IpProtocol;

var MyScreen = 
{
    _hLock: false,
    getWidth: function ()
    {

    },
    getHeight: function ()
    {
        //
    },
    lock: function ()
    {
        //
        MyScreen._hLock = $('<div class="modal-backdrop in" style="z-index: 1030;"></div>').appendTo("body");
    },
    unlock: function ()
    {
        //
        MyScreen._hLock.remove();
        MyScreen._hLock = false;
    }
}
$F.MyScreen = MyScreen;

})(Frame);
