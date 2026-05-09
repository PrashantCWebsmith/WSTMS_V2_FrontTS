import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  FileText,
  Download,
  Printer,
  Filter,
  ArrowUpRight,
  Briefcase,
  CheckSquare,
  Clock,
  TrendingUp,
  X,
  Loader
} from 'lucide-react';
import { SearchableSelect } from '@/components/ui/SearchableSelect';

export const ReportsDashboard: React.FC = () => {
  const [activeReport, setActiveReport] = useState('tasks');
  const [isLoading] = useState(false); // Placeholder for future logic

  // Mock Data
  const taskData = [
    { name: 'Mon', completed: 12, added: 15 },
    { name: 'Tue', completed: 18, added: 10 },
    { name: 'Wed', completed: 15, added: 12 },
    { name: 'Thu', completed: 22, added: 18 },
    { name: 'Fri', completed: 25, added: 14 },
    { name: 'Sat', completed: 10, added: 5 },
    { name: 'Sun', completed: 5, added: 2 },
  ];

  const projectData = [
    { name: 'Website Redesign', progress: 85, status: 'On Track' },
    { name: 'Mobile App', progress: 45, status: 'At Risk' },
    { name: 'Marketing Campaign', progress: 60, status: 'On Track' },
    { name: 'CRM Integration', progress: 30, status: 'Delayed' },
    { name: 'Data Migration', progress: 95, status: 'On Track' },
  ];

  const timeData = [
    { name: 'John Doe', hours: 42, billable: 38 },
    { name: 'Sarah Smith', hours: 38, billable: 35 },
    { name: 'Mike Johnson', hours: 45, billable: 40 },
    { name: 'Emily Davis', hours: 35, billable: 30 },
    { name: 'Robert Wilson', hours: 40, billable: 40 },
  ];

  const pieData = [
    { name: 'Completed', value: 45, color: '#10B981' },
    { name: 'In Progress', value: 30, color: '#3B82F6' },
    { name: 'Pending', value: 15, color: '#F59E0B' },
    { name: 'Overdue', value: 10, color: '#EF4444' },
  ];

  const renderChart = () => {
    switch (activeReport) {
      case 'tasks':
        return (
          <ResponsiveContainer width="100%" height={350} minWidth={0}>
            <BarChart data={taskData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} />
              <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
              <Legend />
              <Bar dataKey="completed" name="Completed Tasks" fill="#10B981" radius={[4, 4, 0, 0]} barSize={32} />
              <Bar dataKey="added" name="New Tasks" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={32} />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'projects':
        return (
          <ResponsiveContainer width="100%" height={350} minWidth={0}>
            <BarChart data={projectData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E5E7EB" />
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" width={150} tick={{ fill: '#6B7280' }} tickLine={false} axisLine={false} />
              <Tooltip cursor={{ fill: '#F9FAFB' }} contentStyle={{ borderRadius: '8px', border: 'none' }} />
              <Bar dataKey="progress" name="Progress %" fill="#3B82F6" radius={[0, 4, 4, 0]} barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'time':
        return (
          <ResponsiveContainer width="100%" height={350} minWidth={0}>
            <BarChart data={timeData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} />
              <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none' }} />
              <Legend />
              <Bar dataKey="hours" name="Total Hours" fill="#2563EB" radius={[4, 4, 0, 0]} barSize={32} />
              <Bar dataKey="billable" name="Billable Hours" fill="#34D399" radius={[4, 4, 0, 0]} barSize={32} />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'productivity':
        return (
          <ResponsiveContainer width="100%" height={350} minWidth={0}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={110}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none' }} />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  const renderTable = () => {
    let columns: string[] = [];
    let data: any[] = [];

    if (activeReport === 'tasks') {
      columns = ['Date', 'Tasks Created', 'Tasks Completed', 'Completion Rate'];
      data = taskData.map(d => ({
        col1: d.name,
        col2: d.added,
        col3: d.completed,
        col4: `${Math.round((d.completed / (d.added || 1)) * 100)}%`
      }));
    } else if (activeReport === 'projects') {
      columns = ['Project Name', 'Progress', 'Status', 'Due Date'];
      data = projectData.map(d => ({
        col1: d.name,
        col2: `${d.progress}%`,
        col3: d.status,
        col4: '2026-02-15'
      }));
    } else if (activeReport === 'time') {
      columns = ['User', 'Total Hours', 'Billable Hours', 'Utilization'];
      data = timeData.map(d => ({
        col1: d.name,
        col2: d.hours,
        col3: d.billable,
        col4: `${Math.round((d.billable / d.hours) * 100)}%`
      }));
    } else {
      columns = ['Status', 'Count', 'Percentage', 'Trend'];
      data = pieData.map(d => ({
        col1: d.name,
        col2: d.value,
        col3: `${d.value}%`,
        col4: '+5%'
      }));
    }

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100">
          <thead>
            <tr className="bg-gray-50 text-xs font-bold uppercase text-gray-500 tracking-wider">
              {columns.map((col, idx) => (
                <th key={idx} className="px-6 py-4 text-left">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {isLoading ? (
                <tr>
                    <td colSpan={columns.length} className="py-20 text-center border-b border-gray-50">
                        <Loader className="animate-spin text-blue-500 inline-block mb-2" size={32} />
                        <p className="text-gray-500 text-sm italic">Fetching analytical breakdowns...</p>
                    </td>
                </tr>
            ) : data.map((row, idx) => (
              <tr key={idx} className="border-b border-gray-50">
                <td className="px-6 py-4 text-sm font-bold text-gray-900">{row.col1}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-600">{row.col2}</td>
                <td className="px-6 py-4 text-sm font-medium">
                  {activeReport === 'projects' ? (
                     <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${row.col3 === 'On Track' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>{row.col3}</span>
                  ) : (
                     <span className="text-gray-600">{row.col3}</span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-600">{row.col4}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <TrendingUp size={28} />
            </div>
            <div>
                <h1 className="text-xl font-bold text-gray-900">Reports Dashboard</h1>
                <p className="text-sm text-gray-500">Holistic overview of system performance.</p>
            </div>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 shadow-sm text-xs font-bold transition-all cursor-pointer">
            <Printer size={14} className="mr-2" /> Print
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm text-xs font-bold transition-all cursor-pointer">
            <Download size={14} className="mr-2" /> Export
          </button>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-wrap gap-4 items-center">
         <div className="flex items-center gap-2 text-gray-700 font-bold bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
            <Filter size={14} className="text-blue-600" />
            <span className="text-xs uppercase">Analysis Scope</span>
         </div>
         <div className="w-48">
            <SearchableSelect
                options={[
                    { value: '30_days', label: 'Last 30 Days' },
                    { value: '90_days', label: 'Last 90 Days' },
                    { value: 'year', label: 'This Year' }
                ]}
                value="30_days"
                onChange={() => {}}
                placeholder="Timeframe"
            />
         </div>
         <div className="w-48">
            <SearchableSelect
                options={[
                    { value: 'all', label: 'Global Data' },
                    { value: 'dept', label: 'Departmental' }
                ]}
                value="all"
                onChange={() => {}}
                placeholder="Scope"
            />
         </div>
         <button className="ml-auto w-10 h-10 flex items-center justify-center bg-white border border-gray-200 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all shadow-sm">
            <X size={18} />
         </button>
      </div>

      {/* Metric Switchers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { id: 'tasks', label: 'Tasks Metric', value: '1,240', change: '+12%', icon: CheckSquare, color: 'blue' },
          { id: 'projects', label: 'Project Health', value: '85%', change: '-2%', icon: Briefcase, color: 'blue' },
          { id: 'time', label: 'Total Efforts', value: '842h', change: '+5%', icon: Clock, color: 'blue' },
          { id: 'productivity', label: 'Efficiency', value: '92', change: '+1.5%', icon: TrendingUp, color: 'green' },
        ].map((card) => {
            const isActive = activeReport === card.id;
            const Icon = card.icon;
            
            return (
              <button
                key={card.id}
                onClick={() => setActiveReport(card.id)}
                className={`p-4 rounded-xl border text-left transition-all duration-200 ${
                  isActive
                    ? `bg-${card.color}-50/50 border-${card.color}-200`
                    : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className={`p-2 rounded-lg bg-${card.color}-50 text-${card.color}-600 border border-${card.color}-100`}>
                    <Icon size={18} />
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${card.change.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-rose-100 text-rose-700'}`}>
                    {card.change}
                  </span>
                </div>
                <h3 className={`text-xl font-bold ${isActive ? `text-${card.color}-700` : 'text-gray-900'}`}>{card.value}</h3>
                <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">{card.label}</p>
              </button>
            )
        })}
      </div>

      {/* Main Analysis Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-6 pb-2 border-b border-gray-50">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
              <span className={`w-1.5 h-4 bg-blue-600 rounded-full inline-block`}></span>
              Visual Correlation
            </h3>
            <button className="text-gray-400 hover:text-gray-600 transition-colors">
              <ArrowUpRight size={16} />
            </button>
          </div>
          {renderChart()}
        </div>

        <div className="lg:col-span-1 bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-center">
          <div className="text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-50 text-blue-600 mb-4 border border-blue-100 font-bold">
              <FileText size={28} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1 uppercase tracking-tight">Executive Summary</h3>
            <p className="text-xs font-medium text-gray-500 mb-6">
              Synthesized data overview for the selected analysis scope.
            </p>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 text-left mb-6 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-gray-500 uppercase">Records</span>
                <span className="text-xs font-bold text-gray-900">142</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-gray-500 uppercase">Daily Avg</span>
                <span className="text-xs font-bold text-gray-900">12</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                <span className="text-xs font-bold text-gray-500 uppercase">Health</span>
                <span className="text-xs font-bold text-green-600">92%</span>
              </div>
            </div>
            <button className="w-full py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 text-xs font-bold uppercase tracking-wider transition-all shadow-sm">
              Full Details
            </button>
          </div>
        </div>
      </div>

      {/* Tabular Data Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden animate-fadeIn">
        <div className="px-6 py-3 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
          <span className="w-1.5 h-4 bg-amber-500 rounded-full inline-block"></span>
          <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Tabular Analytical Breakdown</h3>
        </div>
        {renderTable()}
      </div>
    </div>
  );
};
