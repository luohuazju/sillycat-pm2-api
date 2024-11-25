const express = require('express');

/**
 * controllers (route handlers). 
 */
const PM2Controller = require('./controller/pm2-controller');

const pm2Controller = new PM2Controller();
//routing configuration
var router = express.Router();

/**
 * @swagger
 * definitions:
 *   Application:
 *     properties:
 *       name:
 *         type: string
 *       path:
 *         type: string
 *       id:
 *         type: integer
 */

/**
 * @swagger
 * /api/v1/accounts:
 *   get:
 *     tags:
 *       - account
 *     descriptions: Return all pm2 applications
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: an array of apps 
 *         schema:
 *           $ref: '#/definitions/Application'
 */
router.get('/api/v1/applications', pm2Controller.listAll);

router.post('/api/v1/applications', pm2Controller.createApplication);
router.post('/api/v1/applications/stop', pm2Controller.stopApplication);
router.post('/api/v1/applications/delete', pm2Controller.deleteApplication);
router.post('/api/v1/applications/restart', pm2Controller.restartApplication);


module.exports = router;