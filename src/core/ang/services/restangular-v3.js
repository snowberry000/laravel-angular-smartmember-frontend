app.factory('RestangularV3', function(Restangular , $location) {
   return Restangular.withConfig(function(RestangularConfigurer) {
   		var domainParts = $location.host().split( '.' );

		//this is here to account for country second level domains such as .co.uk, otherwise those would break
		if( domainParts.length > 2 )
		{
			var env = domainParts.pop();
			var domain = domainParts.pop();

			if( env.length < 3 && domain.length <= 3 )
			{
				env = domain + "." + env;
				domain = domainParts.pop();
			}

			domain = domain + "." + env;
		}
		else
		{
			var env = domainParts.pop();
			var domain = domainParts.pop() + "." + env;
		}
   		var apiURL = "http" + (env == 'site' || env == 'com' || env == 'org' || env == 'info' ? 's' : '') + "://api-3." + (domain.indexOf( 'smartmember' ) < 0 ? 'smartmember.com' : domain);
      	RestangularConfigurer.setBaseUrl(apiURL);
      	RestangularConfigurer.setDefaultHeaders( { 'Content-Type': 'application/json' } );
   });
});