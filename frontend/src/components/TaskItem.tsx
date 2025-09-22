import React, { useState } from 'react';
import { Task } from '../types/Task';
import { format, isAfter, isToday, isTomorrow } from 'date-fns';
import toast from 'react-hot-toast';

interface TaskItemProps {
  task: Task;
  onTaskUpdated: (task: Task) => void;
  onTaskDeleted: (taskId: string) => void;
  onEditTask: (task: Task) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onTaskUpdated,
  onTaskDeleted,
  onEditTask
}) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/tasks/${task._id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const updatedTask = { ...task, status: newStatus as any };
        onTaskUpdated(updatedTask);
        toast.success('Task status updated!');
      } else {
        toast.error('Failed to update task status');
      }
    } catch (error) {
      toast.error('Error updating task status');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        const response = await fetch(`/api/tasks/${task._id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          onTaskDeleted(task._id);
          toast.success('Task deleted successfully!');
        } else {
          toast.error('Failed to delete task');
        }
      } catch (error) {
        toast.error('Error deleting task');
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'pending':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDueDateInfo = () => {
    if (!task.dueDate) return null;
    
    const dueDate = new Date(task.dueDate);
    const now = new Date();
    
    if (isToday(dueDate)) {
      return { text: 'Due today', color: 'text-orange-600' };
    } else if (isTomorrow(dueDate)) {
      return { text: 'Due tomorrow', color: 'text-blue-600' };
    } else if (isAfter(dueDate, now)) {
      return { text: `Due ${format(dueDate, 'MMM d')}`, color: 'text-gray-600' };
    } else {
      return { text: `Overdue ${format(dueDate, 'MMM d')}`, color: 'text-red-600' };
    }
  };

  const dueDateInfo = getDueDateInfo();

  return (
    <div className={`card p-6 ${task.status === 'completed' ? 'opacity-75' : ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className={`text-lg font-semibold ${
              task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'
            }`}>
              {task.title}
            </h3>
            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(task.status)}`}>
              {task.status.replace('-', ' ')}
            </span>
            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(task.priority)}`}>
              {task.priority} priority
            </span>
          </div>
          
          {task.description && (
            <p className="text-gray-600 mb-3">{task.description}</p>
          )}
          
          {dueDateInfo && (
            <p className={`text-sm font-medium ${dueDateInfo.color}`}>
              {dueDateInfo.text}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 ml-4">
          {/* Status Update Dropdown */}
          <select
            value={task.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            disabled={isUpdating}
            className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
            title="Update task status"
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          {/* Edit Button */}
          <button
            onClick={() => onEditTask(task)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Edit
          </button>

          {/* Delete Button */}
          <button
            onClick={handleDelete}
            className="text-red-600 hover:text-red-800 text-sm font-medium"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
