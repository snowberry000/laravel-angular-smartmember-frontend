var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider.state("admin.app.company-settings.company-segments",{
		url: '/segments',
		templateUrl: '/templates/components/admin/app/company-settings/company-segments/segments.html',
		controller: 'CompanySegmentsController'
	});
})

app.controller("CompanySegmentsController", function($scope, $localStorage, toastr, RestangularV3){

	$scope.user = $localStorage.user;
	$scope.ishover = false;

	RestangularV3.all('segment/all').getList().then(function(response){
		$scope.data = response;
	});

	$scope.updateSegmentName = function(segmentID){
		swal({   
				title: "Edit Segment Name",   
				text: "Enter new segment name",   
				type: "input",   
				showCancelButton: true,   
				closeOnConfirm: false,   
				showLoaderOnConfirm: true, 
			}, function(inputValue){
				if (inputValue === false) return false;
				else if(inputValue==='')
				{
					swal.showInputError("Segment name cannot be empty");
					return false;
				}
				else if(inputValue){
					RestangularV3.all('segment').customPUT({ title : inputValue} , segmentID).then(function(response){
						swal("Your Segment has been updated successfully");
						var segment = _.findWhere($scope.data, {_id: segmentID});
						segment.title = inputValue;
					});
				}
				
				
		});
	}

	$scope.deleteSegment = function(segmentID){
		swal({   
				title: "Delete",   
				text: "Are you sure you want to delete this segment?",   
				showCancelButton: true,   
				closeOnConfirm: true,   
				showLoaderOnConfirm: true, 
			}, function(inputValue){ 
				if(inputValue){
					RestangularV3.one('segment' , segmentID).remove().then(function(response){
						$scope.data = _.without($scope.data, _.findWhere($scope.data,{_id: segmentID}));
						swal("Your Segment has been deleted successfully");
						return;
					});
				}
		});
	}
})