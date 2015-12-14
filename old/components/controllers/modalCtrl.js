app.controller('modalController', function ($scope, $modalInstance) {

    $scope.cancel = function () {
        $modalInstance.dismiss();
    };
    $scope.ok = function () {
        $modalInstance.close();
    };

});
