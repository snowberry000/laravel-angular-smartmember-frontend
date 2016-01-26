var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.app.admin.email.lists",{
			url: "/lists",
			templateUrl: "/templates/components/public/app/admin/email/lists/lists.html",
			controller: "EmailListsController",
		})
}); 

app.controller("EmailListsController", function ($scope, $localStorage,$rootScope , $location,   Restangular, toastr) {

	$scope.blockCalls=false;
	$scope.processingCall=false;
	$scope.currentPage = 1;
	$scope.loading = true;
	$site=$rootScope.site;

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

	$scope.paginate = function()
	{
			$scope.loading = true;

			var $params = { p: $scope.pagination.current_page, site_id: $site.id };

			if( $scope.query )
			{
				$params.q = encodeURIComponent( $scope.query );
			}

			Restangular.all( '' ).customGET('emailList' + '?p=' + $params.p + ( $scope.query ? '&q=' + encodeURIComponent( $scope.query ) : '' ) ).then( function( data )
			{
				$scope.loading = false;
				$scope.pagination.total_count = data.total_count;
				$scope.emailLists = Restangular.restangularizeCollection( null, data.items, 'emailList' );
			} );
	}
	$scope.paginate();
	// Restangular.all('emailList').getList()
	//     .then(function(response){
	//         console.log(response);
	//         $scope.emailLists = response.items;
	//         $scope.loading = false;
	//     })


	$scope.search = function()
	{
	    $scope.emailLists = [];
	    $scope.currentPage = 0;
	    var $params = { company_id: $site.company_id ,p : ++$scope.currentPage};
	    if ($scope.query){
	        $params.q = $scope.query;
	    }

	    Restangular.all('emailList').getList($params).then(function(data){
	        for (var i = data.length - 1; i >= 0; i--) {
	            var match = _.findWhere($scope.emailLists ,{id : data[i].id});
	            if(!match)
	                $scope.emailLists.push(data[i]);
	        };
	        if(data.length==0) {
	            $scope.emailLists = [];
	            $scope.blockCalls = true;
	        } else {
	            $scope.blockCalls=false;
	        }
	    } , function(error){
	        $scope.emailLists = [];
	    })
	}


	$scope.deleteResource = function (emailListId) {
        var emailListWithId = _.find($scope.emailLists, function (emailList) {
            return emailList.id === parseInt(emailListId);
        });

        emailListWithId.remove().then(function () {
            $scope.emailLists = _.without($scope.emailLists, emailListWithId);
        });
	};
});