define(["angularAMD", "utils"], function (app, Utils) {
    app.factory('locConst', function(){
        /* mode
         *  location equal 0/
         *  probe equal 1/
         *  emBedde equal 2/
         *
         * order
         *  probe equal 0
         *  location equal 1
         *  embedde equal 2
         * */

        var modeMap = [
            {
                mode: 0,
                order: 1,
                name: '云端定位'
            },
            {
                mode: 1,
                order: 0,
                name: '探针定位'
            },
            {
                mode: 2,
                order: 2,
                name: '嵌入式定位'
            }
        ];

        /**
         * get mode by order or get order by mode
         *
         * @param key string - could be mode or order
         * @param value number - must be the value of mode or order
         * @returns  number - order or mode
         */

        var getValue = function (key, value, to){
            return modeMap.find(function (item){return item[key] == value})[to]
        }

        var getOrder = function (mode){
            return getValue('mode', mode, 'order')
        }

        var getMode = function (order){
            return getValue('order', order, 'mode')
        }

        var getName = function (mode){
            return getValue('mode', mode, 'name')
        }

        return {
            getOrder: getOrder,
            getMode: getMode,
            getName: getName
        }

    })
});