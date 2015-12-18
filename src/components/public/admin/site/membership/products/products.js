var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.admin.site.membership.products",{
			url: "/products",
			templateUrl: "/templates/components/public/admin/site/membership/products/products.html",
			controller: "ProductsController"
		})
}); 

app.controller("ProductsController", function ($scope, $localStorage, $rootScope ,  Restangular,$site, toastr) {
		
		$scope.site = $site = $rootScope.site;
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
	        edit_route: 'public.admin.site.membership.product',
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