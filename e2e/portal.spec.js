import { randomUUID } from 'node:crypto';
import { test, expect } from '@playwright/test';

test('fluxo integrado de autenticação e solicitações', async ({ page }) => {
  const email = `e2e-${randomUUID()}@example.com`;
  const titulo = `Acesso ${randomUUID().slice(0, 8)}`;
  const tituloEditado = `${titulo} atualizado`;

  await page.goto('/cadastro');

  await expect(
    page.getByRole('heading', { name: 'Crie sua conta', exact: true }),
  ).toBeVisible();

  await page.getByLabel('Nome', { exact: true }).fill('Ana Teste');
  await page.getByLabel('E-mail', { exact: true }).fill(email);
  await page.getByLabel('Senha', { exact: true }).fill('Teste12345!');
  await page.getByRole('button', { name: 'Criar conta' }).click();

  await expect(page.getByRole('status')).toHaveText(
    'Cadastro realizado. Agora entre com seu e-mail e senha.',
  );

  await page.getByRole('link', {
    name: 'Entrar',
    exact: true,
  }).click();

  await expect(page).toHaveURL(/\/login$/);

  await expect(
    page.getByRole('heading', {
      name: 'Bem-vindo de volta',
      exact: true,
    }),
  ).toBeVisible();

  const emailInput = page.getByLabel('E-mail', { exact: true });
  const senhaInput = page.getByLabel('Senha', { exact: true });

  await emailInput.fill(email);
  await senhaInput.fill('Teste12345!');

  await expect(emailInput).toHaveValue(email);
  await expect(senhaInput).toHaveValue('Teste12345!');

  const loginResponsePromise = page.waitForResponse((response) =>
    response.url().endsWith('/api/v1/auth/login')
    && response.request().method() === 'POST',
  );

  await page.getByRole('button', {
    name: 'Entrar',
    exact: true,
  }).click();

  const loginResponse = await loginResponsePromise;

  expect(
    loginResponse.status(),
    'O endpoint de login deve retornar HTTP 200.',
  ).toBe(200);

  await expect(
    page.getByRole('heading', { name: 'Olá, Ana Teste!' }),
  ).toBeVisible();

  await page.reload();

  await expect(
    page.getByRole('heading', { name: 'Olá, Ana Teste!' }),
  ).toBeVisible();

  const navegacao = page.getByRole('navigation', {
    name: 'Navegação principal',
  });

  await navegacao.getByRole('link', {
    name: 'Nova solicitação',
  }).click();

  await expect(
    page.getByRole('heading', {
      name: 'Nova solicitação',
      exact: true,
    }),
  ).toBeVisible();

  await page.getByLabel('Título', { exact: true }).fill(titulo);
  await page.getByLabel('Categoria', { exact: true }).selectOption('TI');
  await page.getByLabel('Descrição', { exact: true }).fill(
    'Preciso de acesso ao sistema interno.',
  );
  await page.getByRole('button', {
    name: 'Salvar solicitação',
  }).click();

  await expect(
    page.getByRole('heading', { name: titulo, exact: true }),
  ).toBeVisible();

  await page.getByRole('link', {
    name: 'Editar',
    exact: true,
  }).click();

  await expect(
    page.getByRole('heading', {
      name: 'Editar solicitação',
      exact: true,
    }),
  ).toBeVisible();

  const tituloInput = page.getByLabel('Título', { exact: true });

  await expect(tituloInput).toHaveValue(titulo);
  await tituloInput.fill(tituloEditado);

  await page.getByRole('button', {
    name: 'Salvar solicitação',
  }).click();

  await expect(
    page.getByRole('heading', { name: tituloEditado, exact: true }),
  ).toBeVisible();

  await navegacao.getByRole('link', {
    name: 'Solicitações',
    exact: true,
  }).click();

  await expect(page).toHaveURL(/\/solicitacoes$/);

  await expect(
    page.getByRole('heading', {
      name: 'Solicitações',
      exact: true,
    }),
  ).toBeVisible();

  await expect(
    page.getByRole('button', { name: 'Filtrar', exact: true }),
  ).toBeEnabled();

  await page.getByLabel('Título', { exact: true }).fill(tituloEditado);
  await page.getByLabel('Categoria', { exact: true }).selectOption('TI');
  await page.getByLabel('Status', { exact: true }).selectOption('ABERTO');

  const listagemResponsePromise = page.waitForResponse((response) => {
    const url = new URL(response.url());

    return url.pathname === '/api/v1/solicitacoes'
      && url.searchParams.get('titulo') === tituloEditado
      && url.searchParams.get('categoria') === 'TI'
      && url.searchParams.get('status') === 'ABERTO'
      && response.request().method() === 'GET';
  });

  await page.getByRole('button', {
    name: 'Filtrar',
    exact: true,
  }).click();

  const listagemResponse = await listagemResponsePromise;
  expect(listagemResponse.status()).toBe(200);

  await expect(
    page.getByRole('button', { name: 'Filtrar', exact: true }),
  ).toBeEnabled();

  await expect(
    page.getByRole('cell', { name: tituloEditado, exact: true }),
  ).toBeVisible();

  await page.getByRole('link', {
    name: 'Detalhes',
    exact: true,
  }).click();

  await expect(
    page.getByRole('heading', { name: tituloEditado, exact: true }),
  ).toBeVisible();

  page.once('dialog', (dialog) => dialog.accept());

  await page.getByRole('button', {
    name: 'Avançar para em atendimento',
    exact: true,
  }).click();

  await expect(
    page.getByRole('button', {
      name: 'Avançar para concluído',
      exact: true,
    }),
  ).toBeEnabled();

  await expect(
    page.getByRole('link', { name: 'Editar', exact: true }),
  ).toHaveCount(0);

  await expect(
    page.getByRole('button', { name: 'Excluir', exact: true }),
  ).toHaveCount(0);

  page.once('dialog', (dialog) => dialog.accept());

  await page.getByRole('button', {
    name: 'Avançar para concluído',
    exact: true,
  }).click();

  await expect(page.locator('.badge')).toHaveText('Concluído');

  await navegacao.getByRole('link', {
    name: 'Nova solicitação',
  }).click();

  await expect(
    page.getByRole('heading', {
      name: 'Nova solicitação',
      exact: true,
    }),
  ).toBeVisible();

  await page.getByLabel('Título', { exact: true }).fill(
    'Demanda descartável',
  );
  await page.getByLabel('Categoria', { exact: true }).selectOption('RH');
  await page.getByLabel('Descrição', { exact: true }).fill(
    'Solicitação criada para verificar exclusão.',
  );
  await page.getByRole('button', {
    name: 'Salvar solicitação',
  }).click();

  await expect(
    page.getByRole('heading', {
      name: 'Demanda descartável',
      exact: true,
    }),
  ).toBeVisible();

  page.once('dialog', (dialog) => dialog.accept());

  await page.getByRole('button', {
    name: 'Excluir',
    exact: true,
  }).click();

  await expect(page).toHaveURL(/\/solicitacoes$/);

  await navegacao.getByRole('link', {
    name: 'Dashboard',
    exact: true,
  }).click();

  await expect(page.locator('.metric-card.total strong')).toHaveText('1');
  await expect(page.locator('.metric-card.aberto strong')).toHaveText('0');
  await expect(page.locator('.metric-card.atendimento strong')).toHaveText('0');
  await expect(page.locator('.metric-card.concluido strong')).toHaveText('1');

  await page.getByRole('button', {
    name: 'Sair',
    exact: true,
  }).click();

  await expect(page).toHaveURL(/\/login$/);

  await expect(
    page.getByRole('heading', {
      name: 'Bem-vindo de volta',
      exact: true,
    }),
  ).toBeVisible();

  await page.reload();

  await expect(
    page.getByRole('button', { name: 'Entrar', exact: true }),
  ).toBeVisible();
});