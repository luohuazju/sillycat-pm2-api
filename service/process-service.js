const { exec } = require('child_process');
const util = require('util');

// Convert exec to a promise-based function
const execPromise = util.promisify(exec);

class ProcessService {
    async pmScale(name, instances) {
        if (!name || !instances) {
            throw new Error("Missing required fileds: 'name' and 'instances'");
        }
        const command = `/opt/pm2 scale ${name} ${instances}`;
        try {
            const { stdout, stderr } = await execPromise(command);
            // If there's standard error output, consider it a warning
            if (stderr) {
                console.warn(`Warning: ${stderr}`);
            }
            return stdout; // Return the successful output
        } catch (error) {
            // Handle command execution errors
            console.error(`Error executing command: ${error.message}`);
            throw new Error(error.message);
        }
    }
}

module.exports = ProcessService;
