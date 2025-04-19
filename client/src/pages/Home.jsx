import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Home = () => {
  const [currentDot, setCurrentDot] = useState(0);

  const heroContent = [
    {
      title: "Connect. Coordinate. Care.",
      description: "Your family's care coordination platform. With FamilyBridge, you control what information to share across generations and coordinate care seamlessly."
    },
    {
      title: "Seamless Care Management",
      description: "Track medications, appointments, and daily tasks in one place. Keep everyone in the loop with real-time updates and reminders."
    },
    {
      title: "Stay Connected",
      description: "Bridge the gap between family members and caregivers. Share updates, coordinate schedules, and make decisions together."
    },
    {
      title: "Health & Wellness Tracking",
      description: "Monitor health metrics, track symptoms, and share reports with healthcare providers. Keep your loved ones healthy and informed."
    },
    {
      title: "Peace of Mind",
      description: "Rest easy knowing that your family's care is organized and accessible. FamilyBridge helps you focus on what matters most - your loved ones."
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDot((prev) => (prev + 1) % heroContent.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const platformIcons = [
    { icon: '🏥', color: '#4CAF50', path: '/health', label: 'Health' },
    { icon: '📅', color: '#2196F3', path: '/calendar', label: 'Calendar' },
    { icon: '💊', color: '#FF9800', path: '/tasks', label: 'Tasks' },
    { icon: '💬', color: '#9C27B0', path: '/communication', label: 'Chat' }
  ];

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Navbar */}
        <nav className="flex justify-between items-center pb-6 border-b border-[var(--color-background-alt)]">
          <Link to="/" className="flex items-center gap-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 12H18M6 12C6 15.3137 8.68629 18 12 18M6 12C6 8.68629 8.68629 6 12 6M18 12C18 15.3137 15.3137 18 12 18M18 12C18 8.68629 15.3137 6 12 6M12 6C13.6569 6 15 4.65685 15 3M12 6C10.3431 6 9 4.65685 9 3M12 18C13.6569 18 15 19.3431 15 21M12 18C10.3431 18 9 19.3431 9 21" stroke="var(--color-secondary)" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span className="font-semibold text-lg text-[var(--color-secondary)]">familybridge</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/signup" className="btn-primary">
              Sign up
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <motion.div 
          className="text-center py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            key={currentDot}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-5xl font-semibold text-[var(--color-secondary)] mb-4 tracking-tight"
          >
            {heroContent[currentDot].title}
          </motion.h1>
          
          <motion.p
            key={`desc-${currentDot}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg text-[var(--color-secondary)]/70 max-w-2xl mx-auto mb-8"
          >
            {heroContent[currentDot].description}
          </motion.p>

          {/* Progress Dots */}
          <div className="flex justify-center gap-2">
            {heroContent.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentDot(index)}
                className={`w-2 h-2 rounded-full ${currentDot === index ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-background-alt)]'}`}
                animate={{
                  scale: currentDot === index ? 1.2 : 1,
                  backgroundColor: currentDot === index ? 'var(--color-primary)' : 'var(--color-background-alt)'
                }}
                transition={{ duration: 0.3 }}
              />
            ))}
          </div>
        </motion.div>

        {/* Cards Section */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {/* Tasks Card */}
          <motion.div 
            className="card"
            whileHover={{ y: -5 }}
          >
            <h3 className="text-[var(--color-secondary)] font-medium mb-5">Your tasks</h3>
            <motion.div 
              className="text-5xl font-bold text-[var(--color-primary)] mb-1"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              15
            </motion.div>
            <p className="text-[var(--color-secondary)]/70 text-sm mb-6">Tasks pending this week</p>
            <div className="h-24">
              <svg viewBox="0 0 300 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <path 
                  d="M0,80 C30,70 60,90 90,85 C120,80 150,40 180,50 C210,60 240,30 270,10" 
                  stroke="var(--color-background-alt)" 
                  strokeWidth="2" 
                  fill="none"
                />
                <path 
                  d="M0,80 C30,70 60,90 90,85 C120,80 150,40 180,50 C210,60 240,30 270,10" 
                  stroke="var(--color-primary)" 
                  strokeWidth="2" 
                  fill="none"
                  className="animate-draw"
                />
              </svg>
            </div>
          </motion.div>

          {/* Connect Caregivers Card */}
          <motion.div 
            className="card"
            whileHover={{ y: -5 }}
          >
            <h3 className="text-[var(--color-secondary)] font-medium mb-5">Connect caregivers</h3>
            <div className="flex flex-wrap gap-4 mb-6">
              {platformIcons.map((platform, index) => (
                <Link 
                  key={index}
                  to={platform.path}
                  className="block"
                >
                  <motion.div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-2xl cursor-pointer"
                    style={{ backgroundColor: `var(--color-${index === 0 ? 'primary' : index === 1 ? 'secondary' : index === 2 ? 'accent-1' : 'accent-2'})` }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    title={platform.label}
                  >
                    {platform.icon}
                  </motion.div>
                </Link>
              ))}
            </div>
            <Link 
              to="/dashboard"
              className="btn-primary flex items-center justify-center gap-2"
            >
              <span>Get Started</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.91003 19.9201L15.43 13.4001C16.2 12.6301 16.2 11.3701 15.43 10.6001L8.91003 4.08008" stroke="currentColor" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </motion.div>

          {/* Insights Card */}
          <motion.div 
            className="card"
            whileHover={{ y: -5 }}
          >
            <div className="mb-6">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="#1E293B" strokeWidth="1.5"/>
                <path d="M12 8V12L14 14" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            
            <div className="space-y-3 mb-6">
              {[
                "When is Mom's next doctor appointment?",
                "Who's picking up Dad's medication this week?",
                "Has Sarah finished her homework?"
              ].map((question, index) => (
                <motion.div
                  key={index}
                  className="bg-neutral-50 p-3 rounded-lg text-sm"
                  whileHover={{ scale: 1.02, boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
                >
                  {question}
                </motion.div>
              ))}
            </div>
            
            <Link 
              to="/dashboard"
              className="bg-neutral-50 p-3 rounded-lg flex justify-between items-center cursor-pointer hover:bg-neutral-100 transition-colors"
            >
              <span className="text-sm font-medium">Coordinate care with your family members</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.91003 19.9201L15.43 13.4001C16.2 12.6301 16.2 11.3701 15.43 10.6001L8.91003 4.08008" stroke="#1E293B" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home; 