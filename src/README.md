
Cloud plat webserver with websocket-server.

webserver�������˳��򡣸ó���ͬʱ�ṩhttp�����websocket����
webserver.jsΪ�ó��������ڣ����õ��ó���ʱ��ֻ��Ҫ�ڸ��ļ��޸�һЩ��ʼ�������������У���������redis���ݿ�Ĳ���������mongoose���ݿ�Ĳ���������MQ�����������á�

modelsĿ¼���webserver�ṩ��һЩ���ݿ�����Բ��ع��ġ�

webexpressΪexpress��ܣ����еĺ�̨΢������������΢������ֻ���޸�webexpressĿ¼���ɣ�����Ŀ¼���ļ�����Ķ������԰������²�����ӣ�
һ����webexpressĿ¼�µ�app.js�ļ��вο�baseģ����Ӷ�Ӧ΢����
������webexpressĿ¼�µ�routesĿ¼�²ο�base.js�ļ���Ӷ�Ӧģ���·�ɴ����ļ���
���������ṩ��̬�ļ�������Ⱦ������webexpressĿ¼�µ�publicĿ¼�£�����΢��������ƴ�������΢�����Ŀ¼��������ž�̬�ļ���

�������������������ʣ�����ϸ�Ķ�wlanpub�����README.md����������ϸ���ܣ�����mqhd��dbhd���ʹ�ã��������ϸ�Ķ���

����������ʵ��Ŀ���������䲻ͬ����������ȡ���̶��������ļ�����ϸ���£�
һ����srcĿ¼�µ�config.js�п��Բ鿴����webserver��صĻ����������壻
�����йػ���������ʵ�ַ�ʽ����ϸʹ�ò�������������
###����Ը�������Ļ����������޸������ڲ�����������ֵ
    Name                              | Default                           | Description
    ----------------------------------|-----------------------------------|----------------------------------
    `WEBSERVER_CONFIG_HTTPPORT`        | `80`                              | httpĬ�϶˿�
    `WEBSERVER_CONFIG_HTTPSPORT`       | `443`                             | httpsĬ�϶˿�
    `WEBSERVER_CONFIG_SSL_ENABLED`     | `true`                            | ʹ��ssl��֤
    `WEBSERVER_CONFIG_SSL_CERT`        | `./ca/wildcard.crt`               | ssl֤���ļ�
    `WEBSERVER_CONFIG_SSL_KEY`         | `./ca/wildcard.rsa`               | ssl��Կ�ļ�
    `WEBSERVER_CONFIG_CAS_URL`         | `https://lvzhou.h3c.com/cas`      | ����cas��֤������
    `WEBSERVER_CONFIG_SERVICE_URL`     | `http://localhost`                | Ĭ�Ϸ���url��ַ����Ĭ�϶˿ڼǵüӶ˿ں�
    `WEBSERVER_CONFIG_LOGIN_URL`       | `http://localhost`                | Ĭ�ϵ�¼url��ַ����Ĭ�϶˿ڼǵüӶ˿ں�
    `WEBSERVER_CONFIG_ALLOW_ORIGIN`    | `http://lvzhou.h3c.com`           | ������������ַ
    `WEBSERVER_CONFIG_BDELDEVCONN`               | `true`                  | �Ƿ�������ʱ����ʱɾ���豸����
    `WEBSERVER_CONFIG_DEVCONNDELPERIOD`          | `600000`                | ��ʱɾ���豸���ӵĶ�ʱ�����
    `WEBSERVER_CONFIG_DEVCONNTIMEOUTPERIOD`      | `600000`                | �豸���ӵ��ϻ����

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

## webserver_wbc can be runed as follow��
    docker run -idt -p 10443:10443 -p 8088:8088 \
        -e WEBSERVER_CONFIG_SERVICE_URL="http://172.27.8.209:8088" \
        -e WEBSERVER_CONFIG_LOGIN_URL="http://172.27.8.209:8088" \
        -e WEBSERVER_CONFIG_ALLOW_ORIGIN="http://lvzhou.h3c.com" \
        -e WEBSERVER_CONFIG_SSL_ENABLED="false" \
    h3crd-wlan1.chinacloudapp.cn:5000/sttest/webserver_test:20160808110556

###controller.yaml����
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
