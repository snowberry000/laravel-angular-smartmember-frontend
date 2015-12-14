var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("admin.team.jv.affiliate",{
			url: "/affiliate/:id?",
			templateUrl: "/templates/components/admin/team/jv/affiliate/affiliate.html",
			controller: "AffiliateController",
			resolve: {
				affiliate: function(Restangular, $stateParams, $site) {
					if ( $stateParams.id ) {
						return Restangular.one('affiliate', $stateParams.id).get();
					}
					return {company_id: $site.company_id};
				},
				$site: function($site) {
					return $site;
				}

			}
		})
}); 

app.controller("AffiliateController", function ($scope, $localStorage, Restangular, toastr, $state, affiliate,$site) {
	$scope.affiliate = affiliate;
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
	        $state.go("admin.team.jv.affiliates");
	        
	    });
	}

	$scope.create = function(){
	    $scope.affiliate.company_id=$site.company_id;
	    Restangular.service("affiliate").post($scope.affiliate).then(function(response){
	        toastr.success("Created!");
	        $state.go("admin.team.jv.affiliates");
	    });
	}
});