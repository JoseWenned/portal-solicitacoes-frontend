import { useEffect, useSyncExternalStore } from 'react';
import { session } from '../../infrastructure/auth/session';
import { AuthContext } from './AuthContext';

export function AuthProvider({ children }) {
  const state = useSyncExternalStore(
    session.subscribe,
    session.getSnapshot,
  );

  useEffect(() => {
    session.restaurar();
  }, []);

  const value = {
    ...state,
    login: (dados) => session.login(dados),
    cadastrar: (dados) => session.cadastrar(dados),
    logout: () => session.logout(),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}