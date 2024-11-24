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

// // Route to list all PM2 processes
// app.get("/list", (req, res) => {
//   pm2.list((err, processList) => {
//     if (err) {
//       return res.status(500).json({ error: "Failed to retrieve process list", details: err.message });
//     }
//     res.json(processList);
//   });
// });

// // Route to start a new PM2 process
// app.post("/start", (req, res) => {
//   const { script, name, args } = req.body;

//   if (!script || !name) {
//     return res.status(400).json({ error: "Missing required fields: 'script' and 'name'" });
//   }

//   pm2.start(
//     {
//       script,
//       name,
//       args: args || [],
//     },
//     (err, proc) => {
//       if (err) {
//         return res.status(500).json({ error: "Failed to start process", details: err.message });
//       }
//       res.json({ message: "Process started", process: proc });
//     }
//   );
// });

// // Route to stop a PM2 process
// app.post("/stop", (req, res) => {
//   const { name } = req.body;

//   if (!name) {
//     return res.status(400).json({ error: "Missing required field: 'name'" });
//   }

//   pm2.stop(name, (err) => {
//     if (err) {
//       return res.status(500).json({ error: "Failed to stop process", details: err.message });
//     }
//     res.json({ message: `Process '${name}' stopped` });
//   });
// });

// // Route to delete a PM2 process
// app.post("/delete", (req, res) => {
//   const { name } = req.body;

//   if (!name) {
//     return res.status(400).json({ error: "Missing required field: 'name'" });
//   }

//   pm2.delete(name, (err) => {
//     if (err) {
//       return res.status(500).json({ error: "Failed to delete process", details: err.message });
//     }
//     res.json({ message: `Process '${name}' deleted` });
//   });
// });

// // Route to restart a PM2 process
// app.post("/restart", (req, res) => {
//   const { name } = req.body;

//   if (!name) {
//     return res.status(400).json({ error: "Missing required field: 'name'" });
//   }

//   pm2.restart(name, (err) => {
//     if (err) {
//       return res.status(500).json({ error: "Failed to restart process", details: err.message });
//     }
//     res.json({ message: `Process '${name}' restarted` });
//   });
// });

// // Route to reload all processes
// app.post("/reload", (req, res) => {
//   pm2.reload("all", (err) => {
//     if (err) {
//       return res.status(500).json({ error: "Failed to reload processes", details: err.message });
//     }
//     res.json({ message: "All processes reloaded" });
//   });
// });
