;(function ($) {
    var MODULE_BASE = "b_device";
    var MODULE_NAME = MODULE_BASE + ".device_location";
    var g_oTimer = false;
    var oInfor = {};
    var g_MyChart = null;
    var g_oResizeTimer = null;
    var gCount,g_DateType = null,gWEEK;
    var onlinedata,outlinedata = null;
    function getRcText (sRcName) 
    {
    	return Utils.Base.getRcString("location_rc",sRcName);
    }

    function drawScatterinfor () 
    {
        var oplace = {"六安市":[116.3123,31.8329],"安庆市":[116.7517,30.5255],"滁州市":[118.1909,32.536],"宣城市":[118.8062,30.6244],"阜阳市":[115.7629,32.9919],"宿州市":[117.5208,33.6841],"黄山市":[118.0481,29.9542],"巢湖市":[117.7734,31.4978],"亳州市":[116.1914,33.4698],"池州市":[117.3889,30.2014],"合肥市":[117.29,32.0581],"蚌埠市":[117.4109,33.1073],"芜湖市":[118.3557,31.0858],"淮北市":[116.6968,33.6896],"淮南市":[116.7847,32.7722],"马鞍山市":[118.6304,31.5363],"铜陵市":[117.9382,30.9375],"澳门":[113.5715,22.1583],"密云县":[117.0923,40.5121],"怀柔区":[116.6377,40.6219],"房山区":[115.8453,39.7163],"延庆县":[116.1543,40.5286],"门头沟区":[115.8,39.9957],"昌平区":[116.1777,40.2134],"大兴区":[116.4716,39.6352],"顺义区":[116.7242,40.1619],"平谷区":[117.1706,40.2052],"通州区":[116.7297,39.8131],"朝阳区":[116.4977,39.949],"海淀区":[116.2202,40.0239],"丰台区":[116.2683,39.8309],"石景山区":[116.1887,39.9346],"西城区":[116.3631,39.9353],"东城区":[116.418,39.9367],"宣武区":[116.3603,39.8852],"崇文区":[116.4166,39.8811],"酉阳土家族苗族自治县":[108.8196,28.8666],"奉节县":[109.3909,30.9265],"巫溪县":[109.3359,31.4813],"开县":[108.4131,31.2561],"彭水苗族土家族自治县":[108.2043,29.3994],"云阳县":[108.8306,31.0089],"万州区":[108.3911,30.6958],"城口县":[108.7756,31.9098],"江津区":[106.2158,28.9874],"石柱土家族自治县":[108.2813,30.1025],"巫山县":[109.8853,31.1188],"涪陵区":[107.3364,29.6796],"丰都县":[107.8418,29.9048],"武隆县":[107.655,29.35],"南川区":[107.1716,29.1302],"秀山土家族苗族自治县":[109.0173,28.5205],"黔江区":[108.7207,29.4708],"合川区":[106.3257,30.108],"綦江县":[106.6553,28.8171],"忠县":[107.8967,30.3223],"梁平县":[107.7429,30.6519],"巴南区":[106.7322,29.4214],"潼南县":[105.7764,30.1135],"永川区":[105.8643,29.2566],"垫江县":[107.4573,30.2454],"渝北区":[106.7212,29.8499],"长寿区":[107.1606,29.9762],"大足县":[105.7544,29.6136],"铜梁县":[106.0291,29.8059],"荣昌县":[105.5127,29.4708],"璧山县":[106.2048,29.5807],"北碚区":[106.5674,29.8883],"万盛区":[106.908,28.9325],"九龙坡区":[106.3586,29.4049],"沙坪坝区":[106.3696,29.6191],"南岸区":[106.6663,29.5367],"江北区":[106.8311,29.6191],"大渡口区":[106.4905,29.4214],"双桥区":[105.7874,29.4928],"渝中区":[106.5344,29.5477],"南平市":[118.136,27.2845],"三明市":[117.5317,26.3013],"龙岩市":[116.8066,25.2026],"宁德市":[119.6521,26.9824],"福州市":[119.4543,25.9222],"漳州市":[117.5757,24.3732],"泉州市":[118.3228,25.1147],"莆田市":[119.0918,25.3455],"厦门市":[118.1689,24.6478],"酒泉市":[96.2622,40.4517],"张掖市":[99.7998,38.7433],"甘南藏族自治州":[102.9199,34.6893],"武威市":[103.0188,38.1061],"陇南市":[105.304,33.5632],"庆阳市":[107.5342,36.2],"白银市":[104.8645,36.5076],"定西市":[104.5569,35.0848],"天水市":[105.6445,34.6289],"兰州市":[103.5901,36.3043],"平凉市":[107.0728,35.321],"临夏回族自治州":[103.2715,35.5737],"金昌市":[102.074,38.5126],"嘉峪关市":[98.1738,39.8035],"清远市":[112.9175,24.3292],"韶关市":[113.7964,24.7028],"湛江市":[110.3577,20.9894],"梅州市":[116.1255,24.1534],"河源市":[114.917,23.9722],"肇庆市":[112.1265,23.5822],"惠州市":[114.6204,23.1647],"茂名市":[111.0059,22.0221],"江门市":[112.6318,22.1484],"阳江市":[111.8298,22.0715],"云浮市":[111.7859,22.8516],"广州市":[113.5107,23.2196],"汕尾市":[115.5762,23.0438],"揭阳市":[116.1255,23.313],"珠海市":[113.7305,22.1155],"佛山市":[112.8955,23.1097],"潮州市":[116.7847,23.8293],"汕头市":[117.1692,23.3405],"深圳市":[114.5435,22.5439],"东莞市":[113.8953,22.901],"中山市":[113.4229,22.478],"百色市":[106.6003,23.9227],"河池市":[107.8638,24.5819],"桂林市":[110.5554,25.318],"南宁市":[108.479,23.1152],"柳州市":[109.3799,24.9774],"崇左市":[107.3364,22.4725],"来宾市":[109.7095,23.8403],"玉林市":[110.2148,22.3792],"梧州市":[110.9949,23.5052],"贺州市":[111.3135,24.4006],"钦州市":[109.0283,22.0935],"贵港市":[109.9402,23.3459],"防城港市":[108.0505,21.9287],"北海市":[109.314,21.6211],"遵义市":[106.908,28.1744],"黔东南苗族侗族自治州":[108.4241,26.4166],"毕节地区":[105.1611,27.0648],"黔南布依族苗族自治州":[107.2485,25.8398],"铜仁地区":[108.6218,28.0096],"黔西南布依族苗族自治州":[105.5347,25.3949],"六盘水市":[104.7546,26.0925],"安顺市":[105.9082,25.9882],"贵阳市":[106.6992,26.7682],"儋州市":[109.3291,19.5653],"文昌市":[110.8905,19.7823],"乐东黎族自治县":[109.0283,18.6301],"三亚市":[109.3716,18.3698],"琼中黎族苗族自治县":[109.8413,19.0736],"东方市":[108.8498,19.0414],"海口市":[110.3893,19.8516],"万宁市":[110.3137,18.8388],"澄迈县":[109.9937,19.7314],"白沙黎族自治县":[109.3703,19.211],"琼海市":[110.4208,19.224],"昌江黎族自治县":[109.0407,19.2137],"临高县":[109.6957,19.8063],"陵水黎族自治县":[109.9924,18.5415],"屯昌县":[110.0377,19.362],"定安县":[110.3384,19.4698],"保亭黎族苗族自治县":[109.6284,18.6108],"五指山市":[109.5282,18.8299],"承德市":[117.5757,41.4075],"张家口市":[115.1477,40.8527],"保定市":[115.0488,39.0948],"唐山市":[118.4766,39.6826],"沧州市":[116.8286,38.2104],"石家庄市":[114.4995,38.1006],"邢台市":[114.8071,37.2821],"邯郸市":[114.4775,36.535],"秦皇岛市":[119.2126,40.0232],"衡水市":[115.8838,37.7161],"廊坊市":[116.521,39.0509],"南阳市":[112.4011,33.0359],"信阳市":[114.8291,32.0197],"洛阳市":[112.0605,34.3158],"驻马店市":[114.1589,32.9041],"周口市":[114.873,33.6951],"商丘市":[115.741,34.2828],"三门峡市":[110.8301,34.3158],"新乡市":[114.2029,35.3595],"平顶山市":[112.9724,33.739],"郑州市":[113.4668,34.6234],"安阳市":[114.5325,36.0022],"开封市":[114.5764,34.6124],"焦作市":[112.8406,35.1508],"许昌市":[113.6975,34.0466],"濮阳市":[115.1917,35.799],"漯河市":[113.8733,33.6951],"鹤壁市":[114.3787,35.744],"黑河市":[127.1448,49.2957],"大兴安岭地区":[124.1016,52.2345],"哈尔滨市":[127.9688,45.368],"齐齐哈尔市":[124.541,47.5818],"牡丹江市":[129.7815,44.7089],"绥化市":[126.7163,46.8018],"伊春市":[129.1992,47.9608],"佳木斯市":[133.0005,47.5763],"鸡西市":[132.7917,45.7361],"双鸭山市":[133.5938,46.7523],"大庆市":[124.7717,46.4282],"鹤岗市":[130.4407,47.7081],"七台河市":[131.2756,45.9558],"恩施土家族苗族自治州":[109.5007,30.2563],"十堰市":[110.5115,32.3877],"宜昌市":[111.1707,30.7617],"襄樊市":[111.9397,31.9263],"黄冈市":[115.2686,30.6628],"荆州市":[113.291,30.0092],"荆门市":[112.6758,30.9979],"咸宁市":[114.2578,29.6631],"随州市":[113.4338,31.8768],"孝感市":[113.9502,31.1188],"武汉市":[114.3896,30.6628],"黄石市":[115.0159,29.9213],"神农架林区":[110.4565,31.5802],"天门市":[113.0273,30.6409],"仙桃市":[113.3789,30.3003],"潜江市":[112.7637,30.3607],"鄂州市":[114.7302,30.4102],"怀化市":[109.9512,27.4438],"永州市":[111.709,25.752],"邵阳市":[110.9619,26.8121],"郴州市":[113.2361,25.8673],"常德市":[111.4014,29.2676],"湘西土家族苗族自治州":[109.7864,28.6743],"衡阳市":[112.4121,26.7902],"岳阳市":[113.2361,29.1357],"益阳市":[111.731,28.3832],"长沙市":[113.0823,28.2568],"株洲市":[113.5327,27.0319],"张家界市":[110.5115,29.328],"娄底市":[111.6431,27.7185],"湘潭市":[112.5439,27.7075],"延边朝鲜族自治州":[129.397,43.2587],"吉林市":[126.8372,43.6047],"白城市":[123.0029,45.2637],"松原市":[124.0906,44.7198],"长春市":[125.8154,44.2584],"白山市":[127.2217,42.0941],"通化市":[125.9583,41.8579],"四平市":[124.541,43.4894],"辽源市":[125.343,42.7643],"盐城市":[120.2234,33.5577],"徐州市":[117.5208,34.3268],"南通市":[121.1023,32.1625],"淮安市":[118.927,33.4039],"苏州市":[120.6519,31.3989],"宿迁市":[118.5535,33.7775],"连云港市":[119.1248,34.552],"扬州市":[119.4653,32.8162],"南京市":[118.8062,31.9208],"泰州市":[120.0586,32.5525],"无锡市":[120.3442,31.5527],"常州市":[119.4543,31.5582],"镇江市":[119.4763,31.9702],"赣州市":[115.2795,25.8124],"吉安市":[114.884,26.9659],"上饶市":[117.8613,28.7292],"九江市":[115.4224,29.3774],"抚州市":[116.4441,27.4933],"宜春市":[115.0159,28.3228],"南昌市":[116.0046,28.6633],"景德镇市":[117.334,29.3225],"萍乡市":[113.9282,27.4823],"鹰潭市":[117.0813,28.2349],"新余市":[114.95,27.8174],"大连市":[122.2229,39.4409],"朝阳市":[120.0696,41.4899],"丹东市":[124.541,40.4242],"铁岭市":[124.2773,42.7423],"沈阳市":[123.1238,42.1216],"抚顺市":[124.585,41.8579],"葫芦岛市":[120.1575,40.578],"阜新市":[122.0032,42.2699],"锦州市":[121.6626,41.4294],"鞍山市":[123.0798,40.6055],"本溪市":[124.1455,41.1987],"营口市":[122.4316,40.4297],"辽阳市":[123.4094,41.1383],"盘锦市":[121.9482,41.0449],"呼伦贝尔市":[120.8057,50.2185],"阿拉善盟":[102.019,40.1001],"锡林郭勒盟":[115.6421,44.176],"鄂尔多斯市":[108.9734,39.2487],"赤峰市":[118.6743,43.2642],"巴彦淖尔市":[107.5562,41.3196],"通辽市":[121.4758,43.9673],"乌兰察布市":[112.5769,41.77],"兴安盟":[121.3879,46.1426],"包头市":[110.3467,41.4899],"呼和浩特市":[111.4124,40.4901],"乌海市":[106.886,39.4739],"吴忠市":[106.853,37.3755],"中卫市":[105.4028,36.9525],"固原市":[106.1389,35.9363],"银川市":[106.3586,38.1775],"石嘴山市":[106.4795,39.0015],"海西蒙古族藏族自治州":[94.9768,37.1118],"玉树藏族自治州":[93.5925,33.9368],"果洛藏族自治州":[99.3823,34.0466],"海南藏族自治州":[100.3711,35.9418],"海北藏族自治州":[100.3711,37.9138],"黄南藏族自治州":[101.5686,35.1178],"海东地区":[102.3706,36.2988],"西宁市":[101.4038,36.8207],"烟台市":[120.7397,37.5128],"临沂市":[118.3118,35.2936],"潍坊市":[119.0918,36.524],"青岛市":[120.4651,36.3373],"菏泽市":[115.6201,35.2057],"济宁市":[116.8286,35.3375],"德州市":[116.6858,37.2107],"滨州市":[117.8174,37.4963],"聊城市":[115.9167,36.4032],"东营市":[118.7073,37.5513],"济南市":[117.1582,36.8701],"泰安市":[117.0264,36.0516],"威海市":[121.9482,37.1393],"日照市":[119.2786,35.5023],"淄博市":[118.0371,36.6064],"枣庄市":[117.323,34.8926],"莱芜市":[117.6526,36.2714],"榆林市":[109.8743,38.205],"延安市":[109.1052,36.4252],"汉中市":[106.886,33.0139],"安康市":[109.1162,32.7722],"商洛市":[109.8083,33.761],"宝鸡市":[107.1826,34.3433],"渭南市":[109.7864,35.0299],"咸阳市":[108.4131,34.8706],"西安市":[109.1162,34.2004],"铜川市":[109.0393,35.1947],"忻州市":[112.4561,38.8971],"吕梁市":[111.3574,37.7325],"临汾市":[111.4783,36.1615],"晋中市":[112.7747,37.37],"运城市":[111.1487,35.2002],"大同市":[113.7854,39.8035],"长治市":[112.8625,36.4746],"朔州市":[113.0713,39.6991],"晋城市":[112.7856,35.6342],"太原市":[112.3352,37.9413],"阳泉市":[113.4778,38.0951],"崇明县":[121.5637,31.5383],"南汇区":[121.8755,30.954],"奉贤区":[121.5747,30.8475],"浦东新区":[121.6928,31.2561],"金山区":[121.2657,30.8112],"青浦区":[121.1751,31.1909],"松江区":[121.1984,31.0268],"嘉定区":[121.2437,31.3625],"宝山区":[121.4346,31.4051],"闵行区":[121.4992,31.0838],"杨浦区":[121.528,31.2966],"普陀区":[121.3879,31.2602],"徐汇区":[121.4333,31.1607],"长宁区":[121.3852,31.2115],"闸北区":[121.4511,31.2794],"虹口区":[121.4882,31.2788],"黄浦区":[121.4868,31.219],"卢湾区":[121.4758,31.2074],"静安区":[121.4484,31.2286],"甘孜藏族自治州":[99.9207,31.0803],"阿坝藏族羌族自治州":[102.4805,32.4536],"凉山彝族自治州":[101.9641,27.6746],"绵阳市":[104.7327,31.8713],"达州市":[107.6111,31.333],"广元市":[105.6885,32.2284],"雅安市":[102.6672,29.8938],"宜宾市":[104.6558,28.548],"乐山市":[103.5791,29.1742],"南充市":[106.2048,31.1517],"巴中市":[107.0618,31.9977],"泸州市":[105.4578,28.493],"成都市":[103.9526,30.7617],"资阳市":[104.9744,30.1575],"攀枝花市":[101.6895,26.7133],"眉山市":[103.8098,30.0146],"广安市":[106.6333,30.4376],"德阳市":[104.48,31.1133],"内江市":[104.8535,29.6136],"遂宁市":[105.5347,30.6683],"自贡市":[104.6667,29.2786],"台湾":[121.0295,23.6082],"蓟县":[117.4672,40.004],"武清区":[117.0621,39.4121],"宝坻区":[117.4274,39.5913],"静海县":[116.9824,38.8312],"宁河县":[117.6801,39.3853],"大港区":[117.3875,38.757],"塘沽区":[117.6801,38.9987],"西青区":[117.1829,39.0022],"北辰区":[117.1761,39.2548],"东丽区":[117.4013,39.1223],"汉沽区":[117.8888,39.2191],"津南区":[117.3958,38.9603],"河西区":[117.2365,39.0804],"河东区":[117.2571,39.1209],"南开区":[117.1527,39.1065],"河北区":[117.2145,39.1615],"红桥区":[117.1596,39.1663],"和平区":[117.2008,39.1189],"那曲地区":[88.1982,33.3215],"阿里地区":[82.3645,32.7667],"日喀则地区":[86.2427,29.5093],"林芝地区":[95.4602,29.1138],"昌都地区":[97.0203,30.7068],"山南地区":[92.2083,28.3392],"拉萨市":[91.1865,30.1465],"香港":[114.2784,22.3057],"巴音郭楞蒙古自治州":[88.1653,39.6002],"和田地区":[81.167,36.9855],"哈密地区":[93.7793,42.9236],"阿克苏地区":[82.9797,41.0229],"阿勒泰地区":[88.2971,47.0929],"喀什地区":[77.168,37.8534],"塔城地区":[86.6272,45.8514],"昌吉回族自治州":[89.6814,44.4507],"克孜勒苏柯尔克孜自治州":[74.6301,39.5233],"吐鲁番地区":[89.6375,42.4127],"伊犁哈萨克自治州":[82.5513,43.5498],"博尔塔拉蒙古自治州":[81.8481,44.6979],"乌鲁木齐市":[87.9236,43.5883],"克拉玛依市":[85.2869,45.5054],"阿拉尔市":[81.2769,40.6549],"图木舒克市":[79.1345,39.8749],"五家渠市":[87.5391,44.3024],"石河子市":[86.0229,44.2914],"普洱市":[100.7446,23.4229],"红河哈尼族彝族自治州":[103.0408,23.6041],"文山壮族苗族自治州":[104.8865,23.5712],"曲靖市":[103.9417,25.7025],"楚雄彝族自治州":[101.6016,25.3619],"大理白族自治州":[99.9536,25.6805],"临沧市":[99.613,24.0546],"迪庆藏族自治州":[99.4592,27.9327],"昭通市":[104.0955,27.6031],"昆明市":[102.9199,25.4663],"丽江市":[100.448,26.955],"西双版纳傣族自治州":[100.8984,21.8628],"保山市":[99.0637,24.9884],"玉溪市":[101.9312,23.8898],"怒江傈僳族自治州":[99.1516,26.5594],"德宏傣族景颇族自治州":[98.1299,24.5874],"丽水市":[119.5642,28.1854],"杭州市":[119.5313,29.8773],"温州市":[120.498,27.8119],"宁波市":[121.5967,29.6466],"舟山市":[122.2559,30.2234],"台州市":[121.1353,28.6688],"金华市":[120.0037,29.1028],"衢州市":[118.6853,28.8666],"绍兴市":[120.564,29.7565],"嘉兴市":[120.9155,30.6354],"湖州市":[119.8608,30.7782]};
        
        function onMapSelect(param){
            Utils.Base.redirect ({np:"b_device.device_detail"});
            return false;
        }

        function sub(a, b){//A - B == IN A BUT NOT NI B
            var r = [], o = {};
            for(var i =0; i< b.length; i++){
                o[b[i]] = i;
            }
            for(var i = 0; i< a.length; i++){
                if(!(a[i] in o)){
                    r.push(a[i]);
                }
            }
            return r;
        }
        function pub(a, b){//A & B == IN A AND NI B
            var r = [], o = {};
            for(var i =0; i< b.length; i++){
                o[b[i]] = i;
            }
            for(var i = 0; i< a.length; i++){
                if((a[i] in o)){
                    r.push(a[i]);
                }
            }
            return r;
        }

        var option = {
            height:550,
            // backgroundColor: '#1b1b1b',
            color: [
                    'rgba(9, 209, 255, 0.57)',
                    'rgba(85, 85, 255, 0.57)'
                    ],
            title : {
                text: '分布情況',
                x:'center',
                textStyle : {
                    color: 'rgba(52, 62,78, 0.57)',
                    fontSize: 24
                }
            },
            legend: {
                //{
                    orient: 'vertical',
                    x:'right',
                    data:['','在线','离线'],
                    textStyle : {
                        color: '#4ec1b2'
                    }
            },
            series:[
                {
                    name: '',
                    type: 'map',
                    mapType: 'china',
                    itemStyle:{
                        normal:{
                            borderColor:'rgba(220,220,223,1)',
                            borderWidth:1,
                            areaStyle:{
                                color: 'rgba(245,245,245,1)'
                            }
                        },
                        emphasis:{
                                        label:{show:true},
                                        areaStyle:{
                                            color:'rgba(120,206,195,0.3)'
                                        }
                                    }
                    },
                    hoverable: false,
                    roam:false,
                    selectedMode: 'single',
                    data : [],
                    markPoint : {
                        symbol : 'diamond',
                        symbolSize: 10,
                        large: true,
                        effect : {
                            show: true,
                            color: '#78cec3',
                            shadowColor:'#78cec3'
                        },
                        data:[]
                    }
                }
            ],
            mapSelect:onMapSelect
        };

        var oTheme={};
        g_MyChart = $("#Scatter").echart("init", option,oTheme);
        light_device();
        gCount = setInterval(light_device,1000*30);
        function light_device(){
            var acDate = [];
            $.ajax({
                url:MyConfig.path+"/devlocation/getOnlineCityData",
                type: "GET",
                dataType: "json",
                success: function(data){
                      
                    // $.each(data,function(index,iData){                        
                    //     if (iData.acnumber > 0) {                            
                    //         var coord = oplace[iData.name.trim()];
                    //         if (coord) {
                    //             acDate.push(
                    //                 {
                    //                     "name":iData.name,
                    //                     "geoCoord":coord,
                    //                     "value":iData.acnumber
                    //                 }
                    //             );
                    //         };
                    //     };
                    // });
                    //$.ajax({
                    //    url:MyConfig.path+"/devlocation/getOnlineCityData",
                    //    type: "GET",
                    //    dataType: "json",
                    //    success: function(data) {
                            acDate = [{"name": "朝阳区", "geoCoord": [116.4977, 39.949], "value": 1}, {
                                "name": "杭州市", "geoCoord": [119.5313, 29.8773], "value": 13
                            }, {"name": "西城区", "geoCoord": [116.3631, 39.9353], "value": 1}, {
                                "name": "海淀区", "geoCoord": [116.2202, 40.0239], "value": 4
                            }, {"name": "昌平区", "geoCoord": [116.1777, 40.2134], "value": 3}, {
                                "name": "东城区", "geoCoord": [116.418, 39.9367], "value": 1
                            }, {
                                "name": "宣城市", "geoCoord": [118.8062, 30.6244], "value": 1
                            }, {"name": "滁州市", "geoCoord": [118.1909, 32.536], "value": 1}, {
                                "name": "大兴区", "geoCoord": [116.4716, 39.6352], "value": 1
                            }, {
                                "name": "三亚市", "geoCoord": [109.3716, 18.3698], "value": 1
                            }, {"name": "乌鲁木齐市", "geoCoord": [87.9236, 43.5883], "value": 1}, {
                                "name": "绍兴市", "geoCoord": [120.564, 29.7565], "value": 1
                            }, {"name": "成都市", "geoCoord": [103.9526, 30.7617], "value": 1}, {
                                "name": "西宁市",
                                "geoCoord": [101.4038, 36.8207],
                                "value": 1
                            },
                                {"name": "渝中区", "geoCoord": [106.5344, 29.5477], "value": 1}, {
                                    "name": "榆林市",
                                    "geoCoord": [109.8743, 38.205],
                                    "value": 1
                                }, {"name": "郑州市", "geoCoord": [113.4668, 34.6234], "value": 1},
                                {"name": "石家庄市", "geoCoord": [114.4995, 38.1006], "value": 1}, {
                                    "name": "太原市",
                                    "geoCoord": [112.3352, 37.9413],
                                    "value": 3
                                }, {"name": "济南市", "geoCoord": [117.1582, 36.8701], "value": 3}, {
                                    "name": "长沙市",
                                    "geoCoord": [113.0823, 28.2568],
                                    "value": 5
                                }];
                            option.series[1] = {
                                name: '在线',
                                type: 'map',
                                mapType: 'china',
                                itemStyle: {
                                    normal: {
                                        borderColor: 'rgba(220,220,223,1)',
                                        borderWidth: 0.5,
                                        areaStyle: {
                                            color: 'rgba(245,245,245,1)'
                                        }
                                    },
                                    emphasis: {
                                        label: {show: true},
                                        areaStyle: {
                                            color: 'rgba(120,206,195,0.3)'
                                        }
                                    }
                                },
                                hoverable: false,
                                roam: false,
                                data: [],
                                markPoint: {
                                    symbol: 'diamond',
                                    symbolSize: 10,
                                    large: true,
                                    effect: {
                                        show: true,
                                        color: '#78cec3',
                                        shadowColor: '#78cec3'
                                    },
                                    data: acDate
                                }
                            };

                            outlinedata =  [{"name": "海门", "geoCoord": [121.15,31.89], "value": 9},
                                            {"name": "鄂尔多斯", "geoCoord": [109.781327,39.608266],"value": 1}
                                           ];
                            option.series[2] = {
                                name: '离线',
                                type: 'map',
                                mapType: 'china',
                                itemStyle: {
                                    normal: {
                                        borderColor: 'rgba(51,51,255,1)',
                                        borderWidth: 0.5,
                                        areaStyle: {
                                            color: 'rgba(74,74,255,1)'
                                        }
                                    },
                                    emphasis: {
                                        label: {show: true},
                                        areaStyle: {
                                            color: 'rgba(0,0,0,0.3)'
                                        }
                                    }
                                },
                                hoverable: false,
                                roam: false,
                                data: [],
                                markPoint: {
                                    symbol: 'diamond',
                                    symbolSize: 10,
                                    large: true,
                                    effect: {
                                        show: true,
                                        color: '#9AA2FD',
                                        shadowColor: '#9AA2FD'
                                    },
                                    data:outlinedata
                                }
                            };

                            g_MyChart.setOption(option, false);


                            // var oTheme={
                            //         color: ['#FA5A66','#E483A0','#E28F34','#F7C762','#ABD6F5','#86C5F2','#63B4EF','#3DA0EB','#1683D3','#136FB3']
                            // };
                            // var oTheme={};
                            // g_MyChart = $("#Scatter").echart("init", option,oTheme);
                            // var c = sub(b,a);
                            // var d = pub(a,b);
                    //    },
                    //    error:function(){
                    //
                    //    }
                    //});
                },
                error: function(){
                   
                }
            });
        }

    }
    function getLinkhistoryinfor(obj,sType) 
    {
        g_DateType = sType;
        $.ajax({
            url:MyConfig.path+"/devlocation/getDevHistoryCount",
            type: "post",
            dataType: "json",
            contentType: 'application/json',
            data:JSON.stringify({
                recordEndtime:(new Date).toISOString(),
                recordInterval:obj.Interval,
                recordCount:obj.Count
            }),
            success: function(data){
                var data =[{"totalCount":4,"onlineCount":3,"recordTime":"2016-03-13T03:00:00.000Z"},{"totalCount":8,"onlineCount":6,"recordTime":"2016-03-14T03:00:00.000Z"},{"totalCount":14,"onlineCount":8,"recordTime":"2016-03-15T03:00:00.000Z"},{"totalCount":17,"onlineCount":15,"recordTime":"2016-03-16T03:00:00.000Z"},{"totalCount":18,"onlineCount":18,"recordTime":"2016-03-17T03:00:00.000Z"},{"totalCount":26,"onlineCount":22,"recordTime":"2016-03-18T03:00:00.000Z"},{"totalCount":34,"onlineCount":24,"recordTime":"2016-03-19T03:00:00.000Z"}];
                // drawLinkhistoryinfor(data.reverse());
                drawLinkhistoryinfor(data);
            },
            error: function(){

            }
        });
    }

    function onExchangeTime(sTime){
        var jDate = new Date(sTime);
        // if(g_DateType == "Day"){
        //     return jDate.toLocaleTimeString();
        // }else if(){

        // }else{
        //     return jDate.toLocaleDateString().replace(/\//ig,"-");
        // }

        switch(g_DateType)
        {
            case "Day":
                return jDate.toLocaleTimeString();
                break;
            case "Week":
                return gWEEK[jDate.getDay()];
                break;
            case "Moun":
                return jDate.toLocaleDateString().replace(/\//ig,"-");
                break;
        }
    }

    function drawLinkhistoryinfor(data){
        var aDateTime = [];
        var aOfflineAP = [],aOnlineAP = [];
        $.each(data,function(index,iDate){
            var xdate = onExchangeTime(iDate.recordTime);
            var off = iDate.totalCount - iDate.onlineCount;
            aDateTime.push(xdate);
            aOnlineAP.push(iDate.onlineCount);
            aOfflineAP.push(off);
        });

        var option = {
            name:'连接历史',
            width:'100%',
            height:250,
            title:{
                text:'',
                
            },
            legend: {
                show:false,
                orient: "horizontal",
                y: 'top',
                x: "right",
                textStyle:{
                    color:'rgba(52, 62,78, 0.57)',
                    fontSize:'14px'
                },
                data: ['在线','离线']
            },
            tooltip : {
                show: true,
                trigger: 'axis',
                axisPointer:{
                    type : 'line',
                    lineStyle : {
                      color: '#fff',
                      width: 0,
                      type: 'solid'
                    }
                }
                // formatter : function(aData){
                //     var aUp = aData[1];
                //     var aDown = aData[0];
                //     return  aUp[1] + "<br/>" + aUp[0] + " : " + Utils.Base.addComma(aUp[2]) + " Mbps<br/>" + aDown[0] + " : " +Utils.Base.addComma(aDown[2]) + " Mbps";
                // }
            },
            grid: {
                x: '0', y: '0',x2:'0',y2:'30',
                borderColor: '#ffffff'
            },
            calculable: false,
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    splitLine:{
                        show:false
                    },
                    axisLabel: {
                        show:true,
                        textStyle:{color: '#617085', fontSize:"12px", width:2}
                    },
                    axisLine  : {
                        show:true,
                        lineStyle :{color: '#d4d4d4', width: 1}
                    },
                    axisTick :{
                        show:false,
                        lineStyle:{color:'#d4d4d4', width: 1}
                    },
                    show:false,
                    data: aDateTime
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name:"Mbps",
                    splitLine:{
                        show:false,
                        lineStyle:{color:'#d4d4d4', width: 1}
                    },
                    axisLabel: {
                        show: true,
                        textStyle:{color: '#617085', fontSize:"12px", width:2}
                    },
                    axisLine  : {
                        show:false,
                        lineStyle :{color: '#617085', width: 1}
                    },
                    show:false
                }
            ],
            series: [
                {
                    name : '在线',
                    symbol: "none", 
                    type: 'line', 
                    smooth: true,
                    stack: '总量',
                    itemStyle: {
                        normal:{
                            areaStyle: {
                                color:'rgba(78,193,178,0.5)',
                                type: 'default'
                            },
                            lineStyle:{width:0}
                        }
                    },
                    data:aOnlineAP
                //    data: aUpHis
                },
                {
                    name :'离线',
                    symbol: "none", 
                    type: 'line', 
                    smooth: true,
                    stack: '总量',
                    itemStyle: {normal: {areaStyle: {color:'rgba(231,231,233,0.5)',type: 'default'},lineStyle:{width:0}}},
                    data:aOfflineAP
                //    data: aDownHis
                }
            ]

        };
        var oTheme = {
                color: []
            };
        $("#link_history_chart").echart("init", option,oTheme);
    }
    function initOnlineDevice () 
    {
        $.ajax({
            url:MyConfig.path+"/devlocation/getDevCount",
            type: "get",
            dataType: "json",
            contentType: 'application/json',
            success: function(data){
                if(data)
                {
                    var onlineDevice =data.onlineCount;
                    var outlineDevice =data.totalCount-data.onlineCount;
                    // $("#onlinedevice").text(onlineDevice);
                    // $("#outlinedevice").text(outlineDevice);
                    $("#onlinedevice").text("15");
                    $("#outlinedevice").text("3");
                }else{
                    $("#onlinedevice").text("0");
                    $("#outlinedevice").text("0");
                }
            },
            error: function(){
                
            }
        });
    }

    function dayLinkhistory(){
        $("#day_history").addClass('active');
        $("#week_history").removeClass('active');
        $("#moun_history").removeClass('active');
        getLinkhistoryinfor({Interval:1,Count:24},"Day");
    }
    function weekLinkhistory(){
        $("#week_history").addClass('active');
        $("#day_history").removeClass('active');
        $("#moun_history").removeClass('active');
        getLinkhistoryinfor({Interval:24,Count:7},"Week");
    }
    function mounLinkhistory(){
        $("#moun_history").addClass('active');
        $("#day_history").removeClass('active');
        $("#week_history").removeClass('active');
        getLinkhistoryinfor({Interval:24,Count:30},"Moun");
    }
    function showOnlinedevice()
    {
        onlinedata = [
            {"devname":"设备1","devlocation":"北京昌平","devsn":"SN123","devgroup":"abc","onlinetime":"13:00-14:00","score":12},
            {"devname":"设备2","devlocation":"北京昌平","devsn":"SN123","devgroup":"abc","onlinetime":"13:00-14:00","score":12}
        ];
        function onCancel()
        {
            Utils.Pages.closeWindow(Utils.Pages.getWindow( $("#showDeviceDlg")));
        }
        var dlgTitle = getRcText("ON_LINE");
        $("#device_form").form ("init", "edit", {"title":dlgTitle,"btn_apply":false, "btn_cancel":onCancel});
        Utils.Base.openDlg(null, {}, {scope:$("#showDeviceDlg"),className:"modal-super"});
        $("#deviceList").SList("resize");
        $("#deviceList").SList("refresh",onlinedata);
    }
    function showOutlinedevice()
    {
        outlinedata = [
            {"devname":"设备1","devlocation":"北京昌平","devsn":"SN123","devgroup":"abc","onlinetime":"13:00-14:00","score":12},
            {"devname":"设备2","devlocation":"北京昌平","devsn":"SN123","devgroup":"abc","onlinetime":"13:00-14:00","score":12}
        ];
        function onCancel()
        {
            Utils.Pages.closeWindow(Utils.Pages.getWindow( $("#showDeviceDlg")));
        }
        var dlgTitle = getRcText("OUT_LINE");
        $("#device_form").form ("init", "edit", {"title":dlgTitle,"btn_apply":false, "btn_cancel":onCancel});
        Utils.Base.openDlg(null, {}, {scope:$("#showDeviceDlg"),className:"modal-super"});
        $("#deviceList").SList("resize");
        $("#deviceList").SList("refresh",outlinedata);

    }
    function ChangeValueColor(row, cell, value, columnDef, dataContext, type)
    {
        value = value ||"";
        if("text" == type)
        {
            return value;
        }
        if(value < 0)
        {
            return '<a style="color:red;" cell="'+cell+'">'+value+'</a>';
        }else if(value > 0&&value<=60)
        {
            return '<a style="color:blue;" cell="'+cell+'">'+value+'</a>';
        }else{
            return '<a style="color:green;" cell="'+cell+'">'+value+'</a>';
        }


    }
    function initForm ()
    {
        $("#return").on('click',function(){ history.back();});
        var jForm = $("#dev_location");
        $("#dev_detail",jForm).on("click",function()
        {
            Utils.Base.redirect ({np:"b_device.device_detail"});
            return false;
        });
        $("#refresh_Scatter").on("click",drawScatterinfor);

        $("#day_history").on("click",dayLinkhistory);
        $("#week_history").on("click",weekLinkhistory);
        $("#moun_history").on("click",mounLinkhistory);
        $("#onlinedevice").on("click",showOnlinedevice);
        $("#outlinedevice").on("click",showOutlinedevice);
    }
     
    function initGrid()
    {

        //初始化在线/离线设备列表
        function showDetail()
        {
            Utils.Base.redirect({ np:"b_deviceinfo.summary"});
            Utils.Pages.closeWindow(Utils.Pages.getWindow( $("#deviceList")));
            return false;
        }
        var opt = {
            colNames: getRcText ("DEVICE_LIST"),
            showHeader: true,
            multiSelect: false,
            showOperation:true,
            //pageSize:5,
            colModel: [
                {name:'devname', datatype:"String"}, //设备名
                {name:'devlocation',datatype:"String"},//位置
                {name:'devsn', datatype:"String"},//SN
                {name:'devgroup',datatype:"String"},//设备组
                {name:'onlinetime', datatype:"String"},//在线时长
                {name:'score', datatype:"String",formatter:ChangeValueColor}//评分

            ],
            buttons:[
                {name: "detail", action:showDetail}
            ]
        };
        $("#deviceList").SList("head",opt);
       
    }

    function _init ()
    {

        gWEEK = getRcText("WEEK").split(',');
    	initGrid();
    	initForm();
        // setTimeout('drawScatterinfor()', 40000);
        drawScatterinfor();
        initOnlineDevice();
        getLinkhistoryinfor({Interval:24,Count:7},"Week");
        $("#week_history").addClass('active');

    }

    function _resize (jParent)
    {
        if(g_oResizeTimer)
        {
            clearTimeout(g_oResizeTimer);
        }
        g_oResizeTimer = setTimeout(function(){
            g_MyChart && g_MyChart.chart && g_MyChart.resize();
        }, 200);
    } 

    $(window).resize(_resize);



    function _destroy ()
    {
        clearTimeout(g_oResizeTimer);
        clearInterval(gCount);
        g_MyChart = null;

    }

    Utils.Pages.regModule(MODULE_NAME, {
        "init": _init, 
        "destroy": _destroy, 
        "resize": _resize,
        "widgets": ["SList","Echart","Form"],
        "utils":["Request","Base"]
    });   
})( jQuery );