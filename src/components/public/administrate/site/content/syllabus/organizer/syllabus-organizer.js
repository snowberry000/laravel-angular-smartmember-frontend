var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "public.administrate.site.content.syllabus.organizer", {
			url: "/organizer",
			templateUrl: "/templates/components/public/administrate/site/content/syllabus/organizer/syllabus-organizer.html",
			controller: "SyllabusOrganizerController",

			resolve: {
				loadPlugin: function( $ocLazyLoad )
				{
					return $ocLazyLoad.load( [
						{
							name: 'ui.sortable'
						}
					] );
				}/*,
				 $site: function(Restangular){
				 return Restangular.one('site','details').get();
				 }*/

			}
		} )
} );
app.controller( "SyllabusOrganizerController", function( $scope, $rootScope, $localStorage, $location, $stateParams, Restangular, toastr, $filter )
{
	$site = $rootScope.site;
	$user = $rootScope.user;
	$scope.options = {};

    $scope.bulk_edit_access = false;
    $scope.bulk_edit = {
        access_level_type: 1,
        access_level_id: 0
    }

    $scope.access_level_choices = [
        { value: 0, name: 'Draft (admin-only)' },
        { value: 1, name: 'Members' },
        { value: 2, name: 'Locked' },
        { value: 3, name: 'Visitors' }
    ];

    $scope.getSelectedLessons = function() {
        var lesson_ids = [];

        angular.forEach( $scope.modules, function( value ) {
            angular.forEach( value.lessons, function( value2 ) {
                if( value2.checked == true )
                    lesson_ids.push( value2.id );
            } )
        } );

        return lesson_ids;
    }

    $scope.getSelectedModules = function() {
        var module_ids = [];

        angular.forEach( $scope.modules, function( value ) {
            if( value.checked == true ) {
                module_ids.push( value.id );
            }
        } );

        return module_ids;
    }

    $scope.updateSelectedLessons = function( call_back ) {
        angular.forEach( $scope.modules, function( value ) {
            angular.forEach( value.lessons, function( value2 ) {
                if( value2.checked == true ) {
                    call_back( value2 );
                }
            } )
        } );
    }

    $scope.updateSelectedModules = function( call_back ) {
        angular.forEach( $scope.modules, function( value ) {
            if( value.checked == true ) {
                call_back( value );
            }
        } );
    }

    $scope.toggleBulkAccessEdit = function() {
        if( $scope.bulk_edit_access )
        {
            $scope.bulk_edit_access = false;
            $scope.bulk_edit = {
                access_level_type: 1,
                access_level_id: 0
            }
        }
        else
        {
            $scope.bulk_edit_access = true;
        }
    }

    $scope.bulkUpdateAccess = function(){
        if( $scope.bulk_edit.access_level_type != 2 )
            $scope.bulk_edit.access_level_id = 0;

        var lesson_ids = $scope.getSelectedLessons();

        var data = {
            lesson_ids: lesson_ids,
            access_level_type: $scope.bulk_edit.access_level_type,
            access_level_id: $scope.bulk_edit.access_level_id
        }

        if( lesson_ids.length > 0 )
        {
            Restangular.all('lesson/bulkUpdateAccess').post( data).then( function( response ) {
                $scope.updateSelectedLessons( function( lesson ) {
                    lesson.access_level_type = $scope.bulk_edit.access_level_type;
                    lesson.access_level_id = $scope.bulk_edit.access_level_id;
                } );
            } )
        }
    }

    $scope.bulkDelete = function() {
        var module_ids = $scope.getSelectedModules();
        var lesson_ids = $scope.getSelectedLessons();

        if( module_ids.length > 0 || lesson_ids.length > 0 )
        {
            Restangular.all('lesson/bulkDelete').post( {module_ids: module_ids, lesson_ids: lesson_ids }).then( function( response ) {
                $scope.updateSelectedLessons( function( lesson ) {
                    var module = _.findWhere( $scope.modules, { id: parseInt( lesson.id ) } ) || _.findWhere( $scope.modules, { id: lesson.id + '' } );

                    if( module )
                    {
                        module.lessons = _.without( module.lessons, lesson );
                    }
                    else
                    {
                        var defaultModule = _.findWhere( $scope.modules, { id: 0 } ) || _.findWhere( $scope.modules, { id: '0' } );

                        defaultModule.lessons = _.without( defaultModule.lessons, lesson );
                    }
                } );

                $scope.updateSelectedModules( function( module ) {
                    var defaultModule = _.findWhere( $scope.modules, { id: 0 } ) || _.findWhere( $scope.modules, { id: '0' } );

                    angular.forEach( module.lessons, function( value, key )
                    {
                        defaultModule.lessons.push( value );
                    } );

                    $scope.modules = _.without( $scope.modules, module );
                } );
            } );
        }
    }

	$scope.open1 = function( next_item )
	{
		var modalInstance = $modal.open( {
			size: 'lg',
			windowClass: 'lesson-modal-window',
			templateUrl: '/templates/components/public/administrate/site/content/syllabus/lesson/lesson.html',
			controller: 'LessonEditModalInstanceCtrl',
			resolve: {
				next_item: function()
				{
					return next_item;
				},
				$modules: function()
				{
					return $scope.modules;
				},
				loadPlugin: function( $ocLazyLoad )
				{
					return $ocLazyLoad.load( [
						{
							name: 'summernote'
						}
					] );
				},
				$site: function()
				{
					return $site;
				},
				$user: function()
				{
					return $user;
				},
				access_level_types: function()
				{
					return $scope.access_level_types;
				},
				access_levels: function()
				{
					return $scope.access_levels;
				}
			}
		} );

		modalInstance.result.then( function()
		{
			next_item = $scope.accessLevel( next_item );
		} )
	};

	$scope.loading = true;
	var module = Restangular.all( "module" );
	var lesson = Restangular.all( "lesson" );

	$scope.disableSortable = {};
	$scope.disableSortable.value = false;

	$scope.ModuleSortableOptions = {
		connectWith: ".connectModulePanels",
		stop: function( e, ui )
		{
			$scope.saveSyllabus();
		}
	};

	$scope.LessonSortableOptions = {
		connectWith: ".connectLessons",
		stop: function( e, ui )
		{
			$scope.saveSyllabus();
		}
	};

	$scope.items = [ 'item1', 'item2', 'item3' ];
	$scope.items2 = [ 'item21', 'item22', 'item23' ];
	$scope.unassigned_lessons = {};
	$scope.modules = {};
	$scope.init = function()
	{
		//console.log("asdasd");
		//console.log($rootScope.site);
		var details = $rootScope.site;
		//console.log("details: ");
		//console.log(details);
		//console.log($site);
		if( details )
		{
			$.each( details.meta_data, function( key, data )
			{
				$scope.options[ data.key ] = data.value;
			} );
		}
		$scope.access = [];
		Restangular.one( 'module', 'syllabus' ).get().then( function( response )
		{
			if( response )
			{
				response.modules.forEach( function( module )
				{
					module.isDripFeed = false;
					module.dripfeed_settings = module.dripfeed;
					module.lessons.forEach( function( lesson )
					{
						lesson = $scope.accessLevel( lesson );
						lesson.isOpen = false;
						lesson.isDripFeed = false;
						lesson.dripfeed_settings = lesson.dripfeed;
					} )
				} )
				$scope.loading = false;
				$scope.modules = response.modules;
				$scope.unassigned_lessons = response.unassigned_lessons;
				$scope.$broadcast( 'dataloaded' );
			}
		} );
		Restangular.all( 'accessLevel' ).getList( { site_id: $site.id } ).then( function( response )
		{
			$scope.access_levels = response;
			for( var i = $scope.access_levels.length - 1; i >= 0; i-- )
			{
				$scope.access.push( { text: $scope.access_levels[ i ].name, value: $scope.access_levels[ i ].id } );
			}
		} )
	};

	$scope.saveDripFeedModule = function( item, type )
	{
		delete item.isDripFeed;
		var dripfeed_settings = {
			duration: item.dripfeed_settings.duration,
			interval: item.dripfeed_settings.interval
		};

		if( item.id )
		{
			module.customPUT( { dripfeed_settings: dripfeed_settings }, item.id ).then( function()
			{
				toastr.success( "Success! Module saved" );
			} );
		}
	}

	$scope.saveDripFeedLesson = function( item, type )
	{
		if( !item.id )
		{
			toastr.success( "Please set the title first" );
			return;
		}

		delete item.isDripFeed;
		delete item.site;

		var dripfeed_settings = {
			'duration': item.dripfeed_settings.duration,
			'interval': item.dripfeed_settings.interval
		};
		lesson.customPUT( {
			dripfeed_settings: dripfeed_settings,
			site_id: item.site_id,
			id: item.id
		}, item.id ).then( function()
		{
			toastr.success( "Success! Lesson saved" );

		} );
	}

	$scope.saveAccessLevel = function( item, module, type )
	{
		if( !item.id && item.type != 'module' )
		{
			toastr.success( "Please set the title first" );
			return;
		}
		if( item.type == 'module' )
		{
			var lessons = [];
			//console.log(item)
			for( var i = 0; i < item.lessons.length; i++ )
			{
				if( $scope.selectedLessons.indexOf( item.lessons[ i ].id ) >= 0 )
				{
					lessons.push( item.lessons[ i ].id )
				}
			}
			;
			Restangular.all( 'lesson' ).customPUT( {
				access_level_type: item.access_level_type,
				access_level_id: item.access_level_id,
				lessons: lessons
			}, 'bulkUpdate?module_id=' + item.id ).then( function( response )
			{
				angular.forEach( item.lessons, function( value, key )
				{
					if( lessons.indexOf( value.id ) >= 0 )
					{
						value.access_level_type = response.access_level_type;
						value.access_level_id = response.access_level_id;
						value = $scope.accessLevel( value );
					}

				} )
			} )
			delete item.isOpen;
			//delete item.selected;
			return;
		}
		delete item.site;
		delete item.isOpen;
		lesson.customPUT( {
			access_level_type: item.access_level_type,
			access_level_id: item.access_level_id,
			site_id: item.site_id,
			id: item.id
		}, item.id ).then( function( response )
		{
			toastr.success( "Success! Lesson saved" );
		} );
		item = $scope.accessLevel( item )
	}

    $scope.showAccessLevel = function( lesson )
    {
        if( lesson.access_level_id )
        {
            var access_level = _.findWhere( $scope.access_levels, {id: parseInt( lesson.access_level_id ) } ) || _.findWhere( $scope.access_levels, {id: lesson.access_level_id + '' } );

            if( access_level )
                return access_level.name;
        }

        return "All Members";
    }

    $scope.showAccessLevelType = function( lesson )
    {
        if( lesson.access_level_type )
        {
            var access_type = _.findWhere( $scope.access_level_choices, { value: parseInt( lesson.access_level_type ) } ) || _.findWhere( $scope.access_level_choices, { value: lesson.access_level_type + '' } );

            if( access_type )
                return access_type.name;
        }

        return "Visitors";
    }

	$scope.accessLevel = function( lesson )
	{
		switch( lesson.access_level_type )
		{
			case 1:
				lesson.access = 'Public';
				break;
			case 2:
				lesson.access = 'Members';
				break;
			case 3:
				lesson.access = 'Members';
				break;
			case 4:
				lesson.access = 'Draft (private)';
				break;
		}
		return lesson;
	}

	$scope.deleteLesson = function( lesson_id )
	{
        Restangular.one( "lesson", lesson_id ).remove().then( function()
		{
            angular.forEach( $scope.modules, function( value ) {
                angular.forEach( value.lessons, function( value2 ) {
                    if( value2.id == lesson_id ) {
                        value.lessons = _.without(value.lessons, value2);
                    }
                } );
            } );
		} );
	};

    $scope.removeNewLesson = function( lesson, module ) {
        module.lessons = _.without( module.lessons, lesson );
    }

    $scope.removeNewModule = function( module ) {
        $scope.modules = _.without( $scope.modules, module );
    }

    $scope.selectAllModules = function() {
        angular.forEach( $scope.modules, function( value ) {
            value.checked = true;
        } );
    }

    $scope.selectAllLessons = function() {
        angular.forEach( $scope.modules, function( value ) {
            angular.forEach( value.lessons, function( value2 ) {
                value2.checked = true;
            } )
        } );
    }

    $scope.unselectAllModules = function() {
        angular.forEach( $scope.modules, function( value ) {
            value.checked = false;
        } );
    }

    $scope.unselectAllLessons = function() {
        angular.forEach( $scope.modules, function( value ) {
            angular.forEach( value.lessons, function( value2 ) {
                value2.checked = false;
            } )
        } );
    }

    $scope.selectLessonsInModule = function(module) {
        angular.forEach( module.lessons, function( value ) {
            value.checked = true;
        } );
    }

    $scope.unselectLessonsInModule = function(module) {
        angular.forEach( module.lessons, function( value ) {
            value.checked = false;
        } );
    }

    $scope.lessonSelectedInModule = function(module) {
        var checked = false;

        angular.forEach( module.lessons, function( value ) {
            if( value.checked )
                checked = true;
        } );

        return checked;
    }

    $scope.anythingChecked = function( type ) {
        var checked = false;

        angular.forEach( $scope.modules, function( value ) {
            if( value.checked && ( !type || type == 'modules' ) )
                checked = true;

            if( !checked && ( !type || type == 'lessons' ) ) {
                angular.forEach(value.lessons, function (value2) {
                    if( value2.checked )
                        checked = true;
                });
            }
        } );

        return checked;
    }

	$scope.deleteModule = function( module_id )
	{
        var moduleWithId = _.findWhere( $scope.modules, { id: parseInt( module_id ) } ) || _.findWhere( $scope.modules, { id: module_id + '' } );

        var lessons = moduleWithId.lessons;

        Restangular.one( "module", moduleWithId.id ).remove().then( function()
        {
            $scope.modules = _.without( $scope.modules, moduleWithId );

            var defaultModule = _.findWhere( $scope.modules, { id: 0 } ) || _.findWhere( $scope.modules, { id: '0' } );

            angular.forEach( lessons, function( value, key )
            {
                defaultModule.lessons.push( value );
            } );

            $scope.saveSyllabus();
        } );
	};

    $scope.ConsoleLogIt = function(something) {
        console.log('incoming data: ', something );
    }

    $scope.saveModuleTitle = function(module) {
        var mod = { 'title': module.title };
        var pageMetaData = Restangular.all( "siteMetaData" );
        if( module.id )
        {
            Restangular.all('module').customPUT( mod, module.id ).then( function()
            {
                toastr.success( "Module has been saved" );
            } );
        }
        else if( module.new )
        {
            delete module.new;
            Restangular.all('module').customPOST( module ).then( function( response )
            {
                module.isDripFeed = false;
                module.lessons = [];
                $scope.$broadcast( 'dataloaded' );
                toastr.success( "Success! New module is added!" );
                module.id = response.id;
            } );
        }
        else
        {
            pageMetaData.customPOST( { "default_module_title": mod.title }, "saveSingleOption" ).then( function()
            {
                toastr.success( "Default Module name is changed!" );
            } );
        }
    }

    $scope.saveLessonTitle = function(next_item) {
        var les = { 'title': next_item.title, id: next_item.id };

        if( next_item.id )
        {
            Restangular.all('lesson').customPUT( les, next_item.id ).then( function()
            {
                toastr.success( "Lesson has been saved" );
            } );
        }
        else
        {
            Restangular.all('lesson').customPOST( next_item ).then( function( response )
            {
                toastr.success( "Success! New lesson is added" );
                next_item.isOpen = false;
                next_item.isDripFeed = false;
                next_item = $scope.accessLevel( next_item );

                next_item.id = response.id;
            } );
        }
    }

    $scope.saveLessonAccessLevel = function(next_item) {
        var les = {
            'access_level_id': next_item.access_level_type != 2 && next_item.access_level_type != '2' ? 0 : next_item.access_level_id,
            'access_level_type': next_item.access_level_type,
            id: next_item.id
        };

        if( next_item.id )
        {
            Restangular.all('lesson').customPUT( les, next_item.id ).then( function()
            {
                toastr.success( "Lesson has been saved" );
            } );
        }
    }

	$scope.saveSyllabus = function()
	{
		$scope.toggle_lessons = true;
		var lessons = [];
		//alert("called");
		$.each( $( ".module_item" ), function( key, module )
		{
			$upLessons = $( module ).find( ".lesson_item" );
			if( $upLessons.length == 0 )
			{
				lessons.push( {
					"module": $( module ).data( "id" ), "lesson": null
				} );
			}
			$.each( $upLessons, function( key, lesson )
			{
				if( $( lesson ).data( "id" ) )
					lessons.push( {
						"module": $( module ).data( "id" ), "lesson": $( lesson ).data( "id" )
					} );
			} );
		} );
		module.customPOST( lessons, "syllabusSave" ).then( function( data )
		{
			toastr.success( "Course Content saved" );
		} );

	}

	$scope.updateModule = function( module_item )
	{
		var mod = { 'title': module_item.title };

		if( module_item.id )
		{
			module.customPUT( mod, module_item.id ).then( function()
			{
				toastr.success( "Success! Module saved" );
			} );
		}
        else if(module_item.new )
        {
            Restangular.all('module').customPOST( module_item ).then( function( response )
            {
                module_item.isDripFeed = false;
                $scope.$broadcast( 'dataloaded' );
                toastr.success( "Success! New module is added!" );
                module_item.id = response.id;
                delete module_item.new;
            } );
        }
		else
		{
			$scope.options.default_module_title;
			pageMetaData.customPOST( { "default_module_title": $scope.options.default_module_title }, "saveSingleOption" ).then( function()
			{
				toastr.success( "Success! Module saved!" );
			} );
		}
	};
	$scope.updateLesson = function( lesson_item, module )
	{
		var less = {
			'title': lesson_item.title,
			'note': lesson_item.note,
			site_id: $rootScope.site.id,
			id: lesson_item.id
		};

		if( lesson_item.id )
		{
			lesson.customPUT( less, lesson_item.id ).then( function( response )
			{
				toastr.success( "Success! Lesson saved" );
			} );
		}
		else
		{

			if( module )
				less.module_id = module.id;

			lesson.customPOST( less ).then( function( response )
			{
				toastr.success( "Success! New lesson is added" );
				response.isOpen = false;
				response.isDripFeed = false;
				if( module )
					module.lessons[ lesson_item.count ] = response;
				else
					$scope.unassigned_lessons[ lesson_item.count ] = response;
				$scope.$broadcast( 'dataloaded' );
				setTimeout( $scope.saveSyllabus, 200 );
			} );


		}
	}
	$scope.range = function( min, max, step )
	{
		step = step || 1;
		var input = [];
		for( var i = min; i <= max; i += step ) input.push( i );
		return input;
	};
	$scope.addLesson = function( module )
	{
        module.selected = false;

        if( module.new ) {
            toastr.warning('Your module needs a title before you can add lessons.');
            return;
        }

        var newLesson = {
			module_id: module.id,
			site_id: $rootScope.site.id,
            title: '',
			access_level_type: 4
		};

		if( !module.lessons )
			module.lessons = [];

		newLesson.sort_order = module.lessons.length + 1;

        module.lessons.push( newLesson );
	}
	$scope.addUnassignedLesson = function()
	{
		var newLesson = { 'module_id': 0, site_id: $rootScope.site.id };
		$scope.unassigned_lessons.push( {
			count: $scope.unassigned_lessons.length,
			lesson: newLesson,
			isOpen: false,
			isDripFeed: false
		} );

	}
	$scope.addModule = function()
	{
        var new_module = {
            title: '',
            'new': true,
            sort_order: $scope.modules.length + 1
        }

        $scope.modules.push( new_module );
	}

	$scope.selectedLessons = [];

	$scope.moduleSelected = function( module )
	{
		module.some_selected = module.selected;
		angular.forEach( module.lessons, function( value, key )
		{
			value.selected = module.selected;
			if( module.selected )
				$scope.selectedLessons.push( value.id );
			else
				$scope.selectedLessons = _.without( $scope.selectedLessons, value.id );
		} );
	}

	$scope.lessonSelected = function( lesson, module )
	{
		if( !lesson.selected )
		{

			$scope.selectedLessons = _.without( $scope.selectedLessons, lesson.id );
			module.selected = false;
			for( var i = module.lessons.length - 1; i >= 0; i-- )
			{
				if( $scope.selectedLessons.indexOf( module.lessons[ i ].id ) >= 0 )
				{
					module.some_selected = true;
					return;
				}
			}
			;
			module.some_selected = false;

		}
		else
		{
			module.some_selected = true;
			$scope.selectedLessons.push( lesson.id );
			for( var i = module.lessons.length - 1; i >= 0; i-- )
			{
				if( $scope.selectedLessons.indexOf( module.lessons[ i ].id ) < 0 )
				{
					module.selected = false;
					return;
				}
			}
			;
			module.selected = true;
		}
		//console.log($scope.selectedLessons)
	}

	$scope.setRedirectUrl = function()
	{
		$rootScope.syllabus_redirect_url = 'public.administrate.site-content.syllabus';
	}

	$scope.init();
} );

