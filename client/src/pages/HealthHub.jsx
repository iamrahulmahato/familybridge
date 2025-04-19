import React, { useState } from 'react';
import { motion } from 'framer-motion';

const HealthHub = () => {
  const [showAddRecord, setShowAddRecord] = useState(false);
  const [records, setRecords] = useState([]);
  const [newRecord, setNewRecord] = useState({
    type: 'blood_pressure',
    value: '',
    notes: '',
    date: new Date().toISOString().split('T')[0]
  });

  const handleAddRecord = (e) => {
    e.preventDefault();
    setRecords([...records, { ...newRecord, id: Date.now() }]);
    setShowAddRecord(false);
    setNewRecord({
      type: 'blood_pressure',
      value: '',
      notes: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  const getRecordIcon = (type) => {
    switch (type) {
      case 'blood_pressure':
        return '🫀';
      case 'blood_sugar':
        return '🩸';
      case 'weight':
        return '⚖️';
      case 'medication':
        return '💊';
      default:
        return '📝';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Health Hub</h1>
            <button
              onClick={() => setShowAddRecord(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Add Record
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {records.map(record => (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border rounded-lg p-4 shadow-sm"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{getRecordIcon(record.type)}</span>
                  <span className="text-sm text-gray-500">{record.date}</span>
                </div>
                <h3 className="font-semibold capitalize">{record.type.replace('_', ' ')}</h3>
                <p className="text-2xl font-bold text-blue-600">{record.value}</p>
                {record.notes && (
                  <p className="text-sm text-gray-600 mt-2">{record.notes}</p>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {showAddRecord && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          >
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Add Health Record</h2>
              <form onSubmit={handleAddRecord}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Type</label>
                    <select
                      value={newRecord.type}
                      onChange={(e) => setNewRecord({ ...newRecord, type: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="blood_pressure">Blood Pressure</option>
                      <option value="blood_sugar">Blood Sugar</option>
                      <option value="weight">Weight</option>
                      <option value="medication">Medication</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Value</label>
                    <input
                      type="text"
                      value={newRecord.value}
                      onChange={(e) => setNewRecord({ ...newRecord, value: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Notes</label>
                    <textarea
                      value={newRecord.notes}
                      onChange={(e) => setNewRecord({ ...newRecord, notes: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      rows="3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date</label>
                    <input
                      type="date"
                      value={newRecord.date}
                      onChange={(e) => setNewRecord({ ...newRecord, date: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAddRecord(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Add Record
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default HealthHub; 