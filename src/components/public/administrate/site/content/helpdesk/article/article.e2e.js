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
