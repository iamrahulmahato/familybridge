import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    type: 'appointment'
  });

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const handlePrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1));
  };

  const handleDateClick = (day) => {
    setSelectedDate(day);
    setShowEventForm(true);
    setNewEvent(prev => ({ ...prev, date: format(day, 'yyyy-MM-dd') }));
  };

  const handleAddEvent = (e) => {
    e.preventDefault();
    setEvents([...events, { ...newEvent, id: Date.now() }]);
    setShowEventForm(false);
    setNewEvent({
      title: '',
      description: '',
      date: '',
      type: 'appointment'
    });
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-[var(--color-secondary)]">Calendar</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={handlePrevMonth}
                className="p-2 text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 rounded-full transition-colors"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15.09 19.92L8.57 13.4c-.77-.77-.77-2.03 0-2.8l6.52-6.52" stroke="currentColor" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <h2 className="text-xl font-semibold text-[var(--color-secondary)]">
                {format(currentDate, 'MMMM yyyy')}
              </h2>
              <button
                onClick={handleNextMonth}
                className="p-2 text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 rounded-full transition-colors"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.91 19.92l6.52-6.52c.77-.77.77-2.03 0-2.8L8.91 4.08" stroke="currentColor" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-6">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center font-semibold text-[var(--color-secondary)]">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {daysInMonth.map((day, i) => {
              const dayEvents = events.filter(event => 
                isSameDay(new Date(event.date), day)
              );
              
              return (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  className={`
                    p-2 h-24 border rounded-lg cursor-pointer transition-colors
                    ${isSameMonth(day, currentDate) ? 'bg-white' : 'bg-[var(--color-background-alt)]'}
                    ${isSameDay(day, selectedDate) ? 'border-[var(--color-primary)]' : 'border-gray-200'}
                  `}
                  onClick={() => handleDateClick(day)}
                >
                  <div className={`text-sm font-semibold ${
                    isSameMonth(day, currentDate) ? 'text-[var(--color-secondary)]' : 'text-gray-400'
                  }`}>
                    {format(day, 'd')}
                  </div>
                  <div className="mt-1 space-y-1">
                    {dayEvents.map(event => (
                      <div
                        key={event.id}
                        className={`text-xs p-1 rounded truncate ${
                          event.type === 'appointment' ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]' :
                          event.type === 'birthday' ? 'bg-[var(--color-tertiary)]/10 text-[var(--color-tertiary)]' :
                          event.type === 'anniversary' ? 'bg-[var(--color-accent-1)]/10 text-[var(--color-accent-1)]' :
                          event.type === 'holiday' ? 'bg-[var(--color-accent-2)]/10 text-[var(--color-accent-2)]' :
                          'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {event.title}
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {showEventForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          >
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <h2 className="text-xl font-bold text-[var(--color-secondary)] mb-4">Add Event</h2>
              <form onSubmit={handleAddEvent}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-secondary)]">Title</label>
                    <input
                      type="text"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]/50"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-secondary)]">Description</label>
                    <textarea
                      value={newEvent.description}
                      onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]/50"
                      rows="3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-secondary)]">Type</label>
                    <select
                      value={newEvent.type}
                      onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]/50"
                    >
                      <option value="appointment">Appointment</option>
                      <option value="birthday">Birthday</option>
                      <option value="anniversary">Anniversary</option>
                      <option value="holiday">Holiday</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowEventForm(false)}
                    className="px-4 py-2 border border-gray-200 rounded-md text-[var(--color-secondary)] hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-md hover:bg-[var(--color-primary)]/90 transition-colors"
                  >
                    Add Event
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

export default Calendar; 