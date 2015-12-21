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

app.controller("AffiliateController", function ($scope, $localStorage,$stateParams, $rootScope ,Restangular, toastr, $state , smModal) {
	$site = $rootScope.site;
	if ( $stateParams.id ) {
		Restangular.one('affiliate', $stateParams.id).get().then(function(response){
			$scope.affiliate = response;
			$scope.page_title = $scope.affiliate.id ? 'Edit Affiliate' : 'Create Affiliate';
		})
	}
	else{

		$scope.page_title = $scope.affiliate.id ? 'Edit Affiliate' : 'Create Affiliate';
		$scope.affiliate = {company_id: $site.company_id};
	}
	
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
	        smModal.Show("public.admin.team.jv.affiliates");
	        
	    });
	}

	$scope.create = function(){
	    $scope.affiliate.company_id=$site.company_id;
	    Restangular.service("affiliate").post($scope.affiliate).then(function(response){
	        toastr.success("Created!");
	        smModal.Show("public.admin.team.jv.affiliates");
	    });
	}
});