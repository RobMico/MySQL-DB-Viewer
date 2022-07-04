var winston = require('winston');


const { dirname } = require('path');
const appRoot = dirname(require.main.filename);

var options = {
  file: {
    level: 'info',
    name: 'file.info',
    filename: `${appRoot}/logs/app.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 100,
    colorize: true,
  },
  errorFile: {
    level: 'error',
    name: 'file.error',
    filename: `${appRoot}/logs/error.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 100,
    colorize: true,
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
  },
};




// your centralized logger object
let logger = winston.createLogger({
  transports: [
    //new (winston.transports.Console)(options.console),
    new (winston.transports.File)(options.errorFile),
    new (winston.transports.File)(options.file)
  ],
  exitOnError: false, // do not exit on handled exceptions
});



module.exports = function (module) {
  var filename = module.id;
  return {
    info : function (msg, vars) { 
      logger.info(msg, [filename, vars]); 
    },
    debug : function (msg, vars) {       
      logger.debug(msg, [filename, vars]); 
    },
    error : function (msg, vars) {
      logger.error(msg, [filename, vars]); 
    }
  }
};

//module.exports = logger;