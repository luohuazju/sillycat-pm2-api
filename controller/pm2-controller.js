const PM2Service = require("../service/pm2-service");

class PM2Controller {
  constructor() {
    this.pm2Service = new PM2Service();
  }

  async listAll(req, res) {
    try {
      // Logging parameters and body for debugging
      console.log("Params:", req.params);
      console.log("Body:", req.body);

      // Await the service call to ensure proper response handling
      const list = await this.pm2Service.listAll();

      // Send a JSON response
      res.json(list);
    } catch (error) {
      // Handle errors gracefully
      console.error("Error listing PM2 processes:", error);
      res.status(500).json({
        error: "Failed to retrieve PM2 processes",
        details: error.message,
      });
    }
  }
}

module.exports = PM2Controller;
