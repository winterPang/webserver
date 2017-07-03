define(['angularAMD', './form-common', 'css!frame/component/form/less/input'], function (_angularAMD, _formCommon) {
  'use strict';

  var _angularAMD2 = _interopRequireDefault(_angularAMD);

  var _formCommon2 = _interopRequireDefault(_formCommon);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var patternRegex = _formCommon2.default.patternRegex;
  // 导入样式

  var errMsg = _formCommon2.default.errMsg;

  // [2,200]
  var validTypes = ['date', 'email', 'tel', 'phone', 'number', 'ip', 'mac'];
  var validValue = ['required', 'pattern', 'range', 'min', 'max', 'minlen', 'maxlen', 'lenrange'];

  /**
   * 检查字段
   * @param {*} value  数据
   * @param {String} type 类型
   * @param {*} param 校验的参数
   */
  var checkField = function checkField(value, type, param) {
    var _val;
    if (value === undefined) {
      value = '';
    }
    if (type === 'required') {
      return String(value).trim().length > 0;
    }
    if (type === 'pattern') {
      return new RegExp(param).test(value);
    }
    //  基础类型校验
    if (validTypes.indexOf(type) !== -1) {
      return patternRegex[type].test(value);
    }
    if (type === 'range') {
      _val = Number(value);
      var arr = param.split(',');
      return _val >= Number(arr[0]) && _val <= Number(arr[1]);
    }
    if (type === 'min') {
      return Number(value) >= param;
    }
    if (type === 'max') {
      return Number(value) <= param;
    }
    if (type === 'lenrange') {
      _val = String(value).trim().length;
      var _arr = param.split(',');
      return _val >= Number(_arr[0]) && _val <= Number(_arr[1]);
    }
    if (type === 'minlen') {
      return String(value).trim().length >= param;
    }
    if (type === 'maxlen') {
      return String(value).trim().length <= param;
    }
    // 其他校验
    return true;
  };

  /**
   * @description 需要支持的功能
   * 1、类型切换，支持text,number,email,tel,file,password,image，也会做相应的校验
   * 2、label配置，自动生成id
   * 3、常见的表单验证，错误消息配置,pattrn的优先级最高,每次只显示一个错误信息
   */
  var factory = function factory() {
    return {
      scope: {
        osLabel: '@',
        osModel: '=',
        osDisabled: '=',
        osType: '@',
        osValidChange: '&',
        osValidResult: '='
      },
      restrict: 'E',
      replace: true,
      template: '<div class="oasis-input" ng-class="{disabled:osDisabled}">\
        <label ng-bind="osLabel" for="{{id}}" ng-style="labelStyle"></label>\
        <input ng-model="osModel" type="text" placeholder="{{holder}}" class="form-control" id="{{id}}" ng-style="inputStyle" ng-disabled="osDisabled">\
        <span ng-bind="errmsg" ng-show="autoshowerr && errmsg && showErrMsg" class="errmsg"></span>\
        </div>',
      controller: function controller($scope) {
        $scope.osType = $scope.osType || 'text';
        $scope.id = Math.random().toString(16).substr(2) + '_' + $scope.osType;
      },
      link: function link(scope, ele, attr) {
        console.log('link...');
        var errMsgObj = {};
        var validable = !!attr['osValid'];
        // 获取错误信息key,例如required-msg="这个是必填项"  =>{required:"这个是必填项"}
        Object.keys(attr).filter(function (item) {
          if (/\Msg$/.test(item)) {
            errMsgObj[item.replace(/\Msg/, '')] = attr[item];
          }
        });

        //  判断attr的range和lenrange是否是数组，判断min,max,minlen,maxlen是否为数字
        if (attr.lenrange && attr.lenrange.split(',').length !== 2) {
          throw new Error('lenrange必须有两个值，中间使用","分割');
        }
        if (attr.range && attr.range.split(',').length !== 2) {
          throw new Error('range必须有两个值，中间使用","分割');
        }
        if (attr.min && isNaN(Number(attr.min))) {
          throw new Error('min不是一个数字');
        }
        if (attr.minlen && isNaN(Number(attr.minlen))) {
          throw new Error('minlen不是一个数字');
        }
        if (attr.max && isNaN(Number(attr.max))) {
          throw new Error('max不是一个数字');
        }
        if (attr.maxlen && isNaN(Number(attr.maxlen))) {
          throw new Error('maxlen不是一个数字');
        }

        // 存储input引用
        scope.holder = attr.placeholder || '';
        scope.autoshowerr = attr.autoshowerr === undefined ? true : attr.autoshowerr;

        scope.showErrMsg = false; //  默认不显示错误信息，防止页面刚进去就显示错误信息
        scope.errmsg = ''; //  存储所有的错误信息
        // 创建一个id，点击label的时候能激活表单

        scope.labelStyle = {
          width: attr.labelwidth ? attr.labelwidth + 'px' : '80px'
        };

        scope.inputStyle = {
          width: attr.inputwidth ? attr.inputwidth + 'px' : '200px'
        };
        //  校验结果
        if (attr.osValidResult) {
          scope.$watch('errmsg', function (msg) {
            scope.osValidResult = { valid: !msg, msg: msg };
          });
        }

        if (validable) {
          if (!attr.osModel) {
            throw new Error('如果你配置了表单验证，你必须要配置os-model');
          }
          // 处理表单校验
          scope.$watch('osModel', function (value, old) {
            var result = void 0,
                needValid = [];

            if (value === undefined && old === undefined || value === '' && old === '') {
              scope.showErrMsg = false;
            } else {
              scope.showErrMsg = true;
            }
            value = value === undefined ? '' : value;
            // 是否校验通过的

            needValid = needValid.concat(validValue);
            // 检查type
            if (validTypes.indexOf(scope.osType) !== -1) {
              // 将type放在正则表达式和require的后面
              needValid.splice(2, 0, scope.osType);
            }
            /**
             * 如果添加了正则正则表达式的校验，则忽略其他的校验方式，除了必填的
             */
            if (attr['pattern'] !== undefined) {
              needValid = ['pattern'];
              //  先校验必填项
              if (attr['required']) {
                needValid.unshift('required');
              }
            }

            //  不是必填项，如果没有输入的时候，就不要校验了
            if (attr['required'] === undefined) {
              if (String(value).trim().length === 0) {
                // 直接校验成功
                scope.errmsg = '';
                return;
              }
            }
            // 轮训所有需要检查的数据
            for (var index in needValid) {
              // 获取校验规则的字段  例如required
              var key = needValid[index];
              // 校验属性和type
              if (key === scope.osType || attr[key] !== undefined) {
                result = checkField(value, key, attr[key]);
                // 校验失败了就显示结果
                if (!result) {
                  // 显示错误消息，并且不往下执行了
                  // scope.errmsg = errMsgObj[scope.osType] || errMsg[scope.osType];
                  // 所有无参数的提示信息
                  if (['required', 'pattern'].concat(validTypes).indexOf(key) !== -1) {
                    scope.errmsg = errMsgObj[key] || errMsg[key];
                  } else if (['min', 'max', 'minlen', 'maxlen'].indexOf(key) !== -1) {
                    // 需要替换value的
                    scope.errmsg = (errMsgObj[key] || errMsg[key]).replace(/\$value/g, attr[key]);
                  } else if (['range', 'lenrange'].indexOf(key) !== -1) {
                    var arr = attr[key].split(',');
                    // 需要替换$start和$end的
                    scope.errmsg = (errMsgObj[key] || errMsg[key]).replace(/\$start/g, arr[0]).replace(/\$end/g, arr[1]);
                  }
                  break;
                }
              }
            }
            if (result) {
              scope.errmsg = '';
            }
          });
        }
      }
    };
  };

  // 将常量挂在window上
  window.oasisInputConst = {
    patternRegex: patternRegex,
    errMsg: errMsg,
    validTypes: validTypes,
    validValue: validValue
  };

  _angularAMD2.default.directive('oasisInput', [factory]);
});
//# sourceMappingURL=oasis-input.js.map
