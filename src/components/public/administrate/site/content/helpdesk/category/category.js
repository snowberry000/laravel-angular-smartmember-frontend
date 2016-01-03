var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.administrate.site.content.helpdesk.category",{
			url: "/category/:id",
			templateUrl: "/templates/components/public/administrate/site/content/helpdesk/category/category.html",
			controller: "CategoryController"
		})
}); 

app.controller("CategoryController", function ($scope,$rootScope,smModal, $localStorage, $state, $stateParams, $filter, Restangular, toastr) {
	//$scope.page = $page;
	$scope.init=function(){
		if(!$category.id)
		{
			$category.company_id=$rootScope.site.company_id;
		}
		$site=$rootScope.site;
	    $scope.category = $category;
	    $scope.category.id ? $scope.page_title = 'Edit category' : $scope.page_title = 'Create category';
	}
	
	$site=$rootScope.site;
	$category=null;
    if($stateParams.id)
	    Restangular.one('supportCategory' , $stateParams.id).get().then(function(response){
	    	$category = response;
	    	$scope.init();
	    });
    else
    {
    	$category = {};
    	$scope.init();
    }
	    


	


    $scope.save = function(){
        if($scope.category.id){
            $scope.category.put();
            toastr.success("Support category edited successfully!");
            smModal.Show("public.administrate.site.content.helpdesk.categories");
        }
        else{
            Restangular.all('supportCategory').post($scope.category).then(function(response){
                toastr.success("Support category added successfully!");
                smModal.Show("public.administrate.site.content.helpdesk.categories");
            })
        }
    }
});