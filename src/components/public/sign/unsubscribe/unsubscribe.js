var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.sign.unsubscribe",{
			url: "/unsubscribe",
			templateUrl: "/templates/components/public/sign/unsubscribe/unsubscribe.html",
			controller: "unsubscribeController"
		})
}); 

app.controller('unsubscribeController', function ($location,notify,$state,$scope, $rootScope, $localStorage, Restangular, smModal) {

    if( $localStorage.unsubscribe_parameters ) {
        $rootScope.$_GET = $localStorage.unsubscribe_parameters;
        delete $localStorage.unsubscribe_parameters;
    }

    $scope.email = $rootScope.$_GET['hash'];
    $scope.site_id = $rootScope.$_GET['network_id'];
    $scope.job_id = $rootScope.$_GET['job_id'];
    $scope.list_type = $rootScope.$_GET['list_type'];
    $rootScope.is_admin=true;
    $scope.emailLists=[];
    $scope.reason="";


      $scope.unsubscribe = function()
      {
        $ids=[];
        for(var i=0;i<$scope.emailLists.length;i++)
        {
          if($scope.emailLists[i].checked)
            $ids.push({"id":$scope.emailLists[i].id});
        }

        $params = {"hash":$scope.email, "job_id": $scope.job_id, "reason":$scope.reason,
                   "site_id":$scope.site_id, "list_type" : $scope.list_type};

        Restangular.one('emailSubscriber').post('unsubscribe',$params).then(function(response){
            smModal.Show("public.sign.unsubscribed");
        });
      }

});