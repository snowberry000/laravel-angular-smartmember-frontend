var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.sign.unsubscribe",{
			url: "/unsubscribe",
			templateUrl: "/templates/components/public/sign/unsubscribe/unsubscribe.html",
			controller: "unsubscribeController"
		})
}); 

app.controller('unsubscribeController', function ($location,notify,$state,$scope, $rootScope, $localStorage, Restangular) {

    if( $localStorage.unsubscribe_parameters ) {
        $rootScope.$_GET = $localStorage.unsubscribe_parameters;
        delete $localStorage.unsubscribe_parameters;
    }

    $scope.email = $rootScope.$_GET['hash'];
    $scope.company_id = $rootScope.$_GET['network_id'];
    $scope.job_id = $rootScope.$_GET['job_id'];
    $scope.list_type = $rootScope.$_GET['list_type'];
    $rootScope.is_admin=true;
    $scope.emailLists=[];
    $scope.reason="";

  var $params =  {'hash':$scope.email,  'company_id':$scope.company_id, 'list_type':$scope.list_type};

  Restangular.one('emailSubscriber/getEmailLists').get($params).then(function(response){
      for(var i=0;i<response.length;i++)
      {
        response[i].checked=false;
      }
      $scope.company_name=response.company_name;
      $scope.emailLists=response.data;
  });


  $scope.unsubscribe = function()
  { 
    $ids=[];
    for(var i=0;i<$scope.emailLists.length;i++)
    {
      if($scope.emailLists[i].checked)
        $ids.push({"id":$scope.emailLists[i].id});
    }
    
    $params = {'ids':$ids, "hash":$scope.email, "job_id": $scope.job_id, "reason":$scope.reason,
               "company_id":$scope.company_id, "list_type" : $scope.list_type};

    Restangular.one('emailSubscriber').post('unsubscribe',$params).then(function(response){
      $state.go("public.sign.unsubscribed");
    });
  }

});