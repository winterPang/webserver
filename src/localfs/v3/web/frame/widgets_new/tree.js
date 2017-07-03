;(function($)
{
    var WIDGETNAME = "Tree";
    var oTree = {
        options:{
            multiple : false
        },
        _create: function()
        {
            var oTree = this._oTree = this.element;
            
            if("tree" == oTree.attr("ctrl"))
            {
                return false;
            }
            oTree.attr("ctrl", "tree");
            
            if(oTree.attr("multi")==="true")
            {
                this.options.multiple = true;
            }
            else if(oTree.attr("multi")==="false")
            {
                this.options.multiple = false;
            }
            var oTreeOpt={
                'core' : {"multiple" : this.options.multiple,"check_callback" : true},
            };

            //  aPlugins=["dnd","checkbox","contextmenu","search","sort","state","types","wholerow","unique"]
            var sPlugins = oTree.attr("plugins");
            if(sPlugins)
            {
                var aPlugins = sPlugins.split(",");
                oTreeOpt['plugins'] = aPlugins;
            }
 
            oTree.data('oTreeOpt', oTreeOpt);
            return;
        },
        InitData: function(aData,oOpt)
        {
            if(!aData)return;
            this.empty();
            var jElement = this.element; 
            var oTreeOpt = jElement.data('oTreeOpt');
            oTreeOpt.core["data"] = aData;
            jElement.jstree(oTreeOpt);
        },
        value: function(node)   
        {
            var jElement = this.element; 
            //  get value
            if(node == "")
            {
                jElement.jstree("deselect_all");
                return ;
            }
            
            if(!node)  
            {
                var aSelected = jElement.jstree("get_selected");   // it get all selected node 
                var aParentSelected=[];   // if parent node is selected  we do not need children nodes
                if(aSelected.length>1) 
                {
                    for(var i=0;i<aSelected.length;i++)
                    {
                        
                        var sParentNode = jElement.jstree("get_parent",aSelected[i]);
                        if(!jElement.jstree("is_selected",sParentNode))
                        {
                            aParentSelected.push(aSelected[i]);
                        }
                    }
                    return aParentSelected;
                }
                else
                {
                    return aSelected;
                }
            }
            //  set value
            if($.isArray(node))
            {
                for(var i=0;i<node.length;i++)
                {
                    jElement.jstree("select_node",node[i]);
                }
                return;
            }
            else 
            {
              return jElement.jstree("select_node",node);  
            }
        },
        disable: function(node)
        {   
            var jElement = this.element;
            if(node)
            {
                jElement.jstree("disable_node",node);
            }
            else if($.isArray(node))   
            {
                for(var i=0;i<node.length;i++)
                {
                    jElement.jstree("disable_node",node[i]);
                }
            }
            else
            {
                // all disable
                var allNodeId = jElement.data('jstree')._model.data["#"].children_d;  // all node
                for(var i=0;i<allNodeId.length;i++)
                {
                    jElement.jstree("disable_node",allNodeId[i]);
                }
            }
        },
        enable: function(node)
        {
            var jElement = this.element;
            if(node)
            {
                jElement.jstree("enable_node",node);
            }
            else if($.isArray(node))
            {
                for(var i=0;i<node.length;i++)
                {
                    jElement.jstree("enable_node",node[i]);
                }
            }
            else
            {
                // all enable
                var allNodeId = jElement.data('jstree')._model.data["#"].children_d;  // all node
                for(var i=0;i<allNodeId.length;i++)
                {
                    jElement.jstree("enable_node",allNodeId[i]);
                }
            }
        },
        empty: function()
        {
            var jElement = this.element;
            jElement.children().remove();
            jElement.jstree("destroy");
        }       
    };

    function _init(oFrame)
    {
        $(".tree", oFrame).tree();
    }

    function _destroy() 
    {

    }

    $.widget("ui.tree", oTree);
    Widgets.regWidget(WIDGETNAME, {
        "init": _init, "destroy": _destroy, 
        "widgets": [], 
        "utils":["Widget"],
        "libs": ["Libs.jsTree.jstree"]
    });
})(jQuery);