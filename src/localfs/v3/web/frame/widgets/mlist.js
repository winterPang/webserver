/*******************************************************************************
 Copyright (c) 2011, Hangzhou H3C Technologies Co., Ltd. All rights reserved.
--------------------------------------------------------------------------------
@FileName:widgets/mlist.js
@ProjectCode: Comware v7
@ModuleName: Frame.MList
@DateCreated: 2011-08-09
@Author: huangdongxiao 02807
@Description:�����б�ؼ���֧�ַ�ҳ��ʾ�����򡢿��ٲ�ѯ���߼���ϲ�ѯ���ܣ�֧��������Ӻ����޸ġ�
��V7���б�Ĵ�����Ҫ������JS�У�HTML��ֻ��Ҫָ��һ��DIV�������ɡ��б����м��У�ÿһ�е����Եȶ���ͨ��JS�Ĳ���ָ����

<ul>
<li><a href="#mlist_create">����һ���б�</a>
<li><a href="#mlist_group">����</a>
<li><a href="#Frame.MList.Buttons">�б�ť</a>
<li><a href="#datatype">��������</a>
<li><a href="#mlist_colModel">�ж���</a>
<li><a href="#formatter_link">����Ԫ����ӳ�����</a>
<li><a href="#formatter_bgcolor">�ı䵥Ԫ��ı���ɫ</a>
</ul>


<h3 id="mlist_create">����һ���б�</h3>
<ol>
<li>��HTML����Ҫ��ʾ�б�ĵط�����һ��DIV���磺
    <code>&lt;div header="����,�˿ں�,VRF" id="mymlist">&lt;/div></code>
<li>��JS�������б�ĳ�ʼ�������������б��<a href="#MListOption">�������</a>��������ѡ����ѯ���������Լ�ÿ�е����ơ��п�ȣ�
    ������<a href="#Frame.MList.create">Frame.MList.create</a>�����б�
<li>�ڳ�ʼ���е����б�ĳ�ʼ������
<li>���������ȡ�б�����ݣ�����MList��<a href="#Frame.MList.refresh">refresh</a>��
    ����<a href="#Frame.MList.appendData">appendData</a>��ʾ
</ol>
һ�������б�ҳ�������JS�Ĳο����룺
<code>
;(function ($) {
var LIST_NAME = "mylist";

function initGrid()
{
    var opt = {
        multiSelect: true,
        group: true,
        colModel:[
            {name:'Address', width:"270", datetype:"Ip", required:true},
            {name:'Port',    width:"100", datetype:"Integer", editable:true, min:1, max:65535},
            {name:'VPN',     width:"100", datetype:"String", editable:true, min:0, maxLen:31}
        ],
        buttons:[
            {name:'delete', action:Utils.Msg.deleteConfirm(onDelete)}
        ]
    };
    $("#"+LIST_NAME).mlist("head", opt);
}

function initData()
{
    function myCallback(oInfos)
    {
        var aRule = Utils.Request.getTableRows(g_Rules, oInfos)||[];

        // �����ص����ݣ���optional��
        // ......

        $("#"+LIST_NAME).mlist("refresh", aRule);
    }

    var oRule = Utils.Request.getTableInstance(g_Rules);
    Utils.Request.getAll([oRule], myCallback);
}

function _init()
{
    initGrid();
    initData();
};

function _destroy()
{
}

// ע��ҳ���õ��Ŀؼ�
Utils.Pages.regModule(MODULE_NAME, {"init": _init, "destroy": _destroy,"widgets":["Mlist","Default"],"utils":["Request","Base", "Msg"]});
})( jQuery );
</code>


<h3 id="datatype">datatype˵��</h3>
datatypeָ���е����ͣ���������ʾ����ѯ���༭ʱ�����֣�����ʾ��ͬ�ĸ�ʽ����ѯ�������Ͳ�ͬ�ı༭�ؼ������������¼������ͣ�
////table start sep=//
����//֧�ֵ�����//����
Group//-//���<a href="#mlist_group">��������</a>//
Text//min, maxLength//�ı������ڱ༭�ַ������͡������Կո�ͷ���Ҳ��ܰ����ʺš�//
String//min, maxLength//�ı������ڱ༭�ַ������͡����ܰ����ʺš�//
EString/istring//min, maxLength//�ı������ڱ༭�ַ������͡������ͳ����ַ����ĳ��ȷ�Χ�ⲻ����κ������ַ���//
Ip//-//�ı��򣬿�������IPv4����IPv6�ĵ�ַ//
Ipv4//-//�ı���ֻ������IPv4�ĵ�ַ//
Ipv6//-//�ı���ֻ������IPv6�ĵ�ַ//
Mask//-//�����򣬿���ѡ��IPv4��32������//
Mac//-//�ı��������ʽΪ: HH-HH-HH-HH-HH-HH//
Integer//min, max//�ı������ڱ༭��������//
Password//-//�ı������ڱ༭��������//
Order//#ListString/data//ö�����ͣ�һ�����豸�Ϸ��ص����ֵ��ڽ�����Ҫ��ʾΪ�ַ��������༭ʱ��ʾΪ�����б�ؼ����ߵ�ѡ��ť��
        ������̬�����ݵĸ�������type���Ծ������б��ѡ����data���Ծ�����
        ���ھ�̬�̶���ѡ�������dataָ����data����Ϊ<a href="#ListString">ListString</a>����
        ��ѡ��Ϊ��̬�б�ʱ��һ����Ҫ�Ӻ�̨��ȡ��������ʹ��onInit��䡣���ھ�̬���ݣ���ѡ��仯ʱ�����onchange�¼�//
Checkbox//-//boolean���ͣ�һ����enable/disable��up/down��open/close���������ݣ���̨���ص�����Ϊtrue/false��
        ���༭ʱ��ʾΪ��ѡ��ؼ��������һ��ʱ����ѡ��ĳ�ʼ��ѡ��״̬��checked���Ծ�����
        ���༭ģʽʱ���ɵ�ǰ��ֵ����������ֵΪ0,null,false,"false","",undefinedʱΪ��ѡ��״̬������ֵ����ѡ��״̬��
        ���û������ѡ����ѡ��״̬�����仯ʱ�����onchange�¼�.
////table end
<b>ע�⣺</b>�ϱ���֧�ֵ�������ָ����<a href="#mlist_colModel">��ģʽ(colModel)����˵��</a>�е�ֻ���ĳһ��datatype��ר�����ԡ�
<h3>datatype����</h3>
<pre class=code>// ������
var aSeverity = ["emergencies","alerts","critical","errors","warnings","notifications","informational","debugging"];

// ��������
var aDigest = [{value:"1",text:"Up"},{value:"2",text:"Down"},{value:"4",text:"Test"}];

function onInitOrder2(jSelect)
{
    var aOptions = [];
    for(var i=0; i<30; i++)
    {
        aOptions.push("<option>"+i+"</option>");
    }
    jSelect.html(aOptions.join(''));

    // bind event, optional
    // jSelect.on("change", function(){})
}

function onDigestChange()
{
    // this.value
}

var opt = {
    colNames:"Time,Group,Severity,Digest,Content",
    colModel:[
        {name:'Time', width:100, datatype:"text"},
        {name:'Module', width:80, datatype:"Order", data:"ACL,WEB,SHELL"},��   // ������
        {name:'Severity', width:80, datatype:"Order", data:aSeverity, tip:true},��   // ������
        {name:'Digest', width:60, datatype:"Order", data:aDigest�� onchange:onDigestChange},��   // ������
        {name:'Interface', width:"100", datatype:"Order", onInit: onInitOrder2}��   // ������
        {name:'Status', width:"100", datatype:"Checkbox"}   // ��ѡ��
    ]
};

</pre>

<h3 id="mlist_colModel">��ģʽ(colModel)����</h3>
////table start sep=//
����//����//����
name//String//
    ��Ӧ���Ƕ�Ӧ��̨json�����ĳ��Ҷ�ӱ�ǩֵ���� LogsInLogBuffer�е�Time��Group//
width//Integer//
    ����ĳһ�еĿ��. <b>ע�⣺</b>�ò����������������ͣ�����ʹ��˫���Ű������������������ʹ���е��п���Ч��
    Ҳ���Բ�ָ���п���ʱʹ��Ĭ�Ͽ�ȡ�//
data//#ListString//
    �б༭����ö��ֵ��ʾʱ������Դ��һ�������ĳЩ���ݴӺ�̨���ص���һ������(����״̬)����ʾʱÿһ��ֵ�ֱ��Ӧһ���ַ�����
    ����̨���������������û����������ַ�����������һ�����޵����С�//
datatype//#datatype//
    ��Ԫ����������ͣ��ڽ���������߹���ʱ������������ͽ��в�ͬ�Ĳ�����֧��text, ipv4, port, order��integer��Ĭ��ֵ��text��
    order�����ڸ߼���ѯʱ�������������ʽ��ʾ��//
sortable//Boolean//
    ���Ƿ��������, Ĭ��ֵΪtrue.  ����ֻ����������н�������֧��, ��Ҫ���������ܡ�
    ����������Ϣ����, ������֧�������ܡ���֧��������б���ָ��datatype����//
editable//Boolean//
    �Ƿ���Ա༭��������༭ģʽʱ������Ϊtrue���п�����������ģʽ���б༭�����ʱ����Ӱ��.//
showTip//Boolean//
    �Ƿ���ʾtip�����п����ʱ��Ԫ���ڵ��ı�������ʾȫ����ʱ����ָ��Ϊtrue��
    ʹ�������ȥ���ܹ�����ʾ�ķ�ʽ��ʾ������//
formatter//#Frame.MList.Formatters//
    �Զ��幹�쵥Ԫ���HTML, �����ڱ������ڷ���һ��ָ����HTML�ַ�����ʵ�ֵ�Ԫ��ĸ�ʽ����ʾ���綨�屳��ɫ�ȡ�//
groupFormatter//#Frame.MList.Formatters//
    ͬformatter����������ֻ��Group����Ч//
editor//#Frame.MList.Editors//
    �б༭ʱ�Զ���༭�ؼ���ϵͳ��Ԥ����Ŀؼ��� һ�㲻��Ҫҳ���Լ����塣�������ø�ֵΪfalseʹ���в��ɱ༭��
////table end

<h3 id="mlist_group">��������</h3>
�������������б��������ʾ�����ϣ��Բ�ͬ��������ʾ��ʱ��������������ͼ�꣬ʹ����ʾΪһ�����ӹ�ϵ�Ĵ���ʽ��
������Ҫ��ԭ������������һ��������ϵ��������ʹ��indent��parent��children��ʵ��
////table start sep=//
����//����//����
indent//Integer//�������𣬴�0��ʼ������Ϊ1��2��3...n����ܻ���ݸ�ֵʹ�õ�һ�е���������ʾ��ʱ����һ����ȵ�������ʹ��������һ�����ӹ�ϵ��//
parent//Integer//���ӽڵ����ݣ�Ҫ��һ�����ڵ����������������Ǹ��ڵ��������е��±�//
children//Array//�ӽڵ����飬��Ҫ����ҳ���ڲ��Ĳ���������ж��з���Ļ�����������һ������ÿһ��Ԫ���������顣���������Ϊ�б��ж����������
////table end
<p>������Ҫ��������־��
<li>һ����־�����б�� <a href="#MListOption">MListOption</a> ������group���ԣ�ʹ�б��з��鹦�ܣ�
<li>��һ����־���ڷ������������ <a href="#datatype">datatype</a> ΪGroup��ʹ�б�֪��ʹ����һ�н��з��顣
<p>������
<li>������飺���鶼��һ�����С�
<code>
function initGrid()
{
    var opt = {
        group:"open",
        colModel:[
            {name:'Name', width:50, datatype:"Group", required:true,showTip:false},
            {name:'Status',  width:20, datatype:"Order",data:g_aStatus},
            {name:'content',  width:100, datatype:"String"}
        ]
        ,buttons:[
            {name:'delete', action:Utils.Msg.deleteConfirm(onDelete)}
        ]
    };
    $("#timerange_trange").mlist("head", opt);
}

function makeData()
{
    var aSrcData = g_oTestData;
    var aGroupData = [];
    var oCache = {};
        aSrcData.sort(function (item1, item2){return (item1.Name).localeCompare(item2.Name)});
        $.each(aSrcData,function(index,oData)
        {
            if(undefined === oCache[oData.Name])
            {
                oCache[oData.Name] = aGroupData.length;

                // prepare the data
                var oGroupData = {
                    Name: oData.Name,
                }

                // prepare group attribute
                oGroupData._attr = {
                    parent: null,
                    indent: 0,
                    children: []
                };

                // insert group node
                aGroupData.push(oGroupData);
            }

            oData._attr = {
                parent: oCache[oData.Name],
                indent: 1,
            };
            aGroupData.push(oData);
        });
        $("#" + LIST_NAME).mlist("refresh", aData);
}

// ����Name���з���

// ԭʼ����
var g_oTestData = [
    {Name: "aa", Name2: "aa", Status: "1", content:"test a"},
    {Name: "aa", Name2: "bb", Status: "1", content:"test b"},
    {Name: "aa", Name2: "cc", Status: "0", content:"test c"},
    {Name: "bb", Name2: "aa", Status: "1", content:"test d"},
    {Name: "bb", Name2: "bb", Status: "0", content:"test e"},
    {Name: "bb", Name2: "cc", Status: "1", content:"test f"},
    {Name: "bb", Name2: "dd", Status: "0", content:"test g"},
    {Name: "cc", Name2: "aa", Status: "1", content:"test h"}
];

// ���շ���Ҫ���������ݣ�����makeData��
aGroupData = [
    {Name: "aa", _attr:{parent: null, indent: 0, children: [...]},
    {Name: "aa", Name2: "aa", Status: "1", content:"test a", _attr:{parent: 0, indent: 1}},
    {Name: "aa", Name2: "bb", Status: "1", content:"test b", _attr:{parent: 0, indent: 1}},
    {Name: "aa", Name2: "cc", Status: "0", content:"test c", _attr:{parent: 0, indent: 1}},
    {Name: "bb", _attr:{parent: null, indent: 0, children: [...]},
    {Name: "bb", Name2: "aa", Status: "1", content:"test d", _attr:{parent: 4, indent: 1}},
    {Name: "bb", Name2: "bb", Status: "0", content:"test e", _attr:{parent: 4, indent: 1}},
    {Name: "bb", Name2: "cc", Status: "1", content:"test f", _attr:{parent: 4, indent: 1}},
    {Name: "bb", Name2: "dd", Status: "0", content:"test g", _attr:{parent: 4, indent: 1}},
    {Name: "cc", _attr:{parent: null, indent: 0, children: [...]}},
    {Name: "cc", Name2: "aa", Status: "1", content:"test h", _attr:{parent: 9, indent: 1}}
];
</code>
<li>�����飺���ڵ���һ�����У��ӽڵ�������ı��У�ͨ����������ӳ�䡣
<code>
function initGrid()
{
    var opt = {
        group:"row",
        colModel:[
            {name:'Name', width:50, datatype:"Group", required:true,showTip:false},
            {name:'Status',  width:20, datatype:"Order",data:g_aStatus},
            {name:'content',  width:100, datatype:"String"}
        ]
        ,buttons:[
            {name:'delete', action:Utils.Msg.deleteConfirm(onDelete)}
        ]
    };
    $("#timerange_trange").mlist("head", opt);
}

function getSubNodes(nStart, nParentIndex, aSrcData, sIndex, aChildren)
{
    for(var i=nStart; i<aSrcData.length; i++)
    {
        if(aSrcData[i].Name != sIndex)
        {
            break;
        }

        aSrcData[i]._attr = 
        {
            parent: nParentIndex,
            indent: 1
        };

        aChildren.push(aSrcData[i]);
    }

    return i;
}

function makeData(aSrcData1, aSrcData2)
{
    var aGroupData = [];
    var nStart = 0;

    aSrcData1.sort(function (item1, item2){return (item1.Name).localeCompare(item2.Name)});
    aSrcData2.sort(function (item1, item2){return (item1.Name).localeCompare(item2.Name)});
    $.each(aSrcData1,function(index,oData)
    {
        // get sub-nodes
        var nParentIndex = aGroupData.length;
        var aChildren = [];
        nStart = getSubNodes(nStart, nParentIndex, aSrcData2, oData.Name, aChildren);

        // insert group node
        oData._attr = {
            parent: null,
            indent: 0,
            children: aChildren     
        };
        aGroupData.push(oData);

        // �����childrenҲ��������ΪJSON��ʽ���� {Name: aChildren}
        // �����ڶ��з���ʱ����ʹ��JSON�ĸ�ʽ

        // insert sub-nodes
        if(aChildren.length > 0)
        {
            aGroupData = aGroupData.concat(aChildren);
        }
    });
    $("#" + LIST_NAME).mlist("refresh", aData);
}

// ԭʼ����
var g_oTestData1 = [
    {Name: "aa", Status: "1"},
    {Name: "bb", Status: "1"},
    {Name: "cc", Status: "1"}
];
var g_oTestData1 = [
    {Name: "aa", Name2: "aa", content:"test a"},
    {Name: "aa", Name2: "bb", content:"test b"},
    {Name: "aa", Name2: "cc", content:"test c"},
    {Name: "bb", Name2: "aa", content:"test d"},
    {Name: "bb", Name2: "bb", content:"test e"},
    {Name: "bb", Name2: "cc", content:"test f"},
    {Name: "bb", Name2: "dd", content:"test g"},
    {Name: "cc", Name2: "aa", content:"test h"}
];
</code>
<h3 id="mlist_search">��ѯ(search)����</h3>
////table start sep=//
����//����//����
simple// boolean// ֧�ּ򵥲�ѯ��Ĭ��֧��//
adv// boolean// ֧�ָ߼���ѯ��Ĭ��֧��//
<i>custom</i>// #ActionIcon// �Զ����ѯ��ť��
////table end
<p>һ������¶���ʹ���б��Ĭ�ϲ�ѯ���ܣ���ʱ����searchΪtrue���ɡ�
<p>��ѯʱ��Ҫ֪���������ͣ��Խ��бȽϹ��ˡ����search����ֻ��һ���б�Ĳ�ѯ�ܿ��أ�������һ�п��Բ�ѯ��
����Ҫ��֧�ֲ�ѯ������ָ���������ͼ���ѯ�е�<a href="#mlist_datatype">datatype</a>����

@Modification:
*******************************************************************************/

