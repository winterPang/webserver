// 纯JS省市区三级联动
function initAddress(fn, lang) {
    lang = lang || 'en';
    $.get('../site/libs/address-' + lang + '.json').success(function (data) {
        var provinceList = data;
        //地址联动
        var cmbProvince = document.getElementById("cmbProvince");
        var cmbCitys = document.getElementById("cmbCitys");
        var cmbArea = document.getElementById("cmbArea");


        var defaultProvince, defaultCity, defaultArea;

        function cmbSelect(cmb, str) {
            for (var i = 0; i < cmb.options.length; i++) {
                if (cmb.options[i].value == str) {
                    cmb.selectedIndex = i;
                    return;
                }
            }

        }

        function cmbAddOption(cmb, str, obj) {
            var option = document.createElement("OPTION");
            cmb.options.add(option);
            option.innerHTML = str;
            option.value = str;
            option.obj = obj;
        }

        function changeCity() {
            cmbArea.options.length = 0;
            if (cmbCitys.selectedIndex == -1)return;
            var item = cmbCitys.options[cmbCitys.selectedIndex].obj;
            for (var i = 0; i < item.areaList.length; i++) {
                cmbAddOption(cmbArea, item.areaList[i], null);
            }
            cmbSelect(cmbArea, defaultArea);
        }

        function changeProvince() {
            cmbCitys.options.length = 0;
            cmbCitys.onchange = null;
            if (cmbProvince.selectedIndex == -1)return;
            var item = cmbProvince.options[cmbProvince.selectedIndex].obj;
            for (var i = 0; i < item.cityList.length; i++) {
                cmbAddOption(cmbCitys, item.cityList[i].name, item.cityList[i]);
            }
            cmbSelect(cmbCitys, defaultCity);
            changeCity();
            cmbCitys.onchange = changeCity;
        }

        for (var i = 0; i < provinceList.length; i++) {
            cmbAddOption(cmbProvince, provinceList[i].name, provinceList[i]);
        }
        cmbSelect(cmbProvince, defaultProvince);
        changeProvince();
        cmbProvince.onchange = changeProvince;
        var initCity=lang=='cn'?'北京':'Beijing';
        fn && fn(initCity);

    });
}
