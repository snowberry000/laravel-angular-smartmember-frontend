app.controller('SmartMailSettingsController', function ($scope,Upload, $localStorage, $location, Restangular, $modal, toastr, emailSettings) {
    $scope.emailSettings = emailSettings;

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
    
    $scope.save = function () {
        Restangular.one('emailSetting').post("settings", $scope.emailSettings).then(function (emailSettings) {
            toastr.success("Your email settings have been saved!");
        } );
    }
});
