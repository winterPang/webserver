;(function ($) {
var MODULE_NAME = "wdashboard.webmap";
var g_count = 0;

function getRcText(sRcId)
{
    return Utils.Base.getRcString("change_contents_rc", sRcId);
}

function _getRcText(oItem)
{
    //type:"Menu","mainFrame" ...
    var oRcMsg = $.MyLocale.Menu;
    var sId = oItem.id || oItem;

    return oItem.desc || oRcMsg[sId];
}

function printHtml(oPara)
{
    var urlstr = "";
    var aHtml = [];
    var aview = getRcText("VIEW").split(",");

    function getSubSubmenu1(achild34)
    {
        for(var m = 0; m < achild34.length; m++)
        {
            if(achild34[m].tabs == undefined)
            {
                aHtml.push("<div class='child4'><a href=" + "#" + achild34[m].id + "><span>" +  _getRcText(achild34[m]) + "</span></a></div>");
            }
            else
            {
                aHtml.push("<div class='child4'><a><span>" + _getRcText(achild34[m]) + "</span></a>");
                getSubSubmenu(achild34[m].tabs);
                aHtml.push("</div>");
            }
        }
    }

    function getSubSubmenu(achild34)
    {
        for(var m = 0; m < achild34.length; m++)
        {
            if(achild34[m].tabs == undefined)
            {
                aHtml.push("<div class='child3'><a href=" + "#" + achild34[m].id + "><span>" +  _getRcText(achild34[m]) + "</span></a></div>");
            }
            else
            {
                aHtml.push("<div class='child3'><a><span>" + _getRcText(achild34[m]) + "</span></a>");
                getSubSubmenu1(achild34[m].tabs);
                aHtml.push("</div>");
            }
        }
    }

    function getSubTabid(aTabid)
    {
        for(var j = 0; j < aTabid.length; j++)
        {
            if((aTabid[j].tabs == undefined) && (aTabid[j].submenu == undefined))
            {
                aHtml.push("<div class='child3'><a href=" + "#" + aTabid[j].id + "><span>" +  _getRcText(aTabid[j]) + "</span></a></div>");
            }
            if(aTabid[j].tabs != undefined)
            {
                aHtml.push("<div class='child3'><a><span>" + _getRcText(aTabid[j]) + "</span></a>");
                getSubSubmenu(aTabid[j].tabs);
                aHtml.push("</div>");
            }
            if(aTabid[j].submenu != undefined)
            {
                aHtml.push("<div class='child3'><a><span>" + _getRcText(aTabid[j]) + "</span></a>");
                getSubSubmenu(aTabid[j].submenu);
                aHtml.push("</div>");
            }
        }
    }

    function getTabidOrSubmenu(aTabid)
    {
        g_count = 0;
        aHtml.push('<div class="col-sm-12" style="padding-left:inherit;padding-bottom: 20px">');
        for(var j = 0; j < aTabid.length; j++)
        {
            if((aTabid[j].tabs == undefined) && (aTabid[j].submenu == undefined))
            {
                aHtml.push("<div class='child2'><a href=" + "#" + aTabid[j].id + "><span>" +  _getRcText(aTabid[j]) + "</span></a></div>");
            }
            if((aTabid[j].tabs != undefined))
            {
                g_count++;
                aHtml.push("<div class='child2'><a><span>" + _getRcText(aTabid[j]) + "</span></a>");
                getSubTabid(aTabid[j].tabs);
                aHtml.push("</div>");
                if(g_count == 5)
                {
                    aHtml.push('</div><div>');
                    g_count = 0;
                }
            }
            if(aTabid[j].submenu != undefined)
            {
                g_count++;
                aHtml.push("<div class='child2'><a><span>" + _getRcText(aTabid[j]) + "</span></a>");
                getSubSubmenu(aTabid[j].submenu);
                aHtml.push("</div>");
                if(g_count == 5)
                {
                    aHtml.push('</div><br/><br/><div>');
                    g_count = 0;
                }
            }
        }

        if(g_count)
        {
            aHtml.push('</div>');
        }
    }

    function getSubmenu(achild)
    {
        for(var i = 0; i < achild.length; i++)
        {
            if(achild[i].submenu == undefined)
            {
                aHtml.push("<div class='child1'><a href=" + "#" + achild[i].id + "><span>" + _getRcText(achild[i]) + "</span></a></div>");
                aHtml.push("<hr/ style='margin:10px 0 10px 0'> ");
            }
            else
            {
                aHtml.push("<div class='child1'><a><span>" + _getRcText(achild[i]) + "</span></a>");
                aHtml.push("<hr/ style='margin:10px 0 10px 0'>");
                getTabidOrSubmenu(achild[i].submenu);
                aHtml.push("</div>");

            }
        }
    }

    if(oPara)
    {
        getSubmenu(oPara);
    }
    urlstr = aHtml.join("");
    
    return urlstr;
}

function _init(oData)
{    
    console.log(oData);
    var sSystem = printHtml(oData.M_System);
    var sGlobal = printHtml(oData.M_Global);
    $("#contents1").html(sSystem);
    $("#contents2").html(sGlobal);
    $(".webmap").click(function(){
       var sPath = Frame.Cookie.get("MenuType");
        if((this.id == "contents1") && (sPath == "M_Global")) 
        {
            $("#view_switch .switch-btn li").first().click();
        }
        if((this.id == "contents2") && (sPath == "M_System")) 
        {
            $("#view_switch .switch-btn li").last().click();
        }
    });
}

function _destroy()
{

}

Utils.Pages.regModule(MODULE_NAME, {"init": _init, "destroy": _destroy, "widgets": ["Form"], "utils":["Request","Base"]});
})(jQuery);