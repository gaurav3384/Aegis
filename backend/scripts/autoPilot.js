const { spawn } = require('child_process');

/**
 * AEGIS ADVANCED ADVERSARIAL ENGINE
 * Multi-stage deep auditing with CVE lookup and service fingerprinting.
 */
async function runAutoScan(target, socket) {
    socket.emit('output', `\n[!] INITIALIZING ADVERSARIAL ENGINE FOR: ${target}\n`);
    socket.emit('output', `[1/4] PHASE: STEALTH ENUMERATION & FINGERPRINTING...\n`);

    // Advanced Nmap: Service Version, Default Scripts, and Vulners CVE lookup
    // Using --script=vulners for CVE correlation
    const args = [
        '-sV', 
        '-sC', 
        '--open', 
        '--script=vulners', 
        '-T4', 
        target
    ];

    const scanProcess = spawn('nmap', args, { shell: true });
    let scanData = '';

    scanProcess.stdout.on('data', (data) => {
        const chunk = data.toString();
        scanData += chunk;
        socket.emit('output', chunk);
    });

    scanProcess.on('close', async (code) => {
        if (code !== 0) {
            socket.emit('output', `\n[!] SCAN_ERROR: Engine failed with code ${code}. Check target accessibility.\n`);
            socket.emit('command_complete', { code });
            return;
        }

        socket.emit('output', `\n[2/4] PHASE: ADVERSARIAL LOGIC & VECTOR CORRELATION...\n`);
        
        const intelligence = analyzeAdvancedFindings(scanData);
        
        socket.emit('output', `\n------------------------------------------------------------\n`);
        socket.emit('output', `[3/4] AEGIS THREAT INTELLIGENCE SUMMARY\n`);
        socket.emit('output', `------------------------------------------------------------\n`);
        
        if (intelligence.vectors.length === 0) {
            socket.emit('output', `[+] Surface appears hardened at first pass.\n`);
            socket.emit('output', `[>] Next Step: Attempt blind OS fingerprinting (-O) and UDP audit.\n`);
        } else {
            intelligence.vectors.forEach(v => {
                socket.emit('output', `[✘] VECTOR: ${v.title}\n`);
                socket.emit('output', `    - SEVERITY: ${v.severity}\n`);
                socket.emit('output', `    - ATTACK_STRATEGY: ${v.strategy}\n`);
                socket.emit('output', `    - CVE_REFERENCE: ${v.cve || 'N/A'}\n\n`);
            });
        }

        socket.emit('output', `[4/4] OPERATION COMPLETE. SHUTTING DOWN AEGIS ENGINE.\n`);
        socket.emit('command_complete', { code: 0 });
    });
}

function analyzeAdvancedFindings(data) {
    const intel = { vectors: [] };

    // Service-Specific Deep Analysis
    const patterns = [
        {
            regex: /21\/tcp.*open.*ftp.*(vsftpd 2\.3\.4)/i,
            title: 'Backdoored FTP Daemon (vsftpd 2.3.4)',
            severity: 'CRITICAL',
            strategy: 'Trigger backdoor with ":)" in username. Execute remote shell on port 6200.',
            cve: 'CVE-2011-2523'
        },
        {
            regex: /445\/tcp.*open.*microsoft-ds/i,
            title: 'SMB EternalBlue Candidate',
            severity: 'CRITICAL',
            strategy: 'Attempt MS17-010 buffer overflow via doublepulsar. Possible kernel-level RCE.',
            cve: 'MS17-010'
        },
        {
            regex: /3306\/tcp.*open.*mysql/i,
            title: 'Exposed Database Instance (MySQL)',
            severity: 'HIGH',
            strategy: 'Attempt brute-force for root@localhost. Check for "select load_file" for LFI-to-RCE.',
            cve: 'OWASP-M1'
        },
        {
            regex: /6379\/tcp.*open.*redis/i,
            title: 'Unauthenticated Redis Key-Value Store',
            severity: 'CRITICAL',
            strategy: 'Write SSH public key to /root/.ssh/authorized_keys via CONFIG command.',
            cve: 'N/A'
        },
        {
            regex: /8080\/tcp.*open.*http.*(jenkins|tomcat)/i,
            title: 'Exposed CI/CD Pipeline (Jenkins/Tomcat)',
            severity: 'HIGH',
            strategy: 'Access Script Console for Groovy-based shell execution. Check default admin/admin.',
            cve: 'CVE-2018-1000861'
        },
        {
            regex: /80\/tcp.*open.*http.*Apache/i,
            title: 'Web Server Fingerprinted (Apache)',
            severity: 'MEDIUM',
            strategy: 'Run Nikto/Dirsearch to find .env or .git directories. Check for Log4j vulnerability if Java headers present.',
            cve: 'CWE-200'
        }
    ];

    patterns.forEach(p => {
        if (p.regex.test(data)) {
            intel.vectors.push(p);
        }
    });

    return intel;
}

module.exports = { runAutoScan };
