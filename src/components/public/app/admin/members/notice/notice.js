var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.app.admin.members.notice",{
			url: "/notice/:id?",
			templateUrl: "/templates/components/public/app/admin/members/notice/notice.html",
			controller: "NoticeController"
		})
}); 

app.controller("NoticeController", function ($scope,$rootScope,$stateParams,$state,smModal, $location ,$localStorage ,  Restangular, toastr, Upload) {
	
	$scope.page_title = "Create Site Notice";
	$scope.init = function(){

		if (!Modernizr.inputtypes.date) {
          // no native support for <input type="date"> :(
          // maybe build one yourself with Dojo or jQueryUI
          $('input[type="date"]').datepicker();
          $('input[type="date"]' ).datepicker( "option", "dateFormat", 'yy-mm-dd' );
        }


		if($notification.id || $location.search().clone)
		{
		    $scope.site_notice = $notification;
		    $scope.site_notice.sdate = new Date(moment.utc($scope.site_notice.start_date));
		    $scope.site_notice.edate = new Date(moment.utc($scope.site_notice.end_date));
		}
		else
		{
		    $scope.site_notice={};
		    $scope.site_notice.on=false;
		    $scope.site_notice.sdate = new Date(moment().add(1,'days'));
		    $scope.site_notice.edate = new Date(moment().add(2,'days'));
		}
	}
	
	$notification=null;
	$site=$rootScope.site;

	if( $stateParams.id )
	{
		Restangular.one( 'siteNotice', $stateParams.id ).get().then(function(response){
			$notification=response;
			$scope.init();
		});
	}
	else if( $location.search().clone )
	{
		Restangular.one( 'siteNotice', $location.search().clone ).get().then(function(response){
			$notification=response;
			delete $notification.id;
			delete $notification.created_at;
			delete $notification.deleted_at;
			delete $notification.updated_at;
			delete $notification.type;
			$scope.init();
		});
	}
	else
	{
		$notification = { site_id: $site.id };
		$scope.init();
	}

	

	
	
	
	

	$scope.save = function () {
	    $scope.site_notice.start_date=$scope.site_notice.sdate;
	    $scope.site_notice.end_date=$scope.site_notice.edate;

	    $date=moment(Date.now());
	    $startdate=moment.utc($scope.site_notice.start_date);
	    $enddate=moment.utc($scope.site_notice.end_date);

	    if($date.isBetween(moment.utc($scope.site_notice.start_date),moment.utc($scope.site_notice.end_date)))
	    {
	        $scope.site_notice.on=true;
	    }

	    
	    
	    if($scope.site_notice.title && $scope.site_notice.title.trim().length>0 && $scope.site_notice.content)
	    {

	    delete $scope.site_notice.sdate;
	    delete $scope.site_notice.edate;

	    if ($scope.site_notice.id) {
	        $scope.site_notice.put().then(function(response){
	        	toastr.success("Site notice has been saved");
	        	$state.go('public.app.admin.members.notices')
	        })
	    }
	    else {
	        Restangular.all('siteNotice').post($scope.site_notice).then(function (site_notice) {
	            $scope.site_notice = site_notice;
	            toastr.success("Site notice has been saved");
	            $state.go('public.app.admin.members.notices')
	        });
	    	}
		}//
		else
			toastr.error("Note not saved. 'Title' or 'Content' cannot be empty or contain only spaces");
	    
	}

});