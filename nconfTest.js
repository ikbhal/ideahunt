var nconf = require('nconf');
nconf.argv()
       .env()
       .file({ file: 'config/twitter_oauth.json' });

console.log(nconf.get('consumerKey')+";"+nconf.get('consumerSecret')+";"+nconf.get('callbackURL')+";");