var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.admin.site.membership.product",{
			url: "/product/:id?",
			templateUrl: "/templates/components/public/admin/site/membership/product/product.html",
			controller: "ProductController"
		})
}); 

app.controller("ProductController", function ($scope, $q, $stateParams,smModal, $localStorage, $rootScope,  Restangular,toastr,$state) {
	
	$site=$rootScope.site;
	var paypal =null;
	var stripe=null;
	$access_level=null;
	$facebook_groups=null;
	$currency=null;
	$scope.keys = [];

	$scope.resolve = function(){
		$accessLevelRequest=null;
		$facebookGroupsRequest=null;
		$currencyRequest=null;
		if( $stateParams.id )
		{
			$accessLevelRequest = Restangular.one( 'accessLevel', $stateParams.id ).get().then(function(response){
				$access_level=response;
			}); 
		}
		else
		{
			$access_level = { site_id: $site.id };
		}

		Restangular.all( '' ).customGET( 'accessLevel' + '?view=admin&bypass_paging=1&site_id=' + $site.id ).then( function( data )
		{
			$scope.access_levels = data.items;
		});

		Restangular.all('accessLevel/getGrantedShareAccessLevel').customGET().then(function(response) {
			$scope.shared_access_levels = response;
		})

		Restangular.all('accessLevelShareKey').customGET().then(function(response) {
			if (response.total_count > 0)
			{
				console.log('items for keys', response.items);
				angular.forEach (response.items, function(item){
					$scope.keys.push(item);
				})
			}
		});

		$facebookGroupsRequest = Restangular.one( 'facebook' ).customGET( 'groups' ).then(function(response){
			$facebook_groups=response;
		});

		$currencyRequest = Restangular.all( 'siteMetaData' ).customGETLIST( "getOptions", [ 'currency' ] ).then(function(response){
			$currency=response;
		});

		if($accessLevelRequest)
			$q.all([$accessLevelRequest,$facebookGroupsRequest,$currencyRequest]).then(function(response){
				$scope.init();
			});
		else
		{
			$q.all([$facebookGroupsRequest,$currencyRequest]).then(function(response){
				$scope.init();
			});
		}

		
	}

	$scope.init = function() {
	    $scope.site = $rootScope.site;
	    if(!$access_level.id){
	    	$access_level.site_id = $scope.site.id;
	    }
	    $scope.default_currency = $currency.length > 0 ? $currency[0].value : 'USD';
		$scope.access_level = $access_level;

	    $scope.payment_app_configurations = {stripe:[],paypal:[]};

	    angular.forEach( $scope.site.configured_app, function(value,key){
	        if( value.type == 'stripe' )
	            $scope.payment_app_configurations.stripe.push( value );
	        if( value.type == 'paypal' )
	            $scope.payment_app_configurations.paypal.push( value );
	    });

	    if( $scope.access_level.expiration_period )
	        $scope.access_level.expiration_period = parseInt( $scope.access_level.expiration_period );

	    if( typeof $scope.access_level.currency == 'undefined' || $scope.access_level.currency == '' )
	        $scope.access_level.currency = $scope.default_currency;

		$scope.facebook_groups = $facebook_groups;
		if (_.findWhere($scope.site.configured_app,{type: 'facebook'})){
			$scope.facebook_integrated = true;
		}
		if($scope.access_level.facebook_group_id)
			$scope.access_level.facebook_group_id = $scope.access_level.facebook_group_id.toString();
		console.log($scope.access_level.facebook_group_id) 
	    paypal = _.findWhere($scope.site.configured_app,{type: 'paypal'})
	    stripe = _.findWhere($scope.site.configured_app,{type: 'stripe'})

	    if( stripe === undefined )
	        $scope.stripe_checkout = false;
	    else
	        $scope.stripe_checkout = true;

	    if( paypal === undefined || paypal.remote_id == '' )
	        $scope.paypal_checkout = false;
	    else
	        $scope.paypal_checkout = true;

		console.log("access levels: "+$scope.access_level);
		$scope.access_level.isOpen = false;
	}

    

	$scope.save = function(){
		delete $scope.access_level.isOpen;
		delete $scope.access_level.type;
		delete $scope.access_level.url;
        delete $scope.access_level.enable_trial;
		if ($scope.access_level.id){
			$scope.update();
			return;
		}
		$scope.create();
	}

    $scope.currencies = [
        {id: 'USD',label: '$ - USD'},
        {id: 'CAD',label: '$ - CAD'},
        {id: 'AUD',label: '$ - AUD'},
        {id: 'HKD',label: '$ - HKD'},
        {id: 'EUR',label: '&euro; - EUR'},
        {id: 'GBP',label: '&pound; - GBP'}
    ];

	$scope.update = function(){
		$scope.access_level.put().then(function(response){
			// for (var i = 0; i < $scope.access_levels.length; i++) {
			// 	if($scope.access_levels[i].id == response.id){
			// 		$scope.access_levels[i] = response;
			// 	}
			// };
			for (var i = $rootScope.access_levels.length - 1; i >= 0; i--) {
				if($rootScope.access_levels[i].id == response.id)
					$rootScope.access_levels[i] = response;
			};
            toastr.success("Product level updated!");
			smModal.Show("public.admin.site.membership.products");
		})
	}

	$scope.create = function(){
		Restangular.service("accessLevel").post($scope.access_level).then(function(response){
			//$scope.access_levels.push(response);
			$rootScope.access_levels.push(response);
            toastr.success("Product level created!");
            smModal.Show("public.admin.site.membership.products");
		});
	}

	$scope.exists = function(id){
		if (_.findWhere($scope.access_level.grants,{grant_id: id})){
			return true;
		}
	}

	$scope.exists_share = function(id) {
		if (_.findWhere($scope.access_level.shared_grants,{grant_id: id})){
			return true;
		}
	}

    $scope.paymentMethodExists = function(id){
        var $return = false;
        angular.forEach( $scope.access_level.payment_methods, function( value, key ) {
            if( value.payment_method_id == id )
                $return = true;
        });

        return $return;
    }

    $scope.validPaymentMethod = function( method ) {
        if( method.id == 2 && $scope.paypal_checkout == false )
            return false;
        if( method.id == 3 && $scope.stripe_checkout == false )
            return false;

        return true;
    }

	$scope.selectUrl = function(item , selected_url , show_next){
	
	  var api_resources = ['lesson' , 'customPage' , 'post' , 'download' , 'livecast' , 'supportArticle' , 'bridgePage'];
	  if(!selected_url)
	      return;
	  if(api_resources.indexOf(selected_url)<0)
	  {
	      $scope.access_level.information_url = selected_url;
	      $scope.close();
	      $scope.access_level.isOpen = false;

	  }
	  else if(selected_url == 'download'){
	    Restangular.all('').customGET('download',{}).then(function(response){
	        var downloads = response;
	        downloads.forEach(function(entity){
	            entity.url = entity.permalink;
	        })
	        $scope.show_next = true;
	        $scope.loaded_items = {items : downloads};
	          
	    })
	  }
	  else
	  {
	    Restangular.all(selected_url).customGET('',{}).then(function(response){
	        if(response.route == 'customPage')
	            response.route = 'page';
	        if(response.route == 'supportArticle')
	            response.route = 'support-article';

            if(response && response.items){
                response.items.forEach(function(entity){
                    entity.url = entity.permalink;
                })
            }else if(response){
                response.forEach(function(entity){
                    entity.url = entity.permalink;
                })
                response.items = response;
            }
	        
	        $scope.show_next = true;
	        $scope.loaded_items = response;
	          
	    })
	  }
	}

	$scope.generateACShareKey = function()
	{
		Restangular.all('').customGET('generateShareKey?access_level_id=' + $access_level.id).then( function( response )
		{
			$scope.keys.push(response);
			$scope.key = response.key;
			toastr.success( "Product level hash updated!" );
		} );

	}

	$scope.resolve();
});