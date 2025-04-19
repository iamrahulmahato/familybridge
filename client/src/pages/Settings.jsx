import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

const Settings = () => {
  const user = useSelector((state) => state.auth.user);
  const [settings, setSettings] = useState({
    notifications: true,
    emailUpdates: true,
    darkMode: false,
    language: 'en',
    timezone: 'UTC',
  });

  const handleToggle = (setting) => {
    setSettings({
      ...settings,
      [setting]: !settings[setting],
    });
  };

  const handleSelectChange = (e) => {
    setSettings({
      ...settings,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold mb-6">Settings</h1>

        <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
          {/* Notification Settings */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Notification Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Push Notifications</h3>
                  <p className="text-sm text-gray-500">Receive notifications for important updates</p>
                </div>
                <button
                  onClick={() => handleToggle('notifications')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                    settings.notifications ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      settings.notifications ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Email Updates</h3>
                  <p className="text-sm text-gray-500">Receive email notifications</p>
                </div>
                <button
                  onClick={() => handleToggle('emailUpdates')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                    settings.emailUpdates ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      settings.emailUpdates ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Display Settings */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Display Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Dark Mode</h3>
                  <p className="text-sm text-gray-500">Toggle dark mode</p>
                </div>
                <button
                  onClick={() => handleToggle('darkMode')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                    settings.darkMode ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      settings.darkMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Language and Timezone */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Language & Timezone</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Language</label>
                <select
                  name="language"
                  value={settings.language}
                  onChange={handleSelectChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Timezone</label>
                <select
                  name="timezone"
                  value={settings.timezone}
                  onChange={handleSelectChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="UTC">UTC</option>
                  <option value="EST">Eastern Time</option>
                  <option value="PST">Pacific Time</option>
                </select>
              </div>
            </div>
          </div>

          {/* Account Settings */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Account Settings</h2>
            <div className="space-y-4">
              <button className="text-blue-600 hover:text-blue-800">
                Change Password
              </button>
              <button className="text-blue-600 hover:text-blue-800">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Settings; 