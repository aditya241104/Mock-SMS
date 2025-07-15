import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';
import AuthLayout from '../components/Auth/AuthLayout';
import AuthForm from '../components/Auth/AuthForm';
import FormInput from '../components/Auth/FormInput';
import SubmitButton from '../components/Auth/SubmitButton';
import AuthLink from '../components/Auth/AuthLink';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await AuthService.login(formData);
      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome to MockSMS" subtitle="Sign in to your account">
      <AuthForm onSubmit={handleSubmit} error={error}>
        <div className="space-y-4">
          <FormInput
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            label="Email address"
          />
          
          <FormInput
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            label="Password"
          />
        </div>

        <div className="mt-6">
          <SubmitButton 
            loading={loading} 
            text="Sign in" 
            loadingText="Signing in..." 
          />
        </div>

        <AuthLink 
          text="Don't have an account?"
          linkText="Sign up here"
          to="/register"
        />
      </AuthForm>
    </AuthLayout>
  );
};

export default Login;