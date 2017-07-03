"use strict";
var config = require('wlanpub').config;
var fs = require('fs');
var multiparty = require('multiparty');
var request = require('request');
var conf = require('../../../../config');

var hdfsConnOption = conf.hdfsConnOption;
var CONST_LOG_HEAD = "[WEBSERVER][lib][fileop.js] rollbackDownCfg";

function Fileop(req, resp) {
  this.req = req;
  this.resp = resp;
}

Fileop.prototype.getFileFromDev = function (localDir, cb) {
  console.warn(CONST_LOG_HEAD + " come in Fileop.prototype.getFileFromDev()");
  var form = new multiparty.Form({
    uploadDir: localDir
  });

  form.parse(this.req, function (err, fields, files) {
    if (err) {
      if (typeof cb == "function") {
        cb("fail", "");
      }
    } else {
      var inputFile = files.filename[0];
      var uploadedPath = inputFile.path;
      var dstPath = localDir + inputFile.originalFilename;

      fs.rename(uploadedPath, dstPath, function (err) {
        if (err) {
          if (typeof cb == "function") {
            cb("fail", "");
          }
          console.warn(CONST_LOG_HEAD + " rename file[%s] error: %s", inputFile.originalFilename, err);
        } else {
          if (typeof cb == "function") {
            cb("success", inputFile.originalFilename);
          }
        }
      });
    }
  });
};

Fileop.prototype.putFile2HDFS = function (hdfsDir, localDir, localFile, rollbackPub, cb) {
  console.warn(CONST_LOG_HEAD + rollbackPub + " come in Fileop.prototype.putFile2HDFS()");

  var hdfsurl = 'http://' + hdfsConnOption.host + ':' + hdfsConnOption.port + hdfsConnOption.path + hdfsDir + localFile + '?op=CREATE';
  var hdfs = request.put(hdfsurl);

  hdfs.on('response', function (resp) {
    if (307 == resp.statusCode) {
      var filePath = localDir + localFile;
      var options = {
        url: resp.headers.location,
        method: 'PUT',
        headers: {
          'User-Agent': 'request',
          'content-type': 'application/octet-stream'
        }
      };

      var writeHdfs = request(options);
      writeHdfs.on("response", function (resp2) {
        if (201 == resp2.statusCode) {
          if (typeof cb == "function") {
            cb("success");
          }
          console.warn(CONST_LOG_HEAD + rollbackPub + " upload file[%s] to hdfs success", filePath);
        } else {
          if (typeof cb == "function") {
            cb("fail");
          }
          console.warn(CONST_LOG_HEAD + rollbackPub + " upload file[%s] to hdfs fail, statusCode: %s", filePath, resp2.statusCode);
        }
      });

      var rdfs = fs.createReadStream(filePath);
      rdfs.on('error', function (err) {
        console.warn(CONST_LOG_HEAD + rollbackPub + " read file[%s] error: %s", filePath, err);
      });
      rdfs.pipe(writeHdfs);
    } else { //error
      if (typeof cb == "function") {
        cb("fail");
      }
      console.warn(CONST_LOG_HEAD + rollbackPub + " upload file[%s] to hdfs error: communicate hdfs fail", filePath);
    }
  });
};

Fileop.prototype.getFileFromHDFS = function (hdfsDir, fileName, rollbackPub, cb) {
  console.warn(CONST_LOG_HEAD + rollbackPub + " come in Fileop.prototype.getFileFromHDFS()");

  var self = this;
  var hdfsurl = 'http://' + hdfsConnOption.host + ':' + hdfsConnOption.port + hdfsConnOption.path + hdfsDir + fileName + '?op=OPEN';

  var hdfsStream = request(hdfsurl);

  hdfsStream.on("response", function (resp) {
    hdfsStream.pipe(self.resp);
  }).on("complete", function (resp) {
    if (200 == resp.statusCode) {
      self.resp.end();
      if (typeof cb == "function") {
        cb("success");
      }
    } else {
      console.warn(CONST_LOG_HEAD + rollbackPub + " download file[%s] from hdfs failed", fileName);
      self.resp.end();
      if (typeof cb == "function") {
        cb("fail");
      }
    }
  }).on("error", function (err) {
    console.warn(CONST_LOG_HEAD + rollbackPub + " Fileop.getFileFromHDFS ERROR, the file name is %s", fileName);
  });
};

Fileop.prototype.delFileFromHDFS = function (hdfsDir, fileName, rollbackPub, cb) {
  console.warn(CONST_LOG_HEAD + rollbackPub + " come in Fileop.prototype.delFileFromHDFS()");

  var hdfsurl = 'http://' + hdfsConnOption.host + ':' + hdfsConnOption.port + hdfsConnOption.path + hdfsDir + fileName + '?op=DELETE&recursive=false';

  var hdfs = request.del(hdfsurl);
  hdfs.on('response', function (resp) { //-->
    if (200 == resp.statusCode) {
      if (typeof cb == "function") {
        cb("success");
      }
    } else {
      if (typeof cb == "function") {
        cb("fail");
      }
      console.warn(CONST_LOG_HEAD + rollbackPub + " rm file[%s] from hdfs fail", fileName);
    }
  });
};

Fileop.prototype.mkDirOnHDFS = function (hdfsDir, cb) {
  console.warn(CONST_LOG_HEAD + " come in Fileop.prototype.mkDirOnHDFS()");

  var hdfsurl = 'http://' + hdfsConnOption.host + ':' + hdfsConnOption.port + hdfsConnOption.path + hdfsDir + 'op=MKDIRS&permission=0777';

  var hdfs = request.put(hdfsurl);
  hdfs.on('response', function (resp) { //-->
    if (200 == resp.statusCode) {
      if (typeof cb == "function") {
        cb("success");
      }
    } else {
      if (typeof cb == "function") {
        cb("fail");
      }
      console.warn(CONST_LOG_HEAD + " mkdir dir[%s] from hdfs fail", hdfsDir);
    }
  });
};

module.exports = Fileop;