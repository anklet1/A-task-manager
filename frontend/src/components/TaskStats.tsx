import React from 'react';
import { Task } from '../types/Task';

interface TaskStatsProps {
  tasks: Task[];
}

const TaskStats: React.FC<TaskStatsProps> = ({ tasks }) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const pendingTasks = tasks.filter(task => task.status === 'pending').length;
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length;
  const highPriorityTasks = tasks.filter(task => task.priority === 'high').length;

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const stats = [
    {
      name: 'Total Tasks',
      value: totalTasks,
      color: 'bg-blue-500',
      icon: '📋'
    },
    {
      name: 'Completed',
      value: completedTasks,
      color: 'bg-green-500',
      icon: '✅'
    },
    {
      name: 'In Progress',
      value: inProgressTasks,
      color: 'bg-yellow-500',
      icon: '🔄'
    },
    {
      name: 'Pending',
      value: pendingTasks,
      color: 'bg-gray-500',
      icon: '⏳'
    },
    {
      name: 'High Priority',
      value: highPriorityTasks,
      color: 'bg-red-500',
      icon: '🔥'
    },
    {
      name: 'Completion Rate',
      value: `${completionRate}%`,
      color: 'bg-purple-500',
      icon: '📊'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
      {stats.map((stat) => (
        <div key={stat.name} className="card p-6">
          <div className="flex items-center">
            <div className={`${stat.color} rounded-lg p-3 mr-4`}>
              <span className="text-2xl">{stat.icon}</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.name}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskStats;
