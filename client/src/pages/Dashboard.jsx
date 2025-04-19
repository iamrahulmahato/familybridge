import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const stats = [
    { title: 'Upcoming Appointments', value: '3', icon: '📅', colorClass: 'bg-[var(--color-primary)]' },
    { title: 'Pending Tasks', value: '5', icon: '✅', colorClass: 'bg-[var(--color-secondary)]' },
    { title: 'Health Records', value: '12', icon: '📊', colorClass: 'bg-[var(--color-accent-1)]' },
    { title: 'Family Members', value: '4', icon: '👨‍👩‍👧‍👦', colorClass: 'bg-[var(--color-accent-2)]' },
  ];

  const recentActivity = [
    { type: 'Appointment', description: 'Doctor visit scheduled', time: '2 hours ago' },
    { type: 'Task', description: 'Medication reminder set', time: '4 hours ago' },
    { type: 'Health', description: 'Blood pressure recorded', time: '1 day ago' },
    { type: 'Communication', description: 'New message from Sarah', time: '2 days ago' },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-background)] p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <h1 className="text-2xl font-bold mb-6 text-[var(--color-secondary)]">Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`${stat.colorClass} rounded-xl p-6 text-white shadow-sm hover:shadow-md transition-all`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-80">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <span className="text-3xl">{stat.icon}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="card mb-8">
          <h2 className="text-xl font-semibold mb-4 text-[var(--color-secondary)]">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              to="/calendar"
              className="bg-[var(--color-primary)]/10 p-4 rounded-lg text-center hover:bg-[var(--color-primary)]/20 transition text-[var(--color-primary)]"
            >
              <span className="text-2xl mb-2 block">📅</span>
              Schedule Appointment
            </Link>
            <Link
              to="/tasks"
              className="bg-[var(--color-secondary)]/10 p-4 rounded-lg text-center hover:bg-[var(--color-secondary)]/20 transition text-[var(--color-secondary)]"
            >
              <span className="text-2xl mb-2 block">✅</span>
              Add Task
            </Link>
            <Link
              to="/health"
              className="bg-[var(--color-accent-1)]/10 p-4 rounded-lg text-center hover:bg-[var(--color-accent-1)]/20 transition text-[var(--color-accent-1)]"
            >
              <span className="text-2xl mb-2 block">📊</span>
              Record Health Data
            </Link>
            <Link
              to="/communication"
              className="bg-[var(--color-accent-2)]/10 p-4 rounded-lg text-center hover:bg-[var(--color-accent-2)]/20 transition text-[var(--color-accent-2)]"
            >
              <span className="text-2xl mb-2 block">💬</span>
              Send Message
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4 text-[var(--color-secondary)]">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center justify-between p-4 border-b last:border-b-0 border-[var(--color-background-alt)]"
              >
                <div>
                  <p className="font-medium text-[var(--color-secondary)]">{activity.type}</p>
                  <p className="text-[var(--color-secondary)]/70">{activity.description}</p>
                </div>
                <span className="text-sm text-[var(--color-secondary)]/50">{activity.time}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard; 