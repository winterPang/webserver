/**
 * Created by zhengchunyu kf6899 on 2017/3/29.
 */
define(["angularAMD", "utils", "sprintf"], function (app, Utils) {
    // GetLang
    var LANG = Utils.getLang() || "cn";
    app.filter("hightLight",function($sce,$log){
        var fn = function(contant,search){
            if(!search)
            {
                return $sce.trustAsHtml(contant);
            }
            var regex = new RegExp(search, 'gi')
            var result = contant.replace(regex, '<span class="highlightedText">$&</span>');
            return $sce.trustAsHtml(result);
        }
        return fn;
    })

    app.filter("myFilter",function($filter){
        return function(dataArr,attrFilter,search){
            if(!search)
            {
                return dataArr;
            }
            var result = [];
            angular.forEach(attrFilter,function(item,i,array){
                var searchObj = {};
                searchObj[item] = search;
                var data_fil = $filter('filter')(dataArr,searchObj);
                result = result.concat(data_fil);
            })
            return $.unique(result);
        }
    })

});