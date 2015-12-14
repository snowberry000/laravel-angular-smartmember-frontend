app.controller('SeoSettingsController', function ($scope, $localStorage, $location, $stateParams, $modal, Restangular,toastr) {
    var pageMetaData = Restangular.all("siteMetaData");
    $scope.settings = {};
    $scope.facebookInit = function () {
        pageMetaData.getList().then(function (settings) {
            if (settings) {
                $.each(settings, function (key, data) {
                    $scope.settings[data.key] = data.value;
                });
            }
        });

    };

    $scope.saveFacebook = function () {
        pageMetaData.customPOST($scope.settings, "save").then(function () {
            toastr.success("Settings are saved");
        });
    };
});
