const express = require('express');
const { exec } = require('child_process');
const cors = require('cors');
const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());

// List of allowed security tools for regression testing
const ALLOWED_TOOLS = ['nmap', 'ping', 'tracert', 'nslookup', 'whois'];

app.post('/api/execute', (req, res) => {
    const { tool, target, params } = req.body;

    if (!ALLOWED_TOOLS.includes(tool)) {
        return res.status(403).json({ error: 'Unauthorized tool requested.' });
    }

    // Basic sanitization to prevent command injection
    const sanitizedTarget = target.replace(/[^a-zA-Z0-9.-]/g, '');
    const sanitizedParams = params.replace(/[;&|`$]/g, '');

    const fullCommand = `${tool} ${sanitizedParams} ${sanitizedTarget}`;

    exec(fullCommand, (error, stdout, stderr) => {
        if (error) {
            return res.json({ output: stdout, error: stderr || error.message });
        }
        res.json({ output: stdout, error: stderr });
    });
});

app.listen(port, () => {
    console.log(`Aegis Engine running at http://localhost:${port}`);
});
