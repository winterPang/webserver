define(['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    patternRegex: {
      email: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
      phone: /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/,
      tel: /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/,
      date: /^\d{4}-\d{1,2}-\d{1,2}/,
      number: /^[0-9]*$/,
      ip: /((?:(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d))))/,
      mac: /^[A-F0-9]{2}(-[A-F0-9]{2}){5}$/
    },
    errMsg: {
      email: '请输入有效的电子邮箱',
      phone: '请输入有效的手机号码',
      tel: '请输入有效的电话号码',
      date: '请输入有效的日期',
      number: '请输入有效的数字',
      ip: '请输入有效的IP地址',
      mac: '请输入有效的mac地址',
      range: '必须在$start和$end之间',
      min: '不能小于$value',
      max: '不能大于$value',
      minlen: '长度不能小于$value',
      maxlen: '长度不能大于$value',
      lenrange: '长度必须在$start和$end之间',
      required: '该项必填',
      pattern: '输入格式无效'
    }
  };
});
//# sourceMappingURL=form-common.js.map
