import React, { useMemo, useState } from 'react';
import { DndContext, DragOverlay, useDraggable, useDroppable, PointerSensor, useSensor, useSensors, type DragStartEvent, type DragEndEvent } from '@dnd-kit/core';
import { createPortal } from 'react-dom';
import type { TaskViewModel, StatusLookupModel } from '@/features/tasks/types/task.types';

import { useTimeTracking } from '@/providers/time-tracking-provider';
import { Play, Square } from 'lucide-react';

const getPriorityColor = (priority?: string) => {
    switch (priority?.toLowerCase()) {
        case 'high': return 'bg-red-100 text-red-800';
        case 'medium': return 'bg-amber-100 text-amber-800';
        case 'low': return 'bg-green-100 text-green-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

interface KanbanCardProps {
    task: TaskViewModel;
    isOverlay?: boolean;
    onTaskClick?: (task: TaskViewModel) => void;
}

const KanbanCard: React.FC<KanbanCardProps> = ({ task, isOverlay = false, onTaskClick }) => {
    const { isRunning, activeTask, startTimer, stopTimer } = useTimeTracking();
    const isCurrentActive = activeTask?.taskIDP === task.taskIDP;

    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: `task-${task.taskIDP}`,
        data: task,
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

    const baseClasses = "bg-white p-3 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all";
    const overlayClasses = "bg-white p-3 rounded-lg shadow-xl border-2 border-indigo-500 scale-105 rotate-2 cursor-grabbing";

    if (isOverlay) {
        return (
            <div className={overlayClasses}>
                <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-semibold text-gray-500">{task.taskNo}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${getPriorityColor(task.priorityName)}`}>{task.priorityName || 'Normal'}</span>
                </div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">{task.taskTitle}</h4>
                <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                        <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold">
                            {(task.assignTo || '?').substring(0, 2).toUpperCase()}
                        </div>
                        <span className="truncate max-w-[80px]">{task.assignTo}</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className={`${baseClasses} ${isDragging ? 'opacity-30' : 'cursor-pointer active:cursor-grabbing'}`}
        >
            <div className="flex justify-between items-start mb-2 group">
                <span className="text-xs font-semibold text-gray-400 group-hover:text-blue-600 transition-colors uppercase tracking-widest">{task.taskNo || '-'}</span>
                <div className="flex items-center gap-1.5">
                    {/* Inline Timer for Kanban */}
                    {isCurrentActive ? (
                        <button 
                            onClick={(e) => { e.stopPropagation(); stopTimer(); }}
                            className="p-1 bg-rose-500 text-white rounded shadow-lg shadow-rose-500/20 animate-pulse"
                            title="Stop"
                        >
                            <Square size={10} fill="white" />
                        </button>
                    ) : (
                        <button 
                            onClick={(e) => { e.stopPropagation(); startTimer(task); }}
                            className="p-1 bg-emerald-500 text-white rounded shadow-lg shadow-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Start"
                        >
                            <Play size={10} fill="white" />
                        </button>
                    )}
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded shadow-sm ${getPriorityColor(task.priorityName)}`}>{task.priorityName || 'Normal'}</span>
                </div>
            </div>
            <h4 onClick={(e) => { e.stopPropagation(); onTaskClick && onTaskClick(task); }} className="text-sm font-bold text-gray-900 mb-3 line-clamp-2 hover:text-blue-600 transition-colors">{task.taskTitle || 'Untitled'}</h4>
            <div className="flex items-center justify-between text-[10px] font-black text-gray-400 uppercase tracking-tight">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-black border border-blue-200">
                        {(task.assignTo || '?').substring(0, 2).toUpperCase()}
                    </div>
                    <span className="text-gray-900">{task.assignTo}</span>
                </div>
                <span className="bg-gray-50 px-2 py-0.5 rounded border border-gray-100">{task.deadlineDate ? new Date(task.deadlineDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : '-'}</span>
            </div>
        </div>
    );
};

interface KanbanColumnProps {
    status: StatusLookupModel;
    tasks: TaskViewModel[];
    onTaskClick: (task: TaskViewModel) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ status, tasks, onTaskClick }) => {
    const { isOver, setNodeRef } = useDroppable({
        id: `status-${status.taskStatusIDP}`,
        data: status
    });

    return (
        <div ref={setNodeRef} className={`flex-shrink-0 w-80 bg-gray-100 rounded-xl p-3 flex flex-col h-full transition-colors ${isOver ? 'bg-indigo-50 ring-2 ring-indigo-200' : ''}`}>
            <div className="flex items-center justify-between mb-3 px-1">
                <h3 className="font-semibold text-gray-700 text-sm flex items-center gap-2">
                    {status.taskStatus}
                    <span className="bg-gray-200 text-gray-600 py-0.5 px-2 rounded-full text-xs">{tasks.length}</span>
                </h3>
            </div>
            <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-1" style={{ minHeight: '100px' }}>
                {tasks.map(task => (
                    <KanbanCard key={task.taskIDP} task={task} onTaskClick={onTaskClick} />
                ))}
                {tasks.length === 0 && (
                    <div className="h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 text-sm">
                        Drop here
                    </div>
                )}
            </div>
        </div>
    );
};

interface KanbanBoardProps {
    tasks: TaskViewModel[];
    statuses: any[];
    onStatusChange: (task: TaskViewModel, oldStatusId: number, newStatusId: number) => void;
    onTaskClick: (task: TaskViewModel) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ tasks, statuses, onStatusChange, onTaskClick }) => {
    const [activeTask, setActiveTask] = useState<TaskViewModel | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        })
    );

    const tasksByStatus = useMemo(() => {
        const grouped: Record<number, TaskViewModel[]> = {};
        statuses.forEach((s: any) => {
            const id = s.taskStatusIDP;
            if (id !== undefined) {
                grouped[id] = [];
            }
        });
        tasks.forEach(task => {
            if (grouped[task.taskStatusIDF]) {
                grouped[task.taskStatusIDF].push(task);
            } else {
                if (!grouped[0]) grouped[0] = [];
                grouped[0].push(task);
            }
        });
        return grouped;
    }, [tasks, statuses]);

    const handleDragStart = (event: DragStartEvent) => {
        setActiveTask(event.active.data.current as TaskViewModel);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveTask(null);

        if (!over) return;

        const task = active.data.current as TaskViewModel;
        const oldStatusId = task.taskStatusIDF;
        const newStatusIdStr = over.id.toString();

        if (newStatusIdStr.startsWith('status-')) {
            const newStatusId = parseInt(newStatusIdStr.replace('status-', ''), 10);
            if (oldStatusId !== newStatusId) {
                onStatusChange(task, oldStatusId, newStatusId);
            }
        }
    };

    return (
        <div className="flex overflow-x-auto pb-4 gap-4 h-[calc(100vh-280px)] items-start">
            <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                {statuses.map((status: any) => {
                    const statusId = status.taskStatusIDP;
                    return (
                        <KanbanColumn
                            key={statusId}
                            status={{ ...status, taskStatusIDP: statusId }}
                            tasks={tasksByStatus[statusId] || []}
                            onTaskClick={onTaskClick}
                        />
                    );
                })}
                {createPortal(
                    <DragOverlay>
                        {activeTask ? <KanbanCard task={activeTask} isOverlay /> : null}
                    </DragOverlay>,
                    document.body
                )}
            </DndContext>
        </div>
    );
};
