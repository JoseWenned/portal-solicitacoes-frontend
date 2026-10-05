import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('Estrutura inicial', () => {
  it('apresenta a identificação e a finalidade do portal', () => {
    render(<App />);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Portal de Solicitações',
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        'Registre suas demandas e acompanhe cada etapa do atendimento.',
      ),
    ).toBeInTheDocument();
  });
});