import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('username');
    const savedDisplay = localStorage.getItem('displayName');
    return savedUser ? { username: savedUser, displayName: savedDisplay || savedUser } : null;
  });
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [progress, setProgress] = useState([]);

  useEffect(() => {
    if (token) {
      fetchProgress();
    }
  }, [token]);

  const fetchProgress = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/progress', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setProgress(data);
      } else {
        if (res.status === 401) {
          logout();
        }
      }
    } catch (error) {
      console.error('Failed to fetch progress', error);
    }
  };

  const login = async (username, password) => {
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    
    const data = await res.json();
    if (res.ok) {
      setToken(data.token);
      setUser({ username: data.username, displayName: data.displayName });
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.username);
      localStorage.setItem('displayName', data.displayName || data.username);
      return { success: true };
    }
    return { success: false, message: data.message };
  };

  const signup = async (username, password, displayName) => {
    const res = await fetch('http://localhost:5000/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, displayName })
    });
    
    const data = await res.json();
    if (res.ok) {
      setToken(data.token);
      setUser({ username: data.username, displayName: data.displayName });
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.username);
      localStorage.setItem('displayName', data.displayName || data.username);
      return { success: true };
    }
    return { success: false, message: data.message };
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setProgress([]);
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('displayName');
  };

  const toggleQuestion = async (questionId, topic) => {
    if (!token) return;
    try {
      const res = await fetch('http://localhost:5000/api/progress/toggle', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ questionId, topic })
      });
      if (res.ok) {
        const data = await res.json();
        setProgress(data.solvedQuestions);
      }
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
