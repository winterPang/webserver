/*******************************************************************************
 Copyright (c) 2011, Hangzhou H3C Technologies Co., Ltd. All rights reserved.
--------------------------------------------------------------------------------
@FileName:widgets/mlist.js
@ProjectCode: Comware v7
@ModuleName: Frame.MList
@DateCreated: 2011-08-09
@Author: huangdongxiao 02807
@Description:多列列表控件，支持分页显示、排序、快速查询、高级组合查询功能，支持以行添加和行修改。
在V7中列表的创建主要放在了JS中，HTML中只需要指定一个DIV容器即可。列表中有几列，每一列的属性等都是通过JS的参数指定。

<ul>
<li><a href="#mlist_create">创建一个列表</a>
<li><a href="#mlist_group">分组</a>
<li><a href="#Frame.MList.Buttons">列表按钮</a>
<li><a href="#datatype">数据类型</a>
<li><a href="#mlist_colModel">列定义</a>
<li><a href="#formatter_link">给单元格添加超链接</a>
<li><a href="#formatter_bgcolor">改变单元格的背景色</a>
</ul>


<h3 id="mlist_create">创建一个列表</h3>
<ol>
<li>在HTML中需要显示列表的地方放置一下DIV，如：
    <code>&lt;div header="主机,端口号,VRF" id="mymlist">&lt;/div></code>
<li>在JS中增加列表的初始化函数，声明列表的<a href="#MListOption">相关属性</a>，包括多选、查询、操作列以及每列的名称、列宽等，
    并调用<a href="#Frame.MList.create">Frame.MList.create</a>创建列表
<li>在初始化中调用列表的初始化函数
<li>发送请求获取列表的内容，调用MList的<a href="#Frame.MList.refresh">refresh</a>，
    或者<a href="#Frame.MList.appendData">appendData</a>显示
</ol>
一个带有列表页面的完整JS的参考代码：
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

        // 处理返回的数据，（optional）
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

// 注册页面用到的控件
Utils.Pages.regModule(MODULE_NAME, {"init": _init, "destroy": _destroy,"widgets":["Mlist","Default"],"utils":["Request","Base", "Msg"]});
})( jQuery );
</code>


<h3 id="datatype">datatype说明</h3>
datatype指定列的类型，用于在显示、查询、编辑时的区分，以显示不同的格式、查询方法、和不同的编辑控件。可以是以下几种类型：
////table start sep=//
名称//支持的属性//描述
Group//-//详见<a href="#mlist_group">分组描述</a>//
Text//min, maxLength//文本框，用于编辑字符串类型。不能以空格开头，且不能包含问号。//
String//min, maxLength//文本框，用于编辑字符串类型。不能包含问号。//
EString/istring//min, maxLength//文本框，用于编辑字符串类型。该类型除了字符串的长度范围外不检查任何特殊字符。//
Ip//-//文本框，可以输入IPv4或者IPv6的地址//
Ipv4//-//文本框，只能输入IPv4的地址//
Ipv6//-//文本框，只能输入IPv6的地址//
Mask//-//下拉框，可以选择IPv4的32种掩码//
Mac//-//文本框，输入格式为: HH-HH-HH-HH-HH-HH//
Integer//min, max//文本框，用于编辑整数类型//
Password//-//文本框，用于编辑密码类型//
Order//#ListString/data//枚举类型，一般是设备上返回的数字但在界面上要显示为字符串。当编辑时显示为下拉列表控件或者单选按钮，
        具体形态由数据的个数或者type属性决定。列表的选项由data属性决定。
        对于静态固定的选项，可以用data指定（data类型为<a href="#ListString">ListString</a>）；
        当选项为动态列表时（一般需要从后台获取），可以使用onInit填充。对于静态数据，当选项变化时会调用onchange事件//
Checkbox//-//boolean类型，一般是enable/disable、up/down、open/close这样的数据，后台返回的数据为true/false。
        当编辑时显示为复选框控件。当添加一行时，复选框的初始化选中状态由checked属性决定。
        当编辑模式时，由当前的值决定，其中值为0,null,false,"false","",undefined时为非选中状态，其它值都是选中状态。
        在用户点击复选框其选择状态发生变化时会调用onchange事件.
////table end
<b>注意：</b>上表中支持的属性是指不在<a href="#mlist_colModel">列模式(colModel)属性说明</a>中的只针对某一种datatype的专有属性。
<h3>datatype举例</h3>
<pre class=code>// 简单数组
var aSeverity = ["emergencies","alerts","critical","errors","warnings","notifications","informational","debugging"];

// 对象数组
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
        {name:'Module', width:80, datatype:"Order", data:"ACL,WEB,SHELL"},，   // 下拉框
        {name:'Severity', width:80, datatype:"Order", data:aSeverity, tip:true},，   // 下拉框
        {name:'Digest', width:60, datatype:"Order", data:aDigest， onchange:onDigestChange},，   // 下拉框
        {name:'Interface', width:"100", datatype:"Order", onInit: onInitOrder2}，   // 下拉框
        {name:'Status', width:"100", datatype:"Checkbox"}   // 复选框
    ]
};

</pre>

<h3 id="mlist_colModel">列模式(colModel)属性</h3>
////table start sep=//
名称//类型//描述
name//String//
    对应的是对应后台json对象的某个叶子标签值：如 LogsInLogBuffer中的Time、Group//
width//Integer//
    设置某一列的宽度. <b>注意：</b>该参数必须是整数类型，不能使用双引号把数字括起来，否则会使所有的列宽无效。
    也可以不指定列宽，此时使用默认宽度。//
data//#ListString//
    行编辑或者枚举值显示时的数据源。一般情况下某些数据从后台返回的是一个整数(比如状态)，显示时每一个值分别对应一个字符串，
    即后台数据是整数，但用户看到的是字符串，并且是一个有限的序列。//
datatype//#datatype//
    单元格的数据类型，在进行排序或者过滤时会根据数据类型进行不同的操作。支持text, ipv4, port, order，integer，默认值是text。
    order类型在高级查询时会以下拉框的形式显示。//
sortable//Boolean//
    列是否可以排序, 默认值为true.  建议只对有意义的列进行排序支持, 不要滥用排序功能。
    比如描述信息等列, 不建议支持排序功能。对支持排序的列必须指定datatype属性//
editable//Boolean//
    是否可以编辑。当进入编辑模式时被设置为true的列可以以输入框等模式进行编辑。添加时不受影响.//
showTip//Boolean//
    是否显示tip。当列宽较少时单元格内的文本可能显示全，此时可以指定为true，
    使鼠标移上去后能够以提示的方式显示完整。//
formatter//#Frame.MList.Formatters//
    自定义构造单元格的HTML, 可以在本函数内返回一个指定的HTML字符串以实现单元格的格式化显示，如定义背景色等。//
groupFormatter//#Frame.MList.Formatters//
    同formatter，但该属性只对Group列生效//
editor//#Frame.MList.Editors//
    行编辑时自定义编辑控件，系统有预定义的控件， 一般不需要页面自己定义。可以设置该值为false使该列不可编辑。
////table end

<h3 id="mlist_group">分组描述</h3>
分组是在现有列表的正常显示基础上，对不同的列在显示的时候增加缩进，加图标，使其显示为一种主从关系的处理方式。
分组需要在原有数据上增加一个从属关系，代码中使用indent、parent、children来实现
////table start sep=//
属性//类型//描述
indent//Integer//缩进级别，从0开始，依次为1、2、3...n。框架会根据该值使用第一列的数据在显示的时候有一个宽度的缩进，使看起来有一个主从关系。//
parent//Integer//对子节点数据，要有一个父节点的索引，这个索引是父节点在数组中的下标//
children//Array//子节点数组，主要用于页面内部的操作，如果有多列分组的话，其类型是一个对象，每一个元素量个数组。对象的属性为列表中定义的列名。
////table end
<p>分组需要有两个标志：
<li>一个标志是在列表的 <a href="#MListOption">MListOption</a> 中增加group属性，使列表有分组功能；
<li>另一个标志是在分组的列上设置 <a href="#datatype">datatype</a> 为Group，使列表知道使用哪一列进行分组。
<p>举例：
<li>单表分组：数组都在一个表中。
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

// 按照Name进行分组

// 原始数据
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

// 按照分组要求处理后的数据（调用makeData后）
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
<li>多表分组：父节点在一个表中，子节点在另外的表中，通过索引进行映射。
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

        // 上面的children也可以设置为JSON格式，如 {Name: aChildren}
        // 并且在多列分组时必须使用JSON的格式

        // insert sub-nodes
        if(aChildren.length > 0)
        {
            aGroupData = aGroupData.concat(aChildren);
        }
    });
    $("#" + LIST_NAME).mlist("refresh", aData);
}

// 原始数据
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
<h3 id="mlist_search">查询(search)属性</h3>
////table start sep=//
名称//类型//描述
simple// boolean// 支持简单查询。默认支持//
adv// boolean// 支持高级查询。默认支持//
<i>custom</i>// #ActionIcon// 自定义查询按钮。
////table end
<p>一般情况下都是使用列表的默认查询功能，此时设置search为true即可。
<p>查询时需要知道数据类型，以进行比较过滤。因此search属性只是一个列表的查询总开关，具体哪一列可以查询，
还需要在支持查询的列中指明数据类型即查询列的<a href="#mlist_datatype">datatype</a>属性

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
@Description: 带有鼠标点击处理动作的图标定义，可以是一个JSON对象，也可以是一个JS函数。
<p>如果是一个JSON对象，其属性定义如下：
////table start sep=//
属性名//类型//描述
role//JSONObject//图标所支持的权限，以JSON格式定义，可以有write,read,excute三种权限，默认只有read权限。如:
    <pre class="code">var role = {write: true, read: true, execute: true}</pre>//
showText// Boolean// 是否显示文本，默认是false//
toggle// Boolean// 鼠标点击时会在active和非active之间进行切换。如高级查询点击后会切换后面的上下箭头图标。默认是false//
text// String// 按钮的文本字符串。showText=true时有效。最终显示的字符串的查找顺序为：
    1). 本属性；
    2). 框架<a href="../../frame/cn/locale.js.html#JQuery.MyLocale.MList.icons">预定义的图标</a>
    3). 使用JSON名称//
action// Function// 图标的点击处理函数，原形为void function()，函数的参数根据使用的地方不而不同。
    <li>在简单查询中，有两个参数(nKeyIndex, sValue)，分别为选择的查询项索引和用户输入的值；
    <li>在列表的操作列中，有一个参数 nRowId，可以通过
        <a href="mlist.js.html#Frame.MList.getData">Frame.MList.getData</a>
        获取到对应的数据。
////table end
<p>如果是一个JS函数，则会填充到上述结构的action域，其它域均使用默认值。
@Usage:
//MList操作列图标
var oMdfIcon = {
    role: {write: true, read: true, execute: true},
    action: function(nRowId){}
};

//简单查询按钮
var oSearchIcon = {
    role: {write: true, read: true, execute: true},
    action: function(nKeyIndex, sValue){}
};

//自定义图标
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
@Description: MList行编辑或者行添加时的参数
@fields:
    * onCheck, Function, 提交前的检查函数，参数为用户输入数据的JSON对象。检查通过后null， 否则返回错误提示信息。
        对标准格式的输入框，框架会自动检查。onCheck检查一般用于检查整体数据是否合法或者自定义类型的数据。
        检查函数必须阻塞式完成，中间不能使用异步处理，即不能使用Ajax下发到后台进行判断，因此只局限于本地数据检查
    * onSubmit, Function, 点击确认按钮的处理，参数为用户输入数据的JSON对象。本函数中应该构造的Request进行下发
    * onCancel, Function, 点击取消按钮的处理。一般不需要处理该事件
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
@Description: MList创建参数，使用JSON格式定义。描述列表的表头、列数、列宽、行为等。
    MList以JS为主，大部分工作都在JS中完成，因此定义一个MList时需要有一个复杂的参数格式。

@fields:
    * multiSelect, boolean, 多选标志, 对支持批量删除的表请添加该标志。
    * group, String, 列表分组的初始标志，取值为"open","close"。如果不指定该属性，则不分组。详见<a href="#mlist_group">分组描述</a>
    * caption, String, 列表表头，可以不指定
    * colNames, #ListString, 表头。以逗号分隔的字符串，也可以是元素为字符串类型的数组。也可以用DIV的header属性代替这个选项。
    * colModel, Array, 列模式属性定义，以数组的形式定义每一列的描述。
        单列的具体定义请参考<a href="#mlist_colModel">列模式(colModel)属性</a>
    * search, Object/Boolean, 查询属性定义，默认支持查询。
        查询属性可以是一个boolean类型的true or false，此时系统会显示默认的查询图标，也可以是一个对象，
        详细定义支持哪些查询图标及行为。详细定义请参考<a href="#mlist_search">查询(search)属性</a>
    * headerTip, Boolean, 是否显示表头的提示信息。当列表的列较多或者表头文本较长时，可能会显示不全，
        此时可以通过设置headerTip为true，使鼠标移到表头上时可以弹出一个包含完整文本的提示信息。
    * buttons: #Frame.MList.Buttons, 与列表相关的操作按钮。常用的有删除选中的行，添加一行，修改选中的行
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
// oIcons, ActionIcon, 图标列表
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
        if($(this).closest(".modal").length)
        {
            var jMList = $(this).closest(".mlist");
            var oMlistOpt = jMList.data("opt");
            var sId = jMList.attr("id");
            $(".mlist-status-bar.mlist-toolbar",jMList).data("filterData",{});
            $(".form-control.search",jMList).val("");
            Frame.MList.refresh(sId, oMlistOpt.data, false);
            $(this).attr("state", "enable");
        }
        else
        {
            Utils.Base.refreshCurPage();
        }
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
@Description: 列表按钮定义。预定义按钮包括三个：添加、修改、删除。其中删除按钮由于要执行一个特定的动作（一般是下发一个netconf请求），
    因此页面中必须增加删除动作的定义。
    预定义按钮：
    <ol>
    <li>添加：{id:"mlist_add", name:"add", value:oBtnRc.ADD, mode:Frame.Button.Mode.CREATE, action:function(btnDef){}}
    <li>修改：{id:"mlist_edit", name:"edit", value:oBtnRc.MDF,enable:1, mode:Frame.Button.Mode.MODIFY,action:function(btnDef){}}
    <li>删除：{id:"mlist_del",name:"delete",value:oBtnRc.DEL, enable:">0", mode:Frame.Button.Mode.DELETE}
    </ol>
    在页面修改某按钮的属性时使用name与预定义的按钮匹配，如
    <code>{name:"delete",action: Utils.Msg.deleteConfirm(onDelPolicy)}</code>

    <h3 id="ButtonEnable">ButtonEnable</h3>
    指定按钮使能的条件，可以有下列几种类型：
    <ol>
    <li>Boolean, 取值为true, false。
    <li>Integer, 当设置为整数时，表示列表中选中的行数。即列表中选中的行数和这个值相等时按钮为enable状态
    <li>String, 支持简单的条件判断，如：">0", &lt;5", ">=<i>n</i>"等，不支持多个条件，如：">0 &amp;&amp; &lt;5"
    <li>Function, 可以使用一个JS函数返回true, false来完成按钮的动态使能。这种情况一般用于动态数据。如点击某一行时根据行数据判断按钮是可用
        函数原型请参考下面例子中的 onCheckEditEnable
    </ol>
@Usage:
function onCheckEditEnable(aSelectedRow)
{
    // 只有选中一行时可进行编辑
    if(1 != aSelectedRow.length)
    {
        return false;
    }

    // 只有选中静态
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
            {name:'add', eanble:false},     // 不显示添加按钮
            {name:'edit', enable: onCheckEditEnable}, // 同时只能编辑一个静态表项
            {name:'delete', action:Utils.Msg.deleteConfirm(onDelete)}
        ]
    };
    $("#"+LIST_NAME).mlist("head", opt);
}
@ParaIn:
    * id, Integer,
    * name, Integer,
    * value, String, 在按钮上显示的文字
    * enable, #ButtonEnable, 按钮的使能条件
    * mode, Object, 按钮图标
    * action, Function, 点击动作
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
            //{id:"mlist_selector", no:20, name:"selector", enable:">0", action:ButtonAction.onSwitchSelector},
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

//5041 
var Operator = 
{
    aBtns :[],
    buttonClick: function(sMListId, opt){
        var aDefButton = this.aBtns;

        $("#"+sMListId).on('click','.oper-btn',function(e){
            var bid = $(this).attr("bid");
            var oBtn ;
            for(var i=0;i<aDefButton.length;i++)
            {
                if(bid == aDefButton[i].id)
                {
                    oBtn = aDefButton[i];
                    break;
                }
            }
            if(oBtn && oBtn.action)
            {
                var aSelectedData = [];
                if ( (undefined !== oBtn.enable) && (true !== oBtn.enable) )
                {
                    var _grid = opt.grid;
                    if (opt && opt.grid)
                    {
                        
                        aSelectedData = _grid.getSelectedData();
                    }
                }
                return (false === oBtn.action.call (this, aSelectedData));
            }
        });
    }
    ,makeOperBtn: function(buttons){
        var optButtons = [];

        for(var i=0;i<buttons.length;i++)
        {
            var oBtn = buttons[i];
            var btn = "";

            if(!oBtn.Show)
            {
                continue;
            }

            if (oBtn.icon)
            {
                btn = "<a class='oper-btn' bid='"+oBtn.id+"'  title='"+oBtn.value+"'>"
                    + "<i class='icon "+oBtn.icon+"'></i>"
                    + "<span class='text'>"+oBtn.value+"</span></a>";
            }
            else
            {
                btn = "<a class='oper-btn' bid='"+oBtn.id+"' title='"+oBtn.value+"'>"
                    + "<span class='text'>"+oBtn.value+"</span></a>";
            }
            
            optButtons.push(btn);
        }

        return optButtons.join("");
    }
    ,createOperColumn: function(aOptBtn, aColumns){
        var aRowBtn = [];
        var oSupportBtn = {"detail": true,"edit": true,"delete": true};
        var aDefBtn = [
            {id:"mlist_detail", name:"detail", value:MyLocale.Buttons.DETAIL, enable:1, icon:"fa-detail"},
            {id:"mlist_edit", name:"edit", value:MyLocale.Buttons.MDF, enable:1, icon:"fa-pencil"},
            {id:"mlist_del", name:"delete", value:MyLocale.Buttons.DEL, enable:1, icon:"fa-remove"}
        ];
        var sHref = window.location.href;
        if(sHref.split("?")[2] == "np=Syslog.Syslog")
        {
            aDefBtn[1].value = aDefBtn[0].value;
            aDefBtn[1].icon = aDefBtn[0].icon;
        }
        var aUserBtn = [];
        for (var i = 0; i < aOptBtn.length; i++) 
        {
            var oBtnDef = aOptBtn[i];
            if (oSupportBtn[oBtnDef.name] && oBtnDef.enable !== false)
            {
                oBtnDef.Show = true;
                aUserBtn.push(oBtnDef);
            }
        }
        if(!aUserBtn.length)
        {
            return;
        }

        aRowBtn = Tools.mergeButton(aDefBtn, aUserBtn, true);
        if(0 == aRowBtn.length)
        {
            return;
        }

        var operCol = {
            id:"mlist_operation",
            name:MyLocale.MList.operation,
            field:"Operation",
            width: 50,
            add: false,
            filter: false,
            buttons:aRowBtn,
            briefOrder: 999,
            formatter: Formatters.Operator
        };

        this.aBtns = aRowBtn;
        
        aColumns.push(operCol);
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
            jForm.appendTo (jContainer).submit(function(){return false});
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
        // return $("<input maxlength=100 type='text'>")
        return $("<input type='text'>")
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
        // return $("<input maxlength=20 type='text'>")
        return $("<input type='text'>")
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
                //by wkf4808  jing que pi pei 
                var sCm = ("Order" == oColDef.datatype) ? "equal" : "equal";
                //mo hu pi pei
                //var sCm = ("Order" == oColDef.datatype) ? "equal" : "include";
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

                // 各过滤条件是与的关系，只要有一个过滤条件不匹配，就不显示出来
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
                // 各过滤条件是与的关系，只要有一个过滤条件不匹配，就不显示出来
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
@Description: 定义列表的行显示转换函数。转换函数可以完成在列表中各种不同的显示，如超链接、改变字体颜色等。
<h3 id="formatter_link">给单元格添加超链接</h3>
超链接有两种方式：
<li>一是连接到本列表的修改页面；
这种方式比较简单，修改页面的数据在列表中已经获取，在使用JS打开修改页面时可以通过参数把修改的行数据直接传递到修改页面中。
该方式的formatter代码框架中已经定义好，不需要页面自己添加。
<p>代码：
<code>
{name:'Time', width:80, datatype:"String", link:{url: "Syslog.Add_page"}},
</code>
<li>另一种是链接到其它页面。
<code>
// 定义
{name:'RuleNum', modify:true, width:100, datatype:"Integer", formatter: onRueNumFormatter, showTip:false}

// 函数实现
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

// M_ContentFilter_Policy页面的初始化中增加参数的判断处理
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

<h3 id="formatter_bgcolor">改变单元格的背景色</h3>
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
    * row, Integer, 单元格所在的行
    * cell, Integer, 单元格所在的列
    * value, void, 本单元格的值
    * colDef, Object, 单元格的定义，在创建列表时opt中指定
    * dataContext, Object, 行数据对象，包含有所有列的值
    * type, String, 需要返回的字符串类型，取值为"html", "text"。当type="html"时返回的字符串会做为HTML插入到列表中。
@Return: String, 拼好的一段字符串
@Caution:
    <li>当type是"html"时，返回的字符串必须是一段正确的完整的HTML串，否则可能会引起页面布局错乱。
    <li>当type是"text"时，返回的字符串会做为纯文本用于查询等非显示用途。因此在formatter函数中如果有格式上的显示修改时，必须区分这两种情况。
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
        //5041
        //var oIcons = colDef.icons;
        //return makeIconsHtml(oIcons);
        var  optBtn = "";
        var aRow = [];
        var aBtns = [];
        aRow.push(dataContext);
        for(var ii=0; ii<colDef.buttons.length;ii++)
        {
            aBtns.push(colDef.buttons[ii]);
        }
        for(var i=0; i<aBtns.length;i++)
        {
            if( (typeof aBtns[i].enable) == "function")
            {
                var bFlag = aBtns[i].enable(aRow);
            }
            else
            {
                var bFlag = aBtns[i].enable;
            }
            if(!bFlag)
            {
                aBtns.splice(i,1);
                i--;
            }
        }
        if(typeof(dataContext._attr.parent) == 'undefined')
        {
            optBtn += Operator.makeOperBtn(aBtns);
        }
       
        return optBtn;
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
    // 列表标题
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
    // 工具栏
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

            // 高级过滤
            MListFilter.create(opt, jParent, doFilter);

            // 列表全局按钮
            Buttons.create (jParent, opt);

            return null;
        }
    }
    // 工具栏
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
    // 分页状态栏
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
    // 自定义状态栏，一般由页面定义
    ,"Status": {
        showOnTop: false,
        attr: {},
        css: "mlist-status",
        init: function (grid, dataView, jContainer)
        {
        },
        formatter: function (opt, jParent)
        {
            // 生成Toolbar区域，包括与选择数据相关的各类按钮
            StatusBar.create (opt, jParent);
            return null;
        }
    }
}

// 转换mlist的选项参数为slick控件的选项参数
/*
      explicitInitialization: false, // 显式初始化
      rowHeight: 25,    // 行高
      defaultColumnWidth: 80,
      enableAddRow: false,  // 打开自动添加行的功能
      leaveSpaceForNewRows: false,  // 自动添加行时是的在列表的底部预留空白
      editable: false,  // 是否允许列表编辑
      autoEdit: true,   // 列表自动编辑，当editable=true时可以在单元格中双击鼠标进行编辑，并且该开头打开时，单元格获致焦点后就进入编辑状态
      enableCellNavigation: true,   // 打开键盘移动。可以通过上、下、左、右、Tab、Shift+Tab，移动单元格的焦点。
      enableColumnReorder: true,    //
      asyncEditorLoading: false,    //
      asyncEditorLoadDelay: 100,    //
      forceFitColumns: false,   // 自动调整列宽，使充满父容器的宽度，且不出现水平滚动条
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

    // 从mlist opt生成Slick.Grid控件的列定义
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

    //add operator Column
    Operator.createOperColumn(opt.buttons,columns)

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
                // 不减去5会出滚动条，为什么？
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
@Description: 列表的初始化函数，在系统初始化时调用一次，设置列表的一些全局属性。各页面中不需要调用。
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

        // 打开或者关闭添加页面时需要隐藏或者显示列表的部分列
        // Frame.regNotify("newPage", "open",  showMList3Columns);
        // Frame.regNotify("newPage", "close", showMListAllColumns);
    },

/*****************************************************************************
@FuncName: public, Frame.MList.create
@DateCreated: 2013-06-08
@Author: huangdongxiao 02807
@Description: 列表的创建函数。
@Usage:
@ParaIn:
    * sMListId, String, MLIST ID字符串
    * opt, #MListOption, 创建列表时的选项
@Return:
@Caution:
@Modification:
    * yyyy-mm-dd: Auth, add or modify something
*****************************************************************************/
    create: function(sMListId, opt)
    {
        // 扩展列表的默认属性
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

        Operator.buttonClick(sMListId,opt);//5041 


        //=======================================================
        // 准备Slick.Grid控件的相关选项
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
            //RowToolbar.create (jGrid, options);
        }

        // right menu of column header
        if(false !== options.columnChange)
        {
            var jMenuBtn = $("<span class='slick-header-column mlist-context-btn icon-list'></span>").appendTo($('.slick-header', jMList));
            oPopMenu = Slick.Controls.ColumnPicker(columns.slice(0,-1), grid, {menuBtn:jMenuBtn});
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
            $(".data-count").html(options.data.length);
            $(".toolbar .data-count").html(dataView.getLength());
            Frame.notify(MODULE_NAME, "rowchanged", {opt:options});
            grid.render();

            //Frame.Menu.updateSummary(false, grid.getDataLength()+'/'+opt.data.length);
            //$("#"+sMListId+" .mlist-pages .summary").html("Total: "+aData.length);
        });

        dataView.onRowsChanged.subscribe(function (e, args)
        {
            grid.invalidateRows(args.rows);
            grid.updateSelectedRangesChanged();
            grid.render();
            Frame.notify(MODULE_NAME, "rowchanged", {opt:options});
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
            
            e.stopPropagation();
            e.preventDefault();
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
@Description: 列表的销毁函数。一般情况下不需要调用。当页面中需要在同一个元素上切换不同的列表时，
        在切换前需要先销毁前一列表。
@Usage:
@ParaIn:
    * sMListId, String, MLIST ID字符串
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
@Description: 向列表中追加数据
@Usage:
@ParaIn:
    * sMListId, String, MLIST ID字符串
    * aData, Array, 列表数据
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
@Description: 使用新数据刷新列表，刷新后原有的数据将不存在。列表在创建时会显示loading，
    loading状态会在调用Frame.MList.refresh和Frame.MList.appendData后消失。
@Usage:
@ParaIn:
    * sMListId, String, MLIST ID字符串
    * aData, Array, 列表数据
    * bKeepSearch, boolean, default is false. 是否保留查询条件.
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
@Description: 获取指定行的详细数据
@Usage:
@ParaIn:
    * sMListId, String, MLIST ID字符串
    * nRowId, Interger, 行号
@Return: Array, 选中的行号数组，可以使用getData获取某一行的具体内容
@Caution:
@Modification:
    * yyyy-mm-dd: Auth, add or modify something
*****************************************************************************/
    getData: function(mlist, nRowId)
    {
        var opt = $.isPlainObject(mlist) ? mlist : MList._getOpt(mlist);
        return opt.grid.getData().getItem(nRowId);
    },

    // 获取全部的原始数据
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
@Description: 显示或隐藏mlist的列。在定义列表时可以通过增加 briefColCount 属性来完成列表变窄时显示的列数。
    显示的具体列由每一列的briefOrder属性决定，briefOrder从0开始，数越小显示越靠前。
@Usage:
@ParaIn:
    * optMlist, Object, 创建MLIST 时的选项参数
    * nColCount, Integer/String, 需要显示的列。为0或者"all"时显示全部列，为"auto"时显示miniColCount指定的列数，
        如果没有指定miniColCount属性，则显示默认列数。
@Return: 无.
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
                visibleColumns.length = nColCount; //显示前n列
            }
        }

        return optMlist.grid.setColumns(visibleColumns); //设置grid的列
    },

