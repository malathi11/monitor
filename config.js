/*
* Create and export configuration variables
* 
*/

var environments = {};

// Staging (default) environment

environments.staging = {
	'httpPort' : 3000,
	'httpsPort' : 3001,
	'envName' : 'staging'
};


environments.production = {
	'httpPort' : 5000,
	'httpsPort' : 5001,
	'envName' : 'production'
};

// Determine which was passed.

console.log(process.env.NODE_ENV);
var currentEnv  = typeof(process.env.NODE_ENV) == 'string' 
					? process.env.NODE_ENV.toLowerCase() : ''


//Check the environment is one of the environments alone.

var environmentToExport = typeof(environments[currentEnv]) == 'object' ? environments[currentEnv] : environments.staging

module.exports = environmentToExport