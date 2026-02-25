import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

const extractUserFromToken = (accessToken) => {
  const decoded = jwtDecode(accessToken);
  const id = parseInt(
    decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']
    || decoded.nameid
    || decoded.sub
  );
  const emailFromToken =
    decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress']
    || decoded.email;
  const nameFromToken =
    decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name']
    || decoded.unique_name
    || decoded.name;
  const role =
    decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
    || decoded.role;

  // Koristimo localStorage vrednosti ako postoje (korisnik je promenio podatke)
  const name = localStorage.getItem('userName') || nameFromToken;
  const email = localStorage.getItem('userEmail') || emailFromToken;

  return { id, email, name, role, accessToken };
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      try {
        const userData = extractUserFromToken(accessToken);
        setUser(userData);
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
      }
    }
    setLoading(false);
  }, []);

  const login = (authResponse) => {
    localStorage.setItem('accessToken', authResponse.accessToken);
    localStorage.setItem('refreshToken', authResponse.refreshToken);
    try {
      const userData = extractUserFromToken(authResponse.accessToken);
      // Čuvamo ime i email u localStorage
      localStorage.setItem('userName', userData.name);
      localStorage.setItem('userEmail', userData.email);
      setUser(userData);
    } catch (error) {
      console.error('Error decoding token on login:', error);
    }
  };

  const updateUser = (updatedFields) => {
    setUser(prev => {
      const updated = { ...prev, ...updatedFields };
      // Ažuriramo localStorage da preživi page reload
      if (updatedFields.name) localStorage.setItem('userName', updatedFields.name);
      if (updatedFields.email) localStorage.setItem('userEmail', updatedFields.email);
      return updated;
    });
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, updateUser }}>
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