var app=angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("admin.app.select-site",{
			url: "/select-site",
			templateUrl: "/templates/components/admin/app/select-site/select-site.html",
			controller: "SelectSiteController"
		})
}); 

app.controller("SelectSiteController", function($scope, RestangularV3, $rootScope, $stateParams, $state, $localStorage, smModal) {

	$scope.user = $rootScope.user;

	$scope.init =function(){
		$scope.companies = [];
		RestangularV3.all('').customGET('user/companies').then(function(response){
			$scope.companies = response;
		});
	}

	$scope.init();

	$scope.openSite = function(site_id) {
		RestangularV3.all('auth').customPOST({company_id : site_id}, 'company').then( function( response ){
			smModal.Close('admin.app.select-site');
			$localStorage.user.company_id = site_id;
			// $state.go( 'admin.app', {}, {reload:true});
			$state.transitionTo('admin.app.inbox', {}, { reload: true, inherit: true, notify: true });
		});
	}
});