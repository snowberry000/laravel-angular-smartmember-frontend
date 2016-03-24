var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("admin.sign.unsubscribe",{
			url: "/unsubscribe",
			templateUrl: "/templates/components/admin/sign/unsubscribe/unsubscribe.html",
			controller: "unsubscribeController"
		})
}); 

app.controller('unsubscribeController', function ($location,notify,$state,$scope, $rootScope, $localStorage, Restangular, smModal) {

    if( $localStorage.unsubscribe_parameters ) {
        $rootScope.$_GET = $localStorage.unsubscribe_parameters;
        delete $localStorage.unsubscribe_parameters;
    }

    delete $localStorage.open_unsubscribe_modal;

    $scope.loading = true;

    var $params =  {'hash': $rootScope.$_GET['hash'],  'site_id': $rootScope.$_GET['network_id'], 'list_type': $rootScope.$_GET['list_type'], 'job_id': $rootScope.$_GET['job_id']};

    Restangular.one('emailSubscriber/getUnsubscribeInfo').get($params).then(function(response){

        if( response.site )
        {
            $scope.site = response.site;

            if( $scope.site.meta_data )
            {
                $scope.site.meta = {};

                angular.forEach( $scope.site.meta_data, function(value){
                    $scope.site.meta[ value.key ] = value.value;
                });
            }
        }

        if( response.subscriber )
        {
            $scope.subscriber = response.subscriber;
            $scope.email_address = $scope.subscriber.email;
        }

        if( response.email_lists )
        {
            $scope.emailLists = response.email_lists;

            for(var i=0;i < $scope.emailLists.length;i++)
            {
                $scope.emailLists[i].checked=false;
            }
        }

        $scope.loading = false;
    });

    $scope.hash = $rootScope.$_GET['hash'];
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

        $params = {"hash":$scope.hash, "job_id": $scope.job_id, "reason":$scope.reason,
                   "site_id":$scope.site_id, "list_type" : $scope.list_type, 'lists': $ids,
                   "email_address": $scope.email_address};

        Restangular.one('emailSubscriber').post('unsubscribe',$params).then(function(response){
            smModal.Show("admin.sign.unsubscribed");
        });
      }

});