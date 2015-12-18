var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.admin.site.membership.notice",{
			url: "/notice/:id?",
			templateUrl: "/templates/components/public/admin/site/membership/notice/notice.html",
			controller: "NoticeController",
			resolve: {
				$notification: function( Restangular, $stateParams, $site )
				{
					if( $stateParams.id )
					{
						return Restangular.one( 'siteNotice', $stateParams.id ).get();
					}
					return { site_id: $site.id };
				}
			}
		})
}); 

app.controller("NoticeController", function ($scope,$state, $localStorage, $notification ,  Restangular, toastr, Upload) {
	if($notification.id)
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

	    
	    delete $scope.site_notice.sdate;
	    delete $scope.site_notice.edate;

	    if ($scope.site_notice.id) {
	        $scope.site_notice.put();
	        toastr.success("Site notice has been saved");
	        $state.go('public.admin.site.membership.notices');
	    }
	    else {
	        Restangular.all('siteNotice').post($scope.site_notice).then(function (site_notice) {
	            $scope.site_notice = site_notice;
	            toastr.success("Site notice has been saved");
	            $state.go('public.admin.site.membership.notices');
	        });
	    }
	    
	}

	$scope.imageUpload = function(files){

	    for (var i = 0; i < files.length; i++) {
	        var file = files[i];
	        Upload.upload({
	            url: $scope.app.apiUrl + '/utility/upload',
	            file: file
	        })
	            .success(function (data, status, headers, config) {
	                console.log(data.file_name);
	                var editor = $.summernote.eventHandler.getModule();
	                file_location = '/uploads/'+data.file_name;
	                editor.insertImage($scope.editable, data.file_name);
	            }).error(function (data, status, headers, config) {
	                console.log('error status: ' + status);
	            });
	    }
	}
});