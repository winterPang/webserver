#ajaxValid表单验证使用

####配置参数
```
$scope.validName = {
    url: '',    //   请求的URL
    method: 'post',// 请求方式
    params: {},    //  额外参数
    live : 2,   //  是否自动验证，  boolean/number  true:修改就会触发验证,false：失去焦点触发验证，number：多少秒触发一次验证
    validFn: function (resp) {    //  验证通过的条件
        return !!resp;   boolean/number/string      如果是boolean错误信息直接是ajaxValid     否则是ajaxValid+'-'+该方法返回的
    }
}
```
####指令的配置
`<input type="text" name="name" ng-model="name" ajax-valid="validName">`

####查看是否验证通过
`{{formName.fieldName.error.ajaxValid}}`

####配置中的params说明
```
params:{
    name:'{value}',  //{value}会直接替换为model的值
    age:30
}
```
####url中也可以使用model
`url:'/admin/test/user/{value}'`