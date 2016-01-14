
describe( 'Sign people in successfully', function()
{
	it( 'should be able to sign people in', function()
	{
		browser.get( 'http://' + browser.params.subdomain + '.smartmember.' + browser.params.env );
		element( by.css( '.login_button' ) ).click().then( function()
		{
			browser.waitForAngular();
			element( by.model( 'user.email' ) ).sendKeys( browser.params.non_admin_user.email );
			element( by.model( 'user.password' ) ).sendKeys( browser.params.non_admin_user.password );
			element( by.css( 'button[type=submit]' ) ).click().then( function()
			{
				browser.waitForAngular();
				expect( element( by.css( '.admin_bar' ) ) ).toExist();
			} )
		} );
	} );
} );
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
describe('Registration', function(){
    it('should register people', function(){
        function getRandomEmail() {
            var strValues = "abcdefghijk123456789";
            var strEmail = "";
            for (var i = 0; i < strValues.length; i++) {
                strEmail = strEmail + strValues.charAt(Math.round(strValues.length * Math.random()));
            }
            return strEmail + "@mymail.test";
        };

        browser.get('http://'+browser.params.subdomain+'.smartmember.'+browser.params.env);
        element( by.css( '.register_button' ) ).click().then( function()
        {
            browser.waitForAngular();
            var email = getRandomEmail();
            element(by.model('user.first_name')).sendKeys('Mike');
            element(by.model('user.email')).sendKeys(email);
            element(by.model('user.password')).sendKeys('minhdeptrai');

            element(by.css('button[type=submit]')).click().then(function(){
                browser.waitForAngular();
                expect(element(by.css('.join_button')).getText()).toEqual('Join');
            });
        });
    });
});

describe('Add new post', function(){
    it('should create a new post', function(){
        browser.get('http://' + browser.params.subdomain + ' .smartmember.' + browser.params.env);
        var previous_count = element.all(by.repeater('next_item in data'));
        var previous_count = 0;
        element(by.linkText('Log-in')).click();
        element(by.model('user.email')).sendKeys(browser.params.user.email);
        element(by.model('user.password')).sendKeys(browser.params.user.password);
        element(by.buttonText('Login')).click();
        element(by.xpath('//div[.="Build"]')).click();
        element(by.xpath('//a[.="Posts"]')).click();
        element(by.xpath('//a[.="Create new post"]')).click();
        element(by.model('next_item.title')).sendKeys('Test new post 2');
        element(by.css('.fr-element.fr-view')).sendKeys('Some lesson content');
        element(by.xpath('//a[.="Media"]')).click();
        element(by.xpath('//a[.="Commenting"]')).click();
        element(by.xpath('//label[.="Display comments"]')).click();
        element(by.model('next_item.discussion_settings.show_comments')).click();
        element(by.model('next_item.discussion_settings.close_to_new_comments')).click();
        element(by.xpath('//label[.="Newest at top"]')).click();
        element(by.model('next_item.discussion_settings.newest_comments_first')).click();
        element(by.model('next_item.discussion_settings.allow_replies')).click();
        element(by.model('next_item.discussion_settings.public_comments')).click();
        element(by.xpath('//a[.="Publish"]')).click().then(function() {
            browser.waitForAngular();
            var new_count = element.all(by.repeater('next_item in data'));
            expect(new_count.count()).toEqual(previous_count+1);
        });;
    });

    it('should edit a post', function() {
        browser.wait(EC.presenceOf(element(by.xpath('//div[.="Edit"]'))), 10000);
        browser.wait(EC.presenceOf(element(by.xpath('//div[.="Edit"]'))), 10000);
        element(by.repeater('next_item in data | filter:$parent.query | itemsPerPage: pagination.per_page').row(0)).element(by.xpath('//div[.="Edit"]')).click();
        element(by.model('next_item.title')).sendKeys('Test new post 3');
        element(by.xpath('//a[.="Publish"]')).click().then(function() {
            browser.waitForAngular();
            expect(element(by.repeater('next_item in data | filter:$parent.query | itemsPerPage: pagination.per_page').row(0)).element(by.xpath('//td[1]')).getText()).toEqual('Test new post 3');
        });
    });

    it('should delete a post', function() {
        browser.wait(EC.presenceOf(element(by.xpath('//div[.="Edit"]'))), 10000);
        element(by.repeater('next_item in data | filter:$parent.query | itemsPerPage: pagination.per_page').row(0)).element(by.xpath('//div[.="Edit"]')).click();
        element(by.xpath('//a[.="Delete"]')).click();
        element(by.xpath('//div[.="Yes"]')).click().then(function() {
            browser.waitForAngular();
            expect(element(by.repeater('next_item in data | filter:$parent.query | itemsPerPage: pagination.per_page').row(0)).element(by.xpath('//td[1]')).getText()).not.toEqual('Test new post 3');
        });
    });
});

