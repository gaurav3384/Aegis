# Aegis: Enterprise-Grade Pentesting & OWASP Compliance Dashboard

Aegis is a professional-grade Security Operations Center (SOC) dashboard designed for Certified Ethical Hackers (CEH) and cybersecurity firms. It provides an automated, adversarial-first environment for regression testing, vulnerability management, and OWASP compliance auditing.

## 🛡️ Strategic Architecture

Aegis operates on a **Local-Execution / Remote-Orchestration** model. It utilizes the host machine's raw processing power and installed security toolchain while providing a premium, high-fidelity web interface for real-time monitoring and reporting.

### 🧩 Core Engine Components
| Layer | Component | Description |
| :--- | :--- | :--- |
| **Orchestration** | React 18 + Vite | Monospace "Pentest OS" UI with Tailwind CSS v4 and WebSocket integration. |
| **Execution** | Node.js Streaming Engine | Asynchronous process management using `spawn` for real-time binary streaming. |
| **Intelligence** | Adversarial Logic | Heuristic engine that correlates raw service data into actionable attack vectors. |
| **Compliance** | OWASP Module | Automated auditing mapped to the OWASP Top 10 (2021) standards. |

---

## ✨ Advanced Features

### 1. ⚡ Aegis Auto-Pilot (Adversarial Engine)
The Auto-Pilot module is a multi-phase reconnaissance and auditing pipeline:
- **Phase 1: Stealth Enumeration:** Rapid discovery of open surfaces.
- **Phase 2: Service Fingerprinting:** Deep version detection and OS identification.
- **Phase 3: CVE Correlation:** Real-time mapping of service banners to the global CVE database using the `vulners` engine.
- **Phase 4: Threat Intelligence:** Final synthesis of discovered vectors with detailed attack strategies.

### 2. 🔐 OWASP Compliance Module
Automated web auditing focused on the **OWASP Top 10** categories:
- **A01: Broken Access Control:** Detection of dangerous HTTP methods (PUT, DELETE, TRACE).
- **A03: Injection:** Heuristic identification of potential SQLi and Command Injection surfaces.
- **A05: Security Misconfiguration:** Analysis of missing security headers and verbose error messaging.
- **A06: Vulnerable Components:** Automatic identification of critical vulnerabilities like Log4Shell (CVE-2021-44228).
- **A07: Authentication Failures:** Identification of exposed database instances (MySQL, Postgres, Redis).

### 3. 📡 Real-Time Streaming Terminal
Utilizing WebSockets (`Socket.io`), Aegis provides a zero-latency terminal experience. Output from system binaries like `nmap` is streamed line-by-line, allowing hackers to react to discoveries in real-time without waiting for process completion.

### 4. 📊 Automated Reporting
Every scan session can be exported into a professional Markdown (`.md`) report. These reports include:
- Target metadata and timestamps.
- Raw console logs for audit trails.
- Categorized findings with remediation strategies.

---

## 📜 Design Document: The "Aegis" Methodology

### Adversarial Logic & Heuristics
Unlike basic scanners, Aegis doesn't just report "Port 80 is open." It interprets the environment. For example, if it detects `vsftpd 2.3.4`, it automatically tags it as **CRITICAL** and provides the specific exploitation methodology for the known 2011 backdoor.

### Compliance Mapping
The OWASP module uses focused Nmap Scripting Engine (NSE) scripts to query the target. The backend `autoPilot.js` then parses these specific script results and maps them to the 2021 OWASP categories, providing a business-ready compliance view.

### Security Sanitization
The system is built with **Command Injection Prevention**:
- **Target Sanitization:** Strict regex limits inputs to valid IPs or hostnames.
- **Parameter Blacklisting:** Prevents the use of shell operators (`&`, `;`, `|`) to ensure the user stays within the authorized toolchain.

---

## 🛠️ Installation & Expert Setup

### Prerequisites
- **Node.js 20+**
- **Security Binaries:** `nmap` must be globally accessible in your PATH.

### 1. Initialize the Adversarial Engine
```bash
cd backend
npm install
node server.js
```
*Port 4000 (WebSocket & API Engine).*

### 2. Launch the Pentest Dashboard
```bash
cd frontend
npm install
npm run dev
```
*Access via `http://localhost:5173`.*

---

## 📈 Roadmap
- [ ] **Aegis-Cloud:** Remote agent support for distributed scanning.
- [ ] **Wasm-Sandbox:** Integrated terminal for safe script execution via WebAssembly.
- [ ] **PDF Engine:** One-click professional PDF generation for client delivery.

---
*Developed for gaurav3384 — The ultimate professional security audit suite.*
