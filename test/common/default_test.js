describe("******************************begin default test******************************", function () {
    var https = require('https')
        , isJSON = require('is-json')
        , cas = require('testpub/cas')
        , config = require('testpub/test_config');

    var test = process.env.test, host, casOption,casCategory;

    host = config.localtest,casCategory = 'explore';
    casOption = {"hostname": "localtest", "cas": "web"};

    if(test == 0)
    {
        host = config.lvzhouv3,casCategory = 'lvzhouCas';
        casOption = {"hostname": "lvzhouv3", "cas": "dev"};
    }
    var generateID = cas.generateID;
    var assert = require('assert')
        , chai = require('chai')
        , expect = chai.expect;

    var userauth = '',status1, status2, status3, status4;
    var options = {}, headers = {};
    options.host = host,
        options.port = 443,

        before(function (done) {
            generateID(casCategory, casOption, function (id) {
                headers = {
                    Cookie:id
                };
                options.headers = headers;
                done();
            });
        });
    after(function () {
        console.log("******************************end default test******************************");
    });
    describe("get information", function () {
//********************≤‚ ‘/v3/base/userauth***************************************
        it("get information by /v3", function (done) {

            options.path = '/v3',
                options.method = 'get';
            console.log(options);
            var req = https.request(options, function (res) {
                res.setEncoding('utf8');
                console.log('/v3 status:', res.statusCode);//œÏ”¶◊¥Ã¨¬Î
                status1 = res.statusCode;
                res.on('data', function (chunk) {
                });
                res.on('end', function () {
                    done();
                });
                res.on('error', function (err) {
                    console.log(err);
                    done();
                });
            });
            req.end();
        });
//********************≤‚ ‘/v3/*********************************
        it("get information by /v3/", function (done) {
            options.path = '/v3/',
                options.method = 'get';
            console.log(options);
            var req = https.request(options, function (res) {
                res.setEncoding('utf8');
                console.log('/v3/ status:', res.statusCode);//œÏ”¶◊¥Ã¨¬Î
                status2 = res.statusCode;
                res.on('data', function (chunk) {
                });
                res.on('end', function () {
                    done();
                });
                res.on('error', function (err) {
                    console.log(err);
                    done();
                });
            });
            req.end();
        });
//********************≤‚ ‘undefined*****************************
        it("get information by path=undefined", function (done) {
            options.path = undefined,
                options.method = 'get';
            console.log(options);
            var req = https.request(options, function (res) {
                status3 = res.statusCode;
                res.setEncoding('utf8');
                console.log('undefined status:', res.statusCode);//œÏ”¶◊¥Ã¨¬Î
                res.on('data', function (chunk) {
                });
                res.on('end', function () {
                    done();
                });
                res.on('error', function (err) {
                    console.log(err);
                    done();
                });
            });
            req.end();
        });
//********************≤‚ ‘/***************************
        it("get information by /", function (done) {
            options.path = '/',
                options.method = 'get';
            console.log(options);
            var req = https.request(options, function (res) {
                res.setEncoding('utf8');
                console.log('/ status:', res.statusCode);//œÏ”¶◊¥Ã¨¬Î
                status4 = res.statusCode;
                res.on('data', function (chunk) {
                });
                res.on('end', function () {
                    done();
                });
                res.on('error', function (err) {
                    console.log(err);
                    done();
                });
            });
            req.end();
        });
//********************“Ï≥£≤‚ ‘''**************************************
        it("get information by ''", function () {
            options.path = '/' + '',
                options.method = 'get';
            https.request(options).end();
        });
//********************“Ï≥£≤‚ ‘favicon.ico****************************
        it("get information by favicon.ico", function () {

            options.path = "/favicon.ico",
                options.method = 'get';
            https.request(options).end();
        });
//********************≤‚ ‘/v3/base/userauth***************************************
//        it("get information by /v3/base/userauth", function (done) {
//            var data = {
//                devSN:            "1205KKKLKLKas09",
//                devName:          "fgfhfgh",
//                devMacAddress:    "15698713223"
//            };
//            options.headers['Content-Type'] = 'application/json';
//            options.path = config.default.base.userauth,
//                options.method = 'post';
//
//            console.log("options......");
//            console.log(options);
//
//            var req = https.request(options, function (res) {
//                res.setEncoding('utf8');
//                res.on('data', function (chunk) {
//                    userauth += chunk;
//                });
//                res.on('end', function () {
//                    console.log(userauth);
//                    done();
//                });
//                res.on('error', function (err) {
//                    console.log(err);
//                    done();
//                });
//            });
//            req.end(JSON.stringify(data));
//        });
    });
    describe("assert result", function () {
        //it("assert /v3/base/userauth request", function () {
        //    expect(isJSON(userauth)).to.be.true;
        //});
        it("assert /v3 request", function () {
            assert.equal(status1, 303);
        });
        it("assert /v3/ request", function () {
            assert.equal(status2, 302);
        });
        it("assert / request", function () {
            assert.equal(status3, 302);
        });
        it("assert undefined request", function () {
            assert.equal(status4, 302);
        });
    });
});
