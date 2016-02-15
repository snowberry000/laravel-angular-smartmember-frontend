var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.app.admin.jv.affiliate",{
			url: "/affiliate/:id?",
			templateUrl: "/templates/components/public/app/admin/jv/affiliate/affiliate.html",
			controller: "AffiliateController"
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
		$scope.affiliate = {company_id: $site.company_id};
		$scope.page_title = $scope.affiliate.id ? 'Edit Affiliate' : 'Create Affiliate';	
	}
	
	$scope.save = function(){
	    console.log($scope.affiliate);
	    if(!$scope.affiliate.user_id || !($scope.affiliate.user_id.toString().trim().length>0) ||isNaN($scope.affiliate.user_id.toString().trim()))
	    {
			    toastr.error("User ID cannot be empty or contain only spaces and must be a number.");
		}
		else if (!$scope.affiliate.affiliate_request_id || !($scope.affiliate.affiliate_request_id.toString().trim().length>0) || isNaN($scope.affiliate.affiliate_request_id.toString().trim()))
		{
			toastr.error("Request ID cannot be empty or contain only spaces and must be a number.");
		}
		else if(!$scope.affiliate.user_email)
		{
			toastr.error("Email is empty or invalid");
		}
		else{
			if ($scope.affiliate.id){
			        $scope.update();
			        return;
			    }
			    $scope.create();
		}

			
	}

	$scope.update = function(){
	    $scope.affiliate.put().then(function(response){
	        toastr.success("Changes saved!");
	        $state.go("public.app.admin.jv.affiliates");
	        // smModal.Show("public.app.admin.jv.affiliates");
	        
	    });
	}

	$scope.create = function(){
	    $scope.affiliate.company_id=$site.company_id;
	    Restangular.service("affiliate").post($scope.affiliate).then(function(response){
	        toastr.success("Created!");
	        $state.go("public.app.admin.jv.affiliates");
	        // smModal.Show("public.app.admin.jv.affiliates");
	    });
	}
});