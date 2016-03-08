var app = angular.module('app');
$(function() {
    $.FroalaEditor.DefineIcon('shortcode', {NAME: 'cog'});
    $.FroalaEditor.RegisterCommand('shortcode', {
        title: 'Short Codes',
        type: 'dropdown',
        focus: false,
        undo: false,
        refreshAfterCallback: true,
        options: {
            'fb_page_plugin': 'Facebook Page Plugin',
            'fb_comments': 'Facebook Comments Plugin'
        },
        callback: function (cmd, val) {
            switch (val)
            {
                case 'fb_page_plugin':
                    this.html.insert('[fb_page_plugin page-url="http://www.facebook.com/facebook" small-header="false" hide-cover="false" show-facepile="true"]', true);
                    break;
                case 'fb_comments':
                    this.html.insert('[fb_comments page-url="http://www.facebook.com/facebook" num-posts="5"]', true);
                    break;
            }
        },
        // Callback on refresh.
        refresh: function ($btn) {
            //console.log ('do refresh');
        },
        // Callback on dropdown show.
        refreshOnShow: function ($btn, $dropdown) {
            //console.log ('do refresh when show');
        }
    });
});
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
                        'paragraphFormat', 'align', 'formatOL', 'formatUL', 'insertHR','undo', 'redo', 'clearFormatting', 'selectAll', 'html', 'shortcode'

                    ],
    toolbarButtonsMD: [
        'fullscreen', 'bold', 'italic', 'underline', 'strikeThrough', 'superscript', 'fontFamily', 'fontSize', '|',
        'color', '|',
        'insertLink', 'insertImage', 'insertVideo', 'insertFile', 'insertTable', 'quote',
        'paragraphFormat', 'align', 'formatOL', 'formatUL', 'insertHR','undo', 'redo', 'clearFormatting', 'selectAll', 'html', 'shortcode'

    ],
    toolbarButtonsSM: [
        'fullscreen', 'bold', 'italic', 'underline', 'strikeThrough', 'superscript', 'fontFamily', 'fontSize', '|',
        'color', '|',
        'insertLink', 'insertImage', 'insertVideo', 'insertFile', 'insertTable', 'quote',
        'paragraphFormat', 'align', 'formatOL', 'formatUL', 'insertHR','undo', 'redo', 'clearFormatting', 'selectAll', 'html', 'shortcode'

    ],
    toolbarButtonsXS: [
        'fullscreen', 'bold', 'italic', 'underline', 'strikeThrough', 'superscript', 'fontFamily', 'fontSize', '|',
        'color', '|',
        'insertLink', 'insertImage', 'insertVideo', 'insertFile', 'insertTable', 'quote',
        'paragraphFormat', 'align', 'formatOL', 'formatUL', 'insertHR','undo', 'redo', 'clearFormatting', 'selectAll', 'html', 'shortcode'

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

        non_https_tld = [
            'soy',
            'dev',
            'in',
        ];

        var apiURL = "http" + (non_https_tld.indexOf(env) == -1 ? 's' : '') + "://api." + (domain.indexOf( 'smartmember' ) < 0 ? 'smartmember.com' : domain);

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

        non_https_tld = [
            'soy',
            'dev',
            'in',
        ];

        var apiURL = "http" + (non_https_tld.indexOf(env) == -1 ? 's' : '') + "://api." + (domain.indexOf( 'smartmember' ) < 0 ? 'smartmember.com' : domain);

        return apiURL + '/utility/upload';
    })(),
    fileUploadMethod: 'POST',
    requestWithCORS: false,
    htmlAllowedEmptyTags: ['textarea', 'a', 'iframe', 'object', 'video', 'style', 'script', '.fa', 'javascript'],
    htmlAllowedTags: ['a', 'abbr', 'address', 'area', 'article', 'aside', 'audio', 'b', 'base', 'bdi', 'bdo', 'blockquote', 'br', 'button', 'canvas', 'caption', 'cite', 'code', 'col', 'colgroup', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'hgroup', 'hr', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'keygen', 'label', 'legend', 'li', 'link', 'main', 'map', 'mark', 'menu', 'menuitem', 'meter', 'nav', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param', 'pre', 'progress', 'queue', 'rp', 'rt', 'ruby', 's', 'samp', 'script', 'style', 'section', 'select', 'small', 'source', 'span', 'strike', 'strong', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'u', 'ul', 'var', 'video', 'wbr', 'javascript'],
    entities: '&amp;&lt;&gt;&apos;&iexcl;&cent;&pound;&curren;&yen;&brvbar;&sect;&uml;&copy;&ordf;&laquo;&not;&shy;&reg;&macr;&deg;&plusmn;&sup2;&sup3;&acute;&micro;&para;&middot;&cedil;&sup1;&ordm;&raquo;&frac14;&frac12;&frac34;&iquest;&Agrave;&Aacute;&Acirc;&Atilde;&Auml;&Aring;&AElig;&Ccedil;&Egrave;&Eacute;&Ecirc;&Euml;&Igrave;&Iacute;&Icirc;&Iuml;&ETH;&Ntilde;&Ograve;&Oacute;&Ocirc;&Otilde;&Ouml;&times;&Oslash;&Ugrave;&Uacute;&Ucirc;&Uuml;&Yacute;&THORN;&szlig;&agrave;&aacute;&acirc;&atilde;&auml;&aring;&aelig;&ccedil;&egrave;&eacute;&ecirc;&euml;&igrave;&iacute;&icirc;&iuml;&eth;&ntilde;&ograve;&oacute;&ocirc;&otilde;&ouml;&divide;&oslash;&ugrave;&uacute;&ucirc;&uuml;&yacute;&thorn;&yuml;&OElig;&oelig;&Scaron;&scaron;&Yuml;&fnof;&circ;&tilde;&Alpha;&Beta;&Gamma;&Delta;&Epsilon;&Zeta;&Eta;&Theta;&Iota;&Kappa;&Lambda;&Mu;&Nu;&Xi;&Omicron;&Pi;&Rho;&Sigma;&Tau;&Upsilon;&Phi;&Chi;&Psi;&Omega;&alpha;&beta;&gamma;&delta;&epsilon;&zeta;&eta;&theta;&iota;&kappa;&lambda;&mu;&nu;&xi;&omicron;&pi;&rho;&sigmaf;&sigma;&tau;&upsilon;&phi;&chi;&psi;&omega;&thetasym;&upsih;&piv;&ensp;&emsp;&thinsp;&zwnj;&zwj;&lrm;&rlm;&ndash;&mdash;&lsquo;&rsquo;&sbquo;&ldquo;&rdquo;&bdquo;&dagger;&Dagger;&bull;&hellip;&permil;&prime;&Prime;&lsaquo;&rsaquo;&oline;&frasl;&euro;&image;&weierp;&real;&trade;&alefsym;&larr;&uarr;&rarr;&darr;&harr;&crarr;&lArr;&uArr;&rArr;&dArr;&hArr;&forall;&part;&exist;&empty;&nabla;&isin;&notin;&ni;&prod;&sum;&minus;&lowast;&radic;&prop;&infin;&ang;&and;&or;&cap;&cup;&int;&there4;&sim;&cong;&asymp;&ne;&equiv;&le;&ge;&sub;&sup;&nsub;&sube;&supe;&oplus;&otimes;&perp;&sdot;&lceil;&rceil;&lfloor;&rfloor;&lang;&rang;&loz;&spades;&clubs;&hearts;&diams;',
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