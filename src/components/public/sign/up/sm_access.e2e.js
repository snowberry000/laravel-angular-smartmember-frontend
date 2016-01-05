describe('Test SM invite', function(){
    it('should register and give people access to SM', function(){
        function getRandomEmail() {
            var strValues = "abcdefghijk123456789";
            var strEmail = "";
            for (var i = 0; i < strValues.length; i++) {
                strEmail = strEmail + strValues.charAt(Math.round(strValues.length * Math.random()));
            }
            return strEmail + "@mymail.test";
        };



        browser.get('http://sm.smartmember.'+browser.params.env + '/access/5d99d2de51be1c522546d17f4cab7d30');
        var email = getRandomEmail();
        element(by.model('user.first_name')).sendKeys('Mike');
        element(by.model('user.email')).sendKeys(email);
        element(by.model('user.password')).sendKeys('minhdeptrai');

        element(by.css('button[type=submit]')).click().then(function(){
            browser.waitForAngular();
            expect(browser.getCurrentUrl()).toContain('my.smartmember.' + browser.params.env);
        });
    });

    it('should allow people to create site', function() {

        function getRandomNumber() {
            var randomNumber = "";
            var possible = "0123456789";
            for (var i = 0; i < 3; i++)
                randomNumber += possible.charAt(Math.floor(Math.random() * possible.length));
            return randomNumber;
        }

        element(by.css('.create_new_site')).click().then(function() {
            browser.waitForAngular();
            var site_number = getRandomNumber();
            element(by.model('site.name')).sendKeys('Test site');
            element(by.model('site.subdomain')).sendKeys('testsite' + site_number);
            element(by.css('.save_new_site')).click().then(function() {
                browser.waitForAngular();
                expect(browser.getCurrentUrl()).toContain('testsite' + site_number + '.smartmember.in');
            });
        });
    });
});
