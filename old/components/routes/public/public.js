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
        .state('public', {
            templateUrl: 'templates/public/public.html',
            controller: 'PublicController',
            resolve: {
                $site: function(Restangular){
                    return Restangular.one('site','details').get();
                },
                $user: function(Restangular,$localStorage){
                    if ($localStorage.user){
                        return Restangular.one('user',$localStorage.user.id).get();
                    }
                    return {};
                }
            }
        })
        .state('public.app',{
            templateProvider: function($site, $templateCache, $localStorage) {
                return themeEngine($site, $templateCache, $localStorage, '/home.html');
            },
            controller: "RootAppController",
        })
        .state('public.app.home', {
            url: '/',
            controller:  'homePageController'
        })
        /*
        .state('public.app.home2', {
            url: '/home',
            templateProvider: function($site, $templateCache, $localStorage) {
                return false;
                return themeEngine($site, $templateCache, $localStorage, '/special-pages/homepage.html');
            },
            resolve: {
                $data: function(Restangular , $site, $templateCache, $localStorage, $stateParams){
                    return false;
                    var template = themeEngine($site, $templateCache, $localStorage, '/special-pages/homepage.html');

                    if( template )
                        return Restangular.all('').customGET('latestOfEverything');
                    else
                        return {lessons:[],downloads:[],posts:[],livecasts:[],articles:[],comments:[]};
                },
                $reroute: function(Restangular, $site, $templateCache, $localStorage){
                    return true;
                    var template = themeEngine($site, $templateCache, $localStorage, '/special-pages/homepage.html');

                    if( template )
                        return false;
                    else
                        return true;
                }
            },
            controller:  'homePageController'
        })
        */



        .state('public.app.blog', {
            url: '/blog',
            templateProvider: function($site, $templateCache, $localStorage) {
                return themeEngine($site, $templateCache, $localStorage, '/posts/posts.home.html');
            },
            controller: 'blogController'
        })
        .state('public.app.lessons', {
            url: '/lessons',
            templateProvider: function($site, $templateCache, $localStorage) {
                return themeEngine($site, $templateCache, $localStorage, '/lessons/lessons.home.html');
            },
            controller: 'lessonsController'
        })
        .state('public.app.info', {
            url: '/info',
            templateProvider: function($site, $templateCache, $localStorage) {
                return themeEngine($site, $templateCache, $localStorage, '/special-pages/info.html');
            },
            controller: 'infoController'
        })
        .state('public.app.lesson', {
            url: '/lesson/:permalink',
            templateProvider: function($site, $templateCache, $localStorage) {
                return themeEngine($site, $templateCache, $localStorage, '/lessons/lessons.single.html');
            },
            controller: 'lessonController'
        })
        .state('public.app.affiliateContest', {
            url: '/leaderboard/:permalink',
            templateProvider: function($site, $templateCache, $localStorage) {
                return themeEngine($site, $templateCache, $localStorage, '/affiliates/affiliateContest.html');
            },
            controller: 'affiliateContestController'
        })
        .state('public.app.lessonSlash', {
            url: '/lesson/:permalink/',
            templateProvider: function($site, $templateCache, $localStorage) {
                return themeEngine($site, $templateCache, $localStorage, '/lessons/lessons.single.html');
            },
            controller: 'lessonController' 
        })
        .state('public.app.download-center', {
            url: '/download-center',
            templateProvider: function($site, $templateCache, $localStorage) {
                return themeEngine($site, $templateCache, $localStorage, '/downloads/download.home.html');
            },
            controller: 'downloadsController'
        })
        .state('public.app.download', {
            url: '/download/:permalink',
            templateProvider: function($site, $templateCache, $localStorage) {
                return themeEngine($site, $templateCache, $localStorage, '/downloads/download.single.html');
            },
            controller: 'downloadController' 
        })
        .state('public.app.page', {
            url: '/page/:permalink',
            templateProvider: function($site, $templateCache, $localStorage) {
                return themeEngine($site, $templateCache, $localStorage, '/pages/pages.single.html');
            },
            controller: 'pageController'
        })
       .state('public.app.post', {
            url: '/post/:permalink',
            templateProvider: function($site, $templateCache, $localStorage) {
                return themeEngine($site, $templateCache, $localStorage, '/posts/posts.single.html');
            },
            controller: 'postController'
        })

        .state('public.app.support-article', {
            url: '/support-article/:permalink',
            templateProvider: function($site, $templateCache, $localStorage) {
                return themeEngine($site, $templateCache, $localStorage, '/support/support-article.html');
            },
            controller: 'supportArticleController',
        })
        .state('public.app.support-ticket', {
            url: '/support-ticket/create?:type',
            templateProvider: function($site, $templateCache, $localStorage) {
                return themeEngine($site, $templateCache, $localStorage, '/support/support-ticket.html');
            },            
            controller: 'supportTicketController'
        })

        .state('public.app.support-ticket-edit', {
            url: '/support-ticket/:id',
            templateProvider: function($site, $templateCache, $localStorage) {
                return themeEngine($site, $templateCache, $localStorage, '/support/support-ticket-edit.html');
            }, 
            controller: 'supportTicketEditController',
        })

        .state('public.app.support-tickets', {
            url: '/support-tickets',
            templateProvider: function($site, $templateCache, $localStorage) {
                return themeEngine($site, $templateCache, $localStorage, '/support/support-tickets.html');
            }, 
            controller: 'supportTicketsController',
            data : {requiresLogin : true,state:"public.app.support-tickets" },
        })

        .state('public.app.support', {
            url: '/support',
            templateProvider: function($site, $templateCache, $localStorage) {
                return themeEngine($site, $templateCache, $localStorage, '/support/support.html');
            }, 
            controller: 'supportController'

        })

        .state('public.app.checkout', {
            url: '/checkout/:id',
            templateProvider: function($site, $templateCache, $localStorage) {
                return themeEngine($site, $templateCache, $localStorage, '/checkout/index.html');
            }, 
            controller: 'checkoutController'
        })

        .state('public.app.livecast', {
            url: '/livecast/:permalink',
            templateProvider: function($site, $templateCache, $localStorage) {
                return themeEngine($site, $templateCache, $localStorage, '/livecasts/livecasts.single.html');
            },
            controller: 'livecastController'
        })

        .state('public.app.refund-page', {
            url: '/refund-page',
            templateProvider: function($site, $templateCache, $localStorage) {
                return themeEngine($site, $templateCache, $localStorage, '/special-pages/refund-page.html');
            },
            controller: 'refundPageController'
        })
        .state('public.app.free-bonus', {
            url: '/free-bonus',
            templateProvider: function($site, $templateCache, $localStorage) {
                return themeEngine($site, $templateCache, $localStorage, '/special-pages/free-bonus.html');
            },
            controller: 'freeBonusController'
        })
        .state('public.app.jvpage', {
            url: '/jvpage',
            templateProvider: function($site, $templateCache, $localStorage) {
                return themeEngine($site, $templateCache, $localStorage, '/jvpage/jv.html');
            },
            controller: 'JVPageController',
            resolve: {
                emailLists: function() {
                    return {};
                }
            }
        })
        .state('public.app.jvthankyou', {
            url: '/jvthankyou',
            templateProvider: function($site, $templateCache, $localStorage) {
                return themeEngine($site, $templateCache, $localStorage, '/jvpage/jvthankyou.html');
            },
            controller: 'JVPageController',
            resolve: {
                emailLists: function() {
                    return {};
                }
            }
        })
        .state('thankyou', {
            url: '/thank-you',
            templateUrl : 'templates/thankyou.html',
            controller: 'ThankyouPageController',
            resolve: {
                $site: function(Restangular){
                    return Restangular.one('site','details').get();
                },
                $access_levels: function(Restangular,$site) {
                    return Restangular.all('accessLevel').getList({site_id: $site.id});
                }
            }
        })
        .state('bridgepage', {
            url: '/bpage/:permalink',
            templateUrl: 'templates/bridgepages/pages.single.html',
            controller: 'bridgePageController',
        })
        .state('public.app.error-404', {
            url: '/not-found',
            templateProvider: function($site, $templateCache, $localStorage) {
                return themeEngine($site, $templateCache, $localStorage, '/error/404.html');
            }
        })
        .state('public.app.error-406', {
            url: '/domain-not-found',
            templateProvider: function($site, $templateCache, $localStorage) {
                return themeEngine($site, $templateCache, $localStorage, '/error/406.html');
            }
        })
});