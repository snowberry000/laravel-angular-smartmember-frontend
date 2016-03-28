var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("admin.start.import",{
			url: "/import",
			templateUrl: "/templates/components/admin/start/import/import.html",
			controller: "StartImportController"
		})
}); 

app.controller("StartImportController", function ($scope , Start, Upload , $rootScope , toastr, $location ,RestangularV3) {
	$scope.step1 = 'completed';
	$scope.step2 = 'active';
	$scope.step3 = '';
	$scope.email = $location.search().email;
	$scope.csvfile =null;
	$rootScope.page_title = "Import Members";
	Start.validate($scope.email);
	$scope.import = {csv : ''};
	
	$scope.$watch('csvfile' , function(newValue , oldValue){
		if(newValue && newValue != oldValue){
			$scope.upload($scope.csvfile[0]);
		}
	} , true);

	$scope.upload = function( files )
	{
		$splittedName = files.name.split('.');

		if( files )
		{
			console.log( files.name );
			if($splittedName[$splittedName.length-1]!='csv')
			{
				toastr.error("file cant be uploaded");
				return;
			}
			
			var file = files;
			$scope.loading = true;
			Upload.upload( {
					url: $scope.app.apiUrl + '/utility/upload' +  ( $scope.privacy ? '?private=' + $scope.privacy : '' ),
					file: file
				} )
				.success( function( data, status, headers, config )
				{
					$scope.loading = false;
                    $scope.import.csv = data.link;
                    toastr.success("file uploaded");
				} ).error( function( data, status, headers, config )
			{
				console.log( 'error status: ' + data );
			} );
		}
	};

	$scope.getNameOfcsv = function(){
		if($scope.import.csv)
		{
			$splitted = $scope.import.csv.split('/');
			if($splitted.length > 0)
			{
				return $splitted[$splitted.length-1];
			}
		}
		return "";
	}

	$scope.next = function(){
		$scope.loading = true;
		$scope.import.user_id = $rootScope.new_user._id;
		$scope.import.company_id = $rootScope.new_user_company._id;

		RestangularV3.all('member').customPOST($scope.import , 'csvimport').then(function(response){
			$scope.loading = false;
			$location.path('/start/account/register').search('email' , $scope.email);
		})
	}

	$scope.skip = function(){
		$location.path('/start/account/register').search('email' , $scope.email);
	}
});