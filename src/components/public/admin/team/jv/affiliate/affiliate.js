var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.admin.team.jv.affiliate",{
			url: "/affiliate/:id?",
			templateUrl: "/templates/components/public/admin/team/jv/affiliate/affiliate.html",
			controller: "AffiliateController",
			resolve: {
				affiliate: function(Restangular, $stateParams, $site) {
					if ( $stateParams.id ) {
						return Restangular.one('affiliate', $stateParams.id).get();
					}
					return {company_id: $site.company_id};
				}
			}
		})
}); 

app.controller("AffiliateController", function ($scope, $localStorage,$stateParams, $rootScope ,Restangular, toastr, $state) {
	$site = $rootScope.site;
	if ( $stateParams.id ) {
		Restangular.one('affiliate', $stateParams.id).get().then(function(response){
			$scope.affiliate = response;
		})
	}
	else
		$scope.affiliate = {company_id: $site.company_id};
	
	$scope.page_title = $scope.affiliate.id ? 'Edit Affiliate' : 'Create Affiliate';
	$scope.save = function(){
	    console.log($scope.affiliate);
	    if ($scope.affiliate.id){
	        $scope.update();
	        return;
	    }
	    $scope.create();
	}

	$scope.update = function(){
	    $scope.affiliate.put().then(function(response){
	        toastr.success("Changes saved!");
	        $state.go("public.admin.team.jv.affiliates");
	        
	    });
	}

	$scope.create = function(){
	    $scope.affiliate.company_id=$site.company_id;
	    Restangular.service("affiliate").post($scope.affiliate).then(function(response){
	        toastr.success("Created!");
	        $state.go("public.admin.team.jv.affiliates");
	    });
	}
});