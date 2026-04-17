const { spawn } = require('child_process');

/**
 * AEGIS OWASP COMPLIANCE ENGINE
 * Integrates automated web auditing mapped to OWASP Top 10 categories.
 */
async function runAutoScan(target, socket) {
    socket.emit('output', `\n[!] INITIALIZING OWASP COMPLIANCE AUDIT FOR: ${target}\n`);
    
    // Phase 1: Service Discovery
    socket.emit('output', `[1/5] PHASE: ADVERSARIAL RECONNAISSANCE...\n`);
    const nmapBase = await runProcess('nmap', ['-sV', '--open', target], socket);

    // Phase 2: Web Surface Analysis (OWASP A01, A05)
    if (nmapBase.includes('80/tcp') || nmapBase.includes('443/tcp') || nmapBase.includes('8080/tcp')) {
        socket.emit('output', `\n[2/5] PHASE: OWASP WEB AUDIT (A01:2021, A05:2021)...\n`);
        // Running focused OWASP scripts: Enum, Vuln, Methods, Headers
        await runProcess('nmap', [
            '-p80,443,8080',
            '--script=http-enum,http-methods,http-security-headers,http-vuln-*',
            target
        ], socket);
    }

    // Phase 3: Infrastructure Vulnerabilities (OWASP A06)
    socket.emit('output', `\n[3/5] PHASE: INFRASTRUCTURE AUDIT (A06:2021)...\n`);
    const vulnData = await runProcess('nmap', ['--script=vulners', '-sV', target], socket);

    socket.emit('output', `\n[4/5] PHASE: AEGIS INTELLIGENCE CORRELATION...\n`);
    const intelligence = analyzeOWASPFindings(nmapBase + vulnData);

    socket.emit('output', `\n------------------------------------------------------------\n`);
    socket.emit('output', `[5/5] AEGIS // OWASP COMPLIANCE SUMMARY\n`);
    socket.emit('output', `------------------------------------------------------------\n`);

    if (intelligence.length === 0) {
        socket.emit('output', `[+] No critical OWASP Top 10 violations detected.\n`);
    } else {
        intelligence.forEach(v => {
            socket.emit('output', `[!] OWASP_${v.category}: ${v.title}\n`);
            socket.emit('output', `    - RISK: ${v.severity}\n`);
            socket.emit('output', `    - DESCRIPTION: ${v.desc}\n`);
            socket.emit('output', `    - FIX: ${v.remediation}\n\n`);
        });
    }

    socket.emit('command_complete', { code: 0 });
}

async function runProcess(cmd, args, socket) {
    return new Promise((resolve) => {
        const child = spawn(cmd, args, { shell: true });
        let buffer = '';
        child.stdout.on('data', (data) => {
            const chunk = data.toString();
            buffer += chunk;
            socket.emit('output', chunk);
        });
        child.on('close', () => resolve(buffer));
    });
}

function analyzeOWASPFindings(data) {
    const findings = [];
    
    const owaspMap = [
        {
            test: /http-methods.*(PUT|DELETE|TRACE)/i,
            category: 'A01:2021',
            title: 'Broken Access Control (Dangerous HTTP Methods)',
            severity: 'HIGH',
            desc: 'Dangerous HTTP methods like PUT or DELETE are enabled, allowing unauthorized file manipulation.',
            remediation: 'Disable unnecessary HTTP methods in the web server configuration.'
        },
        {
            test: /sql-injection|sqli/i,
            category: 'A03:2021',
            title: 'Injection (SQLi)',
            severity: 'CRITICAL',
            desc: 'Potential SQL injection point detected via automated script auditing.',
            remediation: 'Use parameterized queries and implement strict input validation.'
        },
        {
            test: /http-security-headers.*missing/i,
            category: 'A05:2021',
            title: 'Security Misconfiguration (Missing Headers)',
            severity: 'MEDIUM',
            desc: 'Security headers like HSTS, CSP, or X-Content-Type-Options are missing.',
            remediation: 'Implement recommended security headers to prevent XSS and Clickjacking.'
        },
        {
            test: /CVE-2021-44228|log4shell/i,
            category: 'A06:2021',
            title: 'Vulnerable and Outdated Components (Log4Shell)',
            severity: 'CRITICAL',
            desc: 'Remote Code Execution vulnerability in Log4j detected.',
            remediation: 'Patch Log4j to the latest version immediately.'
        },
        {
            test: /3306\/tcp.*open.*mysql|5432\/tcp.*open.*postgresql/i,
            category: 'A07:2021',
            title: 'Identification and Authentication Failures (Exposed DB)',
            severity: 'HIGH',
            desc: 'Database port exposed to the public internet.',
            remediation: 'Restrict database access to localhost or internal VPN IPs only.'
        }
    ];

    owaspMap.forEach(m => {
        if (m.test.test(data)) findings.push(m);
    });

    return findings;
}

module.exports = { runAutoScan };
