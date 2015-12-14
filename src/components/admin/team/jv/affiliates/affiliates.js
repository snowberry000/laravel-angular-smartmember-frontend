var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("admin.team.jv.affiliates",{
			url: "/affiliates",
			templateUrl: "/templates/components/admin/team/jv/affiliates/affiliates.html",
			controller: "AffiliatesController"
		})
}); 

app.controller("AffiliatesController", function ($scope, $localStorage, $modal, $site ,Restangular) {

	$scope.template_data = {
	    title: 'AFFILIATES',
	    description: 'These are your "external promoters" - the people selling your Product(s).',
	    singular: 'affiliate',
	    edit_route: 'admin.team.jv.affiliate',
	    api_object: 'affiliate'
	}

	$scope.data = [];
	$scope.pagination = {current_page: 1};
	$scope.pagination.total_count = 1;

	$scope.paginate = function(){

	    if( typeof $scope.data[ $scope.pagination.current_page] != 'object' ) {

	        $scope.loading = true;

	        var $params = {p: $scope.pagination.current_page};

	        if ($scope.query) {
	            $params.q = encodeURIComponent( $scope.query );
	        }

	        Restangular.all('').customGET( $scope.template_data.api_object + '?view=admin&p=' + $params.p + ( $scope.query ? '&q=' + encodeURIComponent( $scope.query ) : '' )).then(function (data) {
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
	    var $params = { p : $scope.pagination.current_page};

	    if ($scope.query){
	        $params.q = encodeURIComponent( $scope.query );
	    }

	    Restangular.all('').customGET( $scope.template_data.api_object + '?p=' + $params.p + ( $scope.query ? '&q=' + encodeURIComponent( $scope.query ) : '' ) ).then(function(data){
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
});