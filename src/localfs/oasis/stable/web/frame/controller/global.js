/**
 * Created by Administrator on 2016/8/23.
 */
define(['socketio', 'utils', 'xiaobeichat'], function (socketio, Utils) {
    window.io = socketio;
    return ['$scope', '$http', '$alertService','$timeout', function ($scope, $http, $alert,$timeout) {
        var Info_rc = 'global_rc';

        function getRcString(attrName) {
            return Utils.getRcString(Info_rc, attrName);
        }


        var chat = $("#chat_html").xiaoBeiChat({
            xiaobeiPath: "../../../../v3/web/chat/cn/chat.html",
            sessionId: $scope.userInfo.JSESSIONID
        });
        chat.bind("newMsg", function (e, d) {
            if (d) {
                console.log("您有新消息");
            } else {
                console.log("消息已经被收取");
            }
        });
        chat.on("chatHeadImg", function (e, d) {
            console.debug(d);
            if (d) {
                // $("#chatHeadImg").attr("src", data);
                $("#headImg").attr("src", d);
            }
        });
        $("#chat_html").hover(function () {
                $("#chatimg").attr("src", "images/chatting.png");
            },
            function () {
                $("#chatimg").attr("src", "images/wechat.png");
            });
        $scope.logout = function () {
            $alert.confirm(getRcString("logout-message"), function () {
                window.location.href = '/v3/logout'
            })
        };

        $scope.goSystem = function () {
            if ($scope.$state.current.name == 'global.content.system.site') {
                location.reload();
            } else {
                $scope.$state.go('global.content.system.site');
            }
            console.log($scope.$state);
        };
        if( Utils.getLang() == 'cn'){
            $scope.cnLanguage='language-active';
        }else{
            $scope.enLanguage = 'language-active';
        }

        $scope.changeLange = function(lang){
            if(lang=="cn"){
                $scope.enLanguage = '';
                $scope.cnLanguage='language-active';
            }else{
                $scope.enLanguage = 'language-active';
                $scope.cnLanguage='';
            }
            Utils.setLang({'lang':lang},undefined,'.h3c.com');
            window.location.reload();
        };
        $scope.goHome = function () {
            if ($scope.$state.current.name == 'global.content.home') {
                location.reload();
            } else {
                $scope.$state.go('global.content.home');
            }
            console.log($scope.$state);
        };




        var getLogs = '/v3/ant/logmgr';
        var throll = function(func,interval){
            var timeout = null;
            return function () {
                if(timeout){
                    $timeout.cancel(timeout);
                    timeout = null;
                }else{
                    timeout = $timeout(func.bind(null,arguments),interval)
                }
            }
        };
        var scrollHandle = throll(function(ev) {
            var target = ev[0].target;
            if(target.scrollTop > (target.scrollHeight - target.offsetHeight)/2){
                var opt = {
                    lang:Utils.getLang(),
                    ev:'logAboutOasis',
                    method:'read',
                    offset:$scope.aboutLogs.length
                };
                $http({
                    url:getLogs,
                    method:'POST',
                    data:opt
                })
                    .success(function(data){
                        if(data.message.length === 0 ){
                            $('.about-oasis').off('scroll');
                            scrollHandle = null;
                            return
                        }
                        $scope.aboutLogs = $scope.aboutLogs.concat(data.message);
                    })
            }
        },300);
        $scope.aboutLogs = [
            /*{
                title:'2017.03.14 更新内容',
                info:[
                    '新场景商铺Wi-Fi上线，支持小贝路由系列产（WAP422、WAP422S、WAP422S-OASIS）；该场景适用于小微型家用/办公/商业Wi-Fi场景。']
            },{
                title:'2017.03.20 更新内容',
                info:[
                    '园区Wi-Fi、商铺Wi-Fi场景新增运维功能。',
                    '当前不对运维功能划分权限，对所有用户开放。'
                ]
            }*/
        ];

        /*
        *
         {
         "ev":"logAboutOasis",
         "method":"set",
         "lang":"cn",
         "date":"20170320",
         "title":"2017.03.20 更新内容",
         "info":["园区Wi-Fi、商铺Wi-Fi场景新增运维功能。","当前不对运维功能划分权限，对所有用户开放。"]
         }
        *
        *
        * */
        $scope.alertInfo = function () {
            $scope.$broadcast('show#about')
        };
        $scope.aboutOasisModal = {
            mId:'about',
            title:getRcString('about-oasis'),
            autoClose: true,
            showCancel: false,
            modalSize:'normal',
            showHeader:true,
            showFooter:true,
            showClose:true,
            okText: getRcString('close'),
            beforeRender:function () {
                var opt = {
                    ev:'logAboutOasis',
                    method:'read',
                    count:6,
                    lang:Utils.getLang()
                };
                $http({
                    url:getLogs,
                    method:'POST',
                    data:opt
                })
                    .then(function(data){
                        $scope.aboutLogs = data.data.message;
                    })
                    .then(function(){
                        $('.about-oasis').scroll(scrollHandle)
                    })

            }
        }

    }];
});