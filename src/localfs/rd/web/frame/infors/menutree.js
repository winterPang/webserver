;(function ($) {
var MODULE_NAME = "frame.infors.menutree";
var MID = {sys:"M_System",root:"M_Global",node:"M_ApNode",group:"M_ApGroup"};
var NC = Utils.Pages["Frame.NC"].NC_AP;
var g_oTreeData = {};
var g_hTree = null;
var g_hWait = null;

function openNode(id)
{
    g_hTree.jstree("open_node",{id:id});
    var sParent = g_hTree.jstree("get_node",{id:id}).parent;
    if(sParent)
    {
        openNode(sParent);
    }
}

function onNodeChange(e,data)
{
    function expandMenu()
    {
        var sMenuId = oNode.skipto.split("?")[0];
        if(sMenuId != "#M_Dashboard")
        {
            $("#side_menu a[href=#M_WSConfig]").next().show();
        }
    }

    if(!data.action || data.action != "select_node")
    {
        return false;
    }

    var oNode = data.node.original;
    var oldNode = JSON.parse(Frame.Cookie.get("TreeNode")) || {};

    if(oNode.id == oldNode.nodeId)
    {
        return false;
    }

    //make nav path
    var aParents = data.node.parents;
    var aPath = [];
    
    aPath.push({sText:oNode.text,sId:oNode.id});

    for(var i=0;i<aParents.length-1;i++)
    {
        var oParNode = g_hTree.jstree("get_node",{id:aParents[i]});

        aPath.push({
            sText : oParNode.text,
            sId : oParNode.id
        });

        if(aParents[i] == "_TreeRoot")break;
    }

    var sMenuType = Frame.Cookie.get("MenuType");

    var oNodeInfor = {
        nodeType : oNode.nodeType,
        menuType : oNode.menu,
        RadioNum : oNode.RadioNum
    };

    if(oNode.nodeType == "group")
    {
        oNodeInfor.nodeId = oNode.id.slice("group_".length);
    }
    else if(oNode.nodeType == "location")
    {
        oNodeInfor.nodeId = oNode.id.slice("location_".length);
    }else
    {
        oNodeInfor.nodeId = oNode.id;
    }
    
    //save tree para
    Frame.Cookie.set({
        "MenuType":oNode.menu,
        "TreeNode":JSON.stringify(oNodeInfor),
        "MenuPath":JSON.stringify(aPath)
    });

    Frame.NewMenu.reloadMenu(oNode.menu,expandMenu);

    if(sMenuType == MID["sys"] || oNode.nodeType == "add")
    { 
        window.location = oNode.skipto;
    }
}
        
function makeTreeMain(jContainer)
{
    var optionTree = {
        "core":{
            "check_callback": true,
            "data":g_oTreeData
        },
        "plugins": ["search"],
        "search":{"fuzzy":false},
    };
    
    g_hTree.jstree(optionTree);

    var oCurNode = JSON.parse(Frame.Cookie.get("TreeNode"));

    g_hTree.bind("changed.jstree",onNodeChange);
    
    if(oCurNode && oCurNode.nodeId)
    {
        g_hTree.jstree("deselect_all");
        openNode(oCurNode.nodeId);
        g_hTree.jstree("select_node",{id:oCurNode.nodeId});
    }

}

function makeTrunkSingle(locations,aprs,wsrs)
{
    var sId = "Default Location";
    var oGlobal = {
        id : "_TreeRoot",
        text : $.MyLocale.mainFrame["tree_root"],
        menu : MID["root"],
        state : { 'opened' : true},
        icon : "tree-sysicon",
        skipto : "#M_Dashboard",
        nodeType : 'root',
        children:aprs[sId]
    };

    return oGlobal;
}

function makeTrunk(locations,aprs,wsrs)
{
    var aLoca = [];
    for(var i=0;i<locations.length;i++)
    {
        var sId = "location_" + locations[i].LocationName;
        var thisApr = aprs[sId];
        var add = {
            id : "add_"+sId, 
            text : "AP Group",
            parent : sId,
            menu : MID["root"],
            icon : "tree-create",
            skipto: "#M_APGroups?type=add&np=apmgr.add_APGroup",
            nodeType : 'add',
            children : []
        };

        thisApr.push(add);

        var oLoca = {
            id : sId,
            text : locations[i].LocationName,
            parent : "TreeRoot",
            menu :MID["root"],
            icon : "tree-sysicon",
            skipto : "#M_APGroups",
            nodeType : 'location',
            children : aprs[sId]
        };
        aLoca.push(oLoca);
    }

    var oGlobal = {
        id : "_TreeRoot",
        text : $.MyLocale.mainFrame["tree_root"],
        menu : MID["root"],
        state : { 'opened' : true},
        icon : "tree-sysicon",
        skipto : "#M_Dashboard",
        nodeType : 'root',
        children:aLoca
    };

    return oGlobal;
}

function makeLeaf(oData,sName,sParent,oChildren,opt,sPre,sIdPlus)
{
    sPre = sPre || "";
    sIdPlus = sIdPlus || "";
    var oParent = {};
    for(var i=0;i<oData.length;i++)
    {
        var oTemp = oData[i];
        var oNode = {
            id : sIdPlus + oTemp[sName],
            text : oTemp[sName],
            parent : sPre + (oTemp[sParent] || sParent),
            RadioNum : oData[i].RadioNum || "0"
        };
        oChildren && (oNode.children = oChildren[oNode.id]);
        $.extend(oNode,opt);

        if($.isArray(oNode.icon))
        {
            oNode.icon = oNode.icon[oTemp.Status];
        }

        if(oParent[oNode.parent])
        {
            oParent[oNode.parent].push(oNode);
        }
        else
        {
            oParent[oNode.parent] = [oNode];
        }
    }
    return oParent;
}

function parseJsonSingle(aManual,aGroup)
{
    var aIcon = ["","tree-okicon","tree-warnicon","tree-erricon"];

    var oApOpt = {
        menu : MID["node"],
        icon : aIcon,
        nodeType : 'ap',
        skipto : "#M_AccessPoints"
    };
    var oAps = makeLeaf(aManual,"Name","GroupName",null,oApOpt,"group_");

    var oGroOpt = {
        menu : MID["group"],
        icon : "tree-sysicon",
        nodeType : 'group',
        skipto : "#M_GroupsSetting"
    };
    var oGroups = makeLeaf(aGroup,"Name","Default Location",oAps,oGroOpt,null,"group_");

    return makeTrunkSingle(null,oGroups);
}

function parseJsonTree(aManual,aGroup,aLocation)
{
    var aIcon = ["","tree-okicon","tree-erricon","tree-warnicon"];

    var oApOpt = {
        menu : MID["node"],
        icon : aIcon,
        nodeType : 'ap',
        skipto : "#M_AccessPoints"
    };
    var oAps = makeLeaf(aManual,"Name","GroupName",null,oApOpt,"group_");

    var oGroOpt = {
        menu : MID["group"],
        icon : "tree-sysicon",
        nodeType : 'group',
        skipto : "#M_GroupsSetting"
    };
    var oGroups = makeLeaf(aGroup,"Name","LocationName",oAps,oGroOpt,"location_","group_");

    var oLocOpt = {
        menu :MID["root"],
        icon : "tree-sysicon",
        nodeType : 'location',
        skipto : "#M_APGroups"
    };
    var oLoactions = makeLeaf(aLocation,"LocationName","TreeRoot",oGroups,oLocOpt,null,"location_");

    return makeTrunk(aLocation,oGroups);
}

function checkGroup(aAp)
{
    for(var i=0;i<aAp.length;i++)
    {
        if(!aAp[i].GroupName)
        {
            aAp[i].GroupName = "Default Group";
        }
    }
}

function initData(){

    function onReqErr()
    {
        g_hWait && g_hWait.close();

        $("body").layout().hide("west");
        $("body").layout().hide("south");
        $("body").layout().hide("north");
        $("#frame_nav,#tbarSave,#change_password").hide();
    }
    
    function myCallback(oInfos)
    {
        g_hWait && g_hWait.close();

        var aManual = oManualAP.getData(oInfos);
        var aGroup = oAPGroup.getData(oInfos);
        var aLocation = oAPLocation.getData(oInfos);

        //checkGroup(aManualAp);
        if(aLocation.length > 1)
        {
            g_oTreeData = parseJsonTree(aManual,aGroup,aLocation);//local test
        }
        else
        {
            g_oTreeData = parseJsonSingle(aManual,aGroup);
        }

        makeTreeMain();
    }

    var oManualAP = Utils.AP.ManualAP(["Name","Status","GroupName","LocationName","RadioNum"]);
    var oAPGroup = Utils.AP.APGroup(["Name","LocationName"]);
    var oAPLocation = Utils.AP.APLocation();

    var oManualReq = oManualAP.getRequestTable(); 
    var oGroupReq = oAPGroup.getRequestTable(); 
    var oLocationReq = oAPLocation.getRequestTable();

    Utils.Request.getAll([oManualReq,oGroupReq,oLocationReq], myCallback, onReqErr, {showErrMsg:false});

    g_hWait = Utils.Msg.wait($.MyLocale.WAITING);
}

function initSearch()
{
    var jSearch = $("#side_menu .tree-search"), 
        jClear = jSearch.next(),
        hTime = false;

    jClear.click(function(){
        jClear.hide();
        jSearch.val("").focus().keyup();
    });

    jSearch.bind('keyup',function(e){

        jSearch.val() ? jClear.show() : jClear.hide();

        if(hTime)
        {
            clearTimeout(hTime);
            hTime = false;
        }

        hTime = setTimeout(function(){
            var str = $.trim(jSearch.val());
            g_hTree.jstree("search",str,[true]);
        },300);
    });
}

function _init(oPara)
{   
    g_hTree = $("#menuTree");
    initSearch();
    initData();
}

function _destroy()
{
    Frame.Debuger.info(MODULE_NAME + " is destroyed.");
    g_hWait = null;
}

Utils.Pages.regModule(MODULE_NAME, {
    "init": _init, 
    "destroy": _destroy, 
    "utils":["Request","AP"]
});
Frame.Debuger.info(MODULE_NAME + " is loaded.");
})( jQuery );

