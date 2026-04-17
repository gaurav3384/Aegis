import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { Terminal, Shield, Activity, Book, Search, Play, ChevronRight, Info, Save, FileText } from 'lucide-react';

const SOCKET_URL = 'http://localhost:4000';

const CHEATSHEETS = {
  nmap: {
    title: 'Nmap Scanning',
    commands: [
      { cmd: '-sV', desc: 'Version detection', next: 'Look for outdated services with known CVEs.' },
      { cmd: '-A', desc: 'Aggressive scan (OS, scripts, traceroute)', next: 'Identify the target OS for specific exploits.' },
      { cmd: '-p-', desc: 'Scan all 65535 ports', next: 'Uncover non-standard services running on high ports.' },
    ],
    doc: 'https://nmap.org/book/man.html'
  },
  ping: {
    title: 'Connectivity',
    commands: [
      { cmd: '-n 4', desc: 'Send 4 packets', next: 'Check for latency or packet loss.' },
    ],
    doc: 'https://docs.microsoft.com/en-us/windows-server/administration/windows-commands/ping'
  }
};

function App() {
  const [target, setTarget] = useState('');
  const [tool, setTool] = useState('nmap');
  const [params, setParams] = useState('-F');
  const [output, setOutput] = useState('Aegis System Ready...\nWaiting for authorized command...');
  const [loading, setLoading] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.on('output', (data: string) => {
      setOutput(prev => prev + data);
    });

    newSocket.on('command_complete', () => {
      setLoading(false);
    });

    return () => { newSocket.close(); };
  }, []);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [output]);

  const executeCommand = () => {
    if (!socket || !target) return;
    setLoading(true);
    setOutput(`[+] Aegis Bridge: Requesting execution of ${tool}...\n----------------------------------------\n`);
    socket.emit('execute_command', { tool, target, params });
  };

  const saveReport = () => {
    if (!socket || !output) return;
    socket.emit('save_report', { target, tool, output });
  };

  return (
    <div className="min-h-screen bg-aegis-900 flex flex-col font-mono selection:bg-aegis-cyan selection:text-black">
      {/* Header */}
      <nav className="h-16 border-b border-aegis-700 bg-black flex items-center justify-between px-8 shadow-lg shadow-cyan-900/10">
        <div className="flex items-center gap-3">
          <Shield className="text-aegis-cyan animate-pulse" />
          <h1 className="text-xl font-black tracking-widest text-white italic">AEGIS // STREAMING_OS</h1>
        </div>
        <div className="flex items-center gap-6 text-xs text-gray-500 uppercase tracking-widest">
          <span className="flex items-center gap-2"><Activity size={14} className="text-green-500" /> Socket: Connected</span>
          <span className="flex items-center gap-2"><Terminal size={14} className="text-aegis-cyan" /> User: CEH_3384</span>
        </div>
      </nav>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Controls */}
        <aside className="w-80 border-r border-aegis-700 bg-aegis-800 p-6 flex flex-col gap-6 overflow-y-auto">
          <div>
            <label className="text-[10px] uppercase text-aegis-cyan mb-2 block font-bold">Target IP / Domain</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-500" size={16} />
              <input 
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder="127.0.0.1" 
                className="w-full bg-black border border-aegis-700 rounded p-3 pl-10 text-sm focus:border-aegis-cyan outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase text-aegis-cyan mb-2 block font-bold">Security Module</label>
            <select 
              value={tool}
              onChange={(e) => setTool(e.target.value)}
              className="w-full bg-black border border-aegis-700 rounded p-3 text-sm focus:border-aegis-cyan outline-none appearance-none"
            >
              <option value="nmap">Network Mapper (Nmap)</option>
              <option value="ping">ICMP Echo (Ping)</option>
              <option value="tracert">Traceroute</option>
              <option value="nslookup">DNS Query</option>
            </select>
          </div>

          <button 
            onClick={executeCommand}
            disabled={loading || !target}
            className="w-full bg-aegis-cyan text-black py-4 rounded font-black uppercase tracking-widest hover:brightness-110 disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
          >
            {loading ? <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div> : <Play size={18} />}
            Initialize Stream
          </button>

          <button 
            onClick={saveReport}
            disabled={loading || output.length < 50}
            className="w-full border border-aegis-cyan text-aegis-cyan py-3 rounded font-bold uppercase text-xs tracking-widest hover:bg-aegis-cyan/10 flex items-center justify-center gap-2 transition-all"
          >
            <Save size={14} /> Export Report (.md)
          </button>

          {/* Reference Module */}
          <div className="mt-4 border-t border-aegis-700 pt-6">
            <h3 className="text-xs font-bold text-white mb-4 flex items-center gap-2 uppercase">
              <Book size={14} className="text-aegis-cyan" /> {tool} Reference
            </h3>
            <div className="space-y-4">
              {CHEATSHEETS[tool as keyof typeof CHEATSHEETS]?.commands.map((c, i) => (
                <div key={i} className="bg-black p-3 rounded border-l-2 border-aegis-cyan">
                  <code className="text-xs text-aegis-cyan font-bold block mb-1">{c.cmd}</code>
                  <p className="text-[10px] text-gray-500 mb-2">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Terminal */}
        <main className="flex-1 bg-black p-8 flex flex-col gap-4">
          <div className="flex items-center justify-between text-[10px] text-gray-600 uppercase tracking-[0.2em]">
            <span>Live Stream // Socket_ID: {socket?.id}</span>
            <div className="flex gap-4">
              <button onClick={() => setOutput('')} className="hover:text-white transition-colors">Clear Console</button>
            </div>
          </div>
          <div className="flex-1 bg-aegis-800 border border-aegis-700 rounded-lg p-6 font-mono text-sm terminal-scroll overflow-y-auto relative">
             <pre className="whitespace-pre-wrap leading-relaxed">
               {output}
               {loading && <span className="inline-block w-2 h-4 bg-aegis-cyan ml-1 animate-pulse"></span>}
             </pre>
             <div ref={terminalEndRef} />
          </div>
        </main>
      </div>

      <footer className="h-8 border-t border-aegis-700 bg-aegis-800 px-8 flex items-center justify-between text-[10px] text-gray-500 uppercase">
        <span className="flex items-center gap-2"><FileText size={10} /> Reports: Aegis/backend/reports/</span>
        <span>Aegis Streaming v1.2.0</span>
      </footer>
    </div>
  );
}

export default App;