app.controller( 'LessonEditModalInstanceCtrl', function( $scope, $rootScope, $localStorage, $timeout, $state, next_item, access_level_types, access_levels, $location, $stateParams, $site, $modalInstance, $user, $filter, Restangular, toastr, $modules, Upload )
{
	$scope.template_data = {
		title: 'Lesson',
		use_cancel_method: true
	}

	$scope.access_level_types = access_level_types;
	$scope.access_levels = access_levels;

	$scope.original_item = angular.copy( next_item );

	var interval;
	var draft;
	var changed;
	$scope.func = function()
	{
		var modalInstance = $modal.open( {
			templateUrl: 'templates/modals/moduleCreator.html',
			controller: "modalController",
			scope: $scope
		} );
		modalInstance.result.then( function()
		{
			alert( "result called" );
		} )
	}

	if( $location.search().clone )
	{
		delete next_item.id;
		delete next_item.author_id;
		delete next_item.access;
	}


	if( $modules.length > 0 )
		$scope.modules = $modules.items;
	else
		$scope.modules = null;
	$scope.newModule = {};

	$scope.next_item = next_item;

	$scope.next_item.dripfeed_settings = next_item.dripfeed || {};
	if( $scope.next_item.published_date )
	{
		$scope.next_item.published_date = new Date( moment( $scope.next_item.published_date ).format( 'l' ) );
	}
	else
	{
		$scope.next_item.published_date = new Date();
		$scope.next_item.published_date.setSeconds( 0 );
		$scope.next_item.published_date.setMilliseconds( 0 );
	}
	if( $scope.next_item.end_published_date )
		$scope.next_item.end_published_date = new Date( moment( $scope.next_item.end_published_date ).format( 'l' ) );
	else
		$scope.next_item.end_published_date = null;

	$scope.next_item.discussion_settings = next_item.discussion_settings || {};
	$scope.next_item.id ? $scope.page_title = 'Edit lesson' : $scope.page_title = 'Create lesson';
	$scope.next_item.transcript_content_public == 1 ? $scope.next_item.transcript_content_public = true : $scope.next_item.transcript_content_public = false;
	$scope.next_item.access_level_type = parseInt( $scope.next_item.access_level_type );
	$scope.next_item.access_level_id = parseInt( $scope.next_item.access_level_id );

	if( $scope.next_item.access_level_type == 3 )
		$scope.next_item.access_level_type = 2;

	var seo = {};
	if( next_item.seo_settings )
	{
		$.each( next_item.seo_settings, function( key, data )
		{
			seo[ data.meta_key ] = data.meta_value;

		} );
	}
	$scope.next_item.seo_settings = seo;
	$scope.range = function( min, max, step )
	{
		step = step || 1;
		var input = [];
		for( var i = min; i <= max; i += step ) input.push( i );
		return input;
	};

	$scope.changeModule = function( $mod )
	{
		for( var i = 0; i < $modules.items.length; i++ )
		{
			if( $modules.items[ i ].title == $mod )
			{
				$scope.next_item.module_id = $modules.items[ i ].id;
				break;
			}
		}
	}

	$scope.setPermalink = function( $event )
	{
		if( !$scope.next_item.permalink )
			$scope.next_item.permalink = $filter( 'urlify' )( $scope.next_item.title ).toLowerCase();
		$scope.next_item.seo_settings.fb_share_title = $scope.next_item.title;
	}

	$scope.setPermalink();

	$scope.onBlurSlug = function( $event )
	{
		if( $scope.next_item.permalink )
			$scope.next_item.permalink = $filter( 'urlify' )( $scope.next_item.permalink );
	}

	$scope.saveModule = function( $model )
	{
		Restangular.all( 'module' ).post( $model ).then( function( module )
		{
			if( $scope.modules )
				$scope.modules.push( module );
			else
			{
				$scope.modules = [];
				$scope.modules.push( module );
			}
			toastr.success( "Module has been saved" );
			$scope.isOpen = false;
		} );
	}
	$scope.getFileName = function( $url )
	{
		if( $url )
		{
			str = $url.split( "/" );
			if( str )
			{
				str = str[ str.length - 1 ];
				tkns = str.split( "." )
				if( tkns.length > 0 )
					tkns.splice( 0, 1 );

				return tkns.join( '.' );
			}
		}
	}

	$scope.save = function()
	{
		delete $scope.next_item.prev_lesson;
		delete $scope.next_item.next_lesson;
		delete $scope.next_item.total_lessons;
		delete $scope.next_item.access_level;
		delete $scope.next_item.current_index;
		delete $scope.next_item.module;
		delete $scope.next_item.site;
		delete $scope.next_item.isOpen;
		delete $scope.next_item.isDripFeed;


		$scope.next_item.title = $scope.next_item.title.trim();

		if( $scope.next_item.permalink == '' )
			this.setPermalink( null );

		$scope.next_item.permalink = $scope.next_item.permalink.trim();
		$callback = "";

		if( $scope.next_item.access_level_type == 2 && $scope.next_item.access_level_id == 0 )
			$scope.next_item.access_level_type = 3;

		if( $scope.next_item.access_level_type != 2 )
			$scope.next_item.access_level_id = 0;
		if( $scope.next_item.id )
		{
			$callback = Restangular.all( 'lesson' ).customPUT( $scope.next_item, $scope.next_item.id );
		}
		else
		{
			$callback = Restangular.all( 'lesson' ).post( $scope.next_item );
		}

		$callback.then( function( lesson )
		{
			$scope.next_item = lesson;
			toastr.success( "Lesson has been saved" );

		} )

		$modalInstance.close();
	}

	$scope.cancel = function()
	{
		angular.forEach( $scope.next_item, function( value, key )
		{
			$scope.next_item[ key ] = $scope.original_item[ key ];
		} );
		$modalInstance.dismiss( 'cancel' );
	};

} );
