describe( 'Add new module', function()
{
	it( 'should be able to add a new module', function()
	{
		browser.get( 'http://' + browser.params.subdomain + '.smartmember.' + browser.params.env + '/admin/content/syllabus' );
		var previous_modules = element.all( by.repeater( 'module in modules' ) );
		var previous_count = 0;
		previous_modules.count().then( function( count )
		{
			previous_count = count;
		} )
		element( by.css( '.add_module' ) ).click().then( function()
		{
			var new_modules = element.all( by.repeater( 'module in modules' ) );
			expect( new_modules.count() ).toEqual( previous_count + 1 );
		} );
	} );
} );

describe( 'Add a lesson to other module', function()
{
	it( 'should be able to add a lesson to other module', function()
	{
		browser.get( 'http://' + browser.params.subdomain + '.smartmember.' + browser.params.env + '/admin/content/syllabus' );
		var previous_lessons = element.all( by.css( '#lessons_0 .lesson_item' ) );
		var lesson_count = 0;
		previous_lessons.count().then( function( count )
		{
			lesson_count = count;
			var module_0 = element( by.id( 'add_lesson_0' ) );
			module_0.click().then( function()
			{
				var lessons = element.all( by.css( '#lessons_0 .lesson_item' ) );
				expect( lessons.count() ).toEqual( lesson_count + 1 );
				element( by.css( '#lessons_0 li:last-child .col-md-6 .editable' ) ).click().then( function()
				{
					var scrollToScript = 'window.scroll(100,400)';
					element( by.model( '$data' ) ).sendKeys( 'Test Title' );
					element( by.css( '[type="submit"]' ) ).click();
					browser.waitForAngular();
					//reload to see if lesson is actually added
					browser.get( 'http://' + browser.params.subdomain + '.smartmember.' + browser.params.env + '/admin/content/syllabus' );
					var lessons_2 = element.all( by.css( '#lessons_0 .lesson_item' ) );
					expect( lessons_2.count() ).toEqual( lesson_count + 1 );
				} )
			} );
		} )
	} );
} );

describe( 'Add a lesson to first module', function()
{
	it( 'should be able to add a lesson to first module', function()
	{
		browser.get( 'http://' + browser.params.subdomain + '.smartmember.' + browser.params.env + '/admin/content/syllabus' );
		var previous_modules = element.all( by.repeater( 'module in modules' ) );
		var previous_count = 0;
		previous_modules.count().then( function( count )
		{
			previous_count = count;
			if( count > 1 )
			{
				var add_lesson = element.all( by.css( '.add_lesson:not(#add_lesson_0)' ) ).get( 0 );
				add_lesson.getAttribute( 'id' ).then( function( id )
				{
					var splits = id.split( '_' );
					var module_id = splits[ splits.length - 1 ];
					var previous_lessons = element.all( by.css( '#lessons_' + module_id + ' .lesson_item' ) );
					var lesson_count = 0;
					previous_lessons.count().then( function( count )
					{
						lesson_count = count;
						add_lesson.click().then( function()
						{
							var lessons = element.all( by.css( '#lessons_' + module_id + ' .lesson_item' ) );
							expect( lessons.count() ).toEqual( lesson_count + 1 );
							element( by.css( '#lessons_' + module_id + ' li:last-child .col-md-6 .editable' ) ).click().then( function()
							{
								var scrollToScript = 'window.scroll(100,400)';
								element( by.model( '$data' ) ).sendKeys( 'Test Title' );
								element( by.css( '[type="submit"]' ) ).click();
								browser.waitForAngular();
								//reload to see if lesson is actually added
								browser.get( 'http://' + browser.params.subdomain + '.smartmember.' + browser.params.env + '/admin/content/syllabus' );
								var lessons_2 = element.all( by.css( '#lessons_' + module_id + ' .lesson_item' ) );
								expect( lessons_2.count() ).toEqual( lesson_count + 1 );
							} )
						} )
					} )
				} );
			}
		} )
	} );
} );

describe( 'Delete a lesson from other module', function()
{
	it( 'should be able to delete a lesson from other module', function()
	{
		browser.get( 'http://' + browser.params.subdomain + '.smartmember.' + browser.params.env + '/admin/content/syllabus' );
		var previous_lessons = element.all( by.css( '#lessons_0 .lesson_item' ) );
		var lesson_count = 0;
		previous_lessons.count().then( function( count )
		{
			lesson_count = count;
		} )
		var lessons = element.all( by.css( '#lessons_0 .fa-trash' ) );
		lessons.count().then( function( count )
		{
			if( count > 0 )
			{
				element.all( by.css( '#lessons_0 .fa-trash' ) ).get( 0 ).click().then( function()
				{
					var confirm = by.css( '.confirm' );
					browser.waitForAngular();
					browser.wait( function()
					{
						return element( confirm ).isPresent();
					}, 3000 )
					element( confirm ).click().then( function()
					{
						var new_lessons = element.all( by.css( '#lessons_0 .lesson_item' ) );
						expect( new_lessons.count() ).toEqual( lesson_count - 1 );
					} )
				} )
			}
		} )
	} );
} );

describe( 'Delete a lesson from first module', function()
{
	it( 'should be able to delete a lesson from first module', function()
	{
		browser.get( 'http://' + browser.params.subdomain + '.smartmember.' + browser.params.env + '/admin/content/syllabus' );
		var previous_modules = element.all( by.repeater( 'module in modules' ) );
		var previous_count = 0;
		previous_modules.count().then( function( count )
		{
			previous_count = count;
			if( count > 1 )
			{
				var add_lesson = element.all( by.css( '.add_lesson:not(#add_lesson_0)' ) ).get( 0 );
				add_lesson.getAttribute( 'id' ).then( function( id )
				{
					var splits = id.split( '_' );
					var module_id = splits[ splits.length - 1 ];
					var previous_lessons = element.all( by.css( '#lessons_' + module_id + ' .lesson_item' ) );
					var lesson_count = 0;
					previous_lessons.count().then( function( count )
					{
						lesson_count = count;
						if( count > 0 )
						{
							element.all( by.css( '#lessons_' + module_id + ' .fa-trash' ) ).get( 0 ).click().then( function()
							{
								var confirm = by.css( '.confirm' );
								browser.waitForAngular();
								browser.wait( function()
								{
									return element( confirm ).isPresent();
								}, 3000 )
								element( confirm ).click().then( function()
								{
									var new_lessons = element.all( by.css( '#lessons_' + module_id + ' .lesson_item' ) );
									expect( new_lessons.count() ).toEqual( lesson_count - 1 );
								} )
							} )
						}
					} )

				} );
			}
		} )
	} );
} );

describe( 'Delete a module', function()
{
	it( 'should be able to delete a module', function()
	{
		browser.get( 'http://' + browser.params.subdomain + '.smartmember.' + browser.params.env + '/admin/content/syllabus' );
		var previous_modules = element.all( by.repeater( 'module in modules' ) );
		var previous_count = 0;
		previous_modules.count().then( function( count )
		{
			previous_count = count;
			element.all( by.css( '.fa-trash' ) ).get( 0 ).click().then( function()
			{
				var confirm = by.css( '.confirm' );
				browser.waitForAngular();
				browser.wait( function()
				{
					return element( confirm ).isPresent();
				}, 3000 )
				element( confirm ).click().then( function()
				{
					var new_modules = element.all( by.repeater( 'module in modules' ) );
					expect( new_modules.count() ).toEqual( previous_count - 1 );
				} )
			} );
		} )

	} );
} );

