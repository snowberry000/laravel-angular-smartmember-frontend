var SiteHomepage = function()
{
	var login_button = element( by.css( '.login_button' ) );
	var email_input = element( by.model( 'user.email' ) );
	var password_input = element( by.model( 'user.password' ) );
	var submit_button = element( by.css( 'button[type=submit]' ) );

	this.Visit = function()
	{
		return browser.get( 'http://' + browser.params.subdomain + '.smartmember.' + browser.params.env );
	};

	this.PopModal = function()
	{
		return login_button.click()
	};
	this.SetEmail = function( text )
	{
		return email_input.sendKeys( text );
	};
	this.SetPassword = function( text )
	{
		return password_input.sendKeys( text );
	};
	this.SubmitForm = function()
	{
		return submit_button.click()
	};
};

module.exports = new SiteHomepage();