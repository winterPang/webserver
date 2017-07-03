/*******************************************************************************
 Copyright (c) 2007, Hangzhou H3C Technologies Co., Ltd. All rights reserved.
--------------------------------------------------------------------------------
@FileName:libs/frame/util.js
@ProjectCode: Comware v7
@ModuleName: Frame.Util
@DateCreated: 2011-07-27
@Author: lixiulan 06658
@Description:
    ���幫�ýӿ�
@Modification:
*******************************************************************************/

;(function($F)
{

var Util = {

/*****************************************************************************
@FuncName: public,Frame.Util.generateID
@DateCreated: 2011-08-15
@Author: huangdongxiao 02807
@Description: ����һ��ΨһID�ַ��������ֿؼ�������HTMLʱ��Ҫָ��һ��ID������ID����Ҫ��ҳ�湫����
    ��ʱ����ʹ�øýӿ�����һ��ID���ڲ�ʹ�á�
@Usage:
        var sId = Frame.Util.generateID("mydiv");
        var sHtml = "<div id="+sId+">my div</div>";
@ParaIn:
    * sPrefix - string, IDǰ׺������ʹ�ÿؼ����ơ�
@Return: ��
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
@Description: ת��HTML��ʽ���ַ�Ϊ�ı��ַ�, ������ҳ������ȷ��ʾHTML�ı�ǩ�Ϳո�������ַ���
    <p>��֧�ֻ�����ʾ���ı��еĻس����н�����Ϊ�ո�����\r\n�ᱻת��Ϊ�ո�
@Usage:
    var sText = "abc<b>b</b>, space:       -            end";

    // ��ʾ����б�ǩ�Ͷ���ո�"abc<b>b</b>, space:       -           end"
    $("#myid").html(Frame.Util.toText(sText));

    // ��ʾ���û�б�ǩ�Ҷ���ո�ĵط�ֻ��ʾһ����"abcb, space: -  end"
    $("#myid").html(sText);
@ParaIn:
    * sHtml - String, ��Ҫת����HTML�ַ�����
@Return: ��
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
@Description: ת���˿ڵ�����Ϊ��ʾ���ַ���: 0-Auto, <1000, xxx K, <1000000 - xxx M, else xxx G
@Usage:
@ParaIn:
    * sHtml - String, ��Ҫת����HTML�ַ�����
@Return: ��
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
@Description: ����Netconf���ص�PortList������ȡ�о�������Ķ˿��ַ�������˿�������ifindex����
@Usage:
    var sPortName = "Eth0/1/2.2";
    var sSortName = Frame.Util.toPortStr(sPortName);
    // �Ȼ�ȡ����
    Frame.SRequest.getInstance("get", "all")
        .appendNode("MAC")
            .appendNode("MacUnicastTable").parent()
            .appendNode("MacGroupTable").root()
        .appendNode("Ifmgr").appendNode("Ports").appendNode("Port").appendColumn("IfIndex,PortIndex,AbbreviatedName").root()
    .get(myCallback,"I_MAC_Summary");

    // �ص�������ƴװ���ݣ�������ʹ�ýӿڵ���д��
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
    *aPort, Array,  �ӽӿڹ������ȡ�Ľӿ����顣���ڲ�ͬģ���õ������ݲ�ͬ������ɸ�ģ���ȡ�˿��б�����
    *sKey, String, �ӿڵ����������ӿ�������һ�����󣬱�����ָ��Ҫ������һ������ƴ�ɵĴ���
    *sPortList, String, NetConf��PortList���͵�ʮ�������ַ�������ʽΪ"ABCDEF123456"
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
@Description: ת���˿���Ϊһ���������ַ���, ���ڱȽϴ�С��
@Usage:
    var sPortName = "Eth0/1/2.2";
    var sSortName = Frame.Util.toPortStr(sPortName);
@ParaIn:
    * sPortName - PortString, ��Ҫת���Ķ˿�����������ȫ����Ҳ�����Ǽ������磺Ethernet1/0/1, Eth1/0/1, Ten-GibitEthernet2/0/51:1
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
@Description: ת��IP��ַ�ַ���Ϊһ��������
@Usage:
    var sIp = "192.168.1.10";
    var nIp = Frame.Util.IpStr2Integer(sIp);

    // ����ת�����
    Frame.Util.IpStr2Integer("255.255.255.255")==0xFFFFFFFF
    Frame.Util.IpStr2Integer("169.254.77.15")==0xa9fe4d0f
    Frame.Util.IpStr2Integer("1.1.1.1")==0x1010101
    Frame.Util.IpStr2Integer("0.0.0.1")==1
    Frame.Util.IpStr2Integer("0.0.0.0")==0
    Frame.Util.IpStr2Integer("255")==0
    Frame.Util.IpStr2Integer("2.3.3.62.54")==0
    Frame.Util.IpStr2Integer("269.354.77.15")==0
@ParaIn:
    * sIp - IpString, ���ʮ���Ƶ�IP��ַ�ַ���
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
        // �Ƿ���IP��ַ
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
@DateCreated: 2011-8-5��
@Author: L06658��
@Description: ��ȡVendorType �����һλ����ͨ��һ��˵���ǻ�ȡ�Ե�ָ����ַ����е����һ��
@Usage:
    Frame.Util.getLastVerdorNo(sVendorType);
@ParaIn:
    * sVendorType- String, ������sysoid
@ParaOut:
@Return: String, VendorType �����һλ
@Caution:
@Reference:
@Modification:
* 2011-08-05: ������, �ṩ ��ȡVendorType �����һλ
*****************************************************************************/
getLastVerdorNo: function (sVendorType)
{
    var arr = sVendorType.split(".");
    return arr[arr.length-1];
},

getProtocalStr: function(nProtocalType)
{
    var aPrtl = {
        "0": "HOPOPT", // IPv6 ����ѡ��
        "1": "ICMP", // Internet ������Ϣ
        "2": "IGMP", // Internet �����
        "3": "GGP", // ���ض�����
        "4": "IP", // IP �е� IP����װ��
        "5": "ST", // ��
        "6": "TCP", // �������
        "7": "CBT", // CBT
        "8": "EGP", // �ⲿ����Э��
        "9": "IGP", // �κ�ר���ڲ����أ�Cisco �������� IGRP��
        "10": "BBN-RCC-MON", // BBN RCC ����
        "11": "NVP-II", // ��������Э��
        "12": "PUP", // PUP
        "13": "ARGUS", // ARGUS
        "14": "EMCON", // EMCON
        "15": "XNET", // ����������
        "16": "CHAOS", // Chaos
        "17": "UDP", // �û����ݱ�
        "18": "MUX", // ��·����
        "19": "DCN-MEAS", // DCN ������ϵͳ
        "20": "HMP", // ��������
        "21": "PRM", // ���ݰ����߲���
        "22": "XNS-IDP", // XEROX NS IDP
        "23": "TRUNK-1", // �� 1 ����
        "24": "TRUNK-2", // �� 2 ����
        "25": "LEAF-1", // �� 1 Ҷ
        "26": "LEAF-2", // �� 2 Ҷ
        "27": "RDP", // �ɿ�����Э��
        "28": "IRTP", // Internet �ɿ�����
        "29": "ISO-TP4", // ISO ����Э��� 4 ��
        "30": "NETBLT", // �������ݴ���Э��
        "31": "MFE-NSP", // MFE �������Э��
        "32": "MERIT-INP", // MERIT �ڵ��Э��
        "33": "SEP", // ˳�򽻻�Э��
        "34": "3PC", // ����������Э��
        "35": "IDPR", // ������·��Э��
        "36": "XTP", // XTP
        "37": "DDP", // ���ݱ�����Э��
        "38": "IDPR-CMTP", // IDPR ������Ϣ����Э��
        "39": "TP++", // TP++ ����Э��
        "40": "IL", // IL ����Э��
        "41": "IPv6", // Ipv6
        "42": "SDRP", // ԴҪ��·��Э��
        "43": "IPv6-Route", // IPv6 ��·�ɱ�ͷ
        "44": "IPv6-Frag", // IPv6 ��Ƭ�ϱ�ͷ
        "45": "IDRP", // ���·��Э��
        "46": "RSVP", // ����Э��
        "47": "GRE", // ͨ��·�ɷ�װ
        "48": "MHRP", // �ƶ�����·��Э��
        "49": "BNA", // BNA
        "50": "ESP", // IPv6 �ķ�װ��ȫ����
        "51": "AH", // IPv6 �������֤��ͷ
        "52": "I-NLSP", // ��������㰲ȫ�� TUBA
        "53": "SWIPE", // ���ü��ܵ� IP
        "54": "NARP", // NBMA ��ַ����Э��
        "55": "MOBILE", // IP �ƶ���
        "56": "TLSP", // ����㰲ȫЭ��ʹ�� Kryptonet ��Կ����
        "57": "SKIP", // SKIP
        "58": "IPv6-ICMP", // ���� IPv6 �� ICMP
        "59": "IPv6-NoNxt", // ���� IPv6 ������һ����ͷ
        "60": "IPv6-Opts", // IPv6 ��Ŀ��ѡ��
        //"61": "", //���������ڲ�Э��
        "62": "CFTP", // CFTP
        //"63": "", //���Ȿ������
        "64": "SAT-EXPAK", // SATNET ���̨ EXPAK
        "65": "KRYPTOLAN", // Kryptolan
        "66": "RVD", // MIT Զ���������Э��
        "67": "IPPC", // Internet Pluribus ���ݰ�����
        //"68": "", //����ֲ�ʽ�ļ�ϵͳ
        "69": "SAT-MON", // SATNET ����
        "70": "VISA", // VISA Э��
        "71": "IPCV", // Internet ���ݰ����Ĺ���
        "72": "CPNX", // �����Э���������
        "73": "CPHB", // �����Э�����ź�
        "74": "WSN", // ������������
        "75": "PVP", // ���ݰ���ƵЭ��
        "76": "BR-SAT-MON", // ��̨ SATNET ����
        "77": "SUN-ND", // SUN ND PROTOCOL-Temporary
        "78": "WB-MON", // WIDEBAND ����
        "79": "WB-EXPAK", // WIDEBAND EXPAK
        "80": "ISO-IP", // ISO Internet Э��
        "81": "VMTP", // VMTP
        "82": "SECURE-VMTP", // SECURE-VMTP
        "83": "VINES", // VINES
        "84": "TTP", // TTP
        "85": "NSFNET-IGP", // NSFNET-IGP
        "86": "DGP", // ��������Э��
        "87": "TCF", // TCF
        "88": "EIGRP", // EIGRP
        "89": "OSPFIGP", // OSPFIGP
        "90": "Sprite-RPC", // Sprite RPC Э��
        "91": "LARP", // �켣��ַ����Э��
        "92": "MTP", // �ಥ����Э��
        "93": "AX.25", // AX.25 ֡
        "94": "IPIP", // IP �е� IP ��װЭ��
        "95": "MICP", // �ƶ���������Э��
        "96": "SCC-SP", // �ź�ͨѶ��ȫЭ��
        "97": "ETHERIP", // IP �е���̫����װ
        "98": "ENCAP", // ��װ
        //"99": "", //����ר�ü��ܷ��� 
        "100": "GMTP", // GMTP 
        "101": "IFMP", // Ipsilon ��������Э�� 
        "102": "PNNI", // IP �ϵ� PNNI 
        "103": "PIM", // ������Э��Ķಥ 
        "104": "ARIS", // ARIS 
        "105": "SCPS", // SCPS 
        "106": "QNX", // QNX 
        "107": "A/N", // ����� 
        "108": "IPComp", // IP ����ѹ��Э�� 
        "109": "SNP", // Sitara ����Э�� 
        "110": "Compaq-Peer", // Compaq �Ե�Э�� 
        "111": "IPX-in-IP", // IP �е� IPX 
        "112": "VRRP", // ����·��������Э�� 
        "113": "PGM", // PGM �ɿ�����Э�� 
        //"114": "", //���� 0 ��Э�� 
        "115": "L2TP", // �ڶ������Э�� 
        "116": "DDX", // D-II ���ݽ��� (DDX) 
        "117": "IATP", // ����ʽ������Э�� 
        "118": "STP", // �ƻ�����Э�� 
        "119": "SRP", // SpectraLink ����Э�� 
        "120": "UTI", // UTI 
        "121": "SMP", // ���ʼ�Э�� 
        "122": "SM", // SM 
        "123": "PTP", // ����͸��Э�� 
        "124": "ISIS", // over IPv4 
        "125": "FIRE", // 
        "126": "CRTP", // Combat ���ߴ���Э�� 
        "127": "CRUDP", // Combat �����û����ݱ� 
        "128": "SSCOPMCE", // 
        "129": "IPLT", // 
        "130": "SPS", // ��ȫ���ݰ����� 
        "131": "PIPE", // IP �е�ר�� IP ��װ 
        "132": "SCTP", // �����ƴ���Э�� 
        "133": "FC" // ����ͨ�� 
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
    * sFormat - string, String formater��
    * valuelist - void, formater value list��
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
     * ����Ϊһ���ַ����������ʽ
     */
    if ($.isArray(valuelist))
    {
        arrTmp = valuelist;
    }
    /**
     * ����Ϊ����ַ��������ֵ���ʽ
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
@Description: ����˳���ʽ���ַ���, ��Ҫ��ʽ���Ĳ���ʹ��{index}���,index��0��ʼ��
    sprintfֻ�ܰ��ձ�ε�˳��������䣬���������԰��ո�ʽ������ָ����˳����������
    <p>��������֧���������ͣ����еĲ����������ַ�������
@Usage:
    Frame.Util.osprintf("Error for {1} of {0}", "PVID", "Eth0/1/1");
    // return "Error for PVID of Eth0/1/1"
@ParaIn:
    * sFormat - string, ��ʽ��Ϣ�ַ�����
    * valuelist - void, ��ʽ���Ĳ����б�
@Return: ��
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
     * ����Ϊһ���ַ����������ʽ
     */
    if ($.isArray(valuelist))
    {
        arrTmp = valuelist;
    }
    /**
     * ����Ϊ����ַ��������ֵ���ʽ
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
@Description: ��ȡ����·����URL������V7������ʹ��ajax�������loadҳ��ʱʹ�����·���Ǵ�index.html��ʼ����ġ�
    ��ҳ�汾���·����index.html������һ����ҳ���Լ��� ../ �ķ�ʽȥ�������·����������⣬�Ҳ���ά����
    �����ṩ���ӿ�ͳһ����·����
    <p>������֧�ֶ�ָ̬�����ԣ�����ʹ��[lang]����URL�е����Բ���
@Usage:
    var sUrl = "syslog/summary.js";
    var sAbsUrl = Frame.Util.getPathUrl(sUrl);

    // �������Ե�URL
    var sUrl = "syslog/[lang]/summary.html";
    var sAbsUrl = Frame.Util.getPathUrl(sUrl);

    // ����ĵ���
    var sAbsUrl = Frame.Util.getPathUrl("syslog/[lang]/") + "summary.html";
    var sAbsUrl = Frame.Util.getPathUrl("syslog/[lang]") + "/summary.html";
@ParaIn:
    * sAction, string, URL��Ϣ�ַ�����URL����:
    <LI>�������http(s)://����/��ͷ�ľ���·����URL��ֱ�ӷ���
    <LI>������URL������ϸ�·���󷵻�
    <LI>������������URL��,�����ǰ��
@Return: String, ����·����URL�ַ���
@Caution:
@Modification:
    * yyyy-mm-dd: Auth, add or modify something
*****************************************************************************/
getPathUrl: function(sAction)
{
    /*
    <LI>�Զ����URLǰ׺(url::),��ʱ��ȡurl::����Ĵ�Ϊ��ʵ��URL
    <LI>�Զ����JSǰ׺(js::), ��ʱ��ȡjs::����Ĵ�Ϊһ��JS����. ��ʱ��֧��
    */
    var aUrl = sAction.split("::");
    var sUrl = sAction;
    if(aUrl.length>1)
    {
        switch(aUrl[0])
        {
        case "js":
            sUrl = null;    // ��֧��
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
        // ��������˱�̬�ļ�������ʱ��Ҫ��URL������һ�������
        if(/\[lang\]/.test(sUrl))
        {
            sUrl = sUrl.replace("[lang]", Frame.get("lang"));
        }
        if(true!==MyConfig.config.cachePage)
        {
            sUrl += "?u="+Frame.get("rid");
        }

        // �����HTTP����HTTPS��ͷ��, ����Ҫ����
        if(/^https?:/.test(sUrl)) return sUrl;

        // ����Ǿ���·����ͷ��(����/��ͷ), ����Ҫ����
        if("/"==sUrl.charAt(0)) return sUrl;

        var sRoot = MyConfig.root || "/";
        return sRoot+sUrl;
    }
},

/*****************************************************************************
@FuncName: public, Frame.Util.getDynUrl
@DateCreated: 2011-06-30
@Author: Huangdongxiao 02807
@Description: ��ȡ��̬URL�ľ���·��������̬URL�;�̬URL������һ����Ŀ¼������ͨ���ú�����ȡ��һ����ض�̬URL�ľ���·����
<p>��V7�и�ҳ��ȫ��ʹ��XCMP�·�����XCMP�Ѿ���װ��URL���·�����˲���ҪҲ��Ӧ�ù��Ķ�̬URL��
ֻ���ڿ���л��������ҳ���л��õ���V7��֧�ֵĶ�̬URL������
<ul>
    <LI>get.j, XCMP��ȡ����URL���Ѿ���װ��SRequest��
    <LI>set.j, XCMP�·�����URL���Ѿ���װ��SRequest��
    <LI>logout.j, �˳���¼�����ʹ��
    <LI>menu.j, ��ʾ�˵������ʹ��
    <LI>reboot.j, �����豸�� ����ҳ��ʹ��
    <LI>check.j, ����豸��������¼ҳ��ʹ��
    <LI>vcode.bmp, ��ʾ��֤�룬��¼ҳ��ʹ��
    <LI>login.j, ִ�е�¼��������¼ҳ��ʹ��
    <LI>file/upload.j, �ļ��ϴ�URL���Ѿ���װ��Frame.FileMnger��
    <LI>file/download.j, �����ļ�
    <LI>file/delete.j, ɾ���ļ�
    <LI>config/backup.j, ���������ļ������ù���ҳ��ʹ��
    <LI>config/restore.j, �ָ������ļ������ù���ҳ��ʹ��
    <LI>config/export.j, ���������ļ������ù���ҳ��ʹ��
    <LI>keepalive.j, ��ʱ��⣬���ʹ��
</ul>
@Usage:
    var sDynUrl = Frame.Util.getDynUrl("login.j");
@ParaIn:
    * sUrl, String, ��̬URL����ض�·�����������г����ļ���URL֮һ����login.j, file/upload.j
@Return: String, ����·����URL�ַ���
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
        // ����demoʱʹ��php��׺
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
@Description: �����������select������
@Usage:
@ParaIn:
    * sSelectId, String, select�������id
    * aData, Array, �������飬��Ԫ��Ϊ�ַ�������.
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
@Description: �豸���������Ƿ�������ɡ��ڵ��ñ�����ǰ�����ȵ��� Frame.keepAlive.pause()
    ��ͣ��ܵ��Զ�̽�⣬������ɺ��ٵ��� Frame.keepAlive.start() �ָ���ܵ��Զ�̽�⡣
    ע�⣺�Զ�̽��ķ����Ƕ�ʱ���豸��������������յ���Ӧ��˵��������ɡ�
    ����ڵ��ñ�����ǰ���뱣֤�豸�Ѿ���ʼ������
@Usage:
    Frame.keepAlive.pause();
    Frame.Util.checkReboot(function(){
        alert("The device is ready, relogin please.");
        Utils.Base.redirect("/");
    })
@ParaIn:
    * opt, void, ������һ����������һ��Object������
        ����Objectʱ��������onRebootEnd, interval�������ԣ�
        ���Ǻ���ʱ����opt.onRebootEnd��ͬ��
    * opt.onRebootEnd, Function, ������ɺ�Ĵ�����
    * opt.interval, Integer, ̽��ʱ��������λ���롣Ĭ��ʱ��Ϊ20��
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
