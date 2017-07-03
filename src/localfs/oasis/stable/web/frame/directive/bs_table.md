#bsTable指令介绍

##新增的配置
### 1、表格本身的配置
- tId: 'base'               // 表格唯一标示，使用事件和方法的使用使用，事件和方法见下面
- showCheckBox: false       // 显示表头多选框
- showRowNumber: false      // 显示行号，默认为false
- totalField: 'total',      // 总数field，多级用点，最深是两级  例如  data.total   返回数据的total属性对应的字段
- startField: 'offset',     // 查询参数start  分页请求的开始下标，例如第一页是从0~10  则表格自动向后台发送这个参数
- limitField: 'limit',      // 查询参数limit  分页大小，分页时表格向后台发送的参数
- sortField: 'sort',        // 查询参数sort  排序字段参数
- orderField: 'order',      // 查询参数order  排序方面参数  asc/desc
- showPageList: false       // 显示分页大小下拉框
### 2、columns新增的配置
- link:false  true/string    是否渲染链接颜色，true为渲染颜色，string为跳转的地址
- linkNewPage:false boolean  是否在新的窗口打开链接，只有link=true生效
- render:''   string    传递tpl模板，可以完成字符串的拼接操作
**配置了render和link属性后formatter将不生效**
##使用描述
### 1、支持的功能
- 支持bootstrapTable所有的原生事件，去掉onAll事件
- 支持bootstrapTable所有的原生方法，除了破坏性表格的方法，例如destroy等
- 支持显示行号和checkbox，只需要简单的配置即可
- 多表格事件系统独立的实现，利用配置tId实现
- 链接渲染，可以指向有URL的链接，也可以指定链接的打开方式[linkNewPage=true在新窗口打开]
- 支持列格式化模板，在列里面直接拼接格式化，例如 ``` {field:'name',render:'你好，{name}'} ``` 格式化的列放在field中
### 2、使用说明
- 加载bsTable.js文件
- 页面中引入bs-table属性，标签可以使任意，例如```<div bs-table="options"></div>```
- formatter的简单配置，如果只是字符串的拼接，可以在列上配置render属性，会覆盖formatter
    - 配置方式是  render:'{fieldName} other {fieldName2}'  
    ```
    [
        {field: 'operatorName', title: '操作员', link: true},
        {field: 'operTime', title: '操作时间', link: '#/global/content/system/message', linkNewPage: true},
        {field: 'ipAddress', title: 'IP地址', link: 'https://www.baidu.com?wd={operatorName}'},
        {
            field: 'moduleName',
            title: '模块名称',
            render: '{moduleName} => {description}',
            link: 'https://www.baidu.com?wd={operatorName}',
            linkNewPage: true
        },
        {field: 'description', title: '操作描述',link:true,render:'{result} >>> {description}'},
        {field: 'result', title: '操作结果'},
        {field: 'failureCause', title: '失败原因'}
    ]
    ```
- columns中列配置新增两项
    - link:可选值为true和url字符串，true只渲染链接样式不指定操作，url指定跳转路劲，可以传递变量{key}，key是一个field
    ```
    {field:'name',link:'https://www.baidu.com?wd={name}'}  // 组件会将{name}转化成本行数据的name值
    ```
- 在controller中加入表格的配置，例如如下配置
```
$scope.options = {
    tId: 'base',
    showCheckBox: true,
    showRowNumber: true,
    data: [
        {name: 'zhangsan'},
    ],
    columns: [
        {title: '姓名', field: 'name'}
    ]
};
```
### 3、事件机制 [点击这里查看所有的事件和方法](http://bootstrap-table.wenzhixin.net.cn/zh-cn/documentation/#方法)
- 所有的方法在$scope的$broadcast()形式触发事件调用，方法名称和bootstrapTable原生方法保持一致，规则：
    - 如果表格设置了tId，则需要加上#tId后缀，例如上面配置刷新表格
    ```
    $scope.$broadcast('refresh#base');
    ```
    - 如果表格有返回值，可以使用回调函数得到返回的数据，例如
    ```
    $scope.$broadcast('getData#base',{},function(data){ // 第二个参数是调用方法的参数，可以不传
        console.log(data);
    });
    ```
    - 如果表格没有返回值，但是有参数，可以如下执行
    ```
    $scope.$broadcast('load#base',[{name:'lisi'}]);
    ```
- 所有的事件在$scope的$on监听，所有的事件名称和bootstrapTable保持一致，规则如下
    - 如果表格设置了tId，则需要加上#tId后缀，例如监听表格点击行
    ```
    $scope.$on('click-row.bs.table#base', function () {
        console.log(arguments);
    });
    ```
    - 如果没有设置tId，则直接和bootstrapTable事件名称一致
    ```
    $scope.$on('click-row.bs.table', function () {
        console.log(arguments);
    });
    ```
