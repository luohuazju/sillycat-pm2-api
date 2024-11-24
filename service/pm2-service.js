const pm2 = require("pm2");

class PM2Service {
  constructor() {
    this.connectToPM2();
  }

  /**
   * Establishes a connection to the PM2 API.
   * Ensures that the connection is established only once.
   */
  connectToPM2() {
    pm2.connect((err) => {
      if (err) {
        console.error("Error connecting to PM2:", err.message);
        process.exit(2); // Exit with a non-zero status to signal a critical failure
      }
      console.log("Connected to PM2 successfully.");
    });
  }

  /**
   * Disconnects from the PM2 API to clean up resources.
   * Should be called when the application is shutting down.
   */
  disconnectFromPM2() {
    pm2.disconnect((err) => {
      if (err) {
        console.error("Error disconnecting from PM2:", err.message);
      } else {
        console.log("Disconnected from PM2.");
      }
    });
  }

  /**
   * Retrieves the list of all PM2-managed processes.
   * @returns {Promise<Object>} Resolves with the list of processes or rejects with an error.
   */
  async listAll() {
    try {
      const processList = await new Promise((resolve, reject) => {
        pm2.list((err, list) => {
          if (err) return reject(err);
          resolve(list);
        });
      });
      return processList; // Return the list directly without unnecessary JSON.parse
    } catch (err) {
      console.error("Failed to retrieve PM2 process list:", err.message);
      throw new Error("Failed to retrieve process list");
    }
  }
}

module.exports = PM2Service;
