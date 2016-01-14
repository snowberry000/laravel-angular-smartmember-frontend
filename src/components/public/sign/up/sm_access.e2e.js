describe( 'Test SM invite', function()
{
	it( 'should register and give people access to SM', function()
	{
		function getRandomEmail()
		{
			var strValues = "abcdefghijk123456789";
			var strEmail = "";
			for( var i = 0; i < strValues.length; i++ )
			{
				strEmail = strEmail + strValues.charAt( Math.round( strValues.length * Math.random() ) );
			}
			return strEmail + "@mymail.test";
		};


		browser.get( 'http://sm.smartmember.' + browser.params.env + '/access/5d99d2de51be1c522546d17f4cab7d30' );
		browser.waitForAngular();

		var email = getRandomEmail();
		element( by.model( 'user.first_name' ) ).sendKeys( 'Mike' );
		element( by.model( 'user.email' ) ).sendKeys( email );
		element( by.model( 'user.password' ) ).sendKeys( 'minhdeptrai' );

		element( by.css( 'button[type=submit]' ) ).click().then( function()
		{
			browser.waitForAngular();
			expect( browser.getCurrentUrl() ).toContain( 'my.smartmember.' + browser.params.env );
		} );
	} );

	it( 'should allow people to create site', function()
	{

		function getRandomNumber()
		{
			var randomNumber = "";
			var possible = "0123456789";
			for( var i = 0; i < 3; i++ )
			{
				randomNumber += possible.charAt( Math.floor( Math.random() * possible.length ) );
			}
			return randomNumber;
		}


		element( by.css( '.create_new_site' ) ).click().then( function()
		{
			browser.waitForAngular();
			var site_number = getRandomNumber();
			element( by.model( 'site.name' ) ).sendKeys( 'Test site' );
			element( by.model( 'site.subdomain' ) ).sendKeys( 'testsite' + site_number );
			element( by.css( '.save_new_site' ) ).click().then( function()
			{
				browser.waitForAngular();
				expect( browser.getCurrentUrl() ).toContain( 'testsite' + site_number + '.smartmember.in' );
			} );
		} );
	} )
	;


	it( 'should allow people to create module', function()
	{
		element( by.css( '.create_site_modules' ) ).click().then( function()
		{
			browser.waitForAngular();
			var previous_modules = element.all( by.repeater( 'next_item in modules' ) );
			var previous_count = 0;
			previous_modules.count().then( function( count )
			{
				previous_count = count;
			} )
			element( by.model( 'module.title' ) ).sendKeys( 'Training module 1' );
			element( by.css( '.add_more_module' ) ).click().then( function()
			{
				browser.waitForAngular();
				var new_modules = element.all( by.repeater( 'next_item in modules' ) );
				expect( new_modules.count() ).toEqual( previous_count + 1 );
			} );
		} );
	} );

	it( 'should finish module wizard step and move on', function()
	{
		function hasClass( element, cls )
		{
			return element.getAttribute( 'class' ).then( function( classes )
			{
				return classes.split( ' ' ).indexOf( cls ) !== -1;
			} );
		}

		element( by.css( '.finish_module_step' ) ).click().then( function()
		{
			browser.waitForAngular();
			expect( hasClass( element( by.css( '.create_site_modules .text-center .huge i:first-child' ) ), 'green' ) ).toBe( true );
		} );
	} );

	it( 'should allow people to create lessons', function()
	{
		element( by.css( '.ui.modal.active .create_site_lessons' ) ).click().then( function()
		{
			browser.waitForAngular();
			var previous_modules = element.all( by.repeater( 'next_item in lessons' ) );
			var previous_count = 0;
			previous_modules.count().then( function( count )
			{
				previous_count = count;
			} )
			element( by.model( 'next_item.title' ) ).sendKeys( 'Test lesson 1' );
			element( by.model( 'next_item.content' ) ).sendKeys( 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam rhoncus dignissim urna, et euismod nisi viverra sed. Nulla sit amet tempor nisl. Nunc metus sem, malesuada elementum leo ut, lacinia condimentum leo. Quisque interdum porta ante, sed hendrerit lectus ultrices blandit. Nunc tempor, dui vel accumsan convallis, felis urna accumsan turpis, eu faucibus lorem risus sit amet nisl. In sit amet consequat justo. Donec condimentum ex erat, sit amet vehicula metus imperdiet nec. Sed ut volutpat mi. Donec ac odio at neque tincidunt ultricies ut ut libero.' );

			element( by.css( '.ui.modal.active .add_more_lesson' ) ).click().then( function()
			{
				browser.waitForAngular();
				var new_modules = element.all( by.repeater( 'next_item in lessons' ) );
				expect( new_modules.count() ).toEqual( previous_count + 1 );
			} );
		} );
	} );

	it( 'should finish lesson wizard step and move on', function()
	{
		function hasClass( element, cls )
		{
			return element.getAttribute( 'class' ).then( function( classes )
			{
				return classes.split( ' ' ).indexOf( cls ) !== -1;
			} );
		}

		element( by.css( '.ui.modal.active .finish_lesson_step' ) ).click().then( function()
		{
			browser.waitForAngular();
			expect( hasClass( element( by.css( '.ui.modal.active .create_site_lessons .text-center .huge i:first-child' ) ), 'green' ) ).toBe( true );
		} );
	} );

	it( 'should allow people to lock their content', function()
	{
		element( by.css( '.ui.modal.active .lock_site_content' ) ).click().then( function()
		{
			browser.waitForAngular();
			element( by.model( 'access_type' ) ).then( function( options )
			{
				options[ 2 ].click();
			} );
			element( by.model( 'access.access_level_name' ) ).sendKeys( 'Premium content' );
			element( by.css( '.ui.modal.active .finish_locking_content' ) ).click().then( function()
			{
				browser.waitForAngular();
				expect( hasClass( element( by.css( '.ui.modal.active .lock_site_content .text-center .huge i:first-child' ) ), 'green' ) ).toBe( true );
			} )
		} );
	} );

	it( 'should allow people to invite members', function()
	{
		function getRandomEmail()
		{
			var strValues = "abcdefghijk123456789";
			var strEmail = "";
			for( var i = 0; i < strValues.length; i++ )
			{
				strEmail = strEmail + strValues.charAt( Math.round( strValues.length * Math.random() ) );
			}
			return strEmail + "@mymail.test";
		};

		element( by.css( '.ui.modal.active .invite_members' ) ).click().then( function()
		{
			browser.waitForAngular();
			var import_email = getRandomEmail();
			element( by.model( 'members.emails' ) ).sendKeys( import_email );
			element( by.css( '.ui.modal.active .finish_invite_step' ) ).click().then( function()
			{
				browser.waitForAngular();
				expect( hasClass( element( by.css( '.ui.modal.active .invite_members .text-center .huge i:first-child' ) ), 'green' ) ).toBe( true );
			} )
		} );
	} );


} )
;