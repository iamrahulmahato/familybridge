import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import axios from 'axios';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => state.auth);

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    assignedTo: user?._id
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/tasks`, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setTasks(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to fetch tasks');
      setLoading(false);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (newTask.title.trim() === '') return;

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/tasks`, newTask, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setTasks([...tasks, response.data]);
      setNewTask({
        title: '',
        description: '',
        dueDate: '',
        priority: 'medium',
        assignedTo: user?._id
      });
      toast.success('Task added successfully');
    } catch (error) {
      console.error('Error adding task:', error);
      toast.error('Failed to add task');
    }
  };

  const handleToggleComplete = async (taskId) => {
    try {
      const task = tasks.find(t => t._id === taskId);
      const response = await axios.patch(
        `${process.env.REACT_APP_API_URL}/api/tasks/${taskId}`,
        { completed: !task.completed },
        { headers: { Authorization: `Bearer ${user?.token}` }}
      );
      setTasks(tasks.map(task =>
        task._id === taskId ? response.data : task
      ));
      toast.success('Task updated successfully');
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setTasks(tasks.filter(task => task._id !== taskId));
      toast.success('Task deleted successfully');
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-[var(--color-tertiary)]/10 text-[var(--color-tertiary)]';
      case 'medium':
        return 'bg-[var(--color-accent-1)]/10 text-[var(--color-accent-1)]';
      case 'low':
        return 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[var(--color-secondary)]">Tasks</h1>
        </div>

        {/* Add Task Form */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-[var(--color-secondary)] mb-4">Add New Task</h2>
          <form onSubmit={handleAddTask} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-secondary)]">Task Title</label>
              <input
                type="text"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]/50"
                placeholder="Enter task title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-secondary)]">Description</label>
              <textarea
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]/50"
                placeholder="Enter task description"
                rows="3"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--color-secondary)]">Due Date</label>
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-secondary)]">Priority</label>
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]/50"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="bg-[var(--color-primary)] text-white px-4 py-2 rounded-md hover:bg-[var(--color-primary)]/90 transition-colors"
            >
              Add Task
            </button>
          </form>
        </div>

        {/* Tasks List */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-[var(--color-secondary)] mb-4">Task List</h2>
          <div className="space-y-4">
            {tasks.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No tasks found</p>
            ) : (
              tasks.map((task) => (
                <motion.div
                  key={task._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className={`flex items-center justify-between p-4 border rounded-lg ${
                    task.completed ? 'bg-[var(--color-background-alt)]' : ''
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleToggleComplete(task._id)}
                      className="h-5 w-5 text-[var(--color-primary)] rounded focus:ring-[var(--color-primary)]/50"
                    />
                    <div>
                      <h3 className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-[var(--color-secondary)]'}`}>
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className={`text-sm mt-1 ${task.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                          {task.description}
                        </p>
                      )}
                      <div className="flex items-center space-x-2 mt-2">
                        {task.dueDate && (
                          <span className="text-xs text-gray-500">
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        )}
                        <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteTask(task._id)}
                    className="text-gray-400 hover:text-[var(--color-tertiary)] transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Tasks; 