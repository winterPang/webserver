#bsMable指令介绍

### 1、支持的功能
**双向数据绑定不能绑定基本类型，需要把基本类型放到对象上，例如  要绑定用户信息时  ，$scope.userInfo={name:'zhangsan',age:23}  不能使用$scope.name='zhansgan',$scope.age=23;否则双向绑定会失败**
```
option: {
    mId:'aaa',                              // 模态框唯一的标示
    title:"提示"                             // 弹出框标题自定义，默认标题为“提示”
    autoClose: true                         // 点击确定按钮是否关闭弹窗，默认关闭
    showCancel: true                        // 是否显示取消按钮，默认显示
    modalSize:'normal'                      // 可选值 normal,sm,lg  分别对应正常，小型，大型
    showHeader:true                         // 显示头部
    showFooter:true                         // 显示尾部和按钮
    showClose:true                          // 显示右上角关闭按钮
    okText: '确定',  // 确定按钮文本
    cancelText: '取消',  //取消按钮文本
    okHandler: function(modal,$ele){
        //点击确定按钮事件，默认什么都不做
        //   modal支持hide方法，使模态框隐藏
    },
    cancelHandler: function(modal,$ele){
        //点击取消按钮事件，默认什么都不做，并且关闭取消按钮
    },
    beforeRender: function($ele){
        //渲染弹窗之前执行的操作,$ele为传入的html片段
        return $ele;
    }
}
```
### 2、用法
- 加载bsModal.js文件
- 页面中引入bs-modal属性，可以使用任意标签，使用bs-modal属性的标签及标签里面的内容为弹出框内容区部分。例如```<div bs-modal="options" ></div>```
- 在controller中加入模态框的配置，例如
```
  $scope.options = {
      //配置项参数同上（支持的功能下的option），与默认相同项可省略配置
  };

  //suffix  是事件的后缀，生成方案是根据option.mId生成    如果option.mId=='' -> suffix=''   否则  suffix='#'+option.mId
  //例如option.mId='m01'    则需要触发  show#m01   或  hide#m01  来展示或隐藏模态框

  //  显示模态框
  $scope.$broadcast('show'+suffix);

  //   隐藏模态框
  $scope.$broadcast('hide'+suffix);
  
  //   禁用确定按钮
  $scope.$broadcast('disabled.ok'+suffix);
  
  //   启用确定按钮
  $scope.$broadcast('enable.ok'+suffix);
  
  //   禁用取消按钮
  $scope.$broadcast('disabled.cancel'+suffix);
  
  //   启用取消按钮
  $scope.$broadcast('enable.cancel'+suffix);
```



