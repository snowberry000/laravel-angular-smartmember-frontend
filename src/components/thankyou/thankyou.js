var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("thankyou",{
			url: "/thankyou",
			templateUrl: "/templates/components/thankyou/thankyou.html",
			controller: "ThankyouController",
            resolve: {
                $site: function(Restangular){
                    return Restangular.one('site','details').get();
                },
                $access_levels: function(Restangular,$site) {
                    return Restangular.all('accessLevel').getList({site_id: $site.id});
                }
            }
		})
        .state("thankyou2",{
            url: "/thank-you",
            templateUrl: "/templates/components/thankyou/thankyou.html",
            controller: "ThankyouController",
            resolve: {
                $site: function(Restangular){
                    return Restangular.one('site','details').get();
                },
                $access_levels: function(Restangular,$site) {
                    return Restangular.all('accessLevel').getList({site_id: $site.id});
                }
            }
        })
}); 

app.controller('ThankyouController', function ($scope, $http, Restangular, $site, $access_levels,$rootScope, $localStorage, smModal, smEvent) {
    $scope.site = $site;
    $rootScope.page_title = 'Thank you!';

    $scope.getQueryVariable = function(variable)
    {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i=0;i<vars.length;i++) {
            var pair = vars[i].split("=");
            if(pair[0] == variable){return pair[1];}
        }
        return(false);
    }

    $.each($site.meta_data, function (key, data) {
        $scope.options[data.key] = data.value;
    });

    $scope.options.thankyou_use_custom  == '1' ? $scope.options.thankyou_use_custom =true : $scope.options.thankyou_use_custom = false;
    
    $scope.jvzoo_product_id = $scope.getQueryVariable('cproditem') || null;
    $scope.access_level_id = $scope.getQueryVariable('access_level_id') || null;
    $scope.access_level = null;

    angular.forEach( $access_levels, function (value, key){
        if( $scope.access_level_id != null && value.id == $scope.access_level_id )
            $scope.access_level = value;
        else if( $scope.jvzoo_product_id != null && value.product_id == $scope.jvzoo_product_id )
            $scope.access_level = value;
    });

    if( $scope.access_level != null ) {
        if (typeof fbq == 'function') {
            fbq('track', 'Purchase', {
                content_name: $scope.access_level.name || $site.name,
                content_category: $site.name,
                content_type: 'product',
                value: $scope.access_level.price || 0,
                currency: 'USD'
            });
        }

        if (typeof $scope.options.facebook_conversion_pixel != 'undefined') {
            window._fbq = window._fbq || [];
            window._fbq.push(['track', $scope.options.facebook_conversion_pixel, {'content_name': $scope.access_level.name || $site.name, 'value': $scope.access_level.price || 0, 'currency': 'USD'}]);
        }
    }

    var getUrlVars = function()
    {
        var vars = {};
        var parts = window.location.href.replace( /[?&]+([^=&]+)=([^&]*)/gi, function( m, key, value )
        {
            vars[ key ] = decodeURIComponent( value );
        } );
        return vars;
    }

    $rootScope.$_GET = getUrlVars();

    if( $rootScope.$_GET[ 'cbreceipt' ] )
    {
        if( !$localStorage.user )
        {
            smModal.Show( 'public.sign.transaction' );
            // $timeout( function(){
            //     smModal.Show( 'public.sign.transaction' );
            // }, 50);
        }
        else
        {
            $http.defaults.headers.common[ 'Authorization' ] = "Basic " + $localStorage.user.access_token;

            smEvent.Log( 'transaction-associated-for-logged-in-user', {
                'request-url': location.href
            } );

            Restangular.all( '' ).customGET( 'user/transactionAccess/' + $rootScope.$_GET[ 'cbreceipt' ] ).then( function( response )
            {
                if( location.href.indexOf( 'sm.smartmember.' ) == -1 ) {
                    location.href = 'http://' + location.hostname;
                } else {
                    location.href = 'http://my.smartmember.' + $rootScope.app.env;

                    smEvent.Log( 'landed-on-my-setup-site', {
                        'request-url': location.href
                    } );
                }
            } );
        }
    }
});