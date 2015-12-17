var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.admin.site.membership.pass",{
			url: "/pass/:id?",
			templateUrl: "/templates/components/public/admin/site/membership/pass/pass.html",
			controller: "PassController",
			resolve: {
				$access_pass: function( Restangular, $stateParams, $site)
				{
					if( $stateParams.id )
					{
						return Restangular.one( 'pass', $stateParams.id ).get();
					}
					return { site_id: $site.id };
				},
				roles: function( Restangular, $site )
				{
					return Restangular.all( 'role' ).customGET('', { site_id: $site.id } );
				}
			}
		})
}); 

app.controller("PassController", function ($scope, $rootScope , $localStorage, Restangular, $access_pass, roles, toastr, $state) {
		if(!$access_pass.id){
			$access_pass.site_id = $rootScope.site.id;
		}
		$scope.access_pass = $access_pass;

	    $scope.select2 = function() {
	        $('[name=user_id]').select2();
	    }

		$scope.page_title = $scope.access_pass.id ? 'Edit Pass' : 'Grant New Pass';
		if($scope.access_pass.id)
			$scope.access_pass.expired_at = moment($scope.access_pass.expired_at).toDate();
		$scope.roles = roles.items;
		$scope.dateOptions = {
	        changeYear: true,
	        formatYear: 'yy',
	        startingDay: 1
	    }

	    $scope.format = 'yyyy-MM-dd';
	    $scope.minDate = new Date();

	    $scope.status = {
	        opened: false
	    };

	     $scope.open = function(event) {
	        $scope.status.opened = true;
	    }

		$scope.save = function(){
			if ($scope.access_pass.id){
				$scope.update();
				$state.go("public.admin.site.membership.passes");

			}else{
	            $scope.create();
	        }
		}

		$scope.update = function(){
			$scope.access_pass.put().then(function(response){
	            toastr.success("Changes saved!");
			})
		}

		$scope.create = function(){
			Restangular.service("pass").post($scope.access_pass).then(function(response){
	            toastr.success("Access pass created!");
				$state.go("public.admin.site.membership.passes");
			});
		}
});