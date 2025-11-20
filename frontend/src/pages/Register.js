// frontend/src/pages/Register.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import AuthFormWrapper from '../components/auth/AuthFormWrapper';
import FormInput from '../components/auth/FormInput';
import PasswordInput from '../components/auth/PasswordInput';
import AuthButton from '../components/auth/AuthButton';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { name, email, password } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.register(name, email, password);
      alert('Registration successful! Redirecting to login...');
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error.response?.data);
      alert('Registration failed: ' + (error.response?.data?.msg || 'Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthFormWrapper
      title="Sign Up"
      subtitle="Create your account to get started"
      icon={
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
          />
        </svg>
      }
    >
      <form onSubmit={onSubmit} className="space-y-5">
        {/* Name */}
        <FormInput
          label="Full Name"
          type="text"
          name="name"
          value={name}
          onChange={onChange}
          placeholder="eg. Jay Indrapal Patil"
          required
          icon={
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          }
        />

        {/* Email */}
        <FormInput
          label="Email Address"
          type="email"
          name="email"
          value={email}
          onChange={onChange}
          placeholder="eg. thisisjaypatil@gmail.com"
          required
          icon={
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          }
        />

        {/* Password */}
        <PasswordInput
          label="Password"
          name="password"
          value={password}
          onChange={onChange}
          placeholder="Enter your password"
          required
          autoComplete="new-password"
        />

        {/* Submit */}
        <AuthButton loading={loading} loadingText="Creating account...">
          Create Account
        </AuthButton>
      </form>

      {/* Redirect to login */}
      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <button
          type="button"
          onClick={() => navigate('/login')}
          className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors"
        >
          Sign in
        </button>
      </p>
    </AuthFormWrapper>
  );
};

export default Register;
