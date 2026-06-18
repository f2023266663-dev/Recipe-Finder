import React, { useState, useEffect } from 'react';
import { loginUser, registerUser } from '../api';
import { useAuth } from '../context/AuthContext';

const AuthModal = ({ isOpen, onClose, initialTab = 'login' }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [regError, setRegError] = useState('');
  const [loading, setLoading] = useState(false);
  const { refreshUser } = useAuth();

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('stop-scrolling');
    } else {
      document.body.classList.remove('stop-scrolling');
    }
    return () => document.body.classList.remove('stop-scrolling');
  }, [isOpen]);

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log('🔑 Login button clicked!');  // ← ADD THIS
    setLoading(true);
    setLoginError('');
    
    try {
      console.log('📤 Attempting login with:', loginEmail);
      const data = await loginUser(loginEmail, loginPassword);
      console.log('📥 Login response:', data);
      
      if (data.success) {
        localStorage.setItem('recipeRunToken', data.token);
        localStorage.setItem('recipeRunSession', data.user.email);
        setLoginEmail('');
        setLoginPassword('');
        await refreshUser();
        onClose();
      } else {
        setLoginError(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      setLoginError(error.message || 'Login failed. Please try again.');
    }
    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    console.log('📝 Register button clicked!');  // ← ADD THIS
    setLoading(true);
    setRegError('');
    
    try {
      console.log('📤 Attempting registration with:', regEmail);
      const data = await registerUser(regName, regEmail, regPassword);
      console.log('📥 Registration response:', data);
      
      if (data.success) {
        localStorage.setItem('recipeRunToken', data.token);
        localStorage.setItem('recipeRunSession', data.user.email);
        setRegName('');
        setRegEmail('');
        setRegPassword('');
        await refreshUser();
        onClose();
      } else {
        setRegError(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('❌ Registration error:', error);
      setRegError(error.message || 'Registration failed. Please try again.');
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div id="auth-modal" className="modal auth-modal" style={{ display: 'flex' }}>
      <div className="modal-content auth-content">
        <span className="close-btn" onClick={onClose}>&times;</span>
        
        <div className="auth-header">
          <h2>Welcome to RecipeRun</h2>
          <p>Sign in to save your favorite recipes</p>
        </div>

        <div className="auth-tabs">
          <button 
            className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`} 
            onClick={() => setActiveTab('login')}
          >
            Log In
          </button>
          <button 
            className={`auth-tab ${activeTab === 'signup' ? 'active' : ''}`} 
            onClick={() => setActiveTab('signup')}
          >
            Sign Up
          </button>
        </div>

        {activeTab === 'login' ? (
          <form onSubmit={handleLogin} className="auth-form">
            <div className="auth-field">
              <i className="fas fa-envelope"></i>
              <input 
                type="email" 
                placeholder="Email Address" 
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required 
                disabled={loading}
              />
            </div>
            <div className="auth-field">
              <i className="fas fa-lock"></i>
              <input 
                type="password" 
                placeholder="Password" 
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required 
                disabled={loading}
              />
            </div>
            {loginError && <div className="auth-error">{loginError}</div>}
            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? 'Logging in...' : 'Log In'}
              {!loading && <i className="fas fa-arrow-right"></i>}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="auth-form">
            <div className="auth-field">
              <i className="fas fa-user"></i>
              <input 
                type="text" 
                placeholder="Full Name" 
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                required 
                disabled={loading}
              />
            </div>
            <div className="auth-field">
              <i className="fas fa-envelope"></i>
              <input 
                type="email" 
                placeholder="Email Address" 
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                required 
                disabled={loading}
              />
            </div>
            <div className="auth-field">
              <i className="fas fa-lock"></i>
              <input 
                type="password" 
                placeholder="Password (min 6 characters)" 
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                minLength="6"
                required 
                disabled={loading}
              />
            </div>
            {regError && <div className="auth-error">{regError}</div>}
            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
              {!loading && <i className="fas fa-user-plus"></i>}
            </button>
          </form>
        )}

        <div className="auth-footer">
          <p>By continuing, you agree to our Terms of Service and Privacy Policy</p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;