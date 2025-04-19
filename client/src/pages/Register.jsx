import React from 'react';
import { Link } from 'react-router-dom';
import GoogleAuth from '../components/auth/GoogleAuth';

const Register = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)]">
      <div className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-8">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 12H18M6 12C6 15.3137 8.68629 18 12 18M6 12C6 8.68629 8.68629 6 12 6M18 12C18 15.3137 15.3137 18 12 18M18 12C18 8.68629 15.3137 6 12 6M12 6C13.6569 6 15 4.65685 15 3M12 6C10.3431 6 9 4.65685 9 3M12 18C13.6569 18 15 19.3431 15 21M12 18C10.3431 18 9 19.3431 9 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span className="text-2xl font-semibold text-[var(--color-secondary)]">familybridge</span>
          </Link>
          <h2 className="text-3xl font-semibold text-[var(--color-secondary)] mb-2">Create an account</h2>
          <p className="text-gray-600">Join FamilyBridge to start coordinating care</p>
        </div>

        <div className="space-y-4">
          <GoogleAuth />
          
          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-[var(--color-primary)] hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register; 