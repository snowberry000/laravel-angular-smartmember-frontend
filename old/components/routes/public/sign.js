app.config(function ($stateProvider, $httpProvider, $urlRouterProvider, $locationProvider) {
    
    function themeEngine($site, $templateCache, $localStorage, url) {
        var theme = 'default';

        if ($localStorage.theme) {
            theme = $localStorage.theme;
        }
        else if ($site.meta_data) {
            $.each($site.meta_data, function (key, data) {
                if (data.key == 'theme')
                    theme = data.value;
            });
        }

        var html = $templateCache.get('templates/public/themes/' + theme + url);
        if (html) return html;

        return $templateCache.get('templates/public/themes/default' + url);
    };

    $stateProvider
        .state('public.sign', {
            url: '/sign',
            templateProvider: function($site, $templateCache, $localStorage) {
                return themeEngine($site, $templateCache, $localStorage, '/sign/sign.html');
            }
        })
        .state('public.sign.in2', {
            url: '/in',
            templateProvider: function($site, $templateCache, $localStorage) {
                return themeEngine($site, $templateCache, $localStorage, '/sign/login.html');
            }
        })
        .state('public.sign.in', {
            url: '/in/:hash?',
            templateProvider: function($site, $templateCache, $localStorage) {
                return themeEngine($site, $templateCache, $localStorage, '/sign/login.html');
            }
        })
        .state('public.sign.spoof', {
            url: '/spoof/:email?',
            templateProvider: function($site, $templateCache, $localStorage) {
                return themeEngine($site, $templateCache, $localStorage, '/sign/login.html');
            },
            controller: 'spoofController'
        })
        .state('public.sign.unsubscribe', {
            url: '/unsubscribe',
            templateProvider: function($site, $templateCache, $localStorage) {
                return themeEngine($site, $templateCache, $localStorage, '/sign/unsubscribe.html');
            },
            controller: 'unsubscribeController'
        })
        .state('public.sign.unsubscribed', {
            url: '/unsubscribed',
            templateProvider: function($site, $templateCache, $localStorage) {
                return themeEngine($site, $templateCache, $localStorage, '/sign/unsubscribedPage.html');
            },
            controller:'unsubscribedController'
        })
        .state('public.sign.up', {
            url: '/up/:hash?',
            templateProvider: function($site, $templateCache, $localStorage) {
                return themeEngine($site, $templateCache, $localStorage, '/sign/register.html');
            }
        })
        .state('public.sign.up2', {
            url: '/up',
            templateProvider: function($site, $templateCache, $localStorage) {
                return themeEngine($site, $templateCache, $localStorage, '/sign/register.html');
            }
        })
        .state('public.sign.fb', {
            url: '/facebook',
            templateProvider: function($site, $templateCache, $localStorage) {
                return themeEngine($site, $templateCache, $localStorage, '/sign/facebook.html');
            }
        })
        .state('public.sign.forgot', {
            url: '/forgot',
            templateProvider: function($site, $templateCache, $localStorage) {
                return themeEngine($site, $templateCache, $localStorage, '/sign/forgot.html');
            }
        })
        .state('public.sign.forgot2', {
            url: '/forgot/',
            templateProvider: function($site, $templateCache, $localStorage) {
                return themeEngine($site, $templateCache, $localStorage, '/sign/forgot.html');
            }
        })
        .state('public.sign.reset', {
            url: '/reset/:hash',
            templateProvider: function($site, $templateCache, $localStorage) {
                return themeEngine($site, $templateCache, $localStorage, '/sign/forgot.html');
            }
        })
        .state('public.sign.out', {
            url: '/out',
            controller: function ($state, User) {
                User.signOut();
            }
        })
        .state('public.login', {
            url: '/login',
            templateProvider: function($site, $templateCache, $localStorage) {
                return themeEngine($site, $templateCache, $localStorage, '/sign/login.html');
            },
            controller: 'signController'
        })

        .state('public.logout', {
            url: '/logout',
            controller: function ($state, User) {
                User.signOut();
                //TODO: Redirect to app's page. 
            }
        })
});