if (jasmine.version) { //the case for version 2.0.0
	console.log('jasmine-version:' + jasmine.version);
}
else { //the case for version 1.3
	console.log('jasmine-version:' + jasmine.getEnv().versionString());
}

describe( 'Sign people in successfully', function()
{
	it( 'should be able to sign people in', function()
	{
		var admin_toolbar = RequireObject('public/admin-bar');
		var current_page = RequireObject('public/my');

		current_page.Visit();

		current_page.SetEmail( browser.params.user.email );
		current_page.SetPassword( browser.params.user.password );

		current_page.GetSignInButton().click().then( function()
		{
			browser.waitForAngular();
			expect( admin_toolbar.GetToolbar().isPresent() ).toBe(true);
		} )
	} );
} );