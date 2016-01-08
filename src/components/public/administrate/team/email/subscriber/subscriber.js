var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.administrate.team.email.subscriber",{
			url: "/subscriber/:id?",
			templateUrl: "/templates/components/public/administrate/team/email/subscriber/subscriber.html",
			controller: "EmailSubscriberController"
		})
}); 

app.controller("EmailSubscriberController", function ($scope,$q, smModal,$localStorage,$rootScope, $stateParams ,Restangular, toastr, $state) {
	
	$site = $rootScope.site;
	if ($stateParams.id){
		$emailSubscriber = Restangular.one('emailSubscriber', $stateParams.id).get().then(function(response){$scope.emailsubscriber = response})
	}else{
		$scope.emailsubscriber = {company_id: $site.company_id};
	}
	//$emailLists = Restangular.all('emailList').getList({list_type: 'user', 'bypass_paging': 'true'}).then(function(response){$scope.emailLists = response;})
	
	$emailLists=Restangular.all( '' ).customGET('emailList?bypass_paging=true').then( function( data )
	{
		$scope.emailLists  = Restangular.restangularizeCollection( null, data.items, 'emailList');
	} );

	$scope.emailSubscribers = [];
	$dependencies = [$emailLists];
	if($stateParams.id){
		$dependencies.push($emailLists);
	}
	$q.all($dependencies).then(function(res){
		if ($scope.emailsubscriber.email_lists) {
		    $scope.emailsubscriber.lists = {};
		    $.each($scope.emailsubscriber.email_lists, function(key, data) {
		        $scope.emailsubscriber.lists[data.id] = true;
		    });
		}
	})
	console.log($scope.emailsubscriber);

	

	$scope.addInSubscribersList = function(){
	    var $name_emailArr=[];
	    var $name="";
	    $scope.totalAdded=0;
	    if($scope.emailsubscriber.email!=''&&$scope.emailsubscriber.email!=null)
	    {
	        $name=$scope.emailsubscriber.name;
	        $emailArr = $scope.emailsubscriber.email.split("\n");
	        for(var i=0;i<$emailArr.length;i++)
	        {
	            $name_emailArr=$emailArr[i].split(";");
	            if($name_emailArr.length>1)
	            {
	                if(_.isEmpty($scope.emailsubscriber.lists))
	                    return;
	                $scope.emailsubscriber.email="";
	                $scope.emailsubscriber.email=$name_emailArr[1];
	                $scope.emailsubscriber.name=$name_emailArr[0];
	                $obj=angular.copy($scope.emailsubscriber);
	                $scope.emailSubscribers[$scope.emailSubscribers.length] = $obj;
	            }
	            else
	            {
	                if(_.isEmpty($scope.emailsubscriber.lists))
	                    return;
	                $scope.emailsubscriber.email="";
	                $scope.emailsubscriber.name=$name;
	                $scope.emailsubscriber.email=$name_emailArr[0];
	                $obj=angular.copy($scope.emailsubscriber);
	                $scope.emailSubscribers[$scope.emailSubscribers.length] = $obj;
	            }
	        }
	        $scope.emailsubscriber = {company_id : $scope.emailsubscriber.company_id};
	        
	    }
	}

	$scope.removeFromList = function($argSubs){
	    console.log($argSubs);
	    $scope.emailSubscribers = _.reject($scope.emailSubscribers, function($subs){ return $subs.name == $argSubs.name&&$subs.email == $argSubs.email; });
	}

	$scope.saveList= function()
	{
	    $scope.sendIter=0;
	    $scope.redirect=false;
	    for(var i=0;i<$scope.emailSubscribers.length;i++)
	    {
	        if(i==($scope.emailSubscribers.length-1))
	            $scope.redirect=true;
	        $scope.save($scope.emailSubscribers[i]);
	    }
	}

	$scope.save = function($saveSubscriber){
	    if ($saveSubscriber.id){
	        $scope.update($saveSubscriber);
	        return;
	    }
	    $scope.create($saveSubscriber);
	    
	}

	$scope.update = function($saveSubscriber){
	    $saveSubscriber.company_id=$site.company_id;
	    $saveSubscriber.put().then(function(response){
	        toastr.success("Changes Saved!");
	        $scope.sendIter++;
	        if($scope.redirect)
	        	smModal.Show("public.administrate.team.email.subscribers");
	    })
	}

	$scope.create = function($saveSubscriber){
	    $saveSubscriber.company_id=$site.company_id;
	   
	    Restangular.service("emailSubscriber").post($saveSubscriber).then(function(response){
	        $scope.sendIter++;
	        if(response.total!=0)
	            $scope.totalAdded+=1;
	        if($scope.sendIter==$scope.emailSubscribers.length)
	        {
	            console.log("i am printing subscribers count "+$scope.sendIter);
	            toastr.success($scope.totalAdded+" Subscribers Added!");
	            smModal.Show("public.administrate.team.email.subscribers");
	        }
	    });
	}
});