;(function($F)
{

var MODULE_NAME = "Frame.MList";
var idProperty = "_id";  // property holding a unique row id


var MList = {};
var MyLocale = $.MyLocale;

/*****************************************************************************
@typedef: ActionIcon
@DateCreated: 2012-05-09
@Author: huangdongxiao 02807
@Description: �����������������ͼ�궨�壬������һ��JSON����Ҳ������һ��JS������
<p>�����һ��JSON���������Զ������£�
////table start sep=//
������//����//����
role//JSONObject//ͼ����֧�ֵ�Ȩ�ޣ���JSON��ʽ���壬������write,read,excute����Ȩ�ޣ�Ĭ��ֻ��readȨ�ޡ���:
    <pre class="code">var role = {write: true, read: true, execute: true}</pre>//
showText// Boolean// �Ƿ���ʾ�ı���Ĭ����false//
toggle// Boolean// �����ʱ����active�ͷ�active֮������л�����߼���ѯ�������л���������¼�ͷͼ�ꡣĬ����false//
text// String// ��ť���ı��ַ�����showText=trueʱ��Ч��������ʾ���ַ����Ĳ���˳��Ϊ��
    1). �����ԣ�
    2). ���<a href="../../frame/cn/locale.js.html#JQuery.MyLocale.MList.icons">Ԥ�����ͼ��</a>
    3). ʹ��JSON����//
action// Function// ͼ��ĵ����������ԭ��Ϊvoid function()�������Ĳ�������ʹ�õĵط�������ͬ��
    <li>�ڼ򵥲�ѯ�У�����������(nKeyIndex, sValue)���ֱ�Ϊѡ��Ĳ�ѯ���������û������ֵ��
    <li>���б�Ĳ������У���һ������ nRowId������ͨ��
        <a href="mlist.js.html#Frame.MList.getData">Frame.MList.getData</a>
        ��ȡ����Ӧ�����ݡ�
////table end
<p>�����һ��JS�����������䵽�����ṹ��action���������ʹ��Ĭ��ֵ��
@Usage:
//MList������ͼ��
var oMdfIcon = {
    role: {write: true, read: true, execute: true},
    action: function(nRowId){}
};

//�򵥲�ѯ��ť
var oSearchIcon = {
    role: {write: true, read: true, execute: true},
    action: function(nKeyIndex, sValue){}
};

//�Զ���ͼ��
var oDtlIcon = {
    showText: true,
    text: "detail",
    role: {read: true},
    action: function(){}
};
@Modification:
    * yyyy-mm-dd: Author, add or modify something
*******************************************************************************/
var ActionIcon = {
    showText: true,
    text: "",
    toggle: false,
    role: {read: true},
    action: function(){}
};

/*****************************************************************************
@typedef.private: RowEditOption
@DateCreated: 2011-06-24
@Author: huangdongxiao 02807
@Description: MList�б༭���������ʱ�Ĳ���
@fields:
    * onCheck, Function, �ύǰ�ļ�麯��������Ϊ�û��������ݵ�JSON���󡣼��ͨ����null�� ���򷵻ش�����ʾ��Ϣ��
        �Ա�׼��ʽ������򣬿�ܻ��Զ���顣onCheck���һ�����ڼ�����������Ƿ�Ϸ������Զ������͵����ݡ�
        ��麯����������ʽ��ɣ��м䲻��ʹ���첽����������ʹ��Ajax�·�����̨�����жϣ����ֻ�����ڱ������ݼ��
    * onSubmit, Function, ���ȷ�ϰ�ť�Ĵ�������Ϊ�û��������ݵ�JSON���󡣱�������Ӧ�ù����Request�����·�
    * onCancel, Function, ���ȡ����ť�Ĵ���һ�㲻��Ҫ������¼�
@applyTo:
@Modification:
    * yyyy-mm-dd: Author, add or modify something
*******************************************************************************/
var RowEditOption =
{
    onCheck: function(){return null;},
    onSubmit: $.noop,
    onCancel: $.noop
};

/*****************************************************************************
@typedef: MListOption
@DateCreated: 2011-08-09
@Author: huangdongxiao 02807
@Description: MList����������ʹ��JSON��ʽ���塣�����б�ı�ͷ���������п���Ϊ�ȡ�
    MList��JSΪ�����󲿷ֹ�������JS����ɣ���˶���һ��MListʱ��Ҫ��һ�����ӵĲ�����ʽ��

@fields:
    * multiSelect, boolean, ��ѡ��־, ��֧������ɾ���ı�����Ӹñ�־��
    * group, String, �б����ĳ�ʼ��־��ȡֵΪ"open","close"�������ָ�������ԣ��򲻷��顣���<a href="#mlist_group">��������</a>
    * caption, String, �б��ͷ�����Բ�ָ��
    * colNames, #ListString, ��ͷ���Զ��ŷָ����ַ�����Ҳ������Ԫ��Ϊ�ַ������͵����顣Ҳ������DIV��header���Դ������ѡ�
    * colModel, Array, ��ģʽ���Զ��壬���������ʽ����ÿһ�е�������
        ���еľ��嶨����ο�<a href="#mlist_colModel">��ģʽ(colModel)����</a>
    * search, Object/Boolean, ��ѯ���Զ��壬Ĭ��֧�ֲ�ѯ��
        ��ѯ���Կ�����һ��boolean���͵�true or false����ʱϵͳ����ʾĬ�ϵĲ�ѯͼ�꣬Ҳ������һ������
        ��ϸ����֧����Щ��ѯͼ�꼰��Ϊ����ϸ������ο�<a href="#mlist_search">��ѯ(search)����</a>
    * headerTip, Boolean, �Ƿ���ʾ��ͷ����ʾ��Ϣ�����б���н϶���߱�ͷ�ı��ϳ�ʱ�����ܻ���ʾ��ȫ��
        ��ʱ����ͨ������headerTipΪtrue��ʹ����Ƶ���ͷ��ʱ���Ե���һ�����������ı�����ʾ��Ϣ��
    * buttons: #Frame.MList.Buttons, ���б���صĲ�����ť�����õ���ɾ��ѡ�е��У����һ�У��޸�ѡ�е���
@Modification:
    * yyyy-mm-dd: Author, add or modify something
*******************************************************************************/
var MListOption = {
        datasource: "local",
        def: 0,
        //rowList:[10, 20, 30, 50, 100],
        toolbar: [true, "top"],
        data: []
    };

// paras:
// oIcons, ActionIcon, ͼ���б�
function makeIconsHtml(oIcons)
{
    var aHtml = [];
    var sFirst = " first";

    for(var icon in oIcons)
    {
        var sIcon;
        var oRole = oIcons[icon].role || {};
        var sClass = "mlist-opt-icon" + sFirst;
        var sWrite = oRole.write ? "true" : "false";
        var sRead = oRole.read ? "true" : "false";
        var sExec = oRole.execute ? "true" : "false";
        var sAttrs = ' type='+icon + " write="+sWrite+" read="+sRead+" execute="+sExec;
        var sTitle = oIcons[icon].text || MyLocale.MList.icons[icon] || icon;

        if(true==oIcons[icon]["toggle"])
        {
            sClass += ' icon-toggle';
            sAttrs += ' toggle=true';
        }

        if(true==oIcons[icon]["showText"])
        {
            sClass += ' icon-text shortcut-link shortcut-active';
            sIcon = ('<a href="#" class="'+sClass+'"'+sAttrs+'>'+sTitle+'</a>');
        }
        else
        {
            sClass += ' icon icon-'+icon;
            sAttrs += ' type='+icon+' title="'+sTitle+'"';
            sIcon = ('<a href="#"><i class="'+sClass+'"'+sAttrs+'></i></a>');
        }
        aHtml.push("<span>" + sIcon + "</span>");
        sFirst = "";
    }

    return aHtml.join("");
}

function showMe (jEle, bShow)
{
    if (bShow)
    {
        jEle.removeClass ("hide");
    }
    else
    {
        jEle.addClass ("hide");
    }
}

var Database =
{
    filter: function(oItem, args)
    {
        var bMatch;
        var oFilter = Frame.MList.Filter;
        var opt = args.opt || {};

        bMatch = oFilter.filterGroup(oItem, opt);

        if (bMatch)
        {
            var pfMatch = ("string" == typeof(args.searchString)) ? oFilter.matchAllCol : oFilter.mathByCol;
            bMatch = pfMatch.apply(oFilter, [oItem, args]);
        }

        // set the root node
        if (null == oItem._attr.parent)
        {
            oItem._attr.show = bMatch;
        }

        return bMatch;
    }
};

var ButtonAction = {
    onOpen: function (oBtnDef)
    {
        Frame.getHelpPanel().toggle();
    },
    onRefresh: function (oBtnDef)
    {
        $(this).attr("state", "disable");
        Utils.Base.refreshCurPage();
    },
    onSearch: function (oBtnDef)
    {
        // show search
        var jSearch;
        var sOpenClass = "active";
        var jBtn = $(this);
        var jMList = jBtn.closest (".mlist");
        var jParent = jBtn.closest(".mlist-toolbar");
        var oMlistOpt = jMList.data("opt");

        var pfCancel = function ()
        {
            jSearch.remove();
            jBtn.removeClass (sOpenClass);
            resizeMList (jMList);
            return false;
        }
        var pfOK = function ()
        {
            pfCancel ();
            return false;
        }

        var pfDoFilter = function (val)
        {
            var paras = {opt:oMlistOpt, columns:oMlistOpt.columns, searchString:val, matchcase:false, cm:"include"};
            var dataView = oMlistOpt.dataView;

            dataView.setFilterArgs(paras);
            dataView.refresh();
        }

        if (jBtn.hasClass (sOpenClass))
        {
            jSearch = $(".search-bar", jParent);
            pfCancel ();
            return;
        }

        // search container
        jSearch = $("<div class='search-bar text-right'></div>");

        // search input
        var jInput = $("<input type='text' class='search'>")
            .keyup(function(e)
            {
                if (e.which == 27) 
                {
                    this.value = "";
                    pfDoFilter("");
                    pfCancel ();
                    return;
                }

                pfDoFilter(this.value);
            })
            .appendTo (jSearch);

        // search button
        // $("<button href='#search' class='search-btn apply'>Search</button>")
        //     .on("click", pfOK)
        //     .appendTo (jSearch);

        // cancel button
        // $("<button href='#cancel' class='cancel-btn cancel'>Cancel</button>")
        //     .on("click", pfCancel)
        //     .appendTo (jSearch);

        jBtn.addClass (sOpenClass);
        jSearch.appendTo (jParent);

        resizeMList (jMList);

        jInput.focus ();
    },
    onAdd: function ()
    {
        var oUrlPara = Utils.Base.parseUrlPara();
        oUrlPara.type = "add";
        Utils.Base.redirect(oUrlPara);
        return true;
    },
    onEdit: function ()
    {
        var oUrlPara = Utils.Base.parseUrlPara();
        oUrlPara.type = "edit";
        Utils.Base.redirect(oUrlPara);
    },
    onDel: function ()
    {

    }
}

/*****************************************************************************
@FuncName, public, Frame.MList.Buttons
@DateCreated: 2013-06-08
@Author: huangdongxiao 02807
@Description: �б�ť���塣Ԥ���尴ť������������ӡ��޸ġ�ɾ��������ɾ����ť����Ҫִ��һ���ض��Ķ�����һ�����·�һ��netconf���󣩣�
    ���ҳ���б�������ɾ�������Ķ��塣
    Ԥ���尴ť��
    <ol>
    <li>��ӣ�{id:"mlist_add", name:"add", value:oBtnRc.ADD, mode:Frame.Button.Mode.CREATE, action:function(btnDef){}}
    <li>�޸ģ�{id:"mlist_edit", name:"edit", value:oBtnRc.MDF,enable:1, mode:Frame.Button.Mode.MODIFY,action:function(btnDef){}}
    <li>ɾ����{id:"mlist_del",name:"delete",value:oBtnRc.DEL, enable:">0", mode:Frame.Button.Mode.DELETE}
    </ol>
    ��ҳ���޸�ĳ��ť������ʱʹ��name��Ԥ����İ�ťƥ�䣬��
    <code>{name:"delete",action: Utils.Msg.deleteConfirm(onDelPolicy)}</code>

    <h3 id="ButtonEnable">ButtonEnable</h3>
    ָ����ťʹ�ܵ����������������м������ͣ�
    <ol>
    <li>Boolean, ȡֵΪtrue, false��
    <li>Integer, ������Ϊ����ʱ����ʾ�б���ѡ�е����������б���ѡ�е����������ֵ���ʱ��ťΪenable״̬
    <li>String, ֧�ּ򵥵������жϣ��磺">0", &lt;5", ">=<i>n</i>"�ȣ���֧�ֶ���������磺">0 &amp;&amp; &lt;5"
    <li>Function, ����ʹ��һ��JS��������true, false����ɰ�ť�Ķ�̬ʹ�ܡ��������һ�����ڶ�̬���ݡ�����ĳһ��ʱ�����������жϰ�ť�ǿ���
        ����ԭ����ο����������е� onCheckEditEnable
    </ol>
@Usage:
function onCheckEditEnable(aSelectedRow)
{
    // ֻ��ѡ��һ��ʱ�ɽ��б༭
    if(1 != aSelectedRow.length)
    {
        return false;
    }

    // ֻ��ѡ�о�̬
    var oData = $("#"+LIST_NAME).mlist("getData", aSelectedRows[0]);
    return ("static" == oData.Status);
}

function initGrid()
{
    var opt = {
        multiSelect: true,
        group: true,
        colModel:[
            {name:'Address', width:"270", datetype:"Ip", required:true},
            {name:'Port',    width:"100", datetype:"Integer", editable:true, min:1, max:65535},
            {name:'Status',  width:"50", datetype:"Integer", editable:true},
            {name:'VPN',     width:"100", datetype:"String", editable:true, min:0, maxLength:31}
        ],
        buttons:[
            {name:'add', eanble:false},     // ����ʾ��Ӱ�ť
            {name:'edit', enable: onCheckEditEnable}, // ͬʱֻ�ܱ༭һ����̬����
            {name:'delete', action:Utils.Msg.deleteConfirm(onDelete)}
        ]
    };
    $("#"+LIST_NAME).mlist("head", opt);
}
@ParaIn:
    * id, Integer,
    * name, Integer,
    * value, String, �ڰ�ť����ʾ������
    * enable, #ButtonEnable, ��ť��ʹ������
    * mode, Object, ��ťͼ��
    * action, Function, �������
@Return: void
@Caution:
@Modification:
    * yyyy-mm-dd: Auth, add or modify something
*****************************************************************************/
var BtnMode = Frame.Button.Mode;
var Buttons =
{
    getDefButtons: function (sType)
    {
        return [
            // {id:"mlist_open",    name:"open",   value:MyLocale.Buttons.OPEN,    mode:BtnMode.OPEN,      action:ButtonAction.onOpen},
            {id:"mlist_refresh",  no:10, name:"refresh",value:MyLocale.Buttons.REFRESH, enable:true, mode:BtnMode.REFRESH,   action:ButtonAction.onRefresh},
            {id:"mlist_selector", no:20, name:"selector", enable:">0", action:ButtonAction.onSwitchSelector},
            //{id:"mlist_search",  name:"search", value:MyLocale.Buttons.SEARCH,  enable:true, mode:BtnMode.SEARCH,   action:ButtonAction.onSearch},
            {id:"mlist_edit",    no:30, name:"edit",   value:MyLocale.Buttons.MDF,     enable:1,    mode:BtnMode.MODIFY,   action:ButtonAction.onEdit},
            {id:"mlist_del",     no:40, name:"delete", value:MyLocale.Buttons.BATCHDEL,     enable:">0", mode:BtnMode.DELETE},
            {id:"mlist_add",     no:999, name:"add",    value:MyLocale.Buttons.ADD,     enable:true, mode:BtnMode.CREATE,   action:ButtonAction.onAdd, className:"btn-primary"}
        ];
    },
    _makeHtml: function(jParent, aButton, bDisable, opt)
    {
        function _onBtnClick (e)
        {
            var jButton = $(this);
            var oBtnDef = jButton.data("colDef");

            if ("enable" != jButton.attr("state"))
            {
                return false;
            }

            if (oBtnDef.action)
            {
                var aSelectedData = [];
                if ( (undefined !== oBtnDef.enable) && (true !== oBtnDef.enable) )
                {
                    if (opt && opt.grid)
                    {
                        var _grid = opt.grid;
                        if("row" == oBtnDef.role)
                        {
                            var nRow = parseInt(jButton.closest(".row-toolbar").attr("row"));
                            aSelectedData = [_grid.getDataItem(nRow)];
                        }
                        else
                        {
                            aSelectedData = _grid.getSelectedData();
                        }
                    }
                }
                return (false === oBtnDef.action.call (this, aSelectedData));
            }

            return true;
        }

        function onMenuItemClick(e)
        {
            var jMenuItem =$(this);
            var oBtnDef = jMenuItem.data("colDef");
            if(oBtnDef.enableItem)
            {
                if(oBtnDef.enableItem(jMenuItem.attr("value")))
                {
                    jMenuItem.attr("state", "enable");
                    jMenuItem.attr("disabled", false);
                }
                else
                {
                    jMenuItem.attr("state", "disable");
                    jMenuItem.attr("disabled", true);
                    return false;
                }
            }

            var pfAction = oBtnDef.action;
            if (pfAction)
            {
                var jMList = jMenuItem.closest(".mlist");
                var _grid = jMList.data("opt").grid;
                var aSelectedData = _grid.getSelectedData();
            
                pfAction.apply (this,[aSelectedData]);
            }
            return false;
        }

        function createDropList  (jParent, mode, sText)
        {
            var jBtnCtnr = $('<span class="dropdown-contrainer custom-dropdown"></span>');

            // button
            var jBtn = $('<a class="btn mlist-icon transparent dropdown-toggle custom-toggle" href="#" data-toggle="dropdown"></a>');
            if (mode)
            {
                var sIcon = mode.icons.primary;
                $('<i class="icon '+sIcon+'"></i>').appendTo (jBtn);
            }
            $('<span class="text"></span>').html(oBtn.value).appendTo (jBtn);
            $('<span class="caret"></span>').appendTo (jBtn);
            jBtn.attr("title", sText).appendTo (jBtnCtnr);

            // droplist items
            var jUL = $('<ul class="dropdown-menu location"></ul>');
            Frame.ListString.each(oBtn.droplist, function(val, text)
            {
                var jLI = $("<li></li>").appendTo (jUL);
                var jLink = $("<a href='#' state='enable'></a>")
                    .attr ("value", val)
                    .data ("action", oBtn.action)
                    .html (text)
                    .data("colDef", oBtn)
                    .click (onMenuItemClick)
                    .appendTo (jLI);
            });
            jUL.appendTo (jBtnCtnr);

            jBtnCtnr.appendTo(jParent);
        }

        var nBtnCount = 0;
        var aBtns = aButton||[];
        for(var i=0; i<aBtns.length; i++)
        {
            var oBtn = aBtns[i];

            if (false === oBtn.enable)
            {
                continue;
            }

            if(oBtn.formatter)
            {
                oBtn.formatter (jParent);
            }
            else if(oBtn.droplist)
            {
                createDropList (jParent, oBtn.mode, oBtn.value);
            }
            else
            {
                var jLink = $('<a class="btn mlist-icon" state="enable" href="#"></a>');
                if (oBtn.className)
                {
                    jLink.addClass(oBtn.className); 
                }
                if (oBtn.className)
                {
                    jLink.addClass(oBtn.className); 
                }

                if (oBtn.mode)
                {
                    var sIcon = oBtn.mode.icons.primary;
                    $('<i class="icon '+sIcon+'"></i>').appendTo (jLink);
                    $('<span class="text"></span>').text(oBtn.value).appendTo (jLink);
                }
                else
                {
                    $('<span class="btn-text"></span>').text(oBtn.value).appendTo (jLink);
                }

                if(true === bDisable)
                {
                    jLink.attr("disabled", true).addClass("disabled").attr("state", "disable");
                }

                jLink.click (_onBtnClick)
                    .attr("index", i)
                    .attr("title", oBtn.description || oBtn.value)
                    .data("colDef", oBtn)
                    .appendTo (jParent);
            }

            nBtnCount++;
        }

        return nBtnCount;
    },
    enable: function(opt, bEnable)
    {
        //$("#"+opt.mlistId+" .button-container .buttonL").button("option", "disabled", !bEnable);
    },
    onRowBtnStatusChanged: function(para)
    {
        var opt = para.opt;
        var args = para.args;
        var jMList = $("#"+opt.mlistId);
        var jRowToolbar = $(".row-toolbar", jMList);
        var nRow = args.row;
        var bShow = false;
        var aBtnDef = jRowToolbar.data("rowBtn");

        jRowToolbar.attr("row", nRow);
        jRowToolbar.find('ul').removeClass("btn-horizontal").hide();
        $("ul>li>a", jRowToolbar).each(function ()
        {
            bShow = Buttons.onStatusChange.apply(this, [1, [args.item],opt]) || bShow;
        });

        showMe (jRowToolbar, bShow);
    },
    onStatusChange: function (nSelectedRow, aData, opt)
    {
        var jBtn = $(this);
        var bEnable = true;
        var oColDef = jBtn.data("colDef");

        if (!oColDef)
        {
            return false;
        }

        var v = oColDef.enable;
        switch($.type(v))
        {
        case "function":
            bEnable = v.apply(this,[aData]);
            break;
        case "array":
            bEnable = (-1 < $.inArray(nSelectedRow, v));
            break;
        case "string": // v=">0", "<10"
            bEnable = eval(nSelectedRow + "" + v);
            break;
        case "number":
            bEnable = (nSelectedRow == v);
            break;
        case "boolean":
            bEnable = v;
            break;
        }

        if(true === bEnable)
        {
            jBtn.attr("disabled", false).removeClass("disabled").attr("state", "enable");
        }
        else
        {
            jBtn.attr("disabled", true).addClass("disabled").attr("state", "disable");
        }

        showMe(jBtn, bEnable);

        return bEnable;
    },
    create: function(jOptBar, opt)
    {
        if(!opt.buttons) return;

        // buttons in toolbar
        var aButton = Tools.mergeButton(Buttons.getDefButtons(), opt.buttons, false);
        var jBtnGroup = $("<div class='btn-group'></div>");
        if (Buttons._makeHtml(jBtnGroup, aButton, false, opt) > 0)
        {
            jBtnGroup.appendTo (jOptBar);
        }
    },
    onRowChanged: function(para)
    {
        var opt = para.opt;
        var jMList = $("#"+opt.mlistId);
        var aSelectedRows = Frame.MList.getSelectedRows(opt.mlistId);
        var n = aSelectedRows.length;
        var jToolSelector = $(".toolbar .selector",jMList).find("input:checkbox");
        $(".mlist-status-bar .selected-count").html(n);
        
        if(jToolSelector.length)
        {
            jToolSelector[0].checked = (n == opt.grid.getDataLength());
        }

        opt.listenRowChange && opt.listenRowChange(aSelectedRows);
    },
    onDisable: function(para){Buttons.enable(para.opt, false);},
    onEnable: function(para){Buttons.enable(para.opt, true);}
};
Frame.regNotify(MODULE_NAME, "disable", Buttons.onDisable);
Frame.regNotify(MODULE_NAME, "enable",  Buttons.onEnable);
Frame.regNotify(MODULE_NAME, "rowchanged",  Buttons.onRowChanged);
Frame.regNotify(MODULE_NAME, "rowHoverchanged", Buttons.onRowBtnStatusChanged);
MList.Buttons = Buttons;

var Sorter =
{
    create: function(opt)
    {
    },

    String: function(a, b, oColDef, opt)
    {
        var x = a[oColDef.field]||"", y = b[oColDef.field]||"";

        return (x == y ? 0 : (x > y ? 1 : -1));
    },

    Integer: function(a, b, oColDef, opt)
    {
        var x = parseInt(a[oColDef.field])||-999, y = parseInt(b[oColDef.field])||-999;

        return (x == y ? 0 : (x > y ? 1 : -1));
    },

    // port, eg: Ethnet2/01, Vlan-Interface3, Loopback10
    Port: function(a, b, oColDef, opt)
    {
        var x = a[oColDef.field]||"", y = b[oColDef.field]||"";

        return Utils.Base.comparePort (x, y);
    },

    // ipv4
    IPv4: function(a, b, oColDef, opt)
    {
        var x = Frame.Util.IpStr2Integer(a[oColDef.field]), y = Frame.Util.IpStr2Integer(b[oColDef.field]);

        return (x == y ? 0 : (x > y ? 1 : -1));
    },

    // Ipv6
    IPv6: function(a, b, oColDef, opt)
    {
        var x = a[oColDef.field], y = b[oColDef.field];

        return (x == y ? 0 : (x > y ? 1 : -1));
    }
};

var RowToolbar = {
    create: function (jParent, opt) 
    {
        function onBtnClick(e)
        {
            var jButton = $(this);
            var oBtnDef = jButton.data("colDef");
            if ("enable" != jButton.attr("state"))
            {
                return false;
            }
            if (oBtnDef.action)
            {
                var aSelectedData = [];
                if ( (undefined !== oBtnDef.enable) && (true !== oBtnDef.enable) )
                {
                    if (opt && opt.grid)
                    {
                        var _grid = opt.grid;
                        if("row" == oBtnDef.role)
                        {
                            var nRow = parseInt(jButton.closest(".row-toolbar").attr("row"));
                            aSelectedData = [_grid.getDataItem(nRow)];
                        }
                        else
                        {
                            aSelectedData = _grid.getSelectedData();
                        }
                    }
                }
                return (false === oBtnDef.action.call (this, aSelectedData));
            }

            return true;
        }
        
        function makeBtnList(jContainer,aBtns,oCSS)
        {
            var jBtnList = $('<ul class="hide"></ul>').css(oCSS);
            for(var i=0; i<aBtns.length; i++)
            {
                var oBtn = aBtns[i];
                if (false === oBtn.enable)
                {
                    continue;
                }
                var jChild = $('<li><a state="enable" href="#"></a></li>').appendTo(jBtnList);
                var jLink = jChild.find('a');

                $('<span></span>').text(oBtn.value).appendTo (jLink);


                jLink.click (onBtnClick)
                     .attr("index", i)
                     .attr("title", oBtn.description || oBtn.value)
                     .data("colDef", oBtn);

            }
            jBtnList.appendTo(jContainer);
        }

        function onListClick(e)
        {
            var nHeight = 0;
            var jList = $(this).next('ul');
            if(jList.is(":visible"))
            {
                jList.removeClass("btn-horizontal");
                jList.hide();
                return false;
            }

            $("li>a",jList).each(function(){
                var jBtn = $(this);
                if(jBtn.attr("state") != "enable")
                {
                    jBtn.hide();
                }
                else
                {
                    jBtn.show();
                    nHeight += jBtn.height();
                }
            });
            var jParent = jList.parent().parent().parent();
            var nTop = $(this).offset().top-jParent.offset().top;
            var nBottom = jParent.offset().top+jParent.height()-$(this).offset().top-opt.rowHeight;
            if(nHeight >= nBottom && nHeight <=nTop)
            {
                nHeight = -nHeight;
                jList.removeClass("btn-horizontal");
            }
            else if(nHeight > nBottom && nHeight >nTop)
            {
                nHeight = 0;
                jList.addClass("btn-horizontal");
            }
            else
            {
                nHeight = opt.rowHeight-1;
                jList.removeClass("btn-horizontal");
            }
            
            jList.css({"margin-top":nHeight + "px"});
            jList.show();
            return false;
        }
        var aRowBtn = [];

        var oSupportBtn = {"detail": true,"edit": true,"disable": true,"enable": true,"delete": true};
        var aDefBtn = [
            {id:"mlist_detail", name:"detail", value:MyLocale.Buttons.DETAIL, enable:0, role:"row"},
            {id:"mlist_edit", name:"edit", value:MyLocale.Buttons.MDF, enable:1, role:"row"},
            {id:"mlist_disa", name:"disable", value:MyLocale.Buttons.DISA, enable:0, role:"row"},
            {id:"mlist_ena", name:"enable", value:MyLocale.Buttons.ENA, enable:0, role:"row"},
            {id:"mlist_del", name:"delete", value:MyLocale.Buttons.DEL, enable:1, role:"row"}
        ];

        // get user buttons
        var aUserBtn = [];
        var aOptBtn = opt.buttons || [];
        for (var i = 0; i < aOptBtn.length; i++) 
        {
            var oBtnDef = aOptBtn[i];
            if (oSupportBtn[oBtnDef.name])
            {
                aUserBtn.push(oBtnDef);
            }
        }

        aRowBtn = Tools.mergeButton(aDefBtn, aUserBtn, true);
        if(0 == aRowBtn.length)
        {
            return;
        }

        var sBtnGlo = '<div class="hide row-toolbar"><a class="btn btn-list" state="enable" href="#">'
                    + '<i class="icon fa fa-pencil"></i><span class="text"></span></a></div>';
        var jToolWrap = $(sBtnGlo).height(opt.rowHeight-1);
        jToolWrap.on('click','a',onListClick);
        var oCSS = {"margin-top": opt.rowHeight-1+"px"};
        // RowToolbar.makeActionHtml(aRowBtn,jToolWrap);
        makeBtnList(jToolWrap,aRowBtn,oCSS);
        //Buttons._makeHtml(jToolWrap, aRowBtn, false, opt);

        jToolWrap.data("rowBtn", aRowBtn)
            .appendTo(jParent);
    }

};

var Tools = {
    findInArray: function (aButton, oItem)
    {
        var oBtn = false;
        for(var j=0; j<aButton.length; j++)
        {
            if(aButton[j].name ==  oItem.name)
            {
                oBtn = aButton[j];
                break;
            }
        }

        return oBtn;
    },

    mergeButton: function (aSrcButton, aUserButton, bHasEnable)
    {
        var aNewButton = [];
        var oTmpBtn;

        // colone aSrcButton to new array
        for (var i=0; i<aSrcButton.length; i++)
        {
            var oCurBtn = $.extend({}, aSrcButton[i]);
            aNewButton.push (oCurBtn);
        }
        aSrcButton = aNewButton;

        // merge aUserButton to aSrcButton
        aUserButton = aUserButton || [];
        var oUnSupportBtn = {"detail": true,"edit": true,"disable": true,"enable": true,"delete": true};
        for (var i=0; i<aUserButton.length; i++)
        {
            var oUserBtn = $.extend({}, aUserButton[i]);
            oTmpBtn = Tools.findInArray (aSrcButton, oUserBtn);
            if (oTmpBtn)
            {
                $.extend (oTmpBtn, oUserBtn);
            }
            else if(!oUnSupportBtn[oUserBtn.name])
            {
                aSrcButton.push (oUserBtn);
            }
        }

        // filter 
        aNewButton = [];
        for (var i=0; i<aSrcButton.length; i++)
        {
            var oNewBtn = aSrcButton[i];

            if ((undefined === oNewBtn.enable) || (true === oNewBtn.enable))    // always enabled button
            {
                if (false === bHasEnable)
                {
                    aNewButton.push (oNewBtn);
                }
            }
            else if (bHasEnable)
            {
                aNewButton.push (oNewBtn);
            }
        }

        // sort
        aNewButton.sort (function(oBtn1, oBtn2)
        {
            var x = parseInt(oBtn1.no) || 500;
            var y = parseInt(oBtn2.no) || 500;
            return x - y;
        });

        return aNewButton;
    }
};
MList.Tools = Tools;

var StatusBar =
{
    create: function(opt, jParent)
    {
        function onSwitchSelectedRows () 
        {
            var _grid = opt.grid;
            if(this.checked)
            {
                var rows = [];
                for (var i = 0; i < _grid.getDataLength(); i++) {
                    rows.push(i);
                }
                _grid.setSelectedRows(rows);
            } else {
              _grid.setSelectedRows([]);
            }
        }

        var onCheckboxFormatter = function (jParent)
        {
            var jBtnWrap = $('<a class="selector"></a>');

            $('<input type="checkbox">')
                .click(onSwitchSelectedRows)
                .appendTo(jBtnWrap);

            jBtnWrap.appendTo(jParent);
        };

        var aDefBtn = [
            {id:"mlist_selector", name:"selector", enable:">0", action:ButtonAction.onSwitchSelector, formatter: onCheckboxFormatter},
            {id:"mlist_del",     name:"delete", value:MyLocale.Buttons.BATCHDEL,     enable:">0", mode:BtnMode.DELETE}
        ];

        if(true !== opt.multiSelect)
        {
            aDefBtn = [];
        }

        // create buttons
        var aButton = Tools.mergeButton(aDefBtn, opt.buttons, true);
        if (Buttons._makeHtml(jParent, aButton, true, opt) > 0)
        {
            $(".dropdown-contrainer", jParent).addClass ("dropup");
        }

        // create text element
        //$('<span class="data-info"></span>')
        //    .html($.MyLocale.DATAINFO)
        //    .appendTo(jParent);
    }
    ,onRowChanged: function(para)
    {
        var opt = para.opt;
        var jMList = $("#"+opt.mlistId);
        var jToolbar = $(".mlist-status-bar.mlist-status", jMList);
        var aSelectedRows = Frame.MList.getSelectedRows(opt.mlistId)||[];
        var n = aSelectedRows.length;

        var bShow = false;
        var nBtnLen = $("a.mlist-icon:not([privilege=none])", jToolbar).length;
        var jActiveRow = $(".slick-row.active");

        $("a.mlist-icon:not([privilege=none])", jToolbar).each(function ()
        {
            var aData = opt.grid.getSelectedData();
            bShow = Buttons.onStatusChange.apply(this, [n, aData, opt]) || bShow;
        });
        //if ((bShow)||(0 != jActiveRow.length))
        //{
        //    jToolbar.removeClass ("empty");
        //}
        //else
        //{
        //    jToolbar.addClass ("empty");
        //}
    }
}
Frame.regNotify(MODULE_NAME, "rowchanged",  StatusBar.onRowChanged);

// default filter
var MListFilter =
{
    create: function(opt, jParent, filterCb)
    {
        if(false === opt.search)
        {
            return ;
        }

        var onclickfilter = function()
        {
            var jMList = $(this).parents(".mlist");
            var opt = jMList.data("opt");
            var bShowHeaderRow = $(opt.grid.getHeaderRow()).toggle().is(":visible")
            var border = bShowHeaderRow ? "0px" : "1px";
            jMList.find(".slick-header-columns").css("border-bottom-width", border);
            opt.grid.setOptions({showHeaderRow: bShowHeaderRow});
            resizeMList (jMList);
        };

        var createHeder = function (jDlg)
        {
            var jDlgHeader = $('<div class="modal-header"></div>');
            $('<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>').bind("click", onClose).appendTo(jDlgHeader);
            $('<h3 class="modal-title" id="myModalLabel"></h3>').html(MyLocale.MList.search.QUERY_ADVANCE).appendTo(jDlgHeader);
            jDlgHeader.appendTo (jDlg);
        };

        var createUserFilter = function (jParent)
        {
            var bUserFilter = false;
            var jUserFilter = $("<div class='row'></div>");
            var aSelectOpt = opt.select || [];
            if (!$.isArray(aSelectOpt))
            {
                aSelectOpt = [aSelectOpt];
            }
            for(var i=0; i<aSelectOpt.length; i++)
            {
                bUserFilter = createSelect(aSelectOpt[i], jUserFilter);
            }
            if (bUserFilter)
            {
                jUserFilter.appendTo (jParent);
            }
        };

        var createSorter = function (jParent)
        {
            $("<div class='row'>Sort: UP, Down</div>").appendTo (jParent);
        };

        var createColumnsFilter = function (jContainer)
        {
            var aColumns = opt.columns;
            var oData = jParent.data("filterData");
            var jForm = $("<form class='filter'></form>");
            for (var i=0; i<aColumns.length; i++)
            {
                var oCol = aColumns[i];
                var pfMaker = oCol.fltFormatter;

                if (!pfMaker)
                {
                    continue;
                }

                var jColumn = $("<div class='row'></div>");

                // label
                $("<span class='col-xs-4 control-label'></span>").html (oCol.name).appendTo (jColumn);

                // INPUT, SELECT
                var jContnr = $("<span class='col-xs-8'></span>").appendTo (jColumn);
                // var pfMaker = MListFilter[oCol.datatype] || MListFilter["String"];
                var jEle = pfMaker (null, jContnr, aColumns, oCol);
                if (oData)
                {
                    jEle.val (oData[oCol.id]);
                }

                jColumn.appendTo (jForm);
            }
            jForm.appendTo (jContainer);
        }

        var createBody = function (jDlg)
        {
            var jDlgBody = $('<div class="modal-body" id="mlist_filter_dlg"></div>').appendTo (jDlg);

            //createUserFilter (jDlgBody);
            // createSorter (jDlgBody);
            createColumnsFilter (jDlgBody);
        };

        var createFooter = function (jDlg)
        {
            var sApply = MyLocale.Buttons.SEARCH;
            var sReset = MyLocale.Buttons.RESET;
            var sClose = MyLocale.Buttons.CLOSE;

            var jFooter = $("<div class='modal-footer button-group'></div>");
            $("<a class='btn btn-primary' href='#filter'><i class='fa fa-search'> </i>"+sApply+"</a>").bind("click", onApply).appendTo(jFooter);
            $("<a class='btn' href='#reset'><i class='fa fa-reset'></i>"+sReset+"</a>").bind("click", onReset).appendTo(jFooter);
            $("<a class='btn' href='#close'><i class='fa fa-close'></i>"+sClose+"</a>").bind("click", onClose).appendTo(jFooter);
            jFooter.appendTo(jDlg);
        };

        var getUserInput = function ()
        {
            var oData = {};
            var jForm = $("#mlist_filter_dlg form");
            jForm.find (".filter-ele").each (function ()
            {
                oData[$(this).attr("columnId")] = this.value;
            });
            return oData;
        };

        var onShowFilterDlg = function()
        {
            var oDlg;
            var jDlg = $('<div class="mlist-filter-dlg"></div>');

            createHeder (jDlg);
            createBody (jDlg);
            createFooter (jDlg);

            _oDlg = Utils.Base.openDlg(null, {}, {scope:jDlg,className:"modal-default"});
        };

        var _oDlg = false;
        var onApply = function (e)
        {
            var oData = getUserInput ();
            jParent.data("filterData", oData);
            MListFilter.onFilter (opt, oData);
            onClose.apply (this);

            _jSearchInput.val("");
            return false;
        };

        var onReset = function (e)
        {
            $("#mlist_filter_dlg form")[0].reset();
            jParent.removeData("filterData");

            MListFilter.onFilter (opt);
            _jSearchInput.val("");
            return false;
        };

        var onClose = function (e)
        {
            _oDlg && _oDlg.close();
            return false;
        };

        var createSelect = function(opt, jParent)
        {
            var jSelWrap = $('<div class="filter-div select-container"></div>');
            var jSelect = $('<select id='+opt.id+' class='+(opt.className||"")+'></select>');

            function _initSelect(jSelect, aData)
            {
                var sOptions ;
                for(var i=0; i<aData.length; i++)
                {
                    sOptions +='<option value='+aData[i].value+'>'+aData[i].text+'</option>';
                }
                $(sOptions).appendTo(jSelect);
            }

            var bSingleSelect = jSelect.hasClass("singleSelect");
            if (bSingleSelect)
            {
                jSelect.singleSelect({"allowClear":false});
            }

            if($.isFunction(opt.options))
            {
                opt.options(jSelect);
            }
            else if(bSingleSelect && $.isArray(opt.options))
            {
                var oOpt = opt.widgetOpt;
                jSelect.singleSelect("InitData",opt.options,oOpt);
            }
            else
            {
                var aData = Frame.ListString.format(opt.options, opt.para);
                _initSelect(jSelect, aData);
            }

            if (opt.title)
            {
                $("<span class='title'></span>").text(opt.title).appendTo(jSelWrap);
            }
            jSelect
                .appendTo(jSelWrap)
                .change(function(){
                    opt.action.apply(this);
                });
            jSelWrap.appendTo(jParent);

            return true;
        };

        function _onSearch (e)
        {
            if (e.which == 27) 
            {
                this.value = "";
            }


            var jThis = $(this);
            var sVal = this.value;
            var hDelay = jThis.data("delay");

            sVal ? jThis.next().show() : jThis.next().hide();

            if (hDelay)
            {
                clearTimeout (hDelay);
            }

            hDelay = setTimeout(function()
            {
                jThis.removeData("delay");

                var nLen = sVal.length;
                if ((nLen>0) && (nLen<2))
                {
                    // searching stop, if the input-string length is not more then  1
                    // return;
                }

                MListFilter.onFilter (opt, sVal);
                jParent.removeData("filterData");
            }, MyLocale.MList.searchDelay || 500);

            jThis.data("delay", hDelay);
        };

        var _jSearchInput;
        var createGlobalSearch = function ()
        {
            var jFilterDiv = $("<div class='filter-div advance-search'></div>");

            // create select
            var aSelectOpt = opt.select || [];
            if (!$.isArray(aSelectOpt))
            {
                aSelectOpt = [aSelectOpt];
            }
            for(var i=0; i<aSelectOpt.length; i++)
            {
                createSelect(aSelectOpt[i], jParent);
            }
            
            // search input
            _jSearchInput = $("<input type='text' maxlength='100' class='form-control search'>")
                .attr("placeholder", $.MyLocale.MList.search.SEARCH)
                .appendTo (jFilterDiv)
                .keyup (_onSearch);

           $("<i class='clear-icon hide'></i>")
                .insertAfter(_jSearchInput)
                .click(function(){
                    $(this).hide();
                    _jSearchInput.val("").focus().keyup();

                });

            // advance icon button
            var pfAction = opt.onShowFilterDlg || onShowFilterDlg;
            var jIconsCtn = $("<span></span>").appendTo (jFilterDiv);
            var oBtnRc = MyLocale.Buttons;
            var aDefButton =[
                {id:"mlist_filter", name:"filter", value:MyLocale.Buttons.FILTER, mode:Frame.Button.Mode.FILTER, action:pfAction}
            ];
            Buttons._makeHtml(jIconsCtn, aDefButton, false, opt);

            // append to page
            jFilterDiv.appendTo (jParent);
        };

        createGlobalSearch ();
    },

    resize: function (jMList)
    {
    },

    fillSelect: function(field, data)
    {
        function _fillOneSelect(sField, data)
        {
            var aOption = [""];
            var oData = data;
            var jEle = $("#mlist_filter_"+sField);

            if(!jEle.is("select"))
            {
                // not select, do nothing
                return;
            }

            if($.isArray(data))
            {
                oData = {};
                for(var i=0; i<data.length; i++)
                {
                    var sVal = data[i][sField];
                    if(undefined == sVal)
                    {
                        continue;
                    }
                    if(!oData[sVal]) oData[sVal] = 0;
                    oData[sVal] ++;
                }
            }

            for(var key in oData)
            {
                var val = oData[key] || "";
                if("number" == typeof(val))
                {
                    if(val > 0)
                    {
                        aOption.push("<option value='"+key+"'>"+Utils.Base.encode(key));
                    }
                }
                else
                {
                    aOption.push("<option value='"+key+"'>"+Utils.Base.encode(key));
                }
            }

            aOption.sort();
            aOption[0]="<option value='----'>all";
            $("#mlist_filter_"+sField).html(aOption.join(''));//.combobox();
        }

        var aFields = field;
        if("string" == typeof(field))
        {
            aFields = [field];
            _fillOneSelect(field, data);
        }
        for (var i=0; i<aFields.length; i++)
        {
            _fillOneSelect(aFields[i], data);
        }
    }
    ,"String": function(dataView, node, columns, col)
    {
        var sId = 'mlist_filter_' + col.id;

        node.empty();
        return $("<input maxlength=100 type='text'>")
            .attr ("name", sId)
            .attr ("id", sId)
            .attr ("index", col.index)
            .attr ("class", "filter-ele string")
            .attr ("columnId", col.id)
            // .keyup(function(e){MListFilter._doFilter.apply(this,[e, dataView, columns, false, "include"]);})
            .appendTo (node);
    }
    ,"Integer": function(dataView, node, columns, col)
    {
        var sId = 'mlist_filter_' + col.id;

        node.empty();
        return $("<input maxlength=20 type='text'>")
            .attr ("name", sId)
            .attr ("id", sId)
            .attr ("index", col.index)
            .attr ("class", "filter-ele integer")
            .attr ("columnId", col.id)
            // .keyup(function(e){MListFilter._doFilter.apply(this,[e, dataView, columns, true, "equal"]);})
            .appendTo (node);
    }
    ,"Order": function(dataView, node, columns, col)
    {
        function onInit(jSelect)
        {
            var aOptions = ["<option value=''>"];
            var d = col.data || [];
            var aData = Frame.ListString.format(d);
            for(var i=0; i<aData.length; i++)
            {
                var curItem = aData[i];
                aOptions.push("<option value='"+curItem.value+"'>" + curItem.text);
            }

            jSelect.html(aOptions.join(""));//.combobox();
        }

        var sId = 'mlist_filter_' + col.id;

        node.empty();
        var jSelect = $("<SELECT>")
            .attr ("name", sId)
            .attr ("id", sId)
            .attr ("index", col.index)
            .attr ("class", "filter-ele")
            .attr ("type", "text")
            .attr ("columnId", col.id)
            // .keyup(function(e){MListFilter._doFilter.apply(this,[e, dataView, columns, true, "equal"]);})
            .appendTo (node);

        var pfInit = (col.onInit) || onInit;
        pfInit(jSelect);

        return jSelect;
    }
    ,_doFilter: function(e, dataView, columns, bMatchCase, sCompare)
    {
        var sMlistid = $(this).parents().find('div[ctrlname="MList"]').attr("id");
        var opt = Frame.MList._getOpt(sMlistid);
        var paras = {columns:columns, searchString:[], matchcase:bMatchCase, cm:sCompare,opt:opt};
        if (e.which == 27) {
            this.value = "";
        }

        Slick.GlobalEditorLock.cancelCurrentEdit();

        $(this).parents(".slick-headerrow-columns").find("input.filter-ele, select.filter-ele").each(function(i)
        {
            var sCm = "include";
            var sValue = this.value;
            var sTagName = this.tagName.toUpperCase();

            if("SELECT" == sTagName)
            {
                sCm = "equal";
                if(""==this.value)
                {
                    sValue = "";
                }
                else sValue = this.options[this.selectedIndex].text;
            }
            if("" != sValue)
            {
                paras.searchString.push({col:parseInt($(this).attr("index")), cm:sCm, str:sValue});
            }
        });

        dataView.setFilterArgs(paras);
        dataView.refresh();
    }
    ,onFilter: function(oMlistOpt, filterData)
    {
        var aColumns = oMlistOpt.columns;
        var paras = {opt:oMlistOpt, searchString:[]};

        if (!filterData)
        {
        }
        else if ("string" == typeof(filterData))
        {
            paras.columns = aColumns;
            paras.searchString = filterData;
        }
        else for (var i=0; i<aColumns.length; i++)
        {
            var oColDef = aColumns[i];
            var sValue = filterData[oColDef.field];
            if (sValue)
            {
                var sCm = ("Order" == oColDef.datatype) ? "equal" : "include";
                paras.searchString.push({col:oColDef, cm:sCm, str:sValue});
            }
        };

        oMlistOpt.grid.resetActiveCell();
        oMlistOpt.grid.setSelectedRows([]);

        // call the filter in pages
        var bMatched = false;
        if (oMlistOpt.filter)
        {
            bMatched = oMlistOpt.filter(paras, oMlistOpt.data);
        }

        if (false === bMatched)
        {
            var dataView = oMlistOpt.dataView;
            dataView.setFilterArgs(paras);
            dataView.refresh();

            // ???
            Frame.MList.resize (oMlistOpt.mlistId);
        }
    }
    ,mathByCol: function (oItem, args)
    {
        var aFilterCol=args.searchString;

        var getChildrenContents = function(field, sCellData, children)
        {
            var contents = [];
            contents.push(sCellData);

            if ($.isArray (children))
            {
                for(var i=0; i<children.length; i++)
                {
                    if( children[i][field] && children[i][field] != "")
                    {
                        contents.push(children[i][field]);
                    }
                }
            }
            else
            {
                $.each(children, function(i, child)
                {
                    for(var i=0; i<child.length; i++)
                    {
                        if( child[i][field] && child[i][field] != "")
                        {
                            contents.push(child[i][field]);
                        }
                    }
                });
            }

            return contents;
        }
        function escapeRegex( value ) 
        {
            return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
        } 
        var filterItem = function(oData, bContent)
        {
            // filter sub-nodes
            var oAttr = oData._attr;
            if((null != oAttr.parent) && (false==bContent) && ((true===oAttr.show) || (false===oAttr.show)))
            {
                return oData._attr.show;
            }

            // Checing for all filters
            var bMatch = true;
            for(var col=0; (col<aFilterCol.length) && bMatch; col++)
            {
                var colDef = aFilterCol[col].col;
                var sFilterStr = aFilterCol[col].str;
                var sCellData = oData[colDef.field];

                if(colDef.formatter && ("Order"!=colDef.datatype))
                {
                    sCellData = colDef.formatter(-1, -1, sCellData, colDef, oData, "text");
                }
                sCellData = getChildrenContents(colDef.field, sCellData, oAttr.children || [] );

                // ��������������Ĺ�ϵ��ֻҪ��һ������������ƥ�䣬�Ͳ���ʾ����
                if("equal" == aFilterCol[col].cm)
                {
                    bMatch = false;
                    for(var i = 0;i<sCellData.length;i++)
                    {
                        if(sFilterStr == sCellData[i])
                        {  
                            bMatch = true;
                            break;
                        }
                    }
                }
                else
                {
                    sCellData = sCellData.join();
                    bMatch = (new RegExp(escapeRegex(sFilterStr), "gi")).test(sCellData);
                }
            }

            return bMatch;
        }

        var bMatch = true;

        if(aFilterCol.length > 0)
        {
            bMatch = filterItem(oItem, false);
        }

        return bMatch;
    }
    ,matchAllCol: function (oItem, args)
    {
        var aColumns=args.columns, sFilterStr=args.searchString;

        var filterColumns = function(oData, aColumns, sFilter)
        {
            var bMatchCell = false;

            // ignore the empty filters
            if("" == sFilter)
            {
                return true;
            }

            for(var j=0; j<aColumns.length; j++)
            {
                var colDef = aColumns[j];
                if(false == colDef.fltFormatter)
                {
                    continue;
                }

                var sCellData = oData[colDef.field];
                if(colDef.formatter)
                {
                    sCellData = colDef.formatter(-1, j, sCellData, colDef, oData, "text");
                }

                if((""+sCellData).toLowerCase().indexOf(sFilter) != -1)
                {
                    // matched the data;
                    bMatchCell = true ;
                    break;
                }
            }

            return bMatchCell;
        }

        var filterItem = function(oData, aFilter, bContent)
        {
            var bMatch = true;

            // filter sub-nodes
            var oAttr = oData._attr;
            if((null != oAttr.parent) && (false==bContent) && ((true===oAttr.show) || (false===oAttr.show)))
            {
                return oData._attr.show;
            }

            // filter the item contents
            for(var i=0; (i<aFilter.length) && bMatch; i++)
            {
                // ��������������Ĺ�ϵ��ֻҪ��һ������������ƥ�䣬�Ͳ���ʾ����
                bMatch = filterColumns (oData, aColumns, aFilter[i]);
            }

            return bMatch;
        }

        // search all children
        var filterChildren = function(children)
        {
            var bMatch = false;
            var aChildren = [];

            if ($.isPlainObject(children))
            {
                $.each(children, function(i, item)
                {
                    $.merge(aChildren, item);
                })
            }
            else
            {
                aChildren = children;
            }

            for(var i=0; (i<aChildren.length) && !bMatch; i++)
            {
                bMatch = filterItem(aChildren[i], aFilter, true);
                if(!bMatch)
                {
                    bMatch = filterChildren (aChildren[i]._attr.children || []);
                }
            }
            return bMatch;
        }

        var bMatch = true;

        if(sFilterStr)
        {
            var aFilter = sFilterStr.toLowerCase().split(' ');
            bMatch = filterItem(oItem, aFilter, false);

            if(!bMatch)
            {
                bMatch = filterChildren (oItem._attr.children || []);
            }
        }

        return bMatch;
    }
    ,filterGroup: function(oItem, opt)
    {
        var bShow = true;

        if(!opt.group)
        {
            return bShow;
        }

        var oAttr = oItem._attr;
        if (null != oAttr.parent)
        {
            var aData = opt.data;
            var oParent = aData[oAttr.parent];
            if(oParent._attr.collapsed)
            {
                bShow = false;
            }
            else if ((oAttr.parentNode)&&(oParent._attr.collapsedNode != oAttr.parentNode))
            {
                bShow = false;
            }
            else
            {
                bShow = oParent._attr.show;
            }
        }

        oAttr.show = bShow;
        return bShow;
    }
}
MList.Filter = MListFilter;


/*****************************************************************************
@FuncName, public, Frame.MList.Formatters
@DateCreated: 2013-06-08
@Author: huangdongxiao 02807
@Description: �����б������ʾת��������ת����������������б��и��ֲ�ͬ����ʾ���糬���ӡ��ı�������ɫ�ȡ�
<h3 id="formatter_link">����Ԫ����ӳ�����</h3>
�����������ַ�ʽ��
<li>һ�����ӵ����б���޸�ҳ�棻
���ַ�ʽ�Ƚϼ򵥣��޸�ҳ����������б����Ѿ���ȡ����ʹ��JS���޸�ҳ��ʱ����ͨ���������޸ĵ�������ֱ�Ӵ��ݵ��޸�ҳ���С�
�÷�ʽ��formatter���������Ѿ�����ã�����Ҫҳ���Լ���ӡ�
<p>���룺
<code>
{name:'Time', width:80, datatype:"String", link:{url: "Syslog.Add_page"}},
</code>
<li>��һ�������ӵ�����ҳ�档
<code>
// ����
{name:'RuleNum', modify:true, width:100, datatype:"Integer", formatter: onRueNumFormatter, showTip:false}

// ����ʵ��
function onRueNumFormatter(row, cell, value, colDef, dataContext, type)
{
    var val = (value||"");
    if("text" == type)
    {
        return val;
    }

    var sUrl = Utils.Base.createUrl({SrcZone:dataContext["SrcZone"], DestZone:dataContext["DestZone"]}, "M_ContentFilter_Policy");
    return "<a href='"+sUrl+"'>"+val+"</a>";
}

// M_ContentFilter_Policyҳ��ĳ�ʼ�������Ӳ������жϴ���
function _init()
{
    var oParas = Utils.Base.parseUrlPara();
    if(oParas.SrcZone && oParas.DestZone)
    {
        // init rule list
        g_oSelectPolicy = oParas;
        initRulesGrid();
        initRulesData();
    }
    else
    {
        // init group list
        initPolicyGrid();
        initPolicyData();
    }
    Frame.Debuger.info("ACL.ipv4.js init");
}
</code>

<h3 id="formatter_bgcolor">�ı䵥Ԫ��ı���ɫ</h3>
<code>
function stateShow(row, cell, value, colDef, oRowData, type)
{
    var val = (value||"");
    if("text" == type)
    {
        return val;
    }

    var aState_Data = getRcText("State_Data").split(";");
    var aStrCss =["","label-important","label-warning","label-success","label-warning","label-warning"];
    return '<span class="label '+aStrCss[value]+'">'+aState_Data[value]+'</span>';
}
</code>

@Usage:
var opt = {
    colNames:"Time,Group,Severity,Digest,Content",
    colModel:[
        {name:'Time', width:100, datatype:"String"},
        {name:'Module', width:80, datatype:"Order", data:"ACL,WEB,SHELL"},
        {name:'Severity', width:80, datatype:"String", formatter: <b>onSeveiryFormatter</b>},
        {name:'Digest', width:60, datatype:"Order", data:aDigest}
    ]
};

function onSeveiryFormatter(row, col, value, colDef, context, type)
{
    //opt.srcEle
    if("text" == type)
    {
        // returen a simple string for search
        return value;
    }

    return "&lt;span class='icon-ok'>&lt;/span>" + value;
}
@ParaIn:
    * row, Integer, ��Ԫ�����ڵ���
    * cell, Integer, ��Ԫ�����ڵ���
    * value, void, ����Ԫ���ֵ
    * colDef, Object, ��Ԫ��Ķ��壬�ڴ����б�ʱopt��ָ��
    * dataContext, Object, �����ݶ��󣬰����������е�ֵ
    * type, String, ��Ҫ���ص��ַ������ͣ�ȡֵΪ"html", "text"����type="html"ʱ���ص��ַ�������ΪHTML���뵽�б��С�
@Return: String, ƴ�õ�һ���ַ���
@Caution:
    <li>��type��"html"ʱ�����ص��ַ���������һ����ȷ��������HTML����������ܻ�����ҳ�沼�ִ��ҡ�
    <li>��type��"text"ʱ�����ص��ַ�������Ϊ���ı����ڲ�ѯ�ȷ���ʾ��;�������formatter����������и�ʽ�ϵ���ʾ�޸�ʱ���������������������
@Modification:
    * yyyy-mm-dd: Auth, add or modify something
*****************************************************************************/
var Formatters =
{
    "Order": function (row, cell, value, colDef, dataContext, sType)
    {
        if (value == null || value === "") {
          return MyLocale.EMPTY;
        }

        var d = colDef["data"];
        if(!d)
        {
            return Utils.Base.encode(value);
        }

        var aData = Frame.ListString.format(d);
        var sText = Frame.ListString.getTextByValue(aData, value);
        return Utils.Base.encode(sText);
    },
    "Percent": function (row, cell, value, colDef, dataContext)
    {
        if (value == null || value === "")
            return "-";
        if (value < 50) {
            return "<span style='color:red;font-weight:bold;'>" + value + "%</span>";
        }
        return "<span style='color:green'>" + value + "%</span>";
    },
    "Checkbox": function(row, cell, value, colDef, dataContext, type)
    {
        if("text" == type)
        {
            return value;
        }
        return ("true"==value) ? "<i class='icon-ok'></i>" : "";
    },
    "PercentCompleteBar": function (row, cell, value, colDef, dataContext)
    {
        if (value == null || value === "") {
            return "";
        }

        var color = (value < 30) ? "red" : ((value < 70) ? "silver" : "green");
        return "<span class='percent-complete-bar' style='background:" + color + ";width:" + value + "%'></span>";
    },
    "Checkmark": function (row, cell, value, colDef, dataContext)
    {
        return value ? "<span class='ui-icon ui-icon-check'></span>" : "";
    },
    "Operator": function (row, cell, value, colDef, dataContext)
    {
        var oIcons = colDef.icons;
        return makeIconsHtml(oIcons);
    },
    "Default": function (row, cell, value, colDef, dataContext, type)
    {
        var val = (value||MyLocale.EMPTY);
        if("text" == type)
        {
            return val;
        }

        return Utils.Base.encode(val);
    },
    "Group": function (row, cell, value, colDef, dataContext, type)
    {
        value = value||"";
        if("text" == type)
        {
            return value;
        }

        var sHtml;
        var oAttr = dataContext._attr;
        var nIndent = oAttr["indent"];
        var spacer = "";

        value = value.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
        if (colDef.groupFormatter)
        {
            value = colDef.groupFormatter(row, cell, value, colDef, dataContext, type);
        }

        if(nIndent && (nIndent>0))
        {
            spacer = "<span style='display:inline-block;height:1px;width:" + (15 * nIndent) + "px'></span>";
        }
        if (oAttr.children)
        {
            var aChildren = $.isArray(oAttr.children) ? oAttr.children : oAttr.children[colDef.id];

            var sEmpty = " <span class='toggle empty parent'></span>&nbsp;" + value;
            var sExpand = " <span class='toggle expand' column='"+colDef.id+"'></span>&nbsp;" + value;
            var sCollapse = " <span class='toggle collapse' column='"+colDef.id+"'></span>&nbsp;" + value;

            if ($.type(aChildren)=="object") sHtml = sEmpty;
            else if (0 === aChildren.length) sHtml = sEmpty;
            else if (!oAttr.collapsed)        sHtml = sCollapse;
            else if (oAttr.collapsedNode==colDef.id) sHtml = sExpand;
            else                             sHtml = sExpand;
        }
        else
        {
            sHtml = value;
        }

        return spacer + sHtml;
    }
};
Frame.Formatters = Formatters;

var Group = {
    create: function(grid, dataView, opt)
    {
        if(!opt.group)
        {
            return ;
        }

        grid.onClick.subscribe(function (e,args)
        {
            if(!$(e.target).hasClass("toggle"))
            {
                return;
            }

            var cell = grid.getCellFromEvent(e);
            var row = cell.row;
            var item = dataView.getItem(row);
            if (item)
            {
                var sName = $(e.target).attr("column")||"";
                var oAttr = item._attr;
                if((!oAttr.collapsedNode)||(sName == oAttr.collapsedNode))
                {
                    oAttr.collapsed = !oAttr.collapsed;
                }
                oAttr.collapsedNode = sName;

                dataView.updateItem(item[idProperty], item);
            }

            e.stopImmediatePropagation();
        });
    },
    getRoot: function(aData, oNode)
    {
        var oParent = oNode;
        while (oParent._attr.indent > 0)
        {
            oParent = aData[oParent._attr.parent];
        }
        return oParent;
    }
}

// aParas: row, cell, value, colDef, dataContext, type
var VALUE_COL = 2;
var COLDEF_COL = 3;
var CONTEXT_COL = 4;
var TYPE_COL = 5;
function onSmallFormatter(aParas, opt)
{
    var aCell = [];
    var sCheckBox = "";
    var options = opt.opt;
    var columns = opt.columns;
    var sFirstCell = opt.formatter.apply(this, aParas);

    if ("text" == aParas[TYPE_COL] )
    {
        return sFirstCell;
    }

    if (opt.mlist.is(".mobile"))
    {
        var nCols = (true===options.multiSelect) ? (options.small.briefColCount+1) : options.small.briefColCount;
        
        if(nCols>columns.length)
        {
            nCols = columns.length;
        }

        for (var i=0; i<nCols; i++) // columns.length
        {
            var oCurCol = columns[i];
            aParas[VALUE_COL] = aParas[CONTEXT_COL][oCurCol.field];
            aParas[COLDEF_COL] = oCurCol;

            if ("_checkbox_selector" == oCurCol.id)
            {
                sCheckBox = oCurCol.formatter.apply(this, aParas);
            }
            else
            {
                var sText = (0 != oCurCol.briefOrder) ? oCurCol.formatter.apply(this, aParas) : sFirstCell;
                aCell.push ('<div style="float:left">'+oCurCol.name+'</div><div style="text-align:right">' + sText + '</div>');
            }
        }
    }

    return '<div class="first-cell-row">' + sCheckBox + sFirstCell + '</div>' 
         + '<div class="cells"><div class="cell-row">' + aCell.join('</div><div class="cell-row">') + '</div></div>';
}


var MListToolbar = {
    // �б����
    "caption": {
        showOnTop: true,
        attr: {},
        css: "caption",
        init: function (grid, dataView, jContainer)
        {
        },
        formatter: function ()
        {
            return "<h3 class='ui-corner-tl ui-corner-tr sec-title'>"+this.caption+"</h3>";
        }
    }
    // ������
    ,"Toolbar": {
        showOnTop: true,
        attr: {},
        css: "mlist-toolbar",
        init: function (grid, dataView, jContainer)
        {
        },
        formatter: function (opt, jParent)
        {
            function doFilter(val)
            {
                Slick.GlobalEditorLock.cancelCurrentEdit();

                var dataView = opt.dataView;
                var paras = {opt:opt,columns:opt.columns, searchString:val, matchcase:false, cm:"include"};
                dataView.setFilterArgs(paras);
                dataView.refresh();
            }

            // �߼�����
            MListFilter.create(opt, jParent, doFilter);

            // �б�ȫ�ְ�ť
            Buttons.create (jParent, opt);

            return null;
        }
    }
    // ������
    ,"Togglebar": {
        showOnTop: true,
        attr: {},
        css: "toggle-bar",
        init: function (grid, dataView, jContainer)
        {
        },
        formatter: function (opt, jParent)
        {
            $("<i class='icon custom-icon' show='false'></i>")
                .click (function (e)
                {
                    if("true" == $(this).attr("show"))
                    {
                        $(this).attr("show","false");
                    }
                    else
                    {
                        $(this).attr("show","true");
                    }
                    jContent.toggle();
                    resizeMList (jMList);
                })
                .appendTo (jParent);


            return null;
        }
    }
    // ��ҳ״̬��
    ,"Page": {
        showOnTop: false,
        attr: {},
        css: "mlist-page",
        init: function (grid, dataView, jContainer)
        {
            new Slick.Controls.Pager(dataView, grid, jContainer);
        },
        formatter: function ()
        {
            return "";
        }
    }
    // �Զ���״̬����һ����ҳ�涨��
    ,"Status": {
        showOnTop: false,
        attr: {},
        css: "mlist-status",
        init: function (grid, dataView, jContainer)
        {
        },
        formatter: function (opt, jParent)
        {
            // ����Toolbar���򣬰�����ѡ��������صĸ��ఴť
            StatusBar.create (opt, jParent);
            return null;
        }
    }
}

// ת��mlist��ѡ�����Ϊslick�ؼ���ѡ�����
/*
      explicitInitialization: false, // ��ʽ��ʼ��
      rowHeight: 25,    // �и�
      defaultColumnWidth: 80,
      enableAddRow: false,  // ���Զ�����еĹ���
      leaveSpaceForNewRows: false,  // �Զ������ʱ�ǵ����б�ĵײ�Ԥ���հ�
      editable: false,  // �Ƿ������б�༭
      autoEdit: true,   // �б��Զ��༭����editable=trueʱ�����ڵ�Ԫ����˫�������б༭�����Ҹÿ�ͷ��ʱ����Ԫ����½����ͽ���༭״̬
      enableCellNavigation: true,   // �򿪼����ƶ�������ͨ���ϡ��¡����ҡ�Tab��Shift+Tab���ƶ���Ԫ��Ľ��㡣
      enableColumnReorder: true,    //
      asyncEditorLoading: false,    //
      asyncEditorLoadDelay: 100,    //
      forceFitColumns: false,   // �Զ������п�ʹ�����������Ŀ�ȣ��Ҳ�����ˮƽ������
      enableAsyncPostRender: false, //
      asyncPostRenderDelay: 50, //
      autoHeight: false,    //
      editorLock: Slick.GlobalEditorLock,   //
      showHeaderRow: false, //
      headerRowHeight: 25,  //
      showTopPanel: false,  //
      topPanelHeight: 25,   //
      formatterFactory: null,   //
      editorFactory: null,  //
      cellFlashingCssClass: "flashing", //
      selectedCellCssClass: "selected", //
      multiSelect: true,    //
      enableTextSelectionOnCells: false,    //
      dataItemColumnValueExtractor: null,   //
      fullWidthRows: false, //
      multiColumnSort: false,   //
      defaultFormatter: defaultFormatter,   //
      forceSyncScrolling: false //
*/
function parseOpt(sMListId, opt)
{
    var Edt = Frame.Editors;
    var Flt = MListFilter;
    var Fmt = Formatters;
    var Srt = Sorter;
    var map = {
        "Port":     {editor: Edt.Text,    fltFormatter:Flt.String,   sorter:Srt.Port,     formatter: Fmt.Default },
        "String":   {editor: Edt.String,  fltFormatter:Flt.String,   sorter:Srt.String,   formatter: Fmt.Default },
        "EString":  {editor: Edt.Text,    fltFormatter:Flt.String,   sorter:Srt.String,   formatter: Fmt.Default },
        "IString":  {editor: Edt.Text,    fltFormatter:Flt.String,   sorter:Srt.String,   formatter: Fmt.Default },
        "Integer":  {editor: Edt.Integer, fltFormatter:Flt.Integer,  sorter:Srt.Integer,  formatter: Fmt.Default },
        "Order":    {editor: Edt.Context, fltFormatter:Flt.Order,    sorter:Srt.String,   formatter: Fmt.Order   },
        "Date":     {editor: Edt.Date,    fltFormatter:Flt.String,   sorter:Srt.String,   ormatter:  Fmt.Date    },
        "IP":       {editor: Edt.Ip,      fltFormatter:Flt.String,   sorter:Srt.String,   ormatter:  Fmt.Default },
        "Mask":     {editor: Edt.Mask,    fltFormatter:Flt.String,   sorter:Srt.String,   formatter: Fmt.Default },
        "Ipv4":     {editor: Edt.Ipv4,    fltFormatter:Flt.String,   sorter:Srt.IPv4,     formatter: Fmt.Default },
        "Ipv6":     {editor: Edt.Ipv6,    fltFormatter:Flt.String,   sorter:Srt.IPv6,     formatter: Fmt.Default },
        "Mac":      {editor: Edt.Mac,     fltFormatter:Flt.String,   sorter:Srt.String,   formatter: Fmt.Default },
        "Checkbox": {editor: Edt.Checkbox,fltFormatter:Flt.Integer,  sorter:Srt.Integer,  formatter: Fmt.Checkbox},
        "ToggleText":{editor:Edt.ToggleText,fltFormatter:Flt.Order,  sorter:Srt.String,   formatter: Fmt.Order},
        "Text":     {editor: Edt.LongText,fltFormatter:Flt.String,   sorter:Srt.String,   formatter: Fmt.LongText},
        "Percent":  {editor: Edt.Percent, fltFormatter:Flt.String,   sorter:Srt.String,   formatter: Fmt.Percent },
        "Operator": {editor: false,       fltFormatter:false,        sorter:false,        formatter: Fmt.Operator},
        "Default":  {editor: Edt.Text,    fltFormatter:Flt.String,   sorter:Srt.String,   formatter: Fmt.Default },
        "Group":    {editor: false,       fltFormatter:Flt.String,   sorter:Srt.String,   formatter: Fmt.Group   }
    }

    // ��mlist opt����Slick.Grid�ؼ����ж���
    var col, oFirstColum=false;
    var aTitle;
    var columns = opt.columns = [];
    var colModels = opt.colModel;
    var checkboxSelector = false;
    var oOperatorColDef = {width:30, resizable: false, showTip:false, visible:true};
    var jMList = $("#"+sMListId);

    opt.colNames = opt.colNames || jMList.attr("header");
    if("string"==typeof(opt.colNames))
    {
        aTitle = opt.colNames.split(",");
        opt.colNames = aTitle;
    }
    else
    {
        aTitle = opt.colNames;
    }

    if (opt.group)
    {
        opt.multiSelect = false;
    }

    if(true === opt.multiSelect)
    {
        checkboxSelector = new Slick.CheckboxSelectColumn({
            cssClass: "slick-cell-checkboxsel"
        });

        col = checkboxSelector.getColumnDefinition();

        col.add = false;
        col.fltFormatter = false;
        col.briefOrder = 990;
        col.visible = true;

        columns.push(col);
        opt.checkboxSelector = checkboxSelector;
    }

    // add operator column
    if(opt.showNo)
    {
        var col = {
            id:"mlist_no",
            name: "No",
            field:"MListNo",
            width: 30,
            add: false,
            fltFormatter: false,
            briefOrder: 992
        };
        col.srcWidth = col.width;
        columns.push(col);
    }

    for(var i=0; i<colModels.length; i++)
    {
        var oCurCol = colModels[i];
        var sDataType = oCurCol.datatype || "String";
        if("text"==sDataType)
        {
            sDataType = "String";
        }

        if (false === oCurCol.support)
        {
            continue;
        }

        var col = {
            index: columns.length,
            id:oCurCol.name,
            field:oCurCol.name,
            showTip: true,
            sortable: true,
            briefOrder: (undefined===oCurCol.briefOrder) ? i : oCurCol.briefOrder,
            formatter: map[sDataType].formatter,
            editor: map[sDataType].editor,
            fltFormatter: map[sDataType].fltFormatter,
            sorter: map[sDataType].sorter,
            header:{menu:{item:{}}}
        };

        if("Operator" == sDataType)
        {
            $.extend(col, oOperatorColDef);
        }
        $.extend(col, oCurCol, {name:aTitle[i]});

        // can't be sort when group
        if(opt.group)
        {
            col.sortable = false;
        }

        // save the first column
        if (0 == col.briefOrder)
        {
            oFirstColum = col;
        }

        columns.push(col);
    }

    // add operator column
    if(opt.operations)
    {
        var col = {
            id:"mlist_operation",
            name:MyLocale.MList.operation,
            field:"Operation",
            width: opt.operations.width||300,
            icons: opt.operations.icons,
            add: false,
            fltFormatter: false,
            briefOrder: 999,
            formatter: opt.operations.formatter||map["Operator"].formatter
        };
        col.srcWidth = col.width;
        columns.push(col);
    }

    for(var i=0; i<columns.length; i++)
    {
        columns[i].srcWidth = columns[i].width;
    }

    var options = {
        // slick grid options
        forceFitColumns: true
        ,autoEdit: false
        ,editable: false
        ,enableTextSelectionOnCells: true
        ,showHeaderRow: true
        ,headerRowHeight: MyConfig.MList.rowHeight
        ,rowHeight: MyConfig.MList.rowHeight
        ,enableColumnReorder: false
        ,explicitInitialization: true
        ,autoHeight: false
        ,multiSelect: false
        //,height: "full"
        //,fullWidthRows: true

        // custom options
        ,showPages: MyConfig.MList.pageBar
        ,showStatus: MyConfig.MList.statusBar
        ,search: (opt.search!==false)
        ,rowSize: opt.rowSize || 1
        ,small: {}
    };

    if(jMList.hasClass("sub"))
    {
        options.rowHeight = MyConfig.MList.subRowHeight;
    }
    else
    {
        var nRowCount = options.rowSize;
        options.rowHeight = MyConfig.MList.rowHeight * nRowCount + MyConfig.MList.ROW_MARGIN;
    }

    function getSmallFormatter(pfFirstFormatter, jMList, columns)
    {
        return function (row, cell, value, colDef, dataContext, type)
        {
            var aParas = [row, cell, value, colDef, dataContext, type];
            var opt = {
                formatter: pfFirstFormatter,
                mlist: jMList,
                columns: columns,
                opt: options
            };
            return onSmallFormatter (aParas, opt);
        }
    }

    var pfFirstFormatter = oFirstColum.formatter;
    oFirstColum.formatter = getSmallFormatter(pfFirstFormatter, jMList, columns);
    $.extend(options, opt);
    $.extend(options.small, {briefColCount: 3});

    options.toolbar = options.toolbar || [];

    for (var i=0; i<options.toolbar.length; i++)
    {
        options.toolbar[i].css = (options.toolbar[i].css || "") + " custom-bar";
    }

    if (options.search)
    {
        options.toolbar.unshift (MListToolbar["Toolbar"]);
        options.toolbar.unshift (MListToolbar["Togglebar"]);
    }
    if (options.caption)
    {
        MListToolbar["caption"].caption = options.caption;
        options.toolbar.unshift (MListToolbar["caption"]);
    }

    if (options.showPages)
    {
        options.toolbar.push (MListToolbar["Page"]);
    }
    if (options.showStatus)
    {
        options.toolbar.push (MListToolbar["Status"]);
    }

    return options;
}

function addAttrs(jObj, oAttr)
{
    oAttr = oAttr || {};
    for (var key in oAttr)
    {
        jObj.attr(key, oAttr[key]);
    }
}

function createToolbar (jMList, opt, bTop)
{
    var aToolbarOpt = opt.toolbar || [];
    for (var i=0; i<aToolbarOpt.length; i++)
    {
        var oInfo = aToolbarOpt[i];
        if (oInfo.showOnTop == bTop)
        {
            // create tag
            var jDiv = $("<div class='mlist-status-bar'></div>");
            addAttrs(jDiv, oInfo.attr);
            if (oInfo.css)
            {
                jDiv.addClass(oInfo.css);
            }

            // create content
            if (oInfo.formatter)
            {
                var sHtml = oInfo.formatter (opt, jDiv);
                if (null !== sHtml)
                {
                    jDiv.html (sHtml);
                }
            }
            else if (oInfo.content)
            {
                $(oInfo.content).remove().appendTo(jDiv);
            }

            // append to MList
            jDiv.appendTo(jMList);
            jDiv.data('instance', oInfo);
        }
    }
}

function initToolbar (jMList, grid, dataView)
{
    $(".mlist-status-bar", jMList).each(function(i, oBar)
    {
        var jBar = $(oBar);
        var oInstance = jBar.data("instance");
        oInstance.init && oInstance.init (grid, dataView, jBar);
    })
}

function resizeMList (jMList)
{
    var opt = jMList.data("opt");
    var jBody = jMList.find(".mlist-body");
    var grid = opt.grid;

    if(opt.autoHeight)
    {
        return;
    }

    if ($(window).width() <= MyConfig.MList.smallWidth)
    {
        var jToolBar = $(".mlist .mlist-toolbar");
        var sShow = $(".toggle-bar .custom-icon").attr("show");
        if("true" == sShow)
        {
            jToolBar.show();
        }
        else
        {
            jToolBar.hide();
        }
        var h = opt.rowHeight;
        var n = opt.small.briefColCount;
        var rowHeight = (n*h) - ((n-1)*h/3);  // 
        jMList.addClass("mobile");
        grid.setOptions({autoHeight:true, rowHeight: rowHeight});
        jBody.height ("auto");
        $(".slick-header-columns", jMList).hide();
        Frame.MList.showColumns(opt, 1);
    }
    else
    {
        jMList.removeClass("mobile");
        $(".mlist .mlist-toolbar").show();

        var oStyle = Frame.Util.parseStyle(jMList.closest(".sub-page").attr("style"));
        if(("auto" == oStyle.height) || ("auto"==opt.height))
        {
            //$(".slick-viewport", jMList).height("auto");
            jBody.height("auto");
            grid.setOptions({autoHeight:true});
            $(".slick-header-columns", jMList).show();
            Frame.MList.showColumns(opt, "auto");
        }
        else
        {
            grid.setOptions({autoHeight:false, rowHeight: MyConfig.MList.rowHeight*opt.rowSize+MyConfig.MList.ROW_MARGIN});
            $(".slick-header-columns", jMList).show();

            var nHeight = opt.height;
            if("full" == (opt.height||"full"))
            {
                // ����ȥ5�����������Ϊʲô��
                jBody.hide();
                var nFrameTopHeight = 0;
                if($("#menu_div").hasClass("mobile"))
                {
                    nFrameTopHeight = $("#frame_top").outerHeight()-10;
                }

                // nHeight = document.documentElement.clientHeight - jMList.closest(".sub-page").outerHeight() - 5 - nFrameTopHeight;
                var h = 0;
                $(".mlist-status-bar", jMList).each(function(i, oDiv)
                {
                    h += $(oDiv).outerHeight ();
                });

                var nCtnHeight = jMList.closest(".page-container").height();
                nHeight = nCtnHeight - jMList.position().top - h;
                jBody.show();
            }

            // set height of TBody
            jBody.height (nHeight);

            Frame.MList.showColumns(opt, "all");
        }
    }
    grid.resizeCanvas();
    grid.invalidate();

}

$.extend(MList,
{
    NAME: MODULE_NAME,

    resize: function(sMListId)
    {
        var sSelector = (sMListId) ? "#"+sMListId : ".mlist[ctrlName=MList]";
        $(sSelector).each(function(){resizeMList ($(this));});
    },

/*****************************************************************************
@FuncName: private, Frame.MList.init
@DateCreated: 2013-06-08
@Author: huangdongxiao 02807
@Description: �б�ĳ�ʼ����������ϵͳ��ʼ��ʱ����һ�Σ������б��һЩȫ�����ԡ���ҳ���в���Ҫ���á�
@Usage:
@ParaIn:
@Return:
@Caution:
@Modification:
    * yyyy-mm-dd: Auth, add or modify something
*****************************************************************************/
    _init: function()
    {
        //$.extend($.jgrid, MyLocale.Jgrid);
        Frame.DBM && Frame.DBM.load(MList.NAME);

        Frame.regNotify(MODULE_NAME, "resize",  function(){MList.resize()});
        Frame.regNotify(MODULE_NAME, "language.changed",  function()
        {
            MyLocale = $.MyLocale;
            Frame.MList.message = $.MyLocale.MList;
        });

        // �򿪻��߹ر����ҳ��ʱ��Ҫ���ػ�����ʾ�б�Ĳ�����
        // Frame.regNotify("newPage", "open",  showMList3Columns);
        // Frame.regNotify("newPage", "close", showMListAllColumns);
    },

/*****************************************************************************
@FuncName: public, Frame.MList.create
@DateCreated: 2013-06-08
@Author: huangdongxiao 02807
@Description: �б�Ĵ���������
@Usage:
@ParaIn:
    * sMListId, String, MLIST ID�ַ���
    * opt, #MListOption, �����б�ʱ��ѡ��
@Return:
@Caution:
@Modification:
    * yyyy-mm-dd: Auth, add or modify something
*****************************************************************************/
    create: function(sMListId, opt)
    {
        // ��չ�б��Ĭ������
        //$.extend(opt,MListOption, {mlistId: sMListId});

        var jMList = $("#"+sMListId);
        if(jMList.length == 0)
        {
            return false;
        }

        if(jMList.attr("ctrlName"))
        {
            return false;
        }

        var oPopMenu = false;
        var options = parseOpt(sMListId, opt);

        jMList.attr("ctrlName", "MList");
        options.mlistId = sMListId;

        if("full" == (opt.height||"full"))
        {
            jMList.closest(".sub-page").addClass ("mlist-container");
        }

        jMList.css("width", options.width || "100%");
        if (true === options.multiSelect)
        {
            jMList.addClass ("multi-select");
        }

        function onOperationClick(jTarget, row)
        {
            var type = jTarget.attr("type");
            var icon = options.operations.icons[type];
            var action = ($.isFunction(icon)) ? icon : icon.action;

            action(row);
        }

        // toolbar on top
        createToolbar (jMList, options, true);

        // table body
        var sBodyID = Frame.Util.generateID("mlistbody");
        $('<div id="'+sBodyID+'" class="mlist-body"></div>').appendTo(jMList);

        // Loading icon
        $('<div class="loading mlist-loading"></div>').appendTo(jMList);

        // toolbar on bottom
        createToolbar (jMList, options, false);

        //=======================================================
        // ׼��Slick.Grid�ؼ������ѡ��
        //=======================================================
        var columns = options.columns;

        // call the API of Slick.Grid for creating the MLIST
        var dataView = new Slick.Data.DataView({groupItemMetadataProvider: null, inlineFilters: true });
        var grid = new Slick.Grid("#"+sBodyID, dataView, columns, options);

        Group.create(grid, dataView, options);

        // multiSelect
        grid.setSelectionModel(new Slick.RowSelectionModel({selectActiveRow:true}));
        if(options.checkboxSelector)
        {
            grid.registerPlugin(options.checkboxSelector);
        }

        if(false !== options.showRowButton)
        {
            var jGrid = jMList.find(".grid-canvas");
            RowToolbar.create (jGrid, options);
        }

        // right menu of column header
        if(false !== options.columnChange)
        {
            var jMenuBtn = $("<span class='slick-header-column mlist-context-btn icon-list'></span>").appendTo($('.slick-header', jMList));
            oPopMenu = Slick.Controls.ColumnPicker(columns, grid, {menuBtn:jMenuBtn});
        }

        dataView.setFilterArgs({searchString: "", opt:options});
        dataView.setFilter(Database.filter);

        // events for grid
        grid.onCellChange.subscribe(function (e, args)
        {
            dataView.updateItem(args.item[idProperty], args.item);
        });
        grid.onClick.subscribe(function (e,args)
        {
            var jTarget = $(e.target);
            var sClass = jTarget.attr("class") || "";
            if(-1 != sClass.indexOf("mlist-opt-icon"))
            {
                if (!grid.getEditorLock().commitCurrentEdit())
                {
                  return;
                }
                onOperationClick(jTarget, cell.row);
                e.stopPropagation();
                return ;
            }
        });

        function _doSort (dataView, args)
        {
            var pfCompare = args.sortCol.sorter;
            var sortOpt = {};

            pfCompare && dataView.sort(function comparer(a, b)
            {
                return pfCompare(a, b, args.sortCol, sortOpt);
            }, args.sortAsc);
        }

        var _curSortCol = null;
        grid.onSort.subscribe(function (e, args)
        {
            _curSortCol = args;
            _doSort (dataView, args);
        });

        grid.onSelectedRowsChanged.subscribe(function(e, args)
        {
            Frame.notify(MODULE_NAME, "rowchanged", {opt:options, args:args});
        });

        grid.onActiveCellChanged.subscribe(function(e, args)
        {
            if(options._activeRow != args.row)
            {
                options._activeRow = args.row;
                // MList._updateHelpPanel(options, args.row);
            }
        });

        // wire up model events to drive the grid
        dataView.onRowCountChanged.subscribe(function (e, args)
        {
            grid.updateRowCount();
            $(".data-count").html(dataView.getLength());
            $(".toolbar .data-count").html(dataView.getLength());
            // grid.render();

            //Frame.Menu.updateSummary(false, grid.getDataLength()+'/'+opt.data.length);
            //$("#"+sMListId+" .mlist-pages .summary").html("Total: "+aData.length);
        });

        dataView.onRowsChanged.subscribe(function (e, args)
        {
            grid.invalidateRows(args.rows);
            grid.updateSelectedRangesChanged();
            grid.render();
        });

        grid.onCanvasMouseLeave.subscribe(function (e,args)
        {
            var jRowToolbar = $(".row-toolbar",jMList);
            jRowToolbar.addClass("hide");
        });

        grid.onRowMouseEnter.subscribe(function (e,args)
        {//args {row: cell.row, cell: cell.cell, item: item}
            var jTarget = $(e.target);
            var jActiveRow = jTarget.closest(".slick-row");
            var opt = jMList.data("opt");
            var jRowToolbar = $(".row-toolbar",jMList);

            var sTop = (jMList.width() <= MyConfig.MList.smallWidth) 
                ? (jActiveRow.offset().top- jGrid.offset().top) + "px" 
                : jActiveRow.css("top");

            var nRowH = parseInt(jActiveRow.height())-1;

            jRowToolbar.css({"top":sTop, "height": nRowH +"px","line-height":nRowH - 9 + "px"});
            
            if("checked" == jActiveRow.find(":checkbox").attr("checked"))
            {
                jRowToolbar.removeClass("hover").addClass("active");
            }
            else
            {
                jRowToolbar.removeClass("active").addClass("hover");
            }
            
            Frame.notify(MODULE_NAME, "rowHoverchanged", {opt:options,args:args});
            
            //e.stopPropagation();
            //e.preventDefault();
        });

        grid.init();
        initToolbar (jMList, grid, dataView);

        grid.setOptions({showHeaderRow: false});
        options.popMenu = oPopMenu;
        options.data = options.data || [];
        options.dataView = dataView;
        options.grid = opt.grid = grid; // take grid to the caller
        jMList.data("opt",options);

        // this.showColumns(options, "auto");
        Frame.notify(MODULE_NAME, "rowchanged", {opt:options});
        MList.resize();

        return true;
    },

/*****************************************************************************
@FuncName: public, Frame.MList.destroy
@DateCreated: 2013-06-08
@Author: huangdongxiao 02807
@Description: �б�����ٺ�����һ������²���Ҫ���á���ҳ������Ҫ��ͬһ��Ԫ�����л���ͬ���б�ʱ��
        ���л�ǰ��Ҫ������ǰһ�б�
@Usage:
@ParaIn:
    * sMListId, String, MLIST ID�ַ���
@Return:
@Caution:
@Modification:
    * yyyy-mm-dd: Auth, add or modify something
*****************************************************************************/
    destroy:function(sMListId)
    {
        var opt = this._getOpt(sMListId);
        if(opt)
        {
            delete opt.data;
            opt.popMenu && opt.popMenu.destroy();
            opt.grid.destroy();
        }

        var jMList = $("#"+sMListId);
        jMList.removeAttr("ctrlName").removeClass("mlist").removeData("opt").empty();
        jMList.closest(".sub-page").removeClass ("mlist-container");
        $("#tabContent").removeClass ("mlist-container");
    },

/*
@FuncName: private, Frame.MList._getOpt
*/
    _getOpt: function(mlist)
    {
        var jMList = ("string" == typeof(mlist)) ? $("#"+mlist) : mlist;
        return jMList.data("opt");
    },


/*****************************************************************************
@FuncName: public, Frame.MList.appendData
@DateCreated: 2013-06-08
@Author: huangdongxiao 02807
@Description: ���б���׷������
@Usage:
@ParaIn:
    * sMListId, String, MLIST ID�ַ���
    * aData, Array, �б�����
@Return:
@Caution:
@Modification:
    * yyyy-mm-dd: Auth, add or modify something
*****************************************************************************/
    appendData: function(sMListId, aData)
    {
        var jMList = $("#"+sMListId);
        var opt = jMList.data("opt");
        if(!opt) return;

        if(opt.showNo)
        {
            for(var i=0, len=aData.length; i<len; i++)
            {
                aData[i].MListNo = i+1;
            }
        }

        opt.data = opt.data.concat(aData);

        var dataView = opt.dataView;
        dataView.beginUpdate();
        dataView.setItems(opt.data);
        dataView.endUpdate();

        $(".mlist-loading", jMList).hide();
    },

/*****************************************************************************
@FuncName: public, Frame.MList.refresh
@DateCreated: 2013-06-08
@Author: huangdongxiao 02807
@Description: ʹ��������ˢ���б�ˢ�º�ԭ�е����ݽ������ڡ��б��ڴ���ʱ����ʾloading��
    loading״̬���ڵ���Frame.MList.refresh��Frame.MList.appendData����ʧ��
@Usage:
@ParaIn:
    * sMListId, String, MLIST ID�ַ���
    * aData, Array, �б�����
    * bKeepSearch, boolean, default is false. �Ƿ�����ѯ����.
@Return:
@Caution:
@Modification:
    * yyyy-mm-dd: Auth, add or modify something
*****************************************************************************/
    refresh: function(sMListId, aData, bKeepSearch)
    {
        var jMList = $("#"+sMListId);
        var opt = jMList.data("opt");
        if(!opt) return;

        if(opt.showNo)
        {
            for(var i=0, len=aData.length; i<len; i++)
            {
                aData[i].MListNo = i+1;
            }
        }

        if (opt.procData)
        {
            oData = opt.procData (aData);
        }

        opt.data = aData;

        for(var i=0; i<aData.length; i++)
        {
            var oAttr = aData[i]._attr || {};

            var bIsCollapsed = true;
            if(opt.group == "close"){
                bIsCollapsed =true;
            }
            else if(opt.group == "open")
            {
                bIsCollapsed = false;
            }
            else
            {
                bIsCollapsed = (oAttr.indent >= opt.group);
            }

            oAttr.collapsed = (false===oAttr.collapsed) ? false : bIsCollapsed;

            if(opt.group)
            {
                oAttr.indent = (null == oAttr.parent) ? 0 : ((aData[oAttr.parent])._attr.indent+1);
            }
            aData[i]._attr = oAttr;

            aData[i][idProperty] = Frame.Util.generateID(sMListId);
        }

        opt.grid.resetActiveCell();
        opt.grid.setSelectedRows([]);

        var dataView = opt.dataView;

        if (!bKeepSearch)
        {
            dataView.setFilterArgs({searchString: "", opt:opt});
        }

        dataView.beginUpdate();
        dataView.setItems(opt.data, idProperty);
        dataView.endUpdate();

        // pre sort
        var _curSortCol = opt.multiSelect ? opt.columns[1]: opt.columns[0];
        if(_curSortCol.sortable)
        {
            var pfCompare = _curSortCol.sorter;

            opt.grid.setSortColumn(_curSortCol.id, true);

            pfCompare && dataView.sort(function comparer(a, b)
            {
                return pfCompare(a, b, _curSortCol);
            }, true);
        }
        

        var jGlobalFilter = $(".mlist-toolbar .filter", jMList);
        if ((jGlobalFilter.length > 0) && (jGlobalFilter.height() < 5))
        {
            jGlobalFilter.hide ();
        }

        $(".mlist-loading", jMList).hide();
        Frame.notify(MODULE_NAME, "rowchanged", {opt:opt});
    },

    enable: function(mlist, bEnable)
    {
        var optMlist = $.isPlainObject(mlist) ? mlist : this._getOpt(mlist);
        optMlist.grid.setOptions({editable:bEnable});

        if(bEnable)
        {
            // enable
            $("#"+optMlist.mlistId).removeClass("ui-state-disabled");
            Frame.notify(MODULE_NAME, "enable", {opt:optMlist});
            optMlist.disabled = false;
        }
        else
        {
            // disable
            optMlist.disabled = true;
            $("#"+optMlist.mlistId).addClass("ui-state-disabled");
            Frame.notify(MODULE_NAME, "disable", {opt:optMlist});
        }
    },

    getAllColName: function(mlist)
    {
        var opt = $.isPlainObject(mlist) ? mlist : MList._getOpt(mlist);
        var aCol = [];
        for(var i=0; i<opt.colModel.length; i++)
        {
            aCol.push(opt.colModel[i].name);
        }
        return aCol;
    },

/*****************************************************************************
@FuncName: private, Frame.MList.getData
@DateCreated: 2013-06-08
@Author: huangdongxiao 02807
@Description: ��ȡָ���е���ϸ����
@Usage:
@ParaIn:
    * sMListId, String, MLIST ID�ַ���
    * nRowId, Interger, �к�
@Return: Array, ѡ�е��к����飬����ʹ��getData��ȡĳһ�еľ�������
@Caution:
@Modification:
    * yyyy-mm-dd: Auth, add or modify something
*****************************************************************************/
    getData: function(mlist, nRowId)
    {
        var opt = $.isPlainObject(mlist) ? mlist : MList._getOpt(mlist);
        return opt.grid.getData().getItem(nRowId);
    },

    // ��ȡȫ����ԭʼ����
    _getAllData: function(mlist)
    {
        var opt = $.isPlainObject(mlist) ? mlist : MList._getOpt(mlist);
        return opt.grid.getData();
    },

    getStatusBar: function(mlist, nIndex)
    {
        var opt = $.isPlainObject(mlist) ? mlist : MList._getOpt(mlist);
        var jMList = $("#"+opt.mlistId);
        return jMList.find(".mlist-status-"+nIndex);
    },

    getToolBar: function(mlist)
    {
        var opt = $.isPlainObject(mlist) ? mlist : MList._getOpt(mlist);
        var jMList = $("#"+opt.mlistId);
        return jMList.find(".mlist-toolbar .inner-box");
    },

    getSelectedRows: function(mlist)
    {
/*****************************************************************************
@FuncName: private, Frame.MList.getSelectedRows
@DateCreated: 2013-06-08
@Author: huangdongxiao 02807
@Description: Get the selected row numbers
@Usage:
@ParaIn:
    * mlist, String/JObject, MLIST ID string or JQuery Object of MList
@Return: Array, An array of selected rows. if no rows are selected, the array length is 0.
        You can use getData for getting the datas of these rows.
@Caution:
@Modification:
    * yyyy-mm-dd: Auth, add or modify something
*****************************************************************************/
        var optMlist = this._getOpt(mlist);

        return optMlist.grid.getSelectedRows();
    },

    selectRows: function(mlist, aRow)
    {
/*****************************************************************************
@FuncName: private, Frame.MList.selectRows
@DateCreated: 2013-06-08
@Author: huangdongxiao 02807
@Description: Select some rows
@Usage:
@ParaIn:
    * mlist, String/JObject, MLIST ID string or JQuery Object of MList
    * aRow, Array, The row numbers will be selected. 
@Return: None
@Caution:
@Modification:
    * yyyy-mm-dd: Auth, add or modify something
*****************************************************************************/
        var optMlist = this._getOpt(mlist);
        optMlist.grid.setSelectedRows (aRow);
    },

    updateRows: function (mlist, aRow, aData)
    {
/*****************************************************************************
@FuncName: public, Frame.MList.updateRows
@DateCreated: 2014-08-09
@Author: huangdongxiao 02807
@Description: Update row data for MList, and refresh them.
@Usage:
@ParaIn:
    * mlist, String/JObject, MLIST ID string or JQuery Object of MList
    * aRow, Array, The rows returned by getSelectedRows
    * aData, Array, The new data for update. The original data wil be recovered.
        NOTICE: the length of aData must be equal with aRow
@Return: None.
@Caution:
@Modification:
    * yyyy-mm-dd: Auth, add or modify something
*****************************************************************************/
        var optMlist = this._getOpt(mlist);
        var grid = optMlist.grid;
        var dataView = optMlist.dataView;

        for (var i=0; i<aRow.length; i++)
        {
            var oData = grid.getData().getItem(aRow[i]);
            $.extend (oData, aData[i]);
            var sId = oData[idProperty];
            dataView.updateItem (sId, oData);
        }
    },

/*****************************************************************************
@FuncName: private, Frame.MList.showColumns
@DateCreated: 2013-06-08
@Author: huangdongxiao 02807
@Description: ��ʾ������mlist���С��ڶ����б�ʱ����ͨ������ briefColCount ����������б��խʱ��ʾ��������
    ��ʾ�ľ�������ÿһ�е�briefOrder���Ծ�����briefOrder��0��ʼ����ԽС��ʾԽ��ǰ��
@Usage:
@ParaIn:
    * optMlist, Object, ����MLIST ʱ��ѡ�����
    * nColCount, Integer/String, ��Ҫ��ʾ���С�Ϊ0����"all"ʱ��ʾȫ���У�Ϊ"auto"ʱ��ʾminiColCountָ����������
        ���û��ָ��miniColCount���ԣ�����ʾĬ��������
@Return: ��.
@Caution:
@Modification:
    * yyyy-mm-dd: Auth, add or modify something
*****************************************************************************/
    showColumns: function(optMlist, nColCount)
    {
        var jMList = $("#"+optMlist.mlistId);
        var columns = optMlist.columns;
        var visibleColumns = [];

        // restore the width
        for(var i=0; i<optMlist.columns.length; i++)
        {
            columns[i].width = optMlist.columns[i].srcWidth;
        }

        if (undefined === nColCount)
        {
            nColCount = 0;
        }
        else if ("auto" == nColCount)
        {
            nColCount = 3;  // default is 3 columns
        }

        if((0 === nColCount) || ("all"==nColCount))
        {
            // show all the columns
            $(".mlist-context-btn", jMList).show();
            for(var i=0; i<columns.length; i++)
            {
                if(columns[i].visible!==false)
                {
                    visibleColumns.push(columns[i]);  // sort by the briefOrder
                }
            }
        }
        else
        {
            $(".mlist-context-btn", jMList).hide();

            for(var i=0; i<columns.length; i++)
            {
                if(columns[i].briefOrder < 100)
                {
                    visibleColumns[columns[i].briefOrder] = columns[i];  // sort by the briefOrder
                }
            }

            if (nColCount < visibleColumns.length)
            {
                visibleColumns.length = nColCount; //��ʾǰn��
            }
        }

        return optMlist.grid.setColumns(visibleColumns); //����grid����
    },

/*****************************************************************************
@FuncName: private, Frame.MList._updateHelpPanel
@DateCreated: 2013-08-10
@Author: huangdongxiao 02807
@Description: ��active���б仯ʱ�����Ѿ��򿪱༭���ڻ�����ϸ��Ϣ���ڡ�
@Usage:
@ParaIn:
    * optMlist, Object, ����MLIST ʱ��ѡ�����
    * nRowId, Integer, �к�
@Return: ��.
@Caution:
@Modification:
    * yyyy-mm-dd: Auth, add or modify something
*****************************************************************************/
    _updateHelpPanel: function(opt, nRowId)
    {
        var oPanel = Frame.getHelpPanel();
        if(!oPanel.isOpen())
        {
            // the newPage is closed
            return;
        }

        var oData = opt.grid.getData().getItem(nRowId);
        oPanel.update({type:"update", cb:opt.refreshList, defVal:oData});
    },

/*****************************************************************************
@FuncName: private, Frame.MList._showEditDlg
@DateCreated: 2013-08-10
@Author: huangdongxiao 02807
@Description: ����ӻ�༭ҳ�棨������Ӻͱ༭ҳ��һ�㶼����ͬ�ģ������ᵽ�ı༭ҳ����û������˵���������Ҳ�������ҳ�棩��
    �༭ҳ���URL�����б��DIV�ж��壬Ҳ�����ڴ����б�ʱ�Ĳ�����ָ�����༭ҳ����ĳЩ����²���Ҫ�����رգ�����Ҫ������ӣ���
    ���mlist�������رմ򿪵�ҳ�棬��ҳ���Լ�����������йرա��༭ҳ������Apply����ť�����ô����б�Ĳ�����ָ��refreshList������
@Usage:
@ParaIn:
    * optMlist, Object, ����MLIST ʱ��ѡ�����
    * nRowId, Integer, �к�
@Return: ��.
@Caution:
@Modification:
    * yyyy-mm-dd: Auth, add or modify something
*****************************************************************************/
    _showEditDlg: function(sMListId, columns, optDlg)
    {
        var ROW_HEIGHT = 58;
        var rows = columns.length;
        var form_height;
        var form_width = 500;
        var sTmpl;

        if(optDlg.url)
        {
            var _mlist = this;
            optDlg.para.cb = function (oData, para)
            {
                var optMlist = _mlist._getOpt(sMListId);
                if(optMlist.refreshList)
                {
                    optMlist.refreshList(oData, para);
                }
            };

            var oPanel = Frame.getHelpPanel({
                size:optDlg.width,
                title:optDlg.title,
                data: optDlg.para
            });
            if(oPanel.isOpen())
            {
                //Frame.Msg.alert("Close the right-window first.");
                return false;
            }

            oPanel.open().load(optDlg.url, optDlg.onInit);
            return true;
        }

        sTmpl = '<div id="mlist_modify_form" class="portlet-body form"><form class="form-horizontal">'
                +'{{each columns}}<div class="control-group row1" id="edit_label_${id}">'
                +'<label class="control-label">${name}</label>'
                +'<div class="controls" data-editorid="${id}"></div>'
                +'</div>{{/each}}'
                +'</form></div>';

        form_height = (rows+1)*ROW_HEIGHT+30;

        var $modal = $('<div><div>'+sTmpl+'</div></div>').tmpl({columns: columns});

        // sow add form in a dialog
        var dlg = Frame.Dialog.form({
                id:optDlg.id,
                title:optDlg.title,
                width:form_width,height:form_height,
                html:$modal.html(),
                onSubmit:optDlg.onSubmit
            });

        // create the INPUT, SELECT, ...
        var editors = (function(columns)
        {
            var col;
            var newArgs = {};
            var editors = [];
            for(var i=0; i<columns.length; i++)
            {
                col = columns[i];
                newArgs.container = dlg.find("[data-editorid=" + col.id + "]");
                newArgs.column = col;
                newArgs.position = {};
                newArgs.value = optDlg.para.defVal[col.field];
                newArgs.commitChanges = $.noop;
                newArgs.cancelChanges = $.noop;

                editors[i] = new (columns[i].editor)(newArgs);
            }
            editors[0].focus()
            return editors;
        })(columns);

        //dlg.find("select.combox").combobox();

        return editors;
    },

/*****************************************************************************
@FuncName: private, Frame.MList.editRow
@DateCreated: 2013-06-08
@Author: huangdongxiao 02807
@Description: �޸�һ�����Ŀǰֻ֧��ͨ���Ի������ҳ�档
@Usage:
    Function onMlistEdit(row)
    {
        Frame.MList.editRow(LIST_NAME, row);
    }
@ParaIn:
    * sMListId, String, ��ʾ��Ϣ�ַ�����
    * opt, Object, �û�ѡ�֧���������ԣ�
        <li>url, String, ��ӵ�URL��mlist����ظ�URL��ʹ����ʾ��ҳ���ϣ�ʵ���û�����Ľ��档
        <li>width, Interger, ���һ��ʱ�ᵯ��һ���Ի��򣬸�����ָ���Ի���Ŀ�ȡ�
        <li>onInit, Function, �Ի��������ҳ����ҳ���ʼ����������ο�<a href="#Frame.MList.addRow">Frame.MList.addRow</a>
@Return: ��.
@Caution:
@Modification:
    * yyyy-mm-dd: Auth, add or modify something
*****************************************************************************/
    editRow: function(sMListId, nRowId, opt)
    {
        var optMlist = this._getOpt(sMListId);
        var columns = [];
        var oData = Frame.MList.getData(sMListId, nRowId);
        var oDefautOpt =
        {
            para:{type:"edit",defVal:{}},
            title:"Edit",
            id: sMListId+"_edit"
        }

        if("string" == typeof(opt))
        {
            opt = {url:opt};
        }

        if(opt.url)
        {
            opt.para={type:"edit",defVal:oData};
        }
        else for(var i=0; i<optMlist.columns.length; i++)
        {
            col = optMlist.columns[i];
            if(true===col.modify)
            {
                columns.push(col);
                oDefautOpt.para.defVal[col.field] = oData[col.field];
            }
        }

        var optDlg = $.extend({}, oDefautOpt, opt);
        MList._showEditDlg(sMListId, columns, optDlg);
    }

    ,commitEdit: function(sMListId)
    {
        var optMlist = this._getOpt(sMListId);
        return optMlist.grid.getEditorLock().commitCurrentEdit();
    }

    ,cancelEdit: function(sMListId)
    {
        var optMlist = this._getOpt(sMListId);
        return optMlist.grid.getEditorLock().cancelCurrentEdit();
    }

/*****************************************************************************
@FuncName: private, Frame.MList.addRow
@DateCreated: 2013-06-08
@Author: huangdongxiao 02807
@Description: ���һ�������ָ����URLʱ���Ҳ��ָ����URL��
    �������б��е��е���һ���Ի��������ӡ�
@Usage:
    Function onMlistAdd()
    {
        Frame.MList.addRow(LIST_NAME, {
            url: "dhcp/[lang]/add_pool.html"
            title: "DHCPPool - Add"
        });
    }
@ParaIn:
    * sMListId, String, �б�ID
    * opt, Object, �û�ѡ�֧���������ԣ�
        <li>url, String, ��ӵ�URL��mlist����ظ�URL��ʹ����ʾ��ҳ���ϣ�ʵ���û�����Ľ��档
        <li>width, Interger, ʹ�õ����Ի������ʱһ��ʱ��������ָ���Ի���Ŀ�ȡ�
        <li>onInit, Function, �Ի��������ҳ����ҳ���ʼ��������һ������£���ʼ�������л�ȴ�ҳ���һ����ʼ��������
            Ȼ����øñ������г�ʼ����ҳ���д������HTML�ļ����ʹ��ʹ��Frame.include�����Լ���JS�ļ���
            ��JS�ļ���������ó�ʼ����������ش�����Բο���
@Return: ��.
@Caution:
@Modification:
    * yyyy-mm-dd: Auth, add or modify something
*****************************************************************************/
    ,addRow:function(sMListId, opt)
    {
        var optMlist = this._getOpt(sMListId);
        var columns = [];

        opt = opt || {};
        if("string" == typeof(opt))
        {
            opt = {url:opt};
        }
        if(opt.url)
        {
            //MList.showColumns(optMlist);
            opt.para = opt.para || {type:"add", defVal:{}};
            return MList._showEditDlg(sMListId, columns, opt);
        }

        var oDefautOpt =
        {
            para: {type:"add", defVal:{}},
            title:"Add",
            id: sMListId+"_add"
        }
        for(var i=0; i<optMlist.columns.length; i++)
        {
            col = optMlist.columns[i];
            if(false===col.add)
            {
                continue;
            }
            columns.push(col);
            oDefautOpt.para.defVal[col.field] = "";
        }

        var optDlg = $.extend({}, oDefautOpt, opt);
        MList._showEditDlg(sMListId, columns, optDlg);
    }
});
$F.MList = MList;

MList._init();

})(Frame);
