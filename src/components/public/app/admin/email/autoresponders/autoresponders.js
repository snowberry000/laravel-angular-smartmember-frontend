var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.app.admin.email.autoresponders",{
			url: "/autoresponders",
			templateUrl: "/templates/components/public/app/admin/email/autoresponders/autoresponders.html",
			controller: "AutorespondersController"
		})
}); 

app.controller("AutorespondersController", function ($scope,smModal,$filter, $localStorage,  Restangular, notify) {
	
	$scope.template_data = {
	    title: 'AUTORESPONDERS',
	    description: 'Autoresponders let you queue up emails to send to subscribers day by day, week by week on a scheduled basis starting for each subscriber uniquely based on their subscribe date.',
	    singular: 'autoresponder',
	    edit_route: 'public.app.admin.email.autoresponder',
	    api_object: 'emailAutoResponder'
	}

	$scope.data = [];
	$scope.pagination = {
		current_page: 1,
		per_page: 25,
		total_count: 0
	};

	$scope.$watch( 'pagination.current_page', function( new_value, old_value )
	{
		if( new_value != old_value )
		{
			$scope.paginate();
		}
	} );

	$scope.paginate = function(){

	    if( true ) {

	        $scope.loading = true;

	        var $params = {p: $scope.pagination.current_page};

	        if ($scope.query) {
	            $params.q = encodeURIComponent( $scope.query );
	        }

	        Restangular.all('').customGET( $scope.template_data.api_object + '?view=admin&p=' + $params.p + ( $scope.query ? '&q=' + encodeURIComponent( $scope.query ) : '' )).then(function (data) {
	            $scope.loading = false;
	            $scope.pagination.total_count = data.total_count;
	            $scope.data = Restangular.restangularizeCollection( null, data.items, $scope.template_data.api_object );
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

	        $scope.data = Restangular.restangularizeCollection( null, data.items, $scope.template_data.api_object );

	        $scope.loading = false;
	    } , function(error){
	        $scope.data = [];
	    })
	}

	$scope.deleteResource = function (id) {

        var itemWithId = _.find($scope.data, function (next_item) {
            return next_item.id === parseInt(id);
        });

        itemWithId.remove().then(function () {
            $scope.data = _.without($scope.data, itemWithId);
        });
	};
});