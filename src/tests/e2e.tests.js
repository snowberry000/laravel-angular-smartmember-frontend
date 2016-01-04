
describe( 'Sign people in successfully', function()
{
    it( 'should be able to sign people in', function()
    {
        browser.get( 'http://' + browser.params.subdomain + '.smartmember.' + browser.params.env );
        element( by.css( '.login_button' ) ).click().then( function()
        {
            browser.waitForAngular();
            element(by.model('user.email')).sendKeys(browser.params.non_admin_user.email);
            element(by.model('user.password')).sendKeys(browser.params.non_admin_user.password);
            element( by.css( 'button[type=submit]' ) ).click().then( function()
            {
                browser.waitForAngular();
                expect(browser.getCurrentUrl()).toContain('/lessons');
            })
        } );
    } );
} );
describe('Registration', function(){
    it('should register people', function(){
        browser.get('http://'+browser.params.subdomain+'.smartmember.'+browser.params.env);
        element( by.css( '.register_button' ) ).click().then( function()
        {
            browser.waitForAngular();
            var email = getRandomEmail();
            element(by.model('user.name')).sendKeys('Mike');
            element(by.model('user.email')).sendKeys(email);
            element(by.model('user.password')).sendKeys('minhdeptrai');

            element(by.css('button[type=submit]')).click().then(function(){
                browser.waitForAngular();
                expect(element(by.css('.join_button')).getText()).toEqual('Join');
            });
        });
    });
});
