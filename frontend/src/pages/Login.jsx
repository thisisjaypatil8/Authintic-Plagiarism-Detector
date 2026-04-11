import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import AuthFormWrapper from '../components/auth/AuthFormWrapper';
import FormInput from '../components/auth/FormInput';
import PasswordInput from '../components/auth/PasswordInput';
import AuthButton from '../components/auth/AuthButton';
import ErrorAlert from '../components/auth/ErrorAlert';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const { email, password } = formData;
  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authService.login(email, password);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err.response?.data || err);
      setError(err.response?.data?.msg || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthFormWrapper
      title="Log In"
      subtitle="Enter your credentials to continue"
      icon={
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      }
    >
      <ErrorAlert message={error} />

      <form onSubmit={onSubmit} className="space-y-6">
        {/* Email */}
        <FormInput
          label="Email Address"
          type="email"
          name="email"
          value={email}
          onChange={onChange}
          placeholder="you@example.com"
          required
          autoComplete="email"
          disabled={loading}
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
          placeholder="••••••••"
          required
          autoComplete="current-password"
          disabled={loading}
        />

        {/* Remember me & Forgot */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 text-[#0ABAB5] focus:ring-[#0ABAB5] border-gray-300 rounded cursor-pointer"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 cursor-pointer">
              Remember me
            </label>
          </div>
          <button
            type="button"
            className="text-sm font-medium text-[#0ABAB5] hover:text-[#099D99] transition-colors"
          >
            Forgot password?
          </button>
        </div>

        {/* Submit */}
        <AuthButton loading={loading} loadingText="Signing in...">
          Sign In
        </AuthButton>
      </form>
    </AuthFormWrapper>
  );
};

export default Login;
