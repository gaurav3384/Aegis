const express = require('express');
const { spawn } = require('child_process');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

const port = 4000;

app.use(cors());
app.use(express.json());

// Ensure reports directory exists
const REPORTS_DIR = path.join(__dirname, 'reports');
if (!fs.existsSync(REPORTS_DIR)) {
    fs.mkdirSync(REPORTS_DIR);
}

const ALLOWED_TOOLS = ['nmap', 'ping', 'tracert', 'nslookup', 'whois'];

io.on('connection', (socket) => {
    console.log('Client connected to Aegis Socket');

    socket.on('execute_command', ({ tool, target, params }) => {
        if (!ALLOWED_TOOLS.includes(tool)) {
            socket.emit('output', 'Error: Unauthorized tool.\n');
            return;
        }

        const sanitizedTarget = target.replace(/[^a-zA-Z0-9.-]/g, '');
        const sanitizedParams = params.split(' ').filter(p => !/[;&|`$]/.test(p));

        socket.emit('output', `[+] Initializing ${tool} ${params} ${sanitizedTarget}...\n`);

        // Use spawn for real-time streaming
        const child = spawn(tool, [...sanitizedParams, sanitizedTarget], { shell: true });

        child.stdout.on('data', (data) => {
            socket.emit('output', data.toString());
        });

        child.stderr.on('data', (data) => {
            socket.emit('output', `[!] ${data.toString()}`);
        });

        child.on('close', (code) => {
            socket.emit('output', `\n[√] Process completed with code ${code}\n`);
            socket.emit('command_complete', { code });
        });
    });

    socket.on('save_report', ({ target, tool, output }) => {
        const filename = `report_${Date.now()}_${target}.md`;
        const content = `# Aegis Scan Report\n\n- **Target:** ${target}\n- **Tool:** ${tool}\n- **Date:** ${new Date().toISOString()}\n\n## Output\n\`\`\`\n${output}\n\`\`\``;
        
        fs.writeFile(path.join(REPORTS_DIR, filename), content, (err) => {
            if (err) socket.emit('output', '[!] Failed to save report.\n');
            else socket.emit('output', `[+] Report saved: ${filename}\n`);
        });
    });
});

server.listen(port, () => {
    console.log(`Aegis Streaming Engine running at http://localhost:${port}`);
});
