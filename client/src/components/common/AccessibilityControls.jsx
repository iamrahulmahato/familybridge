import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const AccessibilityControls = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [textSize, setTextSize] = useState('normal');
  const [contrast, setContrast] = useState('normal');
  const [reduceMotion, setReduceMotion] = useState(false);
  const [voiceControl, setVoiceControl] = useState(false);
  
  useEffect(() => {
    // Text size
    document.documentElement.classList.remove('text-normal', 'text-large', 'text-x-large');
    document.documentElement.classList.add(`text-${textSize}`);
    
    // Contrast
    document.documentElement.classList.remove('contrast-normal', 'contrast-high');
    document.documentElement.classList.add(`contrast-${contrast}`);
    
    // Motion
    if (reduceMotion) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
    
    // Voice control would integrate with a separate voice control system
    if (voiceControl) {
      console.log('Voice control enabled');
    } else {
      console.log('Voice control disabled');
    }
  }, [textSize, contrast, reduceMotion, voiceControl]);
  
  return (
    <div className="fixed bottom-5 right-5 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 bg-primary-600 hover:bg-primary-700 text-white rounded-full flex items-center justify-center shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        aria-label="Accessibility options"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
        </svg>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute bottom-16 right-0 bg-white rounded-lg shadow-xl p-4 w-72"
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="font-bold text-lg mb-3">Accessibility Options</h3>
            
            <div className="space-y-4">
              {/* Text Size */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Text Size
                </label>
                <div className="flex rounded-md shadow-sm">
                  <button
                    onClick={() => setTextSize('normal')}
                    className={`px-3 py-2 text-sm font-medium flex-1 ${
                      textSize === 'normal'
                        ? 'bg-primary-600 text-white'
                        : 'bg-white text-neutral-700 hover:bg-neutral-50'
                    } border border-neutral-300 rounded-l-md`}
                  >
                    Normal
                  </button>
                  <button
                    onClick={() => setTextSize('large')}
                    className={`px-3 py-2 text-sm font-medium flex-1 ${
                      textSize === 'large'
                        ? 'bg-primary-600 text-white'
                        : 'bg-white text-neutral-700 hover:bg-neutral-50'
                    } border-t border-b border-neutral-300`}
                  >
                    Large
                  </button>
                  <button
                    onClick={() => setTextSize('x-large')}
                    className={`px-3 py-2 text-sm font-medium flex-1 ${
                      textSize === 'x-large'
                        ? 'bg-primary-600 text-white'
                        : 'bg-white text-neutral-700 hover:bg-neutral-50'
                    } border border-neutral-300 rounded-r-md`}
                  >
                    X-Large
                  </button>
                </div>
              </div>
              
              {/* Contrast */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Contrast
                </label>
                <div className="flex rounded-md shadow-sm">
                  <button
                    onClick={() => setContrast('normal')}
                    className={`px-3 py-2 text-sm font-medium flex-1 ${
                      contrast === 'normal'
                        ? 'bg-primary-600 text-white'
                        : 'bg-white text-neutral-700 hover:bg-neutral-50'
                    } border border-neutral-300 rounded-l-md`}
                  >
                    Normal
                  </button>
                  <button
                    onClick={() => setContrast('high')}
                    className={`px-3 py-2 text-sm font-medium flex-1 ${
                      contrast === 'high'
                        ? 'bg-primary-600 text-white'
                        : 'bg-white text-neutral-700 hover:bg-neutral-50'
                    } border border-neutral-300 rounded-r-md`}
                  >
                    High Contrast
                  </button>
                </div>
              </div>
              
              {/* Reduce Motion */}
              <div className="flex items-center">
                <input
                  id="reduce-motion"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 border-neutral-300 rounded"
                  checked={reduceMotion}
                  onChange={() => setReduceMotion(!reduceMotion)}
                />
                <label htmlFor="reduce-motion" className="ml-2 block text-sm text-neutral-700">
                  Reduce animations
                </label>
              </div>
              
              {/* Voice Control */}
              <div className="flex items-center">
                <input
                  id="voice-control"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 border-neutral-300 rounded"
                  checked={voiceControl}
                  onChange={() => setVoiceControl(!voiceControl)}
                />
                <label htmlFor="voice-control" className="ml-2 block text-sm text-neutral-700">
                  Enable voice commands
                </label>
              </div>
            </div>
            
            <div className="mt-4 pt-3 border-t border-neutral-200">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-medium py-2 rounded"
              >
                Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}; 