import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      try {
        const decoded = jwtDecode(accessToken);
        setUser({
          id: parseInt(decoded.nameid || decoded.sub), // userId from JWT
          email: decoded.email,
          name: decoded.unique_name || decoded.name,
          role: decoded.role, // "User" or "Craftsman"
          accessToken: accessToken
        });
      } catch (error) {
        console.error('Invalid token:', error);
        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = (authResponse) => {
    // Store tokens
    localStorage.setItem('accessToken', authResponse.accessToken);
    localStorage.setItem('refreshToken', authResponse.refreshToken);
    
    // Decode and set user
    const decoded = jwtDecode(authResponse.accessToken);
    setUser({
      id: authResponse.userId,
      email: authResponse.email,
      name: authResponse.fullName,
      role: authResponse.role,
      accessToken: authResponse.accessToken
    });
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}