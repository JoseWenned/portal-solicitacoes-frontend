import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function HomePage() {
  const { usuario, logout } = useAuth();
  const [saindo, setSaindo] = useState(false);

  async function sair() {
    setSaindo(true);

    try {
      await logout();
    } catch {
      window.alert(
        'Você saiu neste navegador, mas não foi possível confirmar '
        + 'o encerramento no servidor. Verifique sua conexão.',
      );
    } finally {
      setSaindo(false);
    }
  }

  return (
    <main className="portal-shell">
      <header className="portal-header">
        <span className="brand">Portal de Solicitações</span>
        <button className="button secondary" onClick={sair} disabled={saindo}>
          {saindo ? 'Saindo…' : 'Sair'}
        </button>
      </header>

      <section className="content-card">
        <span className="eyebrow">Sua área</span>
        <h1>Olá, {usuario.name}!</h1>
        <p>Sua sessão está ativa.</p>
        <p>
          As telas de solicitações e os indicadores serão adicionados
          no próximo bloco.
        </p>
      </section>
    </main>
  );
}