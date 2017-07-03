define(["angularAMD",
        'json!../init/address-cn.json',
        'json!../init/address-en.json'], function (app, list_CN, list_EN) {

    app.factory('adService', ['$q','$http',function($q, $http){
/*        var ad_CN = '../message/directive/smsstatus/init/address-cn.json',
            ad_EN = '../message/directive/smsstatus/init/address-en.json';

        var list_CN,list_EN;
        $q
            .all([$http.get(ad_CN), $http.get(ad_EN)])
            .then(function(results){
                list_CN = results[0].data;
                list_EN = results[1].data
            });*/


        function trimStr(str){return str.replace(/(^\s*)|(\s*$)/g,"");}
        // mode === 0/province --- mode === 1/city
        // 'cn', 0,'北京'
        function getProvinceIndex(lang, mode, provinceIndex, province){
            var list = lang === 'cn' ? list_CN : list_EN,
                index;
            if(mode === 1){
                list = list[provinceIndex]['cityList']
            }else{
                province = provinceIndex;
            }
            for(var i = 0 ;i < 34 ;i++){
                var v = list[i];
                if(v.name === province){
                    index = i;
                    break;
                }
            }
            return index;
        }

        function indexToString(lang, mode, provinceIndex, cityIndex){
            var list = lang === 'cn' ? list_CN : list_EN,
                string;
            if(mode === 1){
                string = list[provinceIndex]['cityList'][cityIndex]['name']
            }else {
                string = list[provinceIndex]['name']
            }
            return string
        }

        function cnToEn_province(province){
            var index = this.getProvinceIndex('cn', 0, province),
                string = this.indexToString('en', 0, index);
            return {
                index: index,
                string: string
            }
        }

        function cnToEn_city(provinceIndex, city){
            var cityIndex = this.getProvinceIndex('cn', 1, provinceIndex, city),
                string = this.indexToString('en', 1, provinceIndex, cityIndex);
            return {
                provinceIndex: provinceIndex,
                cityIndex: cityIndex,
                string: string
            }
        }

        // string must be '北京' / '河北 廊坊市'
        function toEn(string){
            string = trimStr(string);
            string = string.replace(/\s/, '>');
            if(this.cache[string]){
                return this.cache[string]
            }else{
                var cityList = string.split('>'),
                    province = this.cnToEn_province(cityList[0]),
                    city;
                if(cityList.length === 1){
                    return this.cache[string] = province.string
                }else{
                    city = this.cnToEn_city(province.index, cityList[1]);
                    return this.cache[string] = province.string + ' ' + city.string
                }
            }
        }

        function toZh(string){
            string = string.toLowerCase();
            string = string.replace(/(^\s*)|(\s*$)/g,"");
            var mobileOperator = /^(china|mobile|china mobile|unicom|china unicom|telecom|china telecom)$/i;
            var hash = {
                china:'',
                mobile:'移动',
                'china mobile':'移动',
                unicom:'联通',
        		'china unicom':'联通',
				'china telecom':'电信',
                telecom:'电信'
            }
            var key = mobileOperator.exec(string);
            return key ? hash[key[0]] : 'null'
        }

        function AdService(){
            this.cache = {
                '未知': 'Unknow'
            };
        }

        AdService.prototype = {
            toEn: toEn,
            toZh: toZh,
            cnToEn_city: cnToEn_city,
            cnToEn_province: cnToEn_province,
            indexToString: indexToString,
            getProvinceIndex: getProvinceIndex
        };

        AdService.prototype.constructor = AdService;

        return new AdService()
    }])
});