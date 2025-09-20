import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Task, CreateTaskData, UpdateTaskData } from '../types/Task';
import toast from 'react-hot-toast';

interface TaskFormProps {
  task?: Task | null;
  onTaskCreated: (task: Task) => void;
  onTaskUpdated: (task: Task) => void;
  onClose: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({
  task,
  onTaskCreated,
  onTaskUpdated,
  onClose
}) => {
  const [loading, setLoading] = useState(false);
  const isEditing = !!task;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<CreateTaskData>({
    defaultValues: {
      title: task?.title || '',
      description: task?.description || '',
      status: task?.status || 'pending',
      priority: task?.priority || 'medium',
      dueDate: task?.dueDate ? task.dueDate.split('T')[0] : ''
    }
  });

  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description || '',
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : ''
      });
    }
  }, [task, reset]);

  const onSubmit = async (data: CreateTaskData) => {
    setLoading(true);
    try {
      if (isEditing) {
        // Update existing task
        const response = await fetch(`/api/tasks/${task._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          const updatedTask = await response.json();
          onTaskUpdated(updatedTask.data);
          toast.success('Task updated successfully!');
        } else {
          const error = await response.json();
          toast.error(error.message || 'Failed to update task');
        }
      } else {
        // Create new task
        const response = await fetch('/api/tasks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          const newTask = await response.json();
          onTaskCreated(newTask.data);
          toast.success('Task created successfully!');
        } else {
          const error = await response.json();
          toast.error(error.message || 'Failed to create task');
        }
      }
      onClose();
    } catch (error) {
      toast.error('An error occurred while saving the task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {isEditing ? 'Edit Task' : 'Create New Task'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                {...register('title', {
                  required: 'Title is required',
                  maxLength: {
                    value: 100,
                    message: 'Title cannot exceed 100 characters'
                  }
                })}
                type="text"
                className="input-field"
                placeholder="Enter task title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                {...register('description', {
                  maxLength: {
                    value: 500,
                    message: 'Description cannot exceed 500 characters'
                  }
                })}
                rows={3}
                className="input-field"
                placeholder="Enter task description (optional)"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            {/* Status and Priority */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  {...register('status')}
                  className="input-field"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  {...register('priority')}
                  className="input-field"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <input
                {...register('dueDate')}
                type="date"
                className="input-field"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
              >
                {loading ? 'Saving...' : (isEditing ? 'Update Task' : 'Create Task')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskForm;
