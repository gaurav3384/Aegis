# Aegis: Professional Pentesting & Regression Dashboard

Aegis is a high-fidelity Security Operations Center (SOC) dashboard designed for Certified Ethical Hackers (CEH) to perform authorized regression testing. It transforms a local machine into a powerful security engine with a premium "Pentest OS" web interface.

## 🛡️ Architecture & Design Philosophy

Aegis is built on a **Local-First / Stealth-First** architecture, ensuring that sensitive security scans are executed directly from the user's infrastructure while providing a modern, centralized UI for orchestration.

### 🧩 System Components
| Component | Technology | Role |
| :--- | :--- | :--- |
| **Aegis UI** | React 18 + Vite | Monospace, high-contrast dashboard with Tailwind CSS v4. |
| **Aegis Engine** | Node.js (Express) | Bridge to the OS terminal for executing authorized security binaries. |
| **Toolchain** | Nmap, Ping, etc. | Native system tools utilized for deep packet and network analysis. |
| **Knowledge Base** | Integrated JSON | Real-time cheatsheets and "Next Step" logic for each module. |

---

## ✨ Key Features

- **Live Command Streaming:** Execute network scans and view real-time console output in a high-fidelity terminal emulator.
- **Interactive Cheatsheets:** Built-in references for `nmap`, `ping`, and `tracert` with guidance on when to use specific flags.
- **Vulnerability Guidance:** Contextual "Next Step" advice after each command to guide the user through the pentesting lifecycle.
- **Sanitized Execution:** A security-aware backend that prevents command injection while allowing flexible parameter tuning.

---

## 🛠️ Installation & Setup

### Prerequisites
- **Node.js 20+**
- **Security Tools:** Ensure `nmap` is installed and available in your system's PATH.

### 1. Initialize the Engine (Backend)
```bash
cd backend
npm install
node server.js
```
*Runs on port `4000`.*

### 2. Launch the Dashboard (Frontend)
```bash
cd frontend
npm install
npm run dev
```
*Access via `http://localhost:5173`.*

---

## 📖 Ethical Hacking Workflow

Aegis follows the professional pentesting lifecycle:

1.  **Reconnaissance:** Use `Ping` and `DNS Query` to verify target availability.
2.  **Scanning:** Execute `Nmap` with the version detection (`-sV`) or aggressive (`-A`) flags.
3.  **Analysis:** Consult the integrated Cheatsheet for guidance on findings.
4.  **Exploration:** Follow the "Next Step" prompts to move into service-specific testing.

---

## 📜 Design Document: Security Engine

### Command Sanitization Logic
The Aegis Engine utilizes a strict regex-based whitelist for targets and a blacklist for dangerous shell operators (`&`, `;`, `|`, `` ` ``, `$`). This ensures that even in an interactive environment, the risk of arbitrary command injection is minimized.

### Terminal UI Specs
- **Color Palette:** Aegis Cyan (`#00f2ff`), Aegis Red (`#ff003c`), Carbon Black (`#050505`).
- **Typography:** JetBrains Mono for all data-heavy components.
- **Feedback:** Real-time pulse animations and terminal state indicators.

---

## 📈 Future Roadmap
- [ ] **WebSocket Integration:** Line-by-line terminal streaming for long-running scans.
- [ ] **OWASP ZAP Bridge:** Direct integration with web application vulnerability scanners.
- [ ] **Report Generator:** Export console logs and findings into professional PDF reports.

---
*Developed for gaurav3384 — Authorized Security Regression Testing Environment.*
