const express = require("express");
const pm2 = require("pm2");
const bodyParser = require('body-parser');
const logger = require('morgan');
const errorHandler = require('errorhandler');
const expressStatusMonitor = require('express-status-monitor');
const router = require('./router');
const setSwagger = require('./swagger');

(async() => {
  /**
   * Create Express server.
   */
  const app = express();

  /**
   * Express configuration.
   */
  app.set('host', process.env.HOST || '0.0.0.0');
  app.set('port', process.env.PORT || 8088);
  app.use(expressStatusMonitor());
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  
  app.use((req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, DELETE, PUT, PATCH, OPTIONS'
      );
      res.setHeader(
        'Access-Control-Allow-Headers',
        'Content-Type, api_key, Authorization'
      );
      next();
  });

  app.use('/', router);
  setSwagger(app);

  /**
   * Error Handler.
   */
  if (process.env.NODE_ENV === 'development') {
      // only use in development
      app.use(errorHandler());
  } else {
      app.use((err, req, res, next) => {
          console.error(err);
          res.status(500).send('Server Error');
      });
  }
  
  /**
   * Start Express server.
   */
  app.listen(app.get('port'), () => {
      console.log('App is running at http://localhost:%d in %s mode', app.get('port'), app.get('env'));
      console.log('  Press CTRL-C to stop\n');
  });

  module.exports = app;

})();
