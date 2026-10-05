import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PortalLayout() {
  const { usuario, logout } = useAuth();
  const [saindo, setSaindo] = useState(false);

  async function sair() {
    setSaindo(true);

    try {
      await logout();
    } catch {
      window.alert(
        'Você saiu neste navegador, mas não foi possível confirmar '
        + 'o encerramento no servidor.',
      );
    } finally {
      setSaindo(false);
    }
  }

  return (
    <div className="portal-shell">
      <header className="portal-header">
        <NavLink className="brand" to="/">Portal de Solicitações</NavLink>

        <div className="header-user">
          <span>{usuario.name}</span>
          <button
            className="button secondary"
            onClick={sair}
            disabled={saindo}
          >
            {saindo ? 'Saindo…' : 'Sair'}
          </button>
        </div>
      </header>

      <nav className="portal-nav" aria-label="Navegação principal">
        <NavLink to="/" end>Dashboard</NavLink>
        <NavLink to="/solicitacoes" end>Solicitações</NavLink>
        <NavLink to="/solicitacoes/nova">Nova solicitação</NavLink>
      </nav>

      <Outlet />
    </div>
  );
}