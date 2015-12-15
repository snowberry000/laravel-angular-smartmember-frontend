var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("admin.site.appearance.directory",{
			url: "/directory",
			templateUrl: "/templates/components/admin/site/appearance/directory/directory.html",
			controller: "DirectoryListingController",
			resolve: {
				$listing: function( Restangular )
				{
					return Restangular.one( 'directory', 'siteListing' ).get();
				}
			}
		})
}); 

app.controller("DirectoryListingController", function ($scope, $localStorage, $modal, $listing, Restangular,$site, toastr, $filter) {
    if($listing)
        $listing.expired_at =  moment($listing.expired_at).toDate();
    else
        $listing = {};
	$scope.listing = $listing;
    $scope.hide_lessons = $listing.hide_lessons;
    $scope.hide_downloads = $listing.hide_downloads;
    $scope.hide_members = $listing.hide_members;
    $scope.hide_revenue = $listing.hide_revenue;


    $scope.onBlurTitle = function ($event) {
        if (! $scope.listing.permalink)
            $scope.listing.permalink = $filter('urlify')( $scope.listing.pending_title);
    }
    $scope.onBlurSlug = function ($event) {
        if (! $scope.listing.permalink)
            $scope.listing.permalink = $filter('urlify')($scope.listing.pending_title);
        else (! $scope.listing.permalink)
            $scope.listing.permalink = $filter('urlify')($scope.listing.permalink);
    }


    $scope.save = function(){
        //$listing.hide_lessons = $scope.hide_lessons;
        //$listing.hide_downloads = $scope.hide_downloads;
        //$listing.hide_members = $scope.hide_members;
        //$listing.hide_revenue = $scope.hide_revenue;

		Restangular.service("directory").post($scope.listing).then(function(response){
			$scope.listing = response;
            toastr.success("Your directory listings has been received.");
		});
	}
});