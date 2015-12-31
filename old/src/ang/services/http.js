app.run(function ($location, $localStorage, notify){
    notify.config({
        'position': 'right',
        'startTop': 50
    });
    //if ($localStorage && $localStorage.token) {
    //    $location.path("home");
    //}
});

app.factory('httpRequestInterceptor', function ($localStorage, $location, $q) {

    return {
        request: function (config) {
            if ($localStorage && $localStorage.token)
                config.headers['Authorization'] = 'Basic ' + $localStorage.token;
            return config;
        },
        response: function(response){
            if (response.status === 401) {
                $location.path("/");
            }

            return response || $q.when(response);
        },
        responseError: function(rejection) {
            if (rejection.status === 401) {
                $location.path("/");
            }
            return $q.reject(rejection);
        }
    };
});

app.config(function ($httpProvider, FacebookProvider) {
    $httpProvider.interceptors.push('httpRequestInterceptor');
    FacebookProvider.init('1564079657187026');
});

