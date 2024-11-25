const PM2Service = require("../service/pm2-service");

class PM2Controller {
  constructor() {
    this.pm2Service = new PM2Service();
    this.listAll = this.listAll.bind(this);
    this.createApplication = this.createApplication.bind(this);
  }

  async createApplication(req, res) {
    try {
      const { script, name, args, cwd, instances } = req.body;
      if (!script || !name || !cwd) {
        return res.status(400).json({ error: "Missing required fields: 'script' and 'name' and 'cwd'" });
      }
      const process = await this.pm2Service.createApplication(name, script, args, cwd, instances);
      res.json(process);
    } catch (error) {
      // Handle errors gracefully
      console.error("Error listing PM2 processes:", error);
      res.status(500).json({
        error: "Failed to retrieve PM2 processes",
        details: error.message,
      });
    }
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
