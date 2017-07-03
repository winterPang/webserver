/**
 * Created by Administrator on 2016/4/8.
 */
var fs = require('fs');
var officegen = require('officegen');
var path = './localfs/v3/webdoc/';

if (!fs.existsSync(path)){
    fs.mkdirSync(path, 0777);
}

exports.makedocx = function(message,res){
    var docx = officegen( 'docx' );
    docx.on ( 'finalize', function ( written ) {
        console.log ( 'Finish to create Word file.\nTotal bytes created: ' + written + '\n' );
        res.download(path +  message.Name + ".docx" );
    });

    docx.on ( 'error', function ( err ) {
        console.log ( err );
    });

    var pObj = docx.createP ({ align: 'center' });
    pObj.addText ("文档名称 " + message.Name, { bold: true,font_face: 'Arial', font_size: 18 });
    pObj.addLineBreak ();
    pObj.addLineBreak ();
    pObj.addLineBreak ();

    for (var i = 0; i < message.AllItems.length ; i ++){
        var pObj = docx.createListOfNumbers ();
        pObj.addText (message.AllItems[i].ItemName, { bold: true,font_face: 'Arial', font_size: 10});

        var pObj = docx.createP();
        pObj.addText('SubItem : ' + message.AllItems[i].SubItem, {font_face: 'Arial', font_size: 10});
        pObj.addLineBreak ();
        pObj.addText('Path : ' + message.AllItems[i].Path, {font_face: 'Arial', font_size: 10});
        pObj.addLineBreak ();
        pObj.addText('Method : ' + message.AllItems[i].Method, {font_face: 'Arial', font_size: 10});
        pObj.addLineBreak ();
        pObj.addText('Parameters : ', {font_face: 'Arial', font_size: 10});
        pObj.addLineBreak ();
        for (var j in message.AllItems[i].Parameters)
        {
            pObj.addText("*    " + j  + ": " + message.AllItems[i].Parameters[j], {font_face: 'Arial', font_size: 10});
            pObj.addLineBreak ();
        }

        pObj.addText('Error : ' + message.AllItems[i].Error, {font_face: 'Arial', font_size: 10});
        pObj.addLineBreak ();
        pObj.addText('Return : ' + message.AllItems[i].Return, {font_face: 'Arial', font_size: 10});
    }

    var pObj = docx.createP({});
    //pObj.addText (message.AllItems[0].t);
    var out = fs.createWriteStream (path +  message.Name + ".docx" );

    out.on ( 'error', function ( err ) {
        console.log ( err );
    });

    docx.generate ( out );
};
