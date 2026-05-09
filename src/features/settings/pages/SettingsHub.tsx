import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ListChecks,
  Tag,
  AlertTriangle,
  Clock,
  ChevronRight,
  Shield,
  Server,
  Calendar
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { PageHeader } from '@/components/common/page-header';

export const SettingsHub: React.FC = () => {
  const navigate = useNavigate();

  const settingCards = [
    {
      title: 'Task Status',
      description: 'Manage statuses for workflows (Open, In Progress, Done).',
      icon: ListChecks,
      color: 'blue',
      path: '/task-status'
    },
    {
      title: 'Role Master',
      description: 'Manage user roles and permissions.',
      icon: Shield,
      color: 'green',
      path: '/roles'
    },
    {
      title: 'Leave Master',
      description: 'Manage leave types and policies.',
      icon: Calendar,
      color: 'orange',
      path: '/leave'
    },
    {
      title: 'Task Type',
      description: 'Define types of tasks (Bug, Feature, Support).',
      icon: Tag,
      color: 'indigo',
      path: '/task-type'
    },
    {
      title: 'Priority Master',
      description: 'Configure task priority levels (High, Medium, Low).',
      icon: AlertTriangle,
      color: 'red',
      path: '/priority'
    },
    {
      title: 'Scheduler',
      description: 'Manage automated jobs and email triggers.',
      icon: Clock,
      color: 'amber',
      path: '/scheduler'
    },
    {
      title: 'SMTP Master',
      description: 'Configure email server settings.',
      icon: Server,
      color: 'blue',
      path: '/smtp'
    }
  ];

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      {/* Header Section */}
      <PageHeader 
        title="Settings & Configuration"
        description="Manage system masters, automations, and global preferences"
        showBack={true}
        onBack={() => navigate('/')}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {settingCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              onClick={() => navigate(card.path)}
              className={`bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer group`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className={cn(
                  "p-3 rounded-xl transition-all shadow-sm group-hover:scale-110",
                  card.color === 'blue' && "bg-blue-100 text-blue-600",
                  card.color === 'green' && "bg-green-100 text-green-600",
                  card.color === 'orange' && "bg-orange-100 text-orange-600",
                  card.color === 'indigo' && "bg-indigo-100 text-indigo-600",
                  card.color === 'red' && "bg-red-100 text-red-600",
                  card.color === 'amber' && "bg-amber-100 text-amber-600",
                )}>
                  <Icon size={24} />
                </div>
                <ChevronRight size={20} className="text-gray-300 group-hover:text-gray-400 group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{card.title}</h3>
              <p className="text-sm text-gray-500 font-medium">{card.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
