

// An example configuration file.
exports.config = {
	sauceUser: 'johnrazmus',
	sauceKey: 'f82c9281-e5af-4e36-9385-7a2d4cc24b8c',

	capabilities: {
		'browserName': 'chrome'
	},

	maxSessions: 1,
	specs: [
		'e2e.tests.js'
	],
	jasmineNodeOpts: {
		showColors: true,
		defaultTimeoutInterval: 920000,
		isVerbose: true,
		realtimeFailure: true
	},
	params: {
		env: 'com',
		subdomain: 'testcases',
		user: {
			email: 'jawad@likastic.com',
			password: 'hello123'
		},
		non_admin_user: {
			email: 'moshin@likastic.com',
			password: 'hello123'
		},
		user_accessRights_lesser_than_admin: {
			email: 'mohsin@likastic.com',
			password: 'hello123'
		},
		user_accessRights_greater_orEqualTo_admin: {
			email: 'jawad@likastic.com',
			password: 'hello123'
		},
		new_assignee: {
			email: 'testAssigneeEmail@smartmember.com',
			first_name: 'tester',
			password: 'hello123'
		},
		importMembers: {
			email1: '1importTesterTest1@email.com',
			email2: '1importTesterTest2@email.com'
		},
		site: {
			name: 'Test Name',
			subdomain: 'jtest'
		},
		account: {
			username: 'jahmed',
			current_password: 'hello123',
			new_password: 'hello123',
			new_email: 'umer@likastic.com',
			full_name: 'Jawad Ahmed'
		},
		finance: {
			settings: {
				currency: 'USD'
			}
		},
		specialPages: {
			bonus: {
				embed_content: 'bonus embed content',
				title: 'bonus title',
				content: 'bonus content ',
				file_url: 'test url',
				free_item_text: 'free bonus button',
				free_item_url: 'Refund Page' //Currently only supports static urls
			},
			refund: {
				embed_content: 'refund embed content',
				title: 'refund title',
				content: 'refund content',
				file_url: 'test url',
				free_item_text: 'free bonus button',
				continue_refund_text: 'continue refund button',
				free_item_url: 'Refund Page' //Currently only supports static urls
			},
			localization: {
				syllabus_text: 'Test syllabus text',
				search_lesson_text: 'Test search lesson text',
				module_text: 'Test module text',
				course_info_text: 'Test course info text',
				lesson_text: 'Test lesson text',
				begin_course_text: 'Test begin course text'
			},
			sales_options: {
				sales_page_embed: 'sales page embed content',
				sales_page_content: 'sales page content',
				sales_page_outro: 'sales page outro'
			},
			jvtool: {
				embed_content: 'jvtool embed content',
				title: 'jvtool title',
				email_list: 'Test Email List',
				content: 'jvtool content',
				thankyou_content: 'jvtool thank you content',
				subscribe_button_text: 'jvtool subscribe button',
				redirect_url: 'Refund Page' //Currently only supports static urls
			},
			downloadpage: {
				download_center_text: 'Download Center Text',
				download_center_sub_text: 'Download Center Sub Text',
				downloads_text: 'Download Text',
				access_level_status_color: '#f00606'
			}
		},
		appearance: {
			facebook: {
				share_title: 'Facebook Share Title',
				share_description: 'Facebook Share Description'
			},
			directory: {
				title: 'directory title',
				brief_description: 'directory brief description',
				description: 'directory description',
				category: 'Facebook Marketing',
				pricing: '100',
				permalink: 'directory-1',
				expired_at: '12-01-2016',
				site_id: 6993 //the site to be approved
			}
		},
		marketing: {
			tracking_code: {
				facebook_retargetting_pixel: 'facebook_retargetting_12345678',
				google_analytics_id: 'google_analytics_12345678',
				facebook_conversion_pixel: 'facebook_conversion_12345678',
				bing_id: 'bing_12345678'
			}
		},
		affiliates: {
			affiliate: {
				affiliate_request_id: '123456',
				user_id: '123456',
				user_name: 'user_name_testname',
				user_email: 'user_email_test@test.com',
				user_country: 'user_country_testcountry',
				user_note: 'user_note_testnote',
				past_sales: '100',
				product_name: 'product_name_testproduct',
				admin_note: 'admin_note_testnote'
			},
			contest: {
				title: 'Affiliate contest title',
				start_date: '02-11-2015',
				end_date: '04-11-2015'
			}
		},
		note: {
			text: 'I am note text',
			permalink: 'Lesson-1'  //permalink of lesson where note is to be added
		},
		membership: {
			access_level: {
				name: 'Gold',
				information_url: 'Refund Page',
				redirect_url: '/free-bonus',
				product_id: 1234,
				jvzoo_button: 'JVZOO Button',
				payment_interval: 'One Time',
				price: 99,

			},
			access_pass: {
				user: 'mohsin@likastic.com',
				access_level: 'Gold',
				expired_at: '02-12-2015'
			},
			sm_member: {
				email: 'jawad2@likastic.com',
				access_level_name: 'SM Access',
				email: 'jawad2@likastic.com',
				password: 'hello123'
			}
		},
		smartmail: {
			email: {
				subject: 'Email Subject',
				body: 'Email Body',
				test_address: 'jawad@likastic.com',
				send_date: '02-11-2015',
				send_time: '11:00'
			},
			list: {
				name: 'Test Email List',
				subscriber_list: 'jawad@likastic.com \n adnan@likastic.com',
				subscriber_count: 2,
			}
		},
		company: {
			name: 'Test Company Changed'
		}
	},
	allScriptsTimeout: 920000,
	onPrepare: function()
	{
		var failFast = require('jasmine-fail-fast');
		jasmine.getEnv().addReporter(failFast.init());
		//browser.driver.get( 'http://' + browser.params.subdomain + '.smartmember.' + browser.params.env );
	}
};