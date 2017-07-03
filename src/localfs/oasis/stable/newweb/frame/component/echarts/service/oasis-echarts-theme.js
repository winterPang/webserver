define(["angularAMD", "./theme/dark", "./theme/shine"], function (_angularAMD) {
    "use strict";

    var _angularAMD2 = _interopRequireDefault(_angularAMD);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    _angularAMD2.default.factory('echartsTheme', ['darkTheme', 'shineTheme', function (dark, shine) {
        var themes = {
            dark: dark,
            shine: shine
        };
        return {
            get: function get(name) {
                return themes[name] ? themes[name] : {};
            }
        };
    }]);
});
//# sourceMappingURL=oasis-echarts-theme.js.map
