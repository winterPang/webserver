# DOCKER-VERSION 0.3.4
FROM    h3crd-wlan1.chinacloudapp.cn:5000/tinycore-node:4.4.5 

ENV     NODE_ENV production

# The command to exec while docker has been stated
RUN     mkdir -p /workspace
RUN     mkdir -p /workspace/logs
ADD     src  /workspace/src

WORKDIR /workspace/src

EXPOSE  443
EXPOSE  80

CMD sleep 1 && node webserver.js

#CMD sleep 1 && npm install -g cnpm --registry=https://registry.npm.taobao.org && cnpm install -g node-inspector && chmod 777 start.sh && ./start.sh && node -max-old-space-size=2500 --debug webserver.js