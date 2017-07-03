/**
 * Created by Administrator on 2015/11/14.
 */
var g_ia = 0;
//var g_changeflag = 0;
var g_localHeadImage = 0;

;(function ($) {
    $(document).ready(function (){

            resize=function(file){

                var reader=new FileReader();
                reader.onload=function(){
                    $(".resize-image").attr("src", reader.result);
                    g_component.resizeableImage($('.resize-image'));
                    $("#chatSettingPortraintContent").show();

                };
                reader.readAsDataURL(file);
            };

        function readBlobAsDataURL(blob, callback) {
            var a = new FileReader();
            a.onload = function() {callback(a.result);};
            a.readAsDataURL(blob);
        }
        //function aaaa(a){
        //
        //    $("#chatSettingHeadImgOKimgContent").hide();
        //    var file=a.files[0];
        //    if(file == undefined){
        //        //$("#chatSettingPortraintContent").hide();
        //        //$("#chatSettingHeadImgOKimgContent").show();
        //        //
        //        //g_ia = 0;
        //        return;
        //    }
        //    $("#chatSettingBtnOk").addClass("disabled");
        //    resize(file);
        //    $("#chatSettingHeadImgToolsChoise").unbind("change");
        //    $("#chatSettingHeadImgToolsChoise").bind("change",aaaa);
        //}
        //$("#chatSettingHeadImgToolsChoise").live("change", function (event){
        $("#chatSettingHeadImgToolsChoise").change(function(event){
            //aaaa(this);


            var file=this.files[0];
            if(file == undefined){
                //$("#chatSettingPortraintContent").hide();
                //$("#chatSettingHeadImgOKimgContent").show();
                //
                //g_ia = 0;
                return;
            }
            $("#chatSettingHeadImgOKimgContent").hide();
            $("#chatSettingBtnOk").addClass("disabled");

            resize(file);
            //$("#chatSettingHeadImgToolsChoise").unbind("change");
            //$("#chatSettingHeadImgToolsChoise").bind("change");
        });

        $('#chatNavSettingEntryLink').click(function(){
            g_ia=0;
            $("#chatSettingHeadImgOKimgContent").show();
            $("#chatSettingHeadImgToolsChoise").val("");
            $(".showFileName").text("未选择任何文件");
            $("#chatSettingPortraintContent").hide();
            $("#chatSettingBtnOk").addClass("disabled");
            $("#chatSettingHeadImgOKimgContent img").attr("src", chatDbm["userHeadImg"][g_chatUid]?chatDbm["userHeadImg"][g_chatUid]["image"]:g_chatDefaultHeadImg);
             //           if(socket != 0){
             //socket.emit('userPhotoGet', {}, function(info){
             //console.log(info);
             //if(info.result == "success"){
             //
             //var image = JSON.parse(info.body.image);
             //console.log(image);
             //var arr = [];
             //for (var i in image) {
             //arr[i] = image[i];
             //};
             //
             //if (arr.length > 0) {
             //var ia = new Uint8Array(arr );
             //myresizedImage = (new Blob([ia], {type:"image/png"}));
             //readBlobAsDataURL(myresizedImage, function (dataurl){
             //console.log(dataurl);
             //resizer.image.src=dataurl;
             //});
             //}
             //}
             //});
             //}
        })
        $(".fileBtn").on("change","input[type='file']",function(){
            var file=this.files[0];
            if(file == undefined || !(/.(?:jpg|png|gif|JPG|JPEG|PNG|GIF)$/.test(file.name))){
                $(".showFileName").html("您未选择文件，或者您选择的文件类型有误！");
                //$(".fileerrorTip").html("您未选择文件，或者您选择的文件类型有误！").show();
                return false
            }else{
                $(".showFileName").html(file.name);
                $(".showFileName").attr("title",file.name);
            }
        })
    });
})(jQuery);
