var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.administrate.team.email.import",{
			url: "/import/:id?",
			templateUrl: "/templates/components/public/administrate/team/email/import/import.html",
			controller: "EmailISubscribermportController",
			resolve: {
				emailListId: function(Restangular, $stateParams, $site){
					return Restangular.one('emailList',$stateParams.id).get({list_type: 'user'});
				},
				emailLists: function(Restangular , $site){
					return Restangular.all('emailList').getList({list_type: 'user'});
				},
				$site: function($site){
					return $site;
				}

			}
		})
}); 

app.controller("EmailISubscribermportController", function ($scope,$q, $localStorage, $rootScope , smModal ,$stateParams , Restangular, toastr, $state) {
	
    $site = $rootScope.site;
    emailListId = Restangular.one('emailList',$stateParams.id).get({list_type: 'user'}).then(function(response){
        $scope.emailsubscriber = {email_lists:[]};
        $scope.emailsubscriber.email_lists.push(response);
    });
    emailLists = Restangular.all('emailList').getList({list_type: 'user'}).then(function(response){
        $scope.emailLists = response;
    })
   
    $q.all([emailLists , emailListId]).then(function(response){
        $scope.init();
    })
    
    $scope.emailSubscribers = [];
    $scope.init = function(){
        $scope.totalAdded+=1;
        if ($scope.emailsubscriber.email_lists) {
            $scope.emailsubscriber.lists = {};
            $.each($scope.emailsubscriber.email_lists, function(key, data) {
                $scope.emailsubscriber.lists[data.id] = true;
            });
        }
    }
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
            $scope.emailsubscriber = {company_id : $site.company_id};
            
        }
    }

    $scope.removeFromList = function($argSubs){
        console.log($argSubs);
        $scope.emailSubscribers = _.reject($scope.emailSubscribers, function($subs){ return $subs.name == $argSubs.name&&$subs.email == $argSubs.email; });
    }

    $scope.saveList= function()
    {
        $scope.redirect=false;
        $scope.sendIter=0;
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
            $scope.sendIter++;
            toastr.success("Changes Saved!");
            if($scope.sendIter==$scope.emailSubscribers.length-1)
            {
                smModal.Show("public.administrate.team.email.subscribers");
            }
        })
    }

    $scope.create = function($saveSubscriber){
        $saveSubscriber.company_id=$site.company_id;
       
        Restangular.service("emailSubscriber").post($saveSubscriber).then(function(response){
            if(response.total!=0)
            {
                $scope.totalAdded+=1;
            }
            $scope.sendIter++;
            if($scope.sendIter==$scope.emailSubscribers.length)
            {
                console.log("i am printing subscribers count "+$scope.sendIter);
                toastr.success($scope.totalAdded+" Subscribers Added!");
                smModal.Show("public.administrate.team.email.subscribers");
            }
        });
    }
});