describe('Add new post', function(){
    it('should create a new post', function(){
        browser.get('http://' + browser.params.subdomain + ' .smartmember.' + browser.params.env);
        var previous_count = element.all(by.repeater('next_item in data'));
        var previous_count = 0;
        element(by.linkText('Log-in')).click();
        element(by.model('user.email')).sendKeys(browser.params.user.email);
        element(by.model('user.password')).sendKeys(browser.params.user.password);
        element(by.buttonText('Login')).click();
        element(by.xpath('//div[.="Build"]')).click();
        element(by.xpath('//a[.="Posts"]')).click();
        element(by.xpath('//a[.="Create new helpdesk article"]')).click();
        element(by.model('next_item.title')).sendKeys('Test new post 2');
        element(by.css('.fr-element.fr-view')).sendKeys('Some lesson content');
        element(by.xpath('//a[.="Save changes"]')).click().then(function() {
            browser.waitForAngular();
            var new_count = element.all(by.repeater('next_item in data'));
            expect(new_count.count()).toEqual(previous_count+1);
        });;
    });

    it('should edit an article', function() {
        browser.wait(EC.presenceOf(element(by.xpath('//td[.="Test new article"]'))), 10000);
        element(by.repeater('next_item in data[ pagination.current_page ] | itemsPerPage: pagination.per_page').row(0)).element(by.xpath('//a[.="Edit"]')).click();
        element(by.model('next_item.title')).sendKeys('Test new post 3');
        element(by.xpath('//a[.="Save changes"]')).click().then(function() {
            browser.waitForAngular();
            expect(element(by.repeater('next_item in data[ pagination.current_page ] | itemsPerPage: pagination.per_page').row(0)).element(by.xpath('//td[1]')).getText()).toEqual('Test new post 3');
        });
    });

    it('should delete a post', function() {
        element(by.buttonText('Delete')).click().then(function() {
            browser.waitForAngular();
            expect(element(by.repeater('next_item in data | filter:$parent.query | itemsPerPage: pagination.per_page').row(0)).element(by.xpath('//td[1]')).getText()).not.toEqual('Test new post 3');
        });
    });
});