/*****************************************************************************
@FuncName: private, Frame.MList._updateHelpPanel
@DateCreated: 2013-08-10
@Author: huangdongxiao 02807
@Description: 当active行有变化时更新已经打开编辑窗口或者详细信息窗口。
@Usage:
@ParaIn:
    * optMlist, Object, 创建MLIST 时的选项参数
    * nRowId, Integer, 行号
@Return: 无.
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
@Description: 打开添加或编辑页面（由于添加和编辑页面一般都是相同的，后面提到的编辑页面在没有特殊说明的情况下也包含添加页面）。
    编辑页面的URL由在列表的DIV中定义，也可以在创建列表时的参数中指定。编辑页面在某些情况下不需要主动关闭（如需要继续添加），
    因此mlist不主动关闭打开的页面，由页面自己根据情况进行关闭。编辑页面点击“Apply”按钮后会调用创建列表的参数中指定refreshList函数，
@Usage:
@ParaIn:
    * optMlist, Object, 创建MLIST 时的选项参数
    * nRowId, Integer, 行号
@Return: 无.
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
@Description: 修改一个表项。目前只支持通过对话框打开新页面。
@Usage:
    Function onMlistEdit(row)
    {
        Frame.MList.editRow(LIST_NAME, row);
    }
@ParaIn:
    * sMListId, String, 提示信息字符串。
    * opt, Object, 用户选项，支持以下属性：
        <li>url, String, 添加的URL。mlist会加载该URL，使其显示在页面上，实现用户输入的界面。
        <li>width, Interger, 添加一行时会弹出一个对话框，该属性指定对话框的宽度。
        <li>onInit, Function, 对话框加载完页面后的页面初始化函数。请参考<a href="#Frame.MList.addRow">Frame.MList.addRow</a>
@Return: 无.
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
@Description: 添加一个表项。当指定了URL时在右侧打开指定的URL。
    否则按照列表中的列弹出一个对话框进行添加。
@Usage:
    Function onMlistAdd()
    {
        Frame.MList.addRow(LIST_NAME, {
            url: "dhcp/[lang]/add_pool.html"
            title: "DHCPPool - Add"
        });
    }
@ParaIn:
    * sMListId, String, 列表ID
    * opt, Object, 用户选项，支持以下属性：
        <li>url, String, 添加的URL。mlist会加载该URL，使其显示在页面上，实现用户输入的界面。
        <li>width, Interger, 使用弹出对话框添加时一行时，该属性指定对话框的宽度。
        <li>onInit, Function, 对话框加载完页面后的页面初始化函数。一般情况下，初始化函数中会等待页面的一个初始化变量。
            然后调用该变量进行初始化。页面的写法：在HTML文件最后使用使用Frame.include加载自己的JS文件，
            在JS文件的最后设置初始化变量。相关代码可以参考：
@Return: 无.
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
