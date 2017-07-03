/*
 * jQuery Multiple File Upload Plugin v1.48 - 2012-07-19 ###
 * Home: http://www.fyneworks.com/jquery/multiple-file-upload/
 * Code: http://code.google.com/p/jquery-multifile-plugin/
 * Licensed under http://en.wikipedia.org/wiki/MIT_License
*/
;if(window.jQuery) (function($){

$.fn.MultiFile = function(options)
{
	if(this.length==0) return this; 
	if(typeof arguments[0]=='string'){
		if(this.length>1){
			var args = arguments;
			return this.each(function(){
				$.fn.MultiFile.apply($(this), args);
            });
		};
		$.fn.MultiFile[arguments[0]].apply(this, $.makeArray(arguments).slice(1) || []);
		return this;
	};
	var options = $.extend({},$.fn.MultiFile.options,options || {} );
	// this code will automatically intercept native form submissions
	// and disable empty file elements
	$('form').not('MultiFile-intercepted').addClass('MultiFile-intercepted')
	.submit($.fn.MultiFile.disableEmpty);

    this.not('.MultiFile-applied').addClass('MultiFile-applied')
    .each(function(){
        // MAIN PLUGIN FUNCTIONALITY - START
        // variable group_count would repeat itself on multiple calls to the plugin.
        // this would cause a conflict with multiple elements
        // changes scope of variable to global so id will be unique over n calls
        window.MultiFile = (window.MultiFile || 0) + 1;
        var group_count = window.MultiFile;

        // we will use this one to create new input elements
        var MultiFile = {e:this, E:$(this), clone:$(this).clone()};
        if(typeof options=='number') options = {max:options};
        var o = $.extend({},
            $.fn.MultiFile.options,
            options || {},
            ($.metadata? MultiFile.E.metadata(): ($.meta?MultiFile.E.data():null)) || {}, /* metadata options */
            {} /* internals */
        );
        // limit number of files that can be selected?
        if(!(o.max>0)){    /*IsNull(MultiFile.max)*/
            o.max = MultiFile.E.attr('maxlength');
        };
        if(!(o.max>0)){   /*IsNull(MultiFile.max)*/
            o.max = (String(MultiFile.e.className.match(/\b(max|limit)\-([0-9]+)\b/gi) || ['']).match(/[0-9]+/gi) || [''])[0];
            if(!(o.max>0)) o.max = -1;
            else    o.max = String(o.max).match(/[0-9]+/gi)[0];
        }
        o.max = new Number(o.max);
        // limit extensions?
        o.accept = o.accept || MultiFile.E.attr('accept') || '';
        if(!o.accept){
            o.accept = (MultiFile.e.className.match(/\b(accept\-[\w\|]+)\b/gi)) || '';
            o.accept = new String(o.accept).replace(/^(accept|ext)\-/i,'');
        };

        $.extend(MultiFile, o || {});
        MultiFile.STRING = $.extend({},$.fn.MultiFile.options.STRING,MultiFile.STRING);
        // PRIVATE PROPERTIES/METHODS
        $.extend(MultiFile, {
            n: 0, // How many elements are currently selected?
            slaves: [], files: [],
            instanceKey: MultiFile.e.id || 'MultiFile'+String(group_count), // Instance Key?
            generateID: function(z){ return MultiFile.instanceKey + (z>0 ?'_F'+String(z):''); },
            trigger: function(event, element){
                var handler = MultiFile[event], value = $(element).attr('value');
                if(handler){
                    var returnValue = handler(element, value, MultiFile);
                    if( returnValue!=null ) return returnValue;
                }
                return true;
            }
        });

        if(String(MultiFile.accept).length>1){
            MultiFile.accept = MultiFile.accept.replace(/\W+/g,'|').replace(/^\W|\W$/g,'');
            MultiFile.rxAccept = new RegExp('\\.('+(MultiFile.accept?MultiFile.accept:'')+')$','gi');
        };          
        MultiFile.wrapID = MultiFile.instanceKey+'_wrap'; // Wrapper ID?
        MultiFile.E.wrap('<div class="MultiFile-wrap" id="'+MultiFile.wrapID+'"></div>');
        MultiFile.wrapper = $('#'+MultiFile.wrapID+'');         
        // MultiFile MUST have a name - default: file1[], file2[], file3[]
        MultiFile.e.name = MultiFile.e.name || 'file'+ group_count +'[]';
        if(!MultiFile.list){
        // Create a wrapper for the list
        // this change allows us to keep the files in the order they were selected
            MultiFile.wrapper.append( '<div class="MultiFile-list" id="'+MultiFile.wrapID+'_list"></div>' );
            MultiFile.list = $('#'+MultiFile.wrapID+'_list');
        };
        MultiFile.list = $(MultiFile.list);						

        MultiFile.addSlave = function( slave, slave_count ){					
            // Keep track of how many elements have been displayed
            MultiFile.n++;
            // Add reference to master element
            slave.MultiFile = MultiFile;		
            // Clear identifying properties from clones
            if(slave_count>0) slave.id = slave.name = '';						
            // Define element's ID and name (upload components need this!)
            if(slave_count>0) slave.id = MultiFile.generateID(slave_count);
            slave.name = String(MultiFile.namePattern
            /*master name*/.replace(/\$name/gi,$(MultiFile.clone).attr('name'))
            /*master id  */.replace(/\$id/gi,  $(MultiFile.clone).attr('id'))
            /*group count*/.replace(/\$g/gi,   group_count)
            /*slave count*/.replace(/\$i/gi,   slave_count)
            );
            // If we've reached maximum number, disable input slave
            if( (MultiFile.max > 0) && ((MultiFile.n-1) > (MultiFile.max)) ) // MultiFile.n Starts at 1, so subtract 1 to find true count
            slave.disabled = true;
            MultiFile.current = MultiFile.slaves[slave_count] = slave;
            slave = $(slave);
            slave.val('').attr('value','')[0].value = '';
            // Stop plugin initializing on slaves
            slave.addClass('MultiFile-applied');

            slave.change(function(){                  						 
                // Lose focus to stop IE7 firing onchange again
                $(this).blur();
                if(!MultiFile.trigger('onFileSelect', this, MultiFile)) return false;
                //# Retrive value of selected file from element
                var ERROR = '', v = String(this.value || ''/*.attr('value)*/);
                // check extension
                if(MultiFile.accept && v && !v.match(MultiFile.rxAccept))
                ERROR = MultiFile.STRING.denied.replace('$ext', String(v.match(/\.\w{1,4}$/gi)));
                // Disallow duplicates
                for(var f in MultiFile.slaves)
                if(MultiFile.slaves[f] && MultiFile.slaves[f]!=this)
                if(MultiFile.slaves[f].value==v)
                ERROR = MultiFile.STRING.duplicate.replace('$file', v.match(/[^\/\\]+$/gi));
                var newEle = $(MultiFile.clone).clone();
                newEle.addClass('MultiFile');
                // Handle error
                if(ERROR!=''){
                    MultiFile.error(ERROR);  
                    MultiFile.n--;
                    MultiFile.addSlave(newEle[0], slave_count);
                    slave.parent().prepend(newEle);
                    slave.remove();
                    return false;
                };
                $(this).css({ position:'absolute', top: '-3000px' });
                slave.after(newEle);
                // Update list
                MultiFile.addToList( this, slave_count );
                // Bind functionality
                MultiFile.addSlave( newEle[0], slave_count+1 );
                //# Trigger Event! afterFileSelect
                if(!MultiFile.trigger('afterFileSelect', this, MultiFile)) return false;                    
            }); 
            // Save control to element
            $(slave).data('MultiFile', MultiFile);
    	
        };
        MultiFile.addToList = function( slave, slave_count ){
            if(!MultiFile.trigger('onFileAppend', slave, MultiFile)) return false;
            if(slave.files)
            {
                var count=0;
                for(var i=0;i<slave.files.length;i++)
                {
                    count++;
                    var fileMsg=slave.files[i];
                    var sName=slave.files[i].name;
                    creatList(sName,count,fileMsg);
                } 
            }
            else
            {
                var count=1;
                creatList(slave.value,count);
            }
            function creatList(str,num,msg)
            {
                var r = $('<div class="MultiFile-label"></div>'),
                v = String(str || ''/*.attr('value)*/),
                a = $('<span class="MultiFile-title" title="'+MultiFile.STRING.selected.replace('$file', v)+'">'+MultiFile.STRING.file.replace('$file', v.match(/[^\/\\]+$/gi)[0])+'</span>'),
                b = $('<a class="MultiFile-remove" href="#'+MultiFile.wrapID+'"><i class="fa fa-trash-o"></i></a>');
                MultiFile.list.append(r.append(b, ' ', a));
                if(msg)
                {
                    r.data("fileMsg",fileMsg);
                }
                var count=num;
                b.click(function(){
                    //# Trigger Event! onFileRemove
                    if(!MultiFile.trigger('onFileRemove', slave, MultiFile)) return false;
                    MultiFile.n--;
                    MultiFile.current.disabled = false;
                    MultiFile.slaves[slave_count] = null;
                    count--;
                    if(count==0)
                    {
                        $(slave).remove();
                    }
                    $(this).parent().remove();                                          
                    $(MultiFile.current).css({ position:'', top: '' });
                    $(MultiFile.current).reset().val('').attr('value', '')[0].value = '';
                    if(!MultiFile.trigger('afterFileRemove', slave, MultiFile)) return false;                                         
                    return false;
                });
            }
            //# Trigger Event! afterFileAppend
            if(!MultiFile.trigger('afterFileAppend', slave, MultiFile)) return false;
        };       
        // Bind functionality to the first element
        if(!MultiFile.MultiFile) MultiFile.addSlave(MultiFile.e, 0);
        // Increment control count
        //MultiFile.I++; // using window.MultiFile
        MultiFile.n++;						
        // Save control to element
        MultiFile.E.data('MultiFile', MultiFile);
    }); // each element
};
$.extend($.fn.MultiFile, {
    reset: function(){
        var settings = $(this).data('MultiFile');
        if(settings) settings.list.find('a.MultiFile-remove').click();
        return $(this);
    },
    disableEmpty: function(klass){ 
        klass = (typeof(klass)=='string'?klass:'')||'mfD';
        var o = [];
        $('input:file.MultiFile').each(function(){ if($(this).val()=='') o[o.length] = this; });
        return $(o).each(function(){ this.disabled = true }).addClass(klass);
    },
    reEnableEmpty: function(klass){ 
        klass = (typeof(klass)=='string'?klass:'')||'mfD';
        return $('input:file.'+klass).removeClass(klass).each(function(){ this.disabled = false });
    },
});

$.fn.MultiFile.options = {
	accept: '', // accepted file extensions //$.fn.MultiFile.options.accept = 'gif|jpg';
	max: -1,    // maximum number of selectable files
	namePattern: '$name', // same name by default (which creates an array)
	STRING: {   // STRING: collection lets you show messages in different languages
		remove:'x',
		denied:'You cannot select a $ext file.\nTry again...',
		file:'$file',
		selected:'File selected: $file',
		duplicate:'This file has already been selected:\n$file'
	},	
	error: function(s){alert(s);}
};
$.fn.reset = function(){
    return this.each(function(){ try{ this.reset(); }catch(e){} }); 
};

})(jQuery);
