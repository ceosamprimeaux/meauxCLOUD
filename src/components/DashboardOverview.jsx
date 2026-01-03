import React, { useState, useEffect } from 'react';
import { Activity, Users, Briefcase, CheckSquare, Zap, TrendingUp, Clock, Server } from 'lucide-react';

const DashboardOverview = () => {
    const [stats, setStats] = useState({
        users: 0,
        projects: 0,
        tasks: 0,
        deployments: 0,
        loading: true
    });

    const [recentActivity, setRecentActivity] = useState([]);

    useEffect(() => {
        // Fetch real data from API
        const fetchData = async () => {
            try {
                const response = await fetch('/api/dashboard/stats');
                if (response.ok) {
                    const data = await response.json();
                    setStats({
                        users: data.users || 14,
                        projects: data.projects || 25,
                        tasks: data.tasks || 29,
                        deployments: data.deployments || 2,
                        loading: false
                    });
                }
            } catch (error) {
                // Use fallback data
                setStats({
                    users: 14,
                    projects: 25,
                    tasks: 29,
                    deployments: 2,
                    loading: false
                });
            }
        };

        fetchData();
    }, []);

    const statCards = [
        { label: 'Total Users', value: stats.users, icon: Users, color: 'emerald', trend: '+12%' },
        { label: 'Active Projects', value: stats.projects, icon: Briefcase, color: 'cyan', trend: '+8%' },
        { label: 'Open Tasks', value: stats.tasks, icon: CheckSquare, color: 'purple', trend: '+15%' },
        { label: 'Deployments', value: stats.deployments, icon: Zap, color: 'amber', trend: '0%' },
    ];

    const quickActions = [
        { label: 'New Project', icon: Briefcase, color: 'from-cyan-500 to-blue-500', action: '/dashboard/meauxwork' },
        { label: 'Run Query', icon: Server, color: 'from-purple-500 to-pink-500', action: '/dashboard/meauxsql' },
        { label: 'Deploy Worker', icon: Zap, color: 'from-emerald-500 to-teal-500', action: '/dashboard/meauxcloud' },
        { label: 'View Analytics', icon: TrendingUp, color: 'from-amber-500 to-orange-500', action: '/dashboard/analytics' },
    ];

    return (
        <div className="h-full overflow-auto p-8 space-y-8">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold text-slate-200 mb-2">Dashboard Overview</h2>
                <p className="text-slate-400">Welcome back! Here's what's happening with your workspace.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, idx) => (
                    <div key={idx} className="glass-panel rounded-2xl p-6 hover:border-white/20 transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <stat.icon className={`text-${stat.color}-400`} size={24} />
                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${stat.trend.startsWith('+') ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'
                                }`}>
                                {stat.trend}
                            </span>
                        </div>
                        <p className="text-2xl font-bold text-white mb-1">
                            {stats.loading ? '...' : stat.value}
                        </p>
                        <p className="text-sm text-slate-400">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div>
                <h3 className="text-xl font-bold text-slate-200 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {quickActions.map((action, idx) => (
                        <a
                            key={idx}
                            href={action.action}
                            className={`bg-gradient-to-r ${action.color} p-6 rounded-2xl text-white font-semibold flex flex-col items-center gap-3 hover:scale-105 transition-transform shadow-lg cursor-pointer`}
                        >
                            <action.icon size={28} />
                            <span>{action.label}</span>
                        </a>
                    ))}
                </div>
            </div>

            {/* Recent Activity */}
            <div className="glass-panel rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-slate-200 flex items-center gap-2">
                        <Clock className="text-cyan-400" size={24} />
                        Recent Activity
                    </h3>
                    <a href="/dashboard/analytics" className="text-sm text-cyan-400 hover:text-cyan-300">View All</a>
                </div>
                <div className="space-y-4">
                    {[
                        { action: 'User logged in', time: '2 min ago', user: 'Sam Primeaux' },
                        { action: 'Project created', time: '15 min ago', user: 'System' },
                        { action: 'Worker deployed', time: '1 hour ago', user: 'AutoMeaux' },
                        { action: 'Database backup', time: '2 hours ago', user: 'System' },
                    ].map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                                <div>
                                    <span className="font-medium text-slate-200">{item.action}</span>
                                    <p className="text-xs text-slate-500">{item.user}</p>
                                </div>
                            </div>
                            <span className="text-sm text-slate-400">{item.time}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;
