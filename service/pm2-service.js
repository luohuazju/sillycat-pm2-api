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
          if (err) { return reject(err); }
          resolve(list);
        });
      });
      return processList; // Return the list directly without unnecessary JSON.parse
    } catch (err) {
      console.error("Failed to retrieve PM2 process list:", err.message);
      throw new Error("Failed to retrieve process list");
    }
  }

  async deleteApplication(name) {
    if (!name) {
      throw new Error("Missing required fileds: 'name'");
    }
    try {
      const msg = await new Promise((resolve, reject)=> {
        pm2.delete(name, (err) => {
          if (err) { return reject(err); }
          resolve({ message: `Process '${name}' deleted` });
        });
      });
      return msg;
    } catch (err) {
      console.error("Failed to delete PM2 process", err.message);
      throw new Error("Failed to delete PM2 process");
    }
  }

  async stopApplication(name) {
    if (!name) {
      throw new Error("Missing required fileds: 'name'");
    }
    try {
      const msg = await new Promise((resolve, reject)=> {
        pm2.stop(name, (err) => {
          if (err) { return reject(err); }
          resolve({ message: `Process '${name}' stopped` });
        });
      });
      return msg;
    } catch (err) {
      console.error("Failed to stop PM2 process", err.message);
      throw new Error("Failed to stop PM2 process");
    }
  }

  async restartApplication(name) {
    if (!name) {
      throw new Error("Missing required fields: 'name'");
    }
    try {
      const updateProcess = await new Promise((resolve, reject)=> {
        pm2.restart(name, (err, proc) => {
            if (err) { return reject(err); }
            resolve(proc);
          });
      });
      return updateProcess;
    } catch (err) {
      console.error("Failed to restart PM2 process", err.message);
      throw new Error("Failed to restart a process");
    }
  }

  async createApplication(name, script, args, cwd, instances){
    if (!script || !name || !cwd ) {
      throw new Error("Missing required fields: 'script' and 'name' and 'cwd'");
    }
    try {
      const process = await new Promise((resolve, reject)=> {
        pm2.start(
          {
            script: 'bash',
            name,
            args: [ '-c', args ] || [],
            cwd: cwd,
            interpreter: 'none',
            instances: instances || 1,
            watch: true,
          },
          (err, proc) => {
            if (err) { return reject(err); }
            resolve(proc);
          }
        );
      });
      return process;
    } catch (err) {
      console.error("Failed to create PM2 process", err.message);
      throw new Error("Failed to create a new process");
    }
  }
}

module.exports = PM2Service;
