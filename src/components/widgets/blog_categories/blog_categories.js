var app = angular.module("app");

app.controller("WidgetChosenBlogCategoriesController", function ($scope) {
    $scope.show_settings = false;

    if( !$scope.chosen_widget.meta )
        $scope.chosen_widget.meta = {};

    $scope.delete = function(){
        $scope.$parent.delete( $scope.chosen_widget );
    };

    $scope.save = function(){
        $scope.$parent.save( $scope.chosen_widget );
    };
});

app.controller("WidgetDisplayBlogCategoriesController", function ($scope, Restangular) {
    //uncomment this line if we want to track views every time rendered, othewise we track once per load in the public controller
    //$scope.bannerView( $scope.display_widget.banner.id );
    $scope.display_post_count = $scope.display_widget.meta.display_post_count;
    Restangular.all( '' ).customGET( 'category?view=admin&bypass_paging=1&site_id=' + $scope.display_widget.site_id ).then( function( data )
    {
        $scope.categories = data.items;
    } );
});