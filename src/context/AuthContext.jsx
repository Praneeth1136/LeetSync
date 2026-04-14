import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';

const setCookie = (name, value, days) => {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "")  + expires + "; path=/";
};

const getCookie = (name) => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for(let i=0;i < ca.length;i++) {
    let c = ca[i];
    while (c.charAt(0)==' ') c = c.substring(1,c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
};

const eraseCookie = (name) => {   
  document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = getCookie('username');
    const savedEmail = getCookie('email');
    return savedUser ? { username: savedUser, email: savedEmail || '' } : null;
  });
  const [token, setToken] = useState(getCookie('token') || null);
  const [progress, setProgress] = useState([]);

  useEffect(() => {
    if (token) {
      fetchProgress();
    }
  }, [token]);

  useEffect(() => {
    const handleUnauthorized = () => {
      logout();
    };
    window.addEventListener('unauthorized', handleUnauthorized);
    return () => window.removeEventListener('unauthorized', handleUnauthorized);
  }, []);

  const fetchProgress = async () => {
    try {
      const res = await api.get('/progress');
      setProgress(res.data);
    } catch (error) {
      console.error('Failed to fetch progress', error);
    }
  };

  const login = async (username, password) => {
    try {
      const res = await api.post('/auth/login', { username, password });
      const data = res.data;
      setToken(data.token);
      setUser({ username: data.username, email: data.email });
      setCookie('token', data.token, 7);
      setCookie('username', data.username, 7);
      setCookie('email', data.email || '', 7);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const signup = async (username, password, email) => {
    try {
      const res = await api.post('/auth/signup', { username, password, email });
      const data = res.data;
      setToken(data.token);
      setUser({ username: data.username, email: data.email });
      setCookie('token', data.token, 7);
      setCookie('username', data.username, 7);
      setCookie('email', data.email || '', 7);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Signup failed' };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setProgress([]);
    eraseCookie('token');
    eraseCookie('username');
    eraseCookie('email');
  };

  const toggleQuestion = async (questionId, topic) => {
    if (!token) return;
    try {
      const res = await api.post('/progress/toggle', { questionId, topic });
      setProgress(res.data.solvedQuestions);
    } catch (error) {
      console.error('Failed to toggle question', error);
    }
  };

  const isQuestionSolved = (questionId) => {
    return progress.some(q => q.questionId === String(questionId));
  };

  return (
    <AuthContext.Provider value={{ user, token, progress, login, signup, logout, toggleQuestion, isQuestionSolved }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
