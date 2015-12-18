var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.app.checkout",{
			url: "/checkout/:id",
			templateUrl: "/templates/components/public/app/checkout/checkout.html",
			controller: "CheckoutController",
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            name: 'checkout',
                            files: [
                                'https://checkout.stripe.com/checkout.js'
                            ]
                        }
                    ]);
                }
            }
		})
}); 

app.controller('CheckoutController', function ($scope, $site, $rootScope , $location , notify ,$localStorage ,$modal,$stateParams,Restangular) {
    $scope.access_level = {};

    var paypal = _.findWhere($scope.site.integration,{type: 'paypal', site_id: $scope.site.id, default: "1"});

    if( !paypal )
        paypal = _.findWhere($scope.site.integration,{type: 'paypal', company_id: $scope.site.company_id, default: "1"});

    if( !paypal )
        paypal = _.findWhere($scope.site.integration,{type: 'paypal', site_id: $scope.site.id}) || _.findWhere($scope.site.integration,{type: 'paypal'});

    var stripe = _.findWhere($scope.site.integration,{type: 'stripe', site_id: $scope.site.id, default: "1"});

    if( !stripe )
        stripe = _.findWhere($scope.site.integration,{type: 'stripe', company_id: $scope.site.company_id, default: "1"});

    if( !stripe )
        stripe = _.findWhere($scope.site.integration,{type: 'stripe', site_id: $scope.site.id}) || _.findWhere($scope.site.integration,{type: 'stripe'});

    if( stripe === undefined )
        $scope.stripe_checkout = false;
    else
        $scope.stripe_checkout = true;

    if( paypal === undefined )
        $scope.paypal_checkout = false;
    else
        $scope.paypal_checkout = true;

    $scope.jvzoo_checkout = false;

    $scope.checkout_success = false;

    angular.forEach($site.meta_data, function(value, key) {
        if(value.key=='site_logo')
            $scope.site_logo = value.value;
        if(value.key=='currency')
            $scope.currency = value.value;
    });

    if( typeof $scope.currency == 'undefined' || $scope.currency == '' )
        $scope.currency = 'USD';

    $scope.currencies = [
        {id: 'USD',label: '$'},
        {id: 'CAD',label: '$'},
        {id: 'AUD',label: '$'},
        {id: 'HKD',label: '$'},
        {id: 'EUR',label: '&euro;'},
        {id: 'GBP',label: '&pound;'}
    ];
    
    var email , name;

    var handler = StripeCheckout.configure({
        key: $rootScope.app.stripe_pk,
        image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
        token: function(token) {
          Restangular.all('transaction').post({access_id : $scope.access_level.id , token : token.id , type : 'stripe' , name : name , email : token.email}).then(function(response){
              $scope.stripe_checkout = false;
              $scope.paypal_checkout = false;
              $scope.checkout_success = true;

              window.location.href = '/thank-you?access_level_id=' + $scope.access_level.id;
          })
        }
      });

    $scope.init = function(){
    	Restangular.one('accessLevel',$stateParams.id).get().then(function(response){
    		$scope.access_level = response;

            if( typeof $scope.access_level.jvzoo_button != 'undefined' && $scope.access_level.jvzoo_button != '' && $scope.access_level.jvzoo_button != null && typeof $scope.access_level.product_id != 'undefined' && $scope.access_level.product_id != '' && $scope.access_level.product_id != null )
                $scope.jvzoo_checkout = true;

            if( typeof $scope.access_level.payment_methods != 'undefined' ) {
                var stripe_enabled = false;
                var paypal_enabled = false;
                var jvzoo_enabled = false;

                angular.forEach( $scope.access_level.payment_methods, function( value, key ) {
                    if( value.payment_method_id !== undefined && value.payment_method_id == 1 )
                        jvzoo_enabled = true;
                    if( value.payment_method_id !== undefined && value.payment_method_id == 2 )
                        paypal_enabled = true;
                    if( value.payment_method_id !== undefined && value.payment_method_id == 3 )
                        stripe_enabled = true;
                });

                if( $scope.access_level.payment_methods.length > 0 ) {
                    if (paypal_enabled == false)
                        $scope.paypal_checkout = false;
                    if (stripe_enabled == false)
                        $scope.stripe_checkout = false;
                    if (jvzoo_enabled == false)
                        $scope.jvzoo_checkout = false;
                }

                if( typeof $scope.access_level.currency == 'undefined' || $scope.access_level.currency == '' )
                    $scope.access_level.currency = $scope.currency;

                if( $scope.access_level.stripe_integration && $scope.access_level.stripe_integration != 0 ){
                    var new_stripe = _.findWhere($scope.site.integration,{type: 'stripe', id: $scope.access_level.stripe_integration }) || _.findWhere($scope.site.integration,{type: 'stripe', id: $scope.access_level.stripe_integration + '' })

                    if( new_stripe )
                        stripe = new_stripe;
                }

                if( $scope.access_level.paypal_integration && $scope.access_level.paypal_integration != 0 ){
                    var new_paypal = _.findWhere($scope.site.integration,{type: 'paypal', id: $scope.access_level.paypal_integration }) || _.findWhere($scope.site.integration,{type: 'paypal', id: $scope.access_level.paypal_integration + '' })

                    if( new_paypal )
                        paypal = new_paypal;
                }
            }
    	});
    }

    $scope.openModal = function()
    {	  
    
    	handler.open({
    	      name: $site.name,
    	      description: 'Subscription for '+$scope.access_level.name,
    	      amount: $scope.access_level.price * 100,
              currency: $scope.access_level.currency
    	    });
    }

    $scope.makePayment = function(){
        var url = "https://www.paypal.com/cgi-bin/webscr?";

        var params = {
            cmd: "_xclick",
            business: paypal.remote_id,
            item_name: $scope.access_level.name,
            'return': $scope.app.appUrl + '/thank-you?access_level_id=' + $scope.access_level.id,
            "cancel_return": $scope.app.appUrl + $scope.access_level.information_url,
            currency_code: $scope.access_level.currency,
            custom: $scope.access_level.id
        };

        if( $localStorage !== undefined && $localStorage.user !== undefined && $localStorage.user.id !== undefined )
            params.notify_url = $scope.app.apiUrl + "/paypal/process/" + $scope.access_level.id + "/" + $localStorage.user.id;
        else
            params.notify_url = $scope.app.apiUrl + "/paypal/process/" + $scope.access_level.id + "/none";

        console.log( 'notify url: ' + params.notify_url );  
        if ($scope.access_level.trial_amount)
        {
            params['a1'] = $scope.access_level.trial_amount;
            switch ($scope.access_level.trial_interval)
            {
                case "month":
                    params['p1'] = $scope.access_level.trial_duration;
                    params['t1'] = 'M';
                    break;
                case "week":
                    params['p1'] = $scope.access_level.trial_duration;
                    params['t1'] = 'W';
                    break;
                case "day":
                    params['p1'] = $scope.access_level.trial_duration;
                    params['t1'] = 'D';
                    break;
                default:
                    params['p1'] = 0;
            }
        }
        switch($scope.access_level.payment_interval){
            case "monthly":
                params['cmd'] = '_xclick-subscriptions';
                params['src'] = 1;
                params['a3'] = $scope.access_level.price;
                params['p3'] = 1;
                params['t3'] = 'M';
                break;
            case "weekly":
                params['cmd'] = '_xclick-subscriptions';
                params['src'] = 1;
                params['a3'] = $scope.access_level.price;
                params['p3'] = 1;
                params['t3'] = 'W';
                break;
            case "bi_weekly":
                params['cmd'] = '_xclick-subscriptions';
                params['src'] = 1;
                params['a3'] = $scope.access_level.price;
                params['p3'] = 2;
                params['t3'] = 'W';
                break;
            case "daily":
                params['cmd'] = '_xclick-subscriptions';
                params['src'] = 1;
                params['a3'] = $scope.access_level.price;
                params['p3'] = 1;
                params['t3'] = 'D';
                break;
            default: 
                params['amount'] = $scope.access_level.price;
        }
        url = url + $.param(params);
        window.location.href = url;
    }


});