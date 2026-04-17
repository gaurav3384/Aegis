const { spawn } = require('child_process');

/**
 * Aegis Automated Reconnaissance & Analysis Script
 * Performs multi-stage scanning and provides intrusion analysis.
 */
async function runAutoScan(target, socket) {
    socket.emit('output', `\n[!] INITIALIZING AEGIS AUTO-PILOT FOR: ${target}\n`);
    socket.emit('output', `[1/3] Phase 1: Rapid Port Discovery...\n`);

    // Stage 1: Port Scan
    const nmap = spawn('nmap', ['-F', '--open', target], { shell: true });
    let scanData = '';

    nmap.stdout.on('data', (data) => {
        const chunk = data.toString();
        scanData += chunk;
        socket.emit('output', chunk);
    });

    nmap.on('close', async () => {
        socket.emit('output', `\n[2/3] Phase 2: Vulnerability Surface Analysis...\n`);
        
        // Simple heuristic analysis for demonstration
        const findings = analyzeFindings(scanData);
        
        socket.emit('output', `\n------------------------------------------------\n`);
        socket.emit('output', `[3/3] Phase 3: AEGIS INTELLIGENCE SUMMARY\n`);
        socket.emit('output', `------------------------------------------------\n`);
        
        if (findings.length === 0) {
            socket.emit('output', `[+] No immediate entry points discovered via rapid scan.\n`);
            socket.emit('output', `[>] Recommendation: Perform a deep service-scan (-sV).\n`);
        } else {
            findings.forEach(f => {
                socket.emit('output', `[!] POTENTIAL VECTOR: ${f.vector}\n`);
                socket.emit('output', `    - Risk: ${f.risk}\n`);
                socket.emit('output', `    - Method: ${f.method}\n\n`);
            });
        }
        
        socket.emit('command_complete', { code: 0 });
    });
}

function analyzeFindings(data) {
    const findings = [];
    if (data.includes('21/tcp')) {
        findings.push({
            vector: 'FTP Service Detected (Port 21)',
            risk: 'CRITICAL',
            method: 'Check for anonymous login or brute-force weak credentials. Investigate for exploit CVE-2011-2523 if vsftpd 2.3.4 is present.'
        });
    }
    if (data.includes('22/tcp')) {
        findings.push({
            vector: 'SSH Management (Port 22)',
            risk: 'MEDIUM',
            method: 'Verify SSH version. Check for known banner leakage. Test for default root credentials if it is an IoT device.'
        });
    }
    if (data.includes('80/tcp') || data.includes('443/tcp')) {
        findings.push({
            vector: 'Web Application Surface (Port 80/443)',
            risk: 'HIGH',
            method: 'Perform directory busting (dirb/gobuster). Check for SQLi on parameters and XSS in entry fields. Look for /admin or /.git directories.'
        });
    }
    if (data.includes('445/tcp') || data.includes('139/tcp')) {
        findings.push({
            vector: 'SMB File Sharing (Port 445)',
            risk: 'CRITICAL',
            method: 'Check for EternalBlue (MS17-010) vulnerability. Attempt null session login to list shares.'
        });
    }
    if (data.includes('3389/tcp')) {
        findings.push({
            vector: 'RDP Remote Desktop (Port 3389)',
            risk: 'HIGH',
            method: 'Check for BlueKeep (CVE-2019-0708). Attempt brute-force if NLA is disabled.'
        });
    }
    return findings;
}

module.exports = { runAutoScan };
