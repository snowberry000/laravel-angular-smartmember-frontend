app.service('User', function ($localStorage, $rootScope, $location, Restangular, ipCookie) {
    var auth = Restangular.all('auth');

    this.profileImage = function () {
        var url = 'https://graph.facebook.com/' + $localStorage.facebook_user_id + '/picture';
        //console.log(url);
        return url;
    }

    this.signOut = function () {
        delete $localStorage.user;
        ipCookie.remove('user', {'domain' : $rootScope.app.domain, 'path' : '/'});
        auth.customGET("logout").then(function () {
            window.location.href= $rootScope.app.appUrl;       
        });
    }
});