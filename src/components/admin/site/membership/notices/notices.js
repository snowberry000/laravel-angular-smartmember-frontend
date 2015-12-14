var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("admin.site.membership.notices",{
			url: "/notices",
			templateUrl: "/templates/components/admin/site/membership/notices/notices.html",
			controller: "NoticesController"
		})
}); 

app.controller("NoticesController", function ($scope,$state, $localStorage, $site , $modal, Restangular, toastr) {
	$scope.template_data = {
	    title: 'SITE NOTICES',
	    description: 'toastr your members of new things',
	    singular: 'site notice',
	    edit_route: 'admin.site.membership.notice',
	    api_object: 'siteNotice'
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

	        Restangular.all('').customGET( $scope.template_data.api_object + '?view=admin&p=' + $params.p + '&site_id=' + $params.site_id + ( $scope.query ? '&q=' + encodeURIComponent( $scope.query ) : '' )).then(function (data) {
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

	    Restangular.all('').customGET( $scope.template_data.api_object + '?p=' + $params.p + '&site_id=' + $params.site_id + ( $scope.query ? '&q=' + encodeURIComponent( $scope.query ) : '' ) ).then(function(data){
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