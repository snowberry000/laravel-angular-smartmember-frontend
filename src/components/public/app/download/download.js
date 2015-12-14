var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.app.download",{
			url: "/download/:permalink",
			templateUrl: "/templates/components/public/app/download/download.html",
			controller: "PublicDownloadController"
		})
}); 

app.controller('PublicDownloadController', function ($scope, $rootScope ,$localStorage, $state, $stateParams, $modal, Restangular, toastr, $filter) {
    $download={};
    $scope.loading=true;
    Restangular.one('downloadByPermalink' , $stateParams.permalink).get().then(function(response){
        $download=response;
        $scope.loading=false;
        $scope.download = $download;
        $rootScope.page_title = $download.title || $rootScope.page_title;
    });

    $scope.updateStats = function(download){
        Restangular.all('get').customGET('download/'+download.id).then(function(response){
            if( ( response.aws_key != undefined && response.aws_key != '' ) || ( response.my_url != undefined && response.my_url != '' ) )
                location.href = $scope.app.apiUrl + '/utility/download?' + ( response.aws_key != undefined ? 'aws_key=' + response.aws_key : 'file=' + response.my_url );
            else{
                toastr.error("Something went wrong, your file cannot be downloaded at this time!");
            }
        })
    }
    
});