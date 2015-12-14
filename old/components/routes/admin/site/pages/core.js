app.config( function( $stateProvider, $httpProvider, $urlRouterProvider, $locationProvider )
{
	//$urlRouterProvider.otherwise("/");
	$locationProvider.html5Mode( {
		enabled: true,
		requireBase: true
	} );

	$stateProvider
		.state( 'admin.site.pages', {
			url: '/pages',
			templateUrl: 'templates/admin/site/pages/index.html',
		} )
		.state( 'admin.site.pages.core.list', {
			url: '/all',
			templateUrl: 'templates/admin/site/pages/core/list.html'
		} )

		.state( 'admin.site.pages.core.home', {
			url: '/homepage',
			templateUrl: 'templates/admin/site/pages/core/home.html',
			controller: 'specialPagesController',
			resolve: {
				$site_options: function( Restangular )
				{
					return Restangular.all( 'siteMetaData' ).customGETLIST( "getOptions", [ 'cap_icon', 'syllabus_text', 'search_lesson_text', 'module_text', 'course_info_text', 'lesson_text', 'begin_course_text', 'homepage_url' ] );
				}
			}
		} )
        .state( 'admin.site.pages.core.login', {
            url: '/login',
            templateUrl: 'templates/admin/site/pages/core/login.html',
            controller: 'loginPageSettingsController',
            resolve: {
                $site_options: function( Restangular )
                {
                    return Restangular.all( 'siteMetaData' ).customGETLIST( "getOptions", [ 'create_account_url', 'login_page_text' ] );
                }
            }
        } )
		.state( 'admin.site.pages.core.syllabus', {
			url: '/syllabus',
			templateUrl: 'templates/admin/site/pages/core/syllabus.html',
			controller: 'SyllabusSpecialPageCtrl'
		} )

		.state( 'admin.site.pages.core.jv', {
			url: '/jv',
			templateUrl: 'templates/admin/site/pages/core/jv.html',
			controller: 'JVPageController',
			resolve: {
				emailLists: function( Restangular, $site )
				{
					return Restangular.all( 'emailList/sendMailLists' ).getList();
				}
			}
		} )
		.state( 'admin.site.pages.core.download-center', {
			url: '/download-center',
			templateUrl: 'templates/admin/site/pages/core/download-center.html',
			controller: 'specialPagesController',
			resolve: {
				$site_options: function( Restangular )
				{
					return Restangular.all( 'siteMetaData' ).customGETLIST( "getOptions", [ 'download_center_text', 'download_center_sub_text', 'downloads_text', 'access_level_status_color' ] );
				}
			}
		} )
		.state( 'admin.site.pages.core.helpdesk', {
				url: '/helpdesk',
				templateUrl: 'templates/admin/site/pages/core/helpdesk.html',
				controller: 'specialPagesController',
				resolve: {
					$site_options: function( Restangular )
					{
						return Restangular.all( 'siteMetaData' ).customGETLIST( "getOptions", [ 'cap_icon', 'syllabus_text', 'search_lesson_text', 'module_text', 'course_info_text', 'lesson_text', 'begin_course_text', 'homepage_url' ] );
					}
				}
			} )
		.state( 'admin.site.pages.core.info', {
			url: '/info',
			templateUrl: 'templates/admin/site/pages/core/info.html',
			controller: 'salesPageController',
			resolve: {
				$details: function( Restangular )
				{
					return Restangular.all( "siteMetaData" ).customGETLIST( "getOptions", [ 'sales_page_outro', 'sales_page_content', 'sales_page_enabled', 'sales_page_embed' ] );
				}
			}
		} )

		.state( 'admin.site.pages.core.refund', {
			url: '/refund',
			templateUrl: 'templates/admin/site/pages/core/refund.html',
			controller: 'refundPageController',
			resolve: {
				$refund: function( Restangular, $site )
				{
					return Restangular.all( 'specialPage' ).getList( { site_id: $site.id, type: 'Refund Page' } );
				}
			}
		} )

		.state( 'admin.site.pages.core.freebie', {
			url: '/freebie',
			templateUrl: 'templates/admin/site/pages/core/freebie.html',
			controller: 'freeBonusController',
			resolve: {
				$bonus: function( Restangular, $site )
				{
					return Restangular.all( 'specialPage' ).getList( { site_id: $site.id, type: 'Free Bonus' } );
				}
			}
		} )

} );
