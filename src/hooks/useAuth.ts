import { useState } from 'react';
import apiService from '../services/api';

export const usePasswordReset = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const requestReset = async (email: string) => {
    try {
      setLoading(true);
      setError(null);
      await apiService.requestPasswordReset({ email });
      setSuccess(true);
    } catch (err: any) {
      console.error('Password reset request error:', err);
      setError(err.response?.data?.message || 'Failed to request password reset');
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (uidb64: string, token: string, password: string, confirmPassword: string) => {
    try {
      setLoading(true);
      setError(null);
      await apiService.resetPassword(uidb64, token, { password, confirm_password: confirmPassword });
      setSuccess(true);
    } catch (err: any) {
      console.error('Password reset error:', err);
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    success,
    requestReset,
    resetPassword
  };
};

export const useEmailVerification = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const resendVerification = async (email: string) => {
    try {
      setLoading(true);
      setError(null);
      await apiService.resendVerification({ email });
      setSuccess(true);
    } catch (err: any) {
      console.error('Resend verification error:', err);
      setError(err.response?.data?.message || 'Failed to resend verification');
    } finally {
      setLoading(false);
    }
  };

  const verifyEmail = async (uidb64: string, token: string) => {
    try {
      setLoading(true);
      setError(null);
      await apiService.verifyEmail(uidb64, token);
      setSuccess(true);
    } catch (err: any) {
      console.error('Email verification error:', err);
      setError(err.response?.data?.message || 'Failed to verify email');
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    success,
    resendVerification,
    verifyEmail
  };
};

export const useChangePassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const changePassword = async (currentPassword: string, newPassword: string, confirmPassword: string) => {
    try {
      setLoading(true);
      setError(null);
      await apiService.changePassword({
        current_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword
      });
      setSuccess(true);
    } catch (err: any) {
      console.error('Change password error:', err);
      setError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    success,
    changePassword
  };
};