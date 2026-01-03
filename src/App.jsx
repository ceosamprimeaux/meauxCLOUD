import React, { useState, useEffect, useRef } from 'react';
import {
    Terminal, Cpu, Activity, X, Maximize2, Minimize2, Command, Send,
    Zap, Globe, Shield, Server, Sparkles, Layout, Database, MessageSquare,
    Mail, Users, Image, Settings, LogOut, Search, Menu, ChevronDown,
    Plus, MoreHorizontal, Filter, Play, Save, FileText, Camera, Video, AppWindow, Wrench
} from 'lucide-react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import AgentSam from './components/AgentSam';

/* MEAUXOS - COMPLETE SAAS WORKSPACE (React Remaster)
  Integrated with Agent_Sam AI
*/

// --- Shared AI Logic (Gemini via Cloudflare Proxy) ---
const callGemini = async (prompt, systemContext = "default") => {
    let sysInstruction = "You are Agent Sam, the AI kernel of MeauxOS. You are helpful, concise, and technical.";

    if (systemContext === 'cli') {
        sysInstruction += " Keep your answer extremely brief (under 2 sentences), text-only, suitable for a terminal.";
    } else if (systemContext === 'sql') {
        sysInstruction += " You are a SQL expert. Explain queries, suggest optimizations, and help debug database issues.";
    }

    try {
        const response = await fetch('/api/google/proxy', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                endpoint: 'v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent',
                method: 'POST',
                body: {
                    contents: [{ parts: [{ text: prompt }] }],
                    systemInstruction: { parts: [{ text: sysInstruction }] }
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

// --- View Components ---

const MeauxWork = () => {
    const [tasks] = useState({
        todo: [
            { id: 1, title: 'Setup MeauxSQL integration', priority: 'high', due: 'Jan 5' },
            { id: 2, title: 'Deploy meauxagent edge function', priority: 'medium', due: 'Jan 3' },
            { id: 3, title: 'Test database sync worker', priority: 'low', due: 'Jan 7' }
        ],
        inProgress: [
            { id: 4, title: 'Build CLI agent interface', priority: 'high', start: 'Today' },
            { id: 5, title: 'Configure realtime monitoring', priority: 'medium', start: 'Yesterday' }
        ],
        done: [
            { id: 6, title: 'Create room_members table in D1', completed: 'Today' },
            { id: 7, title: 'Deploy outbox processor', completed: 'Dec 31' }
        ]
    });

    return (
        <div className="animate-in slide-in-from-bottom-4 duration-500">
            <div className="glass-panel rounded-2xl p-8 mb-6">
                <div className="flex justify-between items-center mb-6 pb-5 border-b border-white/10">
                    <h2 className="text-2xl font-bold flex items-center gap-3 text-slate-100">
                        <Layout className="text-emerald-400" /> Project Tasks
                    </h2>
                    <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:shadow-lg hover:shadow-emerald-500/20 rounded-xl font-semibold text-white transition-all transform hover:-translate-y-0.5">
                        <Plus size={18} /> New Task
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <KanbanColumn title="To Do" count={tasks.todo.length} tasks={tasks.todo} icon={<div className="w-5 h-5 rounded-full border-2 border-slate-500" />} />
                    <KanbanColumn title="In Progress" count={tasks.inProgress.length} tasks={tasks.inProgress} icon={<div className="w-5 h-5 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />} />
                    <KanbanColumn title="Done" count={tasks.done.length} tasks={tasks.done} icon={<div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-black font-bold text-xs">✓</div>} />
                </div>
            </div>
        </div>
    );
};

const MeauxSQL = () => {
    const [sqlQuery, setSqlQuery] = useState("SELECT name, type \nFROM sqlite_master \nWHERE type='table' \nORDER BY name \nLIMIT 10;");
    const [sqlResults, setSqlResults] = useState(null);
    const [sqlChat, setSqlChat] = useState([{ role: 'ai', text: 'I can help you write queries, optimize performance, and explain results.' }]);
    const [sqlChatInput, setSqlChatInput] = useState('');
    const [isSqlAiLoading, setIsSqlAiLoading] = useState(false);

    const executeSql = async () => {
        try {
            const response = await fetch('/api/sql/execute', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: sqlQuery })
            });

            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new Error("Received non-JSON response from server");
            }

            const data = await response.json();

            if (!response.ok) throw new Error(data.error || 'Query failed');

            let rows = [];
            if (Array.isArray(data)) {
                rows = data;
            } else if (data.results && Array.isArray(data.results)) {
                rows = data.results;
            } else {
                rows = [data];
            }

            setSqlResults(rows);
        } catch (e) {
            console.error("SQL Error:", e);
            setSqlResults([{ error: e.message }]);
        }
    };

    const handleSqlChat = async () => {
        if (!sqlChatInput.trim()) return;
        const msg = sqlChatInput;
        setSqlChatInput('');
        setSqlChat(prev => [...prev, { role: 'user', text: msg }]);
        setIsSqlAiLoading(true);

        const reply = await callGemini(msg, 'sql');
        setSqlChat(prev => [...prev, { role: 'ai', text: reply }]);
        setIsSqlAiLoading(false);
    };

    return (
        <div className="animate-in slide-in-from-bottom-4 duration-500 h-full">
            <div className="glass-panel rounded-2xl p-0 h-full flex flex-col overflow-hidden">
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-slate-900/30">
                    <h2 className="text-xl font-bold flex items-center gap-3">
                        <Database className="text-cyan-400" /> SQL Interface
                    </h2>
                </div>
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_400px]">
                    <div className="p-6 flex flex-col gap-4 border-r border-white/5">
                        <div className="flex gap-3">
                            <select className="flex-1 bg-slate-800 border border-white/10 rounded-lg px-4 py-2 outline-none focus:border-cyan-500">
                                <option>D1: meauxos</option>
                            </select>
                            <button onClick={executeSql} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg flex items-center gap-2 font-medium">
                                <Play size={16} /> Run
                            </button>
                        </div>
                        <textarea
                            value={sqlQuery}
                            onChange={e => setSqlQuery(e.target.value)}
                            className="flex-1 bg-[#0a0a0f] border border-white/10 rounded-xl p-4 font-mono text-sm text-cyan-100 resize-none focus:border-cyan-500/50 outline-none leading-relaxed"
                        />
                        <div className="h-48 bg-[#0a0a0f] border border-white/10 rounded-xl overflow-auto custom-scrollbar">
                            {sqlResults ? (
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-slate-800 text-cyan-400 sticky top-0">
                                        <tr>{Object.keys(sqlResults[0] || {}).map(k => <th key={k} className="p-3 font-mono">{k}</th>)}</tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {sqlResults.map((r, i) => (
                                            <tr key={i} className="hover:bg-white/5 font-mono text-slate-400">
                                                {Object.values(r).map((v, j) => <td key={j} className="p-3">{String(v)}</td>)}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="h-full flex items-center justify-center text-slate-600 italic">No results yet</div>
                            )}
                        </div>
                    </div>
                    {/* AI Assistant */}
                    <div className="bg-slate-900/50 flex flex-col border-l border-white/5">
                        <div className="p-4 border-b border-white/5 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <h3 className="font-semibold text-sm text-slate-300">SQL Assistant</h3>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                            {sqlChat.map((msg, i) => (
                                <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${msg.role === 'ai' ? 'bg-gradient-to-br from-emerald-500 to-cyan-500 text-white' : 'bg-slate-700 text-slate-300'}`}>
                                        {msg.role === 'ai' ? 'AI' : 'Me'}
                                    </div>
                                    <div className={`p-3 rounded-2xl text-sm leading-relaxed max-w-[85%] ${msg.role === 'ai' ? 'bg-slate-800/80 border border-white/5 text-slate-300 rounded-tl-none' : 'bg-cyan-900/30 border border-cyan-500/30 text-cyan-100 rounded-tr-none'}`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {isSqlAiLoading && <div className="text-xs text-slate-500 animate-pulse pl-12">Thinking...</div>}
                        </div>
                        <div className="p-4 border-t border-white/5 flex gap-2">
                            <input
                                value={sqlChatInput}
                                onChange={e => setSqlChatInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleSqlChat()}
                                placeholder="Ask about your query..."
                                className="flex-1 bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-cyan-500/50"
                            />
                            <button onClick={handleSqlChat} className="p-2 bg-cyan-600/20 text-cyan-400 hover:bg-cyan-600 hover:text-white rounded-lg transition-colors">
                                <Send size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const MeauxTalk = () => {
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const bottomRef = useRef(null);

    // Initial load and Polling
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const res = await fetch('/api/chat/messages');
                const data = await res.json();
                if (Array.isArray(data)) {
                    // Sort locally just in case, though API does DESC
                    setMessages(data.sort((a, b) => a.timestamp - b.timestamp));
                }
            } catch (e) { console.error("Chat Fetch Error:", e); }
        };

        fetchMessages();
        const interval = setInterval(fetchMessages, 2000); // Poll every 2s for "Realtime" feel
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = async () => {
        if (!inputText.trim()) return;

        setIsLoading(true);
        try {
            await fetch('/api/chat/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user: 'Sam Primeaux',
                    initials: 'SP',
                    color: 'from-cyan-500 to-violet-500',
                    text: inputText
                })
            });
            setInputText('');
            // Optimistic update could go here, but polling will catch it shortly
        } catch (e) {
            console.error("Send Error:", e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6 h-full animate-in slide-in-from-bottom-4 duration-500">
            <div className="glass-panel rounded-2xl p-4 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <h3 className="font-bold">Rooms</h3>
                    <button className="p-1 hover:bg-white/10 rounded"><Plus size={16} /></button>
                </div>
                <div className="space-y-1">
                    {['general', 'team-updates', 'project-alpha', 'random'].map(room => (
                        <div key={room} className={`p-3 rounded-xl cursor-pointer flex items-center justify-between group ${room === 'general' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'hover:bg-white/5 text-slate-400'}`}>
                            <span className="font-medium"># {room}</span>
                            {room === 'general' && <span className="w-2 h-2 rounded-full bg-emerald-500" />}
                        </div>
                    ))}
                </div>
            </div>
            <div className="glass-panel rounded-2xl flex flex-col overflow-hidden">
                <div className="p-4 border-b border-white/10 flex justify-between items-center bg-slate-900/30">
                    <div>
                        <h2 className="font-bold flex items-center gap-2"># general</h2>
                        <p className="text-xs text-slate-500">{messages.length} messages loaded</p>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                    {messages.length === 0 && <div className="text-center text-slate-500 mt-10">No messages yet. Start the conversation!</div>}
                    {messages.map((msg, i) => (
                        <ChatMessage
                            key={i}
                            user={msg.user}
                            time={msg.time}
                            text={msg.text}
                            initials={msg.initials}
                            color={msg.color}
                        />
                    ))}
                    <div ref={bottomRef} />
                </div>
                <div className="p-4 bg-slate-900/30 border-t border-white/5 flex gap-3">
                    <input
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                        className="flex-1 bg-slate-800 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-violet-500/50"
                        placeholder="Message #general..."
                        disabled={isLoading}
                    />
                    <button
                        onClick={sendMessage}
                        disabled={isLoading}
                        className="p-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl transition-colors disabled:opacity-50"
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

const MeauxMedia = () => {
    return (
        <div className="h-full flex flex-col gap-6 animate-in slide-in-from-bottom-4 duration-500">
            <div className="glass-panel rounded-2xl overflow-hidden aspect-video relative bg-black">
                {/* Cloudflare Stream Integration */}
                <iframe
                    src="https://customer-g7wf09fconpnidkrnr_5vw.cloudflarestream.com/89108139bd010041d13f982992922659/iframe?poster=https%3A%2F%2Fcustomer-g7wf09fconpnidkrnr_5vw.cloudflarestream.com%2F89108139bd010041d13f982992922659%2Fthumbnails%2Fthumbnail.jpg%3Ftime%3D%26height%3D600"
                    style={{ border: 'none', position: 'absolute', top: 0, left: 0, height: '100%', width: '100%' }}
                    allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                    allowFullScreen={true}
                    title="MeauxMedia Live Stream"
                ></iframe>
                <div className="absolute top-4 left-4 flex gap-2">
                    <div className="px-2 py-1 bg-red-600 text-white text-xs font-bold rounded animate-pulse">LIVE</div>
                    <div className="px-2 py-1 bg-black/50 text-white text-xs font-bold rounded">1.2k Viewing</div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Stream Stats / Controls */}
                <div className="glass-panel rounded-xl p-4">
                    <h3 className="font-bold mb-2">Stream Health</h3>
                    <div className="space-y-2 text-sm text-slate-400">
                        <div className="flex justify-between"><span>Bitrate</span> <span className="text-emerald-400">4500 kbps</span></div>
                        <div className="flex justify-between"><span>FPS</span> <span className="text-emerald-400">60</span></div>
                        <div className="flex justify-between"><span>Dropped Frames</span> <span className="text-emerald-400">0%</span></div>
                    </div>
                </div>
                <div className="glass-panel rounded-xl p-4 md:col-span-2">
                    <h3 className="font-bold mb-2">Stream Controls</h3>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm">Record Clip</button>
                        <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm">Screenshot</button>
                        <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm ml-auto">Settings</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const MeauxMail = () => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6 h-full animate-in slide-in-from-bottom-4 duration-500">
            <div className="glass-panel rounded-2xl p-4 flex flex-col gap-6">
                <button className="w-full py-3 bg-slate-100 hover:bg-white text-slate-900 font-bold rounded-xl flex items-center justify-center gap-2 transition-all">
                    <Plus size={18} /> Compose
                </button>
                <div className="space-y-1">
                    <MailFolder label="Inbox" count="12" active icon={Mail} />
                    <MailFolder label="Sent" icon={Send} />
                    <MailFolder label="Drafts" count="3" icon={FileText} />
                    <MailFolder label="Trash" icon={LogOut} />
                </div>
            </div>
            <div className="glass-panel rounded-2xl overflow-hidden flex flex-col">
                <div className="flex-1 overflow-y-auto">
                    <MailItem from="Resend Support" subject="API Key Configuration Complete" preview="Your Resend API keys have been successfully configured for meauxbility.org domain..." time="10:30 AM" unread />
                    <MailItem from="Southern Pets Team" subject="New Adoption Application" preview="A new adoption application has been submitted for Luna, the rescue dog..." time="9:15 AM" unread />
                    <MailItem from="Connor McNeely" subject="Re: MeauxWork Dashboard Updates" preview="The new kanban board looks great! I've tested it on mobile and desktop..." time="Yesterday" />
                </div>
            </div>
        </div>
    );
};

const MeauxCloud = () => {
    const [gateways, setGateways] = useState([]);
    const [selectedGateway, setSelectedGateway] = useState(null);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [view, setView] = useState('list'); // list, detail

    useEffect(() => {
        fetchGateways();
    }, []);

    const fetchGateways = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/cloudflare/gateways');
            const data = await res.json();
            if (data.success) setGateways(data.result);
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    const fetchLogs = async (gatewayId) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/cloudflare/gateways/${gatewayId}/logs`);
            const data = await res.json();
            if (data.success) setLogs(data.result);
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    const handleSelectGateway = (gw) => {
        setSelectedGateway(gw);
        setView('detail');
        fetchLogs(gw.id);
    };

    return (
        <div className="h-full flex flex-col animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2"><Globe className="text-blue-400" /> MeauxCloud AI Gateway</h2>
                    <p className="text-sm text-slate-500">Manage and monitor your AI traffic</p>
                </div>
                {view === 'detail' && (
                    <button onClick={() => setView('list')} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm">Back to List</button>
                )}
            </div>

            {loading && <div className="text-center py-10"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div></div>}

            {!loading && view === 'list' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {gateways.map(gw => (
                        <div key={gw.id} onClick={() => handleSelectGateway(gw)} className="glass-panel p-5 rounded-xl cursor-pointer hover:bg-white/5 transition-all group">
                            <div className="flex justify-between items-start mb-3">
                                <div className="font-bold text-lg text-slate-200">{gw.id}</div>
                                <div className={`w-2 h-2 rounded-full ${true ? 'bg-emerald-500' : 'bg-slate-500'}`} />
                            </div>
                            <div className="text-xs text-slate-500 font-mono mb-4">{gw.internal_id}</div>
                            <div className="flex gap-2">
                                <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded border border-blue-500/20">Logs: {gw.collect_logs ? 'On' : 'Off'}</span>
                                <span className="px-2 py-1 bg-purple-500/10 text-purple-400 text-xs rounded border border-purple-500/20">Cache: {gw.cache_ttl > 0 ? 'On' : 'Off'}</span>
                            </div>
                        </div>
                    ))}
                    {gateways.length === 0 && (
                        <div className="col-span-full text-center py-10 text-slate-500 border border-dashed border-white/10 rounded-xl">
                            No gateways found. Create one in your Cloudflare dashboard.
                        </div>
                    )}
                </div>
            )}

            {!loading && view === 'detail' && selectedGateway && (
                <div className="flex flex-col h-full overflow-hidden">
                    <div className="glass-panel p-6 rounded-xl mb-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div>
                                <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Gateway ID</div>
                                <div className="font-mono text-sm">{selectedGateway.id}</div>
                            </div>
                            <div>
                                <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Log Success</div>
                                <div className="font-bold text-emerald-400">98.5%</div>
                            </div>
                            <div>
                                <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Total Requests</div>
                                <div className="font-bold text-blue-400">12.4k</div>
                            </div>
                            <div>
                                <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Cache Hit Rate</div>
                                <div className="font-bold text-purple-400">42%</div>
                            </div>
                        </div>
                    </div>

                    <h3 className="font-bold text-slate-300 mb-4">Request Logs</h3>
                    <div className="flex-1 glass-panel rounded-xl overflow-hidden">
                        <div className="overflow-auto h-full custom-scrollbar">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-900/50 text-slate-400 sticky top-0">
                                    <tr>
                                        <th className="p-4">Time</th>
                                        <th className="p-4">Model</th>
                                        <th className="p-4">Provider</th>
                                        <th className="p-4">Tokens</th>
                                        <th className="p-4">Cost</th>
                                        <th className="p-4">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {logs.map((log) => (
                                        <tr key={log.id} className="hover:bg-white/5 transition-colors">
                                            <td className="p-4 text-slate-400 whitespace-nowrap">{new Date(log.created_at).toLocaleTimeString()}</td>
                                            <td className="p-4 font-medium text-slate-200">{log.model}</td>
                                            <td className="p-4 text-slate-400">{log.provider}</td>
                                            <td className="p-4 font-mono text-xs">
                                                <span className="text-blue-400">In: {log.tokens_in}</span>
                                                <span className="mx-2 text-slate-600">|</span>
                                                <span className="text-purple-400">Out: {log.tokens_out}</span>
                                            </td>
                                            <td className="p-4 text-slate-400">${log.cost || '0.00'}</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${log.success ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                                                    {log.success ? 'Success' : 'Failed'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {logs.length === 0 && (
                                        <tr><td colSpan="6" className="p-8 text-center text-slate-500 italic">No logs available for this gateway.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- AutoMeaux IDE ---
import wranglerSchema from './data/wrangler-schema.json';

const AutoMeaux = () => {
    // State
    const [activeCategory, setActiveCategory] = useState("core");
    const [activeCommand, setActiveCommand] = useState(null);
    const [args, setArgs] = useState({});
    const [flags, setFlags] = useState({});
    const [terminalOutput, setTerminalOutput] = useState([
        { type: 'info', text: 'AutoMeaux v1.0.0 initialized.' },
        { type: 'info', text: 'Ready to assist with Wrangler CLI operations.' }
    ]);
    const [isRunning, setIsRunning] = useState(false);

    // Helpers
    const category = wranglerSchema.categories.find(c => c.id === activeCategory);

    // Auto-select first command when category changes if none selected or if not in new category
    useEffect(() => {
        if (category && (!activeCommand || !category.commands.find(c => c.name === activeCommand.name))) {
            const firstCmd = category.commands[0];
            setActiveCommand(firstCmd);
            setArgs({});
            setFlags({});
        }
    }, [activeCategory, category, activeCommand]); // Added activeCommand to dependency array to satisfy linter but logic might need tweak if it causes loop, checking... actually if activeCommand is null it runs. Ideally just on category change.

    const handleCommandSelect = (cmd) => {
        setActiveCommand(cmd);
        setArgs({});
        setFlags({});
    };

    const generateCommandString = () => {
        if (!activeCommand) return '';
        let cmdStr = `npx wrangler ${activeCommand.name}`;

        // Add Args (Positional)
        if (activeCommand.args) {
            activeCommand.args.forEach(arg => {
                if (args[arg.name]) cmdStr += ` ${args[arg.name]}`;
                else if (arg.required) cmdStr += ` <${arg.name.toUpperCase()}>`;
            });
        }

        // Add Flags
        Object.keys(flags).forEach(flagName => {
            if (flags[flagName]) {
                const flagDef = activeCommand.flags?.find(f => f.name === flagName);
                if (flagDef?.type === 'boolean') {
                    if (flags[flagName] === true) cmdStr += ` --${flagName}`;
                } else {
                    cmdStr += ` --${flagName} "${flags[flagName]}"`;
                }
            }
        });

        return cmdStr;
    };

    const runCommand = async () => {
        const cmd = generateCommandString();
        setIsRunning(true);
        setTerminalOutput(prev => [...prev, { type: 'command', text: `> ${cmd}` }]);

        // Mock Execution Delay
        await new Promise(r => setTimeout(r, 1000));

        // Mock Responses based on command type (In future this calls backend exec)
        if (cmd.includes('d1 list')) {
            setTerminalOutput(prev => [...prev,
            { type: 'success', text: '┌──────────────────────────────────────┬─────────┐' },
            { type: 'success', text: '│ ID                                   │ Name    │' },
            { type: 'success', text: '├──────────────────────────────────────┼─────────┤' },
            { type: 'success', text: '│ d8261777-9384-44f7-924d-c92247d55b46 │ meauxos │' },
            { type: 'success', text: '└──────────────────────────────────────┴─────────┘' }
            ]);
        } else if (cmd.includes('whoami')) {
            setTerminalOutput(prev => [...prev, { type: 'info', text: 'You are logged in as sam@meauxbility.org' }]);
        } else {
            setTerminalOutput(prev => [...prev, { type: 'success', text: 'Command completed successfully.' }]);
        }

        setIsRunning(false);
    };

    return (
        <div className="flex h-full animate-in fade-in duration-500 overflow-hidden">
            {/* Sidebar: Categories */}
            <div className="w-64 glass-panel border-r border-white/5 flex flex-col">
                <div className="p-4 border-b border-white/10 font-bold text-slate-100 flex items-center gap-2">
                    <Wrench className="text-emerald-400" size={20} /> AutoMeaux
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {wranglerSchema.categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeCategory === cat.id ? 'bg-emerald-500/10 text-emerald-400' : 'text-slate-400 hover:bg-white/5'}`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Area: Builder & Terminal */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Command Builder */}
                <div className="h-[60%] p-6 overflow-y-auto border-b border-white/5 custom-scrollbar">
                    <h2 className="text-xl font-bold text-slate-100 mb-6 flex items-center gap-3">
                        <span className="text-emerald-400">/</span>
                        {activeCategory.toUpperCase()} COMMANDS
                    </h2>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                        {/* Command List */}
                        <div className="space-y-2">
                            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Available Commands</div>
                            {category?.commands.map(cmd => (
                                <div
                                    key={cmd.name}
                                    onClick={() => handleCommandSelect(cmd)}
                                    className={`p-4 rounded-xl border cursor-pointer transition-all ${activeCommand?.name === cmd.name ? 'bg-emerald-500/10 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'bg-slate-800/50 border-white/5 hover:border-white/10'}`}
                                >
                                    <div className="font-mono font-bold text-emerald-400 mb-1">{cmd.name}</div>
                                    <div className="text-sm text-slate-500">{cmd.description}</div>
                                </div>
                            ))}
                        </div>

                        {/* Config Form */}
                        {activeCommand ? (
                            <div className="glass-panel p-6 rounded-xl animate-in slide-in-from-right-4 duration-300">
                                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Configuration</div>

                                {/* Args */}
                                {activeCommand.args && activeCommand.args.length > 0 && (
                                    <div className="mb-6 space-y-4">
                                        {activeCommand.args.map(arg => (
                                            <div key={arg.name}>
                                                <label className="block text-xs font-medium text-slate-400 mb-1 flex justify-between">
                                                    {arg.name.toUpperCase()} {arg.required && <span className="text-red-400">*</span>}
                                                </label>
                                                <input
                                                    type="text"
                                                    className="w-full bg-[#0a0a0f] border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none focus:border-emerald-500/50"
                                                    placeholder={arg.desc || arg.name}
                                                    onChange={e => setArgs({ ...args, [arg.name]: e.target.value })}
                                                    value={args[arg.name] || ''}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Flags */}
                                {activeCommand.flags && (
                                    <div className="space-y-3">
                                        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Flags</div>
                                        {activeCommand.flags.map(flag => (
                                            <div key={flag.name} className="flex items-center gap-3">
                                                {flag.type === 'boolean' ? (
                                                    <input
                                                        type="checkbox"
                                                        id={`flag-${flag.name}`}
                                                        checked={flags[flag.name] || false}
                                                        onChange={e => setFlags({ ...flags, [flag.name]: e.target.checked })}
                                                        className="rounded border-white/10 bg-[#0a0a0f] text-emerald-500 focus:ring-emerald-500/20"
                                                    />
                                                ) : (
                                                    <input
                                                        type="text"
                                                        placeholder="Value"
                                                        className="w-32 bg-[#0a0a0f] border border-white/10 rounded-lg px-2 py-1 text-xs text-slate-200 outline-none focus:border-emerald-500/50"
                                                        onChange={e => setFlags({ ...flags, [flag.name]: e.target.value })}
                                                    />
                                                )}
                                                <label htmlFor={`flag-${flag.name}`} className="text-sm text-slate-400 cursor-pointer select-none">
                                                    --{flag.name} <span className="text-slate-600 ml-1 text-xs">({flag.desc})</span>
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center text-slate-600 italic">Select a command to configure</div>
                        )}
                    </div>
                </div>

                {/* Terminal Pane */}
                <div className="flex-1 bg-[#0a0a0f] border-t border-white/10 flex flex-col font-mono text-sm relative">
                    <div className="absolute top-0 right-0 p-4">
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></span>
                            <span className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/50"></span>
                            <span className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/50"></span>
                        </div>
                    </div>

                    {/* Command Preview Bar */}
                    <div className="p-4 bg-slate-900 border-b border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-3 text-emerald-400">
                            <span className="text-slate-500">$</span>
                            <span className="tracking-wide break-all">{generateCommandString() || '...'}</span>
                        </div>
                        <button
                            onClick={runCommand}
                            disabled={!activeCommand || isRunning}
                            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold rounded-lg transition-all flex items-center gap-2"
                        >
                            {isRunning ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Play size={14} />}
                            RUN
                        </button>
                    </div>

                    {/* Output Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
                        {terminalOutput.map((line, i) => (
                            <div key={i} className={`${line.type === 'command' ? 'text-slate-400 mt-4 font-bold opacity-75' : line.type === 'success' ? 'text-emerald-400' : line.type === 'error' ? 'text-red-400' : 'text-slate-300'}`}>
                                {line.text}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Layout & Routing ---

const AppLayout = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();

    // Mapping current path to tab selection for UI highlighting
    const getCurrentTab = () => {
        const path = location.pathname;
        if (path.includes('meauxwork')) return 'kanban';
        if (path.includes('meauxsql')) return 'sql';
        if (path.includes('meauxtalk')) return 'talk';
        if (path.includes('meauxmail')) return 'mail';
        return '';
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-100 font-sans selection:bg-emerald-500/30 overflow-hidden relative">
            <div className="fixed inset-0 z-0 pointer-events-none opacity-25">
                <div className="absolute w-full h-full" style={{
                    backgroundImage: 'radial-gradient(1px 1px at 20% 30%, white, transparent), radial-gradient(2px 2px at 80% 10%, white, transparent)',
                    backgroundSize: '200% 200%',
                    animation: 'stars 120s ease-in-out infinite alternate'
                }}></div>
            </div>

            <style>{`
                @keyframes stars { 0% { transform: translate(0, 0); } 100% { transform: translate(-10%, -10%); } }
                .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(148,163,184,0.2); border-radius: 3px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(16,185,129,0.5); }
                .glass-panel { background: rgba(30, 41, 59, 0.6); backdrop-filter: blur(16px); border: 1px solid rgba(148, 163, 184, 0.1); box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3); }
            `}</style>

            <div className="relative z-10 flex h-screen">
                {/* Sidebar */}
                <aside className={`${isSidebarOpen ? 'w-[280px]' : 'w-0'} bg-[#f0f9ff]/75 backdrop-blur-2xl border-r border-blue-200/30 text-slate-800 transition-all duration-300 flex flex-col fixed md:relative h-full z-50 overflow-hidden`}>
                    <div className="p-6 border-b border-blue-200/30 flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">MX</div>
                        <h1 className="font-extrabold text-xl bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-violet-600">MeauxOS</h1>
                    </div>

                    <nav className="flex-1 overflow-y-auto p-4 space-y-8">
                        <div>
                            <div className="px-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Core Modules</div>
                            <div className="space-y-1">
                                <NavButton active={location.pathname === '/dashboard'} icon={Layout} label="Dashboard" onClick={() => navigate('/dashboard')} />
                                <NavButton active={location.pathname.includes('meauxwork')} icon={Layout} label="MeauxWork" badge="24" onClick={() => navigate('/dashboard/meauxwork')} />
                                <NavButton active={location.pathname.includes('analytics')} icon={Activity} label="Analytics" onClick={() => navigate('/dashboard/analytics')} />
                                <NavButton active={location.pathname.includes('team')} icon={Users} label="Team" onClick={() => navigate('/dashboard/team')} />
                                <NavButton active={location.pathname.includes('agentsam')} icon={Cpu} label="Agent_Sam" onClick={() => navigate('/dashboard/agentsam')} />
                            </div>
                        </div>
                        <div>
                            <div className="px-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Suite</div>
                            <div className="space-y-1">
                                <NavButton active={location.pathname.includes('meauxcloud')} icon={Globe} label="MeauxCloud" onClick={() => navigate('/dashboard/meauxcloud')} />
                                <NavButton active={location.pathname.includes('meauxcad')} icon={Database} label="MeauxCAD" onClick={() => navigate('/dashboard/meauxcad')} />
                                <NavButton active={location.pathname.includes('meauxphoto')} icon={Camera} label="MeauxPhoto" onClick={() => navigate('/dashboard/meauxphoto')} />
                                <NavButton active={location.pathname.includes('meauxmedia')} icon={Video} label="MeauxMedia" onClick={() => navigate('/dashboard/meauxmedia')} />
                                <NavButton active={location.pathname.includes('meauxapps')} icon={AppWindow} label="MeauxApps" onClick={() => navigate('/dashboard/meauxapps')} />
                                <NavButton active={location.pathname.includes('automeaux')} icon={Wrench} label="AutoMeaux" onClick={() => navigate('/dashboard/automeaux')} />
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-blue-200/30">
                            <button
                                onClick={() => window.location.href = '/api/auth/google'}
                                className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 rounded-xl font-bold shadow-sm transition-all active:scale-95"
                            >
                                <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="" />
                                Sign in with Google
                            </button>
                        </div>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 flex flex-col h-full overflow-hidden bg-slate-900/50">
                    <header className="h-[72px] bg-[#1e293b]/70 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-8 sticky top-0 z-40">
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                            <span>MeauxOS</span><span className="opacity-50">/</span><span className="text-emerald-400 font-semibold uppercase">{location.pathname.split('/').pop() || 'Dashboard'}</span>
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 hover:bg-slate-700 border border-white/10 rounded-lg text-sm font-medium"><LogOut size={16} /> Export</button>
                    </header>

                    {/* Secondary Navigation (Tabs) - Only show for sub-modules if desired, or persistent */}
                    <div className="bg-[#1e293b] border-b border-white/5 px-8 flex gap-1 overflow-x-auto no-scrollbar">
                        <ModuleTab id="kanban" active={getCurrentTab()} icon={Layout} label="MeauxWork" onClick={() => navigate('/dashboard/meauxwork')} />
                        <ModuleTab id="sql" active={getCurrentTab()} icon={Database} label="MeauxSQL" onClick={() => navigate('/dashboard/meauxsql')} />
                        <ModuleTab id="talk" active={getCurrentTab()} icon={MessageSquare} label="MeauxTalk" onClick={() => navigate('/dashboard/meauxtalk')} />
                        <ModuleTab id="mail" active={getCurrentTab()} icon={Mail} label="MeauxMail" onClick={() => navigate('/dashboard/meauxmail')} />
                    </div>

                    <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                        <Routes>
                            <Route path="/dashboard" element={<PlaceholderView title="Dashboard Overview" icon={Layout} />} />
                            <Route path="/dashboard/meauxwork" element={<MeauxWork />} />
                            <Route path="/dashboard/meauxsql" element={<MeauxSQL />} />
                            <Route path="/dashboard/meauxtalk" element={<MeauxTalk />} />
                            <Route path="/dashboard/meauxmail" element={<MeauxMail />} />
                            <Route path="/dashboard/analytics" element={<PlaceholderView title="Analytics" icon={Activity} />} />
                            <Route path="/dashboard/team" element={<PlaceholderView title="Team Management" icon={Users} />} />
                            <Route path="/dashboard/agentsam" element={<PlaceholderView title="Agent_Sam Console" icon={Cpu} />} />
                            <Route path="/dashboard/meauxcloud" element={<MeauxCloud />} />
                            <Route path="/dashboard/meauxcad" element={<PlaceholderView title="MeauxCAD Studio" icon={Database} />} />
                            <Route path="/dashboard/meauxphoto" element={<PlaceholderView title="MeauxPhoto Editor" icon={Camera} />} />
                            <Route path="/dashboard/meauxmedia" element={<PlaceholderView title="MeauxMedia Stream" icon={Video} />} />
                            <Route path="/dashboard/meauxapps" element={<PlaceholderView title="App Store" icon={AppWindow} />} />
                            <Route path="/dashboard/automeaux" element={<AutoMeaux />} />
                            {/* Fallback for root to dashboard */}
                            <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        </Routes>
                    </div>
                </main>
            </div>

            <AgentSam />
        </div>
    );
};

const App = () => {
    return (
        <BrowserRouter>
            <AppLayout />
        </BrowserRouter>
    );
};

const PlaceholderView = ({ title, icon: Icon }) => (
    <div className="h-full flex flex-col items-center justify-center p-8 animate-in zoom-in-95 duration-500">
        <div className="w-24 h-24 rounded-3xl bg-slate-800 flex items-center justify-center mb-6 shadow-2xl ring-1 ring-white/10">
            <Icon size={48} className="text-slate-600" />
        </div>
        <h2 className="text-3xl font-bold text-slate-200 mb-2">{title}</h2>
        <p className="text-slate-500 max-w-md text-center">
            This module is currently under active development. Check back soon for updates or use the terminal to check deployment status.
        </p>
    </div>
);

// --- Sub-Components (Unchanged logic, just ensure params passed correctly) ---
const NavButton = ({ active, icon: Icon, label, badge, onClick }) => (
    <div onClick={onClick} className={`flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-all ${active ? 'bg-emerald-500/10 text-emerald-700 font-semibold border border-emerald-500/20' : 'text-slate-700 hover:bg-blue-500/5'}`}>
        <div className="flex items-center gap-3"><Icon size={20} className={active ? 'text-emerald-500' : 'text-slate-400'} /><span>{label}</span></div>
        {badge && <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{badge}</span>}
    </div>
);
const ModuleTab = ({ id, active, icon: Icon, label, onClick }) => (
    <button onClick={onClick} className={`flex items-center gap-2 px-6 py-4 border-b-2 text-sm font-semibold transition-all ${active === id ? 'border-emerald-500 text-emerald-400 bg-white/5' : 'border-transparent text-slate-400 hover:bg-white/5'}`}>
        <Icon size={18} /> {label}
    </button>
);
const KanbanColumn = ({ title, count, tasks, icon }) => (
    <div className="bg-[#0f172a]/50 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/5">
            <div className="flex items-center gap-2 font-bold text-slate-200">{icon} {title}</div>
            <span className="bg-slate-800 text-slate-400 px-2 py-0.5 rounded text-xs font-mono">{count}</span>
        </div>
        <div className="space-y-3">
            {tasks.map(t => (
                <div key={t.id} className="bg-[#1e293b] hover:bg-slate-700 border border-white/5 p-4 rounded-lg cursor-pointer transition-all hover:-translate-y-1 hover:border-emerald-500/30 group shadow-sm">
                    <div className="font-semibold text-sm text-slate-200 mb-2 leading-snug group-hover:text-emerald-400 transition-colors">{t.title}</div>
                    <div className="flex items-center gap-2 text-xs">
                        {t.priority && (<span className={`px-2 py-0.5 rounded uppercase font-bold tracking-wider text-[10px] ${t.priority === 'high' ? 'bg-red-500/20 text-red-400' : t.priority === 'medium' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}>{t.priority}</span>)}
                        <span className="text-slate-500 ml-auto">{t.due ? `Due: ${t.due}` : t.completed ? `Done: ${t.completed}` : t.start}</span>
                    </div>
                </div>
            ))}
        </div>
    </div>
);
const ChatMessage = ({ user, time, text, initials, color }) => (
    <div className="flex gap-4 group">
        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-lg`}>{initials}</div>
        <div>
            <div className="flex items-baseline gap-3 mb-1"><span className="font-bold text-slate-200">{user}</span><span className="text-xs text-slate-500">{time}</span></div>
            <p className="text-slate-400 text-sm leading-relaxed bg-slate-800/50 p-3 rounded-r-xl rounded-bl-xl border border-white/5 group-hover:border-white/10 transition-colors">{text}</p>
        </div>
    </div>
);
const MailFolder = ({ label, count, active, icon: Icon }) => (
    <div className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${active ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-400 hover:bg-white/5'}`}>
        <div className="flex items-center gap-3 font-medium"><Icon size={18} /> {label}</div>
        {count && <span className={active ? 'bg-emerald-500 text-white text-xs px-2 rounded-full font-bold' : 'text-slate-600 text-xs'}>{count}</span>}
    </div>
);
const MailItem = ({ from, subject, preview, time, unread }) => (
    <div className={`p-4 border-b border-white/5 cursor-pointer transition-colors hover:bg-white/5 ${unread ? 'bg-emerald-500/5' : ''}`}>
        <div className="flex justify-between items-center mb-1"><span className={`text-sm ${unread ? 'font-bold text-slate-100' : 'font-semibold text-slate-300'}`}>{from}</span><span className="text-xs text-slate-500">{time}</span></div>
        <div className={`text-sm mb-1 ${unread ? 'font-bold text-emerald-400' : 'text-slate-400'}`}>{subject}</div>
        <div className="text-xs text-slate-500 truncate">{preview}</div>
    </div>
);

export default App;
