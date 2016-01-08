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
        element(by.xpath('//a[.="Lessons"]')).click();
        element(by.xpath('//a[.="Create new lesson"]')).click();
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
