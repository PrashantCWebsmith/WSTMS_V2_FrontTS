import React from 'react';
import {
    Users,
    Briefcase,
    CheckSquare,
    Shield,
    Server,
    Activity,
    AlertTriangle,
    TrendingUp
} from 'lucide-react';
import {
    PieChart,
    Pie,
    Cell,
    AreaChart,
    Area,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { useUsers } from '@/features/users/hooks/queries/user.queries';
import { useProjects } from '@/features/projects/hooks/queries/project.queries';
import { useIncidents } from '@/features/incidents/hooks/queries/incident.queries';

const KPICard = ({ title, value, trend, icon: Icon, color, subtext, isAlert }: any) => (
    <div className={`p-6 rounded-xl border ${isAlert ? 'border-red-300 ring-4 ring-red-50 bg-white' : 'glass-card'} premium-shadow hover-lift transition-all`}>
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-xl ${color.bg} ${color.text} shadow-inner`}>
                <Icon size={24} />
            </div>
            {trend && (
                <span className={`text-xs font-black px-3 py-1 rounded-full ${trend.includes('+') ? 'bg-green-100/80 text-green-700' : 'bg-red-100/80 text-red-700'} backdrop-blur-sm`}>
                    {trend}
                </span>
            )}
        </div>
        <h3 className="text-3xl font-black text-gray-900 tracking-tight">{value}</h3>
        <p className="text-sm font-semibold text-gray-500 mt-1 uppercase tracking-wider">{title}</p>
        {subtext && <p className="text-[10px] text-gray-400 font-bold mt-4 border-t pt-3 border-gray-100 uppercase">{subtext}</p>}
    </div>
);

const QuickLink = ({ label, icon: Icon, path }: any) => (
    <a href={path} className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-900/90 border border-slate-700 shadow-sm group">
        <Icon size={22} className="mb-2 text-slate-400 group-hover:text-blue-400 transition-colors" />
        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider group-hover:text-white transition-colors">{label}</span>
    </a>
);

export const AdminDashboard: React.FC = () => {
    // API Data Fetching
    const { data: usersRes } = useUsers({ page: 1, size: 1 });
    const { data: projectsRes } = useProjects({ page: 1, size: 5 }); 
    const { data: incidentsRes } = useIncidents({ page: 1, size: 5 }); 

    const stats = {
        users: usersRes?.totalCount || 0,
        projects: projectsRes?.totalCount || 0,
        activeTasks: 142, // Mocked as in V1
        incidents: incidentsRes?.totalCount || 0
    };

    const recentIncidents = (incidentsRes?.data || []).slice(0, 5);
    const activeProjects = (projectsRes?.data || []).slice(0, 5);

    // Mock Chart Data (Matching V1 exactly)
    const revenueData = [
        { name: 'Mon', value: 4000 },
        { name: 'Tue', value: 3000 },
        { name: 'Wed', value: 5000 },
        { name: 'Thu', value: 2780 },
        { name: 'Fri', value: 1890 },
        { name: 'Sat', value: 2390 },
        { name: 'Sun', value: 3490 },
    ];

    const projectDistribution = [
        { name: 'On Track', value: 65, color: '#10B981' },
        { name: 'At Risk', value: 20, color: '#F59E0B' },
        { name: 'Critical', value: 15, color: '#EF4444' },
    ];

    return (
        <div className="p-6 lg:p-8 space-y-8 w-full bg-gray-50/50 min-h-screen animate-in fade-in duration-500 overflow-hidden">
            {/* Header Card */}
            <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-gray-900 leading-tight">Executive Overview</h1>
                    <p className="text-sm font-medium text-gray-400 mt-1 flex items-center">
                        <Activity size={16} className="mr-2 text-green-500" /> System running optimally • Last updated just now
                    </p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 shadow-sm transition-colors cursor-pointer">
                        Export KPI Report
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 shadow-sm transition-colors shadow-blue-200 cursor-pointer">
                        System Health Check
                    </button>
                </div>
            </div>

            {/* Top Level KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard
                    title="Total Projects"
                    value={stats.projects}
                    trend="+12%"
                    icon={Briefcase}
                    color={{ bg: 'bg-blue-50', text: 'text-blue-600' }}
                    subtext="3 Launching this week"
                />
                <KPICard
                    title="Active Team"
                    value={stats.users}
                    trend="+5%"
                    icon={Users}
                    color={{ bg: 'bg-blue-50', text: 'text-blue-600' }}
                    subtext="85% Utilization"
                />
                <KPICard
                    title="System Incidents"
                    value={stats.incidents}
                    trend="-2%"
                    icon={Shield}
                    color={stats.incidents > 0 ? { bg: 'bg-red-50', text: 'text-red-600' } : { bg: 'bg-green-50', text: 'text-green-600' }}
                    subtext="Critical Attention Required"
                    isAlert={stats.incidents > 0}
                />
                <KPICard
                    title="Efficiency Rate"
                    value="94.2%"
                    trend="+0.8%"
                    icon={TrendingUp}
                    color={{ bg: 'bg-green-50', text: 'text-green-600' }}
                    subtext="Ahead of schedule"
                />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Left Column: Charts & Trends (Span 2) */}
                <div className="xl:col-span-2 space-y-8">
                    {/* Charts Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col h-full">
                            <h3 className="text-sm font-black uppercase text-gray-400 tracking-[0.2em] mb-6">Project Health Distribution</h3>
                            <div className="h-64 w-full min-h-[256px]">
                                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                                    <PieChart>
                                        <Pie
                                            data={projectDistribution}
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {projectDistribution.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="flex justify-center gap-4 mt-6">
                                {projectDistribution.map((item, idx) => (
                                    <div key={idx} className="flex items-center text-xs font-medium text-gray-600">
                                        <span className="w-2.5 h-2.5 rounded-full mr-2" style={{ backgroundColor: item.color }}></span>
                                        {item.name}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col h-full">
                            <h3 className="text-sm font-black uppercase text-gray-400 tracking-[0.2em] mb-6">Team Velocity (Hrs)</h3>
                            <div className="h-64 w-full min-h-[256px]">
                                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                                    <AreaChart data={revenueData}>
                                        <defs>
                                            <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                                        <Tooltip />
                                        <Area type="monotone" dataKey="value" stroke="#6366F1" fillOpacity={1} fill="url(#colorVal)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Active Projects Table */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-900">High Priority Projects</h3>
                            <button className="text-sm text-blue-600 font-medium hover:text-blue-800">View All</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-left text-sm whitespace-nowrap">
                                <thead className="bg-[#f8fafc] border-b border-gray-100">
                                    <tr>
                                        <th scope="col" className="px-6 py-4 text-xs font-bold uppercase text-gray-500 tracking-wider">Project Name</th>
                                        <th scope="col" className="px-6 py-4 text-xs font-bold uppercase text-gray-500 tracking-wider border-l border-gray-50">Leader</th>
                                        <th scope="col" className="px-6 py-4 text-xs font-bold uppercase text-gray-500 tracking-wider border-l border-gray-50">Progress</th>
                                        <th scope="col" className="px-6 py-4 text-xs font-bold uppercase text-gray-500 tracking-wider border-l border-gray-50 text-right">Budget</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {activeProjects.length > 0 ? activeProjects.map((proj: any, idx) => (
                                        <tr key={idx} className="border-b border-gray-50">
                                            <td className="px-6 py-4 font-medium text-gray-900">{proj.projectName}</td>
                                            <td className="px-6 py-4 text-gray-500">
                                                <div className="flex items-center">
                                                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 mr-2">
                                                        {proj.projectName ? proj.projectName.substring(0, 1) : 'P'}
                                                    </div>
                                                    Internal Team
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <span className="mr-2 font-medium text-gray-700">75%</span>
                                                    <div className="w-24 bg-gray-200 rounded-full h-1.5">
                                                        <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '75%' }}></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right text-gray-600">$12,500</td>
                                        </tr>
                                    )) : (
                                        <tr><td colSpan={4} className="px-6 py-4 text-center text-gray-500">No active projects found.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right Column: Alerts & Quick Actions (Span 1) */}
                <div className="p-6 space-y-6 w-full overflow-hidden">
                    {/* Critical Incidents Feed */}
                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center">
                                <AlertTriangle className="mr-2 text-red-500" size={20} /> Critical Attention
                            </h3>
                        </div>
                        <div className="space-y-4">
                            {recentIncidents.length > 0 ? recentIncidents.map((inc: any, idx) => (
                                <div key={idx} className="p-4 bg-red-50 rounded-lg border border-red-100 flex items-start gap-3">
                                    <div className="mt-1 min-w-[4px] h-full bg-red-400 rounded-full"></div>
                                    <div className="flex-1">
                                        <h4 className="text-sm font-semibold text-gray-900 line-clamp-1" dangerouslySetInnerHTML={{ __html: inc.criticalPoint?.replace(/<[^>]+>/g, '') || 'Incident Alert' }} />
                                        <p className="text-xs text-red-700 mt-1">Severity: {inc.severity} • {new Date(inc.incidentDate).toLocaleDateString()}</p>
                                    </div>
                                    <button className="text-xs font-medium text-white bg-red-500 hover:bg-red-600 px-2 py-1 rounded">
                                        Resolve
                                    </button>
                                </div>
                            )) : (
                                <div className="text-center py-8 text-gray-500 text-sm">
                                    <CheckSquare size={32} className="mx-auto text-green-400 mb-2" />
                                    No critical incidents.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Master Data Quick Access */}
                    <div className="bg-slate-900 p-6 rounded-xl text-white shadow-lg">
                        <h3 className="text-lg font-bold mb-4">Master Controls</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <QuickLink label="Users" icon={Users} path="/users" />
                            <QuickLink label="Projects" icon={Briefcase} path="/projects" />
                            <QuickLink label="Incidents" icon={Shield} path="/incidents" />
                            <QuickLink label="Settings" icon={Server} path="/settings" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
