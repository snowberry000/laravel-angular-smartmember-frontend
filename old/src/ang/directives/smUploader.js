app.directive('smUploader', function ($localStorage, $modal, $parse, notify, Restangular) {
    return {
        restrict: 'A',
        require: 'ngModel',
        
        link: function (scope, elem, attr , ctrl) {
            elem.on('click', function () {
                var key = attr.smUploader;
                var post = attr.restangular;
                var model = attr.ngModel;
                var hideLink = attr.hidelink ? attr.hidelink : false;

                if (post) {
                    var rest = Restangular.all(post);
                }

                var modalInstance = $modal.open({
                    templateUrl: '/templates/modals/newMediaItem.html',
                    controller: "modalMediaController",
                    scope: scope,
                    resolve: {
                        hideLink: function () {
                            return hideLink
                        }
                    }
                });

                modalInstance.result.then(function (item) {
                    if (key) {
                        var li = {};
                        li[key] = item.file;
                        if (model) {

                            var parsed_model = $parse(model);
                            parsed_model.assign(scope, item.file);
                            ctrl.$setViewValue(item.file);
                        }
                    }

                    if (rest) {
                        rest.customPOST(li, "save").then(function () {
                            notify("Image is uploaded");
                        });
                    }
                })
            })
            
        }
    };
});
app.controller('modalMediaController', function ($scope, $modalInstance, Upload) {

    $scope.loading = false;
    $scope.cancel = function () {
        $modalInstance.dismiss();
    };
    $scope.ok = function () {
        $modalInstance.close();
    };
    $scope.insert = function () {
        $modalInstance.close();
    }

    $scope.$watch('files', function () {
        $scope.upload($scope.files);
    });

    $scope.upload = function (files) {
        if (files && files.length) {
            $scope.loading = true;
            for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    /*Upload.upload({url: 'https://imbmediab.s3.amazonaws.com/', //S3 upload url including bucket name
                    method: 'POST',
                    fields : {
                      key: file.name, // the key to store the file on S3, could be file name or customized
                      AWSAccessKeyId: 'AKIAIUPXUR6UBUCRHKNQ', 
                      acl: 'private', // sets the access to the uploaded file in the bucket: private or public 
                      policy: 'ewogICJleHBpcmF0aW9uIjogIjIwMjAtMDEtMDFUMDA6MDA6MDBaIiwKICAiY29uZGl0aW9ucyI6IFsKICAgIHsiYnVja2V0IjogImltYm1lZGlhYiJ9LAogICAgWyJzdGFydHMtd2l0aCIsICIka2V5IiwgIkFLSUFJVVBYVVI2VUJVQ1JIS05RIl0sCiAgICB7ImFjbCI6ICJwcml2YXRlIn0sCiAgICBbInN0YXJ0cy13aXRoIiwgIiRDb250ZW50LVR5cGUiLCAiYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtIl0sCiAgICBbImNvbnRlbnQtbGVuZ3RoLXJhbmdlIiwgMCwgNTI0Mjg4MDAwXQogIF0KfQ==', // base64-encoded json policy (see article below)
                      signature: 'HS+5ojpPUN31bHtetbxVJnTDWgk=', // base64-encoded signature based on policy string (see article below)
                      "Content-Type": file.type != '' ? file.type : 'application/octet-stream', // content type of the file (NotEmpty)
                      filename: file.name // this is needed for Flash polyfill IE8-9
                    },
                    file: file,
                  })*/
                  Upload.upload({
                      url: $scope.app.apiUrl + '/utility/upload',
                      file: file
                  })
                  .success(function (data, status, headers, config) {
                    $modalInstance.close({file: data});
                }).error(function (data, status, headers, config) {
                    console.log('error status: ' + status);
                });

                //allow only 1 file to be uploaded
                break;
            }
        }
    };

});