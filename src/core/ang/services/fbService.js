app.service('FB', function (Facebook, $q) {
    this.login = function () {
        
        var deferred = $q.defer();

        Facebook.getLoginStatus(function (loginStatus) {
            if (loginStatus.status === 'connected') {
                Facebook.api('/me', function (response) {
                    console.log(response);
                    deferred.resolve(response);
                }, {scope: 'email, public_profile'});

            } else {
                Facebook.login(function (response) {
                    Facebook.api('/me', function (response) {
                        console.log(response);
                        deferred.resolve(response);
                    }, {scope: 'email, public_profile'});
                });
            }
        });

        return deferred.promise;
    };
})
