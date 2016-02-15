var app = angular.module("app");

app.controller("SocialshareChosenBannerController", function ($scope) {
    $scope.show_settings = false;

    if( !$scope.chosen_widget.meta )
        $scope.chosen_widget.meta = {};

    $scope.updateBanner = function(){
        var banner = _.findWhere( $scope.$parent.banners, {id: parseInt( $scope.chosen_widget.target_id ) }) || _.findWhere( $scope.$parent.banners, {id: $scope.chosen_widget.target_id + '' });

        if( banner )
            $scope.chosen_widget.banner = banner;
    };

    $scope.delete = function(){
        $scope.$parent.delete( $scope.chosen_widget );
    };

    $scope.save = function(){
        $scope.$parent.save( $scope.chosen_widget );
    };
});

app.controller("SocialshareDisplayBannerController", function ($scope) {

});