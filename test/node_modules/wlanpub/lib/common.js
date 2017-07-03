/**
 * Created by Juneja on 2015/10/13.
 *
 * common data
 */

var uuid    = require('uuid');

var hostnames = {
  "microCloud" : {
    "172.17.41.1": "h3crd-wlan7",
    "172.17.11.1": "h3crd-wlan8",
    "172.17.58.1": "h3crd-wlan9",
    "172.17.63.1": "h3crd-wlan11",
    "172.17.25.1": "h3crd-wlan12",
    "172.17.29.1": "h3crd-wlan13",
    "172.17.23.1": "h3crd-wlan14",
    "172.17.96.1": "h3crd-wlan15",
    "172.17.95.1": "h3crd-wlan25",
    "172.17.27.1": "h3crd-wlan26",
    "172.17.77.1": "h3crd-wlan27",
    "172.17.62.1": "h3crd-wlan28",
    "172.17.12.1": "h3crd-wlan29",
    "172.17.28.1": "h3crd-wlan37",
    "172.17.70.1": "h3crd-wlan38",
    "172.17.6.1" : "h3crd-wlan701",
    "172.17.7.1" : "h3crd-wlan702",
    "172.17.86.1": "h3crd-wlan703",

    "172.16.4.9": "h3crd-wlan7",
    "172.16.4.46": "h3crd-wlan8",
    "172.16.4.11": "h3crd-wlan9",
    "172.16.4.19": "h3crd-wlan11",
    "172.16.4.20": "h3crd-wlan12",
    "172.16.4.21": "h3crd-wlan13",
    "172.16.4.22": "h3crd-wlan14",
    "172.16.4.23": "h3crd-wlan15",
    "172.16.4.34": "h3crd-wlan25",
    "172.16.4.35": "h3crd-wlan26",
    "172.16.4.36": "h3crd-wlan27",
    "172.16.4.37": "h3crd-wlan28",
    "172.16.4.38": "h3crd-wlan29",
    "172.16.4.54": "h3crd-wlan37",
    "172.16.4.55": "h3crd-wlan38",
    "172.16.4.49": "h3crd-wlan701",
    "172.16.4.64": "h3crd-wlan702",
    "172.16.4.66": "h3crd-wlan703"
  },

  "localCloud" : {
    "172.17.93.1": "wlan-cloudserver32",
    "172.17.58.1": "wlan-cloudserver43",
    "172.17.28.1": "wlan-cloudserver44",

    "172.27.8.211": "wlan-cloudserver32",
    "172.27.9.38": "wlan-cloudserver43",
    "172.27.9.37": "wlan-cloudserver44"
  }
};

// 用来存储前端Request ID与callback函数的映射关系
var callbackMap = new Map();

module.exports = comm = {
  'setCbMap' : function (callback) {
    var reqID  = uuid.v1();

    callbackMap.set(reqID, callback);

    return reqID;
  },
  'getCbObj' : function (reqID) {
    var cbObj = callbackMap.get(reqID);
    if (!cbObj) {
      // Important: imply that has no callback
      console.error('[BASIC]Invalid callback object mapped request ID: ' + reqID);
    } else {
      callbackMap.delete(reqID);
      return cbObj;
    }
  },
  'getHostname' : function (pid, ipv4) {
    var ipkey = ipv4;
    var node_env = process.env.NODE_ENV;
    var names = hostnames.localCloud;
    var hostname = '';

    if ((node_env != undefined) && (node_env == 'production')) {
      names = hostnames.microCloud;
    }

    if (pid < 100) {
      var ipary = ipv4.split('.');

      ipary[3] = '1';
      ipkey = ipary.join('.');
    }

    hostname = names[ipkey];
    if (undefined === hostname) {
      hostname = '非kubelet';
    }

    return hostname;
  }
};
