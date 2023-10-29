const { exec } = require('child_process');

// Get the version bump type (major, minor, patch) from the first script argument
const versionBumpType = process.argv[2];

// Execute the npm version command with the desired message format
exec(`npm version ${versionBumpType} -m "Bump ${versionBumpType} version to %s  [skip ci]"`, (error, stdout, stderr) => {
    if (error) {
        console.error(`Error: ${error.message}`);
        return;
    }

    if (stderr) {
        console.error(`Error: ${stderr}`);
        return;
    }

    console.log(`Output: ${stdout}`);
});