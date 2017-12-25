const IoC = require('AppIoC');
const fs = require('fs');
const path = require('path');

class EnvConfig {
  constructor() {
    if (fs.existsSync(path.join(process.cwd(), '.env'))) {
      require('dotenv').config();
    }
  }

  has(key) {
    return !!process.env[key];
  }

  get(key) {
    return process.env[key];
  }
}

// Register envConfig
IoC.singleton('app.envConfig', [], EnvConfig);
