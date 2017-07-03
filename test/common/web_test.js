describe("******************************begin web test******************************", function () {
    var https = require('https')
        , isJSON = require('is-json')
        ,isHtml = require('is-html')
        ,assert  = require('assert')
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
    var chai = require('chai')
        , expect = chai.expect;

    var static, login='', cas_session = '', L = '';

    var options = {}, headers = {};

    options.host = host,
        options.port = 443;

    before(function (done) {
        generateID(casCategory, casOption, function (id) {

            headers = {
                Cookie:id
            };
            options.headers = headers, options.method = 'GET';
            done();
        });
    });
    after(function () {
        console.log("******************************end web test******************************");
    });
    describe("get information", function () {
//********************²âÊÔ/v3/web/static**************************
        it("get information by /v3/web/static", function (done) {
            options.path = config.web.static;
            console.log('options......');
            console.log(options);

            https.request(options, function (res) {

                res.setEncoding('utf8');
                console.log('static status:', res.statusCode);//ÏìÓ¦×´Ì¬Âë
                static = res.statusCode;
                res.on('data', function (chunk) {

                });
                res.on('end', function () {

                    done();
                });
                res.on('error', function (err) {
                    console.log(err);
                    done();
                });
            }).end();
        });
//********************²âÊÔ/v3/web/login**************************
        it("get information by /v3/web/login", function (done) {
            options.path = config.web.login;
            console.log('options......');
            console.log(options);

            https.request(options, function (res) {

                res.setEncoding('utf8');
                console.log('login status:', res.statusCode);//ÏìÓ¦×´Ì¬Âë

                res.on('data', function (chunk) {
                    login += chunk;
                });
                res.on('end', function () {

                    done();
                });
                res.on('error', function (err) {
                    console.log(err);
                    done();
                });
            }).end();
        });
//************************²âÊÔ/v3/web/cas_session********************
        it("get information by /v3/web/cas_session", function (done) {
            options.path = config.web.cas_session;
            console.log('options......');
            console.log(options);

            https.request(options, function (res) {

                res.setEncoding('utf8');
                console.log('login status:', res.statusCode);//ÏìÓ¦×´Ì¬Âë

                res.on('data', function (chunk) {
                    cas_session += chunk;
                });
                res.on('end', function () {
                    console.log(cas_session);
                    done();
                });
                res.on('error', function (err) {
                    console.log(err);
                    done();
                });
            }).end();
        });
//************************²âÊÔ/v3/web/********************
        it("get information by /v3/web/", function (done) {
            options.path = config.web.L;
            console.log('options......');
            console.log(options);

            https.request(options, function (res) {

                res.setEncoding('utf8');
                console.log('/ status:', res.statusCode);//ÏìÓ¦×´Ì¬Âë
                L = res.statusCode;
                res.on('data', function (chunk) {

                });
                res.on('end', function () {

                    done();
                });
                res.on('error', function (err) {
                    console.log(err);
                    done();
                });
            }).end();
        });
    });

    describe("assert result", function () {
        it("assert /v3/web/static request", function () {
            assert.equal(static, 303);
        });
        it("assert /v3/web/login request", function () {
            assert.equal(isHtml(login), true);
        });
        it("assert /v3/web/cas_session request", function () {
                assert.equal(isJSON(cas_session), true);
        });
        it("assert /v3/web/ request", function () {

            assert.equal(L, 302);

        });
    });
});