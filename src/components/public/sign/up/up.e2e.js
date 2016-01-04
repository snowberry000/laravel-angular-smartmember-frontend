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
