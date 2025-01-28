
const dotenv = require('dotenv');
const path = require('path');

function environmentLoader(env = 'dev') {
  switch (env) {
    case 'test':
      return dotenv.config({ path: path.resolve(process.cwd(), '.env.test') });
    case 'dev':
      return dotenv.config({ path: path.resolve(process.cwd(), '.env.dev') });
    case 'prod':
      return dotenv.config({ path: path.resolve(process.cwd(), '.env.prod') });
    default:
    
      return dotenv.config({ path: path.resolve(process.cwd(), '.env.dev') });
  }
}

module.exports = environmentLoader;
