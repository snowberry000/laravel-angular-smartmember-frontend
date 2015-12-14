app.config(function ($stateProvider, $httpProvider, $urlRouterProvider,$locationProvider) {
    //$urlRouterProvider.otherwise("/");
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: true
    });

    $stateProvider
        .state('admin.site.content.syllabus', {
            url: '/syllabus',
            templateUrl: 'templates/admin/site/content/syllabus/index.html'
        })
        .state('admin.site.content.syllabus.organizer', {
            url: '/organizer',
            templateUrl: 'templates/admin/site/content/syllabus/organizer.html',
            //controller: 'syllabusController'
	        controller: 'syllabusOrganizerController',
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            name: 'ui.sortable'
                        }
                    ]);
                }

            }
        })
        .state('admin.site.content.syllabus.lessons', {
            url: '/lessons',
            templateUrl: 'templates/admin/site/content/syllabus/lessons.html',
            controller: 'adminLessonsController'
        })
        .state('admin.site.content.syllabus.lesson', {
            url: '/lesson/:id?',
            templateUrl: 'templates/admin/site/content/syllabus/lesson.html',
            controller: 'adminLessonController',
            resolve: {
                $next_item: function(Restangular, $site , $stateParams , $location) {
                    if($stateParams.id) {
                        return Restangular.one('lesson', $stateParams.id).get();
                    }else if($location.search().clone){
                        return Restangular.one('lesson', $location.search().clone).get();
                    }
                    else
                        return {site_id : $site.id , access_level_type : 4, access_level_id : 0}
                },
                $modules: function(Restangular) {
                    return Restangular.all('module').customGET('');
                },
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            name: 'summernote'
                        }
                    ]);
                }
            }
        })
        .state('admin.site.content.syllabus.modules', {
            url: '/modules',
            templateUrl: 'templates/admin/site/content/syllabus/modules.html',
            controller: 'adminModulesController'
        })
        .state('admin.site.content.syllabus.module', {
            url: '/module/:id?',
            templateUrl: 'templates/admin/site/content/syllabus/module.html',
            controller: 'adminModuleController',
            resolve: {
                $module: function(Restangular, $site , $stateParams) {
                    if($stateParams.id)
                        return Restangular.one('module' , $stateParams.id).get();
                    else
                        return {site_id : $site.id}
                }
            }
        })

        .state( 'admin.site.content.syllabus.notes', {
            url: '/notes',
            templateUrl: 'templates/admin/site/content/syllabus/notes.html',
            controller: 'NotesController'
        } )

});
