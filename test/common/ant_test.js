describe("******************************begin ant test******************************", function () {
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
    var chai = require('chai')
        , expect = chai.expect;

    var dpi_app = '', dpi_url = '', read_wips_ap = '', nat_detect = ''
        , confmgr = '', logmgr = '', wips_client = '', wips_statistics = '';

    var options = {}, headers = {};

    options.host = host,
        options.port = 443;

    before(function (done) {
        generateID(casCategory, casOption, function (id) {

            headers = {
                Cookie: id
            };
            options.headers = headers, options.method = 'GET';
            done();
        });
    });

    after(function () {
        console.log("******************************end ant test******************************");
    });
    describe("get information", function () {
//********************≤‚ ‘/v3/ant/dpi_app**************************
//        it("get information by /v3/ant/dpi_app", function (done) {
//            options.path = config.ant.dpi_app;
//            console.log('options......');
//            console.log(options);
//
//            https.request(options, function (res) {
//
//                res.setEncoding('utf8');
//
//                res.on('data', function (chunk) {
//                    dpi_app += chunk;
//                });
//                res.on('end', function () {
//                    console.log(dpi_app);
//                    done();
//                });
//                res.on('error', function (err) {
//                    console.log(err);
//                    done();
//                });
//            }).end();
//        });

//*************************≤‚ ‘/v3/ant/dpi_url********************
//        it("get information by /v3/ant/dpi_url", function (done) {
//
//            options.path = config.ant.dpi_url;
//            console.log('options......');
//            console.log(options);
//
//            https.request(options, function (res) {
//                res.setEncoding('utf8');
//
//                res.on('data', function (chunk) {
//                    dpi_url += chunk;
//                });
//                res.on('end', function () {
//                    console.log(dpi_url);
//                    done();
//                });
//                res.on('error', function (err) {
//                    console.log(err);
//                    done();
//                });
//            }).end();
//        });
//********************≤‚ ‘/v3/ant/read_wips_ap**************************
        it("get information by /v3/ant/read_wips_ap", function (done) {

            options.path = config.ant.read_wips_ap;
            console.log('options......');
            console.log(options);
            https.request(options, function (res) {
                res.setEncoding('utf8');

                res.on('data', function (chunk) {
                    read_wips_ap += chunk;
                });
                res.on('end', function () {
                    console.log(read_wips_ap);
                    done();
                });
                res.on('error', function (err) {
                    console.log(err);
                    done();
                });
            }).end();
        });
//********************≤‚ ‘≤‚ ‘/v3/ant/nat_detect**************************
//        it("get information by /v3/ant/nat_detect", function (done) {
//
//            options.path = config.ant.nat_detect;
//            console.log('options......');
//            console.log(options);
//            https.request(options, function (res) {
//                res.setEncoding('utf8');
//
//                res.on('data', function (chunk) {
//                    nat_detect += chunk;
//                });
//                res.on('end', function () {
//                    console.log(nat_detect);
//                    done();
//                });
//                res.on('error', function (err) {
//                    console.log(err);
//                    done();
//                });
//            }).end();
//        });
//********************≤‚ ‘≤‚ ‘/v3/ant/logmgr**************************
        it("get information by /v3/ant/logmgr", function (done) {
            options.path = config.ant.logmgr;
            console.log('options......');
            console.log(options);
            https.request(options, function (res) {
                res.setEncoding('utf8');

                res.on('data', function (chunk) {
                    logmgr += chunk;
                });
                res.on('end', function () {
                    console.log('reveive data: ' + logmgr);
                    done();
                });
                res.on('error', function (err) {
                    console.log(err);
                    done();
                });
            }).end();
        });
//********************≤‚ ‘≤‚ ‘/v3/ant/wips_client**************************
//        it("get information by /v3/ant/wips_client", function (done) {
//            options.path = config.ant.wips_client;
//            console.log('options......');
//            console.log(options);
//            https.request(options, function (res) {
//                res.setEncoding('utf8');
//
//                res.on('data', function (chunk) {
//                    wips_client += chunk;
//                });
//                res.on('end', function () {
//                    console.log('reveive data: ' + wips_client);
//                    done();
//                });
//                res.on('error', function (err) {
//                    console.log(err);
//                    done();
//                });
//            }).end();
//        });
//********************≤‚ ‘≤‚ ‘/v3/ant/wips_statistics**************************
        it("get information by /v3/ant/wips_statistics", function (done) {
            options.path = config.ant.wips_statistics;
            console.log('options......');
            console.log(options);
            https.request(options, function (res) {
                res.setEncoding('utf8');

                res.on('data', function (chunk) {
                    wips_statistics += chunk;
                });
                res.on('end', function () {
                    console.log('reveive data: ' + wips_statistics);
                    done();
                });
                res.on('error', function (err) {
                    console.log(err);
                    done();
                });
            }).end();
        });
//********************≤‚ ‘≤‚ ‘/v3/ant/confmgr**************************
        it("get information by /v3/ant/confmgr", function (done) {
            options.path = config.ant.confmgr;
            console.log('options......');
            console.log(options);
            var data = {
                configType:0
            };
            options.headers['Content-Type'] = 'application/json';
            options.method = 'post';
            var req =  https.request(options, function (res) {
                res.setEncoding('utf8');

                res.on('data', function (chunk) {
                    confmgr += chunk;
                });
                res.on('end', function () {
                    console.log('reveive data: ' + confmgr);
                    done();
                });
                res.on('error', function (err) {
                    console.log(err);
                    done();
                });
            }).end(JSON.stringify(data));
        });
    });
    describe("assert the result", function () {
        //it("assert /v3/ant/dpi_app request", function () {
        //    expect(isJSON(dpi_app)).to.be.true;
        //
        //});
        //it("assert /v3/ant/dpi_url request", function () {
        //    expect(isJSON(dpi_url)).to.be.true;
        //});
        it("assert /v3/ant/read_wips_ap request", function () {

            expect(isJSON(read_wips_ap)).to.be.true;
        });
        //it("assert /v3/ant/nat_detect request", function () {
        //
        //    expect(nat_detect).to.not.to.be.null;
        //    expect(nat_detect).to.not.to.be.undefined;
        //
        //});
        it("assert /v3/ant/logmgr request", function () {

            expect(isJSON(logmgr)).to.be.true;
        });
        //it("assert /v3/ant/wips_client request", function () {
        //
        //    expect(isJSON(wips_client)).to.be.true;
        //});
        it("assert /v3/ant/wips_statistics request", function () {

            expect(isJSON(wips_statistics)).to.be.true;
        });
        it("assert /v3/ant/confmgr request", function () {

            expect(isJSON(confmgr)).to.be.true;
        });
    });
});
