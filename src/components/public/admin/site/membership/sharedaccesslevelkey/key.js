var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.admin.site.membership.sharedaccesslevelkey",{
			url: "/sharekey/:id?",
			templateUrl: "/templates/components/public/admin/site/membership/sharedaccesslevelkey/key.html",
			controller: "ShareAccessLevelKeyController"
		})
}); 

app.controller("ShareAccessLevelKeyController", function ($scope, $q, $stateParams,smModal, $localStorage, $rootScope,  Restangular,toastr,$state) {
	
	$site = $rootScope.site;

	$scope.resolve = function(){
		if( $stateParams.id )
		{
			$keyRequest = Restangular.one( 'accessLevelShareKey', $stateParams.id ).get().then(function(response){
				$scope.key = response;
			}); 
		}
		else
		{
			$scope.key = { destination_id: $site.id };
		}
	}

	$scope.save = function(){
		if ($scope.key.id){
			$scope.update();
			return;
		}
		$scope.create();
	}


	$scope.update = function(){
		$scope.key.put().then(function(response){
			// for (var i = 0; i < $scope.access_levels.length; i++) {
			// 	if($scope.access_levels[i].id == response.id){
			// 		$scope.access_levels[i] = response;
			// 	}
			// };
            toastr.success("Key is updated!");
			smModal.Show("public.admin.site.membership.sharedaccesslevelkeys");
		})
	}

	$scope.create = function(){
		Restangular.all('accessLevelShareKey').post($scope.key).then(function(response){
			//$scope.access_levels.push(response);
            toastr.success("Your site has been associated with this new key");
            smModal.Show("public.admin.site.membership.sharedaccesslevelkeys");
		});
	}

	$scope.resolve();
});