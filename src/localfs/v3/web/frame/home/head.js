 $(document).ready(function(){
        function getuserSession(){
            $.get("/v3/web/cas_session",function(data){
                //alert(data);
                $("#username").text(data.user)
            });
        }
        
        getUserName(getAcListV2);
        
        $.ajax({
            url: "/v3/app/getUsername",
            type: "GET",
            dataType: "json",
            success: function(data){
                var userName = data["username"];
                $.ajax({
                    url: MyConfig.v2path+"getDevStatus",
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    data: JSON.stringify({"tenant_name": userName, "dev_snlist":[]}),
                    success: function(data){
                        var acList = data.dev_statuslist;
                        getuserSession();
                        updatecs(acList);
                        changeAC();
                        var _sUserBar=new UserBar();
                        _sUserBar.initUser();
                    }
                });
            }
        });

        //cs : 杭州场所 1 - n  sn ： real sn not desn
        /*
        function getAcInfo(){
            var Acdata = [{"cs":"酒店","desn":"32323-23-231"},{"cs":"北京","desn":"32323-23-232"},{"cs":"上海","desn":"32323-23-233"}
                ,{"cs":"广州","desn":"32323-23-234"},{"cs":"咖啡厅","desn":"32323-23-235"}];
            return Acdata;
        }
        */
        function getAcInfo(acList){
            var AcInfo = [];
            var place = "场所"
            var idx = 1;
            acList.forEach(function(ac){
                        AcInfo.push({
                            cs: (place+idx),
                            sn: ac["dev_ns"]
                        });
                        idx++;
                    });
            return AcInfo;
        }
        function updatecs(acList){
            var aclist  = getAcInfo(acList);//替换
            var opShtml="<option value='";
            var opVhtml="'>";
            var opEhtml="</option> ";
            var ophtml="";
            if(!aclist){
                ophtml="<option>Null</option>"
            }else{
                for(var i =0;i<aclist.length;i++){
                    ophtml +=opShtml+aclist[i].sn+opVhtml+aclist[i].cs+opEhtml;
                }
            }
            $("#station").append(ophtml);
        }
        function changeAC(){
            $("#station").bind("change",function(){
                var desn= $("#station option:selected").attr("value");
                window.location="/v3/web/frame/index.html?sn="+desn;
            });
        }

        function UserBar()
        {
            function onLogout()
            {
                window.location ="/v3/logout";
                return false;
            }

           /* function onPassWord()
            {
                Utils.Base.openDlg("wsmbfile.changepassword", {}, {className:"modal-large"});
                return false;
            }

            function onService()
            {
                Utils.Base.openDlg("chat.chatpage", {}, {className:"modal-super-large"});
                //Utils.Base.openDlg(null, {}, {scope:$("#chatform"),className:"modal-super dashboard"});
                return false;
            }*/

            function onItemClick(e)
            {
                var sIndex = $(this).attr("index");
                var pfMap = [onLogout/*,onPassWord,onService*/];
                pfMap[sIndex]();
            }

            function toggleUserMenu(e)
            {
                function show()
                {
                    jMenu.slideDown(200);
                    $('body').on('click.usermenu',hide);
                }
                function hide()
                {
                    jMenu.slideUp(200);
                    jMenu.prev().removeClass("active");
                    $('body').off('click.usermenu');
                }

                var jMenu = $(this).next('ul');
                $(this).toggleClass('active');
                jMenu.is(':visible') ? hide() : show();

                e.stopPropagation();
            }

            function initUser()
            {
                $("#user_menu").unbind('click').bind('click',toggleUserMenu);
                $("#drop_list").off('click').on('click','li',onItemClick);
            }

            this.initUser = initUser;
        }
        
    });