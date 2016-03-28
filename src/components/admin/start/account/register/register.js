var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("admin.start.account.register",{
			url: "/register",
			templateUrl: "/templates/components/admin/start/account/register/register.html",
			controller: "StartAccountRegisterController"
		})
}); 

app.controller("StartAccountRegisterController", function ($scope , Start, RestangularV3 , $rootScope , $localStorage , $location , ipCookie) {
	$rootScope.step1 = '';
	$rootScope.step2 = '';
	$rootScope.step3 = 'active';

	$scope.page_title = 'Start on the Smart Member platform for free';
	$scope.email = $location.search().email;
	Start.validate($scope.email);

	$scope.register = function(){
		$scope.loading = true;
		RestangularV3.all('auth').customPOST({user : $rootScope.new_user , company : $rootScope.new_user_company} , 'updateuser').then(function(response){
			$scope.loading = false;
			$localStorage.user = response;
			$localStorage.user.id = response._id;
			ipCookie( 'user', JSON.stringify( $localStorage.user ), { 'domain': $scope.app.domain, 'path': '/' } );
			$location.path('/members/');
		});
	}
});