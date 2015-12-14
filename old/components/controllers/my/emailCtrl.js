app.controller('unsubscribedController', function ($location,notify,$scope, $rootScope, $localStorage, Restangular) {
$rootScope.is_admin=true;
});

app.controller('unsubscribeController', function ($location,notify,$state,$scope, $rootScope, $localStorage, Restangular) {
  
  $scope.email=$location.search().hash;
    $scope.company_id = $location.search().network_id;
  $scope.job_id = $location.search().job_id;
  $scope.list_type = $location.search().list_type;
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

app.controller('SmartMailParentController', function ($scope, $rootScope , $localStorage,$state, $modal, Restangular, notify) {
    if($rootScope.is_not_allowed){
        $state.go('admin.team.dashboard');
        return false;
    }
});