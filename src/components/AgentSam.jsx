import React, { useState, useEffect, useRef } from 'react';
import {
    Terminal,
    Cpu,
    Activity,
    X,
    Maximize2,
    Minimize2,
    ChevronUp,
    Command,
    Send,
    Zap,
    Globe,
    Shield,
    Server,
    Sparkles
} from 'lucide-react';

const AgentSamCLI = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [viewMode, setViewMode] = useState('medium'); // 'minimized', 'medium', 'full'
    const [activeTab, setActiveTab] = useState('terminal'); // 'terminal', 'ai', 'analytics'
    const [inputVal, setInputVal] = useState('');

    // Terminal State
    const [terminalHistory, setTerminalHistory] = useState([
        { type: 'system', content: 'Agent_Sam v2.0.4 initialized.' },
        { type: 'system', content: 'Cloudflare Edge: CONNECTED' },
        { type: 'info', content: 'Type "help" for commands or "ask <query>" for AI.' }
    ]);
    const [isTyping, setIsTyping] = useState(false);

    // AI Chat State
    const [aiMessages, setAiMessages] = useState([
        { role: 'model', content: 'Agent_Sam Neural Link established. Ready for technical assistance.' }
    ]);
    const [aiInput, setAiInput] = useState('');
    const [isAiProcessing, setIsAiProcessing] = useState(false);

    // Refs
    const terminalEndRef = useRef(null);
    const aiEndRef = useRef(null);
    const inputRef = useRef(null);

    // Toggle visibility
    const toggleOpen = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    };

    // Keyboard shortcut listener
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'j') {
                e.preventDefault();
                toggleOpen();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);

    // Auto-scroll
    useEffect(() => {
        if (activeTab === 'terminal') {
            terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        } else if (activeTab === 'ai') {
            aiEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [terminalHistory, aiMessages, activeTab, isOpen]);

    // --- Gemini API Integration ---
    const callGemini = async (prompt, systemContext = "default") => {
        // In a real app you might proxy this through your worker to keep the key hidden
        // For now we use the proxy endpoint we just created if available, or fallback to direct if key is present

        // We will use the /api/google/proxy endpoint we created earlier
        try {
            const response = await fetch('/api/google/proxy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    endpoint: 'v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent',
                    method: 'POST',
                    body: {
                        contents: [{ parts: [{ text: prompt }] }],
                        systemInstruction: { parts: [{ text: systemContext === 'cli' ? "You are Agent Sam. Keep answers under 2 sentences, text-only for CLI." : "You are Agent Sam, an advanced DevOps assistant." }] }
                    }
                })
            });

            if (!response.ok) throw new Error('API Error');
            const data = await response.json();
            return data.candidates?.[0]?.content?.parts?.[0]?.text || "Error: No response generated.";
        } catch (error) {
            console.error("Gemini Error:", error);
            return "Error: Neural Link connection failed.";
        }
    };

    // --- Terminal Logic ---
    const handleCommand = async (cmd) => {
        const rawCommand = cmd.trim();
        if (!rawCommand) return;

        // Add user input to history
        setTerminalHistory(prev => [...prev, { type: 'user', content: rawCommand }]);
        setInputVal('');

        setIsTyping(true);

        const args = rawCommand.split(' ');
        const command = args[0].toLowerCase();

        // AI Command Handler (ask <query>)
        if (command === 'ask') {
            const query = args.slice(1).join(' ');
            if (!query) {
                setTerminalHistory(prev => [...prev, { type: 'warning', content: 'Usage: ask <your question>' }]);
                setIsTyping(false);
                return;
            }

            // Call Gemini for CLI
            const aiResponse = await callGemini(query, 'cli');
            setTerminalHistory(prev => [...prev, { type: 'ai', content: `✨ ${aiResponse}` }]);
            setIsTyping(false);
            return;
        }

        // Standard Commands
        setTimeout(() => {
            let response = [];

            switch (command) {
                case 'help':
                    response = [
                        { type: 'success', content: 'Available Commands:' },
                        { type: 'info', content: '  ask <q>  - Ask AI a question ✨' },
                        { type: 'info', content: '  status   - Check system health' },
                        { type: 'info', content: '  deploy   - Trigger edge deployment' },
                        { type: 'info', content: '  ai       - Switch to Neural Link' },
                        { type: 'info', content: '  clear    - Clear terminal' },
                    ];
                    break;
                case 'clear':
                    setTerminalHistory([]);
                    setIsTyping(false);
                    return;
                case 'status':
                    response = [
                        { type: 'success', content: 'System Operational' },
                        { type: 'info', content: 'CPU Usage: 12% | Memory: 450MB' },
                        { type: 'info', content: 'Edge Nodes: 24 active' }
                    ];
                    break;
                case 'deploy':
                    response = [
                        { type: 'warning', content: 'Initiating deployment sequence...' },
                        { type: 'system', content: 'Building assets... DONE' },
                        { type: 'system', content: 'Uploading to KV store... DONE' },
                        { type: 'success', content: 'Deployment successful: v2.0.5-alpha' }
                    ];
                    break;
                case 'ai':
                    setActiveTab('ai');
                    response = [{ type: 'system', content: 'Switched to Neural Link interface.' }];
                    break;
                default:
                    response = [{ type: 'error', content: `Command not found: ${command}` }];
            }

            setTerminalHistory(prev => [...prev, ...response]);
            setIsTyping(false);
        }, 400);
    };

    // --- AI Chat Logic ---
    const handleAiSubmit = async () => {
        if (!aiInput.trim() || isAiProcessing) return;

        const text = aiInput;
        setAiInput('');
        setAiMessages(prev => [...prev, { role: 'user', content: text }]);
        setIsAiProcessing(true);

        const reply = await callGemini(text);

        setAiMessages(prev => [...prev, { role: 'model', content: reply }]);
        setIsAiProcessing(false);
    };

    // Render content based on tab
    const renderContent = () => {
        switch (activeTab) {
            case 'terminal':
                return (
                    <div className="flex flex-col h-full font-mono text-sm">
                        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                            {terminalHistory.map((log, idx) => (
                                <div key={idx} className={`${log.type === 'user' ? 'text-white font-bold mt-4' :
                                    log.type === 'error' ? 'text-red-400' :
                                        log.type === 'success' ? 'text-emerald-400' :
                                            log.type === 'warning' ? 'text-amber-400' :
                                                log.type === 'system' ? 'text-indigo-400' :
                                                    log.type === 'ai' ? 'text-fuchsia-300' :
                                                        'text-slate-300'
                                    }`}>
                                    {log.type === 'user' && <span className="text-purple-400 mr-2">➜ ~</span>}
                                    {log.content}
                                </div>
                            ))}
                            {isTyping && <div className="text-slate-500 animate-pulse">Processing...</div>}
                            <div ref={terminalEndRef} />
                        </div>

                        <div className="p-3 border-t border-white/5 bg-black/20 backdrop-blur-md flex items-center gap-2">
                            <span className="text-purple-400 font-bold">➜</span>
                            <input
                                ref={inputRef}
                                type="text"
                                value={inputVal}
                                onChange={(e) => setInputVal(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleCommand(inputVal)}
                                className="flex-1 bg-transparent border-none outline-none text-white placeholder-slate-600 font-mono"
                                placeholder="Enter command..."
                                autoFocus
                            />
                        </div>
                    </div>
                );

            case 'ai':
                return (
                    <div className="flex flex-col h-full">
                        <div className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-4">
                            {aiMessages.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`
                    max-w-[85%] rounded-2xl p-3 text-sm
                    ${msg.role === 'user'
                                            ? 'bg-purple-600/30 text-white rounded-br-none border border-purple-500/30'
                                            : 'bg-slate-800/50 text-slate-200 rounded-bl-none border border-white/10'}
                  `}>
                                        {msg.role === 'model' && <Sparkles size={14} className="inline-block mr-2 text-fuchsia-400 -mt-1" />}
                                        <span className="whitespace-pre-wrap">{msg.content}</span>
                                    </div>
                                </div>
                            ))}
                            {isAiProcessing && (
                                <div className="flex justify-start">
                                    <div className="bg-slate-800/30 rounded-2xl p-3 rounded-bl-none border border-white/5 flex gap-1 items-center">
                                        <div className="w-1.5 h-1.5 bg-fuchsia-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                        <div className="w-1.5 h-1.5 bg-fuchsia-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                        <div className="w-1.5 h-1.5 bg-fuchsia-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                    </div>
                                </div>
                            )}
                            <div ref={aiEndRef} />
                        </div>

                        <div className="p-4 border-t border-white/5 bg-black/20">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={aiInput}
                                    onChange={(e) => setAiInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleAiSubmit()}
                                    placeholder="Ask Agent_Sam..."
                                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-white placeholder-slate-500 focus:border-fuchsia-500/50 focus:ring-1 focus:ring-fuchsia-500/50 transition-all outline-none"
                                />
                                <button
                                    onClick={handleAiSubmit}
                                    disabled={!aiInput.trim() || isAiProcessing}
                                    className={`absolute right-2 top-2 p-1.5 rounded-lg transition-colors text-white 
                    ${!aiInput.trim() || isAiProcessing ? 'bg-slate-700 opacity-50 cursor-not-allowed' : 'bg-fuchsia-600 hover:bg-fuchsia-500'}
                  `}
                                >
                                    <Send size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                );

            case 'analytics':
                return (
                    <div className="p-6 h-full overflow-y-auto custom-scrollbar">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">System Health</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                            {[
                                { label: 'API Requests', value: '2.4M', change: '+12%', icon: Globe, color: 'text-blue-400' },
                                { label: 'Avg Latency', value: '24ms', change: '-4%', icon: Zap, color: 'text-amber-400' },
                                { label: 'Error Rate', value: '0.01%', change: 'Stable', icon: Shield, color: 'text-emerald-400' },
                                { label: 'Active Users', value: '8,432', change: '+8%', icon: Server, color: 'text-purple-400' },
                            ].map((stat, i) => (
                                <div key={i} className="bg-white/5 border border-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <stat.icon size={18} className={stat.color} />
                                        <span className={`text-xs ${stat.change.includes('+') ? 'text-emerald-400' : 'text-slate-400'}`}>{stat.change}</span>
                                    </div>
                                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                                    <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
                                </div>
                            ))}
                        </div>

                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Resource Allocation</h3>
                        <div className="space-y-4">
                            {[
                                { label: 'Database (Postgres)', usage: 78, color: 'bg-blue-500' },
                                { label: 'Edge Workers', usage: 45, color: 'bg-purple-500' },
                                { label: 'Storage Buckets', usage: 22, color: 'bg-emerald-500' }
                            ].map((item, i) => (
                                <div key={i} className="bg-white/5 border border-white/5 rounded-lg p-3">
                                    <div className="flex justify-between text-xs mb-2">
                                        <span className="text-slate-300">{item.label}</span>
                                        <span className="text-white font-mono">{item.usage}%</span>
                                    </div>
                                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${item.color} shadow-[0_0_10px_currentColor]`}
                                            style={{ width: `${item.usage}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            default: return null;
        }
    };

    return (
        <div className="fixed inset-0 pointer-events-none z-50 font-sans antialiased text-slate-200">

            {/* Floating Trigger Button */}
            <div
                onClick={toggleOpen}
                className={`fixed bottom-6 right-6 pointer-events-auto transition-all duration-500 ease-out transform
          ${isOpen ? 'translate-y-20 opacity-0' : 'translate-y-0 opacity-100'}
        `}
            >
                <button className="group relative w-14 h-14 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.2)] flex items-center justify-center overflow-hidden transition-all hover:scale-105 hover:border-purple-500/50 hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                    <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <img
                        src="https://imagedelivery.net/g7wf09fCONpnidkRnR_5vw/06ad0642-3a80-4271-b785-5e1800e43a00/thumbnail"
                        alt="Agent Sam"
                        className="w-full h-full object-cover p-0"
                    />
                </button>
            </div>

            {/* Main Panel */}
            <div className={`
        fixed bottom-0 left-0 right-0 pointer-events-auto bg-[#0a0a0f]/95 backdrop-blur-xl border-t border-white/10
        shadow-[0_-20px_40px_-15px_rgba(0,0,0,0.5)] transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1) flex flex-col
        ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}
      `}
                style={{
                    height: viewMode === 'minimized' ? '60px' : viewMode === 'medium' ? '50vh' : '95vh',
                    transitionProperty: 'height, transform, opacity'
                }}
            >
                {/* Resize Handle / Top Bar */}
                <div
                    className="w-full h-8 flex items-center justify-center cursor-row-resize hover:bg-white/5 transition-colors absolute top-0 z-20"
                    onClick={() => setViewMode(prev => prev === 'medium' ? 'full' : 'medium')}
                >
                    <div className="w-12 h-1 bg-white/20 rounded-full" />
                </div>

                {/* Header */}
                <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-white/5 select-none">
                    <div className="flex items-center gap-3">
                        <img
                            src="https://imagedelivery.net/g7wf09fCONpnidkRnR_5vw/06ad0642-3a80-4271-b785-5e1800e43a00/thumbnail"
                            alt="Agent Sam"
                            className="w-8 h-8 rounded-lg shadow-lg shadow-purple-900/30"
                        />
                        <div>
                            <div className="text-sm font-bold text-white flex items-center gap-2">
                                Agent_Sam
                                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">ONLINE</span>
                            </div>
                            <div className="text-[10px] text-slate-500 font-mono tracking-wide">v2.0.4 • EDGE CONNECTED</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setViewMode(viewMode === 'medium' ? 'full' : 'medium')}
                            className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                        >
                            {viewMode === 'full' ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                        </button>
                        <button
                            onClick={toggleOpen}
                            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>

                {/* Workspace */}
                <div className="flex-1 flex overflow-hidden">
                    {/* Sidebar Navigation */}
                    <div className="w-16 flex flex-col items-center py-4 gap-2 border-r border-white/5 bg-black/20">
                        <NavButton
                            active={activeTab === 'terminal'}
                            onClick={() => setActiveTab('terminal')}
                            icon={Terminal}
                            label="CLI"
                        />
                        <NavButton
                            active={activeTab === 'ai'}
                            onClick={() => setActiveTab('ai')}
                            icon={Cpu}
                            label="AI"
                        />
                        <NavButton
                            active={activeTab === 'analytics'}
                            onClick={() => setActiveTab('analytics')}
                            icon={Activity}
                            label="Stats"
                        />
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 bg-gradient-to-br from-slate-900/50 to-black/50 relative">
                        {/* Background Grid Pattern */}
                        <div className="absolute inset-0 opacity-[0.03]"
                            style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}
                        />
                        <div className="relative h-full z-10">
                            {renderContent()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Helper Component for Sidebar Buttons
const NavButton = ({ active, onClick, icon: Icon, label }) => (
    <button
        onClick={onClick}
        className={`
      w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group relative
      ${active
                ? 'bg-purple-600/20 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.15)]'
                : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'}
    `}
        title={label}
    >
        <Icon size={20} className={`transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`} />
        {active && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full w-1 h-6 bg-purple-500 rounded-r-full" />
        )}
    </button>
);

export default AgentSamCLI;
