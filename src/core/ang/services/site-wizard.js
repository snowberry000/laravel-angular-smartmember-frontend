app.factory('SiteWizard', function () {

	return {
		GetNodes: function() {
			return [
				{
					"slug" : 'site_settings',
                    "parent": '',
					"feature" : "Settings",
					"heading" : "Setup site settings" ,
					"template" : "templates/components/admin/other/appearance/settings.html",
					"controller" : "siteSettingsWizardController",
					"enabled" : true ,
					"completed" : false ,
				} ,

				{
                    "slug" : 'product',
                    "parent": 'site_settings',
					"feature" : "Product",
					"heading" : "Create your first product" ,
					"template" : "templates/components/admin/site/membership/product.html",
					"controller" : "accessWizardController",
					"enabled" : true ,
					"completed" : false
				} ,

				{
                    "slug" : 'lesson',
                    "parent": 'access_level',
					"feature" : "Lesson",
					"heading" : "Create a lesson" ,
					"template" : "templates/components/admin/site/content/syllabus/lesson.html",
                    "controller" : "lessonWizardController",
					"enabled" : true ,
					"completed" : false
				} ,

				{
                    "slug" : 'menu',
                    "parent": 'lesson',
					"feature" : "Menus",
					"heading" : "Configure navigation menus" ,
					"template" : "templates/components/admin/site/appearance/menus.html",
					"controller" : "menuWizardController",
					"enabled" : true ,
					"completed" : false
				}
				,
                {
                    "slug" : 'sendgrid',
                    "parent": 'menu',
                    "feature" : "Sendgrid",
                    "heading" : "Add SendGrid integration" ,
                    "template" : "templates/components/admin/team/integrations/wizard_sendgrid.html",
                    "controller" : "sendgridWizardController",
                    "enabled" : true ,
                    "completed" : false
                } ,
                {
                    "slug" : 'paypal',
                    "parent": 'sendgrid',
                    "feature" : "Paypal",
                    "heading" : "Add Paypal integration" ,
                    "template" : "templates/components/admin/team/integrations/wizard_paypal.html",
                    "controller" : "paypalWizardController",
                    "enabled" : true ,
                    "completed" : false
                } ,
				{
                    "slug" : 'blog',
                    "parent": 'paypal',
					"feature" : "Blog",
					"heading" : "Write a blog post" ,
					"template" : "templates/components/admin/site/content/blog/post.html",
					"controller" : "postWizardController",
					"enabled" : true ,
					"completed" : false
				}

			]
		}
	}
});