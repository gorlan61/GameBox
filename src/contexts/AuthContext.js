import { createContext, useContext } from 'react';
import { useAuth } from '../hooks/useAuth';

// ─────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────
const AuthContext = createContext(null);

// ─────────────────────────────────────────────
// Provider — App'in kökünde bir kez sarılır
// ─────────────────────────────────────────────
export function AuthProvider({ children }) {
  const auth = useAuth();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}

// ─────────────────────────────────────────────
// Hook — herhangi bir screen/component içinde kullanılır
// ─────────────────────────────────────────────
export function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuthContext, bir <AuthProvider> içinde kullanılmalıdır.\n' +
      'App.js\'te <AuthProvider> ile sarmayı unutmayın.'
    );
  }

  return context;
}
