var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("admin.team.email.lists",{
			url: "/lists",
			templateUrl: "/templates/components/admin/team/email/lists/lists.html",
			controller: "EmailListsController",
			resolve: {
				emailLists: function(Restangular , $site){
					return Restangular.all('emailList').getList();
				},
				$site: function(Restangular,$site){
					return $site;
				}
			}
		})
}); 

app.controller("EmailListsController", function ($scope, $localStorage,$site , $location,  $modal, Restangular, toastr) {

	$scope.blockCalls=false;
	$scope.processingCall=false;
	$scope.currentPage = 1;
	$scope.loading = true;

	Restangular.all('emailList').getList()
	    .then(function(response){
	        console.log(response);
	        $scope.emailLists = response;
	        $scope.loading = false;
	    })


	$scope.search = function()
	{
	    $scope.emailLists = [];
	    $scope.currentPage = 0;
	    var $params = { company_id: $site.company_id ,p : ++$scope.currentPage};
	    if ($scope.query){
	        $params.q = $scope.query;
	    }

	    Restangular.all('emailList').getList($params).then(function(data){
	        for (var i = data.length - 1; i >= 0; i--) {
	            var match = _.findWhere($scope.emailLists ,{id : data[i].id});
	            if(!match)
	                $scope.emailLists.push(data[i]);
	        };
	        if(data.length==0) {
	            $scope.emailLists = [];
	            $scope.blockCalls = true;
	        } else {
	            $scope.blockCalls=false;
	        }
	    } , function(error){
	        $scope.emailLists = [];
	    })
	}

	$scope.loadMore = function(){

	    if(!$scope.blockCalls && !$scope.processingCall)
	    {
	        $scope.processingCall=true;
	        var $params = {p:++$scope.currentPage , company_id :$site.company_id};
	        if ($scope.query) {
	            $params.q = $scope.query;
	        }

	        Restangular.all('emailList').getList($params).then(function (emailLists) {
	            $scope.emailLists = $scope.emailLists.concat(emailLists);
	            
	            if(emailLists.length == 0)
	                 $scope.blockCalls=true;

	            $scope.processingCall=false;
	        });
	    } else
	        return;
	}

	$scope.delete = function (emailListId) {
	    var modalInstance = $modal.open({
	        templateUrl: '/templates/modals/deleteConfirm.html',
	        controller: "modalController",
	        scope: $scope,
	        resolve: {
	            id: function () {
	                return emailListId
	            }
	        }

	    });
	    modalInstance.result.then(function () {
	        var emailListWithId = _.find($scope.emailLists, function (emailList) {
	            return emailList.id === emailListId;
	        });

	        emailListWithId.remove().then(function () {
	            $scope.emailLists = _.without($scope.emailLists, emailListWithId);
	        });
	    })
	};
});