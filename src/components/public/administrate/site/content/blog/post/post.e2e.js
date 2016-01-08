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