describe('Add new module', function(){
    it('should create a new module', function(){
        browser.get('http://' + browser.params.subdomain + ' .smartmember.' + browser.params.env);
        var previous_lessons = element.all(by.repeater('next_item in data'));
        var previous_count = 0;
        element(by.linkText('Log-in')).click();
        element(by.model('user.email')).sendKeys(browser.params.user.email);
        element(by.model('user.password')).sendKeys(browser.params.user.password);
        element(by.buttonText('Login')).click();
        element(by.xpath('//div[.="Build"]')).click();
        element(by.xpath('//a[.="Lessons"]')).click();
        element(by.xpath('//a[.="Create new lesson"]')).click();
        element(by.model('next_item.title')).sendKeys('Test new lesson 2');
        element(by.css('.fr-element.fr-view')).sendKeys('Some lesson content');
        element(by.xpath('//a[.="Lesson Fields"]')).click();
        element(by.model('selectedModule')).$('[value="Test module"]').click();
        element(by.xpath('//a[.="Media"]')).click();
        element(by.xpath('//a[.="Commenting"]')).click();
        element(by.xpath('//label[.="Display comments"]')).click();
        element(by.model('next_item.discussion_settings.show_comments')).click();
        element(by.model('next_item.discussion_settings.close_to_new_comments')).click();
        element(by.xpath('//label[.="Newest at top"]')).click();
        element(by.model('next_item.discussion_settings.newest_comments_first')).click();
        element(by.model('next_item.discussion_settings.allow_replies')).click();
        element(by.model('next_item.discussion_settings.public_comments')).click();
        element(by.xpath('//a[.="Publish"]')).click().then(function() {
            browser.waitForAngular();
            var new_modules = element.all(by.repeater('next_item in data'));
            expect(new_modules.count()).toEqual(previous_count+1);
        });;
    });

    it('should edit a lesson', function() {
        browser.wait(EC.presenceOf(element(by.xpath('//div[.="Edit"]'))), 10000);
        browser.wait(EC.presenceOf(element(by.xpath('//div[.="Edit"]'))), 10000);
        element(by.repeater('next_item in data | filter:$parent.query | itemsPerPage: pagination.per_page').row(0)).element(by.xpath('//div[.="Edit"]')).click();
        element(by.model('next_item.title')).sendKeys('Test new lesson 3');
        element(by.xpath('//a[.="Publish"]')).click().then(function() {
            browser.waitForAngular();
            expect(element(by.repeater('next_item in data | filter:$parent.query | itemsPerPage: pagination.per_page').row(0)).element(by.xpath('//td[1]')).getText()).toEqual('Test new lesson 3');
        });
    });

    it('should delete a module', function() {
        browser.wait(EC.presenceOf(element(by.xpath('//div[.="Edit"]'))), 10000);
        element(by.repeater('next_item in data | filter:$parent.query | itemsPerPage: pagination.per_page').row(0)).element(by.xpath('//div[.="Edit"]')).click();
        element(by.xpath('//a[.="Delete"]')).click();
        element(by.xpath('//div[.="Yes"]')).click().then(function() {
            browser.waitForAngular();
            expect(element(by.repeater('next_item in data | filter:$parent.query | itemsPerPage: pagination.per_page').row(0)).element(by.xpath('//td[1]')).getText()).not.toEqual('Test new lesson 3');
        });
    });
});

describe('Add new module', function(){
    it('should create a new module', function(){
        browser.get('http://' + browser.params.subdomain + ' .smartmember.' + browser.params.env);
        var previous_modules = element.all(by.repeater('next_item in data'));
        var previous_count = 0;
        element(by.linkText('Log-in')).click();
        element(by.model('user.email')).sendKeys(browser.params.user.email);
        element(by.model('user.password')).sendKeys(browser.params.user.password);
        element(by.buttonText('Login')).click();
        element(by.xpath('//div[.="Build"]')).click();
        element(by.xpath('//a[.="Modules"]')).click();
        element(by.xpath('//a[.="Create new module"]')).click();
        element(by.model('module.title')).sendKeys('Test a new module');
        element(by.xpath('//a[.="Save changes"]')).click().then(function() {
            browser.waitForAngular();
            var new_modules = element.all(by.repeater('next_item in data'));
            expect(new_modules.count()).toEqual(previous_count+1);
        });

    });

    it('should edit a module', function() {
        browser.wait(EC.presenceOf(element(by.xpath('//div[.="Edit"]'))), 10000);
        element(by.repeater('next_item in data | filter:$parent.query | itemsPerPage: pagination.per_page').row(0)).element(by.xpath('//div[.="Edit"]')).click();
        element(by.model('module.title')).sendKeys('Test a new module 2');
        element(by.xpath('//a[.="Save changes"]')).click().then(function() {
            browser.waitForAngular();
            expect(element(by.repeater('next_item in data | filter:$parent.query | itemsPerPage: pagination.per_page').row(0)).element(by.xpath('//td[1]')).getText()).toEqual('Test a new module 2');
        });
    });

    it('should delete a module', function() {
        browser.wait(EC.presenceOf(element(by.xpath('//div[.="Delete"]'))), 10000);
        element(by.repeater('next_item in data | filter:$parent.query | itemsPerPage: pagination.per_page').row(0)).element(by.xpath('//div[.="Delete"]')).click();
        element(by.xpath('//a[.="Delete"]')).click();
        element(by.xpath('//div[.="Yes"]')).click().then(function() {
            browser.waitForAngular();
            expect(element(by.repeater('next_item in data | filter:$parent.query | itemsPerPage: pagination.per_page').row(0)).element(by.xpath('//td[1]')).getText()).not.toEqual('Test a new module 2');
        });
    });
});
