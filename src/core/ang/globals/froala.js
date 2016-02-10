var app = angular.module('app');

app.value('froalaConfig', {
    heightMin: 400,
	key: 'sCHCPa1XQVZFSHSa1C==',
    fontSize: (function(){
        var arr = [];
        for( var i = 1; i <= 100; i++ )
            arr.push(i);

        return arr;
    })(),
    fontFamily: {
        'Arial,Helvetica,sans-serif': 'Arial',
        'Georgia,serif': 'Georgia',
        'Impact,Charcoal,sans-serif': 'Impact',
        'Tahoma,Geneva,sans-serif': 'Tahoma',
        "'Times New Roman',Times,serif": 'Times New Roman',
        'Verdana,Geneva,sans-serif': 'Verdana'
    },
    htmlRemoveTags: ['style', 'script'],
    toolbarButtons: [
                        'fullscreen', 'bold', 'italic', 'underline', 'strikeThrough', 'superscript', 'fontFamily', 'fontSize', '|', 
                        'color', '|', 
                        'insertLink', 'insertImage', 'insertVideo', 'insertFile', 'insertTable', 'quote', 
                        'paragraphFormat', 'align', 'formatOL', 'formatUL', 'insertHR','undo', 'redo', 'clearFormatting', 'selectAll', 'html',

                    ],
    imageUploadURL: (function(){
        var domainParts = location.host.split( '.' );

        //this is here to account for country second level domains such as .co.uk, otherwise those would break
        if( domainParts.length > 2 )
        {
            var env = domainParts.pop();
            var domain = domainParts.pop();

            if( env.length < 3 && domain.length <= 3 )
            {
                env = domain + "." + env;
                domain = domainParts.pop();
            }

            domain = domain + "." + env;
        }
        else
        {
            var env = domainParts.pop();
            var domain = domainParts.pop() + "." + env;
        }

        var apiURL = "http" + (env == 'site' || env == 'com' || env == 'org' || env == 'info' ? 's' : '') + "://api." + (domain.indexOf( 'smartmember' ) < 0 ? 'smartmember.com' : domain);

        return apiURL + '/utility/upload';
    })(),
    imageUploadMethod: 'POST',
    fileUploadURL: (function(){
        var domainParts = location.host.split( '.' );

        //this is here to account for country second level domains such as .co.uk, otherwise those would break
        if( domainParts.length > 2 )
        {
            var env = domainParts.pop();
            var domain = domainParts.pop();

            if( env.length < 3 && domain.length <= 3 )
            {
                env = domain + "." + env;
                domain = domainParts.pop();
            }

            domain = domain + "." + env;
        }
        else
        {
            var env = domainParts.pop();
            var domain = domainParts.pop() + "." + env;
        }

        var apiURL = "http" + (env == 'site' || env == 'com' || env == 'org' || env == 'info' ? 's' : '') + "://api." + (domain.indexOf( 'smartmember' ) < 0 ? 'smartmember.com' : domain);

        return apiURL + '/utility/upload';
    })(),
    fileUploadMethod: 'POST',
    requestWithCORS: false,
    htmlAllowedEmptyTags: ['textarea', 'a', 'iframe', 'object', 'video', 'style', 'script', '.fa', 'javascript'],
    htmlAllowedTags: ['a', 'abbr', 'address', 'area', 'article', 'aside', 'audio', 'b', 'base', 'bdi', 'bdo', 'blockquote', 'br', 'button', 'canvas', 'caption', 'cite', 'code', 'col', 'colgroup', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'hgroup', 'hr', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'keygen', 'label', 'legend', 'li', 'link', 'main', 'map', 'mark', 'menu', 'menuitem', 'meter', 'nav', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param', 'pre', 'progress', 'queue', 'rp', 'rt', 'ruby', 's', 'samp', 'script', 'style', 'section', 'select', 'small', 'source', 'span', 'strike', 'strong', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'u', 'ul', 'var', 'video', 'wbr', 'javascript'],
    events: {
        'froalaEditor.commands.after': function( e, editor, cmd, param1, param2 ) {
            switch( cmd ) {
                case 'html':
                    if( editor.codeView.isActive() ) {
                        var handleFroalaSave = function() {
                            var $scope = angular.element( e.currentTarget ).scope().$parent;

                            var model = angular.element(e.currentTarget).attr('ng-model');

                            if( model ) {
                                var model_bits = model.split('.');

                                var active_model = $scope;

                                for( var x = 0; x < model_bits.length - 1; x++ )
                                    active_model = active_model[ model_bits[ x ] ];

                                active_model[ model_bits[ x ] ] = editor.codeView.get();//I tried doing a simple editor.codeView.set( editor.codeView.get() ) but it refused to take, so we had to get a bit more complicated
                                $scope.$apply();
                            }
                        }

                        $('*').on('keyup', handleFroalaSave );
                    } else {
                        $('*').off('keyup', handleFroalaSave );
                    }
                    break;
            }
        },
        'froalaEditor.commands.before': function( e, editor, cmd, param1, param2 ) {
            switch( cmd ) {
                case 'html':
                    if( editor.codeView.isActive() ) {

                    } else {

                    }
                    break;
            }
        },
        'froalaEditor.destroy': function( e, editor ) {
            $('*').off('keyup', handleFroalaSave );
        }
    }
});