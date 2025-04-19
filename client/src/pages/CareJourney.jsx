import React, { useState } from 'react';
import { motion } from 'framer-motion';

const CareJourney = () => {
  const [activeTab, setActiveTab] = useState('timeline');

  const milestones = [
    {
      id: 1,
      date: 'March 1, 2024',
      title: 'Initial Assessment',
      description: 'Completed initial health assessment with Dr. Smith',
      status: 'completed',
    },
    {
      id: 2,
      date: 'March 15, 2024',
      title: 'Care Plan Review',
      description: 'Scheduled review of current care plan',
      status: 'upcoming',
    },
    {
      id: 3,
      date: 'April 1, 2024',
      title: 'Medication Adjustment',
      description: 'Potential medication dosage adjustment based on progress',
      status: 'planned',
    },
  ];

  const goals = [
    {
      id: 1,
      title: 'Improve Mobility',
      description: 'Increase daily walking distance to 1 mile',
      progress: 75,
      deadline: 'April 30, 2024',
    },
    {
      id: 2,
      title: 'Medication Adherence',
      description: 'Maintain 100% medication adherence rate',
      progress: 90,
      deadline: 'Ongoing',
    },
    {
      id: 3,
      title: 'Nutrition Plan',
      description: 'Follow prescribed diet plan consistently',
      progress: 60,
      deadline: 'May 15, 2024',
    },
  ];

  const careTeam = [
    {
      id: 1,
      name: 'Dr. Sarah Smith',
      role: 'Primary Care Physician',
      contact: 'sarah.smith@healthcare.com',
    },
    {
      id: 2,
      name: 'Nurse Jane Doe',
      role: 'Care Coordinator',
      contact: 'jane.doe@healthcare.com',
    },
    {
      id: 3,
      name: 'Physical Therapist',
      role: 'Rehabilitation Specialist',
      contact: 'pt@healthcare.com',
    },
  ];

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Care Journey</h1>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6 border-b">
          {['timeline', 'goals', 'team'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 px-4 capitalize ${
                activeTab === tab
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Timeline Tab */}
        {activeTab === 'timeline' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Care Journey Timeline</h2>
            <div className="space-y-6">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-start"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                    {milestone.status === 'completed' ? '✓' : '○'}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium">{milestone.title}</h3>
                      <span className="text-sm text-gray-500">{milestone.date}</span>
                    </div>
                    <p className="text-gray-600 mt-1">{milestone.description}</p>
                    <div className="mt-2">
                      <span className={`text-sm px-2 py-1 rounded-full ${
                        milestone.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : milestone.status === 'upcoming'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {milestone.status}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Goals Tab */}
        {activeTab === 'goals' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Care Goals</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {goals.map((goal, index) => (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="border rounded-lg p-4"
                >
                  <h3 className="font-medium mb-2">{goal.title}</h3>
                  <p className="text-gray-600 mb-4">{goal.description}</p>
                  <div className="mb-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{goal.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${goal.progress}%` }}
                      />
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">
                    Deadline: {goal.deadline}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Team Tab */}
        {activeTab === 'team' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Care Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {careTeam.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="border rounded-lg p-4"
                >
                  <h3 className="font-medium mb-1">{member.name}</h3>
                  <p className="text-gray-600 mb-2">{member.role}</p>
                  <p className="text-sm text-gray-500">{member.contact}</p>
                  <button className="mt-4 text-blue-600 hover:text-blue-800">
                    Contact
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default CareJourney; 