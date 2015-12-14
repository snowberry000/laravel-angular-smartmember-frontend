app.controller('AccessLevelsController', function ($scope, $localStorage, $modal, Restangular,$site, toastr) {

	if (_.findWhere($scope.site.integration,{type: 'stripe'})){
		$scope.stripe_integrated = true;
	}

    if (_.findWhere($scope.site.integration,{type: 'paypal'})){
        $scope.paypal_integrated = true;
    }

    $scope.template_data = {
        title: 'PRODUCTS',
        description: 'Products are how you protect your course content & downloads - as well as offer customers a specific item to purchase such as a bronze, silver, or gold membership level.',
        singular: 'product',
        edit_route: 'admin.site.membership.product',
        api_object: 'accessLevel'
    }

    $scope.data = [];
    $scope.pagination = {current_page: 1};
    $scope.pagination.total_count = 1;

    $scope.paginate = function(){

        if( typeof $scope.data[ $scope.pagination.current_page] != 'object' ) {

            $scope.loading = true;

            var $params = {p: $scope.pagination.current_page, site_id: $site.id};

            if ($scope.query) {
                $params.q = encodeURIComponent( $scope.query );
            }

            Restangular.all('').customGET( $scope.template_data.api_object + '?view=admin&p=' + $params.p + '&site_id=' + $params.site_id + ( $scope.query ? '&q=' + $scope.query : '' )).then(function (data) {
                $scope.loading = false;
                $scope.pagination.total_count = data.total_count;
                $scope.data[ $scope.pagination.current_page] = Restangular.restangularizeCollection( null, data.items, $scope.template_data.api_object );
            });
        }
    }

    $scope.paginate();

    $scope.search = function()
    {
        $scope.loading = true;
        $scope.data = [];
        $scope.pagination = {current_page: 1};
        var $params = { site_id :$site.id , p : $scope.pagination.current_page};

        if ($scope.query){
            $params.q = encodeURIComponent( $scope.query );
        }

        Restangular.all('').customGET( $scope.template_data.api_object + '?view=admin&p=' + $params.p + '&site_id=' + $params.site_id + ( $scope.query ? '&q=' + $scope.query : '' ) ).then(function(data){
            $scope.pagination.total_count = data.total_count;

            $scope.data[ $scope.pagination.current_page ] = Restangular.restangularizeCollection( null, data.items, $scope.template_data.api_object );

            $scope.loading = false;
        } , function(error){
            $scope.data = [];
        })
    }



    $scope.delete = function (id) {
        var modalInstance = $modal.open({
            templateUrl: 'templates/modals/deleteConfirm.html',
            controller: "modalController",
            scope: $scope,
            resolve: {
                id: function () {
                    return id
                }
            }

        });
        modalInstance.result.then(function () {
            var itemWithId = _.find($scope.data[ $scope.pagination.current_page ], function (next_item) {
                return next_item.id === id;
            });

            itemWithId.remove().then(function () {
                $scope.data[ $scope.pagination.current_page ] = _.without($scope.data[ $scope.pagination.current_page ], itemWithId);
            });
        })
    };

	$scope.refreshHash=function($access)
	{
		var modalInstance = $modal.open({
		    templateUrl: 'templates/modals/hashUpdateConfirm.html',
		    controller: "modalController",
		    scope: $scope
		});

		modalInstance.result.then(function () {
			Restangular.service("accessLevel/refreshHash").post($access).then(function(response){

				for(var i=0;i<$scope.data[ $scope.pagination.current_page ].length;i++)
				{
					if($scope.data[ $scope.pagination.current_page ][i].id==response.id)
					{
                        $scope.data[ $scope.pagination.current_page ].splice(i,1,response);
					}
				}
                toastr.success("Product level hash updated!");
			});
		})
	}

	$scope.copied = function()
	{
        toastr.success("Link copied!");
	}
});


app.controller('AccessLevelController', function ($scope, $localStorage, $facebook_groups, $currency , Restangular,$access_level,toastr,$state) {
    $scope.default_currency = $currency.length > 0 ? $currency[0].value : 'USD';
	$scope.access_level = $access_level;

    $scope.payment_integrations = {stripe:[],paypal:[]};

    angular.forEach( $scope.site.integration, function(value,key){
        if( value.type == 'stripe' )
            $scope.payment_integrations.stripe.push( value );
        if( value.type == 'paypal' )
            $scope.payment_integrations.paypal.push( value );
    });

    if( $scope.access_level.expiration_period )
        $scope.access_level.expiration_period = parseInt( $scope.access_level.expiration_period );

    if( typeof $scope.access_level.currency == 'undefined' || $scope.access_level.currency == '' )
        $scope.access_level.currency = $scope.default_currency;

	$scope.facebook_groups = $facebook_groups;
	if (_.findWhere($scope.site.integration,{type: 'facebook'})){
		$scope.facebook_integrated = true;
	}
	if($scope.access_level.facebook_group_id)
		$scope.access_level.facebook_group_id = $scope.access_level.facebook_group_id.toString();
	console.log($scope.access_level.facebook_group_id) 
    var paypal = _.findWhere($scope.site.integration,{type: 'paypal'})
    var stripe = _.findWhere($scope.site.integration,{type: 'stripe'})

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
			for (var i = 0; i < $scope.access_levels.length; i++) {
				if($scope.access_levels[i].id == response.id){
					$scope.access_levels[i] = response;
				}
			};
            toastr.success("Product level updated!");
			$state.go("admin.site.membership.products");
		})
	}

	$scope.create = function(){
		Restangular.service("accessLevel").post($scope.access_level).then(function(response){
			$scope.access_levels.push(response);
            toastr.success("Product level created!");
			$state.go("admin.site.membership.products");
		});
	}

	$scope.exists = function(id){
		if (_.findWhere($scope.access_level.grants,{grant_id: id})){
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
	  	  if(item.type=='information_url')
	      	$scope.access_level.information_url = selected_url;

	      $scope.access_level.isOpen = false;

	  }
	  else if(selected_url == 'download'){
	    Restangular.all('').customGET('download',{site_id: item.site_id}).then(function(response){
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
	    Restangular.all(selected_url).customGET('',{site_id: item.site_id}).then(function(response){
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
});