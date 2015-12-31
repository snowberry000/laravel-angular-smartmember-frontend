app.directive('profileImage', function ($localStorage) {
    return {
        restrict: 'A',
        link: function (scope, elem) {
            if ($localStorage.user && $localStorage.user.facebook_user_id)
                elem.attr('src', 'https://graph.facebook.com/' + $localStorage.user.facebook_user_id + '/picture');
        }
    };
});