
Cloud plat webserver with websocket-server.

webserver服务器端程序。该程序同时提供http服务和websocket服务。
webserver.js为该程序的总入口，在拿到该程序时，只需要在该文件修改一些初始化参数即可运行，包括连接redis数据库的参数、连接mongoose数据库的参数和连接MQ服务器的设置。

models目录存放webserver提供的一些数据库表，可以不必关心。

webexpress为express框架，所有的后台微服务如需增加微服务处理，只需修改webexpress目录即可，其他目录的文件无需改动。可以按照以下步骤添加：
一、在webexpress目录下的app.js文件中参考base模块添加对应微服务；
二、在webexpress目录下的routes目录下参考base.js文件添加对应模块的路由处理文件；
三、如需提供静态文件进行渲染，请在webexpress目录下的public目录下，按照微服务的名称创建各自微服务的目录，用来存放静态文件。

如在上述操作中有疑问，请仔细阅读wlanpub下面的README.md，里面有详细介绍，关于mqhd和dbhd如何使用，请务必仔细阅读。

环境变量的实现目的在于适配不同生产环境，取代固定的配置文件，详细如下：
一、在src目录下的config.js中可以查看所有webserver相关的环境变量定义；
二、有关环境变量的实现方式，详细使用参照以下样例：
###你可以根据下面的环境变量来修改容器内部环境变量的值
    Name                              | Default                           | Description
    ----------------------------------|-----------------------------------|----------------------------------
    `WEBSERVER_CONFIG_HTTPPORT`        | `80`                              | http默认端口
    `WEBSERVER_CONFIG_HTTPSPORT`       | `443`                             | https默认端口
    `WEBSERVER_CONFIG_SSL_ENABLED`     | `true`                            | 使能ssl认证
    `WEBSERVER_CONFIG_SSL_CERT`        | `./ca/wildcard.crt`               | ssl证书文件
    `WEBSERVER_CONFIG_SSL_KEY`         | `./ca/wildcard.rsa`               | ssl秘钥文件
    `WEBSERVER_CONFIG_CAS_URL`         | `https://lvzhou.h3c.com/cas`      | 绿洲cas认证服务器
    `WEBSERVER_CONFIG_SERVICE_URL`     | `http://localhost`                | 默认服务url地址，非默认端口记得加端口号
    `WEBSERVER_CONFIG_LOGIN_URL`       | `http://localhost`                | 默认登录url地址，非默认端口记得加端口号
    `WEBSERVER_CONFIG_ALLOW_ORIGIN`    | `http://lvzhou.h3c.com`           | 可信任域名地址
    `WEBSERVER_CONFIG_BDELDEVCONN`               | `true`                  | 是否启动定时器定时删除设备连接
    `WEBSERVER_CONFIG_DEVCONNDELPERIOD`          | `600000`                | 定时删除设备连接的定时器间隔
    `WEBSERVER_CONFIG_DEVCONNTIMEOUTPERIOD`      | `600000`                | 设备连接的老化间隔

###Just an example
    docker run -idt -p 10443:10443 -p 8088:8088 \
        -e WEBSERVER_CONFIG_HTTPPORT=8 \
        -e WEBSERVER_CONFIG_HTTPSPORT=3 \
        -e WEBSERVER_CONFIG_SSL_CERT='./ca/wildcard.crt' \
        -e WEBSERVER_CONFIG_SSL_KEY='./ca/wildcard.rsa' \
        -e WEBSERVER_CONFIG_CAS_URL="https://lvzhou.hello.com/cas" \
        -e WEBSERVER_CONFIG_SERVICE_URL="https://hello" \
        -e WEBSERVER_CONFIG_LOGIN_URL="https://hello" \
        -e WEBSERVER_CONFIG_ALLOW_ORIGIN="https://lvzhou.hello.com" \
    h3crd-wlan1.chinacloudapp.cn:5000/sttest/webserver_test:2016080210345

## webserver_wbc can be runed as follow：
    docker run -idt -p 10443:10443 -p 8088:8088 \
        -e WEBSERVER_CONFIG_SERVICE_URL="http://172.27.8.209:8088" \
        -e WEBSERVER_CONFIG_LOGIN_URL="http://172.27.8.209:8088" \
        -e WEBSERVER_CONFIG_ALLOW_ORIGIN="http://lvzhou.h3c.com" \
        -e WEBSERVER_CONFIG_SSL_ENABLED="false" \
    h3crd-wlan1.chinacloudapp.cn:5000/sttest/webserver_test:20160808110556

###controller.yaml配置
    spec:
      containers:
      - name: webserver
        image: h3crd-wlan1.chinacloudapp.cn:5000/sttest/webserver_test:201607271736
        ports:
          - containerPort: 8088
          - containerPort: 10443
        env:
          - name: WEBSERVER_CONFIG_HTTPPORT
            value: "8088"
          - name: WEBSERVER_CONFIG_HTTPSPORT
            value: "10443"
          - name: WEBSERVER_CONFIG_SSL_CERT
            value: "./ca/wildcard.crt"
          - name: WEBSERVER_CONFIG_SSL_KEY
            value: "./ca/wildcard.rsa"
          - name: WEBSERVER_CONFIG_CAS_URL
            value: "https://lvzhou.hello.com/cas"
          - name: WEBSERVER_CONFIG_SERVICE_URL
            value: "https://localhost"
          - name: WEBSERVER_CONFIG_LOGIN_URL
            value: "https://localhost"
          - name: WEBSERVER_CONFIG_ALLOW_ORIGIN
            value: "https://lvzhou.hello.com"
