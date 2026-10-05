import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import { AuthContext } from './presentation/context/AuthContext';
import AuthPage from './presentation/pages/AuthPage';

function renderizar(cadastro = false) {
  const auth = {
    status: 'anonymous',
    usuario: null,
    login: vi.fn(),
    cadastrar: vi.fn(),
  };

  render(
    <MemoryRouter>
      <AuthContext.Provider value={auth}>
        <AuthPage cadastro={cadastro} />
      </AuthContext.Provider>
    </MemoryRouter>,
  );

  return auth;
}

describe('Formulários de autenticação', () => {
  it('impede login com e-mail inválido', async () => {
    const auth = renderizar();
    const user = userEvent.setup();

    await user.type(screen.getByLabelText('E-mail'), 'invalido');
    await user.type(screen.getByLabelText('Senha'), 'Teste12345!');
    await user.click(screen.getByRole('button', { name: 'Entrar' }));

    expect(await screen.findByText('Informe um e-mail válido.'))
      .toBeInTheDocument();
    expect(auth.login).not.toHaveBeenCalled();
  });

  it('envia o cadastro com nome e e-mail normalizados', async () => {
    const auth = renderizar(true);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText('Nome'), '  Ana  ');
    await user.type(screen.getByLabelText('E-mail'), 'ANA@example.com');
    await user.type(screen.getByLabelText('Senha'), 'Teste12345!');
    await user.click(screen.getByRole('button', { name: 'Criar conta' }));

    expect(auth.cadastrar).toHaveBeenCalledWith({
      name: 'Ana',
      email: 'ana@example.com',
      password: 'Teste12345!',
    });

    expect(
      await screen.findByText(
        'Cadastro realizado. Agora entre com seu e-mail e senha.',
      ),
    ).toBeInTheDocument();
  });
});