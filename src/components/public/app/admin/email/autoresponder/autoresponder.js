var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.app.admin.email.autoresponder",{
			url: "/autoresponder/:id",
			templateUrl: "/templates/components/public/app/admin/email/autoresponder/autoresponder.html",
			controller: "AutoresponderController"
		})
}); 

app.controller("AutoresponderController", function ($filter,smModal,$scope,$rootScope, $q ,$localStorage, Restangular,toastr,notify, $state, $stateParams) {
	
	$site = $rootScope.site;
	$scope.email_when_types = [
		{ id: 3, name: 'When someone subscribes to your email list' },
		{ id: 1, name: 'When someone becomes your member' },
		{ id: 2, name: 'When someone buys your product' },
	];
	$emails = Restangular.all('').customGET('email?bypass_paging=true').then(function(response){
		$scope.emails = response.items;
	});

	$siteLists = Restangular.all('').customGET('user/sites?role=owner').then(function(response) {
		$scope.siteLists = response;
	});

	$emailLists = Restangular.all('').customGET('emailList?bypass_paging=true').then(function(response){
		$scope.emailLists = response.items;
	});

	$access_levels = Restangular.all( '' ).customGET( 'accessLevel' + '?view=admin&bypass_paging=1&site_id=' + $site.id ).then( function( data )
	{
		$scope.access_levels = data.items;
	});

	// $emails = Restangular.all('email').getList().then(function(response){$scope.emails = response});
	// $emailLists = Restangular.all('emailList').getList().then(function(response){$scope.emailLists = response});
	$autoResponder=null;
	if ($stateParams.id){
		$autoResponder = Restangular.one('emailAutoResponder', $stateParams.id).get().then(function(response){
			$scope.autoResponder = response;
		});
	}else{
		$scope.autoResponder = {company_id: $site.company_id};
	}
	$scope.loading = true;
	$q.all([$emails , $emailLists , $autoResponder, $siteLists, $access_levels]).then(function(res){
		$scope.loading = false;
		if (!$scope.autoResponder.id){
		    $scope.autoResponder.emails = [];
		}
		else
		{
		    $scope.tempAutoResponder={company_id:$site.company_id,emails:[],lists:{}};
		    for(var i=0;i<$scope.autoResponder.emails.length;i++)
		    {
		        $scope.tempAutoResponder.emails.push({email_id:$scope.autoResponder.emails[i].id, subject:$scope.autoResponder.emails[i].subject, delay:$scope.autoResponder.emails[i].pivot.delay, unit:$scope.autoResponder.emails[i].pivot.unit,sort_order:$scope.autoResponder.emails[i].pivot.sort_order});
		    }
		    for(var i=0;i<$scope.autoResponder.email_lists.length;i++)
		    {
		        $scope.tempAutoResponder.lists[$scope.autoResponder.email_lists[i].id]=true;
		    }
		    delete $scope.autoResponder.emails;
		    $scope.autoResponder.emails=$scope.tempAutoResponder.emails;
		    $scope.autoResponder.lists=$scope.tempAutoResponder.lists;
		    delete $scope.autoResponder.email_lists;
		    $scope.autoResponder.emails=$filter('orderBy')($scope.autoResponder.emails, 'sort_order');
		}
		console.log('autoresponder emails series', $scope.autoResponder.emails);
	})

	$scope.emailId = false;
	
	$scope.addEmail = function() {
	    if (!$scope.emailId) return;

	    var email = _.find($scope.emails, function(email) {
	        return email.id == $scope.emailId;
	    });
	    
	    var alreadyAdded = _.find($scope.autoResponder.emails, function(autoEmail) {
	        return email.id == autoEmail.email_id;
	    });

	    // var alreadyAdded = _.findWhere(autoResponder.emails, {email_id : email.id});

	    if ( !alreadyAdded ) {
	        if( $scope.autoResponder.emails.length > 0 )
	            $scope.autoResponder.emails.push({email_id:email.id, subject:email.subject, delay:1, unit:2});
	        else
	            $scope.autoResponder.emails.push({email_id:email.id, subject:email.subject, delay:0, unit:1});
	    }
		console.log($scope.autoResponder.emails);
	}

	$scope.removeEmail = function(email_id) {
	    var email = _.find($scope.autoResponder.emails, {email_id: email_id});
	    $scope.autoResponder.emails = _.without( $scope.autoResponder.emails, email );
	}

	$scope.dragControlListeners = {
	    accept: function (sourceItemHandleScope, destSortableScope){
	        return true;
	    },
	    itemMoved: function ($event) {console.log("moved");},//Do what you want},
	    orderChanged: function($event) {console.log("orderchange");},//Do what you want},
	    
	    dragEnd: function ($event) {
	        $(window).off();
	    },
	    containment: '#board'//optional param.
	};

	$scope.range = function(min, max, step){
	    step = step || 1;
	    var input = [];
	    for (var i = min; i <= max; i += step) input.push(i);
	    return input;
	};

	$scope.exists = function(id, type){
		switch (type) {
			case 'el':
				if ($scope.autoResponder.lists != undefined)
				{
					if (_.findWhere($scope.autoResponder.lists,{id: id})){
						return true;
					}
				}

				break;
			case 'sl':
				if ($scope.autoResponder.sites != undefined)
				{
					if (_.findWhere($scope.autoResponder.sites,{id: id})){
						return true;
					}
				}

				break;
			case 'al':
				if ($scope.autoResponder.access_levels != undefined)
				{
					if (_.findWhere($scope.autoResponder.access_levels,{id: id})){
						return true;
					}
				}
				break;
		}

	}


	$scope.save = function(){
	    
	console.log($scope.autoResponder);
	$scope.autoResponder.emails=[];
	$.each($(".ui.modals.active .email_item"), function (key, email) {
	        $tempEmail=$(email).data("component");
	        $tempEmail.sort_order=key;
	        $scope.autoResponder.emails.push($tempEmail);
	    });
	    if ($scope.autoResponder.id){
	        $scope.update();
	        return;
	    }
	    $scope.create();
	}

	$scope.update = function(){
	    $scope.autoResponder.put().then(function(response){
	        toastr.success("Changes Saved!");
	        $state.go("public.app.admin.email.autoresponders");
	        //$state.go("public.administrate.team.email.autoresponders");
	    })
	}

	$scope.create = function(){
		$scope.autoResponder.company_id=$rootScope.site.company_id;
	    Restangular.service("emailAutoResponder").post($scope.autoResponder).then(function(response){
	        // notify({
	        //         message:"Auto Responder created!",
	        //         classes: 'alert-success',
	        //         templateUrl : 'templates/modals/notifyTemplate.html'
	        //     });
	        toastr.success("Auto Responder created!");
	        $state.go("public.app.admin.email.autoresponders");
	       // $state.go("public.administrate.team.email.autoresponders");
	    });
	}
});