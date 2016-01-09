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
    zIndex: 9995